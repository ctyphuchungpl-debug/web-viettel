import type {Metadata} from "next";
import {ContractPricingStandalone} from "../../../components/contract-pricing";
export const metadata:Metadata={title:"Báo giá Hợp đồng điện tử vContract | Viettel Đồng Nai",description:"Các gói vContract, số lượng hợp đồng, các khoản phí và giá bán."};
export default function ContractPricingPage(){return <ContractPricingStandalone/>;}
