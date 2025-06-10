const { gql } = require('apollo-server-express');

const productTypeDefs = gql`
  # Product 입력 타입들
  input ProductInput {
    name: String!
    code: String!
    description: String
    specifications: String
    categoryId: Int!
    price: Float!
    consumerPrice: Float
    cost: Float
    currentStock: Int!
    minStock: Int
    maxStock: Int
    status: ProductStatus!
    weight: Float
    dimensions: DimensionsInput
    brand: String
    manufacturer: String
    modelNumber: String
    tagIds: [Int]
    images: [String]
    launchDate: String
    sortOrder: Int
    isActive: Boolean
    isFeatured: Boolean
    seoTitle: String
    seoDescription: String
    seoKeywords: String
  }

  input ProductUpdateInput {
    name: String
    code: String
    description: String
    specifications: String
    categoryId: Int
    price: Float
    consumerPrice: Float
    cost: Float
    currentStock: Int
    minStock: Int
    maxStock: Int
    status: ProductStatus
    weight: Float
    dimensions: DimensionsInput
    brand: String
    manufacturer: String
    modelNumber: String
    tagIds: [Int]
    images: [String]
    launchDate: String
    sortOrder: Int
    isActive: Boolean
    isFeatured: Boolean
    seoTitle: String
    seoDescription: String
    seoKeywords: String
  }

  input DimensionsInput {
    length: Float
    width: Float
    height: Float
  }

  # ProductModel 입력 타입들
  input ProductModelInput {
    modelName: String!
    modelCode: String!
    description: String
    specifications: String
    price: Float!
    consumerPrice: Float
    cost: Float
    currentStock: Int
    minStock: Int
    maxStock: Int
    weight: Float
    dimensions: JSON
    images: [String]
    color: String
    size: String
    material: String
    status: ProductModelStatus
    sortOrder: Int
    isActive: Boolean
  }

  input ProductModelUpdateInput {
    modelName: String
    modelCode: String
    description: String
    specifications: String
    price: Float
    consumerPrice: Float
    cost: Float
    currentStock: Int
    minStock: Int
    maxStock: Int
    weight: Float
    dimensions: JSON
    images: [String]
    color: String
    size: String
    material: String
    status: ProductModelStatus
    sortOrder: Int
    isActive: Boolean
  }

  input ProductFilterInput {
    categoryId: Int
    status: ProductStatus
    isActive: Boolean
    isFeatured: Boolean
    minPrice: Float
    maxPrice: Float
    minStock: Int
    maxStock: Int
    brand: String
    tagIds: [Int]
    search: String
  }

  input ProductSortInput {
    field: ProductSortField!
    direction: SortDirection!
  }

  enum ProductSortField {
    name
    code
    price
    currentStock
    soldQuantity
    createdAt
    updatedAt
  }

  enum ProductStatus {
    active
    inactive
    discontinued
    out_of_stock
  }

  # Product 응답 타입들
  type ProductResponse {
    success: Boolean!
    message: String
    product: Product
    errors: [FieldError]
  }

  type ProductListResponse {
    success: Boolean!
    message: String
    products: [Product]
    pagination: PaginationInfo
    errors: [FieldError]
  }

  type ProductStatsResponse {
    success: Boolean!
    totalProducts: Int!
    activeProducts: Int!
    inactiveProducts: Int!
    outOfStockProducts: Int!
    totalStock: Int!
    totalValue: Float!
    lowStockProducts: Int!
  }

  type CodeCheckResponse {
    isAvailable: Boolean!
    message: String!
  }

  # ProductModel 응답 타입들
  type ProductModelResponse {
    success: Boolean!
    message: String
    productModel: ProductModel
    errors: [FieldError]
  }

  type ProductModelListResponse {
    success: Boolean!
    message: String
    productModels: [ProductModel]
    errors: [FieldError]
  }

  # Query 확장
  extend type Query {
    # 상품 목록 조회
    products(
      filter: ProductFilterInput
      sort: ProductSortInput
      page: Int
      limit: Int
    ): [Product!]!

    # 상품 상세 조회
    product(id: Int!): ProductResponse!

    # 상품 코드 중복 확인
    checkProductCode(code: String!): CodeCheckResponse!

    # 상품 통계
    productStats: ProductStatsResponse!

    # 추천 상품 목록
    featuredProducts(limit: Int): ProductListResponse!

    # 카테고리별 상품 목록
    productsByCategory(categoryId: Int!, limit: Int): ProductListResponse!

    # 재고 부족 상품 목록
    lowStockProducts(limit: Int): ProductListResponse!

    # ProductModel 관련 쿼리
    productModels(productId: Int!): [ProductModel!]!
    productModel(id: ID!): ProductModel
    checkProductModelCode(productId: Int!, modelCode: String!): CodeCheckResponse!
  }

  # Mutation 확장
  extend type Mutation {
    # 상품 생성
    createProduct(input: ProductInput!): ProductResponse!

    # 상품 수정
    updateProduct(id: Int!, input: ProductUpdateInput!): ProductResponse!

    # 상품 삭제 (소프트 삭제)
    deleteProduct(id: Int!): ProductResponse!

    # 상품 복원
    restoreProduct(id: Int!): ProductResponse!

    # 상품 상태 변경
    updateProductStatus(id: Int!, status: ProductStatus!): ProductResponse!

    # 재고 업데이트
    updateStock(id: Int!, quantity: Int!, type: StockUpdateType!): ProductResponse!

    # 상품 순서 변경
    updateProductOrder(id: Int!, sortOrder: Int!): ProductResponse!

    # 추천 상품 설정/해제
    toggleFeaturedProduct(id: Int!): ProductResponse!

    # ProductModel 관련 뮤테이션
    createProductModel(productId: Int!, input: ProductModelInput!): ProductModelResponse!
    updateProductModel(id: ID!, input: ProductModelUpdateInput!): ProductModelResponse!
    deleteProductModel(id: ID!): ProductModelResponse!
    updateProductModelOrder(productId: Int!, modelIds: [Int!]!): ProductModelListResponse!
  }

  enum StockUpdateType {
    SET # 재고를 특정 값으로 설정
    ADD # 재고 추가
    SUBTRACT # 재고 차감
  }
`;

module.exports = productTypeDefs; 