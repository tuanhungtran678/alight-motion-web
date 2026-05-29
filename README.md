# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần + Node server.

## Tính năng mới
- OTP Sign in sẽ gửi mail thật qua SMTP (Gmail/Outlook). Nếu SMTP chưa cấu hình, app báo lỗi rõ ràng.
- Auth có local fallback khi API không chạy (không còn lỗi chung chung `auth_failed`).
- Sign in theo luồng kiểm tra email tồn tại + OTP 6 chữ số qua email (kèm cảnh báo bảo mật).
- Đăng nhập **thật** bằng email/password với API server (`/api/auth/signup`, `/api/auth/signin`, `/api/auth/me`).
- Cloud publish: đăng dự án lên server, xem public qua `public.html?id=...`.
- Có ô **Cloud Server URL** để nhiều máy cùng trỏ vào một server => đồng bộ cloud giữa các máy.
- Nếu dự án Cloud là của bạn sẽ có nút **Unshare** để bỏ chia sẻ.
- Hỗ trợ khách (guest) với modal cảnh báo:
  - `You're not signed in. Log in to use this feature.`
  - Nút `Sign in`, `Sign up`, và nút `X` để đóng.
- Thêm đổi ngôn ngữ (VI/EN), tìm kiếm dự án local + cloud.
- Chèn nhiều audio track cùng lúc và đồng bộ playback theo timeline.
- Hiệu ứng hào quang có thêm chỉnh màu, độ cứng và alpha.
- Thêm hiệu ứng **Checker / Ca-rô** với màu ô A/B và slider offset/grid (ví dụ 8 = 8x8).
- Chia hiệu ứng thành các nhóm mới: **Color and Lights**, **Blur**, **Distortion / Warp**, **Move / Transform**, **Drawing & Edge**, **Procedural**, **Matte / Mask / Key**.
- **Copy Background** nằm trong nhóm Matte / Mask / Key và bắt buộc chọn hiệu ứng đi kèm như Gaussian blur / Invert color / Grayscale để nổi hiệu ứng theo hình layer.
- Movement/Rotate/Scale/Opacity dùng keyframe song hành theo từng phạm vi; **Scale và Opacity có store keyframe riêng**, không dùng chung keyframe layer.
- Đùn Raster có thêm slider góc X/Y/Z (tối đa 1000) để chỉnh hướng đùn trái/phải, trên/dưới và xoay 2D.
- Khi kéo keyframe, timeline giữ thứ tự ổn định trong lúc kéo để giảm hiện tượng marker bị giật lệch khỏi vị trí mong muốn.
- Thêm nút **◄ / ►** để nhảy giữa keyframe và mark trên timeline.
- Thêm **Mark a part / Delete this mark** để đánh dấu hoặc xoá mốc đỏ trên timeline.
- Camera frame ẩn ở dự án mới cho tới khi dùng **Add Camera**; nếu đã có sẽ báo `Camera frame has been exist on this project.`
- Đổi tên layer có thể xoá trắng hoàn toàn mà không tự phục hồi chữ cũ.
- Text Layer chỉ hiện khi đang chọn layer chữ.
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
