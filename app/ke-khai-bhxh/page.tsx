import { getPublicSite } from "../../server/site";
import { phoneDigits } from "../../lib/site-data";
import type {Metadata} from "next";
import {ArrowLeft,Award,Blocks,Check,ClipboardCheck,ClipboardList,FileCheck2,FileOutput,FileSearch,Headphones,Inbox,MousePointerClick,PenLine,Phone,Send,Signal,Timer,UsersRound,BookOpen} from "lucide-react";
import "./vbhxh.css";
import "../bhxh-pricing.css";

export const metadata:Metadata={
  title:"Phần mềm kê khai BHXH vBHXH | Viettel Đồng Nai",
  description:"Giới thiệu phần mềm vBHXH: quản lý lao động, kê khai, ký và nộp hồ sơ bảo hiểm xã hội điện tử.",
};
const register="/?solution=bhxh#register";
const price="/ke-khai-bhxh/bao-gia";
const source="https://viettel.vn/vbhxh";
const reasons=[
  {icon:Signal,title:"Dịch vụ từ Viettel",text:"Nhà cung cấp viễn thông Viettel."},
  {icon:Award,title:"Chứng thực điện tử",text:"Đồng bộ dịch vụ ký số."},
  {icon:PenLine,title:"Kết nối chữ ký số",text:"Ký xác nhận tờ khai."},
  {icon:Blocks,title:"Hệ sinh thái dịch vụ",text:"Dịch vụ theo nhu cầu."},
  {icon:Headphones,title:"Hỗ trợ triển khai",text:"Hỗ trợ khi sử dụng."},
];
const features=[
  {icon:UsersRound,title:"Thông tin lao động",text:"Theo dõi danh sách, quá trình tham gia BHXH."},
  {icon:ClipboardList,title:"Chuẩn bị tờ khai",text:"Lập hồ sơ theo từng nghiệp vụ."},
  {icon:Send,title:"Ký và gửi điện tử",text:"Nộp hồ sơ đến cơ quan BHXH."},
  {icon:Inbox,title:"Nhận kết quả xử lý",text:"Tự động tiếp nhận phản hồi hồ sơ."},
  {icon:FileSearch,title:"Tìm lại hồ sơ",text:"Tra cứu, sao chép theo kỳ kê khai."},
  {icon:FileOutput,title:"Xuất dữ liệu",text:"Kết xuất theo nhiều định dạng."},
];
const advantages=[
  {icon:Timer,title:"Gọn thao tác",text:"Thực hiện thủ tục trên phần mềm."},
  {icon:FileCheck2,title:"Cập nhật biểu mẫu",text:"Tờ khai theo mẫu của cơ quan BHXH."},
  {icon:MousePointerClick,title:"Thuận tiện nộp hồ sơ",text:"Kết hợp ký số và gửi trực tuyến."},
  {icon:ClipboardCheck,title:"Theo dõi tập trung",text:"Quản lý hồ sơ đã nộp, nhận kết quả."},
];

