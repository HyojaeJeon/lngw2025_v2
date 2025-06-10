const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    salesItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sales_items',
        key: 'id'
      },
      comment: '매출 항목 ID'
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '결제일'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '결제금액'
    },
    paymentMethod: {
      type: DataTypes.ENUM('CASH', 'CARD', 'BANK_TRANSFER', 'OTHER'),
      allowNull: false,
      defaultValue: 'BANK_TRANSFER',
      comment: '결제방법'
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '비고'
    },
    receiptImageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '이체증 이미지 URL'
    },
    // 상태 정보
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '활성 상태'
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['salesItemId']
      },
      {
        fields: ['paymentDate']
      },
      {
        fields: ['paymentMethod']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  Payment.associate = (models) => {
    // SalesItem과의 관계
    Payment.belongsTo(models.SalesItem, {
      foreignKey: 'salesItemId',
      as: 'salesItem'
    });
  };

  return Payment;
}; 