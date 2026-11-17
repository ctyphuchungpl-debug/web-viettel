"use client";
import { useSite } from "./site-provider";
import { phoneDigits } from "../lib/site-data";
import {useState} from "react";
import {ArrowLeft,ChevronDown,Info,Phone,UsersRound} from "lucide-react";
import {BHXH_GROUPS,BHXH_PRICE_REFERENCE,BHXH_SOURCE_UPDATED,bhxhActionLabel,bhxhRegistrationUrl,formatBhxhPrice,type BhxhAction,type BhxhKind,type BhxhPriceItem} from "../lib/bhxh-pricing";
import "../app/bhxh-pricing.css";

function PlanCard({item}:{item:BhxhPriceItem}){
  const copy = useSite().pageContent["price-bhxh"];
return <article className={`bqp-card${item.trial?" bqp-trial":""}${item.kind==="combo"?" bqp-combo":""}`} data-bhxh-id={item.id}>
  <div className="bqp-card-tags"><span>{bhxhActionLabel(item.action)}</span><span>{item.trial?"DÙNG THỬ":item.kind==="single"?"ĐƠN LẺ":"COMBO"}</span></div>
  <h3>{item.kind==="combo"?"Viettel-CA + vBHXH":item.name}</h3>
  <p className="bqp-duration">{item.kind==="combo"?"Viettel-CA: ":"Sử dụng: "}<strong>{item.months} {copy["general"]["text-1"]}</strong></p>
  <div className="bqp-price-block">{item.referencePrice!==undefined&&<del aria-label={`Giá tham khảo ${formatBhxhPrice(item.referencePrice)}`}>{formatBhxhPrice(item.referencePrice)}</del>}<p>{formatBhxhPrice(item.price)}</p></div>
  <p className="bqp-tax">{item.kind==="single"?"Không chịu VAT":"Thuế và thời hạn BHXH: xác nhận khi tư vấn"}</p>
  <details className="bqp-plan-details"><summary>{copy["general"]["text-2"]}<ChevronDown size={19}/></summary><ul>{item.details.map(line=><li key={line}>{line}</li>)}</ul></details>
  <a className="btn btn-red bqp-register" href={bhxhRegistrationUrl(item)} aria-label={`Đăng ký ${item.name} — ${item.months} tháng — ${formatBhxhPrice(item.price)}`}>{copy["general"]["text-3"]}</a>
</article>;}

export default function BhxhPricing(){
  const copy = useSite().pageContent["price-bhxh"];

  const {contact, prices} = useSite();
  const phone = "tel:" + phoneDigits(contact.hotline);

  const [kind,setKind]=useState<BhxhKind>("single");
  const [action,setAction]=useState<BhxhAction>("new");
  const plans=prices.bhxh.filter(item=>item.kind===kind&&item.action===action);
  return <div className="bqp-page"><a className="skip-link" href="#bhxh-pricing-main">{copy["general"]["text-4"]}</a>
    <div className="topline"><div className="wrap"><span>{copy["general"]["text-5"]}</span><span className="private-label">{copy["general"]["text-6"]}</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner bqp-header"><a className="brand brand-text" href="/">{copy["general"]["text-7"]}</a><a href="/ke-khai-bhxh"><ArrowLeft size={17}/>{copy["general"]["text-8"]}</a></div></header>
    <main className="bqp-main" id="bhxh-pricing-main"><div className="bqp-title"><span className="eyebrow red">{copy["general"]["text-9"]}</span><h1>{copy["general"]["text-10"]}</h1><p>{copy["general"]["text-11"]}</p></div>
      <nav className="bqp-group-nav" aria-label="Nhóm số lao động">{BHXH_GROUPS.map(group=><a key={group.id} href={`#bhxh-group-${group.id}`}><UsersRound size={24}/>{group.label}</a>)}</nav>
      <div className="bqp-filters"><fieldset><legend>{copy["general"]["text-12"]}</legend><div className="bqp-segment">{(["single","combo"] as const).map(value=><label key={value}><input type="radio" name="bhxh-kind" value={value} checked={kind===value} onChange={()=>setKind(value)}/><span>{value==="single"?"ĐƠN LẺ":"COMBO"}</span></label>)}</div></fieldset><fieldset><legend>{copy["general"]["text-13"]}</legend><div className="bqp-segment">{(["new","renew"] as const).map(value=><label key={value}><input type="radio" name="bhxh-action" value={value} checked={action===value} onChange={()=>setAction(value)}/><span>{bhxhActionLabel(value)}</span></label>)}</div></fieldset></div>
      <aside className="bqp-note"><Info size={23}/><p>{copy["general"]["text-14"]}</p></aside>
      <div className="bqp-result" role="status" aria-live="polite">{kind==="single"?"Đơn lẻ":"Combo Viettel-CA + vBHXH"} · {bhxhActionLabel(action)} · {plans.length} {copy["general"]["text-15"]}</div>
      {BHXH_GROUPS.map((group,index)=><section className="bqp-group" id={`bhxh-group-${group.id}`} key={group.id} aria-labelledby={`bhxh-group-title-${group.id}`}><div className="bqp-group-heading"><span>0{index+1}</span><div><h2 id={`bhxh-group-title-${group.id}`}>{group.label}</h2><p>{group.description}</p></div><strong>{bhxhActionLabel(action)}<small>{kind==="single"?"Đơn lẻ":"Combo"}</small></strong></div><div className="bqp-grid">{plans.filter(item=>item.group===group.id).map(item=><PlanCard key={item.id} item={item}/>)}</div></section>)}
      <aside className="bqp-contact"><Phone size={28}/><div><strong>{copy["general"]["text-16"]}</strong><p>{contact.name} · {contact.role}</p></div><a href={phone}>{contact.hotline}</a></aside>
      <p className="bqp-source">{copy["general"]["text-17"]}<a href={BHXH_PRICE_REFERENCE} target="_blank" rel="noopener noreferrer">{copy["general"]["text-18"]}</a> {copy["general"]["text-19"]}{BHXH_SOURCE_UPDATED}{copy["general"]["text-20"]}</p>
    </main><footer className="bqp-footer"><a href="/ke-khai-bhxh"><ArrowLeft size={17}/>{copy["general"]["text-21"]}</a><a href="/?solution=bhxh#register">{copy["general"]["text-22"]}</a></footer>
  </div>;
}
