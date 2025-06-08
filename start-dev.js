#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

// Start Next.js client
const clientProcess = spawn(
  "npx",
  ["next", "dev", "-p", "3000", "--hostname", "0.0.0.0"],
  {
    cwd: path.join(__dirname, "client-nextjs"),
    stdio: "inherit",
  },
);

// Start server
const serverProcess = spawn("node", ["index.js"], {
  cwd: path.join(__dirname, "server"),
  stdio: "inherit",
});

// Handle process cleanup
process.on("SIGINT", () => {
  clientProcess.kill();
  serverProcess.kill();
  process.exit();
});

console.log("Starting LN Partners Groupware...");
console.log("Client: http://localhost:3000");
console.log("Server: http://localhost:3001");
