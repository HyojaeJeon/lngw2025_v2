module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "manager", "editor"),
        defaultValue: "editor",
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "직책",
      },
      employeeId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "임시번호",
      },
      joinDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "입사일",
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "전화번호",
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "주소",
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "국적",
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "생년월일",
      },
      visaStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "비자 상태",
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "프로필 이미지 URL",
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: false,
    }
  );

  User.associate = (models) => {
    // Experience와의 관계
    User.hasMany(models.Experience, {
      foreignKey: "userId",
      as: "experiences",
    });

    // Skill과의 관계
    User.hasMany(models.Skill, {
      foreignKey: "userId",
      as: "skills",
    });

    // EmergencyContact와의 관계
    User.hasMany(models.EmergencyContact, {
      foreignKey: "userId",
      as: "emergencyContact",
    });

    // Content와의 관계
    User.hasMany(models.Content, {
      foreignKey: "userId",
      as: "contents",
    });

    // Customer 관계 (User can have many customers assigned)
    User.hasMany(models.Customer, {
      foreignKey: "assignedUserId",
      as: "assignedCustomers",
    });

    // SalesOpportunity 관계
    User.hasMany(models.SalesOpportunity, {
      foreignKey: "assignedUserId",
      as: "assignedOpportunities",
    });

    // MarketingPlan 관계
    User.hasMany(models.MarketingPlan, {
      foreignKey: "userId",
      as: "marketingPlans",
    });

    // SalesItem 관계 (영업사원)
    User.hasMany(models.SalesItem, {
      foreignKey: "salesRepId",
      as: "salesItems",
    });

    // StockMovement 관계 (처리자/확인자)
    User.hasMany(models.StockMovement, {
      foreignKey: "processedBy",
      as: "processedMovements",
    });

    User.hasMany(models.StockMovement, {
      foreignKey: "confirmedBy",
      as: "confirmedMovements",
    });

    // Role 관계
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "userRole",
    });
  };

  return User;
};