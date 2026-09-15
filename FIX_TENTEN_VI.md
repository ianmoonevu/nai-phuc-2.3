# Sửa lưu Admin và cache — hokimetal.vn

## Kết quả kiểm tra ngày 15/09/2026

GET https://hokimetal.vn/api/health trả HTTP 200, Content-Type: text/html và nội dung trang chủ; header Server: nginx, X-Powered-By: PleskLin. API này phải trả JSON từ server.js. Đây là bằng chứng đường dẫn API trên domain chưa phục vụ đúng backend; chưa thể kết luận chính xác cấu hình nội bộ nào gây ra lỗi nếu chưa xem Tenten/Plesk.

Mã nguồn main tải trong phiên kiểm tra đã có Express + MySQL. Tuy nhiên frontend cũ nuốt lỗi JSON, biến HTML thành đối tượng rỗng và có thể nhận nhầm là đăng nhập/lưu thành công. Lỗi lưu cũng chỉ được ghi ra console.

## Bản sửa trong ZIP

- Chỉ nhận thành công khi phản hồi là JSON có ok: true; báo lỗi rõ khi hosting trả HTML hoặc chưa kết nối database.
- Hiển thị lỗi lưu trong trang; gửi các lần lưu nội dung theo thứ tự.
- API sử dụng Cache-Control: no-store và fetch cache: no-store.
- HTML do Node phục vụ dùng no-store; tài nguyên tĩnh còn lại yêu cầu kiểm tra lại cache.
- Chuyển lỗi bất đồng bộ của route Express 4 vào bộ xử lý lỗi thay vì để yêu cầu treo.
- Có dist đã build mới, mã nguồn và bài kiểm tra; không có mật khẩu hay node_modules.

## Cách áp dụng trên Tenten

1. Sao lưu MySQL, thư mục uploads và .env đang chạy. Trên trình duyệt có nội dung chỉnh sửa mới nhất, xuất JSON backup trong Admin nếu còn truy cập được. Không xóa localStorage trước khi xác nhận bản sao trên MySQL.
2. Dùng mã nguồn trong ZIP để cập nhật repository hiện tại rồi Đồng bộ dự án hokimetal.vn. ZIP có package.json và server.js ngay ở thư mục gốc. Không tạo hoặc xóa lại dự án đang chạy chỉ để cập nhật mã.
3. Trong phần cấu hình Node.js của dự án, kiểm tra ứng dụng chạy server.js ở thư mục chứa package.json, NODE_ENV=production. Cho Tenten quản lý PORT. Nếu chỉ phục vụ dist bằng nginx thì website mở được nhưng API không hoạt động.
4. Đảm bảo mọi yêu cầu /api/* được chuyển vào ứng dụng Node, không bị rewrite về index.html. Nếu giao diện 1-Click không có tùy chọn này, gửi yêu cầu hỗ trợ bên dưới cho Tenten; không đoán cổng hoặc tự chèn cấu hình nginx trùng lặp.
5. Tạo/kiểm tra MySQL và khai báo DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD đúng với tài khoản hosting; giữ SESSION_SECRET cố định, ngẫu nhiên và đủ dài. Dùng .env.example để tham khảo, không dùng các giá trị mẫu nguyên trạng. Khai báo ADMIN_USERNAME và ADMIN_PASSWORD để tạo tài khoản ban đầu nếu chưa tồn tại. Không gửi mật khẩu vào chat/GitHub. Tài khoản đã tồn tại không đổi mật khẩu chỉ bằng cách đổi ADMIN_PASSWORD.
6. Khởi động lại Node.js. Mở /api/health: phải là JSON có database: true, mode: mysql. database: false nghĩa là chưa thể lưu admin, kể cả khi ok: true. Kiểm tra log nếu configured: true nhưng database: false.
7. Đăng nhập bằng trình duyệt có dữ liệu cũ. Mã nguồn có cơ chế chuyển các nhóm nội dung chưa có trên server từ trình duyệt vào MySQL. Đối chiếu dữ liệu/backup trước khi thao tác vì dữ liệu đã tồn tại trên MySQL không được tự ghi đè.
8. Sửa thử một nội dung, đợi hết trạng thái đang lưu và không có báo lỗi. Tải lại, kiểm tra bằng cửa sổ ẩn danh và sau khi khởi động lại ứng dụng. Chỉ khi cả ba nơi đều đúng mới coi là đã giải quyết lưu dữ liệu.

## Cache và Ctrl+F5

Ctrl+F5 yêu cầu tải lại tài nguyên; không xóa localStorage và không phải lệnh xóa cache nginx/CDN. Không gắn Ctrl+F5 với xóa dữ liệu trình duyệt vì có thể mất bản chỉnh sửa cũ.

Các header của bản sửa chỉ có tác dụng với phản hồi đi qua Node. Nhờ Tenten xác nhận không cache /api/*, không rewrite API về trang chủ, và HTML cần lấy bản mới. Nếu nginx/CDN phục vụ trực tiếp HTML, cấu hình cache tương ứng tại lớp đó. Sau khi triển khai kiểm tra cả Content-Type lẫn Cache-Control trên domain; Ctrl+F5 không thể tự thay mã chưa được triển khai.

## Nội dung gửi hỗ trợ Tenten

Domain hokimetal.vn đang triển khai repository ianmoonevu/nai-phuc-2.3 bằng Tenten 1-Click. GET /api/health hiện trả HTTP 200 text/html của trang chủ, trong khi server.js có endpoint trả JSON. Nhờ kiểm tra startup file server.js, NODE_ENV=production, định tuyến /api/* tới Node.js và loại trừ /api/* khỏi SPA fallback/cache. Nhờ xác nhận HTML không bị giữ bản cũ tại nginx/proxy. Tôi sẽ cấu hình thông tin MySQL trong hosting và kiểm tra lại database: true. Vui lòng không xóa dự án, database hoặc uploads.

## Kiểm tra đã thực hiện

- TypeScript: đạt.
- Build production: đạt; còn cảnh báo chunk Admin lớn, không chặn build.
- 2 bài test API: đạt (HTML 200 bị từ chối; chỉ JSON thành công được chấp nhận; lỗi 503 và cache no-store).
- Backend smoke test: đạt (health JSON; lưu trả 503 khi không có DB; API và HTML có no-store).
- Chưa kiểm thử đăng nhập/lưu vào MySQL thật, cookie HTTPS qua proxy hoặc thao tác giao diện trên hosting.
- Bản sửa được cung cấp trong repository để triển khai. Chưa xác nhận triển khai và lưu dữ liệu trên Tenten.

Tham khảo hướng dẫn chính thức: https://help.tenten.vn/huong-dan-su-dung-vibe-code-hosting/ (Đồng bộ kéo mã GitHub, Khởi động lại restart Node.js).
