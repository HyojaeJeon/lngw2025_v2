
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    "Skill",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "기술명",
      },
      level: {
        type: DataTypes.ENUM("beginner", "intermediate", "advanced", "expert"),
        defaultValue: "intermediate",
        comment: "기술 수준",
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
      tableName: "skills",
      timestamps: true,
      underscored: false,
    },
  );

  return Skill;
};
