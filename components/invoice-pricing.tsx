"use client";
import { useSite } from "./site-provider";
import { phoneDigits } from "../lib/site-data";

import {useState,type KeyboardEvent} from "react";
import {ArrowLeft,Check,ChevronDown,Phone} from "lucide-react";
import {INVOICE_PRICE_REFERENCE,formatInvoicePrice,formatInvoiceQuantity,invoiceTaxNote,type InvoicePriceItem} from "../lib/invoice-pricing";
import "../app/invoice-pricing.css";

function registrationUrl(item:InvoicePriceItem){return `/?solution=hoadon&invoice_quote=${encodeURIComponent(item.id)}#register`;}

export default function InvoicePricing(){
  const copy = useSite().pageContent["price-hoadon"];

  const {contact, prices} = useSite();
  const phone = "tel:" + phoneDigits(contact.hotline);

  const singles = prices.hoadon.filter(item => item.kind === "single");
  const combos = [...new Set(prices.hoadon.filter(item => item.kind === "combo").map(item => item.caAction + "-" + item.caYears))].map(id => {
    const [action, years] = id.split("-");
    return { id, title: (action === "new" ? "Cấp mới" : "Gia hạn") + " Viettel-CA " + years + " năm + Hóa đơn điện tử", plans: prices.hoadon.filter(item => item.kind === "combo" && item.caAction + "-" + item.caYears === id) };
  });
  const [kind,setKind]=useState<"single"|"combo">("single");
  function changeTab(event:KeyboardEvent<HTMLButtonElement>){
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
    event.preventDefault();
    const next=event.key==="Home"?"single":event.key==="End"?"combo":kind==="single"?"combo":"single";
    setKind(next);
    requestAnimationFrame(()=>document.getElementById(`invoice-tab-${next}`)?.focus());
  }
  return <div className="iq-page">
    <a className="skip-link" href="#invoice-pricing-main">{copy["general"]["text-1"]}</a>
    <div className="topline"><div className="wrap"><span>{copy["general"]["text-2"]}</span><span className="private-label">{copy["general"]["text-3"]}</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner iq-header"><a className="brand brand-text" href="/">{copy["general"]["text-4"]}</a><a href="/hoa-don-dien-tu"><ArrowLeft size={17}/>{copy["general"]["text-5"]}</a></div></header>
    <main id="invoice-pricing-main" className="iq-main">
      <div className="iq-title"><span className="eyebrow red">{copy["general"]["text-6"]}</span><h1>{copy["general"]["text-7"]}<span>{copy["general"]["text-8"]}</span></h1><p>{copy["general"]["text-9"]}</p></div>
      <div role="tablist" aria-label="Loại gói hóa đơn" className="iq-tabs">{(["single","combo"] as const).map(tab=><button key={tab} type="button" role="tab" id={`invoice-tab-${tab}`} aria-controls={`invoice-panel-${tab}`} aria-selected={kind===tab} tabIndex={kind===tab?0:-1} onKeyDown={changeTab} onClick={()=>setKind(tab)}>{tab==="single"?"ĐƠN LẺ":"COMBO"}</button>)}</div>
      <section id="invoice-panel-single" role="tabpanel" aria-labelledby="invoice-tab-single" hidden={kind!=="single"} tabIndex={0}>
        <div className="iq-section-meta"><span>{copy["invoice-panel-single"]["text-1"]}</span><span>{singles.length} {copy["invoice-panel-single"]["text-2"]}</span></div>
        <div className="iq-grid">{singles.map(item=><article className={`iq-card${item.id==="single-3000"?" iq-card-highlight":""}`} key={item.id} data-invoice-id={item.id}>
          <h2>{item.name}</h2><p className="iq-price">{formatInvoicePrice(item.price)}</p><p className="iq-description">{formatInvoiceQuantity(item.quantity)} {copy["invoice-panel-single"]["text-3"]}</p>
          <ul><li><Check size={20}/><span>{copy["invoice-panel-single"]["text-4"]}<strong>{formatInvoiceQuantity(item.quantity)}</strong></span></li>{item.audience&&<li><Check size={20}/><span>{copy["invoice-panel-single"]["text-5"]}{item.audience}</span></li>}<li><Check size={20}/><span>{invoiceTaxNote(item)}</span></li></ul>
          <a className="btn btn-red iq-register" href={registrationUrl(item)} aria-label={`Đăng ký ngay ${item.name}`}>{copy["invoice-panel-single"]["text-6"]}</a>
        </article>)}</div>
      </section>
      <section id="invoice-panel-combo" role="tabpanel" aria-labelledby="invoice-tab-combo" hidden={kind!=="combo"} tabIndex={0}>
        <div className="iq-section-meta"><span>{copy["invoice-panel-combo"]["text-1"]}</span><span>{combos.length} {copy["invoice-panel-combo"]["text-2"]}{prices.hoadon.length-singles.length} {copy["invoice-panel-combo"]["text-3"]}</span></div>
        <div className="iq-combo-groups">{combos.map((group,index)=><details key={group.id} open={index===0} className="iq-combo-group"><summary><span>{group.title}</span><ChevronDown size={24}/></summary><div className="iq-combo-rows"><div className="iq-combo-table-heading" aria-hidden="true"><span>{copy["invoice-panel-combo"]["text-4"]}</span><span>{copy["invoice-panel-combo"]["text-5"]}</span><span>{copy["invoice-panel-combo"]["text-6"]}</span></div>{group.plans.map(item=><article className="iq-combo-row" key={item.id} data-invoice-id={item.id}><h3>{formatInvoiceQuantity(item.quantity)}<span>{copy["invoice-panel-combo"]["text-7"]}</span></h3><div className="iq-combo-price">{item.referencePrice !== undefined && <del aria-label={`Giá tham khảo ${formatInvoicePrice(item.referencePrice)}`}>{formatInvoicePrice(item.referencePrice)}</del>}<strong>{formatInvoicePrice(item.price)}</strong></div><a className="btn btn-red iq-register" href={registrationUrl(item)} aria-label={`Đăng ký ngay ${item.name}`}>{copy["invoice-panel-combo"]["text-8"]}</a></article>)}</div></details>)}</div>
        <p className="iq-combo-note">{copy["invoice-panel-combo"]["text-9"]}</p>
      </section>
      <aside className="iq-contact"><Phone size={28}/><div><strong>{copy["general"]["text-10"]}</strong><p>{contact.name} · {contact.role}</p></div><a href={phone}>{contact.hotline}</a></aside>
      <p className="iq-source">{copy["general"]["text-11"]}<a href={INVOICE_PRICE_REFERENCE} target="_blank" rel="noopener noreferrer">{copy["general"]["text-12"]}</a> {copy["general"]["text-13"]}</p>
    </main>
    <footer className="iq-footer"><a href="/hoa-don-dien-tu"><ArrowLeft size={17}/>{copy["general"]["text-14"]}</a><a href="/?solution=hoadon#register">{copy["general"]["text-15"]}</a></footer>
  </div>;
}
