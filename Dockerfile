# ───────────────────────────────────────────────────────────────────────────
# 1) Build Stage: Next.js 클라이언트 + Node.js 서버를 빌드
# ───────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS builder
WORKDIR /app

# (1) 클라이언트 의존성 설치
COPY client-nextjs/package.json client-nextjs/package-lock.json ./client-nextjs/
WORKDIR /app/client-nextjs
RUN npm ci

# (2) 클라이언트 전체 복사 및 Next.js 빌드
COPY client-nextjs/ ./
RUN npm run build   # .next 폴더 생성

# (3) 서버 의존성 설치
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
WORKDIR /app/server
RUN npm ci

# (4) 서버 소스 전체 복사
COPY server/ ./
# (선택) 서버 빌드(트랜스파일, GraphQL 코드 생성 등) 시: 
# RUN npm run build

# ───────────────────────────────────────────────────────────────────────────
# 2) Production Stage: 실행 전용 이미지 생성
# ───────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS runner
WORKDIR /app

# (1) 빌드된 클라이언트 정적 파일 복사
COPY --from=builder /app/client-nextjs/.next/ ./client/.next/
COPY --from=builder /app/client-nextjs/public/ ./client/public/

# (2) 서버 의존성 복사(node_modules 포함)
COPY --from=builder /app/server/node_modules/ ./server/node_modules/

# (3) 서버 소스 전체 복사
COPY --from=builder /app/server/ ./server/

# (4) 컨테이너 내부에서 포트 노출 (서버가 4000번 포트를 리스닝한다고 가정)
EXPOSE 4000

# (5) 서버 실행
WORKDIR /app/server
CMD ["node", "index.js"]
