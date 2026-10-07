// Logic Game Câu Đố Trí Tuệ Web
let questionsData = null;
let currentMode = 'easy'; // 'easy' hoặc 'hard'
let activeQuestions = [];
let currentQIndex = 0;
let score = 0;
let lives = 3;
let streak = 0;
let maxStreak = 0;
let timerInterval = null;
let timeLeft = 25;
let maxTime = 25;
let count5050 = 1;
let countHint = 2;
let isAnswered = false;

// Ngân hàng câu hỏi dự phòng nếu chạy từ file:// protocol mà fetch bị chặn CORS
const FALLBACK_BANK = {
  easy: [
    {
      question: "Con gì đập thì sống, không đập thì chết?",
      options: ["Con tim", "Con muỗi", "Con cua", "Con cá"],
      answer: 0,
      hint: "Nằm trong lồng ngực của bạn đấy!",
      explanation: "Quả tim đập thì con người và động vật mới sống."
    },
    {
      question: "Cái gì đen khi bạn mua nó, đỏ khi dùng nó, và xám xịt khi vứt nó đi?",
      options: ["Than củi", "Bút chì", "Cục tẩy", "Bật lửa"],
      answer: 0,
      hint: "Dùng để nướng thịt, nấu nướng hoặc sưởi ấm.",
      explanation: "Than khi mua có màu đen, khi đốt đỏ rực, khi tàn thành tro màu xám."
    },
    {
      question: "Bệnh gì bác sĩ bó tay hoàn toàn?",
      options: ["Bệnh gãy tay", "Bệnh cảm cúm", "Bệnh đau mắt", "Bệnh đau bụng"],
      answer: 0,
      hint: "Phải dùng thạch cao hoặc nẹp cố định cánh tay lại.",
      explanation: "Gãy tay thì bác sĩ phải 'bó tay' lại để xương mau lành."
    },
    {
      question: "Mặt trời mọc ở hướng nào và lặn ở hướng nào?",
      options: ["Đông - Tây", "Tây - Đông", "Nam - Bắc", "Bắc - Nam"],
      answer: 0,
      hint: "Phía biển Đông đón bình minh đầu tiên.",
      explanation: "Do Trái Đất quay từ Tây sang Đông nên ta thấy Mặt trời mọc ở hướng Đông và lặn ở hướng Tây."
    },
    {
      question: "Cái gì tay trái cầm được mà tay phải không bao giờ cầm được?",
      options: ["Khuỷu tay phải", "Điện thoại", "Cây bút", "Cốc nước"],
      answer: 0,
      hint: "Một bộ phận trên chính cánh tay phải của bạn.",
      explanation: "Tay phải không thể tự cầm vào cổ tay hoặc khuỷu tay của chính nó."
    },
    {
      question: "Lịch nào dài nhất trên thế giới?",
      options: ["Lịch sử", "Lịch vạn niên", "Lịch treo tường", "Lịch để bàn"],
      answer: 0,
      hint: "Gắn liền với quá trình hình thành và phát triển của nhân loại.",
      explanation: "'Lịch sử' trải dài hàng triệu năm từ thời nguyên thủy đến nay."
    },
    {
      question: "Cái gì càng bớt đi thì lại càng to ra?",
      options: ["Cái hố / Cái lỗ", "Cái bánh", "Đống rơm", "Đám mây"],
      answer: 0,
      hint: "Bạn đào bớt đất đi thì nó thế nào?",
      explanation: "Càng đào bớt đất ra thì cái hố càng to."
    }
  ],
  hard: [
    {
      question: "Một người nông dân có 17 con cừu. Trừ 9 con chạy thoát, số còn lại bị chết hết. Hỏi người đó còn lại bao nhiêu con cừu?",
      options: ["9 con", "8 con", "17 con", "0 con"],
      answer: 0,
      hint: "Đọc thật kỹ chữ 'Trừ 9 con...'",
      explanation: "'Trừ 9 con (còn sống)', những con khác chết hết, vậy người đó còn đúng 9 con cừu sống!"
    },
    {
      question: "Cái gì có cổ nhưng không có miệng, có đáy nhưng không có chân?",
      options: ["Cái chai", "Con hươu cao cổ", "Cái áo sơ mi", "Cây đàn guitar"],
      answer: 0,
      hint: "Vật dụng dùng để đựng nước, nước ngọt hoặc rượu.",
      explanation: "Cái chai có cổ chai, đáy chai, miệng chai rót nước nhưng không có miệng ăn."
    },
    {
      question: "Bạn đang chạy đua marathon. Nếu bạn vượt qua người đang ở vị trí thứ hai, bạn đang ở vị trí thứ mấy?",
      options: ["Thứ hai", "Thứ nhất", "Thứ ba", "Chưa xác định"],
      answer: 0,
      hint: "Bạn chiếm vị trí của người bạn vừa vượt qua.",
      explanation: "Vượt qua người thứ 2 thì bạn sẽ thế chỗ họ ở vị trí thứ 2, người dẫn đầu vẫn là người thứ nhất!"
    },
    {
      question: "Bố của Mary có 5 người con gái: 1. Nana, 2. Nene, 3. Nini, 4. Nono. Hỏi người con gái thứ 5 tên là gì?",
      options: ["Mary", "Nunu", "Nana", "Nina"],
      answer: 0,
      hint: "Xem lại câu mở đầu: 'Bố của ai...?'",
      explanation: "Câu hỏi đã nói rõ: 'Bố của Mary có 5 người con gái', vậy người thứ 5 chính là Mary!"
    },
    {
      question: "Nếu 3 con mèo bắt được 3 con chuột trong 3 phút, thì cần bao nhiêu con mèo để bắt được 100 con chuột trong 100 phút?",
      options: ["3 con mèo", "100 con mèo", "33 con mèo", "1 con mèo"],
      answer: 0,
      hint: "1 con mèo mất bao nhiêu phút để bắt 1 con chuột?",
      explanation: "3 con mèo bắt 3 con chuột trong 3 phút => 3 con mèo đó cứ mỗi 3 phút bắt 3 chuột. Trong 100 phút, 3 con mèo sẽ bắt được đúng 100 con chuột!"
    },
    {
      question: "Hai người cha và hai người con cùng đi câu cá. Mỗi người câu được một con cá. Nhưng khi đếm lại giỏ chỉ có tổng cộng 3 con cá. Tại sao?",
      options: ["Có 3 người: Ông nội, Bố và Con trai", "Một con cá bị rơi xuống nước", "Có một người không câu", "Họ tính nhầm"],
      answer: 0,
      hint: "Mối quan hệ 3 thế hệ trong một gia đình.",
      explanation: "Có 3 người: Ông nội (cha của bố), Bố (vừa là con của ông vừa là cha của con trai), và Cháu trai (con). Đó là 2 người cha và 2 người con!"
    },
    {
      question: "Cái gì mà người làm ra nó không dùng, người mua nó không dùng, còn người dùng nó lại không bao giờ nhìn thấy?",
      options: ["Quan tài", "Mắt kính", "Bóng đèn", "Đôi giày"],
      answer: 0,
      hint: "Một vật dụng trong tang lễ.",
      explanation: "Thợ đóng quan tài không dùng, người thân mua cho người đã khuất, người nằm trong đó không thấy được."
    }
  ]
};

