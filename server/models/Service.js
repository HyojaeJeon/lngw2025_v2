
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "서비스명",
      },
      price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "가격",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "서비스 설명",
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "서비스 카테고리",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
        comment: "서비스 상태",
      },
    },
    {
      tableName: "services",
      timestamps: true,
      underscored: false,
    }
  );

  return Service;
};
