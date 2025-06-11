module.exports = (sequelize, DataTypes) => {
  const ChecklistItem = sequelize.define('ChecklistItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    keyResultId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'key_results',
        key: 'id',
      },
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'checklist_items',
    timestamps: true,
  });

  ChecklistItem.associate = (models) => {
    ChecklistItem.belongsTo(models.KeyResult, {
      foreignKey: 'keyResultId',
      as: 'keyResult'
    });
  };

  return ChecklistItem;
};
