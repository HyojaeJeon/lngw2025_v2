const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const models = require("./models");
const seedData = require("./seeders");

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
    context: async ({ req }) => {
      let user = null;

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

      return { user };
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
    console.log("Connecting to database...");
    await models.sequelize.authenticate();
    console.log("Database connection established successfully.");

    if (process.env.NODE_ENV === "development") {
      // 데이터베이스 동기화
      console.log("Syncing database...");
      await models.sequelize.sync({ force: false, alter: true }); // 테이블을 완전히 재생성
      console.log("Database synced successfully.");
      const userCount = await models.User.count();
      if (userCount === 0) {
        console.log("No seed data found. Creating initial data...");
        await seedData();
      }
    }

    // 반드시 process.env.PORT를 사용해야 Replit 환경에서 외부에서 접근할 수 있습니다.
    app.listen(PORT, "0.0.0.0", () => {
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
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
