const models = require("./models");

async function recreateDatabase() {
  try {
    console.log("🔄 Recreating database with correct schema...");

    // 데이터베이스를 완전히 재생성
    await models.sequelize.sync({ force: true });
    console.log("✅ Database recreated with all tables");

    // users 테이블 스키마 확인
    console.log("🔍 Checking users table schema after recreation...");
    const schema = await models.sequelize.query("PRAGMA table_info(users);", {
      type: models.sequelize.QueryTypes.SELECT,
    });

    console.log("📋 New users table columns:");
    schema.forEach((col) => console.log(`- ${col.name}: ${col.type} (nullable: ${col.notnull === 0})`));

    // roleId 컬럼이 있는지 확인
    const hasRoleId = schema.some((col) => col.name === "roleId");
    console.log(`\n🔍 RoleId column exists: ${hasRoleId}`);

    if (hasRoleId) {
      console.log("✅ Database schema is correct!");
    } else {
      console.log("❌ RoleId column is still missing");
    }

    await models.sequelize.close();
    console.log("✅ Database recreation completed");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

recreateDatabase();
