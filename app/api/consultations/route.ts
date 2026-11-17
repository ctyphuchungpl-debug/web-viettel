import { after } from "next/server";
import { z } from "zod";
import { isPriceService, phoneDigits, phoneValid } from "../../../lib/site-data";
import { readContent, sql } from "../../../server/db";
import { body, failure, HttpError, limit, sameOrigin } from "../../../server/http";

export const maxDuration = 45;

const schema = z.object({
  id: z.string().uuid(), name: z.string().trim().min(2).max(180), phone: z.string().trim().max(35).refine(phoneValid),
  email: z.union([z.literal(""), z.string().trim().email().max(150)]), company: z.string().trim().max(150),
  note: z.string().trim().max(2000), products: z.array(z.string().regex(/^[A-Za-z0-9_-]{1,80}$/)).min(1).max(100),
  quotes: z.array(z.object({ service: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/), id: z.string().max(80) })).max(100),
  consent: z.literal(true), website: z.string().max(0)
});
type MailStatus = "sent" | "failed" | "unconfigured" | "skipped";
type MailResult = { status: MailStatus; id: string | null };

async function send(to: string, subject: string, text: string, key: string, replyTo?: string): Promise<MailResult> {
  if (!to || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return { status: "unconfigured", id: null };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json", "Idempotency-Key": key },
      body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [to], subject, text, reply_to: replyTo }),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) console.warn("Vui confirmation email rejected", response.status);
    const result = await response.json();
    return response.ok && typeof result.id === "string" && result.id
      ? { status: "sent", id: result.id } : { status: "failed", id: null };
  } catch { return { status: "failed", id: null }; }
}

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const parsed = schema.safeParse(await body(request, 16_000));
    if (!parsed.success) throw new HttpError(400, "Vui lòng kiểm tra họ tên, số điện thoại, email và lựa chọn tư vấn.");
    const input = parsed.data;
    if (!process.env.DATABASE_URL) throw new HttpError(503, "Biểu mẫu chưa được kết nối. Vui lòng liên hệ qua Zalo.");
    const db = sql();
    const [existing] = await db`SELECT id, phone, email FROM vui_leads WHERE id = ${input.id}`;
    if (existing) {
      if (existing.phone !== phoneDigits(input.phone) || existing.email !== input.email) throw new HttpError(409, "Thông tin của mã yêu cầu đã thay đổi. Vui lòng gửi lại.");
      return Response.json({ id: existing.id });
    }
    await limit(request, "lead", 8, 600);
    const { data } = await readContent();
    const selected = [...new Set(input.products)];
    const catalog=new Map(data.serviceCatalog.filter(item=>item.enabled).map(item=>[item.id,item]));
    if(selected.some(id=>id!=="other"&&!catalog.has(id)))throw new HttpError(409,"Dịch vụ đã thay đổi. Vui lòng tải lại trang.");
    const seen = new Set<string>();
    const snapshots = input.quotes.map(quote => {
      const item = isPriceService(quote.service) ? data.prices[quote.service].find(row => row.id === quote.id && row.enabled)
        : data.customPlans.find(row=>row.serviceId===quote.service&&row.id===quote.id&&row.enabled);
      if (!item || seen.has(quote.service) || !selected.includes(quote.service)) {
        throw new HttpError(409, "Gói đã thay đổi. Vui lòng tải lại trang và chọn lại.");
      }
      seen.add(quote.service);
      return { ...item, service: catalog.get(quote.service)!.name };
    });
    const products = selected.map(id => id === "other" ? "Cần tư vấn lựa chọn" : catalog.get(id)!.name);
    const [lead] = await db`INSERT INTO vui_leads (id, name, phone, email, company, note, products, quotes, customer_email)
      VALUES (${input.id}, ${input.name}, ${phoneDigits(input.phone)}, ${input.email}, ${input.company}, ${input.note},
        ${JSON.stringify(products)}::jsonb, ${JSON.stringify(snapshots)}::jsonb, ${input.email ? "pending" : "skipped"})
      ON CONFLICT DO NOTHING RETURNING id`;
    if (lead) {
      const quoteLines = snapshots.map(item => item.name + " · " + (item.price === null ? "Liên hệ báo giá" : item.price.toLocaleString("vi-VN") + "đ"));
      const details = [`Mã yêu cầu: ${input.id}`, `Giải pháp: ${products.join(", ")}`, ...quoteLines];
      after(async () => {
        const [owner, customer] = await Promise.all([
          send(data.contact.email, "Yêu cầu tư vấn Viettel mới", [
            ...details, `Họ tên: ${input.name}`, `Điện thoại: ${input.phone}`,
            input.email && `Email: ${input.email}`, input.company && `Đơn vị: ${input.company}`, input.note && `Nhu cầu: ${input.note}`
          ].filter(Boolean).join("\n"), "vui-owner/" + input.id, input.email || undefined),
          input.email ? send(input.email, "Xác nhận yêu cầu tư vấn Viettel",
            [`Chào ${input.name},`, "Chúng tôi đã tiếp nhận yêu cầu tư vấn của bạn.", ...details, `Hotline: ${data.contact.hotline}`].join("\n"),
            "vui-customer/" + input.id) : Promise.resolve<MailResult>({ status: "skipped", id: null })
        ]);
        try {
          await sql()`UPDATE vui_leads SET owner_email = ${owner.status}, customer_email = ${customer.status}, owner_email_id = ${owner.id}, customer_email_id = ${customer.id} WHERE id = ${input.id}`;
        } catch { console.error("Vui lead mail status update failed", input.id); }
      });
    }
    return Response.json({ id: input.id }, { status: lead ? 201 : 200 });
  } catch (error) { return failure(error); }
}
