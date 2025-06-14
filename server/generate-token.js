const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const models = require("./models");

const JWT_SECRET = "lngw2025_super_secret_key_for_jwt_tokens_2024_strict";

async function generateNewToken() {
  try {
    console.log("🔐 새 JWT 토큰 생성 중...");

    // 기존 사용자 조회
    let user = await models.User.findOne({ where: { email: "test@example.com" } });

    if (!user) {
      console.log("👤 테스트 사용자 생성 중...");
      const hashedPassword = await bcrypt.hash("test123456", 12);

      user = await models.User.create({
        email: "test@example.com",
        password: hashedPassword,
        name: "테스트",
        role: "admin",
      });

      console.log("✅ 테스트 사용자 생성 완료:", user.id);
    } else {
      console.log("✅ 기존 테스트 사용자 발견:", user.id);
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("🎯 새 JWT 토큰 생성 완료:");
    console.log("Bearer " + token);

    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ 토큰 검증 성공:", {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      exp: new Date(decoded.exp * 1000).toLocaleString(),
    });

    return token;
  } catch (error) {
    console.error("❌ 토큰 생성 오류:", error);
  }
}

// 직접 실행시
if (require.main === module) {
  generateNewToken()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ 실행 실패:", error);
      process.exit(1);
    });
}

module.exports = { generateNewToken };
