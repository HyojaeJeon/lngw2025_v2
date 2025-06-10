
module.exports = (sequelize, DataTypes) => {
  const KeyResult = sequelize.define('KeyResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    objectiveId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'MarketingObjectives',
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
    targetValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currentValue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true,
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
    tableName: 'key_results',
    timestamps: true,
  });

  return KeyResult;
};
