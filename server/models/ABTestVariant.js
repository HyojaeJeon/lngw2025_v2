// server/models/ABTestVariant.js

module.exports = (sequelize, DataTypes) => {
  const ABTestVariant = sequelize.define(
    "ABTestVariant",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      abTestGroupId: {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
          model: "ab_test_groups", // ✅ 실제 테이블명 (소문자 복수형)
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      engagement: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      ctr: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      conversions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "ab_test_variants",
      timestamps: true,
      underscored: false,
    },
  );

  return ABTestVariant;
};
