const tabs = [...document.querySelectorAll(".tab")];
const input = document.querySelector("#study-input");
const fileInput = document.querySelector("#file-input");
const count = document.querySelector("#char-count");
const form = document.querySelector("#study-form");
const submitButton = document.querySelector("#submit-button");
const buttonText = document.querySelector("#button-text");
const summaryOptions = document.querySelector("#summary-options");
const label = document.querySelector("#input-label");
const resultPanel = document.querySelector("#result-panel");
const resultTitle = document.querySelector("#result-title");
const resultContent = document.querySelector("#result-content");
const errorMessage = document.querySelector("#error-message");
const copyButton = document.querySelector("#copy-button");
let mode = "summarize";

function setMode(nextMode) {
  mode = nextMode;
  tabs.forEach(tab => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  const isSummary = mode === "summarize";
  summaryOptions.hidden = !isSummary;
  label.textContent = isSummary ? "Nội dung bài học" : "Câu hỏi hoặc kiến thức cần giải thích";
  input.placeholder = isSummary
    ? "Dán nội dung bài học, ghi chú hoặc chương sách vào đây..."
    : "Ví dụ: Khóa chính và khóa ngoại trong SQL Server khác nhau thế nào? Có thể dán thêm nội dung bài học...";
  buttonText.textContent = isSummary ? "Tóm tắt tài liệu" : "Giải thích kiến thức";
  input.required = true;
}
tabs.forEach(tab => tab.addEventListener("click", () => setMode(tab.dataset.mode)));
input.addEventListener("input", () => { count.textContent = input.value.length.toLocaleString("vi-VN") + " ký tự"; });
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (file.size > 100_000) {
    showError("Tệp quá lớn. Demo hiện giới hạn 100 KB.");
    fileInput.value = "";
    return;
  }
  try {
    input.value = await file.text();
    count.textContent = input.value.length.toLocaleString("vi-VN") + " ký tự";
    hideError();
  } catch {
    showError("Không đọc được tệp. Hãy thử tệp TXT hoặc Markdown mã hóa UTF-8.");
  }
});
function showError(message) { errorMessage.textContent = message; errorMessage.hidden = false; }
function hideError() { errorMessage.hidden = true; errorMessage.textContent = ""; }

form.addEventListener("submit", async event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return showError("Hãy nhập nội dung trước khi gửi.");
  if (text.length > 100_000) return showError("Nội dung quá dài (tối đa 100.000 ký tự).");
  hideError();
  resultPanel.hidden = true;
  submitButton.disabled = true;
  buttonText.textContent = "Đang xử lý...";
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        text,
        length: document.querySelector("#length-select").value
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Có lỗi khi xử lý yêu cầu.");
    resultTitle.textContent = mode === "summarize" ? "Bản tóm tắt tài liệu" : "Giải thích kiến thức";
    resultContent.textContent = data.answer;
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    showError(error.message || "Không kết nối được server. Hãy kiểm tra StudyClaw và OpenClaw.");
  } finally {
    submitButton.disabled = false;
    buttonText.textContent = mode === "summarize" ? "Tóm tắt tài liệu" : "Giải thích kiến thức";
  }
});
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultContent.textContent);
    copyButton.textContent = "Đã sao chép ✓";
    setTimeout(() => { copyButton.textContent = "Sao chép"; }, 1600);
  } catch {
    showError("Không thể sao chép tự động. Hãy chọn và sao chép kết quả thủ công.");
  }
});
setMode("summarize");