
module.exports = (sequelize, DataTypes) => {
  const Voc = sequelize.define(
    "Voc",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "관련 고객사 ID",
      },
      contactPersonId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "관련 담당자 ID",
      },
      type: {
        type: DataTypes.ENUM("complaint", "inquiry", "request", "compliment", "other"),
        allowNull: false,
        defaultValue: "inquiry",
        comment: "VOC 유형",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "VOC 제목",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "VOC 상세 내용",
      },
      priority: {
        type: DataTypes.ENUM("high", "medium", "low"),
        allowNull: false,
        defaultValue: "medium",
        comment: "우선순위",
      },
      status: {
        type: DataTypes.ENUM("pending", "in_progress", "resolved", "closed"),
        allowNull: false,
        defaultValue: "pending",
        comment: "처리 상태",
      },
      assignedToId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "담당자 ID",
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "등록자 ID",
      },
      resolution: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "처리 결과",
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "해결 완료 일시",
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "첨부파일 목록",
      },
    },
    {
      tableName: "vocs",
      timestamps: true,
      underscored: false,
      indexes: [
        { fields: ['customerId'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['assignedToId'] },
        { fields: ['createdAt'] },
      ],
    }
  );

  Voc.associate = (models) => {
    // Customer와의 관계
    Voc.belongsTo(models.Customer, {
      foreignKey: "customerId",
      as: "customer",
    });

    // ContactPerson과의 관계
    Voc.belongsTo(models.ContactPerson, {
      foreignKey: "contactPersonId",
      as: "contactPerson",
    });

    // User와의 관계 (담당자)
    Voc.belongsTo(models.User, {
      foreignKey: "assignedToId",
      as: "assignedTo",
    });

    // User와의 관계 (등록자)
    Voc.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });
  };

  return Voc;
};
