const models = require("./models");
const bcrypt = require("bcryptjs");

async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...");

    // 데이터베이스 연결 테스트
    await models.sequelize.authenticate();
    console.log("✅ Database connection successful");

    // users 테이블 스키마 확인
    console.log("\n📋 Checking users table schema...");
    const usersSchema = await models.sequelize.query("PRAGMA table_info(users);", { type: models.sequelize.QueryTypes.SELECT });

    console.log("Users table columns:");
    usersSchema.forEach((col) => {
      console.log(`- ${col.name}: ${col.type} (nullable: ${col.notnull === 0})`);
    });

    // 기존 사용자 확인
    const userCount = await models.User.count();
    console.log(`\n👥 Existing users: ${userCount}`);

    if (userCount === 0) {
      console.log("\n🆕 Creating test user...");

      // 테스트 사용자 생성
      const hashedPassword = await bcrypt.hash("testpassword123", 12);

      const testUser = await models.User.create({
        email: "test@example.com",
        password: hashedPassword,
        name: "Test User",
        role: "editor",
        department: "Test Department",
      });

      console.log(`✅ Test user created with ID: ${testUser.id}`);
    } // 사용자 목록 확인
    const users = await models.User.findAll({
      attributes: ["id", "email", "name", "role"],
      limit: 5,
    });

    console.log("\n📝 Users in database:");
    users.forEach((user) => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
    });

    await models.sequelize.close();
    console.log("\n✅ Database test completed");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

testDatabase();