const BOT_QUOTES_START = [
  "🤖 'Hãy để tôi xem trí tuệ con người phản xạ nhanh đến mức nào!'",
  "🤖 'Bộ xử lý của tôi đã chuẩn bị sẵn những câu đố bẫy tinh vi nhất!'",
  "🤖 'Đừng quá tự tin nhé, nhiều câu tưởng dễ mà lại rất bất ngờ đấy!'"
];

const BOT_QUOTES_CORRECT = [
  "🤖 'Chính xác! Bạn suy luận nhanh hơn tôi tưởng!'",
  "🤖 'Đúng rồi! Trí óc của bạn rất tỉnh táo!'",
  "🤖 'Rất xuất sắc! Câu tiếp theo sẽ khó hơn đấy!'",
  "🤖 'Tuyệt vời! Máy tính đành phải cộng điểm cho bạn vậy!'"
];

const BOT_QUOTES_WRONG = [
  "🤖 'Haha! Đã bảo là có bẫy mà không chịu nghe!'",
  "🤖 'Sai rồi! Bị máy tính dẫn dụ vào bẫy logic rồi nhé!'",
  "🤖 'Tiếc quá! Hãy tập trung hơn ở câu sau nhé!'"
];

// Khởi chạy khi load trang
document.addEventListener('DOMContentLoaded', () => {
  fetch('questions.json')
    .then(res => res.json())
    .then(data => { questionsData = data; })
    .catch(() => {
      console.log('Dùng câu hỏi dự phòng do mở trực tiếp bằng giao thức file://');
      questionsData = FALLBACK_BANK;
    });

  // Nút âm thanh
  const soundBtn = document.getElementById('sound-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isEnabled = sounds.toggle();
      soundBtn.textContent = isEnabled ? '🔊' : '🔇';
    });
  }
});

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function startGame(mode) {
  currentMode = mode;
  const pool = (questionsData && questionsData[mode]) ? questionsData[mode] : FALLBACK_BANK[mode];
  
  // Xáo trộn câu hỏi
  activeQuestions = [...pool].sort(() => Math.random() - 0.5).slice(0, 7);
  currentQIndex = 0;
  score = 0;
  streak = 0;
  maxStreak = 0;

  if (mode === 'easy') {
    lives = 3;
    maxTime = 25;
    count5050 = 1;
    countHint = 2;
    document.getElementById('lifeline-bar').style.display = 'flex';
  } else {
    lives = 1;
    maxTime = 15;
    count5050 = 0;
    countHint = 0;
    document.getElementById('lifeline-bar').style.display = 'none';
  }

  updateLifelinesUI();
  switchScreen('screen-quiz');
  loadQuestion();
}

