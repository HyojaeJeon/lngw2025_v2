'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: '카테고리 코드'
      },
      nameKo: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '한국어 이름'
      },
      nameVi: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '베트남어 이름'
      },
      nameEn: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '영어 이름'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '카테고리 설명'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: '활성 상태'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 인덱스 추가
    await queryInterface.addIndex('categories', ['code']);
    await queryInterface.addIndex('categories', ['isActive']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('categories');
  }
};