"use client";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { phoneDigits } from "../lib/site-data";
import { useSite } from "./site-provider";

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
      <a className="contact-zalo" href={contact.zalo} target="_blank" rel="noopener noreferrer"><MessageCircle size={21}/><span>{copy["general"]["text-1"]}</span></a>
      <a className="contact-call" href={phone}><Phone size={20}/><span>{copy["general"]["text-2"]}{contact.hotline}</span></a>
    </nav>
  </>;
}
