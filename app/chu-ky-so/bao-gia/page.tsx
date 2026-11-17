import { notFound } from "next/navigation";
import { getPublicSite } from "../../../server/site";
import type {Metadata} from "next";
import {SignaturePricingStandalone} from "../../../components/signature-pricing";
export const metadata:Metadata={title:"Báo giá Chữ ký số USB Token, HSM, MySign | Viettel Đồng Nai",description:"Bảng giá USB Token, HSM, MySign cho tổ chức, hộ kinh doanh, cá nhân."};
export default async function SignaturePricingPage(){const site=await getPublicSite();if(!site.serviceCatalog.some(item=>item.id==="chukyso"))notFound();return <SignaturePricingStandalone/>;}
