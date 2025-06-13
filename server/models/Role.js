
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      englishName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        defaultValue: "bg-gray-500",
      },
      isSystem: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "시스템 기본 역할 여부",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "roles",
      timestamps: true,
      underscored: false,
    }
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "users",
    });

    Role.hasMany(models.RolePermission, {
      foreignKey: "roleId",
      as: "permissions",
    });
  };

  return Role;
};
