"use client";

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useLanguage } from "@/contexts/languageContext.js";
import {
  TestTube,
  TrendingUp,
  AlertCircle,
  Users,
  Eye,
  Heart,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Settings,
  BarChart3,
  Target,
  Zap,
  Trophy,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Activity,
  AlertTriangle,
  Timer,
  PlayCircle,
  StopCircle,
} from "lucide-react";

export default function MarketingABTestPage() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [testConfig, setTestConfig] = useState({
    textVariants: 2,
    mediaVariants: 2,
    platforms: [],
    schedule: {},
    successCriteria: "",
  });

  // 모의 데이터
  const testOverview = {
    active: 8,
    pending: 5,
    completed: 15,
    recentCompleted: [
      { id: "AB001", completedAt: "2025-01-30", winner: "A" },
      { id: "AB002", completedAt: "2025-01-29", winner: "B" },
      { id: "AB003", completedAt: "2025-01-28", winner: "C" },
    ],
  };

  const candidateContent = [
    {
      id: "C001",
      title: "여름 뷰티 트렌드 2025",
      createdAt: "2025-01-30",
      type: "이미지",
      status: "approved",
    },
    {
      id: "C002",
      title: "필러 시술 전후 관리법",
      createdAt: "2025-01-29",
      type: "영상",
      status: "approved",
    },
    {
      id: "C003",
      title: "보톡스 효과 극대화하기",
      createdAt: "2025-01-28",
      type: "이미지",
      status: "approved",
    },
  ];

  const activeTests = [
    {
      id: "AB004",
      name: "여름 스킨케어 A/B 테스트",
      createdAt: "2025-01-31 09:00",
      variants: 3,
      status: "running",
      platform: "TikTok",
      successCriteria: "Views",
      currentLeader: "Variant A",
      variants_detail: [
        {
          name: "A",
          status: "published",
          scheduledTime: "2025-01-31 10:00",
          views: 12500,
          engagement: 850,
        },
        {
          name: "B",
          status: "published",
          scheduledTime: "2025-01-31 10:05",
          views: 9800,
          engagement: 920,
        },
        {
          name: "C",
          status: "pending",
          scheduledTime: "2025-01-31 10:10",
          views: 0,
          engagement: 0,
        },
      ],
    },
    {
      id: "AB005",
      name: "보톡스 정보 테스트",
      createdAt: "2025-01-31 11:00",
      variants: 2,
      status: "pending",
      platform: "Instagram",
      successCriteria: "Engagement",
      currentLeader: null,
      variants_detail: [
        {
          name: "A",
          status: "pending",
          scheduledTime: "2025-02-01 14:00",
          views: 0,
          engagement: 0,
        },
        {
          name: "B",
          status: "pending",
          scheduledTime: "2025-02-01 14:05",
          views: 0,
          engagement: 0,
        },
      ],
    },
  ];

  const platforms = ["TikTok", "Instagram", "Facebook", "Twitter"];

  const filteredContent = candidateContent.filter((content) =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePlatformToggle = (platform) => {
    setTestConfig((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const getStatusBadge = (status) => {
    const config = {
      running: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        icon: PlayCircle,
      },
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
        icon: Clock,
      },
      completed: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
        icon: CheckCircle,
      },
      published: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        icon: CheckCircle,
      },
      failed: {
        color: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
        icon: XCircle,
      },
    };

    const statusConfig = config[status];
    const Icon = statusConfig?.icon || Clock;

    return (
      <Badge
        variant="outline"
        className={`${statusConfig?.color || ""} border-0`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status === "running"
          ? "진행중"
          : status === "pending"
            ? "대기중"
            : status === "completed"
              ? "완료"
              : status === "published"
                ? "게시완료"
                : "실패"}
      </Badge>
    );
  };

  const renderWizardStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              1단계: 원본 콘텐츠 선택
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="콘텐츠 제목으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredContent.map((content) => (
                <div
                  key={content.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedContent?.id === content.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedContent(content)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {content.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {content.createdAt} · {content.type}
                      </p>
                    </div>
                    {getStatusBadge(content.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              2단계: 변형 수 및 유형 지정
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  텍스트 변형 개수
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  value={testConfig.textVariants}
                  onChange={(e) =>
                    setTestConfig((prev) => ({
                      ...prev,
                      textVariants: parseInt(e.target.value),
                    }))
                  }
                >
                  <option value={2}>2개</option>
                  <option value={3}>3개</option>
                  <option value={4}>4개</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  미디어 변형 개수
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  value={testConfig.mediaVariants}
                  onChange={(e) =>
                    setTestConfig((prev) => ({
                      ...prev,
                      mediaVariants: parseInt(e.target.value),
                    }))
                  }
                >
                  <option value={1}>1개</option>
                  <option value={2}>2개</option>
                  <option value={3}>3개</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                추가 변형 옵션
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    제목+이미지 복합 변형
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    해시태그 변형
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    게시 시간대 변형
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              3단계: 게시 스케줄 및 플랫폼 선택
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                대상 플랫폼
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {platforms.map((platform) => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={testConfig.platforms.includes(platform)}
                      onChange={() => handlePlatformToggle(platform)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {platform}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                게시 스케줄
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                    변형 A:
                  </span>
                  <input
                    type="datetime-local"
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                    변형 B:
                  </span>
                  <input
                    type="datetime-local"
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                {testConfig.textVariants > 2 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                      변형 C:
                    </span>
                    <input
                      type="datetime-local"
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              4단계: 성과 비교 기준 설정
            </h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                승자 결정 기준
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="criteria"
                    value="views"
                    className="mr-2"
                    onChange={(e) =>
                      setTestConfig((prev) => ({
                        ...prev,
                        successCriteria: e.target.value,
                      }))
                    }
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    조회수 1위
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="criteria"
                    value="engagement"
                    className="mr-2"
                    onChange={(e) =>
                      setTestConfig((prev) => ({
                        ...prev,
                        successCriteria: e.target.value,
                      }))
                    }
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    참여도(좋아요+댓글+공유) 1위
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="criteria"
                    value="ctr"
                    className="mr-2"
                    onChange={(e) =>
                      setTestConfig((prev) => ({
                        ...prev,
                        successCriteria: e.target.value,
                      }))
                    }
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    클릭률(CTR) 1위
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="criteria"
                    value="composite"
                    className="mr-2"
                    onChange={(e) =>
                      setTestConfig((prev) => ({
                        ...prev,
                        successCriteria: e.target.value,
                      }))
                    }
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    종합 점수 1위
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                테스트 기간
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">
                <option value={24}>24시간</option>
                <option value={48}>48시간</option>
                <option value={72}>72시간</option>
                <option value={168}>1주일</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              5단계: 확인 및 시작
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  선택된 콘텐츠:
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {selectedContent?.title}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  변형 수:
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  텍스트 {testConfig.textVariants}개, 미디어{" "}
                  {testConfig.mediaVariants}개
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  대상 플랫폼:
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {testConfig.platforms.join(", ")}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  성과 기준:
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {testConfig.successCriteria === "views"
                    ? "조회수"
                    : testConfig.successCriteria === "engagement"
                      ? "참여도"
                      : testConfig.successCriteria === "ctr"
                        ? "클릭률"
                        : "종합 점수"}{" "}
                  1위
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div
        className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg"
      >
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                         bg-clip-text text-transparent"
        >
          {t("marketing.abtest")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          A/B 테스트 설정 및 성과 모니터링
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowWizard(true)}
          >
            <Plus className="w-4 h-4 mr-2" />새 테스트 생성
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      {/* A/B 테스트 개요 카드 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <TestTube className="w-5 h-5 mr-2" />
          테스트 개요
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                    진행 중
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {testOverview.active}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300">
                    활성 테스트
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                    대기 중
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {testOverview.pending}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300">
                    예약된 테스트
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                  <Timer className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                    완료
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {testOverview.completed}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    총 완료된 테스트
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                    최근 완료
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {testOverview.recentCompleted.length}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-300">
                    지난 7일
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 최근 완료된 테스트 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          최근 완료된 테스트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testOverview.recentCompleted.map((test) => (
            <Card
              key={test.id}
              className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {test.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {test.completedAt}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  >
                    완료
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    승자:
                  </span>
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      변형 {test.winner}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  상세 분석 보기
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 실시간 테스트 진행 모니터링 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          실시간 테스트 모니터링
        </h2>
        <div className="space-y-6">
          {activeTests.map((test) => (
            <Card key={test.id} className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {test.createdAt} · {test.platform}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(test.status)}
                    {test.currentLeader && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                      >
                        <Trophy className="w-3 h-3 mr-1" />
                        {test.currentLeader} 우세
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      성과 기준: {test.successCriteria}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left p-2 font-medium text-gray-900 dark:text-white">
                            변형
                          </th>
                          <th className="text-left p-2 font-medium text-gray-900 dark:text-white">
                            상태
                          </th>
                          <th className="text-left p-2 font-medium text-gray-900 dark:text-white">
                            예정 시간
                          </th>
                          <th className="text-left p-2 font-medium text-gray-900 dark:text-white">
                            조회수
                          </th>
                          <th className="text-left p-2 font-medium text-gray-900 dark:text-white">
                            참여도
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {test.variants_detail.map((variant) => (
                          <tr
                            key={variant.name}
                            className="border-b border-gray-100 dark:border-gray-800"
                          >
                            <td className="p-2 font-medium text-gray-900 dark:text-white">
                              변형 {variant.name}
                            </td>
                            <td className="p-2">
                              {getStatusBadge(variant.status)}
                            </td>
                            <td className="p-2 text-gray-600 dark:text-gray-400">
                              {variant.scheduledTime}
                            </td>
                            <td className="p-2 text-gray-900 dark:text-white">
                              {variant.views.toLocaleString()}
                            </td>
                            <td className="p-2 text-gray-900 dark:text-white">
                              {variant.engagement.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {test.status === "running" && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          실시간 업데이트 중 · 마지막 업데이트: 2분 전
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 테스트 설정 위저드 모달 */}
      {showWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                A/B 테스트 설정
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWizard(false)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            {/* 진행 단계 표시 */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= activeStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step < activeStep
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* 단계별 내용 */}
            <div className="mb-8">{renderWizardStep()}</div>

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                disabled={activeStep === 1}
              >
                이전
              </Button>
              <div className="flex gap-2">
                {activeStep < 5 ? (
                  <Button
                    onClick={() => setActiveStep(Math.min(5, activeStep + 1))}
                    disabled={activeStep === 1 && !selectedContent}
                  >
                    다음
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      setShowWizard(false);
                      setActiveStep(1);
                      // 여기에 테스트 시작 로직 추가
                    }}
                  >
                    <PlayCircle className="w-4 h-4 mr-1" />
                    테스트 시작
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
