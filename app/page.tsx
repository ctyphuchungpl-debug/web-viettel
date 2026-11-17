"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSite } from "../components/site-provider";
import { solutions } from "../lib/content-source";
import { parseVideo, phoneDigits, type Service } from "../lib/site-data";
import "./published-content.css";
import TendooPricing from "../components/tendoo-pricing";
import { SignaturePricingDialog } from "../components/signature-pricing";
import { ContractPricingDialog } from "../components/contract-pricing";
import { formatInvoicePrice, invoiceQuoteDetails, type InvoicePriceItem } from "../lib/invoice-pricing";
import "./invoice-pricing.css";
import { formatBhxhPrice, bhxhQuoteDetails, type BhxhPriceItem } from "../lib/bhxh-pricing";
import "./bhxh-pricing.css";
import { formatContractPrice, contractQuoteDetails, type ContractPriceItem } from "../lib/contract-pricing";
import { formatSignaturePrice, signatureQuoteTitle, signatureQuoteDetails, type SignaturePriceItem } from "../lib/signature-pricing";
import { formatTendooPrice, type TendooPriceItem } from "../lib/tendoo-pricing";
import "./tendoo-pricing.css";
import { Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Menu, MessageCircle, Copy, Phone, Play, Pause, ShieldCheck, Sparkles, X } from "lucide-react";

type Registration = { id: string; name: string; phone: string; email: string; company: string; note: string; products: string[]; quote?: TendooPriceItem | null; signatureQuote?: SignaturePriceItem | null; contractQuote?: ContractPriceItem | null; invoiceQuote?: InvoicePriceItem | null; bhxhQuote?: BhxhPriceItem | null };

