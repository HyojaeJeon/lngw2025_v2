
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PerformanceEvaluation = sequelize.define('PerformanceEvaluation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    evaluatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '평가기간',
    },
    overallRating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      comment: '종합평점',
    },
    strengths: {
      type: DataTypes.TEXT,
      comment: '강점',
    },
    improvements: {
      type: DataTypes.TEXT,
      comment: '개선사항',
    },
    comments: {
      type: DataTypes.TEXT,
      comment: '종합의견',
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'REVIEWED', 'COMPLETED'),
      defaultValue: 'DRAFT',
      comment: '평가상태',
    },
  }, {
    tableName: 'performance_evaluations',
    timestamps: true,
    indexes: [
      {
        fields: ['employeeId'],
      },
      {
        fields: ['evaluatorId'],
      },
      {
        fields: ['period'],
      },
      {
        fields: ['status'],
      },
    ],
  });

  PerformanceEvaluation.associate = (models) => {
    PerformanceEvaluation.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee',
    });

    PerformanceEvaluation.belongsTo(models.Employee, {
      foreignKey: 'evaluatorId',
      as: 'evaluator',
    });

    PerformanceEvaluation.hasMany(models.EvaluationGoal, {
      foreignKey: 'evaluationId',
      as: 'goals',
    });
  };

  return PerformanceEvaluation;
};
