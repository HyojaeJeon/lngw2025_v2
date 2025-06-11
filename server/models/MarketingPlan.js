module.exports = (sequelize, DataTypes) => {
  const MarketingPlan = sequelize.define('MarketingPlan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    manager: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    targetPersona: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coreMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('계획됨', '진행중', '완료', '중단됨'),
      defaultValue: '계획됨',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'marketing_plans',
    timestamps: true,
  });

  MarketingPlan.associate = (models) => {
    MarketingPlan.hasMany(models.MarketingObjective, {
      foreignKey: 'planId',
      as: 'objectives'
    });
    MarketingPlan.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return MarketingPlan;
};
