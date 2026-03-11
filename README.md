# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần + Node server.

## Tính năng mới
- OTP Sign in sẽ gửi mail thật qua SMTP (Gmail/Outlook). Nếu SMTP chưa cấu hình, app báo lỗi rõ ràng.
- Auth có local fallback khi API không chạy (không còn lỗi chung chung `auth_failed`).
- Sign in theo luồng kiểm tra email tồn tại + OTP 6 chữ số qua email (kèm cảnh báo bảo mật).
- Đăng nhập **thật** bằng email/password với API server (`/api/auth/signup`, `/api/auth/signin`, `/api/auth/me`).
- Cloud publish: đăng dự án lên server, xem public qua `public.html?id=...`.
- Nếu dự án Cloud là của bạn sẽ có nút **Unshare** để bỏ chia sẻ.
- Hỗ trợ khách (guest) với modal cảnh báo:
  - `You're not signed in. Log in to use this feature.`
  - Nút `Sign in`, `Sign up`, và nút `X` để đóng.
- Thêm đổi ngôn ngữ (VI/EN), tìm kiếm dự án local + cloud.
- Chèn nhiều audio track cùng lúc và đồng bộ playback theo timeline.
- Ô nhập OTP dạng 6 khối lớn riêng biệt để nhập dễ hơn.
- Giao diện editor được làm mới (header/panel/khối điều khiển đỡ thô).
- Thêm Header và Footer cho giao diện.

## Chạy local
```bash
node server.js
```
Mở: `http://localhost:4173/index.html`

## API chính
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `DELETE /api/projects/:id/share`
- `GET /api/projects/:id`

## Cấu hình gửi OTP vào Gmail/Outlook
Thiết lập biến môi trường trước khi chạy `node server.js`:

```bash
export SMTP_PROVIDER=gmail   # hoặc outlook
export SMTP_USER="your_account@gmail.com"
export SMTP_PASS="your_app_password"
export SMTP_FROM="your_account@gmail.com"
# tùy chọn override
# export SMTP_HOST="smtp.gmail.com"
# export SMTP_PORT="465"
# export SMTP_SECURE="true"
node server.js
```

> Với Gmail/Outlook cần dùng App Password hoặc thông tin SMTP hợp lệ của chính tài khoản bạn.
