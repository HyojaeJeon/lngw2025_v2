FROM node:20-alpine AS builder
WORKDIR /app

# 클라이언트 의존성 설치 및 빌드
COPY client-nextjs/package*.json ./client-nextjs/
WORKDIR /app/client-nextjs
RUN npm ci
COPY client-nextjs/ ./
RUN npm run build

# 서버 의존성 설치 및 준비
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci
COPY server/ ./

# ───────────────────────────────
# Production Image (no node_modules copy)
# ───────────────────────────────

FROM node:20-alpine AS runner
WORKDIR /app

# 클라이언트 정적 파일 복사
COPY --from=builder /app/client-nextjs/.next/ ./client/.next/
COPY --from=builder /app/client-nextjs/public/ ./client/public/

# 서버 코드 복사
COPY --from=builder /app/server/ ./server/

# 서버 의존성 재설치 (단, production only)
WORKDIR /app/server
RUN npm install --omit=dev

EXPOSE 4000
CMD ["node", "index.js"]
