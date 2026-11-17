import { getPublicSite } from "../../server/site";
import { phoneDigits } from "../../lib/site-data";
import type { Metadata } from "next";
import { ArrowDown, ArrowLeft, BarChart3, Bot, Boxes, Building2, Check, CheckCircle2, Cloud, Headset, HeartHandshake, Layers3, Link2, PackageCheck, Phone, ShoppingCart, Store, UserRound, Users, Wallet } from "lucide-react";
import "./tendoo.css";

export const metadata: Metadata = {
  title: "Tendoo – Quản lý bán hàng thông minh | Viettel Đồng Nai",
  description: "Giới thiệu Tendoo: lợi ích quản lý bán hàng, 6 nhóm tính năng nổi bật và ưu điểm.",
};

const features = [
  { icon: ShoppingCart, title: "Bán hàng & CRM", text: "Phần mềm bán hàng với CRM, tích hợp sàn thương mại điện tử và hệ thống vận chuyển.", label: "KẾT NỐI HOẠT ĐỘNG BÁN HÀNG" },
  { icon: Bot, title: "Trợ lý AI", text: "Nền tảng trợ lý AI cho doanh nghiệp SME và hộ kinh doanh bán hàng nhanh.", label: "DÀNH CHO SME & HỘ KINH DOANH" },
  { icon: Boxes, title: "Nền tảng bán buôn", text: "Tích hợp nền tảng bán buôn trong hệ sinh thái Tendoo.", label: "TÍCH HỢP BÁN BUÔN" },
  { icon: Cloud, title: "Cloud", text: "", label: "NỀN TẢNG ĐÁM MÂY" },
  { icon: Wallet, title: "Tài chính & tín dụng online", text: "Tài chính, tín dụng online cho hộ kinh doanh và doanh nghiệp.", label: "HỘ KINH DOANH & DOANH NGHIỆP" },
  { icon: Layers3, title: "Dịch vụ Viettel tích hợp", text: "Tích hợp các sản phẩm, dịch vụ khác của Viettel như hóa đơn điện tử và chữ ký số.", label: "MỞ RỘNG HỆ SINH THÁI" },
];
const operations = [
  { icon: Boxes, title: "Nhập hàng", detail: "Nhiều nhà cung cấp trong và ngoài nước" },
  { icon: PackageCheck, title: "Tồn kho", detail: "Kiểm soát hàng hóa" },
  { icon: ShoppingCart, title: "Đơn hàng", detail: "Theo dõi hoạt động bán hàng" },
  { icon: BarChart3, title: "Doanh thu", detail: "Theo dõi thông tin kinh doanh" },
  { icon: Users, title: "Nhân viên", detail: "Quản lý nhân viên" },
  { icon: HeartHandshake, title: "Khách hàng", detail: "Chăm sóc và duy trì kết nối" },
];
const advantages = [
  { icon: CheckCircle2, title: "Sử dụng đơn giản, linh hoạt", text: "Sử dụng mọi lúc, mọi nơi, phù hợp với nhịp vận hành kinh doanh." },
  { icon: Link2, title: "Sẵn sàng tích hợp", text: "Sẵn sàng tích hợp với các phần mềm và ứng dụng." },
  { icon: Layers3, title: "Kết nối hệ sinh thái Viettel", text: "Sản phẩm lõi đã kết nối các sản phẩm cần thiết cho khách hàng: hóa đơn điện tử, Cloud, SmartHome…" },
  { icon: Headset, title: "Hỗ trợ 24/7", text: "Hỗ trợ 24/7 và hệ thống kênh bán rộng khắp toàn quốc." },
];

