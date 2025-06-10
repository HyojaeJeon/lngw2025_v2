const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductTag = sequelize.define('ProductTag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: '태그명'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '태그 설명'
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      comment: '태그 색상 (HEX)'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '활성 상태'
    },
    usageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '사용 횟수'
    }
  }, {
    tableName: 'product_tags',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['name']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['usageCount']
      }
    ]
  });

  ProductTag.associate = (models) => {
    // Many-to-Many 관계를 위한 through 테이블
    ProductTag.belongsToMany(models.Product, {
      through: 'product_product_tags',
      foreignKey: 'tagId',
      otherKey: 'productId',
      as: 'products'
    });
  };

  return ProductTag;
}; 