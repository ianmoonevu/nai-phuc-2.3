# Đặt lại Admin

Không cần MySQL hay nhập DB_USER/DB_NAME.

1. Node.js → Run script → admin:reset → Run.
2. Chỉ khi thấy Admin account reset successfully mới thành công.
3. Đọc Home directory/private/hoki-cms/ADMIN-LOGIN.json để lấy ID và mật khẩu.

Nếu còn private/hoki-admin-reset.env, lệnh ưu tiên username/password trong file đó (mật khẩu tối thiểu 12 ký tự, tối đa 72 byte). Nếu không còn file/biến RESET_ADMIN_* thì lệnh sinh mật khẩu ngẫu nhiên. Đặt ID đã tồn tại sẽ đổi mật khẩu và thu hồi phiên cũ của ID đó; ID mới sẽ tạo thêm tài khoản.

Lệnh chỉ kiểm tra, không đổi tài khoản: admin:reset -- --check-config.

Không đưa mật khẩu vào GitHub hoặc gửi ảnh file mật khẩu. Sau khi lưu mật khẩu ở nơi riêng, xóa ADMIN-LOGIN.json và cấu hình RESET_ADMIN_* nếu không còn cần.
