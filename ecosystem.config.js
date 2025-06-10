// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "nextjs",
        cwd: "/app/.next/standalone",       // 수정된 작업 디렉토리
        script: "server.js",                // standalone 폴더 내 server.js 실행
        exec_mode: "fork",
        instances: 1,
        env: {
          NODE_ENV: "production",
          PORT: 3201,
          HOST: "0.0.0.0",
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
        }
      },
      {
        name: "express-api",
        cwd: "/app/server",
        script: "npm",
        args: ["run", "start"],
        exec_mode: "fork",
        instances: 1,
        env: { NODE_ENV: "production", PORT: 5000 }
      },
      {
        name: "webhook",
        cwd: "/app/server",
        script: "node",
        args: ["webhook-server.js"],
        exec_mode: "fork",
        instances: 1,
        env: { NODE_ENV: "production", PORT: 7000 }
      }
    ]
  };
  