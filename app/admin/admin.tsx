"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactFields, listFields, mediaFields, priceFields, visibilityFields, type Field } from "../../lib/admin-fields";
import { serviceNames, services, type ContentKey, type Service, type SiteContent } from "../../lib/site-data";

type Notice = { text: string; error: boolean };
type Entry = { id: string; enabled: boolean } & Record<string, unknown>;
type RecordData = Record<string, unknown>;
type AdminData = { data: SiteContent; revisions: Record<ContentKey,number> };
type Lead = {
  id:string; name:string; phone:string; email:string; company:string; note:string; products:string[];
  quotes:{service:string;name:string;price:number|null}[]; status:string; owner_email:string;customer_email:string;created_at:string;
};
const tabs = { contact:"Liên hệ", media:"Ảnh & poster", prices:"Gói cước", videos:"Video", faq:"FAQ", page:"Trang khách", leads:"Yêu cầu tư vấn" } as const;
type Tab = keyof typeof tabs;
const leadStatus: Record<string,string> = { new:"Mới", contacted:"Đã liên hệ", closed:"Đã xử lý" };
const mailStatus: Record<string,string> = { pending:"Đang gửi",sent:"Đã gửi",failed:"Gửi lỗi",unconfigured:"Chưa cấu hình",skipped:"Không có email" };

async function api<T>(path: string, method = "GET", data?: unknown): Promise<T> {
  const response = await fetch("/api/admin" + path, {
    method, cache:"no-store", signal:AbortSignal.timeout(25_000),
    ...(data !== undefined ? { headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) } : {})
  });
  const result = await response.json().catch(()=>({}));
  if (!response.ok) {
    if (response.status === 401 && path !== "?action=login") location.reload();
    throw new Error(result.error || "Không kết nối được máy chủ.");
  }
  return result as T;
}
const message = (error:unknown) => error instanceof Error && error.name !== "TimeoutError" ? error.message : "Kết nối quá lâu. Vui lòng thử lại.";
const formatPrice = (value:number|null) => value === null ? "Liên hệ báo giá" : new Intl.NumberFormat("vi-VN").format(value) + "đ";

function fresh(fields:Field[]):Entry {
  const entry:Entry = { id:crypto.randomUUID(), enabled:true };
  for (const field of fields) {
    if (field.optional && field.kind !== "image") continue;
    entry[field.key] = field.nullable ? null : field.kind === "number" ? 0 : field.kind === "check" ? false
      : field.kind === "select" ? field.options?.[0]?.[0] : field.kind === "lines" ? [] : "";
  }
  return entry;
}
function labelOf(item:Entry) { return String(item.name || item.title || item.q || "Mục mới"); }

async function encode(file: File): Promise<Blob> {
  if (file.size > 10_000_000) throw new Error("File ảnh tối đa 10 MB.");
  if (!["image/png","image/jpeg","image/webp"].includes(file.type)) throw new Error("Vui lòng chọn ảnh JPG, PNG hoặc WebP.");
  const bitmap = await createImageBitmap(file).catch(()=> { throw new Error("Không đọc được ảnh."); });
  try {
    if (bitmap.width * bitmap.height > 24_000_000) throw new Error("Ảnh tối đa 24 megapixel.");
    const scale = Math.min(1,1600/bitmap.width,2400/bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1,Math.round(bitmap.width*scale)); canvas.height = Math.max(1,Math.round(bitmap.height*scale));
    canvas.getContext("2d")!.drawImage(bitmap,0,0,canvas.width,canvas.height);
    const output = (quality:number) => new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",quality));
    let blob = await output(.9);
    if (blob && blob.size > 3*1024*1024) blob = await output(.8);
    if (!blob || blob.type !== "image/webp" || blob.size > 3*1024*1024) throw new Error("Không tạo được ảnh WebP đủ nhỏ.");
    return blob;
  } finally { bitmap.close(); }
}

