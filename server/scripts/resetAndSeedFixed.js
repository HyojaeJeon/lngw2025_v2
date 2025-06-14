const db = require("../models");

async function resetAndSeed() {
  try {
    console.log("🔄 데이터베이스 초기화 중...");

    // 테이블 순서를 고려하여 삭제 (외래키 관계 때문에)
    await db.SalesItem.destroy({ where: {}, force: true });
    await db.ProductModel.destroy({ where: {}, force: true });
    await db.Product.destroy({ where: {}, force: true });
    await db.Category.destroy({ where: {}, force: true });
    await db.Customer.destroy({ where: {}, force: true });
    // User 테이블은 건드리지 않음 (기존 사용자 계정 보호)

    console.log("✅ 기존 데이터 삭제 완료");

    // 시드 데이터 생성
    console.log("📝 시드 데이터 생성 중...");

    // 1. 기존 사용자 확인 또는 생성 (영업사원 역할)
    const [salesRep1] = await db.User.findOrCreate({
      where: { email: "kim@test.com" },
      defaults: {
        name: "김철수",
        email: "kim@test.com",
        password: "hashedpassword",
        role: "editor",
        department: "영업1팀",
        phone: "010-1111-1111",
      },
    });

    const [salesRep2] = await db.User.findOrCreate({
      where: { email: "lee@test.com" },
      defaults: {
        name: "이영희",
        email: "lee@test.com",
        password: "hashedpassword",
        role: "editor",
        department: "영업2팀",
        phone: "010-2222-2222",
      },
    });

    const [salesRep3] = await db.User.findOrCreate({
      where: { email: "park@test.com" },
      defaults: {
        name: "박민수",
        email: "park@test.com",
        password: "hashedpassword",
        role: "editor",
        department: "영업1팀",
        phone: "010-3333-3333",
      },
    });

    const salesReps = [salesRep1, salesRep2, salesRep3];
    console.log("✅ 영업사원(User) 확인 완료");

    // 2. 고객사 생성
    const customers = await db.Customer.bulkCreate([
      {
        companyName: "ABC 전자",
        name: "홍길동",
        email: "hong@abc.com",
        phone: "02-1234-5678",
        address: "서울시 강남구",
      },
      {
        companyName: "XYZ 테크",
        name: "김영수",
        email: "kim@xyz.com",
        phone: "02-2345-6789",
        address: "서울시 서초구",
      },
      {
        companyName: "123 솔루션",
        name: "박정희",
        email: "park@123.com",
        phone: "02-3456-7890",
        address: "서울시 종로구",
      },
    ]);
    console.log("✅ 고객사 생성 완료");

    // 3. 카테고리 생성
    const categories = await db.Category.bulkCreate([
      {
        code: "electronics",
        names: JSON.stringify({ ko: "전자제품", en: "Electronics" }),
        descriptions: JSON.stringify({ ko: "전자제품 카테고리", en: "Electronics category" }),
        sortOrder: 1,
        isActive: true,
      },
      {
        code: "computers",
        names: JSON.stringify({ ko: "컴퓨터", en: "Computers" }),
        descriptions: JSON.stringify({ ko: "컴퓨터 및 주변기기", en: "Computers and peripherals" }),
        sortOrder: 2,
        isActive: true,
      },
      {
        code: "smartphones",
        names: JSON.stringify({ ko: "스마트폰", en: "Smartphones" }),
        descriptions: JSON.stringify({ ko: "스마트폰 및 액세서리", en: "Smartphones and accessories" }),
        sortOrder: 3,
        isActive: true,
      },
    ]);
    console.log("✅ 카테고리 생성 완료");

    // 4. 제품 생성
    const products = await db.Product.bulkCreate([
      {
        name: "삼성 갤럭시 S24",
        code: "SAMSUNG-S24",
        categoryId: categories[2].id, // smartphones
        cost: 800000,
        consumerPrice: 1200000,
        incentiveA: 50000,
        incentiveB: 30000,
        isActive: true,
      },
      {
        name: "애플 아이폰 15",
        code: "APPLE-IP15",
        categoryId: categories[2].id, // smartphones
        cost: 900000,
        consumerPrice: 1300000,
        incentiveA: 60000,
        incentiveB: 40000,
        isActive: true,
      },
      {
        name: "삼성 노트북",
        code: "SAMSUNG-LAPTOP",
        categoryId: categories[1].id, // computers
        cost: 1200000,
        consumerPrice: 1800000,
        incentiveA: 80000,
        incentiveB: 50000,
        isActive: true,
      },
    ]);
    console.log("✅ 제품 생성 완료"); // 5. 제품 모델 생성
    const productModels = await db.ProductModel.bulkCreate([
      {
        productId: products[0].id,
        name: "S24 256GB",
        modelName: "SM-S921N",
        modelCode: "SM-S921N-256",
        cost: 800000,
        consumerPrice: 1200000,
        incentiveA: 50000,
        incentiveB: 30000,
        isActive: true,
      },
      {
        productId: products[0].id,
        name: "S24 512GB",
        modelName: "SM-S921N-512",
        modelCode: "SM-S921N-512",
        cost: 850000,
        consumerPrice: 1300000,
        incentiveA: 55000,
        incentiveB: 35000,
        isActive: true,
      },
      {
        productId: products[1].id,
        name: "iPhone 15 128GB",
        modelName: "A3092",
        modelCode: "A3092-128",
        cost: 900000,
        consumerPrice: 1300000,
        incentiveA: 60000,
        incentiveB: 40000,
        isActive: true,
      },
    ]);
    console.log("✅ 제품 모델 생성 완료"); // 6. 매출 데이터 생성
    const salesItems = await db.SalesItem.bulkCreate([
      {
        salesRepId: salesReps[0].id,
        customerId: customers[0].id,
        categoryId: categories[2].id,
        productId: products[0].id,
        productModelId: productModels[0].id,
        productName: "삼성 갤럭시 S24 256GB",
        salesItemCode: "SALE-2024-001",
        type: "SALE",
        quantity: 2,
        salesPrice: 1150000,
        unitPrice: 1150000,
        totalPrice: 2300000,
        cost: 800000,
        totalCost: 1600000,
        margin: 350000, // salesPrice - cost = 1150000 - 800000
        totalMargin: 700000, // margin * quantity = 350000 * 2
        originalUnitCost: 800000,
        adjustedUnitCost: 800000,
        shippingCost: 10000,
        otherCosts: 5000,
        discountRate: 4.17,
        consumerPrice: 1200000,
        paymentStatus: "PAID",
        productIncentiveA: 50000,
        productIncentiveB: 30000,
        salesDate: new Date("2024-06-10"),
        finalMargin: 670000,
        marginRate: 29.13,
      },
      {
        salesRepId: salesReps[1].id,
        customerId: customers[1].id,
        categoryId: categories[2].id,
        productId: products[1].id,
        productModelId: productModels[2].id,
        productName: "애플 아이폰 15 128GB",
        salesItemCode: "SALE-2024-002",
        type: "SALE",
        quantity: 1,
        salesPrice: 1250000,
        unitPrice: 1250000,
        totalPrice: 1250000,
        cost: 900000,
        totalCost: 900000,
        margin: 350000, // salesPrice - cost = 1250000 - 900000
        totalMargin: 350000, // margin * quantity = 350000 * 1
        originalUnitCost: 900000,
        adjustedUnitCost: 900000,
        shippingCost: 15000,
        otherCosts: 0,
        discountRate: 3.85,
        consumerPrice: 1300000,
        paymentStatus: "PARTIAL_PAID",
        productIncentiveA: 60000,
        productIncentiveB: 40000,
        salesDate: new Date("2024-06-12"),
        finalMargin: 335000,
        marginRate: 26.8,
      },
      {
        salesRepId: salesReps[2].id,
        customerId: customers[2].id,
        categoryId: categories[1].id,
        productId: products[2].id,
        productName: "삼성 노트북 Pro",
        salesItemCode: "SALE-2024-003",
        type: "SALE",
        quantity: 5,
        salesPrice: 1700000,
        unitPrice: 1700000,
        totalPrice: 8500000,
        cost: 1180000,
        totalCost: 5900000,
        margin: 520000, // salesPrice - cost = 1700000 - 1180000
        totalMargin: 2600000, // margin * quantity = 520000 * 5
        originalUnitCost: 1200000,
        adjustedUnitCost: 1180000,
        shippingCost: 20000,
        otherCosts: 10000,
        discountRate: 5.56,
        consumerPrice: 1800000,
        paymentStatus: "UNPAID",
        productIncentiveA: 80000,
        productIncentiveB: 50000,
        salesDate: new Date("2024-06-14"),
        finalMargin: 2450000,
        marginRate: 28.82,
      },
    ]);
    console.log("✅ 매출 데이터 생성 완료");

    // 최종 카운트 확인
    const finalCounts = {
      users: await db.User.count(),
      customers: await db.Customer.count(),
      categories: await db.Category.count(),
      products: await db.Product.count(),
      productModels: await db.ProductModel.count(),
      salesItems: await db.SalesItem.count(),
    };

    console.log("\n📊 최종 데이터 개수:");
    Object.entries(finalCounts).forEach(([key, count]) => {
      console.log(`${key}: ${count}개`);
    });

    await db.sequelize.close();
    console.log("\n✅ 시드 데이터 생성 완료!");
  } catch (error) {
    console.error("❌ 오류:", error);
  }
}

resetAndSeed();
