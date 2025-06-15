
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '사원번호',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '이름',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      comment: '이메일',
    },
    phone: {
      type: DataTypes.STRING,
      comment: '전화번호',
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '부서',
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '직책',
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '입사일',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'),
      defaultValue: 'ACTIVE',
      comment: '재직상태',
    },
    salary: {
      type: DataTypes.DECIMAL(15, 2),
      comment: '기본급',
    },
    managerId: {
      type: DataTypes.UUID,
      references: {
        model: 'employees',
        key: 'id',
      },
      comment: '상사 ID',
    },
    avatar: {
      type: DataTypes.TEXT,
      comment: '프로필 이미지',
    },
    address: {
      type: DataTypes.TEXT,
      comment: '주소',
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      comment: '생년월일',
    },
    emergencyContact: {
      type: DataTypes.JSON,
      comment: '비상연락처',
    },
  }, {
    tableName: 'employees',
    timestamps: true,
    indexes: [
      {
        fields: ['employeeId'],
        unique: true,
      },
      {
        fields: ['department'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['managerId'],
      },
    ],
  });

  Employee.associate = (models) => {
    // 자기 참조 관계 (매니저)
    Employee.belongsTo(models.Employee, {
      foreignKey: 'managerId',
      as: 'manager',
    });

    Employee.hasMany(models.Employee, {
      foreignKey: 'managerId',
      as: 'subordinates',
    });

    // 기존 모델들과의 관계만 유지
    if (models.Skill) {
      Employee.belongsToMany(models.Skill, {
        through: 'employee_skills',
        foreignKey: 'employeeId',
        otherKey: 'skillId',
        as: 'skills',
      });
    }

    if (models.EmergencyContact) {
      Employee.hasMany(models.EmergencyContact, {
        foreignKey: 'employeeId',
        as: 'emergencyContacts',
      });
    }

    if (models.Experience) {
      Employee.hasMany(models.Experience, {
        foreignKey: 'employeeId',
        as: 'experiences',
      });
    }

    // 새로 생성한 모델들과의 관계
    if (models.Attendance) {
      Employee.hasMany(models.Attendance, {
        foreignKey: 'employeeId',
        as: 'attendances',
      });
    }

    if (models.Leave) {
      Employee.hasMany(models.Leave, {
        foreignKey: 'employeeId',
        as: 'leaves',
      });
    }

    if (models.Evaluation) {
      Employee.hasMany(models.Evaluation, {
        foreignKey: 'employeeId',
        as: 'evaluations',
      });
    }

    if (models.Salary) {
      Employee.hasMany(models.Salary, {
        foreignKey: 'employeeId',
        as: 'salaries',
      });
    }
  };

  return Employee;
};
