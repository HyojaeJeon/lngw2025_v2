const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const models = require("./models");
const seedData = require("./seeders");

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

if (process.env.NODE_ENV === "production") {
  // Docker 컨테이너 내부에서 윈도우 호스트 MySQL에 연결할 때
  dbHost = "host.docker.internal";
}

// 이 값이 실제 브라우저(Next.js 등)에서 보내는 Origin 과 정확히 일치해야 합니다.
const whitelist =
  process.env.NODE_ENV === "production"
    ? ["https://gw.lnpartners.biz"]
    : [
        "http://localhost:3000",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3001",
        "http://localhost:3201",
        "https://d00e8e41-73e1-4600-9cfd-aa4ac3896194-00-2bayp6iaukste.spock.replit.dev",
        "https://d00e8e41-73e1-4600-9cfd-aa4ac3896194-00-2bayp6iaukste.spock.replit.dev:3000",
        "https://d00e8e41-73e1-4600-9cfd-aa4ac3896194-00-2bayp6iaukste.spock.replit.dev:3001",
        "https://d00e8e41-73e1-4600-9cfd-aa4ac3896194-00-2bayp6iaukste.spock.replit.dev:3002",
        "https://d00e8e41-73e1-4600-9cfd-aa4ac3896194-00-2bayp6iaukste.spock.replit.dev:3003",
        "https://1af219cc-4238-4cc1-b774-03457e5a48ad-00-1dqbl6swyb0bu.kirk.replit.dev:3002",
      ];

async function startServer() {
  const app = express();
  app.get("/", (req, res) => {
    // Replit 환경에서 Next.js로 리다이렉트
    if (process.env.REPLIT_DB_URL || process.env.REPLIT) {
      return res.redirect(
        "https://d00e8e41-73e1-4600-9cfd-aa4ac3896194-00-2bayp6iaukste.spock.replit.dev:3002/",
      );
    }

    // 로컬 개발 모드
    if (process.env.NODE_ENV !== "production") {
      return res.redirect("http://localhost:3000");
    }

    return res.redirect("https://gw.lnpartners.biz");
  });
  // ──────────────────────────────────────────────────────────────────────────
  // 1) Express 레벨에서 CORS 설정
  // ──────────────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: (origin, callback) => {
        // Postman / curl 처럼 origin이 없을 때도 허용하고 싶으면 이 줄을 유지:
        if (!origin) return callback(null, true);

        if (whitelist.includes(origin)) {
          // whitelist에 포함된 origin이면 허용
          return callback(null, true);
        } else {
          // 그렇지 않으면 CORS 에러
          return callback(
            new Error(`CORS policy: This origin (${origin}) is not allowed.`),
            false,
          );
        }
      },
      credentials: true,
    }),
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 2) Apollo Server 인스턴스 생성 및 미들웨어 연결
  //    (Cors를 false로 놓으면, 위 Express 설정을 그대로 탄다)
  // ──────────────────────────────────────────────────────────────────────────
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.APOLLO_INTROSPECTION === "true",
    playground: process.env.APOLLO_PLAYGROUND === "true",
    formatError: (formattedError, error) => {
      // Apollo Server에서 기본으로 제공하는 에러 포맷팅을 그대로 사용하되,
      // 커스텀 로깅 등을 추가할 수 있습니다.
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
        console.log("authHeader", authHeader);
        if (authHeader) {
          const token = authHeader.replace("Bearer ", "");
          console.log("token", token);
          if (token) {
            const decoded = jwt.verify(
              token,
              process.env.JWT_SECRET || "your-secret-key",
            );
            // JWT에서 userId로 실제 사용자 정보 조회
            user = await models.User.findByPk(decoded.userId);
            if (user) {
              // context에 전달할 사용자 정보 설정
              user = {
                id: user.id,
                userId: user.id, // resolvers에서 context.user.userId로 접근할 수 있도록
                email: user.email,
                role: user.role,
              };
            }
          }
        }
      } catch (error) {
        console.log("JWT verification failed:", error.message);
        // 토큰이 유효하지 않아도 에러를 던지지 않고 user를 null로 설정
        user = null;
      }

      return { user, lang };
    },
  });
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: {
      origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
          return callback(null, true);
        }
        return callback(
          new Error(`CORS policy: This origin (${origin}) is not allowed.`),
          false,
        );
      },
      credentials: true,
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3) “/” 기본 라우트 및 헬스체크
  // ──────────────────────────────────────────────────────────────────────────
  const PORT = process.env.PORT || 5000;

  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4) DB 연결 & Express 서버 시작
  // ──────────────────────────────────────────────────────────────────────────
  try {
    console.log("Connecting to SQLite database...");
    await models.sequelize.authenticate();
    console.log("Database connection established successfully.");

    if (process.env.NODE_ENV === "development") {
      // 데이터베이스 동기화 (SQLite용)
      console.log("Syncing database...");
      await models.sequelize.sync({ force: false, alter: true }); // SQLite에서는 force로 테이블 재생성
      console.log("Database synced successfully.");
      const userCount = await models.User.count();
      if (userCount === 0) {
        console.log("No seed data found. Creating initial data...");
        await seedData();
      }
    }

    // 서버 시작 전 포트 확인 및 정리
    const server_instance = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server ready at http://0.0.0.0:${PORT}`);
      console.log(
        `🚀 GraphQL endpoint: http://0.0.0.0:${PORT}${server.graphqlPath}`,
      );
      if (process.env.APOLLO_PLAYGROUND === "true") {
        console.log(
          `🚀 GraphQL Playground: http://0.0.0.0:${PORT}${server.graphqlPath}`,
        );
      }
    });

    // 오류 처리
    server_instance.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(
          `포트 ${PORT}가 이미 사용 중입니다. 다른 포트를 시도합니다...`,
        );
        const newPort = PORT + 1;
        console.log(`새 포트 ${newPort}에서 서버를 시작합니다...`);
        app.listen(newPort, "0.0.0.0", () => {
          console.log(`🚀 Server ready at http://0.0.0.0:${newPort}`);
          console.log(
            `🚀 GraphQL endpoint: http://0.0.0.0:${newPort}${server.graphqlPath}`,
          );
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
