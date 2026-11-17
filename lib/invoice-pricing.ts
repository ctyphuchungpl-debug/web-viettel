// Prices observed in the reference Site's invoice-pricing dialog on 10/11/2026.
// Its source footer states 05/11/2026. The 3,000-invoice standalone price is
// supplied by the user; no tax status, product code, or term was supplied for it.
export type InvoicePriceItem = {
  id: string;
  kind: "single" | "combo";
  name: string;
  quantity: number;
  price: number;
  referencePrice?: number;
  vat: "included" | "unspecified";
  audience?: string;
  caAction?: "new" | "renew";
  caYears?: number;
};
export const INVOICE_PRICE_REFERENCE = "https://viettel-giai-phap-so-tammi-0975005123.bluestingray.chatgpt.site/";
export const INVOICE_SINGLE_PLANS: InvoicePriceItem[] = [
  {id:"single-300",kind:"single",name:"Gói HD_300_TT78",quantity:300,price:421000,vat:"included",audience:"Doanh nghiệp"},
  {id:"single-500",kind:"single",name:"Gói HD_500_TT78",quantity:500,price:572000,vat:"included",audience:"Doanh nghiệp"},
  {id:"single-1000",kind:"single",name:"Gói HD_1K_TT78",quantity:1000,price:896000,vat:"included",audience:"Doanh nghiệp"},
  {id:"single-2000",kind:"single",name:"Gói HD_2K_TT78",quantity:2000,price:1350000,vat:"included",audience:"Doanh nghiệp"},
  {id:"single-3000",kind:"single",name:"Gói 3.000 hóa đơn",quantity:3000,price:1950000,vat:"unspecified"},
  {id:"single-5000",kind:"single",name:"Gói HD_5K_TT78",quantity:5000,price:2883000,vat:"included",audience:"Doanh nghiệp"},
  {id:"single-10000",kind:"single",name:"Gói HD_10K_TT78",quantity:10000,price:4773000,vat:"included",audience:"Doanh nghiệp"},
];
const quantities = [300,500,1000,2000,3000];
const comboGroups: {action:"new"|"renew";years:number;prices:[number,number][]}[] = [
  {action:"new",years:1,prices:[[2255000,2079000],[2409000,2222000],[2739000,2519000],[3201000,2937000],[3762000,3432000]]},
  {action:"new",years:2,prices:[[3170000,2904000],[3324000,3047000],[3654000,3344000],[4116000,3762000],[4677000,4257000]]},
  {action:"new",years:3,prices:[[3538000,3179000],[3692000,3322000],[4022000,3619000],[4484000,4037000],[5045000,4532000]]},
  {action:"renew",years:1,prices:[[1705000,1529000],[1859000,1672000],[2189000,1969000],[2651000,2387000],[3212000,2882000]]},
  {action:"renew",years:2,prices:[[2620000,2354000],[2774000,2497000],[3104000,2794000],[3566000,3212000],[4127000,3707000]]},
  {action:"renew",years:3,prices:[[3338000,3003000],[3492000,3146000],[3822000,3443000],[4284000,3861000],[4845000,4356000]]},
];
export const INVOICE_COMBO_GROUPS = comboGroups.map(group=>({
  id:`${group.action}-${group.years}`,
  title:`${group.action==="new"?"Cấp mới":"Gia hạn"} Viettel-CA ${group.years} năm + Hóa đơn điện tử`,
  plans:group.prices.map(([referencePrice,price],index):InvoicePriceItem=>({
    id:`combo-${group.action}-${group.years}-${quantities[index]}`,
    kind:"combo",
    name:`Combo ${group.action==="new"?"cấp mới":"gia hạn"} CA ${group.years} năm + ${formatInvoiceQuantity(quantities[index])} hóa đơn`,
    quantity:quantities[index],referencePrice,price,vat:"unspecified",caAction:group.action,caYears:group.years,
  })),
}));
export const INVOICE_PLANS = [...INVOICE_SINGLE_PLANS,...INVOICE_COMBO_GROUPS.flatMap(group=>group.plans)];
export function formatInvoiceQuantity(value:number){return new Intl.NumberFormat("vi-VN").format(value);}
export function formatInvoicePrice(value:number){return formatInvoiceQuantity(value)+"đ";}
export function invoiceTaxNote(item:InvoicePriceItem){return item.vat==="included"?"Đã gồm thuế":"Thuế và điều kiện áp dụng: xác nhận khi tư vấn";}
export function invoiceQuoteDetails(item:InvoicePriceItem){
  return [`${formatInvoiceQuantity(item.quantity)} hóa đơn điện tử`,...(item.caYears?[`${item.caAction==="new"?"Cấp mới":"Gia hạn"} Viettel-CA ${item.caYears} năm`]:[]),...(item.audience?[`Đối tượng: ${item.audience}`]:[]),...(item.referencePrice!==undefined?[`Giá tham khảo: ${formatInvoicePrice(item.referencePrice)}`]:[]),invoiceTaxNote(item)];
}
