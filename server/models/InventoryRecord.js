const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryRecord = sequelize.define('InventoryRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      },
      comment: '상품 ID'
    },
    productModelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product_models',
        key: 'id'
      },
      comment: '상품 모델 ID (모델이 있는 경우)'
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id'
      },
      comment: '창고 ID'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '재고 수량'
    },
    reservedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '예약된 수량 (주문 처리 중)'
    },
    availableQuantity: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.quantity - this.reservedQuantity;
      },
      comment: '사용 가능한 재고 수량'
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '창고 내 위치 (구역, 선반 등)'
    },
    lotNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '로트 번호'
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: '유통기한'
    },
    cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: '단위 원가'
    },
    lastCountDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '마지막 재고 실사일'
    },
    lastMovementDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '마지막 재고 이동일'
    }
  }, {
    tableName: 'inventory_records',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['productId', 'warehouseId', 'lotNumber'],
        name: 'unique_product_warehouse_lot'
      },
      {
        fields: ['productId']
      },
      {
        fields: ['warehouseId']
      },
      {
        fields: ['quantity']
      },
      {
        fields: ['expiryDate']
      },
      {
        fields: ['lastCountDate']
      }
    ]
  });

  InventoryRecord.associate = (models) => {
    // Product와의 관계
    InventoryRecord.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });

    // ProductModel과의 관계
    InventoryRecord.belongsTo(models.ProductModel, {
      foreignKey: 'productModelId',
      as: 'productModel'
    });

    // Warehouse와의 관계
    InventoryRecord.belongsTo(models.Warehouse, {
      foreignKey: 'warehouseId',
      as: 'warehouse'
    });

    // StockMovement와의 관계
    InventoryRecord.hasMany(models.StockMovement, {
      foreignKey: 'inventoryRecordId',
      as: 'stockMovements'
    });
  };

  return InventoryRecord;
}; 