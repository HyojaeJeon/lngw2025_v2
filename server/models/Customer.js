module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "고객사명",
      },
      contactName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "담당자명",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "이메일",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "전화번호",
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "업종",
      },
      companyType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "회사 유형",
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "고객 등급",
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "주소",
      },
      assignedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "담당 영업사원 ID",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "prospect"),
        defaultValue: "prospect",
        comment: "고객 상태",
      },  
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "프로필 이미지 URL",
      },

      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "페이스북 프로필",
      },
      tiktok: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "틱톡 프로필",
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "인스타그램 프로필",
      },
    },
    {
      tableName: "customers",
      timestamps: true,
      underscored: false,
    },
  );

  Customer.associate = (models) => {
    // User와의 관계 (담당 영업사원)
    Customer.belongsTo(models.User, {
      foreignKey: "assignedUserId",
      as: "assignedUser",
    });

    // ContactPerson과의 관계
    Customer.hasMany(models.ContactPerson, {
      foreignKey: "customerId",
      as: "contacts",
      onDelete: "CASCADE",
    });

    // CustomerImage와의 관계
    Customer.hasMany(models.CustomerImage, {
      foreignKey: "customerId",
      as: "facilityImages",
      onDelete: "CASCADE",
    });

    // SalesOpportunity와의 관계
    Customer.hasMany(models.SalesOpportunity, {
      foreignKey: "customerId",
      as: "opportunities",
    });

    // CustomerActivity와의 관계
    Customer.hasMany(models.CustomerActivity, {
      foreignKey: "customerId",
      as: "activities",
      onDelete: "CASCADE",
    });

    // SalesItem과의 관계
    Customer.hasMany(models.SalesItem, {
      foreignKey: "customerId",
      as: "salesItems",
    });

    // VOC와의 관계
    Customer.hasMany(models.Voc, {
      foreignKey: "customerId",
      as: "vocs",
      onDelete: "CASCADE",
    });
  };

  return Customer;
};
