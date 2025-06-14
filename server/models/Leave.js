
module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define(
    "Leave",
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
      leaveType: {
        type: DataTypes.ENUM(
          "연차",
          "반차",
          "병가",
          "경조사",
          "출산휴가",
          "육아휴직",
          "무급휴가",
          "공가",
          "기타"
        ),
        allowNull: false,
        comment: "휴가유형",
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "시작일",
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "종료일",
      },
      totalDays: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false,
        comment: "총 휴가일수",
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "휴가사유",
      },
      leaveStatus: {
        type: DataTypes.ENUM("신청", "승인", "반려", "취소"),
        allowNull: false,
        defaultValue: "신청",
        comment: "휴가상태",
      },
      appliedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "신청일시",
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
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "반려사유",
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "첨부파일 목록",
      },
      emergencyContact: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "긴급연락처",
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
      tableName: "leaves",
      timestamps: true,
      indexes: [
        {
          fields: ["employeeId"],
        },
        {
          fields: ["leaveType"],
        },
        {
          fields: ["startDate", "endDate"],
        },
        {
          fields: ["leaveStatus"],
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

  Leave.associate = function (models) {
    // Employee와의 관계
    Leave.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
    });

    // 승인자와의 관계
    Leave.belongsTo(models.Employee, {
      foreignKey: "approvedBy",
      as: "approver",
    });
  };

  return Leave;
};
