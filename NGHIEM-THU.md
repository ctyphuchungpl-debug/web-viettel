# Nghiệm thu bản quản trị

Bản mã nguồn nằm trong thư mục viettel-phan-ha-thi-vui. Dữ liệu gốc của website đã cung cấp được dùng làm seed cho Neon.

Đã kiểm tra

- Build Next.js production và TypeScript thành công, gồm 10 trang công khai cùng trang admin và hai API.
- Mở đủ 10 trang trên Chrome ở 390 px và 1366 px. Đối chiếu kích thước banner, hero, thẻ dịch vụ và bảng S-Invoice với bản gốc.
- Kiểm tra đăng nhập sai/đúng, chặn API khi thiếu phiên và lưu nội dung theo revision để ngăn phiên cũ ghi đè.
- Đổi hotline trên 10 trang, chọn và xem trước ảnh đại diện, thêm/sửa/ẩn/xóa/đổi thứ tự nội dung, playlist YouTube và nút chọn dịch vụ vào form.
- Trong Ảnh & poster, thử sửa nhiều ảnh rồi lưu riêng một ảnh. Các ảnh còn lại giữ bản nháp. Thử lưu riêng một mục thư viện, thêm mục mới và lưu thứ tự bằng Lưu danh sách. API kiểm tra phiên, đường dẫn ảnh cho phép và revision để tránh ghi đè phiên khác.
- Form có và không có email, gói bị ẩn hoặc xóa, gửi trùng cùng mã, báo giá đã chỉnh sau khi có yêu cầu cũ. Yêu cầu cũ giữ giá lúc gửi.
- Kiểm tra email riêng cho chuyên viên và khách qua Resend mô phỏng, cả tình huống lỗi. Kiểm tra trên Preview thật khi thiếu Resend cho kết quả Chưa cấu hình và khách không có email được ghi Không có email.
- Neon thật đã khởi tạo, chạy lại seed giữ dữ liệu. Preview đăng nhập được, API lưu thông tin và lưu yêu cầu hoạt động. Blob thật nhận và trả ảnh WebP. Bản ghi và ảnh dùng cho nghiệm thu đã được dọn.

Phần cần làm trên tài khoản chị Vui

- Tạo project Vercel, database Neon và Blob store của chị Vui rồi điền biến từ .env.example. Trong Admin → Liên hệ, nhập email nhận tư vấn.
- Xác minh địa chỉ gửi của Resend, cấu hình RESEND_API_KEY và RESEND_FROM_EMAIL rồi thử gửi tới các hộp thư do chủ website quản lý.
- Bật Vercel Authentication cho Preview và kiểm tra từ cửa sổ chưa đăng nhập trước khi gán tên miền thật.

Thông số báo giá đang có điểm cần chủ website kiểm tra

- VCONT_10K có tên mô tả 10.000 hợp đồng nhưng số lượng trong nguồn là 0. Bản hiện tại giữ ghi chú của nguồn để chủ website đối chiếu.
- Giá HSM đa mục đích để Liên hệ báo giá và trạng thái thuế chưa rõ được giữ theo dữ liệu gốc.
