# StudyClaw — Trợ lý học tập chạy trực tiếp trên OpenClaw

Bản demo tối giản gồm đúng 2 chức năng:
1. **Tóm tắt tài liệu học tập**
2. **Giải thích kiến thức bằng tiếng Việt dễ hiểu**

Đây là cấu hình agent/workspace cho OpenClaw, **không cần làm web riêng, không cần server Node.js riêng và không cần viết API riêng**. Người học trò chuyện trực tiếp với agent StudyClaw trong OpenClaw.

## Cấu trúc

```text
studyclaw-openclaw/
├── AGENTS.md
├── SOUL.md
├── IDENTITY.md
├── README.md
└── skills/
    ├── tom-tat-tai-lieu/
    │   └── SKILL.md
    └── giai-thich-kien-thuc/
        └── SKILL.md
```

## Cách cài trên Windows

1. Tải hoặc clone repository này về máy.
2. Mở PowerShell tại thư mục dự án.
3. Kiểm tra OpenClaw đã được cài và cấu hình mô hình AI:

```powershell
openclaw --version
openclaw doctor
openclaw agents list
```

4. Tạo agent StudyClaw, dùng đường dẫn tuyệt đối đến thư mục `studyclaw-openclaw`. Ví dụ nếu repository nằm ở `C:\Users\YourName\game`:

```powershell
openclaw agents add studyclaw --workspace "C:\Users\YourName\game\studyclaw-openclaw"
```

Thay đường dẫn ví dụ bằng đường dẫn thực tế trên máy. Nếu phiên bản OpenClaw hỏi cấu hình bổ sung, làm theo hướng dẫn trên terminal.

5. Kiểm tra agent và chạy thử:

```powershell
openclaw agents list
openclaw agent --agent studyclaw --message "Giải thích khóa chính trong SQL Server bằng tiếng Việt dễ hiểu, kèm ví dụ."
```

Nếu lệnh báo Gateway chưa chạy, kiểm tra bằng:

```powershell
openclaw gateway status
```

Khởi động/cấu hình OpenClaw theo hướng dẫn cài đặt của phiên bản bạn đang dùng. Agent cần có mô hình AI đã được cấu hình để trả lời.

## Cách dùng

Sau khi tạo agent, gửi yêu cầu trực tiếp trong OpenClaw:

**Tóm tắt tài liệu**
> Hãy tóm tắt tài liệu sau thành các ý chính, thuật ngữ quan trọng và phần cần ghi nhớ: [dán tài liệu]

**Giải thích kiến thức**
> Giải thích khóa chính và khóa ngoại trong SQL Server như đang hướng dẫn người mới học. Cho ví dụ đơn giản.

Bạn cũng có thể gửi tài liệu dài theo từng phần và yêu cầu tóm tắt từng phần trước khi tổng hợp.

## Lưu ý

- Demo tập trung vào văn bản; hãy dán nội dung hoặc cung cấp tệp theo cách mà phiên bản OpenClaw của bạn hỗ trợ.
- Agent phải phân biệt thông tin có trong tài liệu với kiến thức bổ sung, và nói rõ khi thiếu dữ liệu.
- Không gửi mật khẩu, khóa API hoặc thông tin cá nhân nhạy cảm vào tài liệu học tập.
- Nếu muốn dùng agent qua giao diện web/chat của OpenClaw, mở Control UI/dashboard của OpenClaw và chọn agent/session tương ứng nếu giao diện và cấu hình của bạn hỗ trợ.

## Tài liệu chính thức

- OpenClaw Getting Started: https://docs.openclaw.ai/getting-started
- OpenClaw Agents CLI: https://docs.openclaw.ai/cli/agents
- OpenClaw Agent CLI: https://docs.openclaw.ai/cli/agent
