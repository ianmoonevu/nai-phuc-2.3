# HOKI Metal — Tenten 1-Click

Ứng dụng Node.js tự chạy, dùng SQLite tích hợp trong Node.js 24. Không cần MySQL, DB_USER, DB_NAME, SESSION_SECRET hoặc thao tác tạo bảng.

## Triển khai

Chọn repository này, nhánh main, domain hokimetal.vn trong Tenten 1-Click và triển khai/Đồng bộ. Node.js 24 trở lên. File khởi động app.js (mặc định Plesk) và server.js đều chạy cùng backend. Lệnh start/serve/preview đều chạy backend; dist đã được lưu trong GitHub và workflow tự build lại khi mã thay đổi. Không chạy vite preview để phục vụ bản production.

Ứng dụng tự tạo database, thư mục ảnh và khóa phiên đăng nhập khi chạy lần đầu. Nó phục vụ cả giao diện và API, kể cả khi hosting chưa đặt NODE_ENV.

## Tài khoản Admin

Nếu anh đã tạo private/hoki-admin-reset.env với RESET_ADMIN_USERNAME và mật khẩu hợp lệ (12 ký tự trở lên), lần chạy đầu tiên sẽ dùng thông tin đó. Chỉ áp dụng khi SQLite chưa có Admin; restart/đồng bộ không tự thay tài khoản.

Nếu chưa có cấu hình riêng, hệ thống tự tạo username admin và mật khẩu ngẫu nhiên. Xem đúng một lần bằng File Manager → Home directory → private → hoki-cms → ADMIN-LOGIN.json. Đây là thao tác lấy mật khẩu, không phải cấu hình cài đặt. Không có mật khẩu dùng chung hoặc công khai trong repository. Cất mật khẩu riêng rồi có thể xóa file ADMIN-LOGIN.json; tài khoản vẫn còn trong SQLite.

Quên mật khẩu: Node.js → Run script → admin:reset. Không cần MySQL. Lệnh dùng thông tin riêng trong private/hoki-admin-reset.env nếu còn, nếu không tự tạo mật khẩu mới rồi ghi vào private/hoki-cms/ADMIN-LOGIN.json. Xóa file khôi phục cũ nếu muốn tạo mật khẩu ngẫu nhiên mới. Không dùng nút reset chỉ để khởi động website.

## Nơi lưu dữ liệu

Mặc định khi mã ở httpdocs, dữ liệu nằm tại Home directory/private/hoki-cms:

- cms.sqlite (cùng các file -wal/-shm khi đang chạy): nội dung, tài khoản, phiên và yêu cầu tư vấn.
- uploads/: ảnh tải lên mới.
- ADMIN-LOGIN.json: thông tin đăng nhập sinh tự động, chỉ nằm trên hosting.

Nơi lưu nằm ngoài mã nguồn, nên build và đồng bộ GitHub không ghi đè nó. Phải sao lưu thư mục này qua hosting trước khi xóa toàn bộ subscription, đổi server hoặc xóa Home directory. Không thể bảo toàn dữ liệu nếu hosting xóa cả thư mục private. Không tự chuyển dữ liệu MySQL cũ sang SQLite; với hosting này MySQL chưa được cấu hình. Nếu đang có MySQL thật, xuất dữ liệu trước khi chuyển phiên bản.

Nội dung localStorage từ bản cũ được chuyển cho các nhóm dữ liệu chưa có trên server khi đăng nhập lần đầu bằng chính trình duyệt cũ. Không xóa browser storage trước khi kiểm tra. Ảnh uploads cũ vẫn được phục vụ từ httpdocs/uploads; phải sao lưu/copy riêng nếu tạo dự án mới.

## Kiểm tra sau triển khai

Mở https://hokimetal.vn/api/health. Kết quả phải là JSON có ok: true, database: true, mode: sqlite, version: sqlite-1. Đăng nhập, sửa một nội dung, chờ lưu xong, tải lại và mở cửa sổ ẩn danh để đối chiếu.

Nếu API vẫn trả HTML, backend mới chưa nhận yêu cầu. Kiểm tra file khởi động vẫn là app.js hoặc server.js sau Đồng bộ; Document Root nên là /httpdocs/dist và Application Root là /httpdocs. Repository không thể tự thay thiết lập nginx/Passenger của tài khoản hosting. Nếu 1-Click ghi đè entry hoặc ép SPA rewrite ở ngoài mã, cần chỉnh bước đó trong giao diện; không tiếp tục đổi mật khẩu vì không giải quyết định tuyến.

## Kiểm tra mã nguồn

npm ci
npm test
npm run lint
npm run build
npm start

Test kiểm tra cài mới không DB, đăng nhập, chặn truy cập trái phép, migration không ghi đè, rollback batch lỗi, lưu bài/dự án, ảnh, tư vấn, giữ nội dung và phiên sau restart, reset mật khẩu, cache HTML/API.

Các biến môi trường đều tùy chọn: PORT (hosting cấp), HOKI_DATA_DIR (thư mục riêng ngoài app nếu chuyển vị trí lưu), ADMIN_USERNAME/ADMIN_PASSWORD (chỉ cho bootstrap nếu muốn). Dữ liệu được thiết kế cho một hosting dùng ổ đĩa local; không dùng chung file SQLite qua network filesystem.
