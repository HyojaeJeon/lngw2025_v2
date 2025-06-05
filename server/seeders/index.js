const models = require("../models");
const bcrypt = require("bcrypt");

const seedData = async () => {
  try {
    console.log("Starting database seed...");

    // 사용자 생성
    const users = await models.User.bulkCreate([
      {
        email: "admin@example.com",
        password: await bcrypt.hash("admin123456", 10),
        name: "관리자",
        role: "admin",
        department: "Marketing",
      },
      {
        email: "manager@example.com",
        password: await bcrypt.hash("manager123456", 10),
        name: "마케팅 매니저",
        role: "manager",
        department: "Marketing",
      },
      {
        email: "editor@example.com",
        password: await bcrypt.hash("editor123456", 10),
        name: "콘텐츠 에디터",
        role: "editor",
        department: "Marketing",
      },
    ]);

    // 트렌딩 키워드 생성
    await models.TrendingKeyword.bulkCreate([
      {
        keyword: "#여행",
        mentions: 12500,
        growth: 15.5,
        sentiment: "positive",
        period: "24h",
      },
      {
        keyword: "#뷰티",
        mentions: 9800,
        growth: 8.2,
        sentiment: "positive",
        period: "24h",
      },
      {
        keyword: "#음식",
        mentions: 8400,
        growth: -2.1,
        sentiment: "neutral",
        period: "24h",
      },
      {
        keyword: "#패션",
        mentions: 6200,
        growth: 12.8,
        sentiment: "positive",
        period: "24h",
      },
      {
        keyword: "#건강",
        mentions: 5800,
        growth: 22.3,
        sentiment: "positive",
        period: "24h",
      },
      {
        keyword: "#운동",
        mentions: 4900,
        growth: 18.7,
        sentiment: "positive",
        period: "24h",
      },
      {
        keyword: "#영화",
        mentions: 4200,
        growth: -5.4,
        sentiment: "neutral",
        period: "24h",
      },
      {
        keyword: "#책",
        mentions: 3800,
        growth: 3.2,
        sentiment: "positive",
        period: "24h",
      },
      {
        keyword: "#카페",
        mentions: 3500,
        growth: 7.1,
        sentiment: "positive",
        period: "24h",
      },
      {
        keyword: "#반려동물",
        mentions: 3100,
        growth: 25.6,
        sentiment: "positive",
        period: "24h",
      },
    ]);

    // 트렌드 분석 생성
    await models.TrendAnalysis.bulkCreate([
      {
        topic: "지속가능한 여행",
        description: "환경을 고려한 여행 트렌드가 급상승하고 있습니다.",
        growth: 32.5,
        type: "rising",
        opportunity: "친환경 여행 상품 콘텐츠 제작 기회",
        period: "24h",
      },
      {
        topic: "홈 피트니스",
        description: "집에서 하는 운동 관련 콘텐츠가 인기를 얻고 있습니다.",
        growth: 28.3,
        type: "rising",
        opportunity: "홈트레이닝 가이드 콘텐츠 제작",
        period: "24h",
      },
      {
        topic: "전통 요리",
        description: "전통 음식에 대한 관심이 급감하고 있습니다.",
        growth: -15.8,
        type: "declining",
        risk: "전통 요리 관련 콘텐츠 성과 저조 예상",
        period: "24h",
      },
    ]);

    // 콘텐츠 추천 생성
    await models.ContentRecommendation.bulkCreate([
      {
        trend: "#친환경여행",
        title: "제로웨이스트 여행 가이드",
        description: "환경을 생각하는 여행자를 위한 실용적인 팁과 가이드",
        expectedEngagement: "high",
        difficulty: "medium",
        priority: "high",
      },
      {
        trend: "#홈피트니스",
        title: "15분 홈트레이닝 루틴",
        description: "바쁜 직장인을 위한 짧고 효과적인 운동법",
        expectedEngagement: "high",
        difficulty: "easy",
        priority: "high",
      },
      {
        trend: "#건강식단",
        title: "주말 meal prep 가이드",
        description: "한 번에 일주일치 건강한 식사 준비하기",
        expectedEngagement: "medium",
        difficulty: "medium",
        priority: "medium",
      },
    ]);

    // 플랫폼 통계 생성
    await models.PlatformStat.bulkCreate([
      {
        name: "Facebook",
        todayPosts: 12,
        successCount: 11,
        failureCount: 1,
        failureRate: 8.3,
        status: "active",
      },
      {
        name: "Instagram",
        todayPosts: 8,
        successCount: 8,
        failureCount: 0,
        failureRate: 0,
        status: "active",
      },
      {
        name: "TikTok",
        todayPosts: 5,
        successCount: 4,
        failureCount: 1,
        failureRate: 20,
        lastError: "Video upload failed",
        status: "error",
      },
      {
        name: "Twitter",
        todayPosts: 15,
        successCount: 14,
        failureCount: 1,
        failureRate: 6.7,
        status: "active",
      },
    ]);

    // 콘텐츠 생성
    await models.Content.bulkCreate([
      {
        title: "여름 휴가 준비 가이드",
        description: "완벽한 여름 휴가를 위한 체크리스트",
        content:
          "여름 휴가를 계획하고 계신가요? 이 가이드로 완벽한 휴가를 준비하세요!",
        mediaType: "text",
        mode: "Manual",
        keywords: "#여행, #휴가, #여름",
        status: "approved",
        platforms: ["Facebook", "Instagram"],
        aiGenerated: false,
        userId: 1,
      },
      {
        title: "AI 생성 콘텐츠: 건강한 아침 루틴",
        description: "AI가 생성한 건강한 아침 습관 가이드",
        content: "건강한 하루를 시작하는 아침 루틴을 소개합니다.",
        mediaType: "text",
        mode: "Auto",
        keywords: "#건강, #아침루틴, #라이프스타일",
        status: "pending",
        platforms: ["Instagram", "TikTok"],
        aiGenerated: true,
        confidence: 0.92,
        userId: 2,
      },
    ]);

    // 게시 로그 생성
    await models.PostingLog.bulkCreate([
      {
        level: "success",
        platform: "Facebook",
        message: "콘텐츠가 성공적으로 게시되었습니다.",
        contentId: 1,
      },
      {
        level: "error",
        platform: "TikTok",
        message: "비디오 업로드에 실패했습니다.",
        error: "File size too large",
        contentId: 2,
      },
      {
        level: "info",
        platform: "Instagram",
        message: "콘텐츠 예약이 완료되었습니다.",
        contentId: 1,
      },
    ]);

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedData;
