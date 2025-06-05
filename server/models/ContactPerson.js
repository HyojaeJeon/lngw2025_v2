
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContactPerson = sequelize.define('ContactPerson', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    tiktok: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'contact_persons',
    timestamps: true,
    underscored: true
  });

  ContactPerson.associate = function(models) {
    ContactPerson.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });
  };

  return ContactPerson;
};
