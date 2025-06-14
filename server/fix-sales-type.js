const models = require("./models");

async function fixSalesType() {
  try {
    console.log("🔧 SalesItem type 수정 중...");

    // 기존 DIRECT를 SALE로 변경
    const [affectedRows] = await models.SalesItem.update({ type: "SALE" }, { where: { type: "DIRECT" } });

    console.log(`✅ ${affectedRows}개 항목의 type을 SALE로 변경완료`);

    // 확인
    const salesItems = await models.SalesItem.findAll({
      attributes: ["id", "type", "notes"],
      limit: 5,
    });

    console.log("📋 현재 매출 항목들:");
    salesItems.forEach((item) => {
      console.log(`- ID: ${item.id}, Type: ${item.type}, Notes: ${item.notes}`);
    });
  } catch (error) {
    console.error("❌ 수정 실패:", error);
  }
}

if (require.main === module) {
  fixSalesType().then(() => process.exit(0));
}

module.exports = { fixSalesType };
