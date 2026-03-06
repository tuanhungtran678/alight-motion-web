# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần.

## Cập nhật theo góp ý
1. Xuất video ưu tiên **.mp4** (nếu trình duyệt hỗ trợ `MediaRecorder` cho MP4).
2. Giao diện dark đổi sang tông chính **#223467**.
3. Timeline được làm lại theo kiểu track hàng ngang giống mock (có lock/eye, thanh layer, marker keyframe, playhead).

## Tính năng chính
- Home quản lý nhiều dự án: tạo / mở / xóa.
- Project mới trống layer.
- Menu ⚙ chỉnh tên dự án, ratio, FPS, màu nền.
- Layer kéo-thả trực tiếp trên canvas.
- Timeline + keyframe nội suy theo easing (kể cả custom graph).
- Light/Dark mode.
- Chỉnh màu layer.

## Chạy local
```bash
python3 -m http.server 4173
```
Mở: `http://localhost:4173/index.html`
