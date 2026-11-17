import { z } from "zod";
import { solutions, originalFaq } from "./content-source.ts";
import { TENDOO_PLANS, TENDOO_DEVICES } from "./tendoo-pricing.ts";
import { SIGNATURE_PLANS } from "./signature-pricing.ts";
import { CONTRACT_PLANS } from "./contract-pricing.ts";
import { INVOICE_PLANS } from "./invoice-pricing.ts";
import { BHXH_PLANS } from "./bhxh-pricing.ts";

export const services = ["tendoo", "chukyso", "hopdong", "hoadon", "bhxh"] as const;
export type Service = typeof services[number];
export const serviceNames = Object.fromEntries(solutions.map(item => [item.id, item.name])) as Record<Service, string>;
export const phoneDigits = (value: string) => value.replace(/[\s.()-]/g, "");
export const phoneValid = (value: string) => /^(?:0\d{9}|\+84\d{9})$/.test(phoneDigits(value));
const text = z.string().trim().min(1).max(200);
const long = z.string().trim().max(4000);
const fee = z.number().int().min(0).max(10_000_000_000);
const count = z.number().int().min(0).max(10_000_000);
const id = z.string().regex(/^[A-Za-z0-9_-]{1,80}$/);
const image = z.string().max(1000).refine(value => {
  if (/^\/assets\/[a-z\d/_.-]+$/i.test(value) && !value.includes("..")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password &&
      url.hostname.endsWith(".public.blob.vercel-storage.com") && /\.webp$/i.test(url.pathname) && !url.search && !url.hash;
  } catch { return false; }
}, "Chọn file ảnh hoặc dùng đường dẫn WebP của kho ảnh.");
const source = z.string().max(1000).refine(value => {
  if (/^\/assets\/[a-z\d/_.-]+$/i.test(value) && !value.includes("..")) return true;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; }
  catch { return false; }
});
const optionalImage = z.union([image, z.literal("")]);
const row = z.object({ id, enabled: z.boolean() });
const plan = row.extend({ name: text });
export const priceSchemas = {
  tendoo: plan.extend({ kind: z.enum(["plan","device"]), duration: text, price: fee, vatNote: text }),
  chukyso: plan.extend({
    method: z.enum(["usb","hsm","mysign"]), audience: z.enum(["organization","household","individual"]),
    years: count, registration: z.enum(["Cấp mới","Gia hạn","Theo gói"]), price: fee.nullable(),
    referencePrice: fee.optional(), certificatePrice: fee.optional(), setupFee: fee.optional(),
    scope: long.optional(), vatNote: text.optional(), source, category: z.enum(["multipurpose","invoice"]).optional()
  }).refine(item=>item.method !== "hsm" || item.category, "Chọn nhóm HSM."),
  hopdong: plan.extend({
    description: long, quantity: count, packageFee: fee, certificationFee: fee, setupFee: fee,
    price: fee, trialDays: count.optional(), sourceNote: long.optional()
  }),
  hoadon: plan.extend({
    kind: z.enum(["single","combo"]), quantity: count, price: fee, vat: z.enum(["included","unspecified"]),
    referencePrice: fee.optional(), audience: text.optional(), caAction: z.enum(["new","renew"]).optional(), caYears: z.number().int().min(1).max(10).optional()
  }).refine(item => item.kind === "single" || (item.caAction && item.caYears), "Chọn loại và số năm chữ ký số cho gói combo."),
  bhxh: plan.extend({
    group: z.enum(["10","100","1000","unlimited"]), action: z.enum(["new","renew"]), kind: z.enum(["single","combo"]),
    price: fee, referencePrice: fee.optional(), months: count, trial: z.boolean(), details: z.array(long).max(20)
  }),
};

export type VideoSource = { kind: "youtube" | "playlist" | "mp4"; value: string };
export function parseVideo(value: string): VideoSource | null {
  if (/^[\w-]{11}$/.test(value)) return { kind: "youtube", value };
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (["www.youtube.com", "youtube.com", "m.youtube.com", "www.youtube-nocookie.com", "youtube-nocookie.com", "youtu.be"].includes(url.hostname)) {
      const clip = url.hostname === "youtu.be" ? url.pathname.split("/")[1]
        : url.searchParams.get("v") ?? url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)\/?$/)?.[1];
      if (clip && /^[\w-]{11}$/.test(clip)) return { kind: "youtube", value: clip };
      const playlist = url.searchParams.get("list");
      if (playlist && /^[\w-]{10,100}$/.test(playlist)) return { kind: "playlist", value: playlist };
      return null;
    }
    return /\.mp4$/i.test(url.pathname) ? { kind: "mp4", value: url.href } : null;
  } catch { return null; }
}
const serviceChoice = z.union([z.enum(services), z.literal("")]);
const list = <T extends z.ZodType<{id:string}>>(item: T, max = 100) =>
  z.array(item).max(max).refine(items => new Set(items.map(record => record.id)).size === items.length, "Mã mục bị trùng.");
