const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '상품명'
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: '상품 코드 (SKU)'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '상품 설명'
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '상품 사양'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      },
      comment: '카테고리 ID'
    },
    // 가격 정보
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '판매가'
    },
    consumerPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: '소비자가'
    },
    cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: '원가'
    },
    // 재고 정보
    currentStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '현재 재고'
    },
    minStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '최소 재고'
    },
    maxStock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '최대 재고'
    },
    soldQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '판매 수량'
    },
    sampleQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '샘플 수량'
    },
    defectiveQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '불량품 수량'
    },
    // 상태 및 기타 정보
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'discontinued', 'out_of_stock'),
      allowNull: false,
      defaultValue: 'active',
      comment: '상품 상태'
    },
    weight: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      comment: '무게 (kg)'
    },
    dimensions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '크기 정보 {length, width, height}'
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '브랜드'
    },
    manufacturer: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '제조사'
    },
    modelNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '모델 번호'
    },

    images: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '이미지 URL 배열'
    },
    // 날짜 정보
    launchDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: '출시일'
    },
    discontinueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: '단종일'
    },
    // 검색 및 정렬
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '정렬 순서'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '활성 상태'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '추천 상품 여부'
    },
    // 메타 정보
    seoTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'SEO 제목'
    },
    seoDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'SEO 설명'
    },
    seoKeywords: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'SEO 키워드'
    }
  }, {
    tableName: 'products',
    timestamps: true,
    paranoid: true, // soft delete 사용
    indexes: [
      {
        unique: true,
        fields: ['code']
      },
      {
        fields: ['categoryId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['isFeatured']
      },
      {
        fields: ['price']
      },
      {
        fields: ['currentStock']
      },
      {
        fields: ['name']
      },
      {
        fields: ['brand']
      }
    ]
  });

  Product.associate = (models) => {
    // Category와의 관계
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    // ProductTag와의 Many-to-Many 관계
    Product.belongsToMany(models.ProductTag, {
      through: 'product_product_tags',
      foreignKey: 'productId',
      otherKey: 'tagId',
      as: 'tags'
    });

    // ProductModel과의 관계
    Product.hasMany(models.ProductModel, {
      foreignKey: 'productId',
      as: 'productModels'
    });

    // 재고 관리 관계
    Product.hasMany(models.InventoryRecord, {
      foreignKey: 'productId',
      as: 'inventoryRecords'
    });
  };

  return Product;
}; 