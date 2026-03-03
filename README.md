# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần.

## Tính năng theo yêu cầu mới
- Tạo dự án mới bằng modal Create Project (ratio, FPS, tên, BG color).
- Dự án mới **trống layer** (không tự thêm hình vuông hay chữ Alight).
- Màn hình Home quản lý nhiều dự án: tạo / mở / xóa / chuyển dự án.
- Menu ⚙ trong editor để chỉnh tên dự án, ratio, FPS, màu nền.
- Layer kéo-thả trực tiếp trong canvas preview.
- Timeline + Keyframes: thêm/xóa keyframe tại thời điểm hiện tại, nội suy theo easing.
- Chỉnh màu layer bằng color picker.
- Light/Dark mode cho toàn giao diện.
- Xuất video WebM từ canvas bằng MediaRecorder.

## Chạy local
```bash
python3 -m http.server 4173
```
Mở: `http://localhost:4173/index.html`
