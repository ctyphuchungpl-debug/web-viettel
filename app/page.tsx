"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSite } from "../components/site-provider";
import { TammiLink } from "../components/contact-links";
import { catalogImage, catalogLogo, catalogUrl, isPriceService, parseVideo, phoneDigits, type Service, type SiteContent } from "../lib/site-data";
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

type Registration = { id: string; name: string; phone: string; email: string; company: string; note: string; products: string[]; quote?: TendooPriceItem | null; signatureQuote?: SignaturePriceItem | null; contractQuote?: ContractPriceItem | null; invoiceQuote?: InvoicePriceItem | null; bhxhQuote?: BhxhPriceItem | null; customQuotes?: SiteContent["customPlans"] };

export default function Home() {
  const copy = useSite().pageContent["home"];

  const { contact, media, visibility, gallery, videos, faq, blocks, prices, serviceCatalog, customPlans } = useSite();
  const solutions = serviceCatalog.map(item=>({...item,url:catalogUrl(item),image:catalogImage(item,media),logo:catalogLogo(item)}));
  const [selectedCustom,setSelectedCustom] = useState<SiteContent["customPlans"]>([]);
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
    if (!solution) return;
    if (!serviceCatalog.some(item => item.id === solution)) {
      setError("Dịch vụ từ đường dẫn này hiện không còn mở tư vấn.");
      return;
    }
    const quoteId=parameters.get("service_quote");
    if(quoteId){const item=customPlans.find(item=>item.id===quoteId&&item.serviceId===solution);if(item)setSelectedCustom([item]);else setError("Gói đã thay đổi. Vui lòng chọn lại.");}
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
    setSelected(s => s.includes(solution) ? s : [...s, solution]);
    requestAnimationFrame(() => document.querySelector<HTMLFormElement>(".registration-form")?.scrollIntoView({ block: "start" }));
  }, [prices,customPlans,serviceCatalog]);

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
    const values = JSON.stringify({name,phone,email,company,note,selected,chosen,selectedCustom});
    if (submittedValues.current !== values) {requestId.current = crypto.randomUUID(); submittedValues.current = values;}
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/consultations", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId.current, name, phone, email, company, note,
          products: selected.map(id => id === "consult" ? "other" : id),
          quotes: [...chosen.flatMap(([service, item]) => item ? [{service, id: item.id}] : []),...selectedCustom.filter(item=>selected.includes(item.serviceId)).map(item=>({service:item.serviceId,id:item.id}))],
          consent: f.get("consent") === "on", website: String(f.get("website") ?? "") }),
        signal: AbortSignal.timeout(25_000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Chưa gửi được yêu cầu.");
      setRegistration({ id: result.id, name, phone, email, company, note, products: selected.map(id => solutions.find(p => p.id === id)?.name || "Cần tư vấn lựa chọn"),
        quote: selectedQuote, signatureQuote: selectedSignatureQuote, contractQuote: selectedContractQuote, invoiceQuote: selectedInvoiceQuote, bhxhQuote: selectedBhxhQuote,customQuotes:selectedCustom.filter(item=>selected.includes(item.serviceId)) });
      requestId.current = "";
      setSelected([]); setSelectedCustom([]); setSelectedQuote(null); setSelectedSignatureQuote(null); setSelectedContractQuote(null); setSelectedInvoiceQuote(null); setSelectedBhxhQuote(null);
      const form = document.querySelector<HTMLFormElement>(".registration-form");
      form?.reset();
    } catch (error) {
      setError(error instanceof Error && error.name !== "TimeoutError" ? error.message : "Kết nối quá lâu. Vui lòng thử lại hoặc liên hệ qua Tammi.");
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
    catch { setCopied(false); setError("Không thể sao chép tự động. Bạn có thể chọn và sao chép thông tin bên trên, rồi gửi qua Tammi."); }
  }

  return <>
    <a className="skip-link" href="#main">{copy["general"]["text-1"]}</a>
    <div className="topline"><div className="wrap"><span>{copy["general"]["text-2"]}</span><span className="private-label"><ShieldCheck size={13} /> {copy["general"]["text-3"]}{contact.name}</span><a href={phone}><Phone size={13} /> {contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner">
      <a className="brand brand-text" href="#home" aria-label="Viettel Đồng Nai – Trang chủ">{copy["general"]["text-4"]}</a>
      <nav className={menu ? "main-nav is-open" : "main-nav"} aria-label="Điều hướng chính"><a href="#solutions" onClick={()=>setMenu(false)}>{copy["general"]["text-5"]}</a>{visibility.promotion && <a href="#guide" onClick={()=>setMenu(false)}>{copy["general"]["text-6"]}</a>}{visibility.videos && videos.length > 0 && <a href="#resources" onClick={()=>setMenu(false)}>{copy["general"]["text-7"]}</a>}</nav>
      <a className="btn btn-red header-cta" href="#register">{copy["general"]["text-8"]}</a>
      <button className="menu-toggle" aria-label={menu?"Đóng menu":"Mở menu"} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </div></header>
    <main id="main" className="home-main">
      <section className="site-banner wrap" aria-label="Giải pháp số Viettel">
        <div className="banner-art"><div className="banner-visual"><img src={media.banner} width={2172} height={724} alt={copy["site-banner"]["text-1"]} fetchPriority="high" /></div>
          <div className={`banner-address${addressPaused ? " is-paused" : ""}`} role="region" aria-label="Địa chỉ và số điện thoại liên hệ">
            <p className="contact-accessible">{copy["site-banner"]["text-2"]}{contact.address} {copy["site-banner"]["text-3"]}{contact.hotline}</p>
            <div className="banner-address-viewport" aria-hidden="true"><div className="banner-address-track">{[0,1].map(copyIndex=><div className="banner-address-group" key={copyIndex}><span>{copy["site-banner"]["text-4"]}{contact.address} {copy["site-banner"]["text-5"]}{contact.hotline}</span><span className="banner-address-divider">✦</span></div>)}</div></div>
            <button className="contact-control banner-address-control" type="button" aria-pressed={addressPaused} aria-label={addressPaused ? "Tiếp tục dòng địa chỉ" : "Tạm dừng dòng địa chỉ"} onClick={()=>setAddressPaused(!addressPaused)}>{addressPaused ? <Play size={15}/> : <Pause size={15}/>}</button>
          </div>
        </div>
      </section>
      <section className="hero wrap" id="home">
        <div className="hero-copy"><div className="eyebrow"><span className="red-dot"/> {copy["home"]["text-1"]}</div><h1>{copy["home"]["text-2"]}<br/><span>{copy["home"]["text-3"]}</span></h1><p>{copy["home"]["text-4"]}<br className="desktop-br"/> {copy["home"]["text-5"]}</p><div className="hero-actions"><TammiLink className="btn btn-red"><MessageCircle size={20}/>{copy["home"]["text-6"]}{contact.name}</TammiLink><a className="text-link" href={phone}><Phone size={18}/>{contact.hotline}</a></div><nav className="hero-quick-solutions" aria-label="Chọn giải pháp nhanh">{solutions.map(p=><a key={p.id} href={`#${p.id}`}>{p.name}</a>)}</nav></div>
        <div className="hero-visual"><div className="photo-frame"><img className="hero-photo" src={contact.portrait} alt={`${contact.name} tại văn phòng Viettel — ảnh do người dùng cung cấp`} fetchPriority="high"/><span className="photo-label"><span className="red-dot"/> {copy["home"]["text-7"]}</span></div><div className="advisor-tag"><div><span>{contact.role.toUpperCase()}</span><h2>{contact.name}</h2><a href={phone}>{contact.hotline} </a></div><a href="#register" className="advisor-arrow advisor-text-link" aria-label={`Đăng ký tư vấn cùng ${contact.name}`}>{copy["home"]["text-8"]}</a></div><span className="photo-side">{copy["home"]["text-9"]}</span></div>
      </section>
      <div className={`solution-strip${stripPaused ? " is-paused" : ""}`} id="messages" role="region" aria-label="Thông điệp chuyển đổi số">
        <p className="contact-accessible">{contact.ticker.join(" · ")}</p>
        <div className="strip-viewport" aria-hidden="true"><div className="strip-track">{[0, 1].map(copyIndex => <div className="strip-group" key={copyIndex}>{contact.ticker.map((text, index) => <span className="strip-item" key={index}><span>{text}</span><span className="strip-sparkle">✦</span></span>)}</div>)}</div></div>
        <button className="contact-control strip-control" type="button" aria-label={stripPaused ? "Tiếp tục dòng thông điệp" : "Tạm dừng dòng thông điệp"} onClick={() => setStripPaused(!stripPaused)}>{stripPaused ? <Play size={15}/> : <Pause size={15}/>}</button>
      </div>
      <section className="solutions section wrap" id="solutions"><div className="section-heading"><div><div className="eyebrow red">{copy["solutions"]["text-1"]}</div><h2>{copy["solutions"]["text-2"]}<br/><span>{copy["solutions"]["text-3"]}</span></h2></div><p>{copy["solutions"]["text-4"]}<br/>{copy["solutions"]["text-5"]}<br className="desktop-br"/> {copy["solutions"]["text-6"]}</p></div>
        <div className="solution-grid">{solutions.map((p)=><article className="solution-card" id={p.id} key={p.id}><div className="card-image"><img src={p.image} alt={`${p.name} — minh họa giải pháp từ trang mẫu`} loading="lazy"/><span className="card-number">0{solutions.indexOf(p)+1}</span></div><div className="card-body"><div className="product-category">{p.category}</div><h3>{p.name}</h3><p>{p.description}</p><ul className="solution-benefits">{p.points.map(point=><li key={point}><CheckCircle2 size={17}/>{point}</li>)}</ul><p className="solution-audience"><strong>{copy["solutions"]["text-7"]}</strong> {p.audience}.</p><div className={`card-actions${["tendoo", "chukyso", "hopdong", "hoadon", "bhxh"].includes(p.id) ? " is-tendoo" : ""}`}><a className="btn btn-red btn-sm" href={p.url} target={p.url.startsWith("http") ? "_blank" : undefined} rel={p.url.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={p.url.startsWith("/") ? `Xem chi tiết ${p.name}` : `Xem chi tiết ${p.name} trên website Viettel`}>{copy["solutions"]["text-8"]}</a>{["tendoo", "chukyso", "hopdong", "hoadon", "bhxh"].includes(p.id) ? <>{(p.id === "hoadon" || p.id === "bhxh") ? <a className="btn btn-sm tq-open-button" href={p.id === "hoadon" ? "/hoa-don-dien-tu/bao-gia" : "/ke-khai-bhxh/bao-gia"} aria-label={`Báo giá ${p.name}`}>{copy["solutions"]["text-9"]}</a> : <button className="btn btn-sm tq-open-button" type="button" aria-label={`Báo giá ${p.name}`} aria-haspopup="dialog" onClick={()=>p.id === "tendoo" ? setPricingOpen(true) : p.id === "chukyso" ? setSignaturePricingOpen(true) : setContractPricingOpen(true)}>{copy["solutions"]["text-10"]}</button>}<button className="tendoo-quick-select" type="button" aria-label={`Tư vấn ${p.name}`} title={`Tư vấn ${p.name}`} onClick={()=>choose(p.id)}>{selected.includes(p.id)?<Check size={15}/>:"+"}</button></> : <button className={selected.includes(p.id)?"select-product chosen":"select-product"} onClick={()=>choose(p.id)}>{selected.includes(p.id)?<Check size={16}/>:<span>+</span>} {copy["solutions"]["text-11"]}</button>}</div></div></article>)}
          <figure className="ecosystem-card" id="ecosystem"><img src={media.ecosystem} alt={copy["solutions"]["text-12"]} width={1072} height={1467} loading="lazy" decoding="async"/></figure>
        </div><p className="source-note">{copy["solutions"]["text-13"]}</p>
      </section>
      {visibility.promotion && <section className="promotion-section" id="guide" aria-labelledby="promotion-heading">
        <div className="wrap promotion-panel">
          <div className="promotion-copy">{media.promotion && <img className="managed-promotion-image" src={media.promotion} alt={copy["guide"]["text-1"]} loading="lazy"/>}<h2 id="promotion-heading" className="promotion-hot-heading"><span className="promotion-heading-intro"><Sparkles size={17} aria-hidden="true"/>{copy["guide"]["text-2"]}</span>{" "}<span className="promotion-hot-line"><span>{copy["guide"]["text-3"]}</span>{" "}<strong>{copy["guide"]["text-4"]}</strong></span>{" "}<span className="promotion-exclusive">{copy["guide"]["text-5"]}</span>{" "}<span className="promotion-business">{copy["guide"]["text-6"]}</span></h2><p>{copy["guide"]["text-7"]}{contact.name} {copy["guide"]["text-8"]}</p><div className="promotion-services">{solutions.filter(p=>p.id!=="tendoo").map(p=><a href={`#${p.id}`} key={p.id}>{p.name}</a>)}</div><div className="promotion-conditions"><strong>{copy["guide"]["text-9"]}</strong><p>{copy["guide"]["text-10"]}</p></div><TammiLink className="btn btn-red">{copy["guide"]["text-11"]}<MessageCircle size={20}/></TammiLink></div>
          <div className="promotion-advisor"><img src={media.promotionPortrait} alt={`${contact.name} – tư vấn giải pháp Viettel`} loading="lazy"/><div><span>{contact.role.toUpperCase()}</span><strong>{contact.name}</strong><a href={phone}>{contact.hotline}<Phone size={18}/></a></div></div>
        </div>
      </section>}
      {visibility.gallery && slide && <section className="visual-section section wrap" id="visual-solutions" aria-label="Khám phá bằng hình ảnh" aria-roledescription="carousel">
        <div className="section-heading">
          <div><div className="eyebrow red">{copy["visual-solutions"]["text-1"]}</div><h2>{copy["visual-solutions"]["text-2"]}<br/><span>{copy["visual-solutions"]["text-3"]}</span></h2></div>
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
            {slide.service && <button className="text-link red" onClick={()=>choose(slide.service)}>{copy["visual-solutions"]["text-4"]}</button>}
          </div>
          <div className="feature-art"><img src={slide.image || (slide.service ? solutions.find(item=>item.id===slide.service)?.image || media.banner : media.banner)} alt={`Minh họa ${slide.title}`} loading="lazy"/></div>
        </div>
      </section>}
      {visibility.videos && video && source && <section className="resources-section" id="resources"><div className="wrap section">
        <div className="section-heading"><div><div className="eyebrow red">{copy["resources"]["text-1"]}</div><h2>{copy["resources"]["text-2"]}<br/><span>{copy["resources"]["text-3"]}</span></h2></div><p>{copy["resources"]["text-4"]}<br/>{copy["resources"]["text-5"]}</p></div>
        <div className="video-grid"><div className="video-player">
          <div className="video-meta"><span>{copy["resources"]["text-6"]}{videoService?.category || "VIETTEL"}</span><span>{count(activeVideo+1)} — {count(videos.length)}</span></div>
          <div className="video-stage">{playVideo ? (source.kind === "mp4" ? <video src={source.value} controls autoPlay playsInline />
            : <iframe key={video.id} src={videoEmbedUrl} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>)
            : <button className="video-cover" onClick={()=>setPlayVideo(true)} aria-label={"Phát video " + video.title}>
              <img src={video.service ? solutions.find(item=>item.id===video.service)?.image || media.banner : media.banner} alt="" loading="lazy"/><span className="video-shade"/>
              <span className="video-play"><Play size={27} fill="currentColor"/></span><span className="video-cover-caption">{videoService?.category}<strong>{videoService?.name || video.title}</strong></span>
            </button>}</div>
          <div className="video-caption"><div><h3>{videoService?.name || video.title}</h3><p>{video.title}</p></div><a className="video-source-link" href={videoOriginalUrl} target="_blank" rel="noopener noreferrer">{source.kind === "mp4" ? "Mở video" : "Xem trên YouTube"}</a></div>
          <small>{source.kind === "playlist" ? "Chọn video trong danh sách để xem." : "Video mở khi bạn nhấn phát."}</small>
          {video.service && <button className="managed-video-consult" type="button" onClick={()=>choose(video.service)}>{copy["resources"]["text-7"]}</button>}
        </div><div className="video-list" aria-label="Chọn video">{videos.map((item,i)=>{
          const service = solutions.find(value=>value.id===item.service);
          return <button aria-pressed={activeVideo===i} className={activeVideo===i?"active":""} key={item.id} onClick={()=>{
            const openPlayer = item.id === "bhxh" || parseVideo(item.link)?.kind === "playlist";
            setActiveVideo(i); setPlayVideo(openPlayer);
            if(openPlayer) requestAnimationFrame(()=>document.querySelector(".video-player")?.scrollIntoView({behavior:"smooth",block:"start"}));
          }}><span className="video-index">{count(i+1)}</span><span><small>{service?.category || "VIETTEL"}</small><strong>{item.id === item.service ? service?.name || item.title : item.title}</strong></span>{service && <img src={service.logo || service.image} alt="" loading="lazy"/>}{activeVideo===i && <Play size={15} fill="currentColor"/>}</button>;
        })}</div></div>
      </div></section>}
      {blocks.length > 0 && <div className="wrap managed-blocks">{blocks.map(item=><section className="managed-block" key={item.id}><div><h2>{item.title}</h2><p>{item.description}</p></div>{item.image && <img src={item.image} alt={item.title} loading="lazy"/>}</section>)}</div>}
      <section className="register-section" id="register"><div className="wrap register-grid"><div className="register-copy"><div className="eyebrow">{copy["register"]["text-1"]}</div><h2>{copy["register"]["text-2"]}<br/>{copy["register"]["text-3"]}<br/>{copy["register"]["text-4"]}</h2><p>{copy["register"]["text-5"]}{contact.name} {copy["register"]["text-6"]}</p><div className="contact-card"><img src={contact.portrait} alt={`${contact.name}`} loading="lazy"/><div><span>{contact.role.toUpperCase()}</span><h3>{contact.name}</h3><a href={phone}><Phone size={17}/>{contact.hotline}</a></div></div><div className="after-register"><MessageCircle size={25}/><div><h3>{copy["register"]["text-7"]}</h3><p>{copy["register"]["text-8"]}{contact.hotline}.</p></div></div></div>
        <form className="registration-form" onSubmit={submit} noValidate={false}><div className="form-top"><span className="eyebrow red">{copy["register"]["text-9"]}</span><span className="form-step">{copy["register"]["text-10"]}</span></div><h3>{copy["register"]["text-11"]}</h3><div className="demo-notice"><span className="red-dot"/><div><strong>{copy["register"]["text-12"]}</strong><span>{copy["register"]["text-13"]}</span></div></div><div className="form-row"><label>{copy["register"]["text-14"]}<span>*</span><input name="name" autoComplete="name" placeholder={copy["register"]["text-15"]} required maxLength={100}/></label><label>{copy["register"]["text-16"]}<span>*</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={copy["register"]["text-17"]} required maxLength={20}/></label></div><fieldset><legend>{copy["register"]["text-18"]}<span>*</span></legend><div className="choices">{[...solutions.map(p=>({id:p.id,name:p.name})),{id:"consult",name:"Cần tư vấn lựa chọn"}].map(p=><label className={selected.includes(p.id)?"checked":""} key={p.id}><input type="checkbox" name="products" value={p.id} checked={selected.includes(p.id)} onChange={()=>toggle(p.id)}/><span>{p.name}</span></label>)}</div></fieldset>{selectedCustom.filter(item=>selected.includes(item.serviceId)).map(item=><div className="selected-quote" key={item.id}><button className="selected-quote-remove" type="button" aria-label={"Xóa lựa chọn "+item.name} onClick={()=>setSelectedCustom(items=>items.filter(value=>value.id!==item.id))}><X size={14}/></button><h4>{item.name}</h4><p>{item.price === null ? "Liên hệ báo giá" : formatTendooPrice(item.price)} · {item.duration}</p><p>{item.vatNote}</p></div>)}{selectedQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Tendoo"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá" onClick={()=>setSelectedQuote(null)}><X size={14}/></button><small>{selectedQuote.kind === "plan" ? "GÓI TENDOO ĐÃ CHỌN" : "THIẾT BỊ TENDOO ĐÃ CHỌN"}</small><h4>{selectedQuote.name}</h4><p><strong>{formatTendooPrice(selectedQuote.price)}</strong>{copy["register"]["text-19"]}{selectedQuote.duration}</p><span>({selectedQuote.vatNote}{copy["register"]["text-20"]}</span><button type="button" className="selected-quote-change" onClick={()=>setPricingOpen(true)}>{copy["register"]["text-21"]}</button></div>}{selectedSignatureQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Chữ ký số"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá Chữ ký số" onClick={()=>setSelectedSignatureQuote(null)}><X size={14}/></button><small>{copy["register"]["text-22"]}</small><h4>{signatureQuoteTitle(selectedSignatureQuote)}</h4><p><strong className="cq-selected-total">{selectedSignatureQuote.referencePrice !== undefined && "Thanh toán: "}{formatSignaturePrice(selectedSignatureQuote.price)}</strong></p><p className="cq-quote-details">{signatureQuoteDetails(selectedSignatureQuote).map(line=><span key={line}>{line}</span>)}</p><span>{copy["register"]["text-23"]}</span><button type="button" className="selected-quote-change" onClick={()=>setSignaturePricingOpen(true)}>{copy["register"]["text-24"]}</button></div>}{selectedContractQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Hợp đồng điện tử"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá Hợp đồng điện tử" onClick={()=>setSelectedContractQuote(null)}><X size={14}/></button><small>{copy["register"]["text-25"]}</small><h4>{selectedContractQuote.name}</h4><p><strong className="vcq-selected-price">{formatContractPrice(selectedContractQuote.price)}</strong></p><div className="vcq-selected-details">{contractQuoteDetails(selectedContractQuote).map(line=><span className={line===selectedContractQuote.sourceNote?"vcq-selected-flag":""} key={line}>{line}</span>)}</div><span>{copy["register"]["text-26"]}</span><button type="button" className="selected-quote-change" onClick={()=>setContractPricingOpen(true)}>{copy["register"]["text-27"]}</button></div>}{selectedInvoiceQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Hóa đơn điện tử"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá Hóa đơn điện tử" onClick={()=>setSelectedInvoiceQuote(null)}><X size={14}/></button><small>{copy["register"]["text-28"]}</small><h4>{selectedInvoiceQuote.name}</h4><p><strong className="iq-selected-price">{formatInvoicePrice(selectedInvoiceQuote.price)}</strong></p><div className="iq-selected-details">{invoiceQuoteDetails(selectedInvoiceQuote).map(line=><span key={line}>{line}</span>)}</div><a className="selected-quote-change" href="/hoa-don-dien-tu/bao-gia">{copy["register"]["text-29"]}</a></div>}{selectedBhxhQuote&&<div className="selected-quote" aria-label="Lựa chọn báo giá Kê khai BHXH"><button className="selected-quote-remove" type="button" aria-label="Xóa lựa chọn báo giá Kê khai BHXH" onClick={()=>setSelectedBhxhQuote(null)}><X size={14}/></button><small>{copy["register"]["text-30"]}</small><h4>{selectedBhxhQuote.name}</h4><p><strong className="bqp-selected-price">{formatBhxhPrice(selectedBhxhQuote.price)}</strong></p><div className="bqp-quote-details">{bhxhQuoteDetails(selectedBhxhQuote).map(line=><span key={line}>{line}</span>)}</div><a className="selected-quote-change" href="/ke-khai-bhxh/bao-gia">{copy["register"]["text-31"]}</a></div>}<details className="optional-fields"><summary>{copy["register"]["text-32"]}</summary><label>{copy["register"]["text-33"]}<span className="optional">{copy["register"]["text-34"]}</span><input name="email" type="email" autoComplete="email" placeholder={copy["register"]["text-35"]} maxLength={150}/></label><label>{copy["register"]["text-36"]}<span className="optional">{copy["register"]["text-37"]}</span><input name="company" autoComplete="organization" placeholder={copy["register"]["text-38"]} maxLength={150}/></label><label>{copy["register"]["text-39"]}<span className="optional">{copy["register"]["text-40"]}</span><textarea name="note" rows={2} placeholder={copy["register"]["text-41"]} maxLength={1000}/></label></details><p className="privacy-note">{copy["register"]["text-42"]}<a href="#privacy">{copy["register"]["text-43"]}</a>.</p>{error&&<p role="alert" className="form-error">{error}</p>}<label className="managed-consent"><input type="checkbox" name="consent" required/> {copy["register"]["text-44"]}</label><div hidden><input name="website" tabIndex={-1} autoComplete="off"/></div><button className="btn btn-red submit-btn" type="submit" disabled={submitting}>{submitting ? "Đang gửi…" : "Gửi yêu cầu tư vấn"}</button></form></div></section>
      {visibility.faq && faq.length > 0 && <section className="faq-section section wrap"><div><div className="eyebrow red">{copy["faq-section"]["text-1"]}</div><h2>{copy["faq-section"]["text-2"]}<br/><span>{copy["faq-section"]["text-3"]}</span></h2></div><div className="faq-list">{faq.map((f,i)=><details key={f.q}><summary><span className="faq-number">0{i+1}</span>{f.q}<ChevronDown size={19}/></summary><p>{f.a}</p></details>)}</div></section>}
    </main>

    {pricingOpen&&<TendooPricing onClose={()=>setPricingOpen(false)} onChoose={selectTendooQuote}/>}
    {signaturePricingOpen&&<SignaturePricingDialog onClose={()=>setSignaturePricingOpen(false)} onChoose={selectSignatureQuote}/>}
    {contractPricingOpen&&<ContractPricingDialog onClose={()=>setContractPricingOpen(false)} onChoose={selectContractQuote}/>}
    <dialog ref={dialog} className="confirmation" aria-labelledby="confirmation-title" onCancel={(e)=>{e.preventDefault();closeModal();}} onClick={(e)=>{if(e.target===e.currentTarget)closeModal();}}><button className="modal-close" aria-label="Đóng xác nhận" onClick={closeModal}><X/></button>{registration&&<><span className="confirmation-icon"><CheckCircle2 size={34}/></span><div className="eyebrow red">{copy["general"]["text-9"]}</div><h2 id="confirmation-title">{copy["general"]["text-10"]}{registration.name}!</h2><p>{copy["general"]["text-11"]}</p><div className="modal-status"><ShieldCheck size={17}/> {copy["general"]["text-12"]}{registration.id}</div><dl className="summary-data"><div><dt>{copy["general"]["text-13"]}</dt><dd>{registration.name}</dd></div><div><dt>{copy["general"]["text-14"]}</dt><dd>{registration.phone}</dd></div>{registration.email&&<div><dt>{copy["general"]["text-15"]}</dt><dd>{registration.email}</dd></div>}{registration.company&&<div><dt>{copy["general"]["text-16"]}</dt><dd>{registration.company}</dd></div>}<div><dt>{copy["general"]["text-17"]}</dt><dd>{registration.products.join(", ")}</dd></div>{registration.quote&&<div><dt>{registration.quote.kind === "plan" ? "Gói Tendoo" : "Thiết bị Tendoo"}</dt><dd>{registration.quote.name}<br/>{formatTendooPrice(registration.quote.price)} · {registration.quote.duration}<br/><small>({registration.quote.vatNote})</small></dd></div>}{registration.signatureQuote&&<div><dt>{copy["general"]["text-18"]}</dt><dd>{signatureQuoteTitle(registration.signatureQuote)}<br/><strong>{registration.signatureQuote.referencePrice !== undefined && "Thanh toán: "}{formatSignaturePrice(registration.signatureQuote.price)}</strong><div className="cq-quote-details">{signatureQuoteDetails(registration.signatureQuote).map(line=><span key={line}>{line}</span>)}</div></dd></div>}{registration.contractQuote&&<div><dt>{copy["general"]["text-19"]}</dt><dd>{registration.contractQuote.name}<br/><strong>{formatContractPrice(registration.contractQuote.price)}</strong><div className="vcq-selected-details">{contractQuoteDetails(registration.contractQuote).map(line=><span className={line===registration.contractQuote?.sourceNote?"vcq-selected-flag":""} key={line}>{line}</span>)}</div></dd></div>}{registration.invoiceQuote&&<div><dt>{copy["general"]["text-20"]}</dt><dd>{registration.invoiceQuote.name}<br/><strong>{formatInvoicePrice(registration.invoiceQuote.price)}</strong><div className="iq-selected-details">{invoiceQuoteDetails(registration.invoiceQuote).map(line=><span key={line}>{line}</span>)}</div></dd></div>}{registration.bhxhQuote&&<div><dt>{copy["general"]["text-21"]}</dt><dd>{registration.bhxhQuote.name}<br/><strong>{formatBhxhPrice(registration.bhxhQuote.price)}</strong><div className="bqp-quote-details">{bhxhQuoteDetails(registration.bhxhQuote).map(line=><span key={line}>{line}</span>)}</div></dd></div>}{registration.note&&<div><dt>{copy["general"]["text-22"]}</dt><dd>{registration.note}</dd></div>}</dl><div className="next-email"><MessageCircle size={27}/><div><strong>{copy["general"]["text-23"]}</strong><p>{copy["general"]["text-24"]}<br/>{copy["general"]["text-25"]}<br/>{copy["general"]["text-26"]}</p></div></div><div className="confirmation-actions"><button className="btn copy-consultation" type="button" onClick={copyConsultation}><Copy size={18}/>{copied?"Đã sao chép":"Sao chép nội dung"}</button><TammiLink className="btn btn-red"><MessageCircle size={18}/>{copy["general"]["text-27"]}</TammiLink></div>{error&&<p className="form-error" role="alert">{error}</p>}<p className="copy-status" role="status">{copied?"Đã sao chép nội dung yêu cầu.":""}</p><p className="popup-overview">{copy["general"]["text-28"]}<br/>{copy["general"]["text-29"]}{contact.name} · {contact.hotline}.</p><button className="btn btn-red modal-done" onClick={closeModal}>{copy["general"]["text-30"]}<Check size={18}/></button></>}</dialog>
  </>;
}
