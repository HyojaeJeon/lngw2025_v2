
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AttendanceRecord = sequelize.define('AttendanceRecord', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '근무일',
    },
    checkIn: {
      type: DataTypes.TIME,
      comment: '출근시간',
    },
    checkOut: {
      type: DataTypes.TIME,
      comment: '퇴근시간',
    },
    breakStart: {
      type: DataTypes.TIME,
      comment: '휴게시작',
    },
    breakEnd: {
      type: DataTypes.TIME,
      comment: '휴게종료',
    },
    workHours: {
      type: DataTypes.DECIMAL(4, 2),
      comment: '근무시간',
    },
    overtimeHours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
      comment: '초과근무시간',
    },
    status: {
      type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'SICK_LEAVE', 'VACATION'),
      allowNull: false,
      defaultValue: 'PRESENT',
      comment: '출근상태',
    },
    notes: {
      type: DataTypes.TEXT,
      comment: '비고',
    },
  }, {
    tableName: 'attendance_records',
    timestamps: true,
    indexes: [
      {
        fields: ['employeeId', 'date'],
        unique: true,
      },
      {
        fields: ['date'],
      },
      {
        fields: ['status'],
      },
    ],
  });

  AttendanceRecord.associate = (models) => {
    AttendanceRecord.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee',
    });
  };

  return AttendanceRecord;
};
