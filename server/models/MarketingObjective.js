
module.exports = (sequelize, DataTypes) => {
  const MarketingObjective = sequelize.define('MarketingObjective', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'MarketingPlans',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('높음', '보통', '낮음'),
      defaultValue: '보통',
    },
    status: {
      type: DataTypes.ENUM('진행중', '완료', '지연', '중단됨'),
      defaultValue: '진행중',
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
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
    tableName: 'marketing_objectives',
    timestamps: true,
  });

  return MarketingObjective;
};
