const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProductModel = sequelize.define(
    "ProductModel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        comment: "상품 ID",
      },
      modelName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "모델명",
      },
      modelCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "모델 코드",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "모델 설명",
      },
      specifications: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "모델 사양",
      },
      // 가격 정보
      price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "판매가",
      },
      consumerPrice: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: "소비자가",
      },
      cost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: "원가",
      },
      // 인센티브 정보 (salesList.md 요구사항)
      incentiveA: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "인센티브 A",
      },
      incentiveB: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "인센티브 B",
      },
      // 재고 정보
      currentStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "현재 재고",
      },
      minStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "최소 재고",
      },
      maxStock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "최대 재고",
      },
      soldQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "판매 수량",
      },
      // 기타 정보
      weight: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: true,
        comment: "무게 (kg)",
      },
      dimensions: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "크기 정보 {length, width, height}",
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "이미지 URL 배열",
      },
      color: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "색상",
      },
      size: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "사이즈",
      },
      material: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "재질",
      },
      // 상태 정보
      status: {
        type: DataTypes.ENUM("active", "inactive", "discontinued", "out_of_stock"),
        allowNull: false,
        defaultValue: "active",
        comment: "모델 상태",
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "정렬 순서",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "활성 상태",
      },
    },
    {
      tableName: "product_models",
      timestamps: true,
      paranoid: true, // soft delete 사용
      indexes: [
        {
          unique: true,
          fields: ["productId", "modelCode"],
          name: "unique_product_model_code",
        },
        {
          fields: ["productId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["isActive"],
        },
        {
          fields: ["currentStock"],
        },
      ],
    }
  );

  ProductModel.associate = (models) => {
    // Product와의 관계
    ProductModel.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });

    // 재고 관리 관계
    ProductModel.hasMany(models.InventoryRecord, {
      foreignKey: "productModelId",
      as: "inventoryRecords",
    });
  };

  return ProductModel;
};
