"use client";
import { useSite } from "./site-provider";
import { phoneDigits } from "../lib/site-data";

import {useState,type KeyboardEvent} from "react";
import {ArrowLeft,Check,ChevronDown,Phone} from "lucide-react";
import {INVOICE_PRICE_REFERENCE,formatInvoicePrice,formatInvoiceQuantity,invoiceTaxNote,type InvoicePriceItem} from "../lib/invoice-pricing";
import "../app/invoice-pricing.css";

function registrationUrl(item:InvoicePriceItem){return `/?solution=hoadon&invoice_quote=${encodeURIComponent(item.id)}#register`;}

export default function InvoicePricing(){
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
    <a className="skip-link" href="#invoice-pricing-main">Đến bảng giá</a>
    <div className="topline"><div className="wrap"><span>Bộ giải pháp chuyển đổi số Viettel</span><span className="private-label">Báo giá S-Invoice</span><a href={phone}><Phone size={13}/>{contact.hotline}</a></div></div>
    <header className="header"><div className="wrap header-inner iq-header"><a className="brand brand-text" href="/">VIETTEL ĐỒNG NAI</a><a href="/hoa-don-dien-tu"><ArrowLeft size={17}/>Giới thiệu S-Invoice</a></div></header>
    <main id="invoice-pricing-main" className="iq-main">
      <div className="iq-title"><span className="eyebrow red">HÓA ĐƠN ĐIỆN TỬ VIETTEL</span><h1>BẢNG GIÁ <span>S-INVOICE</span></h1><p>Chọn số lượng hóa đơn hoặc gói kết hợp chữ ký số phù hợp với nhu cầu.</p></div>
      <div role="tablist" aria-label="Loại gói hóa đơn" className="iq-tabs">{(["single","combo"] as const).map(tab=><button key={tab} type="button" role="tab" id={`invoice-tab-${tab}`} aria-controls={`invoice-panel-${tab}`} aria-selected={kind===tab} tabIndex={kind===tab?0:-1} onKeyDown={changeTab} onClick={()=>setKind(tab)}>{tab==="single"?"ĐƠN LẺ":"COMBO"}</button>)}</div>
      <section id="invoice-panel-single" role="tabpanel" aria-labelledby="invoice-tab-single" hidden={kind!=="single"} tabIndex={0}>
        <div className="iq-section-meta"><span>GÓI HÓA ĐƠN ĐIỆN TỬ</span><span>{singles.length} lựa chọn</span></div>
        <div className="iq-grid">{singles.map(item=><article className={`iq-card${item.id==="single-3000"?" iq-card-highlight":""}`} key={item.id} data-invoice-id={item.id}>
          <h2>{item.name}</h2><p className="iq-price">{formatInvoicePrice(item.price)}</p><p className="iq-description">{formatInvoiceQuantity(item.quantity)} hóa đơn điện tử</p>
          <ul><li><Check size={20}/><span>Số lượng: <strong>{formatInvoiceQuantity(item.quantity)}</strong></span></li>{item.audience&&<li><Check size={20}/><span>Đối tượng: {item.audience}</span></li>}<li><Check size={20}/><span>{invoiceTaxNote(item)}</span></li></ul>
          <a className="btn btn-red iq-register" href={registrationUrl(item)} aria-label={`Đăng ký ngay ${item.name}`}>Đăng ký ngay</a>
        </article>)}</div>
      </section>
      <section id="invoice-panel-combo" role="tabpanel" aria-labelledby="invoice-tab-combo" hidden={kind!=="combo"} tabIndex={0}>
        <div className="iq-section-meta"><span>VIETTEL-CA + HÓA ĐƠN ĐIỆN TỬ</span><span>{combos.length} nhóm · {prices.hoadon.length-singles.length} gói</span></div>
        <div className="iq-combo-groups">{combos.map((group,index)=><details key={group.id} open={index===0} className="iq-combo-group"><summary><span>{group.title}</span><ChevronDown size={24}/></summary><div className="iq-combo-rows"><div className="iq-combo-table-heading" aria-hidden="true"><span>Gói hóa đơn</span><span>Giá gói</span><span>Đăng ký tư vấn</span></div>{group.plans.map(item=><article className="iq-combo-row" key={item.id} data-invoice-id={item.id}><h3>{formatInvoiceQuantity(item.quantity)}<span>hóa đơn điện tử</span></h3><div className="iq-combo-price">{item.referencePrice !== undefined && <del aria-label={`Giá tham khảo ${formatInvoicePrice(item.referencePrice)}`}>{formatInvoicePrice(item.referencePrice)}</del>}<strong>{formatInvoicePrice(item.price)}</strong></div><a className="btn btn-red iq-register" href={registrationUrl(item)} aria-label={`Đăng ký ngay ${item.name}`}>Đăng ký ngay</a></article>)}</div></details>)}</div>
        <p className="iq-combo-note">Giá gạch ngang và giá gói được giữ theo bảng tham khảo. Thuế và điều kiện áp dụng của combo được xác nhận khi tư vấn.</p>
      </section>
      <aside className="iq-contact"><Phone size={28}/><div><strong>Cần hỗ trợ chọn gói?</strong><p>{contact.name} · {contact.role}</p></div><a href={phone}>{contact.hotline}</a></aside>
      <p className="iq-source">Bảng giá tham khảo từ <a href={INVOICE_PRICE_REFERENCE} target="_blank" rel="noopener noreferrer">trang mẫu</a> (mốc cập nhật ghi trên nguồn: 05/11/2026). Thuế và điều kiện được xác nhận khi tư vấn. Các mức giá có thể thay đổi.</p>
    </main>
    <footer className="iq-footer"><a href="/hoa-don-dien-tu"><ArrowLeft size={17}/>Giới thiệu Hóa đơn điện tử</a><a href="/?solution=hoadon#register">Đăng ký tư vấn</a></footer>
  </div>;
}
