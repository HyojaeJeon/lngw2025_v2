#!/usr/bin/env node

const { spawn, exec } = require("child_process");
const path = require("path");
const util = require("util");
const execPromise = util.promisify(exec);

console.log("Starting LN Partners Groupware...");
console.log("🌍 Environment:", process.env.REPLIT ? "Replit" : "Local");

// Kill existing processes on ports 3000 and 5000
async function cleanupPorts() {
  try {
    await execPromise("pkill -f 'next dev' || true");
    await execPromise("pkill -f 'node index.js' || true");
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.log("Port cleanup completed");
  }
}

async function startApplication() {
  await cleanupPorts();
  
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

  console.log("🚀 Client: http://0.0.0.0:3000");
  console.log("🚀 Server: http://0.0.0.0:5000/graphql");
  
  return { clientProcess, serverProcess };
}

startApplication().catch(error => {
  console.error("Application startup failed:", error);
  process.exit(1);
});