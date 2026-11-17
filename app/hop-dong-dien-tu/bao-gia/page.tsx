import { notFound } from "next/navigation";
import { getPublicSite } from "../../../server/site";
import type {Metadata} from "next";
import {ContractPricingStandalone} from "../../../components/contract-pricing";
export const metadata:Metadata={title:"Báo giá Hợp đồng điện tử vContract | Viettel Đồng Nai",description:"Các gói vContract, số lượng hợp đồng, các khoản phí và giá bán."};
export default async function ContractPricingPage(){const site=await getPublicSite();if(!site.serviceCatalog.some(item=>item.id==="hopdong"))notFound();return <ContractPricingStandalone/>;}
