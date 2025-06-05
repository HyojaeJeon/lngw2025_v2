// server/models/TrendingKeyword.js

/**
 * TrendingKeyword 모델 정의 함수
 * @param {Sequelize} sequelize  – models/index.js에서 생성된 Sequelize 인스턴스
 * @param {DataTypes} DataTypes – Sequelize.DataTypes 객체
 */
module.exports = (sequelize, DataTypes) => {
  const TrendingKeyword = sequelize.define(
    "TrendingKeyword",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      keyword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mentions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      growth: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      sentiment: {
        type: DataTypes.ENUM("positive", "neutral", "negative"),
        defaultValue: "neutral",
      },
      relatedKeywords: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      period: {
        type: DataTypes.ENUM("1h", "24h", "7d", "30d"),
        defaultValue: "24h",
      },
      source: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "trending_keywords",
      timestamps: true,
      underscored: false, // snake_case 컬럼명이 필요할 경우 활성화
      indexes: [
        {
          fields: ["keyword", "period"],
        },
        {
          fields: ["mentions"],
        },
      ],
    },
  );

  return TrendingKeyword;
};
