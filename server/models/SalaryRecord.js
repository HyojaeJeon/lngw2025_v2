
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SalaryRecord = sequelize.define('SalaryRecord', {
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
    baseSalary: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '기본급',
    },
    allowances: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: '수당',
    },
    deductions: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: '공제액',
    },
    overtime: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: '초과근무수당',
    },
    bonus: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: '상여금',
    },
    totalSalary: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: '총급여',
    },
    payPeriod: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '급여지급기간',
    },
    payDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '급여지급일',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PROCESSED', 'PAID', 'CANCELLED'),
      defaultValue: 'PENDING',
      comment: '급여상태',
    },
  }, {
    tableName: 'salary_records',
    timestamps: true,
    indexes: [
      {
        fields: ['employeeId'],
      },
      {
        fields: ['payPeriod'],
      },
      {
        fields: ['status'],
      },
    ],
  });

  SalaryRecord.associate = (models) => {
    SalaryRecord.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee',
    });
  };

  return SalaryRecord;
};
