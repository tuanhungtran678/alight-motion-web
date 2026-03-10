# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần + Node server.

## Tính năng mới
- Nếu môi trường không gửi được email, app sẽ hiển thị demo OTP code thay vì báo lỗi mơ hồ.
- Auth có local fallback khi API không chạy (không còn lỗi chung chung `auth_failed`).
- Sign in theo luồng kiểm tra email tồn tại + OTP 6 chữ số qua email (kèm cảnh báo bảo mật).
- Đăng nhập **thật** bằng email/password với API server (`/api/auth/signup`, `/api/auth/signin`, `/api/auth/me`).
- Cloud publish: đăng dự án lên server, xem public qua `public.html?id=...`.
- Nếu dự án Cloud là của bạn sẽ có nút **Unshare** để bỏ chia sẻ.
- Hỗ trợ khách (guest) với modal cảnh báo:
  - `You're not signed in. Log in to use this feature.`
  - Nút `Sign in`, `Sign up`, và nút `X` để đóng.
- Thêm đổi ngôn ngữ (VI/EN), tìm kiếm dự án local + cloud.
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
