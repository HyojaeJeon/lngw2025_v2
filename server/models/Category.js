const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '카테고리 코드'
    },
    names: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '다국어 이름 {ko, vi, en}'
    },
    descriptions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '다국어 설명 {ko, vi, en}'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      },
      comment: '상위 카테고리 ID'
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '카테고리 레벨'
    },
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
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['code']
      },
      {
        fields: ['parentId']
      },
      {
        fields: ['level']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  Category.associate = (models) => {
    // 자기 참조 관계
    Category.belongsTo(Category, {
      as: 'parent',
      foreignKey: 'parentId'
    });
    
    Category.hasMany(Category, {
      as: 'children',
      foreignKey: 'parentId'
    });

    // Product와의 관계
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products'
    });

    // SalesItem과의 관계
    Category.hasMany(models.SalesItem, {
      foreignKey: 'categoryId',
      as: 'salesItems'
    });
  };

  return Category;
};
