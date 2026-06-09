# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần + Node server.

## Tính năng mới
- Đăng nhập chính dùng **Firebase Auth** với cấu hình project `alight-motion-web` (Email/Password, Google, GitHub).
- Đã bỏ nút đăng nhập Apple và Microsoft theo yêu cầu.
- API server / local auth vẫn còn làm fallback khi Firebase SDK hoặc backend chưa sẵn sàng.
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

## Firebase Auth
Frontend đã nạp Firebase compat SDK và dùng cấu hình:

```js
apiKey: "AIzaSyC4O0GWiUaQM7Bu-FQGaYU64ix6Zv0EZGk"
authDomain: "alight-motion-web.firebaseapp.com"
projectId: "alight-motion-web"
storageBucket: "alight-motion-web.firebasestorage.app"
messagingSenderId: "379916623638"
appId: "1:379916623638:web:c357ebe47320e81f4c7a37"
measurementId: "G-6D7H3EVV3M"
```

Bật Email/Password, Google và GitHub providers trong Firebase Console để đăng nhập thật.

## Docker / Render
Repo có `Dockerfile` để deploy lên Render bằng Docker. Render sẽ set biến `PORT`; server đã đọc `process.env.PORT`.

```bash
docker build -t alight-motion-web .
docker run -p 4173:4173 alight-motion-web
```

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
