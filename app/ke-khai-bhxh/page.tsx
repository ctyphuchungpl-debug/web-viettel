import { notFound } from "next/navigation";
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




export default async function VbhxhPage(){
  const {contact, media, pageContent, serviceCatalog} = await getPublicSite();
  if(!serviceCatalog.some(item=>item.id==="bhxh"))notFound();
  const copy = pageContent["bhxh"];
const reasons=[
  {icon:Signal,title:copy["list-reasons"]["text-1"],text:copy["list-reasons"]["text-2"]},
  {icon:Award,title:copy["list-reasons"]["text-3"],text:copy["list-reasons"]["text-4"]},
  {icon:PenLine,title:copy["list-reasons"]["text-5"],text:copy["list-reasons"]["text-6"]},
  {icon:Blocks,title:copy["list-reasons"]["text-7"],text:copy["list-reasons"]["text-8"]},
  {icon:Headphones,title:copy["list-reasons"]["text-9"],text:copy["list-reasons"]["text-10"]},
];
const features=[
  {icon:UsersRound,title:copy["list-features"]["text-1"],text:copy["list-features"]["text-2"]},
  {icon:ClipboardList,title:copy["list-features"]["text-3"],text:copy["list-features"]["text-4"]},
  {icon:Send,title:copy["list-features"]["text-5"],text:copy["list-features"]["text-6"]},
  {icon:Inbox,title:copy["list-features"]["text-7"],text:copy["list-features"]["text-8"]},
  {icon:FileSearch,title:copy["list-features"]["text-9"],text:copy["list-features"]["text-10"]},
  {icon:FileOutput,title:copy["list-features"]["text-11"],text:copy["list-features"]["text-12"]},
];
const advantages=[
  {icon:Timer,title:copy["list-advantages"]["text-1"],text:copy["list-advantages"]["text-2"]},
  {icon:FileCheck2,title:copy["list-advantages"]["text-3"],text:copy["list-advantages"]["text-4"]},
  {icon:MousePointerClick,title:copy["list-advantages"]["text-5"],text:copy["list-advantages"]["text-6"]},
  {icon:ClipboardCheck,title:copy["list-advantages"]["text-7"],text:copy["list-advantages"]["text-8"]},
];

  const phone = "tel:" + phoneDigits(contact.hotline);
return <div className="bh-page">
  <a className="skip-link" href="#bh-main">{copy["general"]["text-1"]}</a>
  <div className="topline"><div className="wrap"><span>{copy["general"]["text-2"]}</span><span className="private-label">{copy["general"]["text-3"]}</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
  <header className="header"><div className="wrap header-inner bh-header"><a className="brand brand-text" href="/">{copy["general"]["text-4"]}</a><nav className="bh-nav" aria-label="Điều hướng vBHXH"><a href="#gioi-thieu">{copy["general"]["text-5"]}</a><a href="#tinh-nang">{copy["general"]["text-6"]}</a><a href="#uu-diem">{copy["general"]["text-7"]}</a></nav><a className="btn btn-red header-cta" href={price}>{copy["general"]["text-8"]}</a></div></header>
  <main id="bh-main">
    <section className="bh-banner" aria-labelledby="bh-title"><div className="wrap bh-banner-grid"><div className="bh-banner-copy"><a className="bh-back" href="/#solutions"><ArrowLeft size={15}/>{copy["bh-banner"]["text-1"]}</a><span className="bh-kicker">{copy["bh-banner"]["text-2"]}</span><h1 id="bh-title">{copy["bh-banner"]["text-3"]}<br/>{copy["bh-banner"]["text-4"]}<span>{copy["bh-banner"]["text-5"]}</span></h1><div className="bh-banner-points"><span><Check size={22}/>{copy["bh-banner"]["text-6"]}</span><span><Check size={22}/>{copy["bh-banner"]["text-7"]}</span></div><img className="bh-logo" src="/assets/vbhxh-logo.png" width={200} height={86} alt={copy["bh-banner"]["text-8"]}/></div><div className="bh-banner-photo"><img src={media.promotionPortrait} width={853} height={1280} alt={`${contact.name} tại Viettel – ảnh do người dùng cung cấp`}/><div className="bh-advisor"><span>{contact.role.toUpperCase()}</span><strong>{contact.name}</strong><a href={phone}><Phone size={21}/>{contact.hotline}</a></div></div></div></section>
    <section className="wrap bh-intro" id="gioi-thieu"><span className="bh-section-label">{copy["gioi-thieu"]["text-1"]}</span><h2>{copy["gioi-thieu"]["text-2"]}</h2><p>{copy["gioi-thieu"]["text-3"]}</p><div className="bh-actions"><a className="bh-hotline" href={phone}><span>{copy["gioi-thieu"]["text-4"]}</span><Phone size={25}/><strong>{contact.hotline}</strong></a><a className="btn bqp-intro-price" href={price}>{copy["gioi-thieu"]["text-5"]}</a><a className="btn btn-red" href={register}>{copy["gioi-thieu"]["text-6"]}</a></div></section>
    <section className="wrap bh-section" id="ly-do"><div className="bh-heading"><span className="bh-section-label">{copy["ly-do"]["text-1"]}</span><h2>{copy["ly-do"]["text-2"]}<br/>{copy["ly-do"]["text-3"]}</h2></div><div className="bh-reasons">{reasons.map(item=><article key={item.title}><span className="bh-reason-icon"><item.icon size={61} strokeWidth={1.3}/></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="bh-features-section" id="tinh-nang"><div className="wrap bh-heading"><span className="bh-section-label">{copy["tinh-nang"]["text-1"]}</span><h2>{copy["tinh-nang"]["text-2"]}</h2></div><div className="bh-feature-grid">{features.map((item,index)=><article className={`bh-feature bh-feature-${index+1}`} key={item.title}><item.icon className="bh-watermark" aria-hidden="true"/><div className="bh-feature-inner"><span className="bh-feature-icon"><item.icon size={42} strokeWidth={1.4}/></span><div><span className="bh-feature-number">0{index+1}</span><h3>{item.title}</h3><p>{item.text}</p></div></div></article>)}</div></section>
    <section className="wrap bh-section" id="uu-diem"><div className="bh-heading"><span className="bh-section-label">{copy["uu-diem"]["text-1"]}</span><h2>{copy["uu-diem"]["text-2"]}</h2></div><div className="bh-advantages">{advantages.map(item=><article key={item.title}><span><item.icon size={47} strokeWidth={1.4}/></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="bh-help-section"><div className="wrap bh-help"><div><span className="bh-section-label">{copy["bh-help-section"]["text-1"]}</span><h2>{copy["bh-help-section"]["text-2"]}<br/> {copy["bh-help-section"]["text-3"]}</h2></div><div className="bh-help-links"><a href="https://viettel-ca.vn/ho-tro/vbhxh/huong-dan-su-dung" target="_blank" rel="noopener noreferrer"><BookOpen size={30}/><span><strong>{copy["bh-help-section"]["text-4"]}</strong><small>{copy["bh-help-section"]["text-5"]}</small></span></a><a href={register}><Headphones size={30}/><span><strong>{copy["bh-help-section"]["text-6"]}</strong><small>{copy["bh-help-section"]["text-7"]}{contact.name}</small></span></a></div></div></section>
    <section className="wrap bh-contact"><div><span className="bh-section-label">{copy["wrap"]["text-1"]}</span><h2>{copy["wrap"]["text-2"]}<br/> {copy["wrap"]["text-3"]}</h2><p>{copy["wrap"]["text-4"]}</p></div><div className="bh-contact-actions"><a href={phone}><Phone size={32}/>{contact.hotline}</a><a className="btn btn-red" href={price}>{copy["wrap"]["text-5"]}</a></div></section>
    <div className="wrap bh-source"><p>{copy["general"]["text-9"]}<a href={source} target="_blank" rel="noopener noreferrer">{copy["general"]["text-10"]}</a> {copy["general"]["text-11"]}<a href="https://sme.viettel.vn/market-place/detail/VBHXH" target="_blank" rel="noopener noreferrer">{copy["general"]["text-12"]}</a>.</p><a href="/#solutions"><ArrowLeft size={16}/>{copy["general"]["text-13"]}</a><a href="#bh-title">{copy["general"]["text-14"]}</a></div>
  </main>
  <footer className="bh-footer"><div className="wrap"><strong>{copy["general"]["text-15"]}</strong><span>{copy["general"]["text-16"]}</span><a href={phone}>{contact.name} · {contact.hotline}</a></div></footer>

</div>;}
