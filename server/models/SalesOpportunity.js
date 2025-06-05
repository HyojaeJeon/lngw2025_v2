
module.exports = (sequelize, DataTypes) => {
  const SalesOpportunity = sequelize.define(
    "SalesOpportunity",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "영업 기회 제목",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "상세 설명",
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "고객 ID",
      },
      assignedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "담당 영업사원 ID",
      },
      expectedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: "예상 금액",
      },
      stage: {
        type: DataTypes.ENUM(
          "lead",
          "qualified",
          "proposal",
          "negotiation",
          "closed_won",
          "closed_lost"
        ),
        defaultValue: "lead",
        comment: "영업 단계",
      },
      probability: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "성공 확률 (%)",
      },
      expectedCloseDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "예상 마감일",
      },
      actualCloseDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "실제 마감일",
      },
      source: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "소스 (웹사이트, 추천, 광고 등)",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "urgent"),
        defaultValue: "medium",
        comment: "우선순위",
      },
    },
    {
      tableName: "sales_opportunities",
      timestamps: true,
      underscored: false,
    }
  );

  SalesOpportunity.associate = (models) => {
    SalesOpportunity.belongsTo(models.User, {
      foreignKey: "assignedUserId",
      as: "assignedUser",
    });
  };

  return SalesOpportunity;
};
