
module.exports = (sequelize, DataTypes) => {
  const CustomerActivity = sequelize.define(
    "CustomerActivity",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        comment: "고객 ID",
      },
      type: {
        type: DataTypes.ENUM("미팅", "통화", "이메일", "방문", "기타"),
        allowNull: false,
        comment: "활동 유형",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "활동 제목",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "활동 설명",
      },
      activityDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "활동 일시",
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "소요 시간",
      },
      participants: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "참석자 목록",
      },
      result: {
        type: DataTypes.ENUM("성공", "완료", "해결", "발송완료", "진행중", "실패", "취소"),
        allowNull: false,
        defaultValue: "진행중",
        comment: "결과",
      },
      nextAction: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "다음 액션",
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "첨부파일 목록",
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        comment: "작성자 ID",
      },
    },
    {
      tableName: "customer_activities",
      timestamps: true,
      underscored: false,
    },
  );

  CustomerActivity.associate = function(models) {
    CustomerActivity.belongsTo(models.Customer, {
      foreignKey: "customerId",
      as: "customer",
    });
    
    CustomerActivity.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });
  };

  return CustomerActivity;
};
