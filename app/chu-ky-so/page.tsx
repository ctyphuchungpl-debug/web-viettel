import { notFound } from "next/navigation";
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




export default async function DigitalSignaturePage(){
  const {contact, media, pageContent, serviceCatalog} = await getPublicSite();
  if(!serviceCatalog.some(item=>item.id==="chukyso"))notFound();
  const copy = pageContent["chukyso"];
const reasons = [
  {icon: Building2, title: copy["list-reasons"]["text-1"], text: copy["list-reasons"]["text-2"]},
  {icon: BadgeCheck, title: copy["list-reasons"]["text-3"], text: copy["list-reasons"]["text-4"]},
  {icon: Layers3, title: copy["list-reasons"]["text-5"], text: copy["list-reasons"]["text-6"]},
  {icon: MapPin, title: copy["list-reasons"]["text-7"], text: copy["list-reasons"]["text-8"]},
];
const applications = [
  {icon: FileCheck2, title: copy["list-applications"]["text-1"], text: copy["list-applications"]["text-2"]},
  {icon: Truck, title: copy["list-applications"]["text-3"], text: copy["list-applications"]["text-4"]},
  {icon: ReceiptText, title: copy["list-applications"]["text-5"], text: copy["list-applications"]["text-6"]},
  {icon: Users, title: copy["list-applications"]["text-7"], text: copy["list-applications"]["text-8"]},
];
const advantages = [
  {icon: Smartphone, title: copy["list-advantages"]["text-1"], text: copy["list-advantages"]["text-2"]},
  {icon: Headset, title: copy["list-advantages"]["text-3"], text: copy["list-advantages"]["text-4"]},
  {icon: FileKey2, title: copy["list-advantages"]["text-5"], text: copy["list-advantages"]["text-6"]},
  {icon: Link2, title: copy["list-advantages"]["text-7"], text: copy["list-advantages"]["text-8"]},
];

  const phone = "tel:" + phoneDigits(contact.hotline);

  return <div className="ca-page">
    <a className="skip-link" href="#ca-main">{copy["general"]["text-1"]}</a>
    <div className="topline"><div className="wrap"><span>{copy["general"]["text-2"]}</span><span className="private-label">{copy["general"]["text-3"]}</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner ca-header"><a className="brand brand-text" href="/" aria-label="Viettel Đồng Nai – Trang chủ">{copy["general"]["text-4"]}</a><nav className="ca-nav" aria-label="Điều hướng trang Chữ ký số"><a href="#gioi-thieu">{copy["general"]["text-5"]}</a><a href="#tinh-nang">{copy["general"]["text-6"]}</a><a href="#uu-diem">{copy["general"]["text-7"]}</a></nav><a className="btn btn-red header-cta" href={register}>{copy["general"]["text-8"]}</a></div></header>
    <main id="ca-main">
      <div className="wrap ca-breadcrumb"><a href="/#solutions"><ArrowLeft size={14}/>{copy["general"]["text-9"]}</a><span>/</span><strong>{copy["general"]["text-10"]}</strong></div>
      <section className="wrap ca-hero" id="gioi-thieu">
        <div className="ca-hero-copy"><div className="eyebrow red"><span className="red-dot"/>{copy["gioi-thieu"]["text-1"]}</div><h1>{copy["gioi-thieu"]["text-2"]}<br/><span>{copy["gioi-thieu"]["text-3"]}</span></h1><p>{copy["gioi-thieu"]["text-4"]}</p><p className="ca-hero-sub">{copy["gioi-thieu"]["text-5"]}</p><div className="ca-actions"><a className="btn btn-red" href={register}>{copy["gioi-thieu"]["text-6"]}</a><a className="btn cq-detail-price" href="/chu-ky-so/bao-gia">{copy["gioi-thieu"]["text-7"]}</a></div><div className="ca-hero-points"><span><ShieldCheck size={16}/>{copy["gioi-thieu"]["text-8"]}</span><span><CheckCheck size={16}/>{copy["gioi-thieu"]["text-9"]}</span></div></div>
        <div className="ca-visual" aria-label="Minh họa tài liệu và chữ ký số"><div className="ca-visual-top"><img src="/assets/viettel-ca-logo.png" alt={copy["gioi-thieu"]["text-10"]} width={170} height={52}/><span>{copy["gioi-thieu"]["text-11"]}</span></div><div className="ca-orbit ca-orbit-one"/><div className="ca-orbit ca-orbit-two"/><div className="ca-document"><div className="ca-document-head"><FileKey2 size={25}/><span>{copy["gioi-thieu"]["text-12"]}</span><LockKeyhole size={17}/></div><div className="ca-document-lines"><i/><i/><i/><i/></div><div className="ca-signature"><span>{copy["gioi-thieu"]["text-13"]}</span><svg viewBox="0 0 210 55" fill="none" aria-hidden="true"><path d="M7 42C55 8 66 5 55 27S26 63 36 42 77 9 73 30 64 51 79 37 94 20 91 37 110 18 115 35 132 20 138 36 155 22 161 34 181 27 199 28M42 48C98 39 145 47 192 39"/></svg></div><div className="ca-document-status"><ShieldCheck size={23}/><div><strong>{copy["gioi-thieu"]["text-14"]}</strong><span>{copy["gioi-thieu"]["text-15"]}</span></div><Check size={20}/></div></div><div className="ca-floating-shield"><Fingerprint size={38}/></div><div className="ca-visual-bottom"><span>{copy["gioi-thieu"]["text-16"]}</span><ArrowRight size={15}/><span>{copy["gioi-thieu"]["text-17"]}</span><ArrowRight size={15}/><span>{copy["gioi-thieu"]["text-18"]}</span></div></div>
      </section>
      <section className="ca-reasons-section" aria-labelledby="ca-reasons-title"><div className="wrap ca-section"><div className="ca-section-heading"><div><div className="eyebrow red">{copy["ca-reasons-section"]["text-1"]}</div><h2 id="ca-reasons-title">{copy["ca-reasons-section"]["text-2"]}<br/><span>{copy["ca-reasons-section"]["text-3"]}</span></h2></div><p>{copy["ca-reasons-section"]["text-4"]}</p></div><div className="ca-reasons">{reasons.map((r,i)=><article key={r.title}><div className="ca-reason-top"><r.icon size={28}/><span>0{i+1}</span></div><h3>{r.title}</h3><p>{r.text}</p></article>)}</div></div></section>
      <section className="wrap ca-section" id="tinh-nang"><div className="ca-section-heading"><div><div className="eyebrow red">{copy["tinh-nang"]["text-1"]}</div><h2>{copy["tinh-nang"]["text-2"]}<br/><span>{copy["tinh-nang"]["text-3"]}</span></h2></div><p>{copy["tinh-nang"]["text-4"]}</p></div><div className="ca-feature-grid"><article className="ca-feature ca-feature-red"><div className="ca-feature-top"><Scale size={31}/><span>01</span></div><h3>{copy["tinh-nang"]["text-5"]}<br/>{copy["tinh-nang"]["text-6"]}</h3><p>{copy["tinh-nang"]["text-7"]}</p><a href="#co-so-phap-ly">{copy["tinh-nang"]["text-8"]}<ArrowDown size={16}/></a></article><article className="ca-feature"><div className="ca-feature-top"><LockKeyhole size={31}/><span>02</span></div><h3>{copy["tinh-nang"]["text-9"]}<br/>{copy["tinh-nang"]["text-10"]}</h3><p>{copy["tinh-nang"]["text-11"]}</p><span className="ca-feature-label">{copy["tinh-nang"]["text-12"]}</span></article><article className="ca-feature"><div className="ca-feature-top"><Layers3 size={31}/><span>03</span></div><h3>{copy["tinh-nang"]["text-13"]}<br/>{copy["tinh-nang"]["text-14"]}</h3><p>{copy["tinh-nang"]["text-15"]}</p><span className="ca-feature-label">{copy["tinh-nang"]["text-16"]}</span></article></div>
        <aside className="ca-legal" id="co-so-phap-ly"><Scale size={24}/><div><h3>{copy["tinh-nang"]["text-17"]}</h3><p>{copy["tinh-nang"]["text-18"]}<a href="https://vanban.chinhphu.vn/?classid=1&docid=208421&pageid=27160&typegroupid=3" target="_blank" rel="noopener noreferrer">{copy["tinh-nang"]["text-19"]}</a>{copy["tinh-nang"]["text-20"]}<a href="https://chinhphu.vn/?classid=1&docid=212829&pageid=27160&typegroupid=4" target="_blank" rel="noopener noreferrer">{copy["tinh-nang"]["text-21"]}</a>.</p></div></aside>
      </section>
      <section className="ca-applications-section" aria-labelledby="ca-app-title"><div className="wrap ca-section"><div className="ca-section-heading"><div><div className="eyebrow red">{copy["ca-applications-section"]["text-1"]}</div><h2 id="ca-app-title">{copy["ca-applications-section"]["text-2"]}<br/><span>{copy["ca-applications-section"]["text-3"]}</span></h2></div><div className="ca-app-heading-icon"><Fingerprint size={58}/></div></div><div className="ca-applications">{applications.map(a=><article key={a.title}><a.icon size={30}/><h3>{a.title}</h3><p>{a.text}</p></article>)}</div><p className="ca-small-note">{copy["ca-applications-section"]["text-4"]}</p></div></section>
      <section className="wrap ca-section ca-advantages" id="uu-diem"><div className="ca-advantages-copy"><div className="eyebrow red">{copy["uu-diem"]["text-1"]}</div><h2>{copy["uu-diem"]["text-2"]}<br/><span>{copy["uu-diem"]["text-3"]}</span></h2><p>{copy["uu-diem"]["text-4"]}</p><div className="ca-methods"><span><Usb size={25}/>{copy["uu-diem"]["text-5"]}</span><div/><span><Smartphone size={25}/>{copy["uu-diem"]["text-6"]}</span></div><a className="text-link" href={register}>{copy["uu-diem"]["text-7"]}</a></div><div className="ca-advantage-list">{advantages.map((a,i)=><article key={a.title}><span>0{i+1}</span><div><h3>{a.title}</h3><p>{a.text}</p></div><a.icon size={25}/></article>)}</div></section>
      <section className="ca-contact-section" id="lien-he"><div className="wrap ca-contact"><div><div className="eyebrow">{copy["lien-he"]["text-1"]}</div><h2>{copy["lien-he"]["text-2"]}<br/>{copy["lien-he"]["text-3"]}<br/>{copy["lien-he"]["text-4"]}</h2><p>{copy["lien-he"]["text-5"]}</p><a className="btn ca-white-btn" href={register}>{copy["lien-he"]["text-6"]}</a></div><aside className="ca-contact-person"><div className="ca-contact-photo"><img src={media.promotionPortrait} alt={`${contact.name} tại văn phòng Viettel – ảnh do người dùng cung cấp`} width={853} height={1280} loading="lazy"/></div><div className="ca-person-info"><small>{contact.role.toUpperCase()}</small><h3>{contact.name}</h3><a className="ca-phone" href={phone}><Phone size={21}/>{contact.hotline}</a><p>{copy["lien-he"]["text-7"]}</p><a className="ca-official" href="https://viettel.vn/viettel-ca" target="_blank" rel="noopener noreferrer">{copy["lien-he"]["text-8"]}</a></div></aside></div></section>
      <div className="wrap ca-bottom-nav"><a href="/#solutions"><ArrowLeft size={16}/>{copy["general"]["text-11"]}</a><a href="#gioi-thieu">{copy["general"]["text-12"]}</a></div>
    </main>
    <footer className="ca-footer"><div className="wrap"><strong>{copy["general"]["text-13"]}</strong><span>{copy["general"]["text-14"]}</span><a href={phone}>{contact.name} · {contact.hotline}</a></div></footer>

  </div>;
}
