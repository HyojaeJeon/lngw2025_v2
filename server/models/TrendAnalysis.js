// server/models/TrendAnalysis.js

/**
 * TrendAnalysis 모델 정의 함수
 * @param {Sequelize} sequelize  – models/index.js에서 생성된 Sequelize 인스턴스
 * @param {DataTypes} DataTypes – Sequelize.DataTypes 객체
 */
module.exports = (sequelize, DataTypes) => {
  const TrendAnalysis = sequelize.define(
    "TrendAnalysis",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      growth: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("rising", "declining", "stable"),
        allowNull: false,
      },
      opportunity: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      risk: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      period: {
        type: DataTypes.ENUM("1h", "24h", "7d", "30d"),
        defaultValue: "24h",
      },
      confidence: {
        type: DataTypes.FLOAT,
        defaultValue: 0.5,
      },
    },
    {
      tableName: "trend_analyses",
      timestamps: true,
      underscored: false, // snake_case 컬럼을 사용하려면 활성화
    },
  );

  return TrendAnalysis;
};
