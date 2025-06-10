# LNGW 2025 v2 - GraphQL API 문서

## 🚀 API 개요

### GraphQL Endpoint
```
POST http://localhost:50001/graphql
```

### 인증
모든 API 요청은 HTTP 헤더에 JWT 토큰을 포함해야 합니다.
```
Authorization: Bearer <your_jwt_token>
```

### 콘텐츠 타입
```
Content-Type: application/json
```

## 🔐 인증 API

### 로그인
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      name
      role
      department
    }
  }
}
```

**요청 예시:**
```json
{
  "query": "mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token user { id email name role } } }",
  "variables": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

### 회원가입
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      email
      name
      role
    }
  }
}
```

### 현재 사용자 정보
```graphql
query Me {
  me {
    id
    email
    name
    role
    department
    position
    avatar
  }
}
```

## 👥 사용자 관리 API

### 직원 목록 조회
```graphql
query GetSalesReps($search: String) {
  employees(filter: { search: $search, role: "SALES" }) {
    id
    name
    email
    department
    position
    avatar
  }
}
```

### 사용자 정보 업데이트
```graphql
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    success
    message
    user {
      id
      name
      email
      department
      position
    }
  }
}
```

## 👨‍💼 고객 관리 API

### 고객 목록 조회
```graphql
query GetCustomers($search: String, $grade: String) {
  customers(filter: { search: $search, grade: $grade }) {
    id
    name
    contactName
    email
    phone
    grade
    profileImage
    address
    business
    taxId
    status
    createdAt
    updatedAt
  }
}
```

### 고객 생성
```graphql
mutation CreateCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    success
    message
    customer {
      id
      name
      contactName
      email
      phone
      grade
    }
  }
}
```

### 고객 정보 업데이트
```graphql
mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
  updateCustomer(id: $id, input: $input) {
    success
    message
    customer {
      id
      name
      contactName
      email
      phone
      grade
    }
  }
}
```

### 고객 삭제
```graphql
mutation DeleteCustomer($id: ID!) {
  deleteCustomer(id: $id) {
    success
    message
  }
}
```

## 📦 제품 관리 API

### 제품 목록 조회
```graphql
query GetProducts($search: String, $categoryId: ID) {
  products(filter: { search: $search, categoryId: $categoryId }) {
    id
    name
    code
    description
    price
    cost
    currentStock
    category {
      id
      name
    }
    productModels {
      id
      modelName
      modelCode
      images
      price
      stock
    }
    images
    status
    createdAt
    updatedAt
  }
}
```

### 제품 생성
```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    success
    message
    product {
      id
      name
      code
      price
      cost
      currentStock
    }
  }
}
```

### 제품 모델 조회
```graphql
query GetProductModels($productId: ID!) {
  productModels(productId: $productId) {
    id
    modelName
    modelCode
    price
    stock
    images
    specifications
    status
  }
}
```

## 💰 매출 관리 API

### 매출 항목 생성
```graphql
mutation CreateSalesItem($input: CreateSalesItemInput!) {
  createSalesItem(input: $input) {
    success
    message
    salesItem {
      id
      salesRep {
        id
        name
        department
      }
      customer {
        id
        name
        contactName
        grade
      }
      type
      salesDate
      product {
        id
        name
        code
      }
      productModel {
        id
        modelName
        modelCode
      }
      quantity
      consumerPrice
      unitPrice
      salesPrice
      totalPrice
      discountRate
      cost
      totalCost
      deliveryFee
      incentiveA
      incentiveB
      incentivePaid
      margin
      totalMargin
      finalMargin
      marginRate
      paymentStatus
      paidAmount
      notes
      createdAt
      updatedAt
    }
  }
}
```

**입력 타입:**
```graphql
input CreateSalesItemInput {
  salesRepId: ID!
  customerId: ID!
  type: SalesType!
  salesDate: Date!
  productId: ID!
  productModelId: ID
  quantity: Int!
  consumerPrice: Float
  unitPrice: Float!
  salesPrice: Float
  totalPrice: Float
  discountRate: Float
  cost: Float
  totalCost: Float
  deliveryFee: Float
  incentiveA: Float
  incentiveB: Float
  incentivePaid: Boolean
  margin: Float
  totalMargin: Float
  finalMargin: Float
  marginRate: Float
  paymentStatus: PaymentStatus!
  paidAmount: Float
  notes: String
}
```

### 매출 항목 업데이트
```graphql
mutation UpdateSalesItem($id: ID!, $input: UpdateSalesItemInput!) {
  updateSalesItem(id: $id, input: $input) {
    success
    message
    salesItem {
      id
      quantity
      unitPrice
      salesPrice
      totalPrice
      margin
      totalMargin
      finalMargin
      marginRate
      paymentStatus
      updatedAt
    }
  }
}
```

### 매출 항목 삭제
```graphql
mutation DeleteSalesItem($id: ID!) {
  deleteSalesItem(id: $id) {
    success
    message
  }
}
```

### 매출 통계
```graphql
query GetSalesStats($dateFrom: Date, $dateTo: Date) {
  salesStats(filter: { dateFrom: $dateFrom, dateTo: $dateTo }) {
    totalSales
    totalMargin
    salesCount
    averageMarginRate
    topSalesRep {
      id
      name
      totalSales
    }
    topCustomer {
      id
      name
      totalSales
    }
    topProduct {
      id
      name
      totalSales
    }
  }
}
```

## 📊 카테고리 관리 API

### 카테고리 목록 조회
```graphql
query GetCategories {
  categories {
    id
    name
    description
    parentId
    sortOrder
    isActive
    products {
      id
      name
      code
      price
    }
    children {
      id
      name
      description
    }
  }
}
```

### 카테고리 생성
```graphql
mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    success
    message
    category {
      id
      name
      description
      parentId
      sortOrder
    }
  }
}
```

## 🎯 마케팅 API

### 콘텐츠 목록 조회
```graphql
query GetContents($filter: ContentFilter) {
  contents(filter: $filter) {
    contents {
      id
      title
      description
      content
      mediaType
      status
      platforms
      aiGenerated
      user {
        id
        name
      }
      engagement {
        views
        likes
        shares
        comments
        engagementRate
      }
      createdAt
      updatedAt
    }
    total
    hasMore
  }
}
```

### 트렌드 데이터 조회
```graphql
query GetTrends($timeRange: String, $platform: String) {
  trends(timeRange: $timeRange, platform: $platform) {
    keyword
    volume
    growth
    relevanceScore
    sentiment
    relatedKeywords
    timestamp
  }
}
```

## 🔧 에러 코드

### 일반 에러
- `UNAUTHENTICATED`: 인증 토큰이 없거나 유효하지 않음
- `FORBIDDEN`: 권한이 없음
- `NOT_FOUND`: 요청한 리소스를 찾을 수 없음
- `VALIDATION_ERROR`: 입력 데이터 검증 실패
- `INTERNAL_ERROR`: 서버 내부 오류

### 비즈니스 로직 에러
- `DUPLICATE_EMAIL`: 이미 존재하는 이메일
- `INVALID_CREDENTIALS`: 잘못된 로그인 정보
- `INSUFFICIENT_STOCK`: 재고 부족
- `INVALID_SALES_DATA`: 매출 데이터 검증 실패

## 📈 Enum 타입

### SalesType (매출 구분)
```graphql
enum SalesType {
  SALE      # 판매
  SAMPLE    # 샘플
  DEFECTIVE # 불량
  EXPIRED   # 유통기한만료
}
```

### PaymentStatus (결제 상태)
```graphql
enum PaymentStatus {
  UNPAID       # 미결제
  PARTIAL_PAID # 부분결제
  PAID         # 결제완료
}
```

### PaymentMethod (결제 방법)
```graphql
enum PaymentMethod {
  CASH         # 현금
  CARD         # 카드
  BANK_TRANSFER # 계좌이체
  OTHER        # 기타
}
```

### CustomerGrade (고객 등급)
```graphql
enum CustomerGrade {
  VIP      # VIP
  GOLD     # 골드
  SILVER   # 실버
  BRONZE   # 브론즈
  NORMAL   # 일반
}
```

## 🔄 실시간 구독 (향후 구현)

### 매출 데이터 변경 알림
```graphql
subscription SalesItemUpdated {
  salesItemUpdated {
    id
    action # CREATE, UPDATE, DELETE
    salesItem {
      id
      totalPrice
      customer {
        name
      }
      product {
        name
      }
    }
  }
}
```

### 알림 구독
```graphql
subscription NotificationReceived($userId: ID!) {
  notificationReceived(userId: $userId) {
    id
    title
    message
    type
    createdAt
  }
}
```

## 📝 사용 예시

### 새 매출 데이터 생성 플로우
```javascript
// 1. 영업사원 목록 조회
const salesReps = await client.query({
  query: GET_SALES_REPS,
  variables: { search: "" }
});

