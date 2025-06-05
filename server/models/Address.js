
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "주소명",
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "국가",
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "주/도",
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "시/군/구",
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "구/군",
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "도로명",
      },
      buildingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "건물번호",
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "우편번호",
      },
      fullAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "전체 주소",
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "기본 주소 여부",
      },
    },
    {
      tableName: "addresses",
      timestamps: true,
      underscored: false,
    }
  );

  return Address;
};
