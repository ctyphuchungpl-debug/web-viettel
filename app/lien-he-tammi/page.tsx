import type { Metadata } from "next";
import { getPublicSite } from "../../server/site";
import { phoneDigits, tammiQrDownload } from "../../lib/site-data";
import "./tammi.css";

export const metadata: Metadata = { title: "Liên hệ qua Tammi | Viettel Đồng Nai" };

export default async function TammiContactPage() {
  const { contact } = await getPublicSite();
  return <main className="wrap tammi-contact">
    <a className="text-link" href="/">← Trang chủ</a>
    <h1>Chat Tammi với {contact.name}</h1>
    <p>Mở ứng dụng Viettel Tammi, chọn Quét mã QR rồi quét mã bên dưới để kết nối.</p>
    <img src={contact.tammiQr} alt={"Mã QR Tammi của "+contact.name}/>
    <div className="tammi-contact-actions">
      <a className="btn btn-red" href={tammiQrDownload(contact.tammiQr)} download>Tải ảnh mã QR</a>
      <a className="text-link" href={"tel:"+phoneDigits(contact.hotline)}>Gọi {contact.hotline}</a>
    </div>
  </main>;
}
