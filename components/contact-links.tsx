"use client";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { phoneDigits } from "../lib/site-data";
import { useSite } from "./site-provider";

export function PublicContact() {
  const pathname = usePathname();
  const { contact } = useSite();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  const phone = "tel:" + phoneDigits(contact.hotline);
  return <>
    <section className="contact-footer" aria-label="Địa chỉ và thông tin liên hệ">
      <div className="wrap">
        <div className="contact-footer-info">
          <strong>VIETTEL ĐỒNG NAI</strong>
          <p className="contact-footer-person">{contact.name} - {contact.role}</p>
          <p className="contact-footer-phone">Điện thoại: <a href={phone}>{contact.hotline}</a></p>
          <address>{contact.address}</address>
        </div>
        <details className="privacy-details" id="privacy">
          <summary>Sử dụng và bảo vệ thông tin</summary>
          <p>Thông tin trong biểu mẫu được lưu để chuyên viên có thể liên hệ tư vấn. Nếu bạn nhập email, hệ thống sử dụng địa chỉ đó để gửi xác nhận yêu cầu.</p>
          <p>Chỉ cung cấp thông tin liên hệ cần thiết. Bạn cũng có thể liên hệ trực tiếp qua Zalo hoặc hotline.</p>
        </details>
      </div>
    </section>
    <nav className="contact-dock" aria-label={`Liên hệ trực tiếp với ${contact.name}`}>
      <a className="contact-zalo" href={contact.zalo} target="_blank" rel="noopener noreferrer"><MessageCircle size={21}/><span>Chat Zalo</span></a>
      <a className="contact-call" href={phone}><Phone size={20}/><span>Gọi {contact.hotline}</span></a>
    </nav>
  </>;
}
