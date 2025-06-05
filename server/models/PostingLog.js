module.exports = (sequelize, DataTypes) => {
  const PostingLog = sequelize.define(
    "PostingLog",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      level: {
        type: DataTypes.ENUM("info", "warning", "error", "success"),
        allowNull: false,
        defaultValue: "info",
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      workerId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      component: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "contents",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM("pending", "success", "failed", "retry"),
        allowNull: false,
        defaultValue: "pending",
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "posting_logs",
      timestamps: true,
      underscored: false,
    },
  );

  return PostingLog;
};
