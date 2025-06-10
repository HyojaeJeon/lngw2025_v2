const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StockMovement = sequelize.define('StockMovement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    inventoryRecordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'inventory_records',
        key: 'id'
      },
      comment: '재고 기록 ID'
    },
    type: {
      type: DataTypes.ENUM(
        'IN',          // 입고
        'OUT',         // 출고
        'TRANSFER',    // 창고간 이동
        'ADJUSTMENT',  // 재고 조정
        'RETURN',      // 반품
        'DAMAGE',      // 손상/폐기
        'SAMPLE',      // 샘플 출고
        'PRODUCTION'   // 생산 입고
      ),
      allowNull: false,
      comment: '이동 유형'
    },
    reason: {
      type: DataTypes.ENUM(
        'PURCHASE',     // 구매 입고
        'SALE',         // 판매 출고
        'TRANSFER',     // 창고 이동
        'COUNT_ADJUST', // 실사 조정
        'DAMAGED',      // 손상
        'EXPIRED',      // 유통기한 만료
        'CUSTOMER_RETURN', // 고객 반품
        'SUPPLIER_RETURN', // 공급업체 반품
        'SAMPLE_REQUEST',  // 샘플 요청
        'PRODUCTION_INPUT', // 생산 투입
        'PRODUCTION_OUTPUT', // 생산 완료
        'LOST',         // 분실
        'THEFT',        // 도난
        'OTHER'         // 기타
      ),
      allowNull: false,
      comment: '이동 사유'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '이동 수량'
    },
    unitCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: '단위 원가'
    },
    totalCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: '총 비용'
    },
    fromWarehouseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'warehouses',
        key: 'id'
      },
      comment: '출발 창고 ID'
    },
    toWarehouseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'warehouses',
        key: 'id'
      },
      comment: '도착 창고 ID'
    },
    referenceType: {
      type: DataTypes.ENUM(
        'PURCHASE_ORDER',   // 구매 주문
        'SALES_ORDER',      // 판매 주문
        'TRANSFER_ORDER',   // 이동 지시
        'ADJUSTMENT_ORDER', // 조정 지시
        'RETURN_ORDER',     // 반품 지시
        'MANUAL'            // 수동 처리
      ),
      allowNull: true,
      comment: '참조 문서 유형'
    },
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '참조 문서 ID'
    },
    referenceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '참조 문서 번호'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '비고'
    },
    processedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: '처리자 ID'
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '처리 일시'
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '확인 여부'
    },
    confirmedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: '확인자 ID'
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '확인 일시'
    }
  }, {
    tableName: 'stock_movements',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        fields: ['inventoryRecordId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['reason']
      },
      {
        fields: ['processedAt']
      },
      {
        fields: ['fromWarehouseId']
      },
      {
        fields: ['toWarehouseId']
      },
      {
        fields: ['referenceType', 'referenceId']
      },
      {
        fields: ['processedBy']
      },
      {
        fields: ['isConfirmed']
      }
    ]
  });

  StockMovement.associate = (models) => {
    // InventoryRecord와의 관계
    StockMovement.belongsTo(models.InventoryRecord, {
      foreignKey: 'inventoryRecordId',
      as: 'inventoryRecord'
    });

    // 출발/도착 창고와의 관계
    StockMovement.belongsTo(models.Warehouse, {
      foreignKey: 'fromWarehouseId',
      as: 'fromWarehouse'
    });

    StockMovement.belongsTo(models.Warehouse, {
      foreignKey: 'toWarehouseId',
      as: 'toWarehouse'
    });

    // 처리자/확인자와의 관계
    StockMovement.belongsTo(models.User, {
      foreignKey: 'processedBy',
      as: 'processor'
    });

    StockMovement.belongsTo(models.User, {
      foreignKey: 'confirmedBy',
      as: 'confirmer'
    });
  };

  return StockMovement;
}; 