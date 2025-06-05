// server/models/PlatformStat.js

/**
 * PlatformStat 모델 정의 함수
 * @param {Sequelize} sequelize  – models/index.js에서 생성된 Sequelize 인스턴스
 * @param {DataTypes} DataTypes – Sequelize.DataTypes 객체
 */
module.exports = (sequelize, DataTypes) => {
  const PlatformStat = sequelize.define(
    "PlatformStat",
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
      todayPosts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      successCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      failureCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      failureRate: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      lastError: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "error"),
        defaultValue: "active",
      },
    },
    {
      tableName: "platform_stats",
      timestamps: true,
      underscored: false, // snake_case 컬럼명을 사용하려면 활성화
    },
  );

  return PlatformStat;
};
