const db = require("../models");

async function simpleSeed() {
  try {
    console.log("🔄 간단한 시드 데이터 생성...");

    // 기존 사용자 확인
    const users = await db.User.findAll({ limit: 5 });
    if (users.length === 0) {
      console.log("❌ 사용자가 없습니다. 먼저 사용자를 생성해주세요.");
      return;
    }

    // 고객사 생성
    const customer = await db.Customer.create({
      companyName: "ABC 전자",
      name: "홍길동",
      email: "hong@abc.com",
      phone: "02-1234-5678",
      address: "서울시 강남구",
    });
    console.log("✅ 고객사 생성 완료");

    // 카테고리 생성
    const category = await db.Category.create({
      code: "electronics",
      names: JSON.stringify({ ko: "전자제품", en: "Electronics" }),
      descriptions: JSON.stringify({ ko: "전자제품 카테고리", en: "Electronics category" }),
      sortOrder: 1,
      isActive: true,
    });
    console.log("✅ 카테고리 생성 완료");

    // 제품 생성
    const product = await db.Product.create({
      name: "삼성 갤럭시 S24",
      code: "SAMSUNG-S24",
      categoryId: category.id,
      cost: 800000,
      consumerPrice: 1200000,
      incentiveA: 50000,
      incentiveB: 30000,
      isActive: true,
    });
    console.log("✅ 제품 생성 완료");

    // 제품 모델 생성
    const productModel = await db.ProductModel.create({
      productId: product.id,
      name: "S24 256GB",
      modelName: "SM-S921N",
      modelCode: "SM-S921N-256",
      cost: 800000,
      consumerPrice: 1200000,
      incentiveA: 50000,
      incentiveB: 30000,
      isActive: true,
    });
    console.log("✅ 제품 모델 생성 완료");

    // 매출 데이터 생성 (최소한의 필드만)
    const salesItem = await db.SalesItem.create({
      salesRepId: users[0].id,
      customerId: customer.id,
      type: "SALE",
      salesDate: new Date("2024-06-10"),
      categoryId: category.id,
      productId: product.id,
      productModelId: productModel.id,
      quantity: 2,
      salesPrice: 1150000,
      unitPrice: 1150000,
      totalPrice: 2300000,
      cost: 800000,
      totalCost: 1600000,
      margin: 700000, // salesPrice - cost per unit = 1150000 - 800000 = 350000 * 2
      totalMargin: 700000,
      discountRate: 4.17,
      consumerPrice: 1200000,
      paymentStatus: "PAID",
      deliveryFee: 0,
      incentiveA: 0,
      incentiveB: 0,
      incentivePaid: 0,
      paidAmount: 0,
      shippingCost: 10000,
      otherCosts: 5000,
      salesItemCode: "SALE-2024-001",
      productIncentiveA: 50000,
      productIncentiveB: 30000,
      originalUnitCost: 800000,
      adjustedUnitCost: 800000,
      finalMargin: 670000,
      marginRate: 29.13,
      isActive: true,
    });
    console.log("✅ 매출 데이터 생성 완료");

    // 카운트 확인
    const counts = {
      users: await db.User.count(),
      customers: await db.Customer.count(),
      categories: await db.Category.count(),
      products: await db.Product.count(),
      productModels: await db.ProductModel.count(),
      salesItems: await db.SalesItem.count(),
    };

    console.log("\n📊 데이터 개수:");
    Object.entries(counts).forEach(([key, count]) => {
      console.log(`${key}: ${count}개`);
    });

    await db.sequelize.close();
    console.log("\n✅ 시드 데이터 생성 완료!");
  } catch (error) {
    console.error("❌ 오류:", error);
  }
}

simpleSeed();
