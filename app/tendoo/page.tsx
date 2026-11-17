import { notFound } from "next/navigation";
import { getPublicSite } from "../../server/site";
import { phoneDigits } from "../../lib/site-data";
import type { Metadata } from "next";
import { ArrowDown, ArrowLeft, BarChart3, Bot, Boxes, Building2, Check, CheckCircle2, Cloud, Headset, HeartHandshake, Layers3, Link2, PackageCheck, Phone, ShoppingCart, Store, UserRound, Users, Wallet } from "lucide-react";
import "./tendoo.css";

export const metadata: Metadata = {
  title: "Tendoo – Quản lý bán hàng thông minh | Viettel Đồng Nai",
  description: "Giới thiệu Tendoo: lợi ích quản lý bán hàng, 6 nhóm tính năng nổi bật và ưu điểm.",
};





export default async function TendooPage(){
  const {contact, media, pageContent, serviceCatalog} = await getPublicSite();
  if(!serviceCatalog.some(item=>item.id==="tendoo"))notFound();
  const copy = pageContent["tendoo"];
const features = [
  { icon: ShoppingCart, title: copy["list-features"]["text-1"], text: copy["list-features"]["text-2"], label: copy["list-features"]["text-3"] },
  { icon: Bot, title: copy["list-features"]["text-4"], text: copy["list-features"]["text-5"], label: copy["list-features"]["text-6"] },
  { icon: Boxes, title: copy["list-features"]["text-7"], text: copy["list-features"]["text-8"], label: copy["list-features"]["text-9"] },
  { icon: Cloud, title: copy["list-features"]["text-10"], text: copy["list-features"]["text-11"], label: copy["list-features"]["text-12"] },
  { icon: Wallet, title: copy["list-features"]["text-13"], text: copy["list-features"]["text-14"], label: copy["list-features"]["text-15"] },
  { icon: Layers3, title: copy["list-features"]["text-16"], text: copy["list-features"]["text-17"], label: copy["list-features"]["text-18"] },
];
const operations = [
  { icon: Boxes, title: copy["list-operations"]["text-1"], detail: copy["list-operations"]["text-2"] },
  { icon: PackageCheck, title: copy["list-operations"]["text-3"], detail: copy["list-operations"]["text-4"] },
  { icon: ShoppingCart, title: copy["list-operations"]["text-5"], detail: copy["list-operations"]["text-6"] },
  { icon: BarChart3, title: copy["list-operations"]["text-7"], detail: copy["list-operations"]["text-8"] },
  { icon: Users, title: copy["list-operations"]["text-9"], detail: copy["list-operations"]["text-10"] },
  { icon: HeartHandshake, title: copy["list-operations"]["text-11"], detail: copy["list-operations"]["text-12"] },
];
const advantages = [
  { icon: CheckCircle2, title: copy["list-advantages"]["text-1"], text: copy["list-advantages"]["text-2"] },
  { icon: Link2, title: copy["list-advantages"]["text-3"], text: copy["list-advantages"]["text-4"] },
  { icon: Layers3, title: copy["list-advantages"]["text-5"], text: copy["list-advantages"]["text-6"] },
  { icon: Headset, title: copy["list-advantages"]["text-7"], text: copy["list-advantages"]["text-8"] },
];

  const phone = "tel:" + phoneDigits(contact.hotline);

  return <div className="tendoo-page">
    <a className="skip-link" href="#tendoo-main">{copy["general"]["text-1"]}</a>
    <div className="topline"><div className="wrap"><span>{copy["general"]["text-2"]}</span><span className="private-label">{copy["general"]["text-3"]}</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner td-header-inner"><a className="brand brand-text" href="/" aria-label="Viettel Đồng Nai – Trang chủ">{copy["general"]["text-4"]}</a><nav className="td-nav" aria-label="Điều hướng trang Tendoo"><a href="#overview">{copy["general"]["text-5"]}</a><a href="#features">{copy["general"]["text-6"]}</a><a href="#advantages">{copy["general"]["text-7"]}</a></nav><a className="btn btn-red header-cta" href="/?solution=tendoo#register">{copy["general"]["text-8"]}</a></div></header>
    <main id="tendoo-main">
      <div className="wrap td-breadcrumb"><a href="/#solutions"><ArrowLeft size={14}/>{copy["general"]["text-9"]}</a><span>/</span><strong>{copy["general"]["text-10"]}</strong></div>
      <section className="wrap td-hero" id="overview"><div className="td-hero-copy"><div className="eyebrow red"><span className="red-dot"/> {copy["overview"]["text-1"]}</div><h1><span>{copy["overview"]["text-2"]}</span><br/>{copy["overview"]["text-3"]}<br/>{copy["overview"]["text-4"]}</h1><p>{copy["overview"]["text-5"]}</p><div className="td-hero-actions"><a className="btn btn-red" href="/?solution=tendoo#register">{copy["overview"]["text-6"]}</a><a className="text-link" href="#features">{copy["overview"]["text-7"]}<ArrowDown size={16}/></a></div><div className="td-hero-proof"><span><Check size={15}/>{copy["overview"]["text-8"]}</span><span><Check size={15}/>{copy["overview"]["text-9"]}</span></div></div><div className="td-hero-portrait"><div className="td-photo-wrap"><img src={media.promotionPortrait} alt={`${contact.name} tại văn phòng Viettel – ảnh do người dùng cung cấp`} width={853} height={1280} fetchPriority="high"/><div className="td-photo-brand"><img src="/assets/tendoo-logo.png" alt={copy["overview"]["text-10"]}/><span>{copy["overview"]["text-11"]}</span></div></div><div className="td-person"><div><small>{contact.role.toUpperCase()}</small><h2>{contact.name}</h2><a href={phone}>{contact.hotline}</a></div><a href="#contact" className="td-person-arrow advisor-text-link" aria-label="Kết nối tư vấn Tendoo">{copy["overview"]["text-12"]}</a></div></div></section>
      <div className="td-audience"><div className="wrap"><span>{copy["general"]["text-11"]}</span><div><Building2 size={21}/>{copy["general"]["text-12"]}</div><div><Store size={21}/>{copy["general"]["text-13"]}</div><div><UserRound size={21}/>{copy["general"]["text-14"]}</div></div></div>
      <section className="wrap td-section" id="benefits"><div className="td-section-heading"><div><div className="eyebrow red">{copy["benefits"]["text-1"]}</div><h2>{copy["benefits"]["text-2"]}<br/><span>{copy["benefits"]["text-3"]}</span></h2></div><p>{copy["benefits"]["text-4"]}</p></div><div className="td-benefit-layout"><div className="td-product-image"><img src={media.products.tendoo} alt={copy["benefits"]["text-5"]} loading="lazy"/><div className="td-product-caption"><span>{copy["benefits"]["text-6"]}</span><strong>{copy["benefits"]["text-7"]}<br/>{copy["benefits"]["text-8"]}</strong></div></div><div className="td-operations">{operations.map((o,i)=><div className="td-operation" key={o.title}><div className="td-operation-top"><o.icon size={24}/><span>0{i+1}</span></div><h3>{o.title}</h3><p>{o.detail}</p></div>)}</div></div></section>
      <section className="td-features-section" id="features"><div className="wrap td-section"><div className="td-section-heading"><div><div className="eyebrow red">{copy["features"]["text-1"]}</div><h2>{copy["features"]["text-2"]}<br/><span>{copy["features"]["text-3"]}</span></h2></div><div className="td-feature-count"><strong>06</strong><span>{copy["features"]["text-4"]}<br/>{copy["features"]["text-5"]}</span></div></div><div className="td-feature-grid">{features.map((f,i)=><article className={`td-feature-card${i===1?" td-feature-ai":""}`} key={f.title}><div className="td-feature-card-top"><span className="td-feature-icon"><f.icon size={27}/></span><span className="td-feature-index">0{i+1}</span></div><div><h3>{f.title}</h3>{f.text&&<p>{f.text}</p>}</div><span className="td-feature-label">{f.label}</span></article>)}</div><p className="td-feature-note">{copy["features"]["text-6"]}</p></div></section>
      <section className="wrap td-section td-advantages" id="advantages"><div className="td-advantages-intro"><div className="eyebrow red">{copy["advantages"]["text-1"]}</div><h2>{copy["advantages"]["text-2"]}<br/><span>{copy["advantages"]["text-3"]}</span></h2><p>{copy["advantages"]["text-4"]}</p><div className="td-scale"><div><Store size={25}/><span>{copy["advantages"]["text-5"]}</span></div><span className="td-scale-line"/><div><Building2 size={25}/><span>{copy["advantages"]["text-6"]}</span></div></div><div className="td-ecosystem"><small>{copy["advantages"]["text-7"]}</small><div><span>{copy["advantages"]["text-8"]}</span><span>{copy["advantages"]["text-9"]}</span><span>{copy["advantages"]["text-10"]}</span><span>{copy["advantages"]["text-11"]}</span></div></div></div><div className="td-advantage-list">{advantages.map((a,i)=><article key={a.title}><span className="td-advantage-number">0{i+1}</span><div><h3>{a.title}</h3><p>{a.text}</p></div><a.icon size={23}/></article>)}</div></section>
      <section className="td-contact-section" id="contact"><div className="wrap td-contact-grid"><div><div className="eyebrow">{copy["contact"]["text-1"]}</div><h2>{copy["contact"]["text-2"]}<br/>{copy["contact"]["text-3"]}<br/>{copy["contact"]["text-4"]}</h2><p>{copy["contact"]["text-5"]}</p><a className="btn td-white-btn" href="/?solution=tendoo#register">{copy["contact"]["text-6"]}</a></div><aside className="td-contact-person"><img src={media.promotionPortrait} alt={`${contact.name} – chuyên viên tư vấn`} loading="lazy"/><div><small>{contact.role.toUpperCase()}</small><h3>{contact.name}</h3><a className="td-contact-phone" href={phone}><Phone size={20}/>{contact.hotline}</a><p>{copy["contact"]["text-7"]}</p></div><div className="td-contact-links"><a href="https://sme.viettel.vn/landing-page?alias=TDO" target="_blank" rel="noopener noreferrer">{copy["contact"]["text-8"]}</a><a href="https://www.youtube.com/watch?v=CXnZLTpXrwQ" target="_blank" rel="noopener noreferrer">{copy["contact"]["text-9"]}</a></div></aside></div></section>
      <div className="wrap td-bottom-nav"><a href="/#solutions"><ArrowLeft size={17}/>{copy["general"]["text-15"]}</a><a href="#overview">{copy["general"]["text-16"]}</a></div>
    </main>
    <footer className="td-footer"><div className="wrap"><strong>{copy["general"]["text-17"]}</strong><span>{copy["general"]["text-18"]}</span><a href={phone}>{contact.name} · {contact.hotline}</a></div></footer>

  </div>;
}
