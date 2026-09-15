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

## Khi Run script không nhận Custom environment variables

Sau khi Đồng bộ, có thể chạy `admin:reset --check-config` để xem các cờ có/không; lệnh này không kết nối MySQL và không đổi tài khoản.

Nếu biến đã lưu nhưng lệnh không nhận, mở File Manager ở thư mục cha của httpdocs. Tạo/mở thư mục private ngang cấp với httpdocs, tạo file hoki-admin-reset.env bên trong. Không đặt file này trong httpdocs, dist hoặc GitHub.

Nhập cấu hình riêng, thay giá trị mẫu bằng thông tin thực tế:
```dotenv
RESET_ADMIN_USERNAME=admin
RESET_ADMIN_PASSWORD="MAT_KHAU_MOI_CUA_BAN"
DB_HOST=localhost
DB_PORT=3306
DB_NAME=TEN_DATABASE_CMS
DB_USER=TAI_KHOAN_MYSQL
DB_PASSWORD="MAT_KHAU_MYSQL"
```

Nếu cấu hình DB đã có trong .env của ứng dụng hoặc môi trường chạy lệnh thì không cần lặp lại DB_*. File recovery có ưu tiên khi tồn tại, nên phải dùng đúng database CMS. Không dùng nguyên các giá trị mẫu. Mật khẩu Admin tối thiểu 12 ký tự, tối đa 72 byte UTF-8.

Chạy admin:reset --check-config trước, rồi admin:reset. Khi thành công, xóa file recovery và hai biến RESET_ADMIN_* trên giao diện hosting. Chưa có cấu hình MySQL thì cần thiết lập database trước.

## Khôi phục tạm theo yêu cầu chủ website

Chạy `admin:reset --temporary` trong Plesk Run script để đặt tài khoản admin bằng thông tin tạm được định nghĩa trong script. Chế độ này không cần hai biến RESET_ADMIN_* và bỏ qua chúng. Chỉ lệnh thủ công này thay đổi tài khoản; ứng dụng web không dùng mật khẩu dự phòng và khởi động lại không tự reset.

Thông tin tạm nằm trong repository công khai. Sau khi khôi phục, đặt mật khẩu mạnh riêng bằng quy trình thông thường ở trên. Lệnh vẫn cần cấu hình DB_* hợp lệ và bảng admins đã tồn tại. Nếu chưa có, lệnh thất bại và không đổi tài khoản. `admin:reset --temporary --check-config` chỉ kiểm tra cấu hình, không đổi dữ liệu.
