"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Product 테이블에 인센티브 필드 추가
    await queryInterface.addColumn("products", "incentiveA", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "인센티브 A",
    });

    await queryInterface.addColumn("products", "incentiveB", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "인센티브 B",
    });

    // ProductModel 테이블에 인센티브 필드 추가
    await queryInterface.addColumn("product_models", "incentiveA", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "인센티브 A",
    });

    await queryInterface.addColumn("product_models", "incentiveB", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "인센티브 B",
    });

    // SalesItem 테이블에 새로운 필드들 추가
    await queryInterface.addColumn("sales_items", "salesItemCode", {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: "매출 항목 코드",
    });

    await queryInterface.addColumn("sales_items", "productIncentiveA", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "제품별 인센티브 A (개별 수정 가능)",
    });

    await queryInterface.addColumn("sales_items", "productIncentiveB", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "제품별 인센티브 B (개별 수정 가능)",
    });

    await queryInterface.addColumn("sales_items", "originalUnitCost", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      comment: "제품 기본 원가 (Product/ProductModel에서 가져온 값)",
    });

    await queryInterface.addColumn("sales_items", "adjustedUnitCost", {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      comment: "조정된 단위 원가 (사용자가 수정 가능)",
    });
  },

  async down(queryInterface, Sequelize) {
    // SalesItem 테이블에서 필드 제거
    await queryInterface.removeColumn("sales_items", "adjustedUnitCost");
    await queryInterface.removeColumn("sales_items", "originalUnitCost");
    await queryInterface.removeColumn("sales_items", "productIncentiveB");
    await queryInterface.removeColumn("sales_items", "productIncentiveA");
    await queryInterface.removeColumn("sales_items", "salesItemCode");

    // ProductModel 테이블에서 인센티브 필드 제거
    await queryInterface.removeColumn("product_models", "incentiveB");
    await queryInterface.removeColumn("product_models", "incentiveA");

    // Product 테이블에서 인센티브 필드 제거
    await queryInterface.removeColumn("products", "incentiveB");
    await queryInterface.removeColumn("products", "incentiveA");
  },
};
