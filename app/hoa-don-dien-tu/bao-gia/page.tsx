import { notFound } from "next/navigation";
import { getPublicSite } from "../../../server/site";
import type {Metadata} from "next";
import InvoicePricing from "../../../components/invoice-pricing";

export const metadata:Metadata={title:"Báo giá Hóa đơn điện tử S-Invoice | Viettel Đồng Nai",description:"Báo giá gói hóa đơn điện tử đơn lẻ và combo Viettel-CA."};
export default async function InvoicePricingPage(){const site=await getPublicSite();if(!site.serviceCatalog.some(item=>item.id==="hoadon"))notFound();return <InvoicePricing/>;}
