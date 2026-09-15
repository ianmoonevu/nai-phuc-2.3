# Đặt lại tài khoản Admin trên Tenten/Plesk

Chức năng này chỉ chạy thủ công trong hosting, không có endpoint công khai và không tự đổi mật khẩu khi restart.

1. Đồng bộ mã mới từ main. Kiểm tra Startup File vẫn là server.js sau khi đồng bộ.
2. Trong Node.js → Custom environment variables → specify, thêm RESET_ADMIN_USERNAME với ID cần khôi phục (ví dụ admin) và RESET_ADMIN_PASSWORD với mật khẩu mới do bạn chọn: ít nhất 12 ký tự, không quá 72 byte UTF-8. Không đưa mật khẩu vào GitHub hoặc phần tham số lệnh.
3. Giữ nguyên các biến DB_* đang kết nối database CMS. Database và bảng admins phải đã được khởi tạo bằng server.js. Nếu đổi sang username chưa tồn tại, lệnh tạo tài khoản mới và không đổi tên/xóa tài khoản cũ.
4. Bấm Run script → nhập admin:reset → chạy. Chỉ coi là thành công khi có dòng Admin account reset successfully. Lệnh cũng thu hồi các phiên cũ của tài khoản vừa đổi.
5. Xóa hai biến RESET_ADMIN_USERNAME và RESET_ADMIN_PASSWORD, lưu, Restart App. Dùng ID/mật khẩu vừa chọn để đăng nhập.

Đổi riêng ADMIN_PASSWORD không đặt lại mật khẩu của tài khoản đã tồn tại.

Nếu API trả HTML thay vì JSON, vẫn phải sửa cấu hình phục vụ API trước khi đăng nhập được. Trong Plesk, Application Root là /httpdocs; Document Root nên là thư mục con chứa tài nguyên công khai, với dự án này là /httpdocs/dist. Kiểm tra quy tắc SPA rewrite nếu /api/health vẫn trả HTML. Không công khai file .env hoặc thư mục mã nguồn.

Chưa thực hiện reset trên MySQL production. Script đã kiểm tra cú pháp và xác nhận từ chối chạy khi chưa có thông tin reset; cần kiểm chứng thao tác thực tế trên hosting.
