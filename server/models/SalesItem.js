const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SalesItem = sequelize.define('SalesItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // 기본 정보
    salesRepId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: '영업사원 ID'
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      },
      comment: '고객사 ID'
    },
    type: {
      type: DataTypes.ENUM('SALE', 'SAMPLE', 'DEFECTIVE', 'EXPIRED'),
      allowNull: false,
      defaultValue: 'SALE',
      comment: '구분'
    },
    salesDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '일시'
    },
    // 제품 정보
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      },
      comment: '카테고리 ID'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      },
      comment: '제품 ID'
    },
    productModelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product_models',
        key: 'id'
      },
      comment: '모델 ID'
    },
    // 수량 및 가격 정보
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '수량'
    },
    consumerPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: '소비자가'
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '단가'
    },
    salesPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '판매가'
    },
    totalPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '총 판매가 (판매가 * 수량)'
    },
    discountRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '할인율 (%)'
    },
    // 비용 정보
    cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '원가'
    },
    totalCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '원가 합 (원가 * 수량)'
    },
    deliveryFee: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '배송료'
    },
    // 인센티브 정보
    incentiveA: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '인센티브 A'
    },
    incentiveB: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '인센티브 B'
    },
    incentivePaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '인센티브 지급여부'
    },
    // 마진 계산 정보
    margin: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '마진 (단가 - 원가 - 인센티브)'
    },
    totalMargin: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '마진 합 (마진 * 수량)'
    },
    finalMargin: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '최종마진 합 (총 판매가 - 총 원가 - 배송료 - 인센티브)'
    },
    marginRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: '마진 요율 (%)'
    },
    // 결제 정보
    paymentStatus: {
      type: DataTypes.ENUM('UNPAID', 'PARTIAL_PAID', 'PAID'),
      allowNull: false,
      defaultValue: 'UNPAID',
      comment: '결제여부'
    },
    paidAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '결제완료액'
    },
    // 추가 비용 정보
    shippingCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '배송료'
    },
    otherCosts: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '기타 비용'
    },
    // 기타
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '비고'
    },
    // 상태 정보
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '활성 상태'
    }
  }, {
    tableName: 'sales_items',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['salesRepId']
      },
      {
        fields: ['customerId']
      },
      {
        fields: ['salesDate']
      },
      {
        fields: ['productId']
      },
      {
        fields: ['categoryId']
      },
      {
        fields: ['paymentStatus']
      },
      {
        fields: ['type']
      },
      {
        fields: ['isActive']
      }
    ],
    hooks: {
      beforeSave: (salesItem) => {
        // 총 판매가 계산
        salesItem.totalPrice = salesItem.salesPrice * salesItem.quantity;

        // 총 원가 계산
        salesItem.totalCost = salesItem.cost * salesItem.quantity;

        // 할인율 계산
        if (salesItem.consumerPrice && salesItem.consumerPrice > 0) {
          salesItem.discountRate = ((salesItem.consumerPrice - salesItem.unitPrice) / salesItem.consumerPrice) * 100;
        }

        // 마진 계산
        salesItem.margin = salesItem.unitPrice - salesItem.cost - (salesItem.incentiveA / salesItem.quantity) - (salesItem.incentiveB / salesItem.quantity);
        salesItem.totalMargin = salesItem.margin * salesItem.quantity;

        // 최종 마진 계산
        salesItem.finalMargin = salesItem.totalPrice - salesItem.totalCost - salesItem.deliveryFee - salesItem.incentiveA - salesItem.incentiveB;

        // 마진 요율 계산
        if (salesItem.totalPrice > 0) {
          salesItem.marginRate = (salesItem.finalMargin / salesItem.totalPrice) * 100;
        }
      }
    }
  });

  SalesItem.associate = (models) => {
    // User (영업사원)와의 관계
    SalesItem.belongsTo(models.User, {
      foreignKey: 'salesRepId',
      as: 'salesRep'
    });

    // Customer와의 관계
    SalesItem.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });

    // Product와의 관계
    SalesItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });

    // ProductModel과의 관계
    SalesItem.belongsTo(models.ProductModel, {
      foreignKey: 'productModelId',
      as: 'productModel'
    });

    // SalesCategory와의 관계
    SalesItem.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    // SalesItemHistory와의 관계 (변경 이력)
    if (models.SalesItemHistory) {
      SalesItem.hasMany(models.SalesItemHistory, {
        foreignKey: 'salesItemId',
        as: 'history'
      });
    }

    // IncentivePayout과의 관계
    if (models.IncentivePayout) {
      SalesItem.hasMany(models.IncentivePayout, {
        foreignKey: 'salesItemId',
        as: 'incentivePayouts'
      });
    }
  };

  return SalesItem;
};