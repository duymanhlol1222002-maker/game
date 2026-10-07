"""Game Câu Đố Trí Tuệ (Python Quiz Game)
Máy tự động ra câu hỏi ngẫu nhiên với 2 cấp độ: DỄ và KHÓ.

Cách chạy:
    python game/main.py
"""

from __future__ import annotations

import json
import os
import random
import sys
import time
from pathlib import Path

# Mã màu ANSI định dạng giao diện terminal
RESET = "\033[0m"
BOLD = "\033[1m"
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
MAGENTA = "\033[95m"
BLUE = "\033[94m"
DIM = "\033[2m"

# Bình luận của máy tính khi người chơi trả lời
BOT_PRAISES = [
    "🤖 Máy tính: 'Bạn quá đỉnh! Câu này không làm khó được bạn rồi!'",
    "🤖 Máy tính: 'Chính xác 100%! Phản xạ rất nhanh nhẹn!'",
    "🤖 Máy tính: 'Đúng rồi! Bộ não của bạn hoạt động công suất cao thật!'",
    "🤖 Máy tính: 'Tuyệt cú mèo! Tiếp tục giữ vững phong độ nhé!'",
    "🤖 Máy tính: 'Xuất sắc! Tôi phải ra câu khó hơn mới được!'",
]

BOT_TAUNTS = [
    "🤖 Máy tính: 'Haha! Bị câu đố mẹo của tôi lừa rồi nhé!'",
    "🤖 Máy tính: 'Sai mất rồi! Đọc kỹ câu hỏi hơn một chút nào!'",
    "🤖 Máy tính: 'Tiếc quá! Câu này rất nhiều người bị mắc bẫy giống bạn!'",
    "🤖 Máy tính: 'Cố lên! Đừng để máy tính vượt mặt nhé!'",
    "🤖 Máy tính: 'Đố mẹo mà, phải tỉnh táo lên chứ!'",
]


if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stdin.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def clear_screen() -> None:
    """Xóa màn hình terminal."""
    os.system("cls" if os.name == "nt" else "clear")


def load_questions() -> dict[str, list[dict]]:
    """Tải ngân hàng câu hỏi từ file questions.json trong cùng thư mục."""
    json_path = Path(__file__).parent / "questions.json"
    if json_path.exists():
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"{YELLOW}Cảnh báo: Không thể tải questions.json ({e}), dùng câu hỏi mặc định.{RESET}")

    # Câu hỏi dự phòng khẩn cấp
    return {
        "easy": [
            {
                "id": "fe1",
                "question": "Con gì đập thì sống, không đập thì chết?",
                "options": ["Con tim", "Con muỗi", "Con cua", "Con cá"],
                "answer": 0,
                "hint": "Nằm trong lồng ngực của bạn!",
                "explanation": "Quả tim đập thì con người mới sống được.",
            }
        ],
        "hard": [
            {
                "id": "fh1",
                "question": "Người nông dân có 17 con cừu. Trừ 9 con chạy thoát, số còn lại chết hết. Hỏi còn lại bao nhiêu con?",
                "options": ["9 con", "8 con", "17 con", "0 con"],
                "answer": 0,
                "hint": "Chú ý chữ 'Trừ 9 con...'",
                "explanation": "'Trừ 9 con chạy thoát (còn sống)', số còn lại chết, nên còn đúng 9 con!",
            }
        ],
    }


def print_banner() -> None:
    """In banner tiêu đề game."""
    clear_screen()
    print(f"{CYAN}{BOLD}")
    print("=" * 64)
    print("          🧠  GAME CÂU ĐỐ TRÍ TUỆ: ĐẤU VỚI MÁY TÍNH  🧠        ")
    print("=" * 64)
    print(f"{RESET}")


