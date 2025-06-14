const models = require("./models");

async function quickSeed() {
  try {
    console.log("🚀 빠른 시드 데이터 추가..."); // 카테고리 추가
    const category = await models.Category.create({
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
    console.log("✅ 카테고리 추가:", category.id);

    // 고객 추가
    const customer = await models.Customer.create({
      companyName: "삼성전자",
      contactName: "김철수",
      email: "kim@samsung.com",
      phone: "02-1234-5678",
      address: "서울시 강남구",
      isActive: true,
    });
    console.log("✅ 고객 추가:", customer.id);

    // 제품 추가
    const product = await models.Product.create({
      name: "스마트폰",
      sku: "SP-001",
      categoryId: category.id,
      price: 1000000,
      description: "최신 스마트폰",
      isActive: true,
    });
    console.log("✅ 제품 추가:", product.id);

    // 사용자 조회
    const user = await models.User.findByPk(1);
    if (!user) {
      console.log("❌ 사용자가 없습니다.");
      return;
    }

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
      type: "DIRECT",
      notes: "테스트 매출",
      isActive: true,
      discountRate: 0,
      deliveryFee: 0,
      incentiveA: 0,
      incentiveB: 0,
      incentivePaid: false,
      paidAmount: 10000000,
    });
    console.log("✅ 매출 항목 추가:", salesItem.id);

    console.log("🎉 빠른 시드 완료!");
  } catch (error) {
    console.error("❌ 시드 오류:", error);
  }
}

if (require.main === module) {
  quickSeed().then(() => process.exit(0));
}

module.exports = { quickSeed };