function ImageField({ label, value, optional, change, report, lock }: {
  label:string;value:string;optional?:boolean;change:(value:string)=>void;report:(text:string,error?:boolean)=>void;lock:(pending:boolean)=>void;
}) {
  const file = useRef<HTMLInputElement>(null);
  const [uploading,setUploading] = useState(false);
  async function upload() {
    const selected = file.current?.files?.[0];
    if (!selected || uploading) return;
    setUploading(true); lock(true);
    try {
      report("Đang chuẩn bị ảnh…");
      const bytes = await encode(selected);
      const {url} = await api<{url:string}>("?action=image","POST",{});
      report("Đang tải ảnh lên Blob…");
      const response = await fetch(url,{method:"PUT",headers:{"x-vercel-blob-access":"public"},body:bytes,
        credentials:"omit",referrerPolicy:"no-referrer",signal:AbortSignal.timeout(40_000)});
      const result = await response.json().catch(()=>({}));
      if (!response.ok || typeof result.url !== "string") throw new Error("Tải ảnh lên Blob thất bại.");
      change(result.url);
      report("Đã tải ảnh. Bấm lưu để xuất bản.");
    } catch (error) { report(message(error),true); }
    finally { if (file.current) file.current.value = ""; setUploading(false); lock(false); }
  }
  return <div className="vui-field vui-image">
    <strong>{label}</strong>
    {value && <img src={value} alt={"Xem trước " + label} loading="lazy"/>}
    <div className="vui-actions">
      <input type="file" aria-label={"Chọn file " + label} accept="image/png,image/jpeg,image/webp" ref={file}
        onChange={upload} disabled={uploading}/>
      {optional && value && <button type="button" className="vui-secondary" onClick={()=>change("")} disabled={uploading}>Bỏ ảnh</button>}
    </div>
    <small>JPG, PNG, WebP · Tối đa 10 MB</small>
  </div>;
}

function Fields({ fields, record, change, report, lock }: {
  fields:Field[];record:RecordData;change:(key:string,value:unknown)=>void;report:(text:string,error?:boolean)=>void;lock:(pending:boolean)=>void;
}) {
  return <div className="vui-fields">{fields.map(field => {
    const value = record[field.key];
    if (field.kind === "image") return <ImageField key={field.key} label={field.label} value={String(value ?? "")}
      optional={field.optional} change={value=>change(field.key,value)} report={report} lock={lock}/>;
    if (field.kind === "check") return <label key={field.key} className="vui-check"><input type="checkbox" checked={Boolean(value)} onChange={e=>change(field.key,e.target.checked)}/>{field.label}</label>;
    const set = (input:string) => {
      if (field.kind === "lines") change(field.key,input.split("\n"));
      else if (field.kind === "number") change(field.key,input === "" ? field.nullable ? null : undefined : Number(input));
      else change(field.key,input === "" && field.optional ? undefined : input);
    };
    return <label key={field.key} className={"vui-field" + (field.kind === "lines" || field.kind === "area" ? " vui-wide" : "")}>
      {field.label}
      {field.kind === "select" ? <select value={String(value ?? "")} onChange={e=>set(e.target.value)}>
        {field.optional && <option value="">—</option>}{field.options?.map(([key,text])=><option key={key} value={key}>{text}</option>)}
      </select> : field.kind === "area" || field.kind === "lines" ? <textarea rows={4}
        value={Array.isArray(value) ? value.join("\n") : String(value ?? "")} onChange={e=>set(e.target.value)}/>
      : <input type={field.kind === "number" ? "number" : field.key === "email" ? "email" : "text"} min={field.kind === "number" ? 0 : undefined}
        value={String(value ?? "")} onChange={e=>set(e.target.value)}/>}
    </label>;
  })}</div>;
}