function updateLifelinesUI() {
  document.getElementById('count-5050').textContent = count5050;
  document.getElementById('count-hint').textContent = countHint;
  document.getElementById('btn-lifeline-5050').disabled = (count5050 <= 0);
  document.getElementById('btn-lifeline-hint').disabled = (countHint <= 0);
}

function loadQuestion() {
  if (currentQIndex >= activeQuestions.length || lives <= 0) {
    endGame();
    return;
  }

  isAnswered = false;
  const q = activeQuestions[currentQIndex];

  // Ẩn drawer phản hồi
  document.getElementById('feedback-drawer').style.display = 'none';
  document.getElementById('hint-box').style.display = 'none';

  // Cập nhật HUD
  document.getElementById('hud-score').textContent = score;
  document.getElementById('hud-lives').textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
  document.getElementById('question-progress').textContent = `Câu ${currentQIndex + 1}/${activeQuestions.length}`;
  
  const diffBadge = document.getElementById('question-difficulty');
  if (currentMode === 'easy') {
    diffBadge.textContent = 'DỄ';
    diffBadge.className = 'badge-pill diff-easy';
  } else {
    diffBadge.textContent = 'KHÓ';
    diffBadge.className = 'badge-pill diff-hard';
  }

  const streakBadge = document.getElementById('streak-badge');
  if (streak > 1) {
    streakBadge.style.display = 'inline-block';
    streakBadge.textContent = `🔥 Combo x${streak}`;
  } else {
    streakBadge.style.display = 'none';
  }

  // Câu nói của bot
  const botComment = document.getElementById('bot-comment');
  botComment.textContent = BOT_QUOTES_START[Math.floor(Math.random() * BOT_QUOTES_START.length)];
  document.getElementById('bot-mood').textContent = '🤖';

  // Tiêu đề câu hỏi
  document.getElementById('question-text').textContent = q.question;

  // Render các lựa chọn (Xáo trộn A, B, C, D)
  const optionsGrid = document.getElementById('options-grid');
  optionsGrid.innerHTML = '';

  const originalOptions = [...q.options];
  const correctText = originalOptions[q.answer];

  // Tạo mảng đối tượng { text, isCorrect }
  const mappedOptions = originalOptions.map((opt, i) => ({
    text: opt,
    isCorrect: (i === q.answer)
  })).sort(() => Math.random() - 0.5);

  const labels = ['A', 'B', 'C', 'D'];
  mappedOptions.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-label">${labels[idx]}</span> <span class="option-text">${opt.text}</span>`;
    btn.onclick = () => selectAnswer(btn, opt.isCorrect, q);
    btn.dataset.correct = opt.isCorrect;
    optionsGrid.appendChild(btn);
  });

  // Reset và bắt đầu đếm ngược
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = maxTime;
  updateTimerUI();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();

    if (timeLeft <= 5 && timeLeft > 0) {
      sounds.playTick();
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function updateTimerUI() {
  document.getElementById('timer-text').textContent = timeLeft;
  const stroke = document.getElementById('timer-stroke');
  const circumference = 2 * Math.PI * 16; // ~100.5
  const offset = circumference - (timeLeft / maxTime) * circumference;
  stroke.style.strokeDashoffset = offset;

  if (timeLeft <= 5) {
    stroke.style.stroke = 'var(--hard-color)';
  } else {
    stroke.style.stroke = 'var(--primary-glow)';
  }
}

function selectAnswer(selectedBtn, isCorrect, qData) {
  if (isAnswered) return;
  isAnswered = true;
  clearInterval(timerInterval);

  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.correct === 'true') {
      btn.classList.add('correct');
    }
  });

  const feedbackDrawer = document.getElementById('feedback-drawer');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackExplanation = document.getElementById('feedback-explanation');
  const botMood = document.getElementById('bot-mood');
  const botComment = document.getElementById('bot-comment');

  if (isCorrect) {
    sounds.playCorrect();
    selectedBtn.classList.add('correct');
    const pts = (currentMode === 'easy' ? 10 : 25) + (streak * 2);
    score += pts;
    streak++;
    maxStreak = Math.max(maxStreak, streak);

    feedbackIcon.textContent = '✅';
    feedbackTitle.textContent = `Chính xác! (+${pts} điểm)`;
    feedbackTitle.style.color = 'var(--easy-color)';
    botMood.textContent = '😄';
    botComment.textContent = BOT_QUOTES_CORRECT[Math.floor(Math.random() * BOT_QUOTES_CORRECT.length)];
  } else {
    sounds.playWrong();
    selectedBtn.classList.add('wrong');
    lives--;
    streak = 0;

    feedbackIcon.textContent = '❌';
    feedbackTitle.textContent = 'Sai rồi! Bị trừ 1 mạng';
    feedbackTitle.style.color = 'var(--hard-color)';
    botMood.textContent = '😈';
    botComment.textContent = BOT_QUOTES_WRONG[Math.floor(Math.random() * BOT_QUOTES_WRONG.length)];
  }

  // Cập nhật lives
  document.getElementById('hud-lives').textContent = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));
  document.getElementById('hud-score').textContent = score;

  feedbackExplanation.textContent = qData.explanation || '';
  feedbackDrawer.style.display = 'flex';
}

