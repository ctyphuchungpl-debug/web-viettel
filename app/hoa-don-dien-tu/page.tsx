import { getPublicSite } from "../../server/site";
import { phoneDigits } from "../../lib/site-data";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Blocks, Check, CircleHelp, ClipboardList, FileCheck2, FilePlus2, FileSearch, FolderOpen, Headphones, LayoutTemplate, Link2, Mail, MonitorCheck, Phone, PiggyBank, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";
import "./sinvoice.css";
import "../invoice-pricing.css";

export const metadata: Metadata = {
  title: "Hóa đơn điện tử S-Invoice | Viettel Đồng Nai",
  description: "Giới thiệu S-Invoice: tính năng, lợi ích và hỗ trợ sử dụng hóa đơn điện tử.",
};

const register = "/?solution=hoadon#register";
const price = "/hoa-don-dien-tu/bao-gia";
const source = "https://viettel.vn/s-invoice";
const reasons = [
  { icon: Blocks, title: "Kết nối nhiều dịch vụ", text: "Phối hợp cùng hệ sinh thái dịch vụ Viettel." },
  { icon: ShieldCheck, title: "Hạ tầng và bảo mật", text: "Quản lý dữ liệu trên hạ tầng có nhiều lớp bảo vệ." },
  { icon: Zap, title: "Hỗ trợ triển khai", text: "Đồng hành khi khởi tạo và tích hợp hệ thống." },
  { icon: Sparkles, title: "Linh hoạt theo nhu cầu", text: "Kết nối phần mềm kế toán, bán hàng, quản trị." },
];
const features = [
  { icon: ClipboardList, title: "Quản lý tập trung", text: "Theo dõi nghiệp vụ hóa đơn." },
  { icon: LayoutTemplate, title: "Lựa chọn biểu mẫu", text: "Khởi tạo mẫu theo nhu cầu." },
  { icon: FilePlus2, title: "Tạo lập thuận tiện", text: "Thao tác ngay trên phần mềm." },
  { icon: FileCheck2, title: "Ký số hóa đơn", text: "Hỗ trợ thiết bị chữ ký số." },
  { icon: Link2, title: "Kết nối dữ liệu thuế", text: "Thông qua mô-đun tích hợp." },
  { icon: Search, title: "Cổng tra cứu riêng", text: "Khách hàng tìm lại hóa đơn." },
];
const advantages = [
  { icon: PiggyBank, title: "Giảm chi phí", text: "Bớt in, gửi và bảo quản giấy." },
  { icon: FolderOpen, title: "Gọn hồ sơ", text: "Đơn giản hơn khi lưu trữ." },
  { icon: Mail, title: "Giao nhận nhanh", text: "Gửi hóa đơn bằng phương thức điện tử." },
  { icon: FileSearch, title: "Dễ đối chiếu", text: "Thuận tiện kiểm tra thông tin." },
  { icon: MonitorCheck, title: "Tra cứu từ xa", text: "Tìm kiếm hóa đơn trực tuyến." },
];