export default function Home() {
  const { contact, media, visibility, gallery, videos, faq, blocks, prices } = useSite();
  const phone = "tel:" + phoneDigits(contact.hotline);
  const [submitting, setSubmitting] = useState(false);
  const requestId = useRef("");
  const submittedValues = useRef("");
  const [menu, setMenu] = useState(false);
  const [addressPaused, setAddressPaused] = useState(false);
  const [stripPaused, setStripPaused] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState(0);
  const [playVideo, setPlayVideo] = useState(false);
  const [poster, setPoster] = useState(0);
  const [posterPaused, setPosterPaused] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [copied, setCopied] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<TendooPriceItem | null>(null);
  const [signaturePricingOpen, setSignaturePricingOpen] = useState(false);
  const [selectedSignatureQuote, setSelectedSignatureQuote] = useState<SignaturePriceItem | null>(null);
  const [contractPricingOpen, setContractPricingOpen] = useState(false);
  const [selectedContractQuote, setSelectedContractQuote] = useState<ContractPriceItem | null>(null);
  const [selectedInvoiceQuote, setSelectedInvoiceQuote] = useState<InvoicePriceItem | null>(null);
  const [selectedBhxhQuote, setSelectedBhxhQuote] = useState<BhxhPriceItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const slide = gallery[poster];
  const slideService = solutions.find(item => item.id === slide?.service);
  const video = videos[activeVideo];
  const videoService = solutions.find(item => item.id === video?.service);
  const source = video ? parseVideo(video.link) : null;
  const videoEmbedUrl = source?.kind === "playlist"
    ? "https://www.youtube.com/embed/videoseries?list=" + source.value + "&autoplay=1&rel=0&playsinline=1"
    : "https://www.youtube.com/embed/" + source?.value + "?autoplay=1&rel=0&playsinline=1";
  const videoOriginalUrl = source?.kind === "playlist" ? "https://www.youtube.com/playlist?list=" + source.value
    : source?.kind === "mp4" ? source.value : "https://www.youtube.com/watch?v=" + source?.value;
  const count = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    if (posterPaused || !visibility.gallery || gallery.length < 2) return;
    const timer = window.setTimeout(() => setPoster(current => (current + 1) % gallery.length), 3000);
    return () => window.clearTimeout(timer);
  }, [poster, posterPaused, gallery.length, visibility.gallery]);

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    const solution = parameters.get("solution");
    if (solution === "chukyso") {
      const item = prices.chukyso.find(p => p.id === parameters.get("ca_quote"));
      if (item) setSelectedSignatureQuote(item);
    }
    if (solution === "hopdong") {
      const item = prices.hopdong.find(p => p.id === parameters.get("contract_quote"));
      if (item) setSelectedContractQuote(item);
    }
    if (solution === "hoadon") {
      const item = prices.hoadon.find(p => p.id === parameters.get("invoice_quote"));
      if (item) setSelectedInvoiceQuote(item);
    }
    if (solution === "bhxh") {
      const item = prices.bhxh.find(p => p.id === parameters.get("bhxh_quote"));
      if (item) setSelectedBhxhQuote(item);
    }
    const keys = { chukyso: "ca_quote", hopdong: "contract_quote", hoadon: "invoice_quote", bhxh: "bhxh_quote" } as const;
    if (solution && Object.hasOwn(keys, solution)) {
      const service = solution as keyof typeof keys;
      const quote = parameters.get(keys[service]);
      if (quote && !prices[service].some(item => item.id === quote)) setError("Gói từ đường dẫn đã thay đổi. Vui lòng chọn lại báo giá hoặc tiếp tục tư vấn dịch vụ.");
    }
    if (solution && solutions.some(p => p.id === solution)) {
      setSelected(s => s.includes(solution) ? s : [...s, solution]);
      requestAnimationFrame(() => document.querySelector<HTMLFormElement>(".registration-form")?.scrollIntoView({ block: "start" }));
    }
  }, [prices]);

  useEffect(() => {
    if (registration) { lastFocus.current = document.activeElement as HTMLElement; dialog.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; lastFocus.current?.focus(); }
    return () => { document.body.style.overflow = ""; };
  }, [registration]);
  function closeModal() { dialog.current?.close(); setRegistration(null); setCopied(false); setError(""); }
  function toggle(id: string) { setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); if (id === "tendoo" && selected.includes("tendoo")) setSelectedQuote(null); if (id === "chukyso" && selected.includes("chukyso")) setSelectedSignatureQuote(null); if (id === "hopdong" && selected.includes("hopdong")) setSelectedContractQuote(null); if (id === "hoadon" && selected.includes("hoadon")) setSelectedInvoiceQuote(null); if (id === "bhxh" && selected.includes("bhxh")) setSelectedBhxhQuote(null); setError(""); }
  function choose(id: string) { setSelected(s => s.includes(id) ? s : [...s, id]); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }
  function selectTendooQuote(item: TendooPriceItem) {
    setSelectedQuote(item);
    setSelected(s => s.includes("tendoo") ? s : [...s, "tendoo"]);
    setPricingOpen(false);
    setError("");
    requestAnimationFrame(() => {
      document.querySelector<HTMLFormElement>(".registration-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelector<HTMLInputElement>('.registration-form input[name="name"]')?.focus({ preventScroll: true });
    });
  }
  function selectSignatureQuote(item: SignaturePriceItem) {
    setSelectedSignatureQuote(item);
    setSelected(s => s.includes("chukyso") ? s : [...s, "chukyso"]);
    setSignaturePricingOpen(false);
    setError("");
    requestAnimationFrame(() => {
      document.querySelector<HTMLFormElement>(".registration-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelector<HTMLInputElement>('.registration-form input[name="name"]')?.focus({ preventScroll: true });
    });
  }
  function selectContractQuote(item: ContractPriceItem) {
    setSelectedContractQuote(item);
    setSelected(s => s.includes("hopdong") ? s : [...s, "hopdong"]);
    setContractPricingOpen(false);
    setError("");
    requestAnimationFrame(() => {
      document.querySelector<HTMLFormElement>(".registration-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelector<HTMLInputElement>('.registration-form input[name="name"]')?.focus({ preventScroll: true });
    });
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const phone = String(f.get("phone") || "").trim();
    const email = String(f.get("email") || "").trim();
    if (!name || !/^(?:0\d{9}|\+84\d{9})$/.test(phone.replace(/[\s.()-]/g, ""))) { setError("Vui lòng nhập họ tên và số điện thoại Việt Nam hợp lệ (10 chữ số hoặc +84)."); return; }
    if (!selected.length) { setError("Vui lòng chọn ít nhất một giải pháp hoặc chọn Cần tư vấn lựa chọn."); return; }
    setError("");
    setSubmitting(true);
    const company = String(f.get("company") || "").trim(), note = String(f.get("note") || "").trim();
    const chosen: [Service, {id: string} | null][] = [["tendoo", selectedQuote], ["chukyso", selectedSignatureQuote],
      ["hopdong", selectedContractQuote], ["hoadon", selectedInvoiceQuote], ["bhxh", selectedBhxhQuote]];
    const values = JSON.stringify({name,phone,email,company,note,selected,chosen});
    if (submittedValues.current !== values) {requestId.current = crypto.randomUUID(); submittedValues.current = values;}
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/consultations", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId.current, name, phone, email, company, note,
          products: selected.map(id => id === "consult" ? "other" : id),
          quotes: chosen.flatMap(([service, item]) => item ? [{service, id: item.id}] : []),
          consent: f.get("consent") === "on", website: String(f.get("website") ?? "") }),
        signal: AbortSignal.timeout(25_000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Chưa gửi được yêu cầu.");
      setRegistration({ id: result.id, name, phone, email, company, note, products: selected.map(id => solutions.find(p => p.id === id)?.name || "Cần tư vấn lựa chọn"),
        quote: selectedQuote, signatureQuote: selectedSignatureQuote, contractQuote: selectedContractQuote, invoiceQuote: selectedInvoiceQuote, bhxhQuote: selectedBhxhQuote });
      requestId.current = "";
      setSelected([]); setSelectedQuote(null); setSelectedSignatureQuote(null); setSelectedContractQuote(null); setSelectedInvoiceQuote(null); setSelectedBhxhQuote(null);
      const form = document.querySelector<HTMLFormElement>(".registration-form");
      form?.reset();
    } catch (error) {
      setError(error instanceof Error && error.name !== "TimeoutError" ? error.message : "Kết nối quá lâu. Vui lòng thử lại hoặc liên hệ qua Zalo.");
    } finally { setSubmitting(false); }
  }

  async function copyConsultation() {
    if (!registration) return;
    const r = registration;
    const quotes = [
      r.quote && `${r.quote.name}: ${formatTendooPrice(r.quote.price)} · ${r.quote.duration}`,
      r.signatureQuote && `${signatureQuoteTitle(r.signatureQuote)}: ${formatSignaturePrice(r.signatureQuote.price)} · ${signatureQuoteDetails(r.signatureQuote).join(" · ")}`,
      r.contractQuote && `${r.contractQuote.name}: ${formatContractPrice(r.contractQuote.price)} · ${contractQuoteDetails(r.contractQuote).join(" · ")}`,
      r.invoiceQuote && `${r.invoiceQuote.name}: ${formatInvoicePrice(r.invoiceQuote.price)} · ${invoiceQuoteDetails(r.invoiceQuote).join(" · ")}`,
      r.bhxhQuote && `${r.bhxhQuote.name}: ${formatBhxhPrice(r.bhxhQuote.price)} · ${bhxhQuoteDetails(r.bhxhQuote).join(" · ")}`,
    ].filter(Boolean);
    const message = ["Chào " + contact.name + ", tôi muốn được tư vấn giải pháp Viettel.", "Mã yêu cầu: " + r.id, `Họ tên: ${r.name}`, `Điện thoại: ${r.phone}`, r.email && `Email: ${r.email}`, r.company && `Đơn vị: ${r.company}`, `Giải pháp quan tâm: ${r.products.join(", ")}`, ...quotes, r.note && `Nhu cầu: ${r.note}`].filter(Boolean).join("\n");
    try { await navigator.clipboard.writeText(message); setCopied(true); }
    catch { setCopied(false); setError("Không thể sao chép tự động. Bạn có thể chọn và sao chép thông tin bên trên, rồi gửi qua Zalo."); }
  }

  return <>
    <a className="skip-link" href="#main">Đến nội dung chính</a>
    <div className="topline"><div className="wrap"><span>Bộ giải pháp chuyển đổi số Viettel</span><span className="private-label"><ShieldCheck size={13} /> Tư vấn cùng {contact.name}</span><a href={phone}><Phone size={13} /> {contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner">
      <a className="brand brand-text" href="#home" aria-label="Viettel Đồng Nai – Trang chủ">VIETTEL ĐỒNG NAI</a>
      <nav className={menu ? "main-nav is-open" : "main-nav"} aria-label="Điều hướng chính"><a href="#solutions" onClick={()=>setMenu(false)}>Giải pháp</a>{visibility.promotion && <a href="#guide" onClick={()=>setMenu(false)}>Khuyến mãi</a>}{visibility.videos && videos.length > 0 && <a href="#resources" onClick={()=>setMenu(false)}>Video & hướng dẫn</a>}</nav>
      <a className="btn btn-red header-cta" href="#register">Nhận tư vấn </a>
      <button className="menu-toggle" aria-label={menu?"Đóng menu":"Mở menu"} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </div></header>
    <main id="main" className="home-main">
      <section className="site-banner wrap" aria-label="Giải pháp số Viettel">
        <div className="banner-art"><div className="banner-visual"><img src={media.banner} width={2172} height={724} alt="Giải pháp số Viettel – đồng hành cùng doanh nghiệp Chuyển đổi số. Chữ ký số, Hóa đơn điện tử, Hợp đồng điện tử, Phần mềm BHXH và Tendoo." fetchPriority="high" /></div>
          <div className={`banner-address${addressPaused ? " is-paused" : ""}`} role="region" aria-label="Địa chỉ và số điện thoại liên hệ">
            <p className="contact-accessible">Địa chỉ: {contact.address} - Điện thoại: {contact.hotline}</p>
            <div className="banner-address-viewport" aria-hidden="true"><div className="banner-address-track">{[0,1].map(copy=><div className="banner-address-group" key={copy}><span>Địa chỉ: {contact.address} - Điện thoại: {contact.hotline}</span><span className="banner-address-divider">✦</span></div>)}</div></div>
            <button className="contact-control banner-address-control" type="button" aria-pressed={addressPaused} aria-label={addressPaused ? "Tiếp tục dòng địa chỉ" : "Tạm dừng dòng địa chỉ"} onClick={()=>setAddressPaused(!addressPaused)}>{addressPaused ? <Play size={15}/> : <Pause size={15}/>}</button>
          </div>
        </div>
      </section>
      <section className="hero wrap" id="home">
        <div className="hero-copy"><div className="eyebrow"><span className="red-dot"/> DÀNH CHO DOANH NGHIỆP & HỘ KINH DOANH</div><h1>Chuyển đổi số.<br/><span>Bắt đầu từ điều bạn cần.</span></h1><p>Từ bán hàng đến ký kết và quản lý hồ sơ.<br className="desktop-br"/> Cùng Viettel chọn giải pháp phù hợp, để công việc mỗi ngày thuận tiện hơn.</p><div className="hero-actions"><a className="btn btn-red" href={contact.zalo} target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/>Chat Zalo cùng {contact.name}</a><a className="text-link" href={phone}><Phone size={18}/>{contact.hotline}</a></div><nav className="hero-quick-solutions" aria-label="Chọn giải pháp nhanh">{solutions.map(p=><a key={p.id} href={`#${p.id}`}>{p.name}</a>)}</nav></div>
        <div className="hero-visual"><div className="photo-frame"><img className="hero-photo" src={contact.portrait} alt={`${contact.name} tại văn phòng Viettel — ảnh do người dùng cung cấp`} fetchPriority="high"/><span className="photo-label"><span className="red-dot"/> KẾT NỐI CÙNG BẠN</span></div><div className="advisor-tag"><div><span>{contact.role.toUpperCase()}</span><h2>{contact.name}</h2><a href={phone}>{contact.hotline} </a></div><a href="#register" className="advisor-arrow advisor-text-link" aria-label={`Đăng ký tư vấn cùng ${contact.name}`}>Tư vấn</a></div><span className="photo-side">THEO CÁCH CỦA BẠN</span></div>
      </section>
      <div className={`solution-strip${stripPaused ? " is-paused" : ""}`} id="messages" role="region" aria-label="Thông điệp chuyển đổi số">
        <p className="contact-accessible">{contact.ticker.join(" · ")}</p>
        <div className="strip-viewport" aria-hidden="true"><div className="strip-track">{[0, 1].map(copy => <div className="strip-group" key={copy}>{contact.ticker.map((text, index) => <span className="strip-item" key={index}><span>{text}</span><span className="strip-sparkle">✦</span></span>)}</div>)}</div></div>
        <button className="contact-control strip-control" type="button" aria-label={stripPaused ? "Tiếp tục dòng thông điệp" : "Tạm dừng dòng thông điệp"} onClick={() => setStripPaused(!stripPaused)}>{stripPaused ? <Play size={15}/> : <Pause size={15}/>}</button>
      </div>
      <section className="solutions section wrap" id="solutions"><div className="section-heading"><div><div className="eyebrow red">HỆ SINH THÁI GIẢI PHÁP</div><h2>Một nhu cầu rõ ràng.<br/><span>Một giải pháp phù hợp.</span></h2></div><p>Không cần bắt đầu với tất cả.<br/>Chọn công việc bạn muốn cải thiện, khám phá<br className="desktop-br"/> sản phẩm và nhận hướng dẫn cụ thể.</p></div>
        <div className="solution-grid">{solutions.map((p)=><article className="solution-card" id={p.id} key={p.id}><div className="card-image"><img src={media.products[p.id as Service]} alt={`${p.name} — minh họa giải pháp từ trang mẫu`} loading="lazy"/><span className="card-number">0{solutions.indexOf(p)+1}</span></div><div className="card-body"><div className="product-category">{p.category}</div><h3>{p.name}</h3><p>{p.description}</p><ul className="solution-benefits">{p.points.map(point=><li key={point}><CheckCircle2 size={17}/>{point}</li>)}</ul><p className="solution-audience"><strong>Phù hợp với:</strong> {p.audience}.</p><div className={`card-actions${["tendoo", "chukyso", "hopdong", "hoadon", "bhxh"].includes(p.id) ? " is-tendoo" : ""}`}><a className="btn btn-red btn-sm" href={p.url} target={p.url.startsWith("http") ? "_blank" : undefined} rel={p.url.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={p.url.startsWith("/") ? `Xem chi tiết ${p.name}` : `Xem chi tiết ${p.name} trên website Viettel`}>Xem chi tiết </a>{["tendoo", "chukyso", "hopdong", "hoadon", "bhxh"].includes(p.id) ? <>{(p.id === "hoadon" || p.id === "bhxh") ? <a className="btn btn-sm tq-open-button" href={p.id === "hoadon" ? "/hoa-don-dien-tu/bao-gia" : "/ke-khai-bhxh/bao-gia"} aria-label={`Báo giá ${p.name}`}>Báo giá</a> : <button className="btn btn-sm tq-open-button" type="button" aria-label={`Báo giá ${p.name}`} aria-haspopup="dialog" onClick={()=>p.id === "tendoo" ? setPricingOpen(true) : p.id === "chukyso" ? setSignaturePricingOpen(true) : setContractPricingOpen(true)}>Báo giá</button>}<button className="tendoo-quick-select" type="button" aria-label={`Tư vấn ${p.name}`} title={`Tư vấn ${p.name}`} onClick={()=>choose(p.id)}>{selected.includes(p.id)?<Check size={15}/>:"+"}</button></> : <button className={selected.includes(p.id)?"select-product chosen":"select-product"} onClick={()=>choose(p.id)}>{selected.includes(p.id)?<Check size={16}/>:<span>+</span>} Tư vấn</button>}</div></div></article>)}
          <figure className="ecosystem-card" id="ecosystem"><img src={media.ecosystem} alt="Hệ sinh thái chuyển đổi số Viettel trên nền đỏ công nghệ với địa cầu số, mạch điện tử, đám mây, bảo mật dữ liệu, đô thị thông minh và năm logo sản phẩm trên nền trắng" width={1072} height={1467} loading="lazy" decoding="async"/></figure>
        </div><p className="source-note">Thông tin tính năng, gói dịch vụ và chi phí được xác nhận theo sản phẩm tại thời điểm tư vấn.</p>
      </section>
      {visibility.promotion && <section className="promotion-section" id="guide" aria-labelledby="promotion-heading">
        <div className="wrap promotion-panel">
          <div className="promotion-copy">{media.promotion && <img className="managed-promotion-image" src={media.promotion} alt="Chương trình ưu đãi Viettel" loading="lazy"/>}<h2 id="promotion-heading" className="promotion-hot-heading"><span className="promotion-heading-intro"><Sparkles size={17} aria-hidden="true"/>CHƯƠNG TRÌNH</span>{" "}<span className="promotion-hot-line"><span>ƯU ĐÃI</span>{" "}<strong>HOT</strong></span>{" "}<span className="promotion-exclusive">DÀNH RIÊNG CHO</span>{" "}<span className="promotion-business">DOANH NGHIỆP MỚI THÀNH LẬP</span></h2><p>Trao đổi cùng {contact.name} để kiểm tra chính sách ưu đãi cho 4 dịch vụ dưới đây.</p><div className="promotion-services">{solutions.filter(p=>p.id!=="tendoo").map(p=><a href={`#${p.id}`} key={p.id}>{p.name}</a>)}</div><div className="promotion-conditions"><strong>Kiểm tra ưu đãi trước khi đăng ký</strong><p>Gói áp dụng, mức ưu đãi, thời gian triển khai và điều kiện doanh nghiệp mới thành lập cần được xác nhận trực tiếp. Giá và quyền lợi được thống nhất trước khi khách hàng quyết định sử dụng.</p></div><a className="btn btn-red" href={contact.zalo} target="_blank" rel="noopener noreferrer">Hỏi gói & điều kiện ưu đãi<MessageCircle size={20}/></a></div>
          <div className="promotion-advisor"><img src={media.promotionPortrait} alt={`${contact.name} – tư vấn giải pháp Viettel`} loading="lazy"/><div><span>{contact.role.toUpperCase()}</span><strong>{contact.name}</strong><a href={phone}>{contact.hotline}<Phone size={18}/></a></div></div>
        </div>
      </section>}
      {visibility.gallery && slide && <section className="visual-section section wrap" id="visual-solutions" aria-label="Khám phá bằng hình ảnh" aria-roledescription="carousel">
        <div className="section-heading">
          <div><div className="eyebrow red">TỪ NHU CẦU ĐẾN ỨNG DỤNG</div><h2>Hình dung cách<br/><span>công việc thay đổi.</span></h2></div>
          <div className="slide-controls">
            <span>{count(poster+1)} / {count(gallery.length)}</span>
            <button type="button" aria-label="Hình giải pháp trước" onClick={()=>setPoster(current=>(current+gallery.length-1)%gallery.length)}><ChevronLeft/></button>
            <button type="button" aria-label={posterPaused?"Tiếp tục trình chiếu":"Tạm dừng trình chiếu"} title={posterPaused?"Tiếp tục trình chiếu":"Tạm dừng trình chiếu"} onClick={()=>setPosterPaused(paused=>!paused)}>{posterPaused?<Play size={20}/>:<Pause size={20}/>}</button>
            <button type="button" aria-label="Hình giải pháp tiếp theo" onClick={()=>setPoster(current=>(current+1)%gallery.length)}><ChevronRight/></button>
          </div>
        </div>
        <div className="visual-feature" data-slide-index={poster+1} role="group" aria-roledescription="trang" aria-label={`Trang ${poster+1} trên ${gallery.length}: ${slide.title}`} aria-live={posterPaused?"polite":"off"}>
          <div className="feature-copy">
            <span className="eyebrow red">0{poster+1} / {slideService?.category || "KHÁM PHÁ"}</span>
            <h3>{slide.title.split("\n").map((t,i)=><span key={t}>{t}{i===0&&<br/>}</span>)}</h3>
            <ul>{slideService?.points.map(t=><li key={t}><CheckCircle2 size={19}/>{t}</li>)}</ul>
            {slide.service && <button className="text-link red" onClick={()=>choose(slide.service)}>Tìm hiểu cùng chuyên viên </button>}
          </div>
          <div className="feature-art"><img src={slide.image || (slide.service ? media.products[slide.service] : media.banner)} alt={`Minh họa ${slide.title}`} loading="lazy"/></div>
        </div>
      </section>}
      {visibility.videos && video && source && <section className="resources-section" id="resources"><div className="wrap section">
        <div className="section-heading"><div><div className="eyebrow red">GÓC KHÁM PHÁ</div><h2>Xem tận mắt.<br/><span>Hiểu rõ hơn.</span></h2></div><p>Video giới thiệu và hướng dẫn theo từng giải pháp.<br/>Chọn nội dung bạn quan tâm để bắt đầu.</p></div>
        <div className="video-grid"><div className="video-player">
          <div className="video-meta"><span>ĐANG KHÁM PHÁ / {videoService?.category || "VIETTEL"}</span><span>{count(activeVideo+1)} — {count(videos.length)}</span></div>
          <div className="video-stage">{playVideo ? (source.kind === "mp4" ? <video src={source.value} controls autoPlay playsInline />
            : <iframe key={video.id} src={videoEmbedUrl} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>)
            : <button className="video-cover" onClick={()=>setPlayVideo(true)} aria-label={"Phát video " + video.title}>
              <img src={video.service ? media.products[video.service] : media.banner} alt="" loading="lazy"/><span className="video-shade"/>
              <span className="video-play"><Play size={27} fill="currentColor"/></span><span className="video-cover-caption">{videoService?.category}<strong>{videoService?.name || video.title}</strong></span>
            </button>}</div>
          <div className="video-caption"><div><h3>{videoService?.name || video.title}</h3><p>{video.title}</p></div><a className="video-source-link" href={videoOriginalUrl} target="_blank" rel="noopener noreferrer">{source.kind === "mp4" ? "Mở video" : "Xem trên YouTube"}</a></div>
          <small>{source.kind === "playlist" ? "Chọn video trong danh sách để xem." : "Video mở khi bạn nhấn phát."}</small>
          {video.service && <button className="managed-video-consult" type="button" onClick={()=>choose(video.service)}>Tư vấn dịch vụ này</button>}
        </div><div className="video-list" aria-label="Chọn video">{videos.map((item,i)=>{
          const service = solutions.find(value=>value.id===item.service);
          return <button aria-pressed={activeVideo===i} className={activeVideo===i?"active":""} key={item.id} onClick={()=>{
            const openPlayer = item.id === "bhxh" || parseVideo(item.link)?.kind === "playlist";
            setActiveVideo(i); setPlayVideo(openPlayer);
            if(openPlayer) requestAnimationFrame(()=>document.querySelector(".video-player")?.scrollIntoView({behavior:"smooth",block:"start"}));
          }}><span className="video-index">{count(i+1)}</span><span><small>{service?.category || "VIETTEL"}</small><strong>{item.id === item.service ? service?.name || item.title : item.title}</strong></span>{service && <img src={`/assets/${service.logo}`} alt="" loading="lazy"/>}{activeVideo===i && <Play size={15} fill="currentColor"/>}</button>;
        })}</div></div>
      </div></section>}
      {blocks.length > 0 && <div className="wrap managed-blocks">{blocks.map(item=><section className="managed-block" key={item.id}><div><h2>{item.title}</h2><p>{item.description}</p></div>{item.image && <img src={item.image} alt={item.title} loading="lazy"/>}</section>)}</div>}
      <section className="register-section" id="register"><div className="wrap register-grid"><div className="register-copy"><div className="eyebrow">KẾT NỐI HÔM NAY</div><h2>Giải pháp đúng nhu cầu.<br/>Đồng hành cùng<br/>bước tiến mới.</h2><p>Để lại thông tin và chọn giải pháp bạn quan tâm. {contact.name} sẽ cùng bạn trao đổi về nhu cầu, gói dịch vụ và cách bắt đầu.</p><div className="contact-card"><img src={contact.portrait} alt={`${contact.name}`} loading="lazy"/><div><span>{contact.role.toUpperCase()}</span><h3>{contact.name}</h3><a href={phone}><Phone size={17}/>{contact.hotline}</a></div></div><div className="after-register"><MessageCircle size={25}/><div><h3>Kết nối tư vấn theo nhu cầu</h3><p>Gửi thông tin để chuyên viên liên hệ. Bạn cũng có thể gọi trực tiếp {contact.hotline}.</p></div></div></div>
        <form className="registration-form" onSubmit={submit} noValidate={false}><div className="form-top"><span className="eyebrow red">BẮT ĐẦU TỪ ĐÂY</span><span className="form-step">01 / THÔNG TIN</span></div><h3>Đăng ký nhận tư vấn</h3><div className="demo-notice"><span className="red-dot"/><div><strong>Tiếp nhận yêu cầu tư vấn</strong><span>Thông tin được gửi tới chuyên viên. Nếu bạn nhập email, bạn sẽ nhận được xác nhận.</span></div></div><div className="form-row"><label>Họ và tên <span>*</span><input name="name" autoComplete="name" placeholder="Nhập họ và tên" required maxLength={100}/></label><label>Số điện thoại <span>*</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Nhập số điện thoại" required maxLength={20}/></label></div><fieldset><legend>Bạn quan tâm giải pháp nào? <span>*</span></legend><div className="choices">{[...solutions.map(p=>({id:p.id,name:p.name})),{id:"consult",name:"Cần tư vấn lựa chọn"}].map(p=><label className={selected.includes(p.id)?"checked":""} key={p.id}><input type="checkbox" name="products" value={p.id} checked={selected.includes(p.id)} onChange={()=>toggle(p.id)}/><span>{p.name}</span></label>)}</div></fieldset>{selectedQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Tendoo"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá" onClick={()=>setSelectedQuote(null)}><X size={14}/></button><small>{selectedQuote.kind === "plan" ? "GÓI TENDOO ĐÃ CHỌN" : "THIẾT BỊ TENDOO ĐÃ CHỌN"}</small><h4>{selectedQuote.name}</h4><p><strong>{formatTendooPrice(selectedQuote.price)}</strong>Thời gian sử dụng: {selectedQuote.duration}</p><span>({selectedQuote.vatNote}) · Giá được xác nhận khi tư vấn.</span><button type="button" className="selected-quote-change" onClick={()=>setPricingOpen(true)}>Đổi gói hoặc thiết bị</button></div>}{selectedSignatureQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Chữ ký số"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá Chữ ký số" onClick={()=>setSelectedSignatureQuote(null)}><X size={14}/></button><small>GÓI CHỮ KÝ SỐ ĐÃ CHỌN</small><h4>{signatureQuoteTitle(selectedSignatureQuote)}</h4><p><strong className="cq-selected-total">{selectedSignatureQuote.referencePrice !== undefined && "Thanh toán: "}{formatSignaturePrice(selectedSignatureQuote.price)}</strong></p><p className="cq-quote-details">{signatureQuoteDetails(selectedSignatureQuote).map(line=><span key={line}>{line}</span>)}</p><span>Giá và điều kiện áp dụng được xác nhận khi tư vấn.</span><button type="button" className="selected-quote-change" onClick={()=>setSignaturePricingOpen(true)}>Đổi gói Chữ ký số</button></div>}{selectedContractQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Hợp đồng điện tử"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá Hợp đồng điện tử" onClick={()=>setSelectedContractQuote(null)}><X size={14}/></button><small>GÓI HỢP ĐỒNG ĐIỆN TỬ ĐÃ CHỌN</small><h4>{selectedContractQuote.name}</h4><p><strong className="vcq-selected-price">{formatContractPrice(selectedContractQuote.price)}</strong></p><div className="vcq-selected-details">{contractQuoteDetails(selectedContractQuote).map(line=><span className={line===selectedContractQuote.sourceNote?"vcq-selected-flag":""} key={line}>{line}</span>)}</div><span>Gói, số lượng và điều kiện được xác nhận khi tư vấn.</span><button type="button" className="selected-quote-change" onClick={()=>setContractPricingOpen(true)}>Đổi gói Hợp đồng điện tử</button></div>}{selectedInvoiceQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Hóa đơn điện tử"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá Hóa đơn điện tử" onClick={()=>setSelectedInvoiceQuote(null)}><X size={14}/></button><small>GÓI HÓA ĐƠN ĐIỆN TỬ ĐÃ CHỌN</small><h4>{selectedInvoiceQuote.name}</h4><p><strong className="iq-selected-price">{formatInvoicePrice(selectedInvoiceQuote.price)}</strong></p><div className="iq-selected-details">{invoiceQuoteDetails(selectedInvoiceQuote).map(line=><span key={line}>{line}</span>)}</div><a className="selected-quote-change" href="/hoa-don-dien-tu/bao-gia">Đổi gói Hóa đơn điện tử</a></div>}{selectedBhxhQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Kê khai BHXH"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá Kê khai BHXH" onClick={()=>setSelectedBhxhQuote(null)}><X size={14}/></button><small>GÓI KÊ KHAI BHXH ĐÃ CHỌN</small><h4>{selectedBhxhQuote.name}</h4><p><strong className="bqp-selected-price">{formatBhxhPrice(selectedBhxhQuote.price)}</strong></p><div className="bqp-quote-details">{bhxhQuoteDetails(selectedBhxhQuote).map(line=><span key={line}>{line}</span>)}</div><a className="selected-quote-change" href="/ke-khai-bhxh/bao-gia">Đổi gói Kê khai BHXH</a></div>}<details className="optional-fields"><summary>Thêm thông tin (không bắt buộc)</summary><label>Email <span className="optional">(không bắt buộc)</span><input name="email" type="email" autoComplete="email" placeholder="Nếu bạn muốn trao đổi thêm qua email" maxLength={150}/></label><label>Doanh nghiệp / Hộ kinh doanh <span className="optional">(không bắt buộc)</span><input name="company" autoComplete="organization" placeholder="Tên đơn vị của bạn" maxLength={150}/></label><label>Nhu cầu của bạn <span className="optional">(không bắt buộc)</span><textarea name="note" rows={2} placeholder="Bạn muốn cải thiện công việc nào?" maxLength={1000}/></label></details><p className="privacy-note">Thông tin dùng để liên hệ tư vấn. <a href="#privacy">Xem cách sử dụng và bảo vệ thông tin</a>.</p>{error&&<p role="alert" className="form-error">{error}</p>}<label className="managed-consent"><input type="checkbox" name="consent" required/> Tôi đồng ý để chuyên viên sử dụng thông tin này nhằm liên hệ tư vấn.</label><div hidden><input name="website" tabIndex={-1} autoComplete="off"/></div><button className="btn btn-red submit-btn" type="submit" disabled={submitting}>{submitting ? "Đang gửi…" : "Gửi yêu cầu tư vấn"}</button></form></div></section>
      {visibility.faq && faq.length > 0 && <section className="faq-section section wrap"><div><div className="eyebrow red">BẠN CÓ THỂ ĐANG THẮC MẮC</div><h2>Rõ thông tin.<br/><span>An tâm bắt đầu.</span></h2></div><div className="faq-list">{faq.map((f,i)=><details key={f.q}><summary><span className="faq-number">0{i+1}</span>{f.q}<ChevronDown size={19}/></summary><p>{f.a}</p></details>)}</div></section>}
    </main>

    {pricingOpen&&<TendooPricing onClose={()=>setPricingOpen(false)} onChoose={selectTendooQuote}/>}
    {signaturePricingOpen&&<SignaturePricingDialog onClose={()=>setSignaturePricingOpen(false)} onChoose={selectSignatureQuote}/>}
    {contractPricingOpen&&<ContractPricingDialog onClose={()=>setContractPricingOpen(false)} onChoose={selectContractQuote}/>}
    <dialog ref={dialog} className="confirmation" aria-labelledby="confirmation-title" onCancel={(e)=>{e.preventDefault();closeModal();}} onClick={(e)=>{if(e.target===e.currentTarget)closeModal();}}><button className="modal-close" aria-label="Đóng xác nhận" onClick={closeModal}><X/></button>{registration&&<><span className="confirmation-icon"><CheckCircle2 size={34}/></span><div className="eyebrow red">YÊU CẦU TƯ VẤN</div><h2 id="confirmation-title">Cảm ơn {registration.name}!</h2><p>Chuyên viên sẽ liên hệ với bạn theo thông tin đã gửi.</p><div className="modal-status"><ShieldCheck size={17}/> Đã tiếp nhận. Mã yêu cầu: {registration.id}</div><dl className="summary-data"><div><dt>Họ và tên</dt><dd>{registration.name}</dd></div><div><dt>Điện thoại</dt><dd>{registration.phone}</dd></div>{registration.email&&<div><dt>Email</dt><dd>{registration.email}</dd></div>}{registration.company&&<div><dt>Đơn vị</dt><dd>{registration.company}</dd></div>}<div><dt>Giải pháp quan tâm</dt><dd>{registration.products.join(", ")}</dd></div>{registration.quote&&<div><dt>{registration.quote.kind === "plan" ? "Gói Tendoo" : "Thiết bị Tendoo"}</dt><dd>{registration.quote.name}<br/>{formatTendooPrice(registration.quote.price)} · {registration.quote.duration}<br/><small>({registration.quote.vatNote})</small></dd></div>}{registration.signatureQuote&&<div><dt>Gói Chữ ký số</dt><dd>{signatureQuoteTitle(registration.signatureQuote)}<br/><strong>{registration.signatureQuote.referencePrice !== undefined && "Thanh toán: "}{formatSignaturePrice(registration.signatureQuote.price)}</strong><div className="cq-quote-details">{signatureQuoteDetails(registration.signatureQuote).map(line=><span key={line}>{line}</span>)}</div></dd></div>}{registration.contractQuote&&<div><dt>Gói vContract</dt><dd>{registration.contractQuote.name}<br/><strong>{formatContractPrice(registration.contractQuote.price)}</strong><div className="vcq-selected-details">{contractQuoteDetails(registration.contractQuote).map(line=><span className={line===registration.contractQuote?.sourceNote?"vcq-selected-flag":""} key={line}>{line}</span>)}</div></dd></div>}{registration.invoiceQuote&&<div><dt>Gói S-Invoice</dt><dd>{registration.invoiceQuote.name}<br/><strong>{formatInvoicePrice(registration.invoiceQuote.price)}</strong><div className="iq-selected-details">{invoiceQuoteDetails(registration.invoiceQuote).map(line=><span key={line}>{line}</span>)}</div></dd></div>}{registration.bhxhQuote&&<div><dt>Gói vBHXH</dt><dd>{registration.bhxhQuote.name}<br/><strong>{formatBhxhPrice(registration.bhxhQuote.price)}</strong><div className="bqp-quote-details">{bhxhQuoteDetails(registration.bhxhQuote).map(line=><span key={line}>{line}</span>)}</div></dd></div>}{registration.note&&<div><dt>Nhu cầu</dt><dd>{registration.note}</dd></div>}</dl><div className="next-email"><MessageCircle size={27}/><div><strong>Trao đổi thêm qua Zalo</strong><p>1. Sao chép nội dung tư vấn.<br/>2. Mở Chat Zalo với số {contact.hotline}.<br/>3. Dán và gửi tin nhắn để bắt đầu trao đổi.</p></div></div><div className="confirmation-actions"><button className="btn copy-consultation" type="button" onClick={copyConsultation}><Copy size={18}/>{copied?"Đã sao chép":"Sao chép nội dung"}</button><a className="btn btn-red" href={contact.zalo} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>Mở Chat Zalo</a></div>{error&&<p className="form-error" role="alert">{error}</p>}<p className="copy-status" role="status">{copied?"Đã sao chép nội dung yêu cầu.":""}</p><p className="popup-overview">Bộ giải pháp: Tendoo · Chữ ký số · Hợp đồng điện tử · Hóa đơn điện tử · Kê khai BHXH.<br/>Tư vấn: {contact.name} · {contact.hotline}.</p><button className="btn btn-red modal-done" onClick={closeModal}>Đóng thông tin <Check size={18}/></button></>}</dialog>
  </>;
}
