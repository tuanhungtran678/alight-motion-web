# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần, tối ưu giao diện cho điện thoại.

## Tính năng chính
- Màn hình chính đẹp với khung preview kiểu điện thoại, hiển thị không méo.
- Canvas preview tỉ lệ 9:16.
- Tạo layer hình chữ nhật, hình tròn, text.
- **Chèn hình ảnh** từ máy vào project (image layer).
- Chỉnh keyframe đầu/cuối cho vị trí, scale, rotation, opacity.
- Chọn easing (linear, ease in/out) + **Graph custom Ease** (đồ thị tốc độ chuyển động).
- **Hiệu ứng layer**: blur, brightness, contrast, saturate, shadow.
- Play / pause / reset + thanh tua timeline.
- Settings: ngôn ngữ, tỉ lệ màn hình, FPS, màu màn hình.
- **Tổng thời gian chỉnh sửa dự án** (tính từ lúc bắt đầu dự án đến hiện tại, lưu local).

## Chạy local
```bash
python3 -m http.server 4173
```
Sau đó mở: `http://localhost:4173/index.html`

## Ghi chú
- Nếu console báo lỗi từ `chrome-extension://.../popup.js` thì đó là do extension trình duyệt, không phải code app.
- Nếu bạn chỉ thấy README/tiêu đề repo thì là bạn đang mở trang repo, chưa mở app. Hãy dùng URL `index.html` như trên.
