
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: '프로필 이미지 URL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatar');
  }
};
