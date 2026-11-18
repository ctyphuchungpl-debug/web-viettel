"use client";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, X } from "lucide-react";
import type { ReactNode } from "react";
import { defaultTammiLink, phoneDigits, tammiQrImage } from "../lib/site-data";
import { useSite } from "./site-provider";

const tammiDialogId = "tammi-contact-dialog";

export function TammiLink({className, children}: {className:string; children:ReactNode}) {
  const { contact } = useSite();
  return <a className={className} href={contact.tammi} target="_blank" rel="noopener noreferrer"
    aria-haspopup="dialog" aria-controls={tammiDialogId} onClick={event=>{
      if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const dialog = document.getElementById(tammiDialogId);
      if(!(dialog instanceof HTMLDialogElement)) return;
      event.preventDefault();
      if(!dialog.open) dialog.showModal();
    }}>{children}</a>;
}

export function PublicContact() {
  const copy = useSite().pageContent["shared"];

  const pathname = usePathname();
  const { contact } = useSite();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  const phone = "tel:" + phoneDigits(contact.hotline);
  return <>
    <section className="contact-footer" aria-label="Địa chỉ và thông tin liên hệ">
      <div className="wrap">
        <div className="contact-footer-info">
          <strong>{copy["contact-footer"]["text-1"]}</strong>
          <p className="contact-footer-person">{contact.name} - {contact.role}</p>
          <p className="contact-footer-phone">{copy["contact-footer"]["text-2"]}<a href={phone}>{contact.hotline}</a></p>
          <address>{contact.address}</address>
        </div>
        <details className="privacy-details" id="privacy">
          <summary>{copy["contact-footer"]["text-3"]}</summary>
          <p>{copy["contact-footer"]["text-4"]}</p>
          <p>{copy["contact-footer"]["text-5"]}</p>
        </details>
      </div>
    </section>
    <nav className="contact-dock" aria-label={`Liên hệ trực tiếp với ${contact.name}`}>
      {pathname !== defaultTammiLink && <TammiLink className="contact-tammi"><MessageCircle size={21}/><span>{copy["general"]["text-1"]}</span></TammiLink>}
      <a className="contact-call" href={phone}><Phone size={20}/><span>{copy["general"]["text-2"]}{contact.hotline}</span></a>
    </nav>
    <dialog id={tammiDialogId} className="tammi-dialog" aria-labelledby="tammi-dialog-title" aria-describedby="tammi-dialog-instructions"
      onClick={event=>{if(event.target===event.currentTarget)event.currentTarget.close();}}>
      <div className="tammi-dialog-content">
        <form method="dialog"><button type="submit" className="tammi-dialog-close" aria-label="Đóng popup Tammi"><X size={22}/></button></form>
        <h2 id="tammi-dialog-title">Chat Tammi với {contact.name}</h2>
        <p id="tammi-dialog-instructions">Mở ứng dụng Viettel Tammi, chọn Quét mã QR rồi quét mã bên dưới để kết nối.</p>
        <img src={tammiQrImage} alt={"Mã QR Tammi của "+contact.name} width={1185} height={2560} loading="lazy"/>
        <div className="tammi-dialog-actions">
          <a className="btn btn-red" href={tammiQrImage} download>Tải ảnh mã QR</a>
          {contact.tammi !== defaultTammiLink && <a className="text-link" href={contact.tammi} target="_blank" rel="noopener noreferrer">Mở link Tammi ↗</a>}
        </div>
      </div>
    </dialog>
  </>;
}
