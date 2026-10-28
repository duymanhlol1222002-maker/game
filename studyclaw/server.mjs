import http from "node:http";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 3030);
const AGENT = process.env.OPENCLAW_AGENT || "main";
const MAX_BODY = 120_000;

if (!/^[a-zA-Z0-9_-]+$/.test(AGENT)) {
  throw new Error("OPENCLAW_AGENT chỉ được chứa chữ, số, dấu gạch ngang hoặc gạch dưới.");
}

const staticFiles = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/style.css": ["style.css", "text/css; charset=utf-8"],
  "/app.js": ["app.js", "text/javascript; charset=utf-8"]
};

function send(res, status, data, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" });
  res.end(type.startsWith("application/json") ? JSON.stringify(data) : data);
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > MAX_BODY) throw new Error("Nội dung quá lớn. Giới hạn khoảng 100 KB.");
  }
  return JSON.parse(raw || "{}");
}

function runOpenClaw(prompt, messageFile) {
  return new Promise((resolve, reject) => {
    const args = ["agent", "--agent", AGENT, "--message-file", messageFile, "--timeout", "120"];
    const command = process.platform === "win32" ? "openclaw.cmd" : "openclaw";
    const child = spawn(command, args, {
      windowsHide: true,
      shell: process.platform === "win32",
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", chunk => { stdout += chunk; });
    child.stderr.on("data", chunk => { stderr += chunk; });
    child.on("error", error => reject(new Error("Không chạy được OpenClaw CLI. Hãy kiểm tra lệnh openclaw --version. " + error.message)));
    child.on("close", code => {
      if (code !== 0) return reject(new Error((stderr || stdout || "OpenClaw trả về lỗi.").trim().slice(-1800)));
      const answer = stdout.trim();
      if (!answer) return reject(new Error("OpenClaw chưa trả về nội dung. Hãy kiểm tra Gateway và cấu hình mô hình AI."));
      resolve(answer);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  if (req.method === "GET" && staticFiles[url.pathname]) {
    const [file, type] = staticFiles[url.pathname];
    try {
      const { readFile } = await import("node:fs/promises");
      return send(res, 200, await readFile(path.join(ROOT, file), "utf8"), type);
    } catch {
      return send(res, 404, "File không tồn tại.", "text/plain; charset=utf-8");
    }
  }

  if (req.method === "POST" && url.pathname === "/api/ask") {
    let tempDir;
    try {
      const body = await readJson(req);
      const mode = body.mode;
      const text = typeof body.text === "string" ? body.text.trim() : "";
      const length = ["ngắn", "vừa", "chi tiết"].includes(body.length) ? body.length : "vừa";
      if (!["summarize", "explain"].includes(mode)) return send(res, 400, { error: "Chức năng không hợp lệ." });
      if (!text) return send(res, 400, { error: "Hãy nhập nội dung trước." });
      if (text.length > 100_000) return send(res, 413, { error: "Nội dung quá dài (tối đa 100.000 ký tự)." });

      const prompt = mode === "summarize"
        ? `Bạn là StudyClaw, trợ lý học tập. Hãy tóm tắt tài liệu sau bằng tiếng Việt ở mức độ ${length}. Trình bày có tiêu đề, ý chính, thuật ngữ quan trọng và phần cần ghi nhớ. Chỉ dựa trên nội dung được cung cấp; nếu thiếu thông tin thì nói rõ, không bịa thêm.\n\n--- BẮT ĐẦU TÀI LIỆU ---\n${text}\n--- KẾT THÚC TÀI LIỆU ---`
        : `Bạn là StudyClaw, trợ lý học tập. Hãy giải thích câu hỏi/kiến thức sau bằng tiếng Việt đơn giản, có ví dụ ngắn nếu phù hợp. Nếu người dùng cung cấp nội dung bài học, ưu tiên giải thích theo nội dung đó và phân biệt rõ phần kiến thức bổ sung. Nếu chưa đủ dữ liệu, hãy nêu giả định.\n\n--- NỘI DUNG NGƯỜI HỌC GỬI ---\n${text}\n--- KẾT THÚC ---`;

      tempDir = await mkdtemp(path.join(os.tmpdir(), "studyclaw-"));
      const messageFile = path.join(tempDir, "prompt.txt");
      await writeFile(messageFile, prompt, "utf8");
      const answer = await runOpenClaw(prompt, messageFile);
      return send(res, 200, { answer });
    } catch (error) {
      const status = error instanceof SyntaxError ? 400 : 500;
      return send(res, status, { error: error.message || "Đã xảy ra lỗi." });
    } finally {
      if (tempDir) await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  if (req.method === "GET" && url.pathname === "/health") return send(res, 200, { ok: true, agent: AGENT });
  return send(res, 404, { error: "Không tìm thấy đường dẫn." });
});

server.listen(PORT, HOST, () => {
  console.log(`StudyClaw Mini đang chạy: http://${HOST}:${PORT}`);
  console.log(`OpenClaw Agent: ${AGENT}`);
  console.log("Giữ cửa sổ terminal này mở khi sử dụng demo.");
});