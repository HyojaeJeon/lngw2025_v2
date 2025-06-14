
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IncentivePayout = sequelize.define('IncentivePayout', {
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
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: '지급 대상자 ID'
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '지급일'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '지급액'
    },
    type: {
      type: DataTypes.ENUM('INCENTIVE_A', 'INCENTIVE_B'),
      allowNull: false,
      comment: '인센티브 타입'
    },
    receiptImageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '이체증 이미지 URL'
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '지급 메모'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '활성 상태'
    }
  }, {
    tableName: 'incentive_payouts',
    timestamps: true,
    indexes: [
      {
        fields: ['salesItemId']
      },
      {
        fields: ['recipientId']
      },
      {
        fields: ['paymentDate']
      },
      {
        fields: ['type']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  IncentivePayout.associate = (models) => {
    // SalesItem과의 관계
    IncentivePayout.belongsTo(models.SalesItem, {
      foreignKey: 'salesItemId',
      as: 'salesItem'
    });

    // User와의 관계
    IncentivePayout.belongsTo(models.User, {
      foreignKey: 'recipientId',
      as: 'recipient'
    });
  };

  return IncentivePayout;
};
