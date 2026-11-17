import { notFound } from "next/navigation";
import { getPublicSite } from "../../../server/site";
import type {Metadata} from "next";
import BhxhPricing from "../../../components/bhxh-pricing";
export const metadata:Metadata={title:"Báo giá Kê khai BHXH vBHXH | Viettel Đồng Nai",description:"Báo giá vBHXH theo 10, 100, 1.000 hoặc không giới hạn lao động. Gói đơn lẻ và combo, cấp mới và gia hạn."};
export default async function BhxhPricingPage(){const site=await getPublicSite();if(!site.serviceCatalog.some(item=>item.id==="bhxh"))notFound();return <BhxhPricing/>;}
