import source from "./bhxh-pricing-source.json" with { type: "json" };

export type BhxhGroup = "10" | "100" | "1000" | "unlimited";
export type BhxhAction = "new" | "renew";
export type BhxhKind = "single" | "combo";
export type BhxhPriceItem = {
  id:string; name:string; group:BhxhGroup; action:BhxhAction; kind:BhxhKind;
  price:number; referencePrice?:number; months:number; trial:boolean; details:string[];
};
export const BHXH_GROUPS:{id:BhxhGroup;label:string;description:string}[]=[
  {id:"10",label:"10 lao động",description:"Tối đa 10 người lao động"},
  {id:"100",label:"100 lao động",description:"Tối đa 100 người lao động"},
  {id:"1000",label:"1.000 lao động",description:"Tối đa 1.000 người lao động"},
  {id:"unlimited",label:"Không giới hạn lao động",description:"Không giới hạn số người lao động"},
];
export const BHXH_PRICE_REFERENCE=source.sourceUrl;
export const BHXH_SOURCE_UPDATED=source.sourceUpdated;
export const bhxhActionLabel=(action:BhxhAction)=>action==="new"?"Cấp mới":"Gia hạn";
export const formatBhxhPrice=(price:number)=>new Intl.NumberFormat("vi-VN").format(price)+"đ";
function capacity(text:string):BhxhGroup{
  if(/không giới hạn/i.test(text))return "unlimited";
  const amount=text.replace(/[.,]/g,"").match(/\d+/)?.[0];
  if(amount==="10"||amount==="100"||amount==="1000")return amount;
  throw new Error(`Missing BHXH capacity: ${text}`);
}
function detail(details:string[],key:string){return details.find(line=>line.startsWith(key+":"))?.split(":").slice(1).join(":").trim()??"";}

// The owner removed these 24 new/renewal standalone offers. Keep source-based IDs
// stable so existing links never resolve to a different remaining offer.
const REMOVED_SINGLE_PLAN_IDS=new Set([
  "bh-single-001","bh-single-002","bh-single-003",
  "bh-single-004","bh-single-005","bh-single-006",
  "bh-single-007","bh-single-008","bh-single-009",
  "bh-single-010","bh-single-011","bh-single-012",
  "bh-single-013","bh-single-014","bh-single-015",
  "bh-single-016","bh-single-017","bh-single-018",
  "bh-single-019","bh-single-020","bh-single-021",
  "bh-single-022","bh-single-023","bh-single-024",
]);
export const BHXH_SINGLE_PLANS:BhxhPriceItem[]=source.single.map((raw,index):BhxhPriceItem=>({
  id:`bh-single-${String(index+1).padStart(3,"0")}`,name:raw.name,
  group:capacity(detail(raw.details,"Số người lao động")),
  action:detail(raw.details,"Loại đăng kí")==="Gia hạn"?"renew":"new",
  kind:"single",price:raw.price,
  months:Number(detail(raw.details,"Thời gian sử dụng").match(/\d+/)?.[0]),
  trial:/dùng thử/i.test(raw.name),details:raw.details,
})).filter(item=>!REMOVED_SINGLE_PLAN_IDS.has(item.id));
export const BHXH_COMBO_PLANS:BhxhPriceItem[]=source.combo.flatMap((group,index)=>{
  const action:BhxhAction=group.title.startsWith("Gia hạn")?"renew":"new";
  const months=Number(group.title.match(/\d+/)?.[0]);
  return group.rows.map((row,rowIndex)=>({
    id:`bh-combo-${index+1}-${rowIndex+1}`,name:`${group.title} — ${row.label}`,
    group:capacity(row.label),action,kind:"combo" as const,price:row.price,
    referencePrice:row.referencePrice,months,trial:false,
    details:[`${bhxhActionLabel(action)} Viettel-CA: ${months} tháng`,`Gói BHXH: ${row.label}`,`Giá tham khảo: ${formatBhxhPrice(row.referencePrice)}`,"Thời hạn BHXH, thuế và điều kiện combo: xác nhận khi tư vấn"],
  }));
});
export const BHXH_PLANS=[...BHXH_SINGLE_PLANS,...BHXH_COMBO_PLANS];
export function bhxhQuoteDetails(item:BhxhPriceItem){return [item.kind==="single"?"Gói đơn lẻ vBHXH":"Combo Viettel-CA + vBHXH",...item.details];}
export function bhxhRegistrationUrl(item:BhxhPriceItem){return `/?solution=bhxh&bhxh_quote=${encodeURIComponent(item.id)}#register`;}
