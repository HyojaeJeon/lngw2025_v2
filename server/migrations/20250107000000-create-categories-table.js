
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: '카테고리 코드'
      },
      names: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: '다국어 이름 {ko, vi, en}'
      },
      descriptions: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: '다국어 설명 {ko, vi, en}'
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: '상위 카테고리 ID'
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '카테고리 레벨'
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '정렬 순서'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '활성 상태'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 인덱스 생성
    await queryInterface.addIndex('categories', ['code'], {
      unique: true,
      name: 'categories_code_unique'
    });
    
    await queryInterface.addIndex('categories', ['parentId'], {
      name: 'categories_parent_id_index'
    });
    
    await queryInterface.addIndex('categories', ['level'], {
      name: 'categories_level_index'
    });
    
    await queryInterface.addIndex('categories', ['isActive'], {
      name: 'categories_is_active_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  }
};
