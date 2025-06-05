
module.exports = (sequelize, DataTypes) => {
  const EmergencyContact = sequelize.define(
    "EmergencyContact",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "비상연락처 이름",
      },
      relationship: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "관계",
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "전화번호",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "emergency_contacts",
      timestamps: true,
      underscored: false,
    },
  );

  return EmergencyContact;
};
