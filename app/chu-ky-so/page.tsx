import { getPublicSite } from "../../server/site";
import { phoneDigits } from "../../lib/site-data";
import type { Metadata } from "next";
import { ArrowDown, ArrowLeft, ArrowRight, BadgeCheck, Building2, Check, CheckCheck, FileCheck2, FileKey2, Fingerprint, Headset, Layers3, Link2, LockKeyhole, MapPin, Phone, ReceiptText, Scale, ShieldCheck, Smartphone, Truck, Usb, Users } from "lucide-react";
import "./chu-ky-so.css";
import "../signature-pricing.css";

export const metadata: Metadata = {
  title: "Chữ ký số Viettel-CA | Viettel Đồng Nai",
  description: "Tìm hiểu chữ ký số Viettel-CA: tính năng, giao dịch điện tử, hình thức ký và ưu điểm.",
};
const register = "/?solution=chukyso#register";
const reasons = [
  {icon: Building2, title: "Thương hiệu Viettel", text: "Dịch vụ chữ ký số dành cho doanh nghiệp và tổ chức."},
  {icon: BadgeCheck, title: "Chứng thực chữ ký số", text: "Giải pháp ký số và xác thực trong giao dịch điện tử."},
  {icon: Layers3, title: "Hệ sinh thái đa dạng", text: "Kết nối nhiều sản phẩm, dịch vụ phục vụ doanh nghiệp."},
  {icon: MapPin, title: "Hỗ trợ rộng khắp", text: "Mạng lưới kênh bán và đội ngũ hỗ trợ trên toàn quốc."},
];
const applications = [
  {icon: FileCheck2, title: "Kê khai thuế", text: "Kê khai thuế điện tử"},
  {icon: Truck, title: "Hải quan", text: "Giao dịch hải quan điện tử"},
  {icon: ReceiptText, title: "Hóa đơn", text: "Hóa đơn điện tử"},
  {icon: Users, title: "Bảo hiểm xã hội", text: "BHXH điện tử"},
];
const advantages = [
  {icon: Smartphone, title: "Linh hoạt hình thức ký", text: "Bên cạnh USB Token truyền thống, Viettel-CA có hình thức ký trên thiết bị di động. Lựa chọn dịch vụ và điều kiện sử dụng phù hợp với nhu cầu."},
  {icon: Headset, title: "Hỗ trợ khách hàng 24/7", text: "Mạng lưới kênh bán rộng khắp, đội ngũ hỗ trợ và tổng đài chăm sóc khách hàng đồng hành trong quá trình sử dụng."},
  {icon: FileKey2, title: "Cấp phát nhanh chóng", text: "Được hướng dẫn về hồ sơ và quy trình cấp phát chứng thư số. Thời gian triển khai được xác nhận khi tư vấn."},
  {icon: Link2, title: "Kết nối phần mềm nghiệp vụ", text: "Kết nối với nhiều phần mềm nghiệp vụ, hỗ trợ đưa chữ ký số vào công việc và giao dịch điện tử hằng ngày."},
];

