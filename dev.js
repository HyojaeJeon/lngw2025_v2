const concurrently = require("concurrently");
const { exec } = require("child_process");

// Replit 환경 감지
const isReplit = !!(
  process.env.REPLIT || 
  process.env.REPLIT_DB_URL || 
  process.env.REPL_ID ||
  process.env.REPL_SLUG ||
  process.cwd().includes('/home/runner')
);

console.log("🌍 Environment detected:", isReplit ? "Replit" : "Local");
console.log("🔧 Database:", isReplit ? "SQLite" : "MySQL");

function killExistingProcesses() {
  return new Promise((resolve) => {
    exec("lsof -ti:3000,5000 | xargs -r kill -9", () => {
      setTimeout(resolve, 1000);
    });
  });
}

async function startDev() {
  console.log("Starting LN Partners Groupware System...");

  await killExistingProcesses();

  // 환경별 환경 변수 설정
  const serverEnv = {
    ...process.env,
    NODE_ENV: "development",
    PORT: "5000",
  };

  // Replit 환경에서는 SQLite 강제 사용
  if (isReplit) {
    serverEnv.REPLIT = "true";
    serverEnv.DB_DIALECT = "sqlite";
    serverEnv.DB_STORAGE = "./database.sqlite";
    console.log("🔧 Replit 환경: SQLite 데이터베이스 사용");
  }

  const { result } = concurrently(
    [
      {
        command: "npm run dev",
        name: "client",
        cwd: "./client-nextjs",
        prefixColor: "blue",
        env: {
          ...process.env,
          NODE_ENV: "development",
          REPLIT: isReplit ? "true" : undefined,
        },
      },
      {
        command: "node index.js",
        name: "server",
        cwd: "./server",
        prefixColor: "green",
        env: serverEnv,
      },
    ],
    {
      prefix: "name",
      killOthers: ["failure", "success"],
      restartTries: 3,
    },
  );

  console.log("🚀 서버 시작 중...");
  console.log("🚀 클라이언트:", isReplit ? "Replit URL:3000" : "http://localhost:3000");
  console.log("🚀 GraphQL API:", isReplit ? "Replit URL/graphql" : "http://localhost:5000/graphql");

  try {
    await result;
  } catch (error) {
    console.error("서비스 시작 오류:", error);
    process.exit(1);
  }
}

startDev();
