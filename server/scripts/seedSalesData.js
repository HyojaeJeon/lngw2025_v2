/**
 * Seed script to create sample sales data for testing
 */

const { Sequelize } = require("sequelize");
const path = require("path");
const models = require("../models");

async function seedSalesData() {
  try {
    console.log("🌱 Starting to seed sales data...");

    const { User, Customer, Category, Product, ProductModel, SalesItem } = models; // Create sample sales reps (users)
    const salesRepData = [
      {
        name: "김영업",
        email: "kim.sales@company.com",
        password: "$2b$10$dummy.hash.for.testing", // In real app, hash properly
        role: "manager",
        department: "영업팀",
        isActive: true,
      },
      {
        name: "이판매",
        email: "lee.sales@company.com",
        password: "$2b$10$dummy.hash.for.testing",
        role: "editor",
        department: "영업팀",
        isActive: true,
      },
      {
        name: "박마케팅",
        email: "park.marketing@company.com",
        password: "$2b$10$dummy.hash.for.testing",
        role: "editor",
        department: "마케팅팀",
        isActive: true,
      },
    ];
    const salesReps = [];
    for (const repData of salesRepData) {
      const [rep] = await User.findOrCreate({
        where: { email: repData.email },
        defaults: repData,
      });
      salesReps.push(rep);
    }

    console.log("✅ Sales reps created"); // Create sample customers
    const customerData = [
      {
        name: "(주)테스트기업",
        contactName: "홍길동",
        email: "contact@testcompany.com",
        phone: "02-1234-5678",
        address: "서울시 강남구 테헤란로 123",
        status: "active",
      },
      {
        name: "샘플코퍼레이션",
        contactName: "김고객",
        email: "kim@samplecorp.com",
        phone: "02-2345-6789",
        address: "서울시 서초구 서초대로 456",
        status: "active",
      },
      {
        name: "데모엔터프라이즈",
        contactName: "이고객",
        email: "lee@demo.com",
        phone: "02-3456-7890",
        address: "경기도 성남시 분당구 판교로 789",
        status: "active",
      },
    ];

    const customers = [];
    for (const custData of customerData) {
      const [customer] = await Customer.findOrCreate({
        where: { email: custData.email },
        defaults: custData,
      });
      customers.push(customer);
    }

    console.log("✅ Customers created"); // Create sample categories
    const categories = await Category.bulkCreate([
      {
        code: "electronics",
        names: { ko: "전자제품", en: "Electronics", vi: "Điện tử" },
        descriptions: { ko: "전자제품 카테고리", en: "Electronics category", vi: "Danh mục điện tử" },
        isActive: true,
      },
      {
        code: "computers",
        names: { ko: "컴퓨터", en: "Computers", vi: "Máy tính" },
        descriptions: { ko: "컴퓨터 및 주변기기", en: "Computers and peripherals", vi: "Máy tính và thiết bị ngoại vi" },
        isActive: true,
      },
      {
        code: "smartphones",
        names: { ko: "스마트폰", en: "Smartphones", vi: "Điện thoại thông minh" },
        descriptions: { ko: "스마트폰 및 액세서리", en: "Smartphones and accessories", vi: "Điện thoại thông minh và phụ kiện" },
        isActive: true,
      },
    ]);

    console.log("✅ Categories created"); // Create sample products
    const products = await Product.bulkCreate([
      {
        name: "노트북",
        code: "LAPTOP-001",
        description: "고성능 노트북",
        price: 800000,
        consumerPrice: 1200000,
        categoryId: categories[1].id,
        incentiveA: 50000,
        incentiveB: 30000,
        isActive: true,
      },
      {
        name: "스마트폰",
        code: "PHONE-001",
        description: "최신 스마트폰",
        price: 600000,
        consumerPrice: 900000,
        categoryId: categories[2].id,
        incentiveA: 40000,
        incentiveB: 25000,
        isActive: true,
      },
      {
        name: "태블릿",
        code: "TABLET-001",
        description: "프리미엄 태블릿",
        price: 400000,
        consumerPrice: 650000,
        categoryId: categories[0].id,
        incentiveA: 30000,
        incentiveB: 20000,
        isActive: true,
      },
    ]);

    console.log("✅ Products created"); // Create sample product models
    const productModels = await ProductModel.bulkCreate([
      {
        modelName: "노트북 프로",
        modelCode: "LP-PRO-001",
        description: "프로 모델",
        price: 850000,
        consumerPrice: 1300000,
        productId: products[0].id,
        incentiveA: 55000,
        incentiveB: 35000,
        isActive: true,
      },
      {
        modelName: "노트북 스탠다드",
        modelCode: "LP-STD-001",
        description: "스탠다드 모델",
        price: 750000,
        consumerPrice: 1100000,
        productId: products[0].id,
        incentiveA: 45000,
        incentiveB: 25000,
        isActive: true,
      },
      {
        modelName: "스마트폰 128GB",
        modelCode: "PH-128-001",
        description: "128GB 모델",
        price: 650000,
        consumerPrice: 950000,
        productId: products[1].id,
        incentiveA: 45000,
        incentiveB: 28000,
        isActive: true,
      },
    ]);

    console.log("✅ Product models created");

    // Create sample sales items
    const salesItems = await SalesItem.bulkCreate([
      {
        salesDate: new Date("2024-06-10"),
        type: "SALE",
        quantity: 2,
        unitPrice: 1200000,
        salesPrice: 1150000,
        totalPrice: 2300000,
        cost: 800000,
        totalCost: 1600000,
        margin: 350000,
        totalMargin: 700000,
        finalMargin: 700000,
        marginRate: 30.43,
        paymentStatus: "PAID",
        paidAmount: 2300000,
        salesItemCode: "SI-20240610-001",
        productIncentiveA: 50000,
        productIncentiveB: 30000,
        originalUnitCost: 800000,
        adjustedUnitCost: 800000,
        shippingCost: 0,
        otherCosts: 0,
        notes: "프로모션 할인 적용",
        salesRepId: salesReps[0].id,
        customerId: customers[0].id,
        categoryId: categories[1].id,
        productId: products[0].id,
        productModelId: productModels[0].id,
      },
      {
        salesDate: new Date("2024-06-12"),
        type: "SALE",
        quantity: 1,
        unitPrice: 900000,
        salesPrice: 900000,
        totalPrice: 900000,
        cost: 600000,
        totalCost: 600000,
        margin: 300000,
        totalMargin: 300000,
        finalMargin: 300000,
        marginRate: 33.33,
        paymentStatus: "PARTIAL_PAID",
        paidAmount: 450000,
        salesItemCode: "SI-20240612-001",
        productIncentiveA: 40000,
        productIncentiveB: 25000,
        originalUnitCost: 600000,
        adjustedUnitCost: 600000,
        shippingCost: 10000,
        otherCosts: 5000,
        notes: "온라인 주문",
        salesRepId: salesReps[1].id,
        customerId: customers[1].id,
        categoryId: categories[2].id,
        productId: products[1].id,
        productModelId: productModels[2].id,
      },
      {
        salesDate: new Date("2024-06-14"),
        type: "SALE",
        quantity: 3,
        unitPrice: 650000,
        salesPrice: 620000,
        totalPrice: 1860000,
        cost: 400000,
        totalCost: 1200000,
        margin: 220000,
        totalMargin: 660000,
        finalMargin: 660000,
        marginRate: 35.48,
        paymentStatus: "UNPAID",
        paidAmount: 0,
        salesItemCode: "SI-20240614-001",
        productIncentiveA: 30000,
        productIncentiveB: 20000,
        originalUnitCost: 400000,
        adjustedUnitCost: 400000,
        shippingCost: 15000,
        otherCosts: 0,
        notes: "리셀러 대량 주문",
        salesRepId: salesReps[2].id,
        customerId: customers[2].id,
        categoryId: categories[0].id,
        productId: products[2].id,
        productModelId: null,
      },
    ]);
    console.log("✅ Sales items created");
    console.log(`🎉 Seed completed! Created ${salesItems.length} sales items`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

// Run the seed script
if (require.main === module) {
  seedSalesData();
}

module.exports = seedSalesData;
