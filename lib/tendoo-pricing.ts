// Captured from the requested reference Site on 10/11/2026.
// Its price table states an update date of 05/11/2026.
export type TendooPriceItem = {
  id: string;
  kind: "plan" | "device";
  name: string;
  duration: string;
  price: number;
  vatNote: string;
};
const planVat = "Đã bao gồm VAT";
const deviceVat = "Giá đã bao gồm VAT và phí bản quyền";
export const TENDOO_PLANS: TendooPriceItem[] = [
  { id: "plan-3y-gift9m", kind: "plan", name: "Gói dịch vụ quản lý bán hàng 3 năm tặng 9 tháng", duration: "45 Tháng", price: 5248800, vatNote: planVat },
  { id: "plan-3y", kind: "plan", name: "Gói dịch vụ quản lý bán hàng 3 năm", duration: "3 Năm", price: 5248800, vatNote: planVat },
  { id: "plan-2y-gift6m", kind: "plan", name: "Gói dịch vụ quản lý bán hàng 2 năm tặng 6 tháng", duration: "30 Tháng", price: 3693600, vatNote: planVat },
  { id: "plan-2y", kind: "plan", name: "Gói dịch vụ quản lý bán hàng 2 năm", duration: "2 Năm", price: 3693600, vatNote: planVat },
  { id: "combo-3y-nd70", kind: "plan", name: "Gói 3 năm DVQLBH combo ND70", duration: "3 Năm", price: 1963000, vatNote: planVat },
  { id: "plan-1y-gift3m", kind: "plan", name: "Gói dịch vụ quản lý bán hàng 1 năm tặng 3 tháng", duration: "15 Tháng", price: 1944000, vatNote: planVat },
  { id: "plan-1y", kind: "plan", name: "Gói dịch vụ quản lý bán hàng 1 năm", duration: "1 Năm", price: 1944000, vatNote: planVat },
  { id: "combo-2y-nd70", kind: "plan", name: "Gói 2 năm DVQLBH combo ND70", duration: "2 Năm", price: 1423000, vatNote: planVat },
  { id: "combo-1y-nd70", kind: "plan", name: "Gói 1 năm DVQLBH combo ND70", duration: "1 Năm", price: 785000, vatNote: planVat },
  { id: "plan-free-1m", kind: "plan", name: "Gói miễn phí 1 tháng", duration: "1 Tháng", price: 0, vatNote: planVat },
];
export const TENDOO_DEVICES: TendooPriceItem[] = [
  { id: "device-pos-dual", kind: "device", name: "Máy POS để bàn Tendoo (2 màn hình)", duration: "1 Năm", price: 8200000, vatNote: deviceVat },
  { id: "device-pos-single", kind: "device", name: "Máy POS để bàn Tendoo (1 màn hình)", duration: "1 Năm", price: 6700000, vatNote: deviceVat },
  { id: "device-pos-handheld", kind: "device", name: "Máy POS cầm tay", duration: "1 Năm", price: 4200000, vatNote: deviceVat },
  { id: "device-label-printer", kind: "device", name: "Máy in tem nhãn + vận đơn", duration: "1 Năm", price: 1500000, vatNote: deviceVat },
  { id: "device-receipt-printer", kind: "device", name: "Máy in HĐ cổng USB+LAN,khổ giấy 80mm", duration: "1 Năm", price: 1200000, vatNote: deviceVat },
  { id: "device-scanner-fixed", kind: "device", name: "Máy quét mã vạch cố định", duration: "1 Năm", price: 1000000, vatNote: deviceVat },
  { id: "device-scanner-handheld", kind: "device", name: "Máy quét mã vạch cầm tay", duration: "1 Năm", price: 900000, vatNote: deviceVat },
  { id: "device-td-loa", kind: "device", name: "TD_LOA", duration: "1 Năm", price: 460000, vatNote: deviceVat },
  { id: "device-static-qr", kind: "device", name: "Máy thông báo thanh toán QR tĩnh", duration: "1 Năm", price: 300000, vatNote: deviceVat },
];
export const TENDOO_DURATIONS = ["1 Tháng", "1 Năm", "2 Năm", "3 Năm", "15 Tháng", "30 Tháng", "45 Tháng"];
export const TENDOO_PRICE_REFERENCE = "https://viettel-giai-phap-so-tammi-0975005123.bluestingray.chatgpt.site/";
export const TENDOO_PRICE_SOURCE = "https://sme.viettel.vn/market-place/detail/TDO?tab=B%E1%BA%A3ng%20gi%C3%A1";
export function formatTendooPrice(price: number) { return new Intl.NumberFormat("vi-VN").format(price) + "đ"; }
