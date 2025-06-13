
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_activities', {
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
      type: {
        type: Sequelize.ENUM('미팅', '통화', '이메일', '방문', '기타'),
        allowNull: false,
        comment: '활동 유형'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '활동 제목'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '활동 설명'
      },
      activityDate: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '활동 일시'
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '소요 시간'
      },
      participants: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: '참석자 목록'
      },
      result: {
        type: Sequelize.ENUM('성공', '완료', '해결', '발송완료', '진행중', '실패', '취소'),
        allowNull: false,
        defaultValue: '진행중',
        comment: '결과'
      },
      nextAction: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '다음 액션'
      },
      attachments: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: '첨부파일 목록'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        comment: '작성자 ID'
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

    // 인덱스 추가
    await queryInterface.addIndex('customer_activities', ['customerId']);
    await queryInterface.addIndex('customer_activities', ['type']);
    await queryInterface.addIndex('customer_activities', ['activityDate']);
    await queryInterface.addIndex('customer_activities', ['createdBy']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_activities');
  }
};