function ListEditor({ items, fields, set, report, lock }: {
  items:Entry[];fields:Field[];set:(items:Entry[])=>void;report:(text:string,error?:boolean)=>void;lock:(pending:boolean)=>void;
}) {
  const [editing,setEditing] = useState("");
  const item = items.find(entry=>entry.id === editing);
  function change(id:string,key:string,value:unknown) {
    set(items.map(entry=>entry.id===id ? {...entry,[key]:value}:entry));
  }
  function move(index:number, delta:number) {
    const copy=[...items];
    [copy[index],copy[index+delta]]=[copy[index+delta],copy[index]];
    set(copy);
  }
  return <>
    <button type="button" onClick={()=>{const row=fresh(fields);set([...items,row]);setEditing(row.id);}}>Thêm mới</button>
    {item && <section className="vui-row-editor" aria-label="Chỉnh sửa mục">
      <div className="vui-toolbar"><h2>{labelOf(item)}</h2><button className="vui-secondary" type="button" onClick={()=>setEditing("")}>Thu gọn</button></div>
      <Fields key={item.id} fields={fields} record={item} change={(key,value)=>change(item.id,key,value)} report={report} lock={lock}/>
    </section>}
    {!items.length && <p>Chưa có mục nào.</p>}
    <ul className="vui-list">{items.map((entry,index)=><li key={entry.id}>
      <strong>{labelOf(entry)}</strong>
      <div className="vui-actions">
        <label className="vui-check"><input type="checkbox" checked={entry.enabled} onChange={e=>change(entry.id,"enabled",e.target.checked)}/>Hiển thị</label>
        <button type="button" className="vui-secondary" onClick={()=>setEditing(entry.id)}>Sửa</button>
        <button type="button" className="vui-secondary" disabled={index===0} onClick={()=>move(index,-1)} aria-label={"Đưa lên "+labelOf(entry)}>↑</button>
        <button type="button" className="vui-secondary" disabled={index===items.length-1} onClick={()=>move(index,1)} aria-label={"Đưa xuống "+labelOf(entry)}>↓</button>
        <button type="button" className="vui-secondary vui-danger" onClick={()=>{
          if (confirm("Xóa “"+labelOf(entry)+"” khi lưu và xuất bản?")) {
            set(items.filter(value=>value.id!==entry.id));
            report("Đã đánh dấu xóa. Bấm lưu để xuất bản.");
          }
        }} aria-label={"Xóa "+labelOf(entry)}>Xóa</button>
      </div>
    </li>)}</ul>
  </>;
}

