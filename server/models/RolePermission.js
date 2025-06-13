
module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    "RolePermission",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      module: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "모듈명 (customers, products, etc.)",
      },
      canRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      canWrite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      canDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      canApprove: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      canSystemConfig: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "role_permissions",
      timestamps: true,
      underscored: false,
      indexes: [
        {
          unique: true,
          fields: ["roleId", "module"],
        },
      ],
    }
  );

  RolePermission.associate = (models) => {
    RolePermission.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });
  };

  return RolePermission;
};
