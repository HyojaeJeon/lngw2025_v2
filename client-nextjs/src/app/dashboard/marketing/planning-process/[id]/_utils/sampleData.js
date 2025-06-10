// 샘플 데이터
export const samplePlan = {
  id: 1,
  title: "2025년 1분기 마케팅 계획",
  startDate: "2025-01-01",
  endDate: "2025-03-31",
  manager: "김마케팅",
  status: "진행중",
  description:
    "새로운 년도를 맞아 브랜드 인지도 향상과 고객 확보를 목표로 하는 종합적인 마케팅 전략",
  targetPersona: "20-30대 직장인",
  coreMessage: "일상을 더 스마트하게, 더 편리하게",
  progress: 65,
};

// 목표 및 핵심 결과 샘플 데이터
export const sampleObjectives = [
  {
    id: 1,
    title: "Z세대 인지도 확보",
    isActive: true,
    keyResults: [
      {
        id: 1,
        type: "numeric",
        description: "틱톡 팔로워 증가",
        target: "50000",
        currentValue: 32500,
        unit: "명",
      },
      {
        id: 2,
        type: "checklist",
        description: "브랜드 캠페인 실행",
        checklist: [
          { text: "인플루언서 5명과 협업 계약 체결", completed: true },
          { text: "브랜드 해시태그 캠페인 기획", completed: true },
          { text: "틱톡 챌린지 콘텐츠 제작", completed: false },
          { text: "캠페인 성과 분석 리포트 작성", completed: false },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "온라인 매출 증대",
    isActive: true,
    keyResults: [
      {
        id: 3,
        type: "numeric",
        description: "온라인 매출 증가",
        target: "30",
        currentValue: 18,
        unit: "%",
      },
      {
        id: 4,
        type: "numeric",
        description: "전환율 향상",
        target: "3.5",
        currentValue: 2.8,
        unit: "%",
      },
    ],
  },
];

// 사용자 목록 (담당자 선택용)
export const availableUsers = [
  { value: "김마케팅", label: "김마케팅", color: "bg-blue-400" },
  { value: "이기획", label: "이기획", color: "bg-green-400" },
  { value: "박전략", label: "박전략", color: "bg-purple-400" },
  { value: "최브랜드", label: "최브랜드", color: "bg-pink-400" },
];
