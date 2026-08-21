# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần + Node server.

## Tính năng mới
- Đăng nhập chính dùng **Firebase Auth** với cấu hình project `alight-motion-web` (Email/Password, Google, GitHub).
- Đã bỏ nút đăng nhập Apple và Microsoft theo yêu cầu.
- API server / local auth vẫn còn làm fallback khi Firebase SDK hoặc backend chưa sẵn sàng.
- Cloud publish: đăng dự án lên server, xem public qua `public.html?id=...`.
- Cloud được thiết kế để dùng với **Render Web Service**: nhập URL dạng `https://your-render-service.onrender.com` vào ô **Render Cloud URL** để nhiều máy cùng đồng bộ về một server.
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
- Nút xuất đã đổi thành **Xuất Video** và mở menu Export mới gồm: Video, GIF, Image Sequence, Project Package và XML.
- XML export ghi tổng quan project (resolution/FPS/duration), layer, transform, keyframe, effect và source file để có thể nhập lại bằng Hero Banner **Nhập file .xml**.
- Hero Banner trên Home hỗ trợ nhập file `.xml` bằng nút **Nhập file**.
- Project Menu được làm mới với nền blur, gradient và card bo lớn hơn.
- Thêm nút **Profile** trên Header với dropdown: Your Profile, Studio, Settings.
- Thêm **Alight Motion Web Studio** để xem số Follower, Followers/Following, lượt xem và số project Cloud.
- Thêm Socket.IO demo/fallback để chuẩn bị realtime stats khi triển khai server.
- Khi bấm Publish Cloud sẽ mở cửa sổ nhập **Title**, **Description** và **Filters** (anime, 8bit, edit, drop, game, chess).
- Cloud project viewer trong app có Play/Pause, thanh thời lượng, chọn tốc độ, uploader, Like/Dislike, views và Details.
- Sửa Cloud khi dùng Firebase Auth: client gửi thêm header demo user và server nhận `X-Demo-User-*`, nên publish/list Cloud hoạt động trên Render/local thay vì chỉ hiểu local session token.
- Profile đã chuyển sang dạng **full page kiểu YouTube** với cover banner, avatar, tabs và danh sách project.
- Thêm Notification dropdown ở Header để báo publish/import/fallback Cloud.
- Icon Header dùng bộ **Lucide icon set** (tương thích app vanilla qua CDN; không chuyển toàn app sang React).

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

### Dùng Render làm Cloud
1. Tạo **Render Web Service** từ repo này và dùng Dockerfile có sẵn.
2. Sau khi deploy, copy URL Render, ví dụ `https://alight-motion-web.onrender.com`.
3. Trong Home của app, dán URL đó vào ô **Render Cloud URL** rồi bấm tải lại Cloud.
4. Nếu frontend và API cùng chạy trên Render thì có thể để trống ô này; app sẽ dùng cùng origin. Nếu frontend ở domain khác, public viewer sẽ tự truyền `apiBase` trong link để mở project từ Render Cloud.
5. Server đã bật CORS cho API cloud/auth để nhiều thiết bị hoặc domain khác có thể gọi về Render.

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
