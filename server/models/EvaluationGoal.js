
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EvaluationGoal = sequelize.define('EvaluationGoal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    evaluationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'performance_evaluations',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '목표명',
    },
    description: {
      type: DataTypes.TEXT,
      comment: '목표설명',
    },
    targetValue: {
      type: DataTypes.STRING,
      comment: '목표치',
    },
    actualValue: {
      type: DataTypes.STRING,
      comment: '실제달성치',
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      comment: '평가점수',
    },
    weight: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 1.0,
      comment: '가중치',
    },
  }, {
    tableName: 'evaluation_goals',
    timestamps: true,
  });

  EvaluationGoal.associate = (models) => {
    EvaluationGoal.belongsTo(models.PerformanceEvaluation, {
      foreignKey: 'evaluationId',
      as: 'evaluation',
    });
  };

  return EvaluationGoal;
};
