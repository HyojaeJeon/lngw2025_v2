
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SalesCategory = sequelize.define('SalesCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '카테고리 이름'
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: '카테고리 코드'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '카테고리 설명'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '정렬 순서'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '활성 상태'
    }
  }, {
    tableName: 'sales_categories',
    timestamps: true,
    indexes: [
      {
        fields: ['code']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['sortOrder']
      }
    ]
  });

  SalesCategory.associate = (models) => {
    // SalesItem과의 관계
    SalesCategory.hasMany(models.SalesItem, {
      foreignKey: 'type',
      sourceKey: 'code',
      as: 'salesItems'
    });
  };

  return SalesCategory;
};
