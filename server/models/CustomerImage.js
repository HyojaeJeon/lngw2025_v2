
module.exports = (sequelize, DataTypes) => {
  const CustomerImage = sequelize.define(
    "CustomerImage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        comment: "고객 ID",
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "이미지 URL",
      },
      imageType: {
        type: DataTypes.ENUM("facility", "profile"),
        allowNull: false,
        defaultValue: "facility",
        comment: "이미지 타입",
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "이미지 설명",
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "정렬 순서",
      },
    },
    {
      tableName: "customer_images",
      timestamps: true,
      underscored: false,
    },
  );

  CustomerImage.associate = function(models) {
    CustomerImage.belongsTo(models.Customer, {
      foreignKey: "customerId",
      as: "customer",
    });
  };

  return CustomerImage;
};
