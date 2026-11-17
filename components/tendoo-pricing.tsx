"use client";
import { useSite } from "./site-provider";
import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { TENDOO_PRICE_REFERENCE, TENDOO_PRICE_SOURCE, formatTendooPrice, type TendooPriceItem } from "../lib/tendoo-pricing";

type Props = { onClose: () => void; onChoose: (item: TendooPriceItem) => void };
function searchable(value: string) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d"); }
export default function TendooPricing({ onClose, onChoose }: Props) {
  const copy = useSite().pageContent["price-tendoo"];

  const dialog = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<"plans" | "devices">("plans");
  const [query, setQuery] = useState("");
  const [minimum, setMinimum] = useState("0");
  const [maximum, setMaximum] = useState("50000000");
  const [duration, setDuration] = useState("all");
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (element && !element.open) element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = previousOverflow; previous?.focus({ preventScroll: true }); };
  }, []);
  const low = minimum === "" ? 0 : Math.max(0, Number(minimum));
  const high = maximum === "" ? Infinity : Math.max(0, Number(maximum));
  const invalidRange = low > high;
  const items = useSite().prices.tendoo.filter(item => item.kind === (tab === "plans" ? "plan" : "device"));
  const durations = [...new Set(items.map(item => item.duration))];
  const results = useMemo(() => items.filter(item => !invalidRange && searchable(item.name).includes(searchable(query.trim())) && item.price >= low && item.price <= high && (duration === "all" || item.duration === duration)), [items, invalidRange, query, low, high, duration]);
  function reset() { setQuery(""); setMinimum("0"); setMaximum("50000000"); setDuration("all"); }
  function changeTab(next: "plans" | "devices") { setTab(next); setDuration("all"); }
  return <dialog ref={dialog} className="tq-dialog" aria-labelledby="tq-title" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="tq-header"><h2 id="tq-title">{copy["general"]["text-1"]}</h2><button type="button" className="tq-close" aria-label="Đóng bảng giá Tendoo" onClick={onClose}><X size={25}/></button><div className="tq-tabs" role="tablist" aria-label="Nhóm giá Tendoo">{[{id:"plans" as const,label:"GÓI TENDOO"},{id:"devices" as const,label:"DANH SÁCH THIẾT BỊ"}].map(t => <button type="button" key={t.id} role="tab" id={`tq-tab-${t.id}`} aria-selected={tab===t.id} aria-controls="tq-panel" tabIndex={tab===t.id?0:-1} className={tab===t.id?"active":""} onClick={() => changeTab(t.id)} onKeyDown={e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();const next=tab==="plans"?"devices":"plans";changeTab(next);document.getElementById(`tq-tab-${next}`)?.focus();}}}>{t.label}</button>)}</div></div>
    <div className="tq-body"><aside className="tq-filters" aria-label="Bộ lọc bảng giá"><div className="tq-filter-heading"><h3>{copy["general"]["text-2"]}</h3><button className="tq-reset" type="button" onClick={reset}><RotateCcw size={14}/>{copy["general"]["text-3"]}</button></div><div className="tq-filter-fields"><label className="tq-search" htmlFor="tq-search">{copy["general"]["text-4"]}<input id="tq-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={copy["general"]["text-5"]} autoComplete="off"/></label><label htmlFor="tq-min">{copy["general"]["text-6"]}<input id="tq-min" type="number" inputMode="numeric" min="0" step="1000" value={minimum} onChange={e=>setMinimum(e.target.value)}/></label><label htmlFor="tq-max">{copy["general"]["text-7"]}<input id="tq-max" type="number" inputMode="numeric" min="0" step="1000" value={maximum} onChange={e=>setMaximum(e.target.value)}/></label><label className="tq-duration" htmlFor="tq-duration">{copy["general"]["text-8"]}<select id="tq-duration" value={duration} onChange={e=>setDuration(e.target.value)}><option value="all">{copy["general"]["text-9"]}</option>{durations.map(d=><option key={d}>{d}</option>)}</select></label></div>{invalidRange&&<p className="tq-range-error" role="alert">{copy["general"]["text-10"]}</p>}</aside><section className="tq-results" id="tq-panel" role="tabpanel" aria-labelledby={`tq-tab-${tab}`}><p className="tq-result-count" aria-live="polite">{copy["tq-panel"]["text-1"]}<strong>{results.length}</strong> {copy["tq-panel"]["text-2"]}</p><div className="tq-grid">{results.map((item,i)=><article className={`tq-card${i===0?" tq-card-first":""}`} key={item.id} data-price-id={item.id}><h3>{item.name}</h3><p className="tq-period">{copy["tq-panel"]["text-3"]}<span>{item.duration}</span></p><p className="tq-price">{formatTendooPrice(item.price)}</p><p className="tq-vat">({item.vatNote})</p><button type="button" className="btn btn-red tq-register" aria-label={`Đăng ký ngay ${item.name}`} onClick={()=>onChoose(item)}>{copy["tq-panel"]["text-4"]}</button></article>)}</div>{results.length===0&&<div className="tq-empty"><h3>{copy["tq-panel"]["text-5"]}</h3><p>{copy["tq-panel"]["text-6"]}</p><button className="btn btn-red" type="button" onClick={reset}>{copy["tq-panel"]["text-7"]}<RotateCcw size={16}/></button></div>}</section></div>
    <p className="tq-source">{copy["general"]["text-11"]}<a href={TENDOO_PRICE_REFERENCE} target="_blank" rel="noopener noreferrer">{copy["general"]["text-12"]}</a> {copy["general"]["text-13"]}<strong>05/11/2026</strong> · <a href={TENDOO_PRICE_SOURCE} target="_blank" rel="noopener noreferrer">{copy["general"]["text-14"]}</a>{copy["general"]["text-15"]}</p>
  </dialog>;
}
