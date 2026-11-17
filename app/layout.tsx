import type { Metadata } from "next";
import "./globals.css";
import "./large-type-layout.css";
import "./customer-experience.css";
import { PublicContact } from "../components/contact-links";
import { SiteProvider } from "../components/site-provider";
import { getPublicSite } from "../server/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Giải pháp số Viettel | Đồng Nai",
  description: "Khám phá Tendoo, Chữ ký số, Hợp đồng điện tử, Hóa đơn điện tử và Kê khai BHXH.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};
export default async function RootLayout({children}: Readonly<{children:React.ReactNode}>) {
  const site = await getPublicSite();
  return <html lang="vi"><body><SiteProvider value={site}>{children}<PublicContact/></SiteProvider></body></html>;
}