export default async function DigitalSignaturePage(){
  const {contact, media} = await getPublicSite();
  const phone = "tel:" + phoneDigits(contact.hotline);

  return <div className="ca-page">
    <a className="skip-link" href="#ca-main">Đến nội dung chính</a>
    <div className="topline"><div className="wrap"><span>Bộ giải pháp chuyển đổi số Viettel</span><span className="private-label">Trang giới thiệu Chữ ký số</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner ca-header"><a className="brand brand-text" href="/" aria-label="Viettel Đồng Nai – Trang chủ">VIETTEL ĐỒNG NAI</a><nav className="ca-nav" aria-label="Điều hướng trang Chữ ký số"><a href="#gioi-thieu">Giới thiệu</a><a href="#tinh-nang">Tính năng</a><a href="#uu-diem">Ưu điểm</a></nav><a className="btn btn-red header-cta" href={register}>Đăng ký ngay</a></div></header>
    <main id="ca-main">
      <div className="wrap ca-breadcrumb"><a href="/#solutions"><ArrowLeft size={14}/>Bộ giải pháp Viettel</a><span>/</span><strong>Chữ ký số</strong></div>
      <section className="wrap ca-hero" id="gioi-thieu">
        <div className="ca-hero-copy"><div className="eyebrow red"><span className="red-dot"/>CHỮ KÝ SỐ VIETTEL-CA</div><h1>Ký số thuận tiện.<br/><span>Giao dịch an tâm.</span></h1><p>Viettel-CA là dịch vụ chữ ký số giúp doanh nghiệp ký văn bản, tài liệu số trên môi trường Internet, thay cho chữ ký tay trong các giao dịch điện tử phù hợp.</p><p className="ca-hero-sub">Mã hóa thông tin, hỗ trợ bảo mật và bảo đảm tính toàn vẹn của dữ liệu.</p><div className="ca-actions"><a className="btn btn-red" href={register}>Đăng ký ngay</a><a className="btn cq-detail-price" href="/chu-ky-so/bao-gia">Báo giá</a></div><div className="ca-hero-points"><span><ShieldCheck size={16}/>Bảo mật dữ liệu</span><span><CheckCheck size={16}/>Ký số điện tử</span></div></div>
        <div className="ca-visual" aria-label="Minh họa tài liệu và chữ ký số"><div className="ca-visual-top"><img src="/assets/viettel-ca-logo.png" alt="Viettel-CA" width={170} height={52}/><span>KẾT NỐI TIN CẬY</span></div><div className="ca-orbit ca-orbit-one"/><div className="ca-orbit ca-orbit-two"/><div className="ca-document"><div className="ca-document-head"><FileKey2 size={25}/><span>TÀI LIỆU ĐIỆN TỬ</span><LockKeyhole size={17}/></div><div className="ca-document-lines"><i/><i/><i/><i/></div><div className="ca-signature"><span>Chữ ký số</span><svg viewBox="0 0 210 55" fill="none" aria-hidden="true"><path d="M7 42C55 8 66 5 55 27S26 63 36 42 77 9 73 30 64 51 79 37 94 20 91 37 110 18 115 35 132 20 138 36 155 22 161 34 181 27 199 28M42 48C98 39 145 47 192 39"/></svg></div><div className="ca-document-status"><ShieldCheck size={23}/><div><strong>Xác thực & ký số</strong><span>Bảo vệ tính toàn vẹn dữ liệu</span></div><Check size={20}/></div></div><div className="ca-floating-shield"><Fingerprint size={38}/></div><div className="ca-visual-bottom"><span>01 / CHỌN TÀI LIỆU</span><ArrowRight size={15}/><span>02 / XÁC THỰC</span><ArrowRight size={15}/><span>03 / KÝ SỐ</span></div></div>
      </section>
      <section className="ca-reasons-section" aria-labelledby="ca-reasons-title"><div className="wrap ca-section"><div className="ca-section-heading"><div><div className="eyebrow red">01 / TẠI SAO CHỌN VIETTEL-CA?</div><h2 id="ca-reasons-title">Một giải pháp tin cậy.<br/><span>Nhiều giá trị đồng hành.</span></h2></div><p>Dành cho doanh nghiệp, tổ chức cần ký số tài liệu và kết nối các giao dịch điện tử.</p></div><div className="ca-reasons">{reasons.map((r,i)=><article key={r.title}><div className="ca-reason-top"><r.icon size={28}/><span>0{i+1}</span></div><h3>{r.title}</h3><p>{r.text}</p></article>)}</div></div></section>
      <section className="wrap ca-section" id="tinh-nang"><div className="ca-section-heading"><div><div className="eyebrow red">02 / TÍNH NĂNG SẢN PHẨM</div><h2>Ký số có cơ sở.<br/><span>Bảo mật có nhiều lớp.</span></h2></div><p>Từ xác thực tài liệu đến tích hợp nghiệp vụ, chữ ký số hỗ trợ doanh nghiệp thực hiện các giao dịch trên môi trường điện tử.</p></div><div className="ca-feature-grid"><article className="ca-feature ca-feature-red"><div className="ca-feature-top"><Scale size={31}/><span>01</span></div><h3>Giá trị pháp lý <br/>của chữ ký số</h3><p>Chữ ký số có giá trị tương đương chữ ký của cá nhân trên văn bản giấy theo Điều 23 Luật Giao dịch điện tử.</p><a href="#co-so-phap-ly">Xem cơ sở pháp lý<ArrowDown size={16}/></a></article><article className="ca-feature"><div className="ca-feature-top"><LockKeyhole size={31}/><span>02</span></div><h3>Bảo mật <br/>nhiều lớp</h3><p>Ứng dụng công nghệ mã hóa và hệ thống bảo mật nhiều lớp, hỗ trợ bảo vệ thông tin và tính toàn vẹn của dữ liệu doanh nghiệp.</p><span className="ca-feature-label">AN TOÀN THÔNG TIN</span></article><article className="ca-feature"><div className="ca-feature-top"><Layers3 size={31}/><span>03</span></div><h3>Tích hợp nhiều <br/>giao dịch điện tử</h3><p>Kết nối chữ ký số vào kê khai thuế, hải quan, hóa đơn điện tử, BHXH và các phần mềm nghiệp vụ phù hợp.</p><span className="ca-feature-label">LIỀN MẠCH TRONG CÔNG VIỆC</span></article></div>
        <aside className="ca-legal" id="co-so-phap-ly"><Scale size={24}/><div><h3>Cơ sở pháp lý để tìm hiểu</h3><p>Giá trị pháp lý của chữ ký điện tử được quy định tại Điều 23 <a href="https://vanban.chinhphu.vn/?classid=1&docid=208421&pageid=27160&typegroupid=3" target="_blank" rel="noopener noreferrer">Luật Giao dịch điện tử số 20/2023/QH15</a>. Quy định về chữ ký điện tử và dịch vụ tin cậy: <a href="https://chinhphu.vn/?classid=1&docid=212829&pageid=27160&typegroupid=4" target="_blank" rel="noopener noreferrer">Nghị định 23/2025/NĐ-CP</a>.</p></div></aside>
      </section>
      <section className="ca-applications-section" aria-labelledby="ca-app-title"><div className="wrap ca-section"><div className="ca-section-heading"><div><div className="eyebrow red">ỨNG DỤNG TRONG CÔNG VIỆC</div><h2 id="ca-app-title">Một chữ ký số.<br/><span>Nhiều điểm kết nối.</span></h2></div><div className="ca-app-heading-icon"><Fingerprint size={58}/></div></div><div className="ca-applications">{applications.map(a=><article key={a.title}><a.icon size={30}/><h3>{a.title}</h3><p>{a.text}</p></article>)}</div><p className="ca-small-note">Khả năng tích hợp được đối chiếu theo dịch vụ, phần mềm nghiệp vụ và hình thức ký lựa chọn.</p></div></section>
      <section className="wrap ca-section ca-advantages" id="uu-diem"><div className="ca-advantages-copy"><div className="eyebrow red">03 / ƯU ĐIỂM VƯỢT TRỘI</div><h2>Linh hoạt khi ký.<br/><span>Có người đồng hành.</span></h2><p>Từ lựa chọn hình thức ký đến kết nối phần mềm, Viettel-CA hỗ trợ doanh nghiệp bắt đầu và sử dụng chữ ký số trong công việc.</p><div className="ca-methods"><span><Usb size={25}/>USB Token</span><div/><span><Smartphone size={25}/>Thiết bị di động</span></div><a className="text-link" href={register}>Tư vấn hình thức ký phù hợp</a></div><div className="ca-advantage-list">{advantages.map((a,i)=><article key={a.title}><span>0{i+1}</span><div><h3>{a.title}</h3><p>{a.text}</p></div><a.icon size={25}/></article>)}</div></section>
      <section className="ca-contact-section" id="lien-he"><div className="wrap ca-contact"><div><div className="eyebrow">CÙNG BẠN BẮT ĐẦU</div><h2>Đưa chữ ký số<br/>vào công việc<br/>của bạn.</h2><p>Chia sẻ nhu cầu ký số để được tư vấn về hình thức sử dụng, hồ sơ đăng ký và cách triển khai.</p><a className="btn ca-white-btn" href={register}>Đăng ký ngay</a></div><aside className="ca-contact-person"><div className="ca-contact-photo"><img src={media.promotionPortrait} alt={`${contact.name} tại văn phòng Viettel – ảnh do người dùng cung cấp`} width={853} height={1280} loading="lazy"/></div><div className="ca-person-info"><small>{contact.role.toUpperCase()}</small><h3>{contact.name}</h3><a className="ca-phone" href={phone}><Phone size={21}/>{contact.hotline}</a><p>Trao đổi trực tiếp về nhu cầu chữ ký số của doanh nghiệp.</p><a className="ca-official" href="https://viettel.vn/viettel-ca" target="_blank" rel="noopener noreferrer">Website sản phẩm Viettel-CA</a></div></aside></div></section>
      <div className="wrap ca-bottom-nav"><a href="/#solutions"><ArrowLeft size={16}/>Khám phá các giải pháp khác</a><a href="#gioi-thieu">Về đầu trang ↑</a></div>
    </main>
    <footer className="ca-footer"><div className="wrap"><strong>VIETTEL ĐỒNG NAI</strong><span>Giới thiệu chữ ký số Viettel-CA</span><a href={phone}>{contact.name} · {contact.hotline}</a></div></footer>

  </div>;
}
