# alight-motion-web

Bản demo **Alight Motion Web Lite** chạy bằng HTML/CSS/JS thuần, tối ưu giao diện cho điện thoại.

## Tính năng chính
- Canvas preview tỉ lệ 9:16.
- Tạo layer hình chữ nhật, hình tròn, text.
- Chỉnh keyframe đầu/cuối cho vị trí, scale, rotation, opacity.
- Chọn easing (linear, ease in/out).
- Play / pause / reset + thanh tua timeline.

## Chạy local
```bash
python3 -m http.server 4173
```
Sau đó mở: `http://localhost:4173`

## Khắc phục lỗi `Cannot set properties of null (setting 'valueAsNumber')`
Nếu console báo lỗi kiểu:

```text
Error handling response: TypeError: Cannot set properties of null (setting 'valueAsNumber')
at chrome-extension://.../popup.js
```

thì lỗi này đến từ **extension của trình duyệt** (không phải từ code của project). Cách xử lý:
- Tắt extension đang inject script vào trang rồi tải lại trang.
- Hoặc mở bằng cửa sổ ẩn danh (không bật extension).
- Hoặc test bằng profile Chrome/Edge mới, không cài extension.


## Nếu bạn chỉ thấy README/tiêu đề repo
Nếu bạn mở link repo (GitHub/GitLab UI), bạn sẽ chỉ thấy file README chứ không phải ứng dụng.

Hãy mở ứng dụng đúng cách:
- Chạy local server: `python3 -m http.server 4173`
- Mở: `http://localhost:4173/index.html`

Hoặc deploy static site và đảm bảo file `index.html` nằm ở thư mục public root.
