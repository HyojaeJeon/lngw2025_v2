// server/models/ContentRecommendation.js

module.exports = (sequelize, DataTypes) => {
  const ContentRecommendation = sequelize.define(
    "ContentRecommendation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      trend: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      expectedEngagement: {
        type: DataTypes.ENUM("low", "medium", "high"),
        defaultValue: "medium",
      },
      difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        defaultValue: "medium",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        defaultValue: "medium",
      },

      trendAnalysisId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "trend_analyses", // ✅ 실제 테이블명 (underscore  복수형)
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "content_recommendations",
      timestamps: true,
      underscored: false,
    },
  );

  return ContentRecommendation;
};
