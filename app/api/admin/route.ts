import { cookies } from "next/headers";
import { issueSignedToken, presignUrl } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { contentSchemas, mediaImagePaths, replaceMediaImage, type ContentKey, type SiteContent } from "../../../lib/site-data";
import { readContent, sql } from "../../../server/db";
import { body, cookieName, failure, hash, HttpError, login, sameOrigin, session } from "../../../server/http";

export const dynamic = "force-dynamic";

function validate<T>(schema: z.ZodType<T>, input: unknown): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new HttpError(400, (issue.path.length ? issue.path.join(".") + " – " : "") + issue.message);
  }
  return parsed.data;
}

async function requireSession() {
  const verified = await session();
  if (!verified) throw new HttpError(401, "Vui lòng đăng nhập.");
  return verified;
}

async function saveSection(section: ContentKey, revision: number, data: unknown) {
  const [saved] = await sql()`UPDATE vui_content SET data = ${JSON.stringify(data)}::jsonb, revision = revision + 1
    WHERE section = ${section} AND revision = ${revision} RETURNING data, revision`;
  if (!saved) throw new HttpError(409, "Nội dung đã thay đổi ở phiên khác. Tải lại trang rồi thử lại.");
  return saved;
}

export async function GET(request: Request) {
  try {
    await requireSession();
    const page = new URL(request.url).searchParams.get("page");
    if (page !== null) {
      const index = validate(z.coerce.number().int().min(1).max(10000), page);
      const rows = await sql()`SELECT * FROM vui_leads ORDER BY created_at DESC, id DESC LIMIT 31 OFFSET ${(index - 1) * 30}`;
      return Response.json({ rows: rows.slice(0, 30), more: rows.length > 30 });
    }
    return Response.json(await readContent());
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const action = new URL(request.url).searchParams.get("action");
    if (action === "login") {
      const input = validate(z.object({ username: z.string().max(120), password: z.string().max(200) }), await body(request, 2048));
      await login(request, input.username.trim(), input.password);
      return Response.json({ ok: true });
    }
    const token = await requireSession();
    if (action === "logout") {
      await sql()`DELETE FROM vui_sessions WHERE token_hash = ${hash(token)}`;
      (await cookies()).delete(cookieName);
      return Response.json({ ok: true });
    }
    if (action === "image") {
      if (!process.env.BLOB_READ_WRITE_TOKEN) throw new HttpError(503, "Chưa cấu hình Vercel Blob.");
      const options = {
        pathname: "images/" + randomUUID() + ".webp", allowedContentTypes: ["image/webp"],
        maximumSizeInBytes: 3 * 1024 * 1024, validUntil: Date.now() + 120_000
      };
      try {
        const signed = await issueSignedToken({ ...options, operations: ["put"], abortSignal: AbortSignal.timeout(8000) });
        const { presignedUrl } = await presignUrl(signed, { ...options, operation: "put", access: "public", allowOverwrite: false });
        return Response.json({ url: presignedUrl });
      } catch (error) {
        console.error("Vui Blob sign", error instanceof Error ? error.name : "Error");
        throw new HttpError(502, "Không tạo được link tải ảnh. Vui lòng kiểm tra Blob.");
      }
    }
    throw new HttpError(404, "Không tìm thấy chức năng.");
  } catch (error) { return failure(error); }
}

export async function PUT(request: Request) {
  try {
    sameOrigin(request);
    await requireSession();
    const input = validate(z.object({ section: z.string(), revision: z.number().int().min(1), data: z.unknown() }), await body(request, 600_000));
    if (!Object.hasOwn(contentSchemas, input.section)) throw new HttpError(400, "Mục nội dung không hợp lệ.");
    const section = input.section as ContentKey;
    const clean = validate(contentSchemas[section] as z.ZodTypeAny, input.data);
    return Response.json(await saveSection(section, input.revision, clean));
  } catch (error) { return failure(error); }
}

export async function PATCH(request: Request) {
  try {
    sameOrigin(request);
    await requireSession();
    const action = new URL(request.url).searchParams.get("action");
    if (action === "media-image") {
      const input = validate(z.object({ path: z.enum(mediaImagePaths), value: z.string(), revision: z.number().int().min(1) }), await body(request, 4096));
      const [record] = await sql()`SELECT data FROM vui_content WHERE section = 'media' AND revision = ${input.revision}`;
      if (!record) throw new HttpError(409, "Nội dung đã thay đổi ở phiên khác. Tải lại trang rồi thử lại.");
      const clean = validate(contentSchemas.media, replaceMediaImage(record.data as SiteContent["media"], input.path, input.value));
      const saved = await saveSection("media", input.revision, clean);
      return Response.json({ value: input.value, revision: saved.revision });
    }
    if (action === "gallery-item") {
      const input = validate(z.object({ item: z.unknown(), revision: z.number().int().min(1) }), await body(request, 10_000));
      const [item] = validate(contentSchemas.gallery, [input.item]);
      const [record] = await sql()`SELECT data FROM vui_content WHERE section = 'gallery' AND revision = ${input.revision}`;
      if (!record) throw new HttpError(409, "Nội dung đã thay đổi ở phiên khác. Tải lại trang rồi thử lại.");
      const current = record.data as SiteContent["gallery"];
      const next = current.some(row => row.id === item.id)
        ? current.map(row => row.id === item.id ? item : row)
        : [...current, item];
      const clean = validate(contentSchemas.gallery, next);
      const saved = await saveSection("gallery", input.revision, clean);
      return Response.json({ item, revision: saved.revision });
    }
    const { id, status } = validate(z.object({ id: z.string().uuid(), status: z.enum(["new","contacted","closed"]) }), await body(request, 2048));
    const [lead] = await sql()`UPDATE vui_leads SET status = ${status} WHERE id = ${id} RETURNING id, status`;
    if (!lead) throw new HttpError(404, "Yêu cầu không còn tồn tại.");
    return Response.json(lead);
  } catch (error) { return failure(error); }
}
