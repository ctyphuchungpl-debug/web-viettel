# Website Viettel Phan Hà Thị Vui

Bản Next.js riêng từ mã nguồn đã cung cấp. Giao diện công khai gồm 10 trang và bảng giá Tendoo dạng popup. /admin có Liên hệ, Ảnh & poster, Dịch vụ, Gói cước, Video, FAQ, Trang khách và Yêu cầu tư vấn.

## Chạy local

Cài Node.js 22.13+ và chạy:

```sh
npm ci
npm run dev
```

Trang khách dùng dữ liệu gốc để xem trước khi chưa cấu hình Neon. Để bật đăng nhập và lưu yêu cầu, chép [.env.example](.env.example) thành .env.local, đặt DATABASE_URL của database Neon riêng của chị Vui và chạy:

```sh
npm run db:init
npm run admin:hash
```

Lệnh khởi tạo có thể chạy lại và giữ nguyên các mục đã chỉnh sửa. Với lệnh tạo hash, nhập mật khẩu 12–200 ký tự trên terminal riêng rồi kết thúc stdin bằng Ctrl+Z và Enter trên Windows hoặc Ctrl+D trên macOS/Linux. Đây là bước nhập văn bản, terminal có thể hiện ký tự. Đặt kết quả vào ADMIN_PASSWORD_HASH và chọn ADMIN_USERNAME. Khởi động lại dev sau khi cập nhật biến môi trường.

- Liên kết **Public Vercel Blob store** riêng, điền BLOB_READ_WRITE_TOKEN. Admin chọn ảnh JPG, PNG hoặc WebP tối đa 10 MB và xem trước bản WebP sau khi tải. Bấm **Lưu và xuất bản** để cập nhật trang khách.
- Trong **Ảnh & poster → Ảnh website**, mỗi ảnh có nút **Lưu ảnh này**. Trong **Thư viện ảnh**, dùng **Lưu mục này** khi sửa một mục. Nút **Lưu danh sách** áp dụng thêm thay đổi về thứ tự, ẩn hoặc xóa trong thư viện.
- Điền địa chỉ **Email nhận tư vấn** trong **Admin → Liên hệ**. Xác minh tên miền gửi trên Resend và đặt RESEND_API_KEY, RESEND_FROM_EMAIL. Yêu cầu được lưu trước khi gửi email. Admin hiển thị kết quả gửi riêng cho chuyên viên và khách. Khách được gửi xác nhận nếu nhập email.
- Các nút ẩn và xóa áp dụng khi bấm **Lưu và xuất bản**. Kiểm tra giá theo bảng của Viettel trước khi công bố. Trong bản gốc, tên VCONT_10K nói 10.000 hợp đồng nhưng trường số lượng là 0. Dữ liệu đó giữ ghi chú cần xác nhận.

## Quản lý nội dung

- Liên hệ và các công tắc hiển thị có nút lưu riêng từng trường. Trong các danh sách, mở Sửa rồi chọn **Lưu mục này** để xuất bản đúng mục đó. **Lưu danh sách** dùng khi thay đổi thứ tự, ẩn hoặc xóa. Trong Gói cước, nút này áp dụng cho dịch vụ đang chọn.
- Chọn **Trang khách → Nội dung từng trang**, chọn trang và phần nội dung để sửa tiêu đề, đoạn văn, nhãn hoặc nội dung thẻ. Nút **Lưu phần nội dung này** xuất bản khu đang sửa và giữ các bản nháp ở khu khác.
- Trong **Dịch vụ**, thêm tên, đường dẫn, giới thiệu, lợi ích, ảnh và nội dung chi tiết để tạo trang tại **/dich-vu/đường-dẫn**. Sửa nội dung của năm trang dịch vụ gốc qua **Trang khách → Nội dung từng trang**.
- Dịch vụ mới có bảng gói cước đơn giản gồm tên, giá, thời hạn, thuế và chi tiết. Chọn dịch vụ đó trong mục Gói cước để thêm gói. Dịch vụ bị ẩn hoặc xóa sẽ được bỏ khỏi trang khách, lựa chọn tư vấn và trang chi tiết.
- Bản cập nhật dùng dữ liệu hiện có. Các nhóm nội dung mới được lưu từ lần xuất bản đầu tiên và vẫn giữ dữ liệu đã chỉnh khi chạy lại db:init.

## Vercel Preview riêng tư

1. Tạo kho mã nguồn riêng cho bản này và import vào **project Vercel riêng** với preset **Next.js** và Node.js 22 hoặc 24. Bật **Deployment Protection / Vercel Authentication** cho Preview.
2. Dùng nhánh Neon riêng cho Preview. Cấu hình các biến từ .env.example ở phạm vi Preview, chạy db:init bằng chuỗi kết nối của nhánh đó và triển khai từ một nhánh thử. Giữ các khóa bí mật ngoài Git.
3. Kiểm tra URL Preview từ cửa sổ chưa đăng nhập để xác nhận giới hạn truy cập. Sau đó thử đăng nhập /admin, lưu nội dung, tải ảnh, chọn báo giá và gửi form bằng hộp thư kiểm thử do bạn kiểm soát.
4. Khi nghiệm thu xong, khởi tạo Neon Production và thiết lập các biến tương ứng trong Vercel trước khi triển khai Production. Gán tên miền sau khi kiểm tra lại form, Blob và cả hai email.

[Vercel Deployment Protection](https://vercel.com/docs/deployment-protection) · [Vercel Blob](https://vercel.com/docs/vercel-blob) · [Neon](https://neon.com/docs/connect/connect-from-any-app) · [Resend](https://resend.com/docs/dashboard/domains/introduction)
