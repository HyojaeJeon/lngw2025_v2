# ───────────────────────────────────────────────────────────
# 1) Build Stage: Next.js 클라이언트 + Node.js 서버를 빌드
# ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# 1. 클라이언트 의존성 설치 및 빌드 (Next.js)
COPY client-nextjs/package*.json ./client-nextjs/
WORKDIR /app/client-nextjs
RUN npm ci
COPY client-nextjs/ ./
RUN npm run build   # 빌드 완료 시, .next 폴더 생성

# 2. 서버 의존성 설치 (Node.js)
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci
COPY server/ ./

# ───────────────────────────────────────────────────────────
# 2) Production Stage: 런타임 전용 이미지 생성
# ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# 1. 클라이언트 빌드 결과(정적 파일) 복사
COPY --from=builder /app/client-nextjs/.next/ ./client/.next/
COPY --from=builder /app/client-nextjs/public/ ./client/public/

# 2. 서버 소스 코드 전체 복사
COPY --from=builder /app/server/ ./server/

# 3. 프로덕션 전용으로 의존성 재설치 (devDependencies 제외)
WORKDIR /app/server
RUN npm install --omit=dev

# 4. 내부 포트 노출 (NGINX가 이 포트로 프록시)
EXPOSE 4000

# 5. 앱 실행 (Node.js 서버 진입점)
CMD ["node", "index.js"]