class QuizGame:
    def __init__(self, mode: str, questions: list[dict]):
        self.mode = mode  # 'easy' hoặc 'hard'
        self.raw_questions = questions
        self.score = 0
        self.streak = 0
        self.max_streak = 0
        self.question_count = min(7, len(questions))

        if mode == "easy":
            self.lives = 3
            self.pts_per_correct = 10
            self.lifeline_5050 = 1
            self.lifeline_hint = 2
        else:
            self.lives = 1
            self.pts_per_correct = 25
            self.lifeline_5050 = 0
            self.lifeline_hint = 0

    def play(self) -> None:
        """Bắt đầu vòng đấu câu hỏi."""
        selected_questions = random.sample(self.raw_questions, self.question_count)

        for idx, q_data in enumerate(selected_questions, start=1):
            if self.lives <= 0:
                print(f"\n{RED}{BOLD}💥 Bạn đã hết mạng! Trò chơi kết thúc! 💥{RESET}")
                break

            self.render_hud(idx)
            is_correct = self.ask_question(idx, q_data)

            if is_correct:
                bonus = self.streak * 2
                earned = self.pts_per_correct + bonus
                self.score += earned
                self.streak += 1
                self.max_streak = max(self.max_streak, self.streak)
                print(f"\n{GREEN}{BOLD}✅ CHÍNH XÁC! (+{self.pts_per_correct} điểm){RESET}")
                if self.streak > 1:
                    print(f"{YELLOW}🔥 Combo chuỗi đúng: x{self.streak}! (+{bonus} điểm thưởng){RESET}")
                print(f"{CYAN}{random.choice(BOT_PRAISES)}{RESET}")
            else:
                self.lives -= 1
                self.streak = 0
                print(f"\n{RED}{BOLD}❌ SAI RỒI! Bạn bị mất 1 mạng ❤️{RESET}")
                print(f"{MAGENTA}{random.choice(BOT_TAUNTS)}{RESET}")

            # Hiện giải thích của máy
            print(f"{BLUE}💡 Lời giải thích:{RESET} {q_data.get('explanation', '')}")
            input(f"\n{DIM}Nhấn [Enter] để máy chuyển sang câu tiếp theo...{RESET}")

        self.show_game_over(len(selected_questions))

    def render_hud(self, current_q: int) -> None:
        """Hiển thị HUD thông số ván chơi."""
        clear_screen()
        mode_str = f"{GREEN}DỄ (3 Mạng - Có Trợ Giúp){RESET}" if self.mode == "easy" else f"{RED}KHÓ (1 Mạng - Bẫy Não){RESET}"
        lives_str = "❤️ " * self.lives + "🖤 " * (3 - self.lives)
        print("—" * 64)
        print(f" Chế độ: {mode_str}")
        print(f" Câu hỏi: {BOLD}{current_q}/{self.question_count}{RESET}   |   Điểm số: {YELLOW}{BOLD}{self.score}{RESET}   |   Chuỗi: {YELLOW}{self.streak}🔥{RESET}")
        print(f" Mạng còn lại: {lives_str.strip()}")
        if self.mode == "easy":
            print(f" Quyền trợ giúp: [H] Gợi ý: {self.lifeline_hint} lần  |  [F] 50/50: {self.lifeline_5050} lần")
        print("—" * 64)

    def ask_question(self, q_num: int, q_data: dict) -> bool:
        """Máy tính ra câu hỏi và nhận câu trả lời."""
        question_text = q_data["question"]
        original_options = list(q_data["options"])
        correct_answer_text = original_options[q_data["answer"]]

        # Xáo trộn thứ tự các lựa chọn để vị trí đáp án ngẫu nhiên
        shuffled_options = list(original_options)
        random.shuffle(shuffled_options)
        correct_index = shuffled_options.index(correct_answer_text)

        hidden_indices: set[int] = set()

        print(f"\n{BOLD}{CYAN}Câu hỏi {q_num}:{RESET} {BOLD}{question_text}{RESET}\n")

        while True:
            labels = ["A", "B", "C", "D"]
            for i, opt in enumerate(shuffled_options):
                if i in hidden_indices:
                    print(f"  {labels[i]}. {DIM}[ Đã bị loại trừ bởi 50/50 ]{RESET}")
                else:
                    print(f"  {BOLD}{labels[i]}.{RESET} {opt}")

            prompt_msg = f"\n{YELLOW}Nhập câu trả lời (A, B, C, D)"
            if self.mode == "easy":
                prompt_msg += " hoặc [H] Gợi ý / [F] 50:50"
            prompt_msg += f": {RESET}"

            user_choice = input(prompt_msg).strip().upper()

            # Quyền trợ giúp gợi ý
            if user_choice == "H" and self.mode == "easy":
                if self.lifeline_hint > 0:
                    self.lifeline_hint -= 1
                    print(f"\n{YELLOW}💡 GỢI Ý TỪ MÁY TÍNH: {q_data.get('hint', 'Hãy tư duy theo hướng đố mẹo nhé!')}{RESET}\n")
                else:
                    print(f"\n{RED}Bạn đã dùng hết quyền Gợi ý rồi!{RESET}\n")
                continue

            # Quyền trợ giúp 50/50
            if user_choice == "F" and self.mode == "easy":
                if self.lifeline_5050 > 0:
                    if len(hidden_indices) > 0:
                        print(f"\n{YELLOW}Bạn đã dùng 50/50 cho câu này rồi!{RESET}\n")
                    else:
                        self.lifeline_5050 -= 1
                        wrong_indices = [i for i in range(len(shuffled_options)) if i != correct_index]
                        to_hide = random.sample(wrong_indices, 2)
                        hidden_indices.update(to_hide)
                        print(f"\n{YELLOW}✨ Đã kích hoạt 50/50! Hai phương án sai đã bị loại bỏ.{RESET}\n")
                else:
                    print(f"\n{RED}Bạn đã dùng hết quyền 50/50 rồi!{RESET}\n")
                continue

            # Kiểm tra câu trả lời
            if user_choice in labels:
                chosen_index = labels.index(user_choice)
                if chosen_index in hidden_indices:
                    print(f"{RED}Phương án đó đã bị loại trừ, hãy chọn phương án khác!{RESET}")
                    continue
                return chosen_index == correct_index
            else:
                print(f"{RED}Vui lòng chỉ nhập A, B, C hoặc D!{RESET}")

    def show_game_over(self, total_asked: int) -> None:
        """Tổng kết kết quả sau ván chơi."""
        clear_screen()
        print(f"{CYAN}{BOLD}")
        print("=" * 64)
        print("                   🏁 TỔNG KẾT VÁN ĐẤU 🏁                     ")
        print("=" * 64)
        print(f"{RESET}")

        print(f" Cấp độ đã chơi: {BOLD}{self.mode.upper()}{RESET}")
        print(f" Tổng điểm: {YELLOW}{BOLD}{self.score} điểm{RESET}")
        print(f" Chuỗi đúng dài nhất: {YELLOW}{BOLD}{self.max_streak} câu liên tiếp{RESET}")
        print(f" Mạng còn lại: {'❤️ ' * self.lives if self.lives > 0 else 'Hết mạng'}")

        print("\n" + "—" * 64)
        if self.score >= 120:
            rank = "🏆 BẬC THẦY HACK NÃO (Thánh Trí Tuệ)"
            comment = "Máy tính hoàn toàn bị bạn khuất phục! Bạn có tư duy cực kỳ nhạy bén!"
        elif self.score >= 60:
            rank = "🥈 CAO THỦ PHẢN XẠ"
            comment = "Rất ấn tượng! Bạn đã vượt qua được hầu hết các câu đố bẫy của máy!"
        elif self.score >= 30:
            rank = "🥉 TẬP SỰ THÔNG THÁI"
            comment = "Khá tốt! Luyện tập thêm một chút nữa bạn sẽ đạt điểm tuyệt đối!"
        else:
            rank = "🌱 NGƯỜI CHƠI MỚI"
            comment = "Đừng nản lòng, câu đố mẹo của máy tính vốn rất lắt léo!"

        print(f" Danh hiệu: {GREEN}{BOLD}{rank}{RESET}")
        print(f" Đánh giá từ Máy: {CYAN}{comment}{RESET}")
        print("—" * 64)