// 2. 고객 목록 조회
const customers = await client.query({
  query: GET_CUSTOMERS,
  variables: { search: "" }
});

// 3. 제품 목록 조회
const products = await client.query({
  query: GET_PRODUCTS,
  variables: { search: "" }
});

// 4. 매출 데이터 생성
const result = await client.mutate({
  mutation: CREATE_SALES_ITEM,
  variables: {
    input: {
      salesRepId: 4,
      customerId: 1,
      type: "SALE",
      salesDate: "2025-01-13",
      productId: 1,
      quantity: 2,
      unitPrice: 500000,
      paymentStatus: "UNPAID"
    }
  }
});
```

## 🔍 성능 최적화 가이드

### DataLoader 패턴
연관된 데이터를 효율적으로 로드하기 위해 DataLoader를 사용합니다.
```javascript
// N+1 문제 해결 예시
const salesItemWithDetails = await client.query({
  query: gql`
    query GetSalesItems {
      salesItems {
        id
        quantity
        salesRep { name }    # DataLoader로 배치 로딩
        customer { name }    # DataLoader로 배치 로딩
        product { name }     # DataLoader로 배치 로딩
      }
    }
  `
});
```

### 쿼리 최적화
필요한 필드만 요청하여 성능을 최적화합니다.
```graphql
# ❌ 불필요한 데이터까지 조회
query {
  products {
    id
    name
    description
    specifications
    images
    # ... 모든 필드
  }
}

# ✅ 필요한 필드만 조회
query {
  products {
    id
    name
    price
  }
}
```

---

**마지막 업데이트**: 2025년 1월 13일  
**API 버전**: v2.0  
**GraphQL 스키마 버전**: 2.0.0 