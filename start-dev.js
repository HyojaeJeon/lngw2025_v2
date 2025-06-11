#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

console.log("Starting LN Partners Groupware...");
console.log("🌍 Environment:", process.env.REPLIT ? "Replit" : "Local");

// Start Next.js client
const clientProcess = spawn(
  "npm",
  ["run", "dev"],
  {
    cwd: path.join(__dirname, "client-nextjs"),
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "development" },
    shell: true
  },
);

// Start server
const serverProcess = spawn("node", ["index.js"], {
  cwd: path.join(__dirname, "server"),
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development", PORT: "5000" },
  shell: true
});

// Handle process cleanup
process.on("SIGINT", () => {
  console.log("\n프로세스를 정리합니다...");
  clientProcess.kill();
  serverProcess.kill();
  process.exit();
});

process.on("SIGTERM", () => {
  console.log("\n프로세스를 정리합니다...");
  clientProcess.kill();
  serverProcess.kill();
  process.exit();
});

// Handle child process errors
clientProcess.on("error", (error) => {
  console.error("클라이언트 프로세스 오류:", error);
});

serverProcess.on("error", (error) => {
  console.error("서버 프로세스 오류:", error);
});

console.log("🚀 Client: http://localhost:3000 (또는 Replit URL)");
console.log("🚀 Server: http://localhost:5000/graphql (또는 Replit URL)");
