# LN Partners Groupware 2025 v2

## 개요
LN Partners Groupware는 Next.js와 GraphQL을 사용한 현대적인 그룹웨어 시스템입니다.

## 기술 스택
- **Frontend**: Next.js 15, React 18, TailwindCSS, Apollo Client
- **Backend**: Node.js, Express, Apollo Server, GraphQL
- **Database**: MySQL (로컬) / SQLite (Replit)
- **ORM**: Sequelize

## Replit 환경에서 실행

### 1. 자동 설정
Replit에서는 자동으로 SQLite 데이터베이스를 사용하고 적절한 포트 설정이 적용됩니다.

### 2. 실행 방법
```bash
# Replit Run 버튼을 클릭하거나 아래 명령어 실행
npm run dev
```

### 3. 포트 설정
- **클라이언트**: 포트 3000 (외부 포트 3000)
- **서버**: 포트 5000 (외부 포트 80)
- **GraphQL Playground**: `/graphql` 엔드포인트

### 4. 접속 URL
- **클라이언트**: `https://[replit-url]:3000`
- **GraphQL API**: `https://[replit-url]/graphql`

## 로컬 개발 환경

### 1. 의존성 설치
```bash
# 루트 디렉토리
npm install

# 서버
cd server && npm install

# 클라이언트
cd client-nextjs && npm install
```

### 2. MySQL 설정 (선택사항)
```bash
# Docker를 사용한 MySQL 실행
docker-compose up mysql

# 또는 로컬 MySQL 서비스 사용
# 데이터베이스: lngw2025_db
# 사용자: appuser
# 비밀번호: gywo9988!@
```

### 3. 개발 서버 실행
```bash
npm run dev
```

## 환경별 데이터베이스 설정

### Replit 환경
- 자동으로 SQLite 사용
- 파일 위치: `./database.sqlite`

### 로컬 환경
- MySQL 8.0 사용
- 연결 정보: `localhost:3306/lngw2025_db`

## API 연결 확인

### 헬스체크
```bash
curl https://[your-replit-url]/health
```

### GraphQL 쿼리 테스트
GraphQL Playground에서 다음 쿼리를 테스트할 수 있습니다:
```graphql
query {
  users {
    id
    email
    role
  }
}
```

## 문제 해결

### CORS 오류
- Replit 환경에서는 자동으로 허용됩니다
- 로컬 환경에서는 `localhost:3000`과 `localhost:5000` 간 통신이 허용됩니다

### 데이터베이스 연결 오류
- Replit: SQLite 자동 사용
- 로컬: MySQL 서비스 확인 또는 Docker 컨테이너 실행

### 포트 충돌
- 서버는 자동으로 다른 포트로 전환을 시도합니다
- 필요시 프로세스를 종료하고 다시 시작하세요