def main() -> None:
    questions_data = load_questions()

    while True:
        print_banner()
        print(f"{BOLD}CHỌN CẤP ĐỘ CÂU ĐỐ DO MÁY ĐƯA RA:{RESET}\n")
        print(f"  {GREEN}{BOLD}[1] CẤP ĐỘ DỄ (Easy Mode){RESET}")
        print("      - Câu đố mẹo vui nhộn, gần gũi trong đời sống")
        print("      - Có 3 mạng ❤️❤️❤️")
        print("      - Có 2 quyền Gợi ý và 1 quyền 50/50\n")

        print(f"  {RED}{BOLD}[2] CẤP ĐỘ KHÓ (Hard Mode){RESET}")
        print("      - Câu đố bẫy logic xoắn não, đánh lừa phản xạ")
        print("      - Chỉ có đúng 1 mạng duy nhất ❤️ (Sai là Game Over)")
        print("      - Không có trợ giúp, điểm thưởng cao gấp 2.5 lần (+25đ/câu)\n")

        print(f"  {YELLOW}{BOLD}[3] XEM KHO CÂU HỎI & HƯỚNG DẪN{RESET}")
        print(f"  {DIM}[0] Thoát trò chơi{RESET}\n")

        choice = input(f"{CYAN}Nhập lựa chọn của bạn (0 - 3): {RESET}").strip()

        if choice == "1":
            easy_qs = questions_data.get("easy", [])
            game = QuizGame(mode="easy", questions=easy_qs)
            game.play()
            input(f"\n{DIM}Nhấn [Enter] để quay lại menu chính...{RESET}")
        elif choice == "2":
            hard_qs = questions_data.get("hard", [])
            game = QuizGame(mode="hard", questions=hard_qs)
            game.play()
            input(f"\n{DIM}Nhấn [Enter] để quay lại menu chính...{RESET}")
        elif choice == "3":
            clear_screen()
            print_banner()
            print(f"{BOLD}KHO DỮ LIỆU CÂU HỎI:{RESET}\n")
            print(f"- Số câu hỏi cấp độ DỄ: {len(questions_data.get('easy', []))} câu")
            print(f"- Số câu hỏi cấp độ KHÓ: {len(questions_data.get('hard', []))} câu")
            print("\n* Đặc điểm: Máy tính tự động xáo trộn ngẫu nhiên thứ tự câu hỏi và thứ tự các đáp án A/B/C/D mỗi khi chơi.")
            print("* Mở rộng: Bạn có thể thêm câu hỏi mới trực tiếp vào file questions.json trong thư mục này.")
            input(f"\n{DIM}Nhấn [Enter] để quay lại menu chính...{RESET}")
        elif choice == "0":
            print(f"\n{CYAN}Tạm biệt bạn! Hẹn gặp lại trong các thử thách trí tuệ tiếp theo! 👋{RESET}\n")
            break
        else:
            print(f"{RED}Lựa chọn không hợp lệ, vui lòng nhập 1, 2, 3 hoặc 0!{RESET}")
            time.sleep(1)


if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, EOFError):
        print(f"\n\n{YELLOW}Trò chơi đã dừng lại. Hẹn gặp lại bạn! 👋{RESET}\n")
        sys.exit(0)
