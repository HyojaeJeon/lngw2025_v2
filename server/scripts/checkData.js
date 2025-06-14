const db = require('../models');
const { SalesItem, SalesRep, Customer, Product, Category, ProductModel, sequelize } = db;onst { sequelize, SalesItem, SalesRep, Customer, Product, Category, ProductModel } = require("../models");

async function checkData() {
  try {
    console.log("데이터베이스 연결 중...");
    await sequelize.authenticate();
    console.log("✅ 데이터베이스 연결 성공");

    // 각 테이블의 데이터 개수 확인
    const salesItemsCount = await SalesItem.count();
    const salesRepsCount = await SalesRep.count();
    const customersCount = await Customer.count();
    const productsCount = await Product.count();
    const categoriesCount = await Category.count();
    const productModelsCount = await ProductModel.count();

    console.log("\n📊 데이터베이스 테이블 현황:");
    console.log(`Sales Items: ${salesItemsCount}개`);
    console.log(`Sales Reps: ${salesRepsCount}개`);
    console.log(`Customers: ${customersCount}개`);
    console.log(`Products: ${productsCount}개`);
    console.log(`Categories: ${categoriesCount}개`);
    console.log(`Product Models: ${productModelsCount}개`);

    // 매출 데이터 샘플 확인
    if (salesItemsCount > 0) {
      console.log("\n📋 매출 데이터 샘플:");
      const sampleSalesItems = await SalesItem.findAll({
        limit: 3,
        include: [
          { model: SalesRep, as: "salesRep" },
          { model: Customer, as: "customer" },
          { model: Product, as: "product" },
          { model: ProductModel, as: "productModel" },
        ],
      });

      sampleSalesItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.salesItemCode || "N/A"} - ${item.productName} (${item.quantity}개) - ₩${item.totalPrice?.toLocaleString()}`);
      });
    }

    await sequelize.close();
    console.log("\n✅ 데이터 확인 완료");
  } catch (error) {
    console.error("❌ 오류:", error.message);
  }
}

checkData();
