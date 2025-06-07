"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
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
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  FileText,
  Target,
  Activity,
  RefreshCw,
  Search,
  Download,
  Plus,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Settings,
  Globe,
  Hash,
  Bell,
  Filter,
  Pause,
  Heart,
  X,
  Bot,
  XCircle,
  Edit,
} from "lucide-react";

import {
  GET_MARKETING_STATS,
  GET_CONTENTS,
  GET_PLATFORM_STATS,
} from "@/lib/graphql/marketingQueries.js";

export default function MarketingDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // State for modals
  const [showTodayPostsModal, setShowTodayPostsModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showErrorsModal, setShowErrorsModal] = useState(false);
  const [showScheduledModal, setShowScheduledModal] = useState(false);
  const [showContentPreview, setShowContentPreview] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  // GraphQL 쿼리
  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useQuery(GET_MARKETING_STATS, {
    pollInterval: 30000, // 30초마다 자동 새로고침
  });

  const { data: contentsData, loading: contentsLoading } = useQuery(
    GET_CONTENTS,
    {
      variables: {
        limit: 5,
        offset: 0,
      },
    },
  );

  const { data: platformsData, loading: platformsLoading } =
    useQuery(GET_PLATFORM_STATS);

  const isLoading = statsLoading || contentsLoading || platformsLoading;

  const stats = statsData?.marketingStats || {
    totalPosts: { today: 0, week: 0, month: 0 },
    pendingApproval: 0,
    errors: 0,
    abTestGroups: { active: 0, completed: 0 },
    trendingKeywords: 0,
  };

  const recentContent = contentsData?.contents || [];
  const platformPerformance = platformsData?.platformStats || [];

  // Mock data for UI components
  const overviewStats = {
    trendingKeywords: ["#여행", "#뷰티", "#음식", "#패션", "#건강"],
  };

  const contentStatus = {
    approved: 67,
    pending: 10,
    rejected: 3,
    scheduled: 20,
  };

  const pendingContent = [
    {
      id: "C001",
      title: "신상품 런칭 콘텐츠",
      mode: "Auto",
      createdAt: "2025-01-31 14:30",
      mediaType: "image",
      keywords: "#신상품 #런칭",
      description: "새로운 상품 런칭을 위한 홍보 콘텐츠입니다.",
      status: "pending",
      content: "신상품 런칭! 놓치지 마세요!",
    },
    {
      id: "C002",
      title: "겨울 캠핑 추천",
      mode: "Manual",
      createdAt: "2025-02-15 10:00",
      mediaType: "video",
      keywords: "#캠핑 #겨울여행",
      description: "겨울에 떠나기 좋은 캠핑장 추천 영상입니다.",
      status: "pending",
      content: "따뜻한 겨울 캠핑을 떠나보세요!",
    },
  ];

  const scheduledPosts = [
    {
      id: "S001",
      content: "오늘의 특가 상품을 확인하세요!",
      scheduledTime: "2025-02-01 18:00",
      platform: "Instagram",
      status: "active",
    },
  ];

  const platformStats = [
    {
      name: "Facebook",
      posts: 45,
      success: 42,
      failed: 3,
      errorRate: 6.7,
    },
    {
      name: "Instagram",
      posts: 32,
      success: 32,
      failed: 0,
      errorRate: 0,
    },
    {
      name: "TikTok",
      posts: 28,
      success: 25,
      failed: 3,
      errorRate: 10.7,
    },
    {
      name: "Twitter",
      posts: 52,
      success: 50,
      failed: 2,
      errorRate: 3.8,
    },
    {
      name: "Threads",
      posts: 18,
      success: 18,
      failed: 0,
      errorRate: 0,
    },
  ];

  const abTestGroups = [
    {
      id: "AB001",
      name: "제품 소개 콘텐츠 A/B 테스트",
      status: "running",
      createdAt: "2025-01-30 10:00",
      variants: 2,
    },
  ];

  const todayPosts = [
    {
      id: "TP001",
      title: "오늘의 추천 상품",
      description: "오늘의 특가 상품을 소개합니다.",
      createdAt: new Date(),
      mediaType: "image",
      aiGenerated: true,
      status: "approved",
      content: "오늘의 특가 상품! 놓치지 마세요!",
    },
    {
      id: "TP002",
      title: "주말 나들이 추천 장소",
      description: "주말에 가기 좋은 나들이 장소를 추천합니다.",
      createdAt: new Date(),
      mediaType: "video",
      aiGenerated: false,
      status: "approved",
      content: "이번 주말, 어디로 떠나볼까요?",
    },
  ];

  const mockErrorLogs = [
    {
      id: "EL001",
      platform: "Facebook",
      error: "API 호출 실패 - 인증 오류",
      postedAt: new Date(),
    },
    {
      id: "EL002",
      platform: "Instagram",
      error: "이미지 업로드 실패 - 파일 손상",
      postedAt: new Date(),
    },
  ];

  const mockScheduledPosts = [
    {
      id: "SP001",
      content: "다음 주 신제품 출시!",
      platform: "Facebook",
      scheduledAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    {
      id: "SP002",
      content: "여름 휴가 이벤트 진행!",
      platform: "Instagram",
      scheduledAt: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  ];

  const handleContentClick = (content) => {
    setSelectedContent(content);
    setShowContentPreview(true);
  };

  return (
    <div className="w-full max-w-none space-y-8 animate-fadeIn overflow-x-hidden">
      {/* 헤더 섹션 */}
      <div
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg"
      >
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 
                         bg-clip-text text-transparent"
        >
          {t("marketing.dashboard")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          콘텐츠 생성부터 성과 분석까지 통합 관리
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "개요", icon: BarChart3 },
                { id: "content", label: "콘텐츠 관리", icon: MessageSquare },
                { id: "posting", label: "게시 모니터링", icon: Globe },
                { id: "performance", label: "성과 분석", icon: TrendingUp },
                { id: "abtest", label: "A/B 테스트", icon: Target },
                { id: "trends", label: "트렌드 분석", icon: Hash },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                    activeTab === id
                      ? "border-purple-500 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </CardContent>
      </Card>

      {/* 개요 탭 */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => setShowTodayPostsModal(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      오늘 게시
                    </p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {todayPosts.length}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card
              className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => setShowPendingModal(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      승인 대기
                    </p>
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                      {pendingContent.length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => setShowErrorsModal(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      오류 발생
                    </p>
                    <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                      {mockErrorLogs.length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => setShowScheduledModal(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      예약된 게시물
                    </p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {mockScheduledPosts.length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 실행 상태 알림 */}
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                실행 상태 알림
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">
                    자동 워크플로우 정상 실행
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    오늘 09:00 - 콘텐츠 12건 생성 완료
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">
                    새로운 콘텐츠 생성 완료
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    3건의 콘텐츠가 승인 대기 중입니다
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">
                    API Rate Limit 경고
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    TikTok API - 잠시 후 재시도 필요
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 콘텐츠 관리 탭 */}
      {activeTab === "content" && (
        <div className="space-y-6">
          {/* 콘텐츠 상태 현황 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  승인 대기 목록
                </CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="콘텐츠 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm shadow-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:shadow-md transition-all duration-300"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingContent.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="border-purple-300 text-purple-700 dark:border-purple-500 dark:text-purple-300"
                            >
                              {item.id}
                            </Badge>
                            <Badge
                              variant={
                                item.mode === "Auto" ? "default" : "secondary"
                              }
                              className={
                                item.mode === "Auto"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                  : ""
                              }
                            >
                              {item.mode}
                            </Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {item.createdAt}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.mediaType} • {item.keywords}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
                          >
                            미리보기
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                          >
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
                          >
                            거절
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  콘텐츠 상태 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      승인됨
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: "67%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {contentStatus.approved}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      대기 중
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                          style={{ width: "10%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {contentStatus.pending}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      거절됨
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                          style={{ width: "3%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {contentStatus.rejected}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      예약됨
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {contentStatus.scheduled}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 예약 게시 대기 */}
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                예약 게시 대기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledPosts.map((post) => (
                  <div
                    key={post?.id}
                    className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {post?.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>{post?.scheduledTime}</span>
                        <Badge
                          variant="outline"
                          className="border-blue-300 text-blue-700 dark:border-blue-500 dark:text-blue-300"
                        >
                          {post?.platform}
                        </Badge>
                        <Badge
                          variant={
                            post?.status === "active" ? "default" : "secondary"
                          }
                          className={
                            post?.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : ""
                          }
                        >
                          {post?.status === "active" ? "활성" : "일시정지"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
                      >
                        편집
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 게시 모니터링 탭 */}
      {activeTab === "posting" && (
        <div className="space-y-6">
          {/* 플랫폼별 게시 현황 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {platformStats.map((platform) => (
              <Card
                key={platform.name}
                className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {platform.name}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {platform.posts}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          오늘 게시
                        </p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">
                          성공 {platform.success}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          실패 {platform.failed}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span
                          className={`font-medium px-2 py-1 rounded-full ${platform.errorRate < 5 ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-100" : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-100"}`}
                        >
                          실패율 {platform.errorRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 실시간 로그 */}
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <RefreshCw className="w-5 h-5 text-green-600 dark:text-green-400" />
                실시간 로그
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm shadow-inner">
                <div className="space-y-1 text-green-400">
                  <p>
                    [2025-05-31 15:42:30]{" "}
                    <span className="text-blue-400">INFO:</span> Facebook API
                    호출 성공 - 게시물 ID: FB_001
                  </p>
                  <p>
                    [2025-05-31 15:42:25]{" "}
                    <span className="text-blue-400">INFO:</span> 콘텐츠 C003
                    자동 생성 완료
                  </p>
                  <p>
                    [2025-05-31 15:42:20]{" "}
                    <span className="text-yellow-400">WARN:</span> TikTok API
                    Rate Limit 경고 - 잠시 후 재시도
                  </p>
                  <p>
                    [2025-05-31 15:42:15]{" "}
                    <span className="text-blue-400">INFO:</span> Instagram 게시
                    성공 - 조회수 1,250
                  </p>
                  <p>
                    [2025-05-31 15:42:10]{" "}
                    <span className="text-blue-400">INFO:</span> A/B 테스트 그룹
                    AB001 생성 완료
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 성과 분석 탭 */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          {/* 기본 성과 KPI */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      총 도달
                    </p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      2.4M
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      +12% vs 지난주
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      총 반응
                    </p>
                    <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                      156K
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      +8% vs 지난주
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      참여율
                    </p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                      6.5%
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      +0.3% vs 지난주
                    </p>
                  </div>
                  <Share2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      클릭률
                    </p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      3.8%
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      -0.2% vs 지난주
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 플랫폼별 성과 테이블 */}
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                플랫폼별 세부 성과
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2" />
                  내보내기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        콘텐츠 ID
                      </th>
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        게시 일시
                      </th>
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        플랫폼
                      </th>
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        도달
                      </th>
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        반응
                      </th>
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        조회수
                      </th>
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        CTR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformPerformance.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <td className="p-3 text-gray-900 dark:text-white font-medium">
                          {item.id}
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">
                          {item.postedAt}
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className="border-blue-300 text-blue-700 dark:border-blue-500 dark:text-blue-300"
                          >
                            {item.platform}
                          </Badge>
                        </td>
                        <td className="p-3 text-gray-900 dark:text-white">
                          {item?.reach?.toLocaleString()}
                        </td>
                        <td className="p-3 text-gray-900 dark:text-white">
                          {item?.engagement?.toLocaleString()}
                        </td>
                        <td className="p-3 text-gray-900 dark:text-white">
                          {item?.views?.toLocaleString()}
                        </td>
                        <td className="p-3 text-gray-900 dark:text-white font-medium">
                          {item?.ctr}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* A/B 테스트 탭 */}
      {activeTab === "abtest" && (
        <div className="space-y-6">
          {/* A/B 테스트 개요 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    진행 중인 테스트
                  </p>
                  <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                    {stats?.abTestGroups.active}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    완료된 테스트
                  </p>
                  <p className="text-4xl font-bold text-green-900 dark:text-green-100">
                    {stats.abTestGroups.completed}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    평균 승률
                  </p>
                  <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">
                    68%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* A/B 테스트 목록 */}
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                A/B 테스트 목록
              </CardTitle>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                <Target className="w-4 h-4 mr-2" />새 테스트 생성
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {abTestGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {group.name}
                          </h4>
                          <Badge
                            variant={
                              group.status === "running"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              group.status === "running"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : ""
                            }
                          >
                            {group.status === "running" ? "진행 중" : "완료"}
                          </Badge>
                          {group.winner && (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600 dark:border-green-400 dark:text-green-400"
                            >
                              🏆 {group.winner}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span>그룹 ID: {group.id}</span>
                          <span className="mx-2">•</span>
                          <span>생성: {group.createdAt}</span>
                          <span className="mx-2">•</span>
                          <span>변형: {group.variants}개</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
                      >
                        상세 보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 트렌드 분석 탭 */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          {/* 트렌드 키워드 클라우드 */}
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Hash className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                실시간 트렌드 키워드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                {[
                  {
                    keyword: "#여행",
                    size: "text-4xl",
                    color: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    keyword: "#뷰티",
                    size: "text-3xl",
                    color: "text-pink-600 dark:text-pink-400",
                  },
                  {
                    keyword: "#음식",
                    size: "text-2xl",
                    color: "text-green-600 dark:text-green-400",
                  },
                  {
                    keyword: "#패션",
                    size: "text-xl",
                    color: "text-purple-600 dark:text-purple-400",
                  },
                  {
                    keyword: "#건강",
                    size: "text-lg",
                    color: "text-red-600 dark:text-red-400",
                  },
                  {
                    keyword: "#라이프스타일",
                    size: "text-xl",
                    color: "text-yellow-600 dark:text-yellow-400",
                  },
                  {
                    keyword: "#기술",
                    size: "text-lg",
                    color: "text-gray-600 dark:text-gray-400",
                  },
                  {
                    keyword: "#문화",
                    size: "text-base",
                    color: "text-indigo-600 dark:text-indigo-400",
                  },
                ].map((item, index) => (
                  <span
                    key={index}
                    className={`${item.size} ${item.color} font-bold cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-sm`}
                  >
                    {item.keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 트렌드 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">
                  📈 급상승 키워드
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-lg shadow-sm">
                    <span className="font-medium text-green-800 dark:text-green-200">
                      #여행
                    </span>
                    <span className="text-green-700 dark:text-green-300 font-bold">
                      +45%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-lg shadow-sm">
                    <span className="font-medium text-green-800 dark:text-green-200">
                      #뷰티
                    </span>
                    <span className="text-green-700 dark:text-green-300 font-bold">
                      +32%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-lg shadow-sm">
                    <span className="font-medium text-green-800 dark:text-green-200">
                      #건강
                    </span>
                    <span className="text-green-700 dark:text-green-300 font-bold">
                      +28%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-400">
                  📉 급감 키워드
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-800 dark:to-red-700 rounded-lg shadow-sm">
                    <span className="font-medium text-red-800 dark:text-red-200">
                      #패션
                    </span>
                    <span className="text-red-700 dark:text-red-300 font-bold">
                      -18%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-800 dark:to-red-700 rounded-lg shadow-sm">
                    <span className="font-medium text-red-800 dark:text-red-200">
                      #스포츠
                    </span>
                    <span className="text-red-700 dark:text-red-300 font-bold">
                      -12%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 트렌드 기반 콘텐츠 추천 */}
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                AI 콘텐츠 추천
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    topic: "베트남 여름 여행지 TOP 5",
                    trend: "#여행",
                    engagement: "예상 참여율 7.2%",
                  },
                  {
                    topic: "2025 뷰티 트렌드 미리보기",
                    trend: "#뷰티",
                    engagement: "예상 참여율 6.8%",
                  },
                  {
                    topic: "건강한 여름 식단 관리법",
                    trend: "#건강",
                    engagement: "예상 참여율 5.9%",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.topic}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="border-purple-300 text-purple-700 dark:border-purple-500 dark:text-purple-300"
                        >
                          {item.trend}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.engagement}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      생성하기
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showTodayPostsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[90%] max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                오늘 게시된 콘텐츠 ({todayPosts.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTodayPostsModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {todayPosts.map((post) => (
                <div
                  key={post?.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handleContentClick(post)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{post?.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {post?.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{post?.platform}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(post?.publishedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm">
                        <div className="text-green-600 font-medium">
                          조회수: {post?.views?.toLocaleString()}
                        </div>
                        <div className="text-blue-600">
                          참여: {post?.engagement?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 승인 대기 모달 */}
      {showPendingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Clock className="w-7 h-7" />
                    승인 대기 콘텐츠
                  </h3>
                  <p className="text-orange-100 mt-1">
                    총 {pendingContent.length}개의 콘텐츠가 승인 대기 중
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPendingModal(false)}
                  className="text-white hover:bg-orange-400/20 rounded-full p-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {pendingContent.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    승인 대기 중인 콘텐츠가 없습니다
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingContent.map((content) => (
                    <div
                      key={content.id}
                      className="border border-orange-200 dark:border-orange-700/50 rounded-xl p-4 bg-orange-50/50 dark:bg-orange-900/10 hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-all duration-200 cursor-pointer"
                      onClick={() => handleContentClick(content)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {content.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-700"
                            >
                              대기중
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {content.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(content.createdAt).toLocaleDateString()}
                            </span>
                            <span>{content.keywords}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            승인
                          </Button>
                          <Button size="sm" variant="outline">
                            거절
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 오류 발생 모달 */}
      {showErrorsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <AlertTriangle className="w-7 h-7" />
                    오류 발생 현황
                  </h3>
                  <p className="text-red-100 mt-1">
                    총 {mockErrorLogs.length}개의 오류 발생
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowErrorsModal(false)}
                  className="text-white hover:bg-red-400/20 rounded-full p-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {mockErrorLogs.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    발생한 오류가 없습니다
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockErrorLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border border-red-200 dark:border-red-700/50 rounded-xl p-4 bg-red-50/50 dark:bg-red-900/10"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {log.platform} 오류
                            </h4>
                            <Badge variant="destructive" className="text-xs">
                              Error
                            </Badge>
                          </div>
                          <p className="text-red-600 dark:text-red-400 text-sm mb-2">
                            {log.error}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(log.postedAt)?.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {log.platform}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          재시도
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 예약된 게시물 모달 */}
      {showScheduledModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Calendar className="w-7 h-7" />
                    예약된 게시물
                  </h3>
                  <p className="text-green-100 mt-1">
                    총 {mockScheduledPosts.length}개의 게시물 예약됨
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScheduledModal(false)}
                  className="text-white hover:bg-green-400/20 rounded-full p-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {mockScheduledPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    예약된 게시물이 없습니다
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockScheduledPosts.map((post) => (
                    <div
                      key={post?.id}
                      className="border border-green-200 dark:border-green-700/50 rounded-xl p-4 bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {post?.content}
                            </h4>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-700"
                            >
                              예약됨
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {post?.platform}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(post?.scheduledAt)?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 콘텐츠 상세 미리보기 모달 */}
      {showContentPreview && selectedContent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <FileText className="w-7 h-7" />
                    콘텐츠 상세보기
                  </h3>
                  <p className="text-purple-100 mt-1">
                    콘텐츠 ID: {selectedContent.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContentPreview(false)}
                  className="text-white hover:bg-purple-400/20 rounded-full p-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedContent.title}
                    </h4>
                    <Badge
                      variant={
                        selectedContent.status === "approved"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        selectedContent.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedContent.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedContent.status === "approved"
                        ? "승인됨"
                        : selectedContent.status === "pending"
                          ? "대기중"
                          : "거절됨"}
                    </Badge>
                    {selectedContent.aiGenerated && (
                      <Badge
                        variant="outline"
                        className="border-purple-300 text-purple-700"
                      >
                        <Bot className="w-3 h-3 mr-1" />
                        AI 생성
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {selectedContent.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                    콘텐츠 내용
                  </h5>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                      {selectedContent.content}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                      메타데이터
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">미디어 타입:</span>
                        <Badge variant="outline">
                          {selectedContent.mediaType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">모드:</span>
                        <Badge
                          variant={
                            selectedContent.mode === "Auto"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {selectedContent.mode}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">키워드:</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {selectedContent.keywords}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">플랫폼:</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {selectedContent.platforms?.join(", ") || "없음"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                      타임스탬프
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500">생성:</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {new Date(
                            selectedContent.createdAt,
                          )?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500">수정:</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {new Date(
                            selectedContent.updatedAt,
                          )?.toLocaleString()}
                        </span>
                      </div>
                      {selectedContent.approvedAt && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-500">승인:</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {new Date(
                              selectedContent.approvedAt,
                            )?.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedContent.status === "pending" && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        승인
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-600 border-red-200"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        거절
                      </Button>
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        편집
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
