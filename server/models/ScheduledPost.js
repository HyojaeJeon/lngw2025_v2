// server/models/ScheduledPost.js

module.exports = (sequelize, DataTypes) => {
  const ScheduledPost = sequelize.define(
    "ScheduledPost",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      contentId: {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
          model: "contents", // ✅ 실제 테이블명 (소문자 복수형)
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      scheduledTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mode: {
        type: DataTypes.ENUM("Auto", "Manual"),
        defaultValue: "Manual",
      },
      approvalStatus: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      scheduleStatus: {
        type: DataTypes.ENUM("scheduled", "posted", "failed", "cancelled"),
        defaultValue: "scheduled",
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "scheduled_posts",
      timestamps: true,
      underscored: false,
    },
  );

  return ScheduledPost;
};
