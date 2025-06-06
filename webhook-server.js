// ──────────────────────────────────────────────────────────────────────────
// webhook-server.js
// GitHub Actions의 push 이벤트 → HTTP POST → 이 스크립트가 배포 스크립트 실행
// ──────────────────────────────────────────────────────────────────────────

const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("[Webhook] Deploy triggered:", new Date().toISOString());

  // PowerShell 스크립트 경로 (배포 스크립트)
  const psScriptPath = path.join(__dirname, "deploy.ps1");
  const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${psScriptPath}"`;

  exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
    if (error) {
      console.error("[Webhook] Error:", error.message);
      return res.status(500).send(`Deploy failed: ${error.message}`);
    }
    if (stderr) console.warn("[Webhook] StdErr:", stderr);
    console.log("[Webhook] StdOut:", stdout);
    return res.status(200).send(`Deployed successfully:\n${stdout}`);
  });
});

// 7000번 포트 리스닝
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`[Webhook] Listening on http://localhost:${PORT}/webhook`);
});
