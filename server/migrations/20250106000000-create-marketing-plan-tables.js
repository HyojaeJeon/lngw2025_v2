
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 마케팅 계획 테이블
    await queryInterface.createTable('marketing_plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      manager: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      targetPersona: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      coreMessage: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('계획됨', '진행중', '완료', '중단됨'),
        defaultValue: '계획됨'
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
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 마케팅 목표 테이블
    await queryInterface.createTable('marketing_objectives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      planId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'marketing_plans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      priority: {
        type: Sequelize.ENUM('높음', '보통', '낮음'),
        defaultValue: '보통'
      },
      status: {
        type: Sequelize.ENUM('진행중', '완료', '지연', '중단됨'),
        defaultValue: '진행중'
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 핵심 결과 테이블
    await queryInterface.createTable('key_results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      objectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'marketing_objectives',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      targetValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      currentValue: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      unit: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('진행중', '완료', '지연', '중단됨'),
        defaultValue: '진행중'
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 체크리스트 항목 테이블
    await queryInterface.createTable('checklist_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keyResultId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'key_results',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 인덱스 추가
    await queryInterface.addIndex('marketing_plans', ['userId']);
    await queryInterface.addIndex('marketing_plans', ['status']);
    await queryInterface.addIndex('marketing_objectives', ['planId']);
    await queryInterface.addIndex('key_results', ['objectiveId']);
    await queryInterface.addIndex('checklist_items', ['keyResultId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('checklist_items');
    await queryInterface.dropTable('key_results');
    await queryInterface.dropTable('marketing_objectives');
    await queryInterface.dropTable('marketing_plans');
  }
};
