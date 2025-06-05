// server/models/ABTestGroup.js

/**
 * ABTestGroup 모델 정의 함수
 * @param {Sequelize} sequelize  – models/index.js에서 생성된 Sequelize 인스턴스
 * @param {DataTypes} DataTypes – Sequelize.DataTypes 객체
 */
module.exports = (sequelize, DataTypes) => {
  const ABTestGroup = sequelize.define(
    "ABTestGroup",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("draft", "active", "completed", "cancelled"),
        defaultValue: "draft",
      },
      winner: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      confidence: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        defaultValue: 7,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "ab_test_groups",
      timestamps: true,
      underscored: false, // snake_case 컬럼을 사용하려면 필요 시 활성화
    },
  );

  return ABTestGroup;
};
