const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Warehouse = sequelize.define('Warehouse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '창고 코드'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '창고명'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '창고 설명'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '창고 주소'
    },
    managerName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '담당자명'
    },
    managerPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '담당자 연락처'
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '수용 용량'
    },
    temperature: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '온도 조건 {min, max, unit}'
    },
    humidity: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '습도 조건 {min, max}'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '활성 상태'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '기본 창고 여부'
    }
  }, {
    tableName: 'warehouses',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['code']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['isDefault']
      }
    ]
  });

  Warehouse.associate = (models) => {
    // 창고별 재고 관리
    Warehouse.hasMany(models.InventoryRecord, {
      foreignKey: 'warehouseId',
      as: 'inventoryRecords'
    });

    // 창고별 재고 이동 기록
    Warehouse.hasMany(models.StockMovement, {
      foreignKey: 'fromWarehouseId',
      as: 'outgoingMovements'
    });

    Warehouse.hasMany(models.StockMovement, {
      foreignKey: 'toWarehouseId',
      as: 'incomingMovements'
    });
  };

  return Warehouse;
}; 