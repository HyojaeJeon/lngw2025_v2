
module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define(
    "Evaluation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        comment: "직원 ID",
      },
      evaluatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        comment: "평가자 ID",
      },
      evaluationPeriod: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "평가기간 (예: 2025년 상반기)",
      },
      evaluationType: {
        type: DataTypes.ENUM("연간평가", "반기평가", "분기평가", "수습평가", "승진평가"),
        allowNull: false,
        comment: "평가유형",
      },
      evaluationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "평가일",
      },
      goals: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "목표 및 성과지표",
      },
      achievements: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "성취도 및 결과",
      },
      competencies: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "역량평가 항목별 점수",
      },
      overallRating: {
        type: DataTypes.ENUM("S", "A", "B", "C", "D"),
        allowNull: false,
        comment: "종합평가등급",
      },
      overallScore: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        comment: "종합점수",
      },
      strengths: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "강점",
      },
      areasForImprovement: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "개선점",
      },
      developmentPlan: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "성장계획",
      },
      evaluatorComments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "평가자 의견",
      },
      employeeComments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "피평가자 의견",
      },
      promotionRecommendation: {
        type: DataTypes.ENUM("적극추천", "추천", "보통", "비추천"),
        allowNull: true,
        comment: "승진추천",
      },
      salaryAdjustmentRecommendation: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: "급여조정 추천 (%)",
      },
      evaluationStatus: {
        type: DataTypes.ENUM("진행중", "완료", "승인대기", "승인완료"),
        allowNull: false,
        defaultValue: "진행중",
        comment: "평가상태",
      },
      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        comment: "승인자",
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "승인일시",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "활성화 여부",
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
    },
    {
      tableName: "evaluations",
      timestamps: true,
      indexes: [
        {
          fields: ["employeeId"],
        },
        {
          fields: ["evaluatorId"],
        },
        {
          fields: ["evaluationPeriod"],
        },
        {
          fields: ["evaluationType"],
        },
        {
          fields: ["evaluationDate"],
        },
        {
          fields: ["overallRating"],
        },
        {
          fields: ["evaluationStatus"],
        },
        {
          fields: ["approvedBy"],
        },
        {
          fields: ["isActive"],
        },
      ],
    }
  );

  Evaluation.associate = function (models) {
    // Employee와의 관계 (피평가자)
    Evaluation.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
    });

    // Employee와의 관계 (평가자)
    Evaluation.belongsTo(models.Employee, {
      foreignKey: "evaluatorId",
      as: "evaluator",
    });

    // Employee와의 관계 (승인자)
    Evaluation.belongsTo(models.Employee, {
      foreignKey: "approvedBy",
      as: "approver",
    });
  };

  return Evaluation;
};
