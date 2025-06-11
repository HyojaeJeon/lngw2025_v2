const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const models = require("./models");
const seedData = require("./seeders");

// JWT Secret 설정 - 프로덕션에서는 환경변수로 관리
const JWT_SECRET =
  process.env.JWT_SECRET || "lngw2025_super_secret_key_for_jwt_tokens_2024";

// ====================
// 언어 파싱 헬퍼 함수
// ====================
const getLanguageFromHeaders = (headers) => {
  const langHeader = headers["accept-language"] || headers["x-language"];
  if (!langHeader) return "en"; // 기본값은 영어

  // Accept-Language 헤더 파싱: "ko-KR,ko;q=0.9,en;q=0.8" 형태
  const langs = langHeader.split(",");
  const primaryLang = langs[0].split("-")[0].split(";")[0].toLowerCase().trim();

  if (["ko", "en", "vi"].includes(primaryLang)) {
    return primaryLang;
  }

  return "en"; // 지원하지 않는 언어일 경우 영어로 대체
};

// Replit 환경 감지
const isReplit = process.env.REPLIT || process.env.REPLIT_DB_URL;

// ──────────────────────────────────────────────────────────────────────────
// 포트 정리 및 MySQL 시작 함수
// ──────────────────────────────────────────────────────────────────────────
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function killPortProcesses(port) {
  try {
    const { stdout } = await execPromise(`lsof -ti:${port}`);
    if (stdout.trim()) {
      const pids = stdout.trim().split('\n');
      for (const pid of pids) {
        try {
          await execPromise(`kill -9 ${pid}`);
          console.log(`포트 ${port}에서 실행 중인 프로세스 ${pid}를 종료했습니다.`);
        } catch (error) {
          console.log(`프로세스 ${pid} 종료 실패:`, error.message);
        }
      }
    }
  } catch (error) {
    // 포트에 실행 중인 프로세스가 없으면 정상
    console.log(`포트 ${port}에 실행 중인 프로세스가 없습니다.`);
  }
}