export default async function SInvoicePage(){
  const {contact, media} = await getPublicSite();
  const phone = "tel:" + phoneDigits(contact.hotline);

  return <div className="sinv-page">
    <a className="skip-link" href="#sinv-main">Đến nội dung chính</a>
    <div className="topline"><div className="wrap"><span>Bộ giải pháp chuyển đổi số Viettel</span><span className="private-label">Giới thiệu S-Invoice</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner sinv-header">
      <a className="brand brand-text" href="/">VIETTEL ĐỒNG NAI</a>
      <nav className="sinv-nav" aria-label="Điều hướng S-Invoice"><a href="#ly-do">Lý do lựa chọn</a><a href="#tinh-nang">Tính năng</a><a href="#uu-diem">Ưu điểm</a></nav>
      <a className="btn btn-red header-cta" href={price}>Báo giá</a>
    </div></header>
    <main id="sinv-main">
      <div className="wrap sinv-breadcrumb"><a href="/#solutions"><ArrowLeft size={14}/>Bộ giải pháp Viettel</a><span>/</span><strong>Hóa đơn điện tử</strong></div>
      <section className="wrap sinv-intro" id="gioi-thieu">
        <img className="sinv-logo" src="/assets/sinvoice-logo.png" width={160} height={55} alt="S-Invoice"/>
        <span className="eyebrow red">HÓA ĐƠN ĐIỆN TỬ VIETTEL</span>
        <h1>HÓA ĐƠN ĐIỆN TỬ<br className="sinv-mobile-break"/> S-INVOICE LÀ GÌ?</h1>
        <p>S-Invoice là giải pháp hóa đơn điện tử của Viettel, hỗ trợ doanh nghiệp tạo lập, phát hành và quản lý hóa đơn trên phần mềm. Hóa đơn có thể được chuyển đến người mua qua email hoặc SMS, giúp giảm việc in ấn và giao nhận chứng từ giấy.</p>
        <div className="sinv-intro-actions"><a className="sinv-hotline" href={phone}><Phone size={21}/><span>Liên hệ<strong>{contact.hotline}</strong></span></a><a className="iq-intro-price" href={price}>Báo giá</a><a className="btn btn-red" href={register}>Đăng ký ngay</a></div>
      </section>
      <section className="wrap sinv-reasons sinv-section" id="ly-do">
        <div className="sinv-section-heading"><span className="sinv-section-number">01 / VÌ SAO S-INVOICE</span><h2>VÌ SAO LỰA CHỌN S-INVOICE?</h2></div>
        <div className="sinv-reasons-grid">{reasons.map(item => <article key={item.title}><span className="sinv-circle"><item.icon size={41} strokeWidth={1.4}/></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>
      <section className="sinv-features-section" id="tinh-nang">
        <div className="wrap sinv-section-heading"><span className="sinv-section-number">02 / KHÁM PHÁ GIẢI PHÁP</span><h2>TÍNH NĂNG SẢN PHẨM</h2></div>
        <div className="sinv-feature-band"><div className="wrap sinv-feature-grid">
          <div className="sinv-visual"><div className="sinv-photo-frame"><img src={media.promotionPortrait} width={853} height={1280} alt={`${contact.name} tại Viettel – ảnh do người dùng cung cấp`} loading="lazy"/></div><div className="sinv-advisor-tag"><span>{contact.role.toUpperCase()}</span><strong>{contact.name}</strong><a href={phone}><Phone size={17}/>{contact.hotline}</a></div><span className="sinv-visual-caption">S-Invoice</span><p>GIẢI PHÁP HÓA ĐƠN ĐIỆN TỬ</p></div>
          <div className="sinv-feature-list">{features.map(item => <article key={item.title}><span><item.icon size={30} strokeWidth={1.5}/></span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}<a className="sinv-official-feature" href={source} target="_blank" rel="noopener noreferrer">Xem giới thiệu gốc trên Viettel</a></div>
        </div></div>
      </section>
      <section className="wrap sinv-section sinv-advantages" id="uu-diem"><div className="sinv-section-heading"><span className="sinv-section-number">03 / LỢI ÍCH SỬ DỤNG</span><h2>ƯU ĐIỂM VƯỢT TRỘI</h2></div><div className="sinv-advantages-grid">{advantages.map((item,index) => <article key={item.title}><span className="sinv-advantage-index">0{index+1}</span><item.icon size={35} strokeWidth={1.4}/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <section className="sinv-support-section"><div className="wrap sinv-section"><div className="sinv-section-heading"><span className="sinv-section-number">04 / HỖ TRỢ SỬ DỤNG</span><h2>THÔNG TIN BẠN CẦN</h2></div><div className="sinv-support-grid"><a href="https://sinvoice.viettel.vn/tracuuhoadon" target="_blank" rel="noopener noreferrer"><Search size={30}/><span><strong>Tra cứu hóa đơn</strong><small>Mở cổng tra cứu S-Invoice</small></span></a><a href="https://sinvoice.viettel.vn/ho-tro/huong-dan-su-dung" target="_blank" rel="noopener noreferrer"><CircleHelp size={30}/><span><strong>Hướng dẫn sử dụng</strong><small>Tài liệu trên hệ thống S-Invoice</small></span></a><a href={register}><Headphones size={30}/><span><strong>Tư vấn triển khai</strong><small>Để lại nhu cầu của bạn</small></span><ArrowRight size={21}/></a></div></div></section>
      <section className="wrap sinv-contact" id="lien-he"><div><span className="eyebrow red"><Check size={16}/>KẾT NỐI VỚI VIETTEL ĐỒNG NAI</span><h2>Bắt đầu với <span>S-Invoice.</span></h2><p>Liên hệ {contact.name} hoặc để lại thông tin để được tư vấn.</p></div><div className="sinv-contact-actions"><a className="sinv-contact-phone" href={phone}><Phone size={23}/>{contact.hotline}</a><a className="btn btn-red" href={price}>Báo giá</a></div></section>
      <div className="wrap sinv-source"><p>Nội dung tóm lược, bố cục tham khảo từ <a href={source} target="_blank" rel="noopener noreferrer">trang giới thiệu S-Invoice của Viettel</a>. Tham khảo thêm <a href="https://solutions.viettel.vn/vi/huong-dan-su-dung-hoa-don-dien-tu-viettel" target="_blank" rel="noopener noreferrer">hướng dẫn sử dụng S-Invoice</a>.</p><a href="/#solutions"><ArrowLeft size={15}/>Các giải pháp khác</a><a href="#gioi-thieu">Về đầu trang ↑</a></div>
    </main>
    <footer className="sinv-footer"><div className="wrap"><strong>VIETTEL ĐỒNG NAI</strong><span>Giới thiệu Hóa đơn điện tử S-Invoice</span><a href={phone}>{contact.name} · {contact.hotline}</a></div></footer>

  </div>;
}
