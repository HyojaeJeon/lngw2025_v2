
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
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
      attendanceDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "근무일",
      },
      checkInTime: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: "출근시간",
      },
      checkOutTime: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: "퇴근시간",
      },
      breakStartTime: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: "휴게시작시간",
      },
      breakEndTime: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: "휴게종료시간",
      },
      overtimeHours: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        defaultValue: 0,
        comment: "연장근무시간",
      },
      workingHours: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        comment: "총 근무시간",
      },
      attendanceStatus: {
        type: DataTypes.ENUM(
          "정상출근",
          "지각",
          "조기퇴근",
          "결근",
          "휴가",
          "병가",
          "외근",
          "재택근무"
        ),
        allowNull: false,
        defaultValue: "정상출근",
        comment: "출근상태",
      },
      lateMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "지각시간(분)",
      },
      earlyLeaveMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "조기퇴근시간(분)",
      },
      checkInLocation: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "출근 위치",
      },
      checkOutLocation: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "퇴근 위치",
      },
      checkInIp: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: "출근 IP",
      },
      checkOutIp: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: "퇴근 IP",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "특이사항",
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
      tableName: "attendances",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["employeeId", "attendanceDate"],
        },
        {
          fields: ["attendanceDate"],
        },
        {
          fields: ["attendanceStatus"],
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

  Attendance.associate = function (models) {
    // Employee와의 관계
    Attendance.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
    });

    // 승인자와의 관계
    Attendance.belongsTo(models.Employee, {
      foreignKey: "approvedBy",
      as: "approver",
    });
  };

  return Attendance;
};