async function initializeDatabase() {
  try {
    console.log('데이터베이스 초기화 중...');
    
    // Replit 환경에서는 SQLite 사용
    if (isReplit) {
      console.log('Replit 환경에서 SQLite를 사용합니다.');
      return;
    }

    // 로컬 환경에서만 MySQL 서비스 시작 시도
    console.log('MySQL/MariaDB 서비스를 시작합니다...');
    
    const commands = [
      'sudo service mysql start',
      'sudo service mariadb start',
      'sudo systemctl start mysql',
      'sudo systemctl start mariadb',
      'mysql.server start'
    ];

    let serviceStarted = false;
    for (const cmd of commands) {
      try {
        await execPromise(cmd);
        console.log(`MySQL/MariaDB 서비스가 시작되었습니다: ${cmd}`);
        serviceStarted = true;
        break;
      } catch (error) {
        console.log(`${cmd} 실패, 다음 명령어 시도 중...`);
      }
    }

    if (!serviceStarted) {
      console.log('MySQL 서비스 시작 시도가 모두 실패했습니다. SQLite를 사용합니다.');
      return;
    }

    // 데이터베이스와 사용자 생성
    try {
      await execPromise('mysql -u root -e "CREATE DATABASE IF NOT EXISTS lngw2025_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"');
      await execPromise('mysql -u root -e "CREATE USER IF NOT EXISTS \'appuser\'@\'localhost\' IDENTIFIED BY \'gywo9988!@\';"');
      await execPromise('mysql -u root -e "GRANT ALL PRIVILEGES ON lngw2025_db.* TO \'appuser\'@\'localhost\';"');
      await execPromise('mysql -u root -e "FLUSH PRIVILEGES;"');
      console.log('데이터베이스 설정이 완료되었습니다.');
    } catch (dbError) {
      console.log('데이터베이스 설정 중 오류 (이미 존재할 수 있음):', dbError.message);
    }

    // MySQL 연결 대기
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error.message);
    console.log('SQLite를 사용하여 계속 진행합니다.');
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Express 서버 시작
// ──────────────────────────────────────────────────────────────────────────
async function startServer() {
  const app = express();

  // 기본 라우트 (리디렉션)
  app.get("/", (req, res) => {
    if (isReplit) {
      // Replit 환경에서는 현재 호스트의 3000 포트로 리디렉션
      const host = req.get('host');
      const redirectUrl = `https://${host.replace(':80', '')}:3000/`;
      return res.redirect(redirectUrl);
    }

    if (process.env.NODE_ENV !== "production") {
      return res.redirect("http://localhost:3000");
    }

    return res.redirect("https://gw.lnpartners.biz");
  });

  // ──────────────────────────────────────────────────────────────────────────
  // CORS 설정 (Replit 환경을 위한 더 유연한 설정)
  // ──────────────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: function (origin, callback) {
        // 개발 환경이나 Replit 환경에서는 모든 origin 허용
        if (process.env.NODE_ENV === "development" || isReplit) {
          return callback(null, true);
        }

        // Origin이 없는 경우 (모바일 앱, Postman 등)
        if (!origin) {
          return callback(null, true);
        }

        // Replit 도메인 패턴 허용
        if (origin.includes("replit.dev") || origin.includes("localhost")) {
          return callback(null, true);
        }

        // 프로덕션 도메인 허용
        const allowedOrigins = [
          "https://gw.lnpartners.biz",
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          "http://localhost:3003",
          "http://127.0.0.1:3000",
        ];

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        console.log(`CORS 차단된 origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "Accept-Language", 
        "X-Requested-With",
        "Origin",
        "Accept"
      ],
      optionsSuccessStatus: 200
    }),
  );

  // Preflight 요청 처리
  app.options("*", cors());

  // ──────────────────────────────────────────────────────────────────────────
  // Apollo Server 설정
  // ──────────────────────────────────────────────────────────────────────────
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    formatError: (formattedError, error) => {
      console.error("GraphQL Error:", {
        message: formattedError.message,
        code: formattedError.extensions?.code,
        errorKey: formattedError.extensions?.errorKey,
        locations: formattedError.locations,
        path: formattedError.path,
      });
      return formattedError;
    },
    context: async ({ req }) => {
      let user = null;

      // 언어 정보 추출
      const lang = getLanguageFromHeaders(req.headers);

      try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.replace("Bearer ", "");
          if (token && token !== "null" && token !== "undefined") {
            try {
              const decoded = jwt.verify(token, JWT_SECRET);

              const foundUser = await models.User.findByPk(decoded.userId);
              if (foundUser) {
                user = {
                  id: foundUser.id,
                  userId: foundUser.id,
                  email: foundUser.email,
                  role: foundUser.role,
                };
                console.log("User authenticated successfully:", user.email);
              } else {
                console.log(
                  "User not found in database for userId:",
                  decoded.userId,
                );
              }
            } catch (jwtError) {
              console.log("JWT verification failed:", jwtError.message);
            }
          }
        }
      } catch (error) {
        console.log("Authorization processing error:", error.message);
      }

      return { user, lang };
    },
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: false, // CORS는 Express에서 처리
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 헬스체크 엔드포인트
  // ──────────────────────────────────────────────────────────────────────────
  const PORT = process.env.PORT || 5000;

  app.get("/health", (req, res) => {
    res.json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      environment: isReplit ? "replit" : "local",
      port: PORT
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 서버 시작
  // ──────────────────────────────────────────────────────────────────────────
  try {
    // 서버 시작 전에 포트 정리 및 데이터베이스 초기화
    await killPortProcesses(PORT);
    await initializeDatabase();

    console.log("Connecting to database...");
    await models.sequelize.authenticate();
    console.log("Database connection established successfully.");

    if (process.env.NODE_ENV === "development" || isReplit) {
      console.log("Syncing database...");
      await models.syncDatabase();
      console.log("Database synced successfully.");
    }

    // 서버 시작
    const server_instance = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server ready at http://0.0.0.0:${PORT}`);
      console.log(`🚀 GraphQL endpoint: http://0.0.0.0:${PORT}${server.graphqlPath}`);
      if (isReplit) {
        console.log(`🌍 Replit 환경에서 실행 중`);
      }
      if (process.env.APOLLO_PLAYGROUND === "true") {
        console.log(`🚀 GraphQL Playground: http://0.0.0.0:${PORT}${server.graphqlPath}`);
      }
    });

    // 오류 처리
    server_instance.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`포트 ${PORT}가 이미 사용 중입니다. 다른 포트를 시도합니다...`);
        const newPort = PORT + 1;
        console.log(`새 포트 ${newPort}에서 서버를 시작합니다...`);
        app.listen(newPort, "0.0.0.0", () => {
          console.log(`🚀 Server ready at http://0.0.0.0:${newPort}`);
          console.log(`🚀 GraphQL endpoint: http://0.0.0.0:${newPort}${server.graphqlPath}`);
        });
      } else {
        console.error("서버 시작 오류:", err);
        process.exit(1);
      }
    });

    // 프로세스 종료 시 정리
    process.on("SIGTERM", () => {
      console.log("SIGTERM 신호를 받았습니다. 서버를 정리합니다...");
      server_instance.close(() => {
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT 신호를 받았습니다. 서버를 정리합니다...");
      server_instance.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});