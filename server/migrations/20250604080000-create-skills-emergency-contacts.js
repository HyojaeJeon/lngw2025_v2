
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create skills table
    await queryInterface.createTable('skills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '기술명'
      },
      level: {
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
        defaultValue: 'intermediate',
        comment: '기술 수준'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Create emergency_contacts table
    await queryInterface.createTable('emergency_contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '비상연락처 이름'
      },
      relationship: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '관계'
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '전화번호'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Remove JSON columns from users table
    await queryInterface.removeColumn('users', 'skills');
    await queryInterface.removeColumn('users', 'emergencyContact');
  },

  async down(queryInterface, Sequelize) {
    // Drop the new tables
    await queryInterface.dropTable('skills');
    await queryInterface.dropTable('emergency_contacts');

    // Add back JSON columns to users table
    await queryInterface.addColumn('users', 'skills', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: '보유기술(Array 형태)/수정 형태'
    });

    await queryInterface.addColumn('users', 'emergencyContact', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: '비상연락처 (Array 형태)'
    });
  }
};
