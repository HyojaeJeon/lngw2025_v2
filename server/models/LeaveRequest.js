
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LeaveRequest = sequelize.define('LeaveRequest', {
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
    type: {
      type: DataTypes.ENUM('ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY', 'PATERNITY', 'BEREAVEMENT', 'UNPAID'),
      allowNull: false,
      comment: '휴가유형',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '휴가시작일',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '휴가종료일',
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '휴가일수',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '휴가사유',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
      defaultValue: 'PENDING',
      comment: '승인상태',
    },
    approverId: {
      type: DataTypes.UUID,
      references: {
        model: 'employees',
        key: 'id',
      },
      comment: '승인자 ID',
    },
    approvedAt: {
      type: DataTypes.DATE,
      comment: '승인일시',
    },
    comments: {
      type: DataTypes.TEXT,
      comment: '승인/반려 사유',
    },
  }, {
    tableName: 'leave_requests',
    timestamps: true,
    indexes: [
      {
        fields: ['employeeId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['startDate', 'endDate'],
      },
    ],
  });

  LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee',
    });

    LeaveRequest.belongsTo(models.Employee, {
      foreignKey: 'approverId',
      as: 'approver',
    });
  };

  return LeaveRequest;
};
