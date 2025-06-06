###############################################
# app.Dockerfile (수정본)
###############################################

FROM node:20-alpine

WORKDIR /app

# 1) Next.js(클라이언트) 의존성 설치
COPY client-nextjs/package*.json ./client-nextjs/
RUN cd client-nextjs && npm install --legacy-peer-deps

# 2) 백엔드(Express/GraphQL) 의존성 설치
COPY server/package*.json ./server/
RUN cd server && npm install --legacy-peer-deps

# 3) 전체 소스 복사
COPY client-nextjs ./client-nextjs
COPY server ./server

# 4) Next.js 빌드
RUN cd client-nextjs && npm run build

# 5) 두 프로세스를 동시에 실행하기 위해 'concurrently' 대신 간단 셸 스크립트 사용
#    Next.js(3000)와 Express(5000)를 병렬로 띄움
CMD ["sh", "-c", "cd client-nextjs && npm run start -3201 & cd /app/server && npm run start"]
