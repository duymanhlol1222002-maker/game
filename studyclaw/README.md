# StudyClaw Mini — Trợ lý học tập bằng OpenClaw

Demo web tối giản với 2 chức năng:
1. **Tóm tắt tài liệu** theo độ dài ngắn/vừa/chi tiết.
2. **Giải thích kiến thức** bằng tiếng Việt dễ hiểu.

Ứng dụng gọi OpenClaw CLI đã cấu hình trên máy, không gọi API AI riêng. Giao diện hỗ trợ dán văn bản hoặc tải tệp TXT/Markdown.

## Cấu trúc

```text
studyclaw/
├── index.html    # Giao diện web
├── style.css     # Giao diện và bố cục
├── app.js        # Tương tác phía trình duyệt
├── server.mjs    # Server cục bộ và tích hợp OpenClaw CLI
└── README.md
```

## Yêu cầu

- Node.js 20 trở lên.
- OpenClaw đã cài đặt, hoàn tất onboarding và cấu hình mô hình AI.
- Lệnh `openclaw --version` chạy được trong terminal.
- Gateway OpenClaw đang hoạt động và agent `main` có thể nhận yêu cầu.

## Chạy trên Windows

Mở PowerShell trong thư mục `studyclaw`:

```powershell
openclaw --version
openclaw doctor
node server.mjs
```

Mở trình duyệt tại **http://127.0.0.1:3030**.

Nếu agent không tên `main`, hãy đặt biến môi trường trước khi chạy. Ví dụ trong PowerShell:

```powershell
$env:OPENCLAW_AGENT="main"
node server.mjs
```

## Chạy trên macOS/Linux

```bash
openclaw --version
openclaw doctor
node server.mjs
```

Sau đó mở http://127.0.0.1:3030.

## Cách dùng

1. Dán nội dung bài học vào khung nhập hoặc chọn tệp `.txt` / `.md`.
2. Chọn **Tóm tắt tài liệu** hoặc **Giải thích kiến thức**.
3. Bấm nút thực hiện và đợi Agent trả kết quả.
4. Sao chép kết quả để lưu vào ghi chú.

## Giới hạn demo

- Chưa đọc trực tiếp PDF; hãy sao chép văn bản từ PDF hoặc chuyển thành TXT/Markdown.
- Giới hạn nội dung 100.000 ký tự và thời gian chờ Agent 120 giây.
- Không có tài khoản, lịch sử hoặc cơ sở dữ liệu.
- Server chỉ bind vào `127.0.0.1`; không triển khai công khai khi chưa bổ sung xác thực và kiểm soát quyền.
- Server gọi lệnh OpenClaw với quyền của tài khoản đang chạy. Chỉ sử dụng trên máy cá nhân đáng tin cậy, không gửi mật khẩu hoặc thông tin nhạy cảm.
- Nếu Windows không chạy được `openclaw.cmd`, hãy kiểm tra cách cài CLI và PATH của OpenClaw.

## Tài liệu

- OpenClaw Agent CLI: https://docs.openclaw.ai/cli/agent
- OpenClaw Getting Started: https://docs.openclaw.ai/start/getting-started
