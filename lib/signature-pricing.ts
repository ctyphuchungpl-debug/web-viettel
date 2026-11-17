// Prices transcribed from the owner's six images and organization PDF.
// No missing VAT, equipment fee, or renewal price is inferred.
export type SignatureMethod = "usb" | "hsm" | "mysign";
export type SignatureAudience = "organization" | "household" | "individual";
export type SignaturePriceItem = {
  id: string; method: SignatureMethod; audience: SignatureAudience; name: string;
  years: number; registration: "Cấp mới" | "Gia hạn" | "Theo gói"; price: number | null;
  referencePrice?: number; certificatePrice?: number; setupFee?: number;
  scope?: string; vatNote?: string; source: string; category?: "multipurpose" | "invoice";
};
export const SIGNATURE_METHOD_NAMES: Record<SignatureMethod,string> = {usb:"USB Token",hsm:"HSM",mysign:"MySign"};
export const SIGNATURE_AUDIENCE_NAMES: Record<SignatureAudience,string> = {organization:"Tổ chức",household:"Hộ kinh doanh",individual:"Cá nhân"};
const base="/assets/signature-pricing/";
export const SIGNATURE_SOURCES={organization:base+"viettel-ca-to-chuc.pdf",household:base+"chu-ky-so-ho-kinh-doanh.png",individual:base+"usb-token-ca-nhan.png",hsm:base+"hsm-to-chuc.png",mysignOrganization:base+"mysign-to-chuc.png",mysignHousehold:base+"mysign-ho-kinh-doanh.png",mysignIndividual:base+"mysign-ca-nhan.png"};
const usb=(audience:SignatureAudience,registration:"Cấp mới"|"Gia hạn",prices:number[],source:string,scope?:string):SignaturePriceItem[]=>prices.map((price,i)=>({id:`usb-${audience}-${registration==="Cấp mới"?"new":"renew"}-${i+1}y`,method:"usb",audience,name:`USB Token ${i+1} năm`,years:i+1,registration,price,source,scope}));
const mysign=(audience:SignatureAudience,code:string,prices:number[],certificates:number[],fees:number[],source:string,scope?:string):SignaturePriceItem[]=>prices.map((price,i)=>({id:`mysign-${audience}-${i+1}y`,method:"mysign",audience,name:`MYSIGN_${code}${i+1}`,years:i+1,registration:"Cấp mới",price,certificatePrice:certificates[i],setupFee:fees[i],source,scope}));
export const SIGNATURE_PLANS:SignaturePriceItem[]=[
  ...usb("organization","Cấp mới",[1792000,2691000,3052000],SIGNATURE_SOURCES.organization),
  ...usb("organization","Gia hạn",[1252000,2151000,2856000],SIGNATURE_SOURCES.organization),
  ...usb("household","Cấp mới",[1004000,1453000,1566000],SIGNATURE_SOURCES.household,"Ký BHXH, hóa đơn điện tử, Hải quan, Thuế, văn bản, file PDF…"),
  ...usb("individual","Cấp mới",[1025000,1365000,1543000],SIGNATURE_SOURCES.individual,"Phù hợp ký Kho bạc, dịch vụ công và các hệ thống hỗ trợ chữ ký số cá nhân."),
  ...usb("individual","Gia hạn",[898000,1238000,1416000],SIGNATURE_SOURCES.individual,"Thời gian gia hạn sớm được cộng dồn; tiếp tục sử dụng thiết bị hiện có nếu còn phù hợp."),
  ...[1,2,3].map(years=>({id:`hsm-multipurpose-${years}y`,method:"hsm" as const,audience:"organization" as const,name:`Server/HSM đa mục đích ${years} năm`,years,registration:"Theo gói" as const,price:null,category:"multipurpose" as const,source:SIGNATURE_SOURCES.hsm,scope:"Hóa đơn điện tử, văn phòng điện tử, bệnh án/HIS, văn bản, email, chứng khoán, ngân hàng và hệ thống tích hợp."})),
  ...[1,2,3].map((years,i)=>({id:`hsm-invoice-${years}y`,method:"hsm" as const,audience:"organization" as const,name:`Server/HSM chỉ ký HĐĐT Viettel ${years} năm`,years,registration:"Theo gói" as const,price:[864000,1520000,2100000][i],referencePrice:[864000,1620000,2268000][i],category:"invoice" as const,source:SIGNATURE_SOURCES.hsm,vatNote:"Đã gồm VAT 8%",scope:"Chỉ dùng để ký hóa đơn điện tử Viettel."})),
  ...mysign("organization","DN",[1792000,2691000,3052000],[1547000,2446000,3052000],[245000,245000,0],SIGNATURE_SOURCES.mysignOrganization),
  ...mysign("household","HKD",[893000,1325000,1570000],[648000,1080000,1570000],[245000,245000,0],SIGNATURE_SOURCES.mysignHousehold,"Ký BHXH Viettel, hóa đơn điện tử Viettel, Thuế."),
  ...mysign("individual","CN",[878000,1218000,1397000],[878000,1218000,1397000],[0,0,0],SIGNATURE_SOURCES.mysignIndividual,"Dành cho cá nhân / cá nhân thuộc tổ chức."),
];
export function formatSignaturePrice(price:number|null){return price===null?"Liên hệ báo giá":new Intl.NumberFormat("vi-VN").format(price)+"đ";}
export function signatureQuoteTitle(item:SignaturePriceItem){return `${item.name} · ${SIGNATURE_AUDIENCE_NAMES[item.audience]}${item.registration!=="Theo gói"?` · ${item.registration}`:""}`;}
export function signatureQuoteDetails(item:SignaturePriceItem){
  const lines=[`Thời gian sử dụng: ${item.years*12} tháng`];
  if(item.certificatePrice!==undefined)lines.push(`Giá chứng thư: ${formatSignaturePrice(item.certificatePrice)}`);
  if(item.setupFee!==undefined)lines.push(`Phí khởi tạo: ${item.setupFee===0?"Miễn phí":formatSignaturePrice(item.setupFee)}`);
  if(item.referencePrice!==undefined)lines.push(`Giá trong bảng: ${formatSignaturePrice(item.referencePrice)}`);
  if(item.vatNote)lines.push(item.vatNote);
  if(item.scope)lines.push(item.scope);
  return lines;
}
