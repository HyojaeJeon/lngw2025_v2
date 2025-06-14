
module.exports = (sequelize, DataTypes) => {
  const Salary = sequelize.define(
    "Salary",
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
      payrollMonth: {
        type: DataTypes.STRING(7), // YYYY-MM 형식
        allowNull: false,
        comment: "급여월",
      },
      baseSalary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "기본급",
      },
      allowances: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "수당 내역 (식대, 교통비, 직책수당 등)",
      },
      totalAllowances: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
        comment: "총 수당",
      },
      overtimePay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
        comment: "연장근무수당",
      },
      bonuses: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "상여금 내역",
      },
      totalBonuses: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
        comment: "총 상여금",
      },
      grossSalary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "총 지급액 (세전)",
      },
      deductions: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "공제 내역 (국민연금, 건강보험, 고용보험, 소득세 등)",
      },
      totalDeductions: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
        comment: "총 공제액",
      },
      netSalary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "실지급액 (세후)",
      },
      workingDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "근무일수",
      },
      attendanceDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "출근일수",
      },
      absenceDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "결근일수",
      },
      overtimeHours: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
        defaultValue: 0,
        comment: "연장근무시간",
      },
      paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "지급일",
      },
      paymentStatus: {
        type: DataTypes.ENUM("계산중", "확정", "지급완료", "보류"),
        allowNull: false,
        defaultValue: "계산중",
        comment: "급여상태",
      },
      bankAccount: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "입금계좌",
      },
      bankName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "은행명",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "특이사항",
      },
      processedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        comment: "처리자",
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "처리일시",
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
      tableName: "salaries",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["employeeId", "payrollMonth"],
        },
        {
          fields: ["payrollMonth"],
        },
        {
          fields: ["paymentStatus"],
        },
        {
          fields: ["paymentDate"],
        },
        {
          fields: ["processedBy"],
        },
        {
          fields: ["isActive"],
        },
      ],
    }
  );

  Salary.associate = function (models) {
    // Employee와의 관계
    Salary.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
    });

    // 처리자와의 관계
    Salary.belongsTo(models.Employee, {
      foreignKey: "processedBy",
      as: "processor",
    });
  };

  return Salary;
};