function handleTimeout() {
  if (isAnswered) return;
  isAnswered = true;

  sounds.playWrong();
  lives--;
  streak = 0;

  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.correct === 'true') {
      btn.classList.add('correct');
    }
  });

  const qData = activeQuestions[currentQIndex];
  const feedbackDrawer = document.getElementById('feedback-drawer');
  document.getElementById('feedback-icon').textContent = '⏰';
  document.getElementById('feedback-title').textContent = 'Hết thời gian! Bạn bị mất 1 mạng';
  document.getElementById('feedback-title').style.color = 'var(--hard-color)';
  document.getElementById('feedback-explanation').textContent = qData.explanation || '';
  document.getElementById('hud-lives').textContent = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));
  document.getElementById('bot-mood').textContent = '😴';
  document.getElementById('bot-comment').textContent = "🤖 'Hết giờ rồi! Bạn cần phản xạ nhanh hơn nữa!'";

  feedbackDrawer.style.display = 'flex';
}

function nextQuestion() {
  currentQIndex++;
  loadQuestion();
}

function use5050() {
  if (isAnswered || count5050 <= 0) return;
  count5050--;
  updateLifelinesUI();

  const wrongBtns = Array.from(document.querySelectorAll('.option-btn')).filter(btn => btn.dataset.correct === 'false');
  // Ẩn 2 phương án sai ngẫu nhiên
  wrongBtns.sort(() => Math.random() - 0.5).slice(0, 2).forEach(btn => {
    btn.classList.add('disabled-5050');
  });
}

function useHint() {
  if (isAnswered || countHint <= 0) return;
  countHint--;
  updateLifelinesUI();

  const q = activeQuestions[currentQIndex];
  const hintBox = document.getElementById('hint-box');
  document.getElementById('hint-text').textContent = q.hint || 'Hãy suy nghĩ theo hướng đố mẹo nhé!';
  hintBox.style.display = 'flex';
}

function endGame() {
  clearInterval(timerInterval);
  switchScreen('screen-result');

  document.getElementById('res-score').textContent = score;
  document.getElementById('res-accuracy').textContent = `${Math.min(currentQIndex, activeQuestions.length)} câu`;
  document.getElementById('res-streak').textContent = `🔥 ${maxStreak}`;

  const rankEl = document.getElementById('res-rank');
  const titleEl = document.getElementById('result-title');
  const botMsgEl = document.getElementById('result-bot-msg');
  const trophyEl = document.getElementById('result-trophy');

  if (lives <= 0) {
    sounds.playWrong();
    trophyEl.textContent = '💥';
    titleEl.textContent = 'Trò Chơi Kết Thúc!';
    botMsgEl.textContent = "🤖 'Bạn đã hết mạng! Đừng nản chí, hãy thử lại để phục thù!'";
    rankEl.textContent = 'Tập Sự';
  } else {
    sounds.playVictory();
    trophyEl.textContent = '🏆';
    titleEl.textContent = 'Xuất Sắc Hoàn Thành!';
    if (score >= 120) {
      rankEl.textContent = 'Bậc Thầy Hack Não 👑';
      botMsgEl.textContent = "🤖 'Không thể tin được! Máy tính hoàn toàn chịu thua trước bạn!'";
    } else if (score >= 60) {
      rankEl.textContent = 'Cao Thủ Trí Tuệ ⭐';
      botMsgEl.textContent = "🤖 'Tư duy của bạn rất sắc sảo! Hãy thử cấp độ khó hơn nhé!'";
    } else {
      rankEl.textContent = 'Tập Sự Thông Thái 🌱';
      botMsgEl.textContent = "🤖 'Màn thể hiện khá tốt! Hãy rèn luyện thêm để đạt điểm tuyệt đối!'";
    }
  }
}

function restartGame() {
  startGame(currentMode);
}

function backToMenu() {
  clearInterval(timerInterval);
  switchScreen('screen-menu');
}
