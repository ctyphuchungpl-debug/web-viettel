import { serviceNames, services, type Service } from "./site-data";

type Option = readonly [string, string];
export type Field = { key: string; label: string; kind?: "text"|"area"|"lines"|"number"|"check"|"select"|"image"; options?: readonly Option[]; optional?: boolean; nullable?: boolean; };
const field = (key:string,label:string,kind?:Field["kind"],options?:Field["options"]):Field => ({ key,label,kind,options });
const input = (key:string,label:string) => field(key,label);
const money = (key:string,label:string,optional=false):Field => ({key,label,kind:"number",optional});
const select = (key:string,label:string,options:readonly Option[],optional=false):Field => ({key,label,kind:"select",options,optional});
const options = (values: Record<string,string>) => Object.entries(values);
const serviceOptions: Option[] = [["","Nội dung chung"], ...services.map((id):Option=>[id,serviceNames[id]])];

export const contactFields = [
  input("name","Tên chuyên viên"),input("role","Chức danh"),input("hotline","Hotline"),field("tammiQr","Ảnh QR Tammi","image"),
  input("address","Địa chỉ"),{...input("email","Email nhận tư vấn"),optional:true},field("portrait","Ảnh đại diện","image"),
  field("ticker","Thông điệp chữ chạy (mỗi dòng một thông điệp)","lines"),
];
export const mediaFields = [
  field("banner","Banner trang chủ","image"), {...field("promotion","Ảnh minh họa khuyến mãi","image"),optional:true},
  field("promotionPortrait","Ảnh chuyên viên ở khu khuyến mãi","image"),field("ecosystem","Ảnh hệ sinh thái","image"),
];
export const visibilityFields = [
  field("promotion","Hiển thị khuyến mãi","check"),field("gallery","Hiển thị thư viện ảnh","check"),
  field("videos","Hiển thị video","check"),field("faq","Hiển thị FAQ","check"),
];
export const customPlanFields:Field[] = [input("name","Tên gói"),{...money("price","Giá (đ)"),nullable:true},input("duration","Thời hạn"),input("vatNote","Ghi chú thuế"),field("details","Chi tiết (mỗi dòng một mục)","lines")];
export const catalogFields:Field[] = [input("name","Tên dịch vụ"),input("slug","Đường dẫn trang (chữ thường, nối bằng dấu -)"),input("nav","Tên ngắn trên menu"),input("category","Nhóm dịch vụ"),field("title","Tiêu đề thẻ dịch vụ","area"),field("description","Giới thiệu ngắn","area"),field("audience","Đối tượng sử dụng","area"),field("points","Lợi ích (mỗi dòng một mục)","lines"),{...field("image","Ảnh dịch vụ","image"),optional:true},{...field("logo","Logo dịch vụ","image"),optional:true},input("detailTitle","Tiêu đề trang chi tiết"),field("detailIntro","Đoạn mở đầu trang chi tiết","area"),field("detailContent","Nội dung trang chi tiết","area")];
export const listFields = {
  gallery: [input("title","Tiêu đề"),select("service","Dịch vụ",serviceOptions),{...field("image","Ảnh dùng cho mục này","image"),optional:true}],
  videos: [input("title","Tiêu đề video"),input("link","Link hoặc ID video"),select("service","Dịch vụ",serviceOptions)],
  faq: [input("q","Câu hỏi"),field("a","Trả lời","area")],
  blocks: [input("title","Tiêu đề"),field("description","Nội dung","area"),{...field("image","Ảnh minh họa","image"),optional:true}],
};
export const priceFields: Record<Service,Field[]> = {
  tendoo: [input("name","Tên gói hoặc thiết bị"),select("kind","Nhóm",options({plan:"Gói dịch vụ",device:"Thiết bị"})),
    input("duration","Thời hạn"),money("price","Giá (đ)"),input("vatNote","Ghi chú thuế")],
  chukyso: [input("name","Tên gói"),select("method","Hình thức",options({usb:"USB Token",hsm:"HSM",mysign:"MySign"})),
    select("audience","Đối tượng",options({organization:"Tổ chức",household:"Hộ kinh doanh",individual:"Cá nhân"})),
    select("registration","Đăng ký",["Cấp mới","Gia hạn","Theo gói"].map(x=>[x,x])),
    money("years","Số năm"),{...money("price","Giá (đ)"),nullable:true},
    money("referencePrice","Giá tham khảo (đ)",true),money("certificatePrice","Giá chứng thư (đ)",true),money("setupFee","Phí khởi tạo (đ)",true),
    select("category","Nhóm HSM",options({multipurpose:"Đa mục đích",invoice:"Chỉ hóa đơn Viettel"}),true),
    {...field("scope","Phạm vi sử dụng","area"),optional:true},{...input("vatNote","Ghi chú thuế"),optional:true},input("source","Link nguồn báo giá")],
  hopdong: [input("name","Tên gói"),field("description","Mô tả","area"),money("quantity","Số hợp đồng"),money("price","Giá (đ)"),
    money("packageFee","Phí gói (đ)"),money("certificationFee","Phí chứng thực (đ)"),money("setupFee","Phí khởi tạo (đ)"),
    money("trialDays","Số ngày dùng thử",true),{...field("sourceNote","Ghi chú nguồn","area"),optional:true}],
  hoadon: [input("name","Tên gói"),select("kind","Loại gói",options({single:"Đơn lẻ",combo:"Combo Viettel-CA"})),money("quantity","Số hóa đơn"),
    money("price","Giá (đ)"),money("referencePrice","Giá tham khảo (đ)",true),select("vat","Thuế",options({included:"Đã gồm thuế",unspecified:"Xác nhận khi tư vấn"})),
    {...input("audience","Đối tượng"),optional:true},select("caAction","Loại chữ ký số trong combo",options({new:"Cấp mới",renew:"Gia hạn"}),true),money("caYears","Số năm chữ ký số",true)],
  bhxh: [input("name","Tên gói"),select("group","Số lao động",options({"10":"10","100":"100","1000":"1.000",unlimited:"Không giới hạn"})),
    select("action","Đăng ký",options({new:"Cấp mới",renew:"Gia hạn"})),select("kind","Loại gói",options({single:"Đơn lẻ",combo:"Combo Viettel-CA"})),
    money("price","Giá (đ)"),money("referencePrice","Giá tham khảo (đ)",true),money("months","Thời hạn (tháng)"),
    field("trial","Gói dùng thử","check"),field("details","Chi tiết (mỗi dòng một mục)","lines")]
};
