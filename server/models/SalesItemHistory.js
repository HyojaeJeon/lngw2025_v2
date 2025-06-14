
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SalesItemHistory = sequelize.define('SalesItemHistory', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: '변경한 사용자 ID'
    },
    action: {
      type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
      allowNull: false,
      comment: '수행된 작업'
    },
    field: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '변경된 필드명'
    },
    oldValue: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '이전 값'
    },
    newValue: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '새로운 값'
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '추가 메타데이터'
    }
  }, {
    tableName: 'sales_item_histories',
    timestamps: true,
    indexes: [
      {
        fields: ['salesItemId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['action']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  SalesItemHistory.associate = (models) => {
    // SalesItem과의 관계
    SalesItemHistory.belongsTo(models.SalesItem, {
      foreignKey: 'salesItemId',
      as: 'salesItem'
    });

    // User와의 관계
    SalesItemHistory.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return SalesItemHistory;
};
