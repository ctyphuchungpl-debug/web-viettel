"use client";
import { useSite } from "./site-provider";
import { phoneDigits } from "../lib/site-data";
import {useState} from "react";
import {ArrowLeft,ChevronDown,Info,Phone,UsersRound} from "lucide-react";
import {BHXH_GROUPS,BHXH_PRICE_REFERENCE,BHXH_SOURCE_UPDATED,bhxhActionLabel,bhxhRegistrationUrl,formatBhxhPrice,type BhxhAction,type BhxhKind,type BhxhPriceItem} from "../lib/bhxh-pricing";
import "../app/bhxh-pricing.css";

function PlanCard({item}:{item:BhxhPriceItem}){return <article className={`bqp-card${item.trial?" bqp-trial":""}${item.kind==="combo"?" bqp-combo":""}`} data-bhxh-id={item.id}>
  <div className="bqp-card-tags"><span>{bhxhActionLabel(item.action)}</span><span>{item.trial?"DÙNG THỬ":item.kind==="single"?"ĐƠN LẺ":"COMBO"}</span></div>
  <h3>{item.kind==="combo"?"Viettel-CA + vBHXH":item.name}</h3>
  <p className="bqp-duration">{item.kind==="combo"?"Viettel-CA: ":"Sử dụng: "}<strong>{item.months} tháng</strong></p>
  <div className="bqp-price-block">{item.referencePrice!==undefined&&<del aria-label={`Giá tham khảo ${formatBhxhPrice(item.referencePrice)}`}>{formatBhxhPrice(item.referencePrice)}</del>}<p>{formatBhxhPrice(item.price)}</p></div>
  <p className="bqp-tax">{item.kind==="single"?"Không chịu VAT":"Thuế và thời hạn BHXH: xác nhận khi tư vấn"}</p>
  <details className="bqp-plan-details"><summary>Thông tin gói<ChevronDown size={19}/></summary><ul>{item.details.map(line=><li key={line}>{line}</li>)}</ul></details>
  <a className="btn btn-red bqp-register" href={bhxhRegistrationUrl(item)} aria-label={`Đăng ký ${item.name} — ${item.months} tháng — ${formatBhxhPrice(item.price)}`}>Đăng ký ngay</a>
</article>;}

export default function BhxhPricing(){
  const {contact, prices} = useSite();
  const phone = "tel:" + phoneDigits(contact.hotline);

  const [kind,setKind]=useState<BhxhKind>("single");
  const [action,setAction]=useState<BhxhAction>("new");
  const plans=prices.bhxh.filter(item=>item.kind===kind&&item.action===action);
  return <div className="bqp-page"><a className="skip-link" href="#bhxh-pricing-main">Đến bảng giá</a>
    <div className="topline"><div className="wrap"><span>Bộ giải pháp chuyển đổi số Viettel</span><span className="private-label">Báo giá vBHXH</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner bqp-header"><a className="brand brand-text" href="/">VIETTEL ĐỒNG NAI</a><a href="/ke-khai-bhxh"><ArrowLeft size={17}/>Giới thiệu vBHXH</a></div></header>
    <main className="bqp-main" id="bhxh-pricing-main"><div className="bqp-title"><span className="eyebrow red">PHẦN MỀM KÊ KHAI BẢO HIỂM XÃ HỘI</span><h1>BẢNG GIÁ vBHXH</h1><p>Chọn số lao động, loại gói và nhu cầu cấp mới hoặc gia hạn.</p></div>
      <nav className="bqp-group-nav" aria-label="Nhóm số lao động">{BHXH_GROUPS.map(group=><a key={group.id} href={`#bhxh-group-${group.id}`}><UsersRound size={24}/>{group.label}</a>)}</nav>
      <div className="bqp-filters"><fieldset><legend>LOẠI GÓI DỊCH VỤ</legend><div className="bqp-segment">{(["single","combo"] as const).map(value=><label key={value}><input type="radio" name="bhxh-kind" value={value} checked={kind===value} onChange={()=>setKind(value)}/><span>{value==="single"?"ĐƠN LẺ":"COMBO"}</span></label>)}</div></fieldset><fieldset><legend>NHU CẦU ĐĂNG KÝ</legend><div className="bqp-segment">{(["new","renew"] as const).map(value=><label key={value}><input type="radio" name="bhxh-action" value={value} checked={action===value} onChange={()=>setAction(value)}/><span>{bhxhActionLabel(value)}</span></label>)}</div></fieldset></div>
      <aside className="bqp-note"><Info size={23}/><p>Một số gói cùng số lao động và thời hạn có tên, giá khác nhau trên bảng mẫu. Các gói được giữ riêng; gói áp dụng sẽ được xác nhận khi tư vấn.</p></aside>
      <div className="bqp-result" role="status" aria-live="polite">{kind==="single"?"Đơn lẻ":"Combo Viettel-CA + vBHXH"} · {bhxhActionLabel(action)} · {plans.length} gói trong 4 nhóm</div>
      {BHXH_GROUPS.map((group,index)=><section className="bqp-group" id={`bhxh-group-${group.id}`} key={group.id} aria-labelledby={`bhxh-group-title-${group.id}`}><div className="bqp-group-heading"><span>0{index+1}</span><div><h2 id={`bhxh-group-title-${group.id}`}>{group.label}</h2><p>{group.description}</p></div><strong>{bhxhActionLabel(action)}<small>{kind==="single"?"Đơn lẻ":"Combo"}</small></strong></div><div className="bqp-grid">{plans.filter(item=>item.group===group.id).map(item=><PlanCard key={item.id} item={item}/>)}</div></section>)}
      <aside className="bqp-contact"><Phone size={28}/><div><strong>Vui cùng bạn chọn gói phù hợp.</strong><p>{contact.name} · {contact.role}</p></div><a href={phone}>{contact.hotline}</a></aside>
      <p className="bqp-source">Giá và thông tin theo <a href={BHXH_PRICE_REFERENCE} target="_blank" rel="noopener noreferrer">trang tham khảo</a> · Mốc cập nhật ghi trên nguồn: {BHXH_SOURCE_UPDATED}. Giá gạch ngang của combo là giá tham khảo theo nguồn. Xác nhận giá, thuế và điều kiện áp dụng trước khi sử dụng.</p>
    </main><footer className="bqp-footer"><a href="/ke-khai-bhxh"><ArrowLeft size={17}/>Giới thiệu Kê khai BHXH</a><a href="/?solution=bhxh#register">Đăng ký tư vấn</a></footer>
  </div>;
}
