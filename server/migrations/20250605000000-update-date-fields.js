
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'birthDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    
    await queryInterface.changeColumn('users', 'joinDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'birthDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    
    await queryInterface.changeColumn('users', 'joinDate', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  }
};
