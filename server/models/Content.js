module.exports = (sequelize, DataTypes) => {
  const Content = sequelize.define(
    "Content",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      mediaType: {
        type: DataTypes.ENUM("text", "image", "video", "audio"),
        allowNull: false,
        defaultValue: "text",
      },
      mode: {
        type: DataTypes.ENUM("auto", "manual"),
        allowNull: false,
        defaultValue: "manual",
      },
      keywords: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "draft",
          "pending",
          "approved",
          "rejected",
          "scheduled",
          "published",
        ),
        allowNull: false,
        defaultValue: "draft",
      },
      platforms: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      aiGenerated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confidence: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          min: 0,
          max: 1,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "contents",
      timestamps: true,
      underscored: false,
    },
  );

  return Content;
};
