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
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "비밀번호 (해시화됨)",
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
        comment: "비자연한자",
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: false,
    },
  );

  return User;
};