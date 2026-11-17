import { notFound } from "next/navigation";
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




export default async function SInvoicePage(){
  const {contact, media, pageContent, serviceCatalog} = await getPublicSite();
  if(!serviceCatalog.some(item=>item.id==="hoadon"))notFound();
  const copy = pageContent["hoadon"];
const reasons = [
  { icon: Blocks, title: copy["list-reasons"]["text-1"], text: copy["list-reasons"]["text-2"] },
  { icon: ShieldCheck, title: copy["list-reasons"]["text-3"], text: copy["list-reasons"]["text-4"] },
  { icon: Zap, title: copy["list-reasons"]["text-5"], text: copy["list-reasons"]["text-6"] },
  { icon: Sparkles, title: copy["list-reasons"]["text-7"], text: copy["list-reasons"]["text-8"] },
];
const features = [
  { icon: ClipboardList, title: copy["list-features"]["text-1"], text: copy["list-features"]["text-2"] },
  { icon: LayoutTemplate, title: copy["list-features"]["text-3"], text: copy["list-features"]["text-4"] },
  { icon: FilePlus2, title: copy["list-features"]["text-5"], text: copy["list-features"]["text-6"] },
  { icon: FileCheck2, title: copy["list-features"]["text-7"], text: copy["list-features"]["text-8"] },
  { icon: Link2, title: copy["list-features"]["text-9"], text: copy["list-features"]["text-10"] },
  { icon: Search, title: copy["list-features"]["text-11"], text: copy["list-features"]["text-12"] },
];
const advantages = [
  { icon: PiggyBank, title: copy["list-advantages"]["text-1"], text: copy["list-advantages"]["text-2"] },
  { icon: FolderOpen, title: copy["list-advantages"]["text-3"], text: copy["list-advantages"]["text-4"] },
  { icon: Mail, title: copy["list-advantages"]["text-5"], text: copy["list-advantages"]["text-6"] },
  { icon: FileSearch, title: copy["list-advantages"]["text-7"], text: copy["list-advantages"]["text-8"] },
  { icon: MonitorCheck, title: copy["list-advantages"]["text-9"], text: copy["list-advantages"]["text-10"] },
];

  const phone = "tel:" + phoneDigits(contact.hotline);

  return <div className="sinv-page">
    <a className="skip-link" href="#sinv-main">{copy["general"]["text-1"]}</a>
    <div className="topline"><div className="wrap"><span>{copy["general"]["text-2"]}</span><span className="private-label">{copy["general"]["text-3"]}</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner sinv-header">
      <a className="brand brand-text" href="/">{copy["general"]["text-4"]}</a>
      <nav className="sinv-nav" aria-label="Điều hướng S-Invoice"><a href="#ly-do">{copy["general"]["text-5"]}</a><a href="#tinh-nang">{copy["general"]["text-6"]}</a><a href="#uu-diem">{copy["general"]["text-7"]}</a></nav>
      <a className="btn btn-red header-cta" href={price}>{copy["general"]["text-8"]}</a>
    </div></header>
    <main id="sinv-main">
      <div className="wrap sinv-breadcrumb"><a href="/#solutions"><ArrowLeft size={14}/>{copy["general"]["text-9"]}</a><span>/</span><strong>{copy["general"]["text-10"]}</strong></div>
      <section className="wrap sinv-intro" id="gioi-thieu">
        <img className="sinv-logo" src="/assets/sinvoice-logo.png" width={160} height={55} alt={copy["gioi-thieu"]["text-1"]}/>
        <span className="eyebrow red">{copy["gioi-thieu"]["text-2"]}</span>
        <h1>{copy["gioi-thieu"]["text-3"]}<br className="sinv-mobile-break"/> {copy["gioi-thieu"]["text-4"]}</h1>
        <p>{copy["gioi-thieu"]["text-5"]}</p>
        <div className="sinv-intro-actions"><a className="sinv-hotline" href={phone}><Phone size={21}/><span>{copy["gioi-thieu"]["text-6"]}<strong>{contact.hotline}</strong></span></a><a className="iq-intro-price" href={price}>{copy["gioi-thieu"]["text-7"]}</a><a className="btn btn-red" href={register}>{copy["gioi-thieu"]["text-8"]}</a></div>
      </section>
      <section className="wrap sinv-reasons sinv-section" id="ly-do">
        <div className="sinv-section-heading"><span className="sinv-section-number">{copy["ly-do"]["text-1"]}</span><h2>{copy["ly-do"]["text-2"]}</h2></div>
        <div className="sinv-reasons-grid">{reasons.map(item => <article key={item.title}><span className="sinv-circle"><item.icon size={41} strokeWidth={1.4}/></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>
      <section className="sinv-features-section" id="tinh-nang">
        <div className="wrap sinv-section-heading"><span className="sinv-section-number">{copy["tinh-nang"]["text-1"]}</span><h2>{copy["tinh-nang"]["text-2"]}</h2></div>
        <div className="sinv-feature-band"><div className="wrap sinv-feature-grid">
          <div className="sinv-visual"><div className="sinv-photo-frame"><img src={media.promotionPortrait} width={853} height={1280} alt={`${contact.name} tại Viettel – ảnh do người dùng cung cấp`} loading="lazy"/></div><div className="sinv-advisor-tag"><span>{contact.role.toUpperCase()}</span><strong>{contact.name}</strong><a href={phone}><Phone size={17}/>{contact.hotline}</a></div><span className="sinv-visual-caption">{copy["tinh-nang"]["text-3"]}</span><p>{copy["tinh-nang"]["text-4"]}</p></div>
          <div className="sinv-feature-list">{features.map(item => <article key={item.title}><span><item.icon size={30} strokeWidth={1.5}/></span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}<a className="sinv-official-feature" href={source} target="_blank" rel="noopener noreferrer">{copy["tinh-nang"]["text-5"]}</a></div>
        </div></div>
      </section>
      <section className="wrap sinv-section sinv-advantages" id="uu-diem"><div className="sinv-section-heading"><span className="sinv-section-number">{copy["uu-diem"]["text-1"]}</span><h2>{copy["uu-diem"]["text-2"]}</h2></div><div className="sinv-advantages-grid">{advantages.map((item,index) => <article key={item.title}><span className="sinv-advantage-index">0{index+1}</span><item.icon size={35} strokeWidth={1.4}/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <section className="sinv-support-section"><div className="wrap sinv-section"><div className="sinv-section-heading"><span className="sinv-section-number">{copy["sinv-support-section"]["text-1"]}</span><h2>{copy["sinv-support-section"]["text-2"]}</h2></div><div className="sinv-support-grid"><a href="https://sinvoice.viettel.vn/tracuuhoadon" target="_blank" rel="noopener noreferrer"><Search size={30}/><span><strong>{copy["sinv-support-section"]["text-3"]}</strong><small>{copy["sinv-support-section"]["text-4"]}</small></span></a><a href="https://sinvoice.viettel.vn/ho-tro/huong-dan-su-dung" target="_blank" rel="noopener noreferrer"><CircleHelp size={30}/><span><strong>{copy["sinv-support-section"]["text-5"]}</strong><small>{copy["sinv-support-section"]["text-6"]}</small></span></a><a href={register}><Headphones size={30}/><span><strong>{copy["sinv-support-section"]["text-7"]}</strong><small>{copy["sinv-support-section"]["text-8"]}</small></span><ArrowRight size={21}/></a></div></div></section>
      <section className="wrap sinv-contact" id="lien-he"><div><span className="eyebrow red"><Check size={16}/>{copy["lien-he"]["text-1"]}</span><h2>{copy["lien-he"]["text-2"]}<span>{copy["lien-he"]["text-3"]}</span></h2><p>{copy["lien-he"]["text-4"]}{contact.name} {copy["lien-he"]["text-5"]}</p></div><div className="sinv-contact-actions"><a className="sinv-contact-phone" href={phone}><Phone size={23}/>{contact.hotline}</a><a className="btn btn-red" href={price}>{copy["lien-he"]["text-6"]}</a></div></section>
      <div className="wrap sinv-source"><p>{copy["general"]["text-11"]}<a href={source} target="_blank" rel="noopener noreferrer">{copy["general"]["text-12"]}</a>{copy["general"]["text-13"]}<a href="https://solutions.viettel.vn/vi/huong-dan-su-dung-hoa-don-dien-tu-viettel" target="_blank" rel="noopener noreferrer">{copy["general"]["text-14"]}</a>.</p><a href="/#solutions"><ArrowLeft size={15}/>{copy["general"]["text-15"]}</a><a href="#gioi-thieu">{copy["general"]["text-16"]}</a></div>
    </main>
    <footer className="sinv-footer"><div className="wrap"><strong>{copy["general"]["text-17"]}</strong><span>{copy["general"]["text-18"]}</span><a href={phone}>{contact.name} · {contact.hotline}</a></div></footer>

  </div>;
}
