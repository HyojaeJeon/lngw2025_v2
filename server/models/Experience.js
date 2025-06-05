module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define(
    "Experience",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "회사명",
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "직책",
      },
      period: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "근무기간",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "업무 설명",
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
    },
    {
      tableName: "experiences",
      timestamps: true,
      underscored: false,
    },
  );

  return Experience;
};
