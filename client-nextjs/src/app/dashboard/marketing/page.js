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
import { useRouter } from 'next/navigation';
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
  ArrowUp,
  ArrowDown,
  DollarSign,
  PlayCircle,
  ChevronRight,
  Megaphone,
  TrendingDown,
  Star,
  User,
} from "lucide-react";

import {
  GET_MARKETING_STATS,
  GET_CONTENTS,
  GET_PLATFORM_STATS,
} from "@/lib/graphql/marketingQueries.js";

export default function MarketingDashboardPage() {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("30일");
  const router = useRouter();

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
        limit: 10,
        offset: 0,
      },
    },
  );

  const { data: platformsData, loading: platformsLoading } =
    useQuery(GET_PLATFORM_STATS);

  const isLoading = statsLoading || contentsLoading || platformsLoading;

  // Mock 데이터 (실제 GraphQL 데이터로 대체 가능)
  const kpiData = {
    totalReach: { value: "2.4M", change: 12, trend: "up" },
    totalEngagement: { value: "156K", change: 8, trend: "up" },
    totalSpend: { value: "₩4,250,000", change: 15, trend: "up" },
    avgEngagementRate: { value: "6.5%", change: 0.3, trend: "up" },
  };

  const activeMarketingPlans = [
    {
      id: "MP001",
      title: "2025년 1분기 마케팅 계획",
      manager: "김마케팅",
      period: "2025-01-01 ~ 03-31",
      progress: 72,
      objectives: ["Z세대 인지도 확보", "온라인 매출 증대"],
      status: "진행중",
      keyResults: {
        completed: 8,
        total: 12
      }
    },
    {
      id: "MP002", 
      title: "신제품 런칭 마케팅 전략",
      manager: "박기획",
      period: "2025-04-01 ~ 06-30",
      progress: 25,
      objectives: ["신제품 시장 점유율 10% 달성"],
      status: "진행중",
      keyResults: {
        completed: 2,
        total: 8
      }
    },
    {
      id: "MP003",
      title: "글로벌 브랜드 확장 계획",
      manager: "최전략",
      period: "2025-07-01 ~ 12-31",
      progress: 5,
      objectives: ["해외 시장 진출", "글로벌 브랜드 인지도 구축"],
      status: "계획됨",
      keyResults: {
        completed: 1,
        total: 15
      }
    }
  ];

  const upcomingContent = [
    {
      id: "UC001",
      title: "여름 휴가지 TOP 5 추천",
      scheduledDate: "2025-06-09",
      channel: "Instagram",
      status: "승인대기",
      channelIcon: "📸",
    },
    {
      id: "UC002",
      title: "신제품 언박싱 영상",
      scheduledDate: "2025-06-10",
      channel: "TikTok",
      status: "예약완료",
      channelIcon: "🎵",
    },
    {
      id: "UC003",
      title: "주말 특가 이벤트 안내",
      scheduledDate: "2025-06-11",
      channel: "Facebook",
      status: "승인대기",
      channelIcon: "👍",
    },
    {
      id: "UC004",
      title: "고객 후기 컴필레이션",
      scheduledDate: "2025-06-12",
      channel: "YouTube",
      status: "예약완료",
      channelIcon: "▶️",
    },
    {
      id: "UC005",
      title: "브랜드 스토리 시리즈 #3",
      scheduledDate: "2025-06-13",
      channel: "Instagram",
      status: "제작중",
      channelIcon: "📸",
    },
  ];

  const channelPerformance = [
    { name: "Instagram", engagement: 45000, percentage: 35, color: "bg-pink-500" },
    { name: "Facebook", engagement: 38000, percentage: 30, color: "bg-blue-500" },
    { name: "TikTok", engagement: 28000, percentage: 22, color: "bg-black" },
    { name: "YouTube", engagement: 17000, percentage: 13, color: "bg-red-500" },
  ];

  const topContent = [
    {
      id: "TC001",
      title: "베트남 다낭 여행 가이드",
      thumbnail: "🏖️",
      views: "1.5M",
      engagement: "98K",
      platform: "Instagram",
    },
    {
      id: "TC002",
      title: "신제품 첫 인상 리뷰",
      thumbnail: "📱",
      views: "892K",
      engagement: "67K",
      platform: "TikTok",
    },
    {
      id: "TC003",
      title: "여름 패션 트렌드 2025",
      thumbnail: "👗",
      views: "654K",
      engagement: "43K",
      platform: "YouTube",
    },
  ];

  const notifications = [
    {
      id: "N001",
      type: "approval",
      message: "콘텐츠 승인 요청: 3건",
      time: "5분 전",
      urgent: true,
      action: "/dashboard/marketing/content",
    },
    {
      id: "N002",
      type: "comment",
      message: "응답 필요한 댓글: 12건",
      time: "15분 전",
      urgent: false,
      action: "/dashboard/marketing/engagement",
    },
    {
      id: "N003",
      type: "budget",
      message: "'여름 캠페인' 예산의 90% 소진",
      time: "1시간 전",
      urgent: true,
      action: "/dashboard/marketing/budget-expense",
    },
    {
      id: "N004",
      type: "integration",
      message: "TikTok 채널 연동이 해제되었습니다",
      time: "2시간 전",
      urgent: true,
      action: "/dashboard/settings/sns-integration",
    },
    {
      id: "N005",
      type: "performance",
      message: "Instagram 참여율이 평균보다 25% 상승",
      time: "3시간 전",
      urgent: false,
      action: "/dashboard/marketing/insights",
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "approval": return <CheckCircle className="w-4 h-4 text-orange-500" />;
      case "comment": return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "budget": return <DollarSign className="w-4 h-4 text-red-500" />;
      case "integration": return <Globe className="w-4 h-4 text-purple-500" />;
      case "performance": return <TrendingUp className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "승인대기":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">승인대기</Badge>;
      case "예약완료":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">예약완료</Badge>;
      case "제작중":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">제작중</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full max-w-none space-y-8 animate-fadeIn overflow-x-hidden">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("marketing.dashboard")}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              마케팅 활동의 핵심 지표를 한눈에 파악하고 관리하세요
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7일">지난 7일</option>
              <option value="30일">지난 30일</option>
              <option value="이번달">이번 달</option>
              <option value="사용자설정">사용자 설정</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchStats()}
              className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>
        </div>
      </div>

      {/* 영역 1: 핵심 성과 지표 (KPI 요약) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  총 도달
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {kpiData.totalReach.value}
                </p>
                <div className="flex items-center mt-2">
                  {kpiData.totalReach.trend === "up" ? (
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${kpiData.totalReach.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {kpiData.totalReach.change}% vs 지난 기간
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  총 반응
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {kpiData.totalEngagement.value}
                </p>
                <div className="flex items-center mt-2">
                  {kpiData.totalEngagement.trend === "up" ? (
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${kpiData.totalEngagement.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {kpiData.totalEngagement.change}% vs 지난 기간
                  </span>
                </div>
              </div>
              <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  총 지출
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {kpiData.totalSpend.value}
                </p>
                <div className="flex items-center mt-2">
                  {kpiData.totalSpend.trend === "up" ? (
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${kpiData.totalSpend.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {kpiData.totalSpend.change}% vs 지난 기간
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  평균 참여율
                </p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {kpiData.avgEngagementRate.value}
                </p>
                <div className="flex items-center mt-2">
                  {kpiData.avgEngagementRate.trend === "up" ? (
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${kpiData.avgEngagementRate.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {kpiData.avgEngagementRate.change}% vs 지난 기간
                  </span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 영역 2: 캠페인 및 콘텐츠 현황 (메인 영역) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 진행 중인 마케팅 계획 */}
              <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      진행 중인 마케팅 계획
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {activeMarketingPlans.filter(p => p.status === "진행중").length}개
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {activeMarketingPlans.slice(0, 3).map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                        onClick={() => router.push(`/dashboard/marketing/planning-process/${plan.id}`)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors mb-1">
                              {plan.title}
                            </h4>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span className="flex items-center mr-4">
                                <User className="w-3 h-3 mr-1" />
                                담당자: {plan.manager}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                기간: {plan.period}
                              </span>
                            </div>
                            {getStatusBadge(plan.status)}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* 전체 진행률 바 */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">전체 진행률</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {plan.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${plan.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* 주요 목표(OKRs) 요약 */}
                        <div className="mb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">주요 목표:</span>
                          <div className="flex flex-wrap gap-1">
                            {plan.objectives.map((objective, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300"
                              >
                                {objective}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Key Results 진행 상황 */}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            핵심 결과: {plan.keyResults.completed}/{plan.keyResults.total} 완료
                          </span>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full mt-4 hover:shadow-md transition-all duration-300"
                      onClick={() => router.push('/dashboard/marketing/planning-process')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      새 마케팅 계획 수립
                    </Button>
                  </div>
                </CardContent>
              </Card>

        {/* 다가오는 콘텐츠 발행 일정 */}
        <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              다가오는 콘텐츠 발행 일정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    if (content.status === "승인대기") {
                      window.location.href = '/dashboard/marketing/content';
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{content.channelIcon}</span>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {content.title}
                      </h5>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{content.scheduledDate}</span>
                        <span>•</span>
                        <span>{content.channel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(content.status)}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 영역 3 & 4: 채널별 성과와 알림 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 영역 3: 채널별 성과 하이라이트 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 채널별 반응 수 비교 */}
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                채널별 반응 수 비교
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelPerformance.map((channel) => (
                  <div key={channel.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {channel.name}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {channel.engagement.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${channel.color}`}
                        style={{ width: `${channel.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 최고 성과 콘텐츠 Top 3 */}
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                최고 성과 콘텐츠 Top 3
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topContent.map((content, index) => (
                  <div
                    key={content.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => window.location.href = '/dashboard/marketing/insights'}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{content.thumbnail}</div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                        {content.title}
                      </h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">조회수</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {content.views}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">반응</span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {content.engagement}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {content.platform}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 영역 4: 알림 및 할 일 */}
        <div className="space-y-6">
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
                알림 및 할 일
                <Badge variant="destructive" className="ml-2">
                  {notifications.filter(n => n.urgent).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      notification.urgent
                        ? 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50'
                    }`}
                    onClick={() => window.location.href = notification.action}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          notification.urgent 
                            ? 'text-red-900 dark:text-red-100' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs ${
                          notification.urgent 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {notification.time}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}