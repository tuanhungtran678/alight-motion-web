# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần, có thêm đăng nhập social + Cloud publish.

## Tính năng mới theo yêu cầu
- Đăng nhập nhanh bằng các nhà cung cấp: **Google, GitHub, Apple, Microsoft** (demo social login trong client).
- Thêm khu vực **Cloud Community** ở màn hình chính.
- Có thể **đăng project lên server** bằng nút `☁ Đăng lên Cloud` và mở trang xem công khai qua `public.html?id=...`.
- Nâng cấp giao diện home đẹp hơn (hero, social buttons, card cloud).

## Tính năng chính
- Home quản lý nhiều dự án: tạo / mở / xóa.
- Menu ⚙ chỉnh tên dự án, ratio, FPS, độ phân giải, màu nền.
- Layer kéo-thả trực tiếp trên canvas.
- Timeline + keyframe nội suy theo easing (kể cả custom graph).
- Light/Dark mode.
- Chỉnh text/layer/effect.
- Export video MP4 (khi trình duyệt hỗ trợ `MediaRecorder` cho MP4).

## Chạy local
### Cách 1 (đầy đủ, có API Cloud)
```bash
node server.js
```
Mở: `http://localhost:4173/index.html`

### Cách 2 (chỉ static)
```bash
python3 -m http.server 4173
```
Mở: `http://localhost:4173/index.html`

> Nếu chạy static server, Cloud sẽ tự fallback sang localStorage (demo mode).
