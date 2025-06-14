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
    await db.SalesRep.destroy({ where: {}, force: true });

    console.log("✅ 기존 데이터 삭제 완료");

    // 시드 데이터 생성
    console.log("📝 시드 데이터 생성 중...");

    // 1. 영업사원 생성
    const salesReps = await db.SalesRep.bulkCreate([
      { name: "김철수", email: "kim@test.com", phone: "010-1111-1111", department: "영업1팀" },
      { name: "이영희", email: "lee@test.com", phone: "010-2222-2222", department: "영업2팀" },
      { name: "박민수", email: "park@test.com", phone: "010-3333-3333", department: "영업1팀" },
    ]);
    console.log("✅ 영업사원 생성 완료");

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
    console.log("✅ 제품 생성 완료");

    // 5. 제품 모델 생성
    const productModels = await db.ProductModel.bulkCreate([
      {
        productId: products[0].id,
        name: "S24 256GB",
        modelName: "SM-S921N",
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
        cost: 900000,
        consumerPrice: 1300000,
        incentiveA: 60000,
        incentiveB: 40000,
        isActive: true,
      },
    ]);
    console.log("✅ 제품 모델 생성 완료");

    // 6. 매출 데이터 생성
    const salesItems = await db.SalesItem.bulkCreate([
      {
        salesRepId: salesReps[0].id,
        customerId: customers[0].id,
        categoryId: categories[2].id,
        productId: products[0].id,
        productModelId: productModels[0].id,
        productName: "삼성 갤럭시 S24 256GB",
        salesItemCode: "SALE-2024-001",
        type: "SALES",
        quantity: 2,
        unitPrice: 1150000,
        totalPrice: 2300000,
        originalUnitCost: 800000,
        adjustedUnitCost: 800000,
        shippingCost: 10000,
        otherCosts: 5000,
        discountRate: 4.17, // (1200000-1150000)/1200000*100
        consumerPrice: 1200000,
        paymentStatus: "PAID",
        productIncentiveA: 50000,
        productIncentiveB: 30000,
        salesDate: new Date("2024-06-10"),
        finalMargin: 335000, // (1150000 - 800000 - 10000 - 5000) * 2 = 670000
        marginRate: 29.13, // 335000/1150000*100
      },
      {
        salesRepId: salesReps[1].id,
        customerId: customers[1].id,
        categoryId: categories[2].id,
        productId: products[1].id,
        productModelId: productModels[2].id,
        productName: "애플 아이폰 15 128GB",
        salesItemCode: "SALE-2024-002",
        type: "SALES",
        quantity: 1,
        unitPrice: 1250000,
        totalPrice: 1250000,
        originalUnitCost: 900000,
        adjustedUnitCost: 900000,
        shippingCost: 15000,
        otherCosts: 0,
        discountRate: 3.85, // (1300000-1250000)/1300000*100
        consumerPrice: 1300000,
        paymentStatus: "PARTIAL_PAID",
        productIncentiveA: 60000,
        productIncentiveB: 40000,
        salesDate: new Date("2024-06-12"),
        finalMargin: 335000, // 1250000 - 900000 - 15000
        marginRate: 26.8, // 335000/1250000*100
      },
      {
        salesRepId: salesReps[2].id,
        customerId: customers[2].id,
        categoryId: categories[1].id,
        productId: products[2].id,
        productName: "삼성 노트북 Pro",
        salesItemCode: "SALE-2024-003",
        type: "QUOTE",
        quantity: 5,
        unitPrice: 1700000,
        totalPrice: 8500000,
        originalUnitCost: 1200000,
        adjustedUnitCost: 1180000,
        shippingCost: 20000,
        otherCosts: 10000,
        discountRate: 5.56, // (1800000-1700000)/1800000*100
        consumerPrice: 1800000,
        paymentStatus: "UNPAID",
        productIncentiveA: 80000,
        productIncentiveB: 50000,
        salesDate: new Date("2024-06-14"),
        finalMargin: 490000, // 1700000 - 1180000 - 20000 - 10000
        marginRate: 28.82, // 490000/1700000*100
      },
    ]);
    console.log("✅ 매출 데이터 생성 완료");

    // 최종 카운트 확인
    const finalCounts = {
      salesReps: await db.SalesRep.count(),
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