export default async function VbhxhPage(){
  const {contact, media} = await getPublicSite();
  const phone = "tel:" + phoneDigits(contact.hotline);
return <div className="bh-page">
  <a className="skip-link" href="#bh-main">Đến nội dung chính</a>
  <div className="topline"><div className="wrap"><span>Bộ giải pháp chuyển đổi số Viettel</span><span className="private-label">Giới thiệu vBHXH</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
  <header className="header"><div className="wrap header-inner bh-header"><a className="brand brand-text" href="/">VIETTEL ĐỒNG NAI</a><nav className="bh-nav" aria-label="Điều hướng vBHXH"><a href="#gioi-thieu">Giới thiệu</a><a href="#tinh-nang">Tính năng</a><a href="#uu-diem">Ưu điểm</a></nav><a className="btn btn-red header-cta" href={price}>Báo giá</a></div></header>
  <main id="bh-main">
    <section className="bh-banner" aria-labelledby="bh-title"><div className="wrap bh-banner-grid"><div className="bh-banner-copy"><a className="bh-back" href="/#solutions"><ArrowLeft size={15}/>Bộ giải pháp Viettel</a><span className="bh-kicker">GIẢI PHÁP KÊ KHAI</span><h1 id="bh-title">BẢO HIỂM<br/>XÃ HỘI <span>VIETTEL</span></h1><div className="bh-banner-points"><span><Check size={22}/>Kê khai trực tuyến</span><span><Check size={22}/>Kết nối chữ ký số</span></div><img className="bh-logo" src="/assets/vbhxh-logo.png" width={200} height={86} alt="vBHXH Viettel"/></div><div className="bh-banner-photo"><img src={media.promotionPortrait} width={853} height={1280} alt={`${contact.name} tại Viettel – ảnh do người dùng cung cấp`}/><div className="bh-advisor"><span>{contact.role.toUpperCase()}</span><strong>{contact.name}</strong><a href={phone}><Phone size={21}/>{contact.hotline}</a></div></div></div></section>
    <section className="wrap bh-intro" id="gioi-thieu"><span className="bh-section-label">GIỚI THIỆU GIẢI PHÁP</span><h2>vBHXH LÀ GÌ?</h2><p>vBHXH hỗ trợ doanh nghiệp, đơn vị hành chính sự nghiệp và người sử dụng lao động quản lý hồ sơ bảo hiểm xã hội trên môi trường điện tử.</p><div className="bh-actions"><a className="bh-hotline" href={phone}><span>Liên hệ</span><Phone size={25}/><strong>{contact.hotline}</strong></a><a className="btn bqp-intro-price" href={price}>Báo giá</a><a className="btn btn-red" href={register}>Đăng ký ngay</a></div></section>
    <section className="wrap bh-section" id="ly-do"><div className="bh-heading"><span className="bh-section-label">01 / LÝ DO LỰA CHỌN</span><h2>VÌ SAO CHỌN<br/>vBHXH VIETTEL?</h2></div><div className="bh-reasons">{reasons.map(item=><article key={item.title}><span className="bh-reason-icon"><item.icon size={61} strokeWidth={1.3}/></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="bh-features-section" id="tinh-nang"><div className="wrap bh-heading"><span className="bh-section-label">02 / KHÁM PHÁ vBHXH</span><h2>TÍNH NĂNG SẢN PHẨM</h2></div><div className="bh-feature-grid">{features.map((item,index)=><article className={`bh-feature bh-feature-${index+1}`} key={item.title}><item.icon className="bh-watermark" aria-hidden="true"/><div className="bh-feature-inner"><span className="bh-feature-icon"><item.icon size={42} strokeWidth={1.4}/></span><div><span className="bh-feature-number">0{index+1}</span><h3>{item.title}</h3><p>{item.text}</p></div></div></article>)}</div></section>
    <section className="wrap bh-section" id="uu-diem"><div className="bh-heading"><span className="bh-section-label">03 / LỢI ÍCH SỬ DỤNG</span><h2>ƯU ĐIỂM VƯỢT TRỘI</h2></div><div className="bh-advantages">{advantages.map(item=><article key={item.title}><span><item.icon size={47} strokeWidth={1.4}/></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="bh-help-section"><div className="wrap bh-help"><div><span className="bh-section-label">CÙNG BẠN BẮT ĐẦU</span><h2>Tìm hiểu rõ hơn.<br/> Bắt đầu thuận tiện.</h2></div><div className="bh-help-links"><a href="https://viettel-ca.vn/ho-tro/vbhxh/huong-dan-su-dung" target="_blank" rel="noopener noreferrer"><BookOpen size={30}/><span><strong>Hướng dẫn sử dụng</strong><small>Tài liệu vBHXH trên website Viettel-CA</small></span></a><a href={register}><Headphones size={30}/><span><strong>Tư vấn triển khai</strong><small>Trao đổi nhu cầu với {contact.name}</small></span></a></div></div></section>
    <section className="wrap bh-contact"><div><span className="bh-section-label">VIETTEL ĐỒNG NAI</span><h2>Vui cùng bạn<br/> kết nối giải pháp.</h2><p>Chia sẻ nhu cầu kê khai BHXH để được tư vấn.</p></div><div className="bh-contact-actions"><a href={phone}><Phone size={32}/>{contact.hotline}</a><a className="btn btn-red" href={price}>Báo giá</a></div></section>
    <div className="wrap bh-source"><p>Nội dung tóm lược, bố cục tham khảo <a href={source} target="_blank" rel="noopener noreferrer">trang vBHXH chính thức của Viettel</a> và <a href="https://sme.viettel.vn/market-place/detail/VBHXH" target="_blank" rel="noopener noreferrer">giới thiệu vBHXH trên Viettel SME</a>.</p><a href="/#solutions"><ArrowLeft size={16}/>Các giải pháp khác</a><a href="#bh-title">Về đầu trang ↑</a></div>
  </main>
  <footer className="bh-footer"><div className="wrap"><strong>VIETTEL ĐỒNG NAI</strong><span>Phần mềm kê khai bảo hiểm xã hội vBHXH</span><a href={phone}>{contact.name} · {contact.hotline}</a></div></footer>

</div>;}
