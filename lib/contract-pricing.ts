// Captured via the Hợp đồng điện tử pricing dialog on the requested reference
// Site on 10/11/2026. Its footer states 05/11/2026. Inconsistent source fields
// are preserved, including VCONT_10K quantity=0 and the eKYC unit of đ/SMS.
export type ContractPriceItem={id:string;name:string;description:string;quantity:number;packageFee:number;certificationFee:number;setupFee:number;price:number;trialDays?:number;sourceNote?:string};
export const CONTRACT_PRICE_REFERENCE="https://viettel-giai-phap-so-tammi-0975005123.bluestingray.chatgpt.site/";
export const CONTRACT_ABOUT_SOURCE="https://hopdongdientu.viettel.vn/about/";
export const CONTRACT_ADDONS=["SMS Brandname nội mạng Viettel: 150đ/SMS.","eKYC: từ 1.000đ/SMS, theo đơn vị ghi trên trang tham khảo."];
export const CONTRACT_PLANS:ContractPriceItem[]=[
  {id:"vcont20",name:"vCont20",description:"Gói dùng thử 20 hợp đồng trong 30 ngày",quantity:20,packageFee:0,certificationFee:0,setupFee:0,price:0,trialDays:30},
  {id:"vcont-100",name:"VCONT_100",description:"Gói 100 hợp đồng kèm chứng thực",quantity:100,packageFee:0,certificationFee:0,setupFee:1000000,price:1913000},
  {id:"vcont-5000",name:"VCONT_5000",description:"Gói 5.000 hợp đồng kèm chứng thực",quantity:5000,packageFee:0,certificationFee:0,setupFee:1000000,price:38400000},
  {id:"vcont-500",name:"VCONT_500",description:"Gói 500 hợp đồng kèm chứng thực",quantity:500,packageFee:0,certificationFee:0,setupFee:1000000,price:5345000},
  {id:"vcont-1000",name:"VCONT_1000",description:"Gói 1.000 hợp đồng kèm chứng thực",quantity:1000,packageFee:0,certificationFee:0,setupFee:1000000,price:9250000},
  {id:"vcont-100k",name:"VCONT_100K",description:"Gói 100.000 hợp đồng kèm chứng thực",quantity:100000,packageFee:0,certificationFee:0,setupFee:1000000,price:705000000},
  {id:"vcont-10k",name:"VCONT_10K",description:"Gói 10.000 hợp đồng kèm chứng thực",quantity:0,packageFee:0,certificationFee:0,setupFee:1000000,price:73600000,sourceNote:"Cần xác nhận số lượng: trang tham khảo ghi 0 ở trường số lượng, trong khi mô tả gói là 10.000 hợp đồng."},
];
export function formatContractPrice(value:number){return new Intl.NumberFormat("vi-VN").format(value)+"đ";}
export function contractQuoteDetails(item:ContractPriceItem){const lines=[item.description,`Số lượng hợp đồng theo bảng: ${new Intl.NumberFormat("vi-VN").format(item.quantity)}`,`Phí gói: ${formatContractPrice(item.packageFee)}`,`Phí chứng thực: ${formatContractPrice(item.certificationFee)}`,`Phí khởi tạo: ${formatContractPrice(item.setupFee)}`,"Giá bán đã bao gồm VAT"];if(item.sourceNote)lines.push(item.sourceNote);return lines;}
