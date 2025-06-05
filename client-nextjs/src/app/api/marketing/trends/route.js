
import { NextResponse } from 'next/server';

// 모의 트렌드 데이터 - 실제로는 데이터베이스에서 가져옴
const generateTrendData = (period) => {
  const baseKeywords = [
    { keyword: '#여행', baseMentions: 12500 },
    { keyword: '#뷰티', baseMentions: 9800 },
    { keyword: '#음식', baseMentions: 8400 },
    { keyword: '#패션', baseMentions: 6200 },
    { keyword: '#건강', baseMentions: 5800 },
    { keyword: '#운동', baseMentions: 4900 },
    { keyword: '#영화', baseMentions: 4200 },
    { keyword: '#책', baseMentions: 3800 },
    { keyword: '#카페', baseMentions: 3500 },
    { keyword: '#반려동물', baseMentions: 3100 }
  ];

  const periodMultiplier = {
    '1h': 0.1,
    '24h': 1,
    '7d': 7,
    '30d': 30
  };

  const multiplier = periodMultiplier[period] || 1;

  return baseKeywords.map(item => ({
    ...item,
    mentions: Math.floor(item.baseMentions * multiplier),
    growth: (Math.random() - 0.5) * 80, // -40% to +40%
    sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
    relatedKeywords: [`관련키워드1`, `관련키워드2`]
  }));
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '24h';

    const trendingKeywords = generateTrendData(period);
    
    const trendAnalysis = {
      rising: [
        {
          topic: '#여행',
          description: '여행 콘텐츠가 급상승 중 → 여행 관련 게시물 우선 기획 권장',
          growth: 45.2,
          opportunity: '베트남, 일본 여행 콘텐츠 수요 증가'
        },
        {
          topic: '#건강',
          description: '건강 관련 콘텐츠 관심 증가 → 헬스케어 주제 확대 검토',
          growth: 18.9,
          opportunity: '홈트레이닝, 건강식단 콘텐츠 기회'
        },
        {
          topic: '#반려동물',
          description: '펫케어 콘텐츠 수요 상승 → 반려동물 콘텐츠 기획 권장',
          growth: 25.8,
          opportunity: '펫푸드, 펫케어 제품 마케팅 기회'
        }
      ],
      declining: [
        {
          topic: '#패션',
          description: '패션 키워드 관심 감소 → 우선순위 하향 조정',
          growth: -15.3,
          risk: '패션 콘텐츠 효율성 저하 예상'
        },
        {
          topic: '#책',
          description: '독서 관련 콘텐츠 관심 하락 → 새로운 접근 방식 필요',
          growth: -8.2,
          risk: '전통적 독서 콘텐츠 반응 저조'
        }
      ],
      contentRecommendations: [
        {
          id: 'rec_001',
          trend: '#여행',
          title: '베트남 숨은 관광지 TOP 5',
          description: '최근 급상승 중인 여행 트렌드에 맞춘 베트남 현지 숨은 명소 소개',
          expectedEngagement: 'high',
          difficulty: 'easy',
          priority: 'high'
        },
        {
          id: 'rec_002',
          trend: '#건강',
          title: '홈트레이닝 초보자 가이드',
          description: '건강 관심 증가에 따른 집에서 할 수 있는 운동 루틴 소개',
          expectedEngagement: 'medium',
          difficulty: 'medium',
          priority: 'medium'
        },
        {
          id: 'rec_003',
          trend: '#반려동물',
          title: '강아지 건강 간식 만들기',
          description: '펫케어 트렌드에 맞춘 반려동물 건강 관리 콘텐츠',
          expectedEngagement: 'high',
          difficulty: 'easy',
          priority: 'high'
        }
      ]
    };

    return NextResponse.json({
      trendingKeywords,
      trendAnalysis
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trend data' },
      { status: 500 }
    );
  }
}
