# ───────────────────────────────────────────────────────────────────────────
# 1) Build Stage: Next.js 클라이언트 + Node.js 서버를 빌드
# ───────────────────────────────────────────────────────────────────────────

# (1) Node 20 기반으로 클라이언트/서버 빌드
FROM node:20-alpine AS builder

# (2) 작업 디렉터리 설정
WORKDIR /app

# (3) 클라이언트 패키지 매니저 파일 복사 및 의존성 설치
COPY client-nextjs/package.json client-nextjs/package-lock.json ./client-nextjs/
WORKDIR /app/client-nextjs
RUN npm ci

# (4) 클라이언트 소스 전체 복사 후, Next.js 빌드
COPY client-nextjs/ ./
RUN npm run build

# (5) 서버 패키지 매니저 파일 복사 및 의존성 설치
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
WORKDIR /app/server
RUN npm ci

# (6) 서버 소스 전체 복사
COPY server/ ./
# (선택) 서버 코드 빌드 필요 시: ex) RUN npm run build

# ───────────────────────────────────────────────────────────────────────────
# 2) Production Stage: 실제로 실행할 이미지를 생성
# ───────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS runner
WORKDIR /app

# (2) builder 스테이지에서 빌드된 클라이언트 정적 파일을 복제
COPY --from=builder /app/client-nextjs/.next/ ./client/.next/
COPY --from=builder /app/client-nextjs/public/ ./client/public/

# (3) 서버 의존성 복제 (node_modules 포함)
COPY --from=builder /app/server/node_modules/ ./server/node_modules/

# (4) 서버 소스 복제
COPY --from=builder /app/server/ ./server/

# ───────────────────────────────────────────────────────────────────────────
# 3) 컨테이너 포트 설정 및 시작 명령어
# ───────────────────────────────────────────────────────────────────────────

# (5) 환경 변수 설정 (선택)
# ENV NODE_ENV=production

# Database Configuration
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_NAME=lngw2025_db
ENV DB_USER=appuser
ENV DB_PASSWORD=gywo9988!@
# CREATE USER 'app'@'localhost' IDENTIFIED BY 'gywo9988!@'; 

# Server Configuration
ENV PORT=5000
ENV NODE_ENV=development

# JWT Secret
ENV JWT_SECRET=your_jwt_secret_key_here

# GraphQL Playground
ENV APOLLO_INTROSPECTION=true
ENV APOLLO_PLAYGROUND=true

ENV DB_SOCKET=/tmp/mysql.sock
ENV DATABASE_URL=mysql://appuser:gywo9988%21%40@localhost:3306/lngw2025_db?socketPath=/home/runner/workspace/mysql.sock


# (6) 컨테이너 내부에서 포트를 노출 (서버가 4000 포트 사용 가정)
EXPOSE 4000

# (7) 서버 진입 및 실행
WORKDIR /app/server
CMD ["node", "index.js"]