export const contentSchemas = {
  contact: z.object({
    name: text, role: text, hotline: text.refine(phoneValid, "Hotline chưa hợp lệ."), address: text,
    zalo: z.string().max(500).refine(value => /^https:\/\/zalo\.me\/[\w/-]+$/.test(value), "Nhập link https://zalo.me/…"),
    email: z.union([z.literal(""), z.string().trim().email().max(180)]),
    portrait: image, ticker: z.array(text).min(1).max(12),
  }),
  media: z.object({ banner: image, promotion: optionalImage, promotionPortrait: image, ecosystem: image,
    products: z.object({ tendoo: image, chukyso: image, hopdong: image, hoadon: image, bhxh: image }) }),
  visibility: z.object({ promotion: z.boolean(), gallery: z.boolean(), videos: z.boolean(), faq: z.boolean() }),
  gallery: list(row.extend({ title: text, image: optionalImage, service: serviceChoice })
    .refine(item => item.service || item.image, "Chọn dịch vụ hoặc tải ảnh cho mục này.")),
  videos: list(row.extend({ title: text, service: serviceChoice, link: z.string().trim().max(2000).refine(value => parseVideo(value) !== null, "Link hoặc ID video chưa hợp lệ.") })),
  faq: list(row.extend({ q: text, a: long.min(1) })),
  blocks: list(row.extend({ title: text, description: long.min(1), image: optionalImage })),
  prices: z.object({
    tendoo: list(priceSchemas.tendoo, 250), chukyso: list(priceSchemas.chukyso, 250), hopdong: list(priceSchemas.hopdong, 250),
    hoadon: list(priceSchemas.hoadon, 250), bhxh: list(priceSchemas.bhxh, 250)
  }),
};
export type ContentKey = keyof typeof contentSchemas;
export type SiteContent = { [K in ContentKey]: z.infer<(typeof contentSchemas)[K]> };
export const mediaImagePaths = ["banner","promotion","promotionPortrait","ecosystem","products.tendoo","products.chukyso","products.hopdong","products.hoadon","products.bhxh"] as const;
export type MediaImagePath = typeof mediaImagePaths[number];
export function mediaImageValue(media: SiteContent["media"], path: MediaImagePath): string {
  return path.startsWith("products.") ? media.products[path.slice(9) as Service] : media[path as keyof Omit<SiteContent["media"],"products">];
}
export function replaceMediaImage(media: SiteContent["media"], path: MediaImagePath, value: string): SiteContent["media"] {
  return path.startsWith("products.") ? { ...media, products: { ...media.products, [path.slice(9)]: value } } : { ...media, [path]: value };
}
export type PublicSite = Omit<SiteContent, "contact"> & { contact: Omit<SiteContent["contact"], "email"> };
const enable = <T,>(items:T[]) => items.map(item => ({ ...item, enabled: true }));
export const defaults: SiteContent = {
  contact: {
    name: "Phan Hà Thị Vui", role: "Chuyên viên KHDN", hotline: "0974 590 804",
    address: "Đường Độc Lập, Khu Phố Long Phước, Phường Phước Bình, TP Đồng Nai",
    zalo: "https://zalo.me/0974590804", email: "", portrait: "/assets/phan-ha-thi-vui.jpg",
    ticker: ["BÁN HÀNG THÔNG MINH","KÝ KẾT THUẬN TIỆN","HỒ SƠ GỌN GÀNG","KẾT NỐI TƯƠNG LAI"]
  },
  media: {
    banner: "/assets/banner-viettel-chuyen-doi-so.png", promotion: "",
    promotionPortrait: "/assets/phan-ha-thi-vui-tendoo.jpg", ecosystem: "/assets/viettel-he-sinh-thai-cong-nghe-do.png",
    products: Object.fromEntries(solutions.map(item => [item.id, "/assets/" + item.image])) as SiteContent["media"]["products"]
  },
  visibility: { promotion: true, gallery: true, videos: true, faq: true },
  gallery: enable(solutions.map(item => ({ id: item.id, service: item.id as Service, title: item.title, image: "" }))),
  videos: enable(solutions.map(item => ({ id: item.id, service: item.id as Service, title: item.videoTitle,
    link: item.playlist ? "https://www.youtube.com/playlist?list=" + item.playlist : item.video ?? "" }))),
  faq: enable(originalFaq.map((item, i) => ({ id: "faq-" + (i + 1), ...item, a: i === 2
    ? "Email là tùy chọn. Điền họ tên, số điện thoại và giải pháp quan tâm để chuyên viên liên hệ."
    : i === 3 ? "Khi thấy mã yêu cầu, thông tin đã được lưu. Nếu bạn nhập email, hệ thống sẽ gửi xác nhận." : item.a }))),
  blocks: [],
  prices: {
    tendoo: enable([...TENDOO_PLANS, ...TENDOO_DEVICES]), chukyso: enable(SIGNATURE_PLANS),
    hopdong: enable(CONTRACT_PLANS), hoadon: enable(INVOICE_PLANS), bhxh: enable(BHXH_PLANS),
  },
};

export function publicContent(data: SiteContent): PublicSite {
  const { email, ...contact } = data.contact;
  const active = <T extends {enabled:boolean}>(items: T[]) => items.filter(item => item.enabled);
  return {
    ...data, contact, gallery: active(data.gallery), videos: active(data.videos), faq: active(data.faq), blocks: active(data.blocks),
    prices: {
      tendoo: active(data.prices.tendoo), chukyso: active(data.prices.chukyso), hopdong: active(data.prices.hopdong),
      hoadon: active(data.prices.hoadon), bhxh: active(data.prices.bhxh),
    },
  };
}
