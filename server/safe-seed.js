const models = require("./models");

async function quickSeedSafe() {
  try {
    console.log("🚀 안전한 시드 데이터 추가...");

    // 카테고리 추가 (중복 확인)
    let category = await models.Category.findOne({ where: { code: "ELECTRONICS" } });
    if (!category) {
      category = await models.Category.create({
        code: "ELECTRONICS",
        names: {
          ko: "전자제품",
          en: "Electronics",
          vi: "Điện tử",
        },
        descriptions: {
          ko: "전자제품 카테고리",
          en: "Electronics category",
          vi: "Danh mục điện tử",
        },
        isActive: true,
      });
      console.log("✅ 카테고리 생성:", category.id);
    } else {
      console.log("ℹ️ 카테고리 이미 존재:", category.id);
    } // 고객 추가 (중복 확인)
    let customer = await models.Customer.findOne({ where: { email: "kim@samsung.com" } });
    if (!customer) {
      customer = await models.Customer.create({
        name: "삼성전자",
        contactName: "김철수",
        email: "kim@samsung.com",
        phone: "02-1234-5678",
        address: "서울시 강남구",
      });
      console.log("✅ 고객 생성:", customer.id);
    } else {
      console.log("ℹ️ 고객 이미 존재:", customer.id);
    } // 제품 추가 (중복 확인)
    let product = await models.Product.findOne({ where: { code: "SP-001" } });
    if (!product) {
      product = await models.Product.create({
        name: "스마트폰",
        code: "SP-001",
        categoryId: category.id,
        price: 1000000,
        description: "최신 스마트폰",
        isActive: true,
      });
      console.log("✅ 제품 생성:", product.id);
    } else {
      console.log("ℹ️ 제품 이미 존재:", product.id);
    }

    // 사용자 조회
    const user = await models.User.findByPk(1);
    if (!user) {
      console.log("❌ 사용자가 없습니다.");
      return;
    }
    console.log("ℹ️ 사용자 발견:", user.id, user.name);

    // 매출 항목 개수 확인
    const existingSalesCount = await models.SalesItem.count({
      where: { isActive: true },
    });
    console.log("ℹ️ 기존 매출 항목 개수:", existingSalesCount);

    if (existingSalesCount === 0) {
      // 매출 항목 추가
      const salesItem = await models.SalesItem.create({
        salesRepId: user.id,
        customerId: customer.id,
        categoryId: category.id,
        productId: product.id,
        quantity: 10,
        unitPrice: 1000000,
        salesPrice: 1000000,
        totalPrice: 10000000,
        cost: 800000,
        totalCost: 8000000,
        margin: 200000,
        totalMargin: 2000000,
        finalMargin: 2000000,
        marginRate: 20.0,
        salesDate: new Date(),
        paymentStatus: "PAID",
        type: "SALE",
        notes: "테스트 매출",
        isActive: true,
        discountRate: 0,
        deliveryFee: 0,
        incentiveA: 0,
        incentiveB: 0,
        incentivePaid: false,
        paidAmount: 10000000,
      });
      console.log("✅ 매출 항목 생성:", salesItem.id);
    } else {
      console.log("ℹ️ 매출 항목 이미 존재:", existingSalesCount, "개");
    } // 최종 데이터 확인
    const finalCounts = {
      categories: await models.Category.count({ where: { isActive: true } }),
      customers: await models.Customer.count(),
      products: await models.Product.count({ where: { isActive: true } }),
      users: await models.User.count(),
      salesItems: await models.SalesItem.count({ where: { isActive: true } }),
    };

    console.log("📊 데이터베이스 현황:");
    console.log("  - 카테고리:", finalCounts.categories);
    console.log("  - 고객:", finalCounts.customers);
    console.log("  - 제품:", finalCounts.products);
    console.log("  - 사용자:", finalCounts.users);
    console.log("  - 매출 항목:", finalCounts.salesItems);

    console.log("🎉 안전한 시드 완료!");
  } catch (error) {
    console.error("❌ 시드 오류:", error);
  }
}

if (require.main === module) {
  quickSeedSafe().then(() => process.exit(0));
}

module.exports = { quickSeedSafe };
