# game
# 🧠 Game Câu Đố Trí Tuệ — Thách Thức Máy Tính

Game đố vui trí tuệ và câu đố mẹo với 2 cấp độ **DỄ** và **KHÓ**, máy tính tự động ra câu hỏi ngẫu nhiên và chấm điểm thông minh.

Dự án cung cấp cả 2 cách chơi:
1. **Chơi trên Terminal bằng Python** (phù hợp ôn tập và thực hành lập trình)
2. **Chơi trên Trình duyệt Web** (giao diện hiện đại, âm thanh sống động, hiệu ứng đếm giờ)

---

## 🎮 Cách 1: Chơi trực tiếp bằng Python (Terminal)

Mở terminal tại thư mục gốc của dự án và chạy lệnh:

```bash
python game/main.py
```

### Luật chơi trên Terminal:
* **Cấp độ DỄ (Easy)**:
  * 3 Mạng (`❤️❤️❤️`)
  * Trợ giúp: Nhập `H` để xem Gợi ý, nhập `F` để dùng quyền 50/50 loại trừ 2 đáp án sai.
  * Trả lời bằng cách gõ: `A`, `B`, `C` hoặc `D`.
  * Đúng: +10 điểm (+ điểm thưởng combo chuỗi đúng liên tiếp).
* **Cấp độ KHÓ (Hard)**:
  * 1 Mạng duy nhất (`❤️`) — Sai là Game Over ngay lập tức!
  * Không có trợ giúp, câu đố bẫy logic sâu.
  * Đúng: +25 điểm (+ điểm thưởng combo).

---

## 🌐 Cách 2: Chơi trên Trình duyệt Web

Chỉ cần **nhấp đúp chuột** vào file:
👉 [`game/index.html`](index.html)

Hoặc mở bằng trình duyệt (Chrome, Edge, Cốc Cốc, Firefox).

### Tính năng phiên bản Web:
* Đồng hồ đếm ngược: 25 giây (Dễ) / 15 giây (Khó).
* Hiệu ứng âm thanh Arcade được tạo tự động bằng Web Audio API (không cần tải file ngoài).
* Máy tính (Host bot) có biểu cảm và lời nhận xét dí dỏm tương ứng với mỗi câu trả lời.
* Bảng thống kê điểm số, chuỗi đúng và xếp hạng danh hiệu cuối trận.

---

## 📂 Cấu trúc thư mục `game/`

```text
game/
├── main.py           # Mã nguồn game Python chạy trong Terminal
├── questions.json    # Ngân hàng câu hỏi Dễ & Khó (dễ dàng bổ sung thêm câu hỏi mới)
├── index.html        # Giao diện Web HTML5
├── style.css         # Thiết kế CSS Dark Mode & Glassmorphism
├── app.js            # Xử lý logic game Web, đếm giờ, tính điểm
├── sound.js          # Hệ thống âm thanh Web Audio API
└── README.md         # Hướng dẫn chơi
```