function Leads({ report }: { report:(text:string,error?:boolean)=>void }) {
  const [page,setPage] = useState(1), [rows,setRows] = useState<Lead[]>([]), [more,setMore] = useState(false);
  const [loading,setLoading] = useState(true), [version,refresh] = useState(0), [saving,setSaving] = useState("");
  useEffect(()=>{
    let active=true;
    setLoading(true);
    api<{rows:Lead[];more:boolean}>("?page="+page).then(result=>{
      if (active) {setRows(result.rows);setMore(result.more);}
    }).catch(error=>{if(active)report(message(error),true);}).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[page,version,report]);
  return <>
    <div className="vui-toolbar">
      <span>Trang {page}</span><div className="vui-actions">
        <button type="button" className="vui-secondary" onClick={()=>setPage(page-1)} disabled={loading || page===1}>Trang trước</button>
        <button type="button" className="vui-secondary" onClick={()=>setPage(page+1)} disabled={loading || !more}>Trang sau</button>
        <button type="button" className="vui-secondary" onClick={()=>refresh(version+1)} disabled={loading}>Làm mới</button>
      </div>
    </div>
    {loading ? <p>Đang tải yêu cầu…</p> : !rows.length ? <p>Chưa có yêu cầu tư vấn.</p> : <ul className="vui-leads">{rows.map(lead=><li key={lead.id}>
      <div><strong>{lead.name}</strong><p><a href={"tel:"+lead.phone}>{lead.phone}</a>{lead.email && <> · <a href={"mailto:"+lead.email}>{lead.email}</a></>}</p>
      {lead.company && <p>{lead.company}</p>}<small>Mã {lead.id}<br/>{new Date(lead.created_at).toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh"})}</small></div>
      <div><p>{lead.products.join(", ")}</p>{lead.quotes.map(quote=><p key={quote.service}>{quote.name} · {formatPrice(quote.price)}</p>)}{lead.note && <p>{lead.note}</p>}
      <small>Email chuyên viên: {mailStatus[lead.owner_email]} · Email khách: {mailStatus[lead.customer_email]}</small></div>
      <label>Trạng thái<select disabled={Boolean(saving)} value={lead.status} onChange={async event=>{
        const status=event.target.value;setSaving(lead.id);
        try {await api("","PATCH",{id:lead.id,status});setRows(rows=>rows.map(item=>item.id===lead.id ? {...item,status}:item));report("Đã cập nhật trạng thái.");}
        catch(error){report(message(error),true);}finally{setSaving("");}
      }}>{Object.entries(leadStatus).map(([key,text])=><option key={key} value={key}>{text}</option>)}</select></label>
    </li>)}</ul>}
  </>;
}

export function Admin({ authenticated, configured }: {authenticated:boolean;configured:boolean}) {
  const [tab,setTab] = useState<Tab>("contact"), [service,setService] = useState<Service>("tendoo");
  const [mediaMode,setMediaMode] = useState<"media"|"gallery">("media");
  const [pageMode,setPageMode] = useState<"visibility"|"blocks">("visibility");
  const [state,setState] = useState<AdminData|null>(null), [busy,setBusy] = useState(false), [uploading,setUploading] = useState(false);
  const [notice,setNotice] = useState<Notice|null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const report = useRef((text:string,error=false)=>{
    if (timer.current) clearTimeout(timer.current);
    setNotice({text,error});
    timer.current=setTimeout(()=>setNotice(null),10_000);
  }).current;
  const [dirty,setDirty] = useState<Set<ContentKey>>(new Set());
  const section = tab === "media" ? mediaMode : tab === "page" ? pageMode : tab === "leads" ? null : tab;

  useEffect(()=>{
    if (authenticated) api<AdminData>("").then(setState).catch(error=>report(message(error),true));
    return ()=>{if(timer.current)clearTimeout(timer.current);};
  },[authenticated,report]);
  useEffect(()=>{
    if (!dirty.size) return;
    const warn=(event:BeforeUnloadEvent)=>event.preventDefault();
    window.addEventListener("beforeunload",warn);
    return ()=>window.removeEventListener("beforeunload",warn);
  },[dirty]);

  function change(key:ContentKey, value:unknown) {
    setState(current=>current && ({...current,data:{...current.data,[key]:value}}));
    setDirty(keys=>new Set(keys).add(key));
  }

  async function save(event:FormEvent) {
    event.preventDefault();
    if (!section || !state || busy || uploading) return;
    setBusy(true);
    try {
      const data = section === "contact" ? {...state.data.contact,ticker:state.data.contact.ticker.map(line=>line.trim()).filter(Boolean)} : state.data[section];
      const saved=await api<{data:unknown;revision:number}>("","PUT",{section,data,revision:state.revisions[section]});
      setState(current=>current && ({data:{...current.data,[section]:saved.data},revisions:{...current.revisions,[section]:saved.revision}}));
      setDirty(keys=>{const next=new Set(keys);next.delete(section);return next;});report("Đã lưu và xuất bản.");
    } catch(error){report(message(error),true);} finally{setBusy(false);}
  }
  async function signIn(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);
    try {await api("?action=login","POST",Object.fromEntries(new FormData(event.currentTarget)));location.reload();}
    catch(error){report(message(error),true);setBusy(false);}
  }
  async function logout() {
    if (dirty.size && !confirm("Đăng xuất và bỏ thay đổi chưa lưu?")) return;
    try {await api("?action=logout","POST",{});setDirty(new Set());setTimeout(()=>location.reload(),0);}
    catch(error){report(message(error),true);}
  }

  const toast = <p className={"vui-toast" + (notice?.error ? " vui-toast-error" : "")} role="status">{notice?.text}</p>;
  if (!authenticated) return <main className="vui-admin vui-login">
    <form className="vui-panel" method="post" onSubmit={signIn}>
      <a href="/">← Trang khách</a><h1>Đăng nhập quản trị</h1>
      {!configured ? <p>Chưa cấu hình Neon và tài khoản quản trị. Xem README để thiết lập.</p> : <>
        <label className="vui-field">Tài khoản<input name="username" autoComplete="username" required maxLength={120}/></label>
        <label className="vui-field">Mật khẩu<input name="password" type="password" autoComplete="current-password" required maxLength={200}/></label>
        <button disabled={busy}>{busy ? "Đang đăng nhập…" : "Đăng nhập"}</button>
      </>}
    </form>{toast}
  </main>;

  let editor:React.ReactNode;
  if (section && state) {
    const fields = section === "contact" ? contactFields : section === "media" ? mediaFields : visibilityFields;
    if (section === "prices" || Object.hasOwn(listFields,section)) {
      const listSection = section as keyof typeof listFields;
      editor = <ListEditor key={section+service} items={(section==="prices" ? state.data.prices[service] : state.data[listSection]) as Entry[]}
        fields={section==="prices" ? priceFields[service] : listFields[listSection]}
        set={items=>change(section,section==="prices" ? {...state.data.prices,[service]:items} : items)} report={report} lock={setUploading}/>;
    } else {
      const record = state.data[section] as RecordData;
      editor = <>
        <Fields fields={fields} record={record} change={(key,value)=>change(section,{...record,[key]:value === undefined && key === "email" ? "" : value})} report={report} lock={setUploading}/>
        {section==="media" && <Fields fields={services.map(key=>({key,label:"Ảnh "+serviceNames[key],kind:"image"}))} record={state.data.media.products}
          change={(key,value)=>change(section,{...record,products:{...state.data.media.products,[key]:value}})} report={report} lock={setUploading}/>}
      </>;
    }
  }
  return <main className="vui-admin">
    <header className="vui-header"><div><strong>Viettel Đồng Nai</strong><span>Quản trị · Phan Hà Thị Vui</span></div><div className="vui-actions">
      <a href="/" target="_blank" rel="noopener">Xem trang khách ↗</a>
      <button type="button" className="vui-secondary" disabled={busy || uploading} onClick={logout}>Đăng xuất</button>
    </div></header>
    <div className="vui-layout"><nav aria-label="Mục quản trị">{Object.entries(tabs).map(([key,text])=><button key={key} type="button" className="vui-nav"
      aria-current={tab===key ? "page" : undefined} disabled={busy || uploading} onClick={()=>setTab(key as Tab)}>{text}</button>)}</nav>
      <div className="vui-main"><h1>{tabs[tab]}</h1>
        {tab==="leads" ? <section className="vui-panel"><Leads report={report}/></section> : state && section ? <form className="vui-panel" onSubmit={save}>
          <fieldset className="vui-editor" disabled={busy || uploading}>
            {tab==="media" && <label className="vui-field vui-picker">Loại nội dung<select value={mediaMode} disabled={uploading} onChange={e=>setMediaMode(e.target.value as typeof mediaMode)}><option value="media">Ảnh website</option><option value="gallery">Thư viện ảnh</option></select></label>}
            {tab==="page" && <label className="vui-field vui-picker">Quản lý trang khách<select value={pageMode} disabled={uploading} onChange={e=>setPageMode(e.target.value as typeof pageMode)}><option value="visibility">Ẩn/hiện khu vực</option><option value="blocks">Khối nội dung</option></select></label>}
            {tab==="prices" && <label className="vui-field vui-picker">Dịch vụ<select value={service} onChange={e=>setService(e.target.value as Service)}>{services.map(id=><option key={id} value={id}>{serviceNames[id]}</option>)}</select></label>}
            {editor}
            <div className="vui-save"><button type="submit" disabled={busy || uploading || !dirty.has(section)}>{busy ? "Đang lưu…" : "Lưu và xuất bản"}</button>{dirty.has(section) && <small>Có thay đổi chưa xuất bản</small>}</div>
          </fieldset>
        </form> : <p>Đang tải nội dung…</p>}
      </div>
    </div>{toast}
  </main>;
}