export default async function TendooPage(){
  const {contact, media} = await getPublicSite();
  const phone = "tel:" + phoneDigits(contact.hotline);

  return <div className="tendoo-page">
    <a className="skip-link" href="#tendoo-main">Đến nội dung chính</a>
    <div className="topline"><div className="wrap"><span>Bộ giải pháp chuyển đổi số Viettel</span><span className="private-label">Trang giới thiệu Tendoo</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner td-header-inner"><a className="brand brand-text" href="/" aria-label="Viettel Đồng Nai – Trang chủ">VIETTEL ĐỒNG NAI</a><nav className="td-nav" aria-label="Điều hướng trang Tendoo"><a href="#overview">Giới thiệu</a><a href="#features">Tính năng</a><a href="#advantages">Ưu điểm</a></nav><a className="btn btn-red header-cta" href="/?solution=tendoo#register">Nhận tư vấn </a></div></header>
    <main id="tendoo-main">
      <div className="wrap td-breadcrumb"><a href="/#solutions"><ArrowLeft size={14}/>Bộ giải pháp Viettel</a><span>/</span><strong>Tendoo</strong></div>
      <section className="wrap td-hero" id="overview"><div className="td-hero-copy"><div className="eyebrow red"><span className="red-dot"/> PHẦN MỀM QUẢN LÝ BÁN HÀNG</div><h1><span>Tendoo</span><br/>Quản lý bán hàng<br/>thông minh.</h1><p>Tendoo là nền tảng quản lý bán hàng thông minh, được thiết kế để đồng hành cùng doanh nghiệp, hộ kinh doanh và cá nhân kinh doanh trong việc vận hành và phát triển hoạt động kinh doanh bán hàng một cách hiệu quả.</p><div className="td-hero-actions"><a className="btn btn-red" href="/?solution=tendoo#register">Tư vấn về Tendoo </a><a className="text-link" href="#features">Khám phá tính năng <ArrowDown size={16}/></a></div><div className="td-hero-proof"><span><Check size={15}/>Quản lý trong một ứng dụng</span><span><Check size={15}/>Linh hoạt khi sử dụng</span></div></div><div className="td-hero-portrait"><div className="td-photo-wrap"><img src={media.promotionPortrait} alt={`${contact.name} tại văn phòng Viettel – ảnh do người dùng cung cấp`} width={853} height={1280} fetchPriority="high"/><div className="td-photo-brand"><img src="/assets/tendoo-logo.png" alt="Tendoo"/><span>ĐỒNG HÀNH CÙNG KINH DOANH</span></div></div><div className="td-person"><div><small>{contact.role.toUpperCase()}</small><h2>{contact.name}</h2><a href={phone}>{contact.hotline}</a></div><a href="#contact" className="td-person-arrow advisor-text-link" aria-label="Kết nối tư vấn Tendoo">Tư vấn</a></div></div></section>
      <div className="td-audience"><div className="wrap"><span>TENDOO ĐỒNG HÀNH CÙNG</span><div><Building2 size={21}/>Doanh nghiệp</div><div><Store size={21}/>Hộ kinh doanh</div><div><UserRound size={21}/>Cá nhân kinh doanh</div></div></div>
      <section className="wrap td-section" id="benefits"><div className="td-section-heading"><div><div className="eyebrow red">01 / LỢI ÍCH MANG LẠI</div><h2>Mọi hoạt động bán hàng.<br/><span>Trong một ứng dụng.</span></h2></div><p>Từ nhập hàng đến chăm sóc khách hàng, Tendoo giúp mọi quy trình trở nên đơn giản, liền mạch và dễ kiểm soát, mang đến trải nghiệm quản lý toàn diện.</p></div><div className="td-benefit-layout"><div className="td-product-image"><img src={media.products.tendoo} alt="Minh họa phần mềm quản lý bán hàng Tendoo" loading="lazy"/><div className="td-product-caption"><span>TENDOO</span><strong>Quản lý toàn diện<br/>trong một ứng dụng duy nhất.</strong></div></div><div className="td-operations">{operations.map((o,i)=><div className="td-operation" key={o.title}><div className="td-operation-top"><o.icon size={24}/><span>0{i+1}</span></div><h3>{o.title}</h3><p>{o.detail}</p></div>)}</div></div></section>
      <section className="td-features-section" id="features"><div className="wrap td-section"><div className="td-section-heading"><div><div className="eyebrow red">02 / TÍNH NĂNG NỔI BẬT</div><h2>Kết nối nhiều tiện ích.<br/><span>Hỗ trợ từng nhu cầu.</span></h2></div><div className="td-feature-count"><strong>06</strong><span>nhóm tính năng<br/>nổi bật của Tendoo</span></div></div><div className="td-feature-grid">{features.map((f,i)=><article className={`td-feature-card${i===1?" td-feature-ai":""}`} key={f.title}><div className="td-feature-card-top"><span className="td-feature-icon"><f.icon size={27}/></span><span className="td-feature-index">0{i+1}</span></div><div><h3>{f.title}</h3>{f.text&&<p>{f.text}</p>}</div><span className="td-feature-label">{f.label}</span></article>)}</div><p className="td-feature-note">Tính năng và các dịch vụ tích hợp được tư vấn cụ thể theo gói lựa chọn.</p></div></section>
      <section className="wrap td-section td-advantages" id="advantages"><div className="td-advantages-intro"><div className="eyebrow red">03 / ƯU ĐIỂM VƯỢT TRỘI</div><h2>Đơn giản khi dùng.<br/><span>Linh hoạt khi kết nối.</span></h2><p>Tendoo phù hợp với nhiều loại hình kinh doanh tại Việt Nam, từ cửa hàng nhỏ lẻ đến các chuỗi cửa hàng.</p><div className="td-scale"><div><Store size={25}/><span>Cửa hàng nhỏ lẻ</span></div><span className="td-scale-line"/><div><Building2 size={25}/><span>Chuỗi cửa hàng</span></div></div><div className="td-ecosystem"><small>HỆ SINH THÁI KẾT NỐI</small><div><span>Hóa đơn điện tử</span><span>Chữ ký số</span><span>Cloud</span><span>SmartHome</span></div></div></div><div className="td-advantage-list">{advantages.map((a,i)=><article key={a.title}><span className="td-advantage-number">0{i+1}</span><div><h3>{a.title}</h3><p>{a.text}</p></div><a.icon size={23}/></article>)}</div></section>
      <section className="td-contact-section" id="contact"><div className="wrap td-contact-grid"><div><div className="eyebrow">CÙNG BẠN BẮT ĐẦU</div><h2>Tìm hiểu Tendoo.<br/>Chọn cách quản lý<br/>phù hợp với bạn.</h2><p>Chia sẻ mô hình kinh doanh và nhu cầu thực tế để được tư vấn về Tendoo, các tính năng và dịch vụ tích hợp.</p><a className="btn td-white-btn" href="/?solution=tendoo#register">Đăng ký tư vấn Tendoo </a></div><aside className="td-contact-person"><img src={media.promotionPortrait} alt={`${contact.name} – chuyên viên tư vấn`} loading="lazy"/><div><small>{contact.role.toUpperCase()}</small><h3>{contact.name}</h3><a className="td-contact-phone" href={phone}><Phone size={20}/>{contact.hotline}</a><p>Trao đổi trực tiếp để được hướng dẫn theo nhu cầu kinh doanh.</p></div><div className="td-contact-links"><a href="https://sme.viettel.vn/landing-page?alias=TDO" target="_blank" rel="noopener noreferrer">Website sản phẩm Tendoo </a><a href="https://www.youtube.com/watch?v=CXnZLTpXrwQ" target="_blank" rel="noopener noreferrer">Video giới thiệu Tendoo </a></div></aside></div></section>
      <div className="wrap td-bottom-nav"><a href="/#solutions"><ArrowLeft size={17}/>Khám phá các giải pháp khác</a><a href="#overview">Về đầu trang ↑</a></div>
    </main>
    <footer className="td-footer"><div className="wrap"><strong>VIETTEL ĐỒNG NAI</strong><span>Giới thiệu phần mềm Tendoo</span><a href={phone}>{contact.name} · {contact.hotline}</a></div></footer>

  </div>;
}
