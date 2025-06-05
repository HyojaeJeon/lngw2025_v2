
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create customer_images table
    await queryInterface.createTable('customer_images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '고객 ID'
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '이미지 URL'
      },
      imageType: {
        type: Sequelize.ENUM('facility', 'profile'),
        allowNull: false,
        defaultValue: 'facility',
        comment: '이미지 타입'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '이미지 설명'
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '정렬 순서'
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

    // Remove facilityImages column from customers table if it exists
    try {
      await queryInterface.removeColumn('customers', 'facilityImages');
    } catch (error) {
      // Column might not exist, ignore error
      console.log('facilityImages column does not exist or already removed');
    }

    // Add missing columns to customers table
    try {
      await queryInterface.addColumn('customers', 'customCompanyType', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '사용자 정의 회사 유형'
      });
    } catch (error) {
      console.log('customCompanyType column already exists');
    }

    try {
      await queryInterface.addColumn('customers', 'customGrade', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '사용자 정의 고객 등급'
      });
    } catch (error) {
      console.log('customGrade column already exists');
    }
  },

  async down(queryInterface, Sequelize) {
    // Drop customer_images table
    await queryInterface.dropTable('customer_images');

    // Add back facilityImages column to customers table
    await queryInterface.addColumn('customers', 'facilityImages', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: '시설 이미지 URLs (배열)'
    });

    // Remove added columns
    await queryInterface.removeColumn('customers', 'customCompanyType');
    await queryInterface.removeColumn('customers', 'customGrade');
  }
};
