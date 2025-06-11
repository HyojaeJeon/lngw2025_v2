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
import { useLanguage } from "@/hooks/useLanguage.js";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Users,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  MoreVertical,
  Trophy,
  Zap,
  DollarSign,
  MousePointer,
} from "lucide-react";

export default function MarketingInsightsPage() {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedChart, setSelectedChart] = useState("reach");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    contentId: true,
    postedAt: true,
    platform: true,
    reach: true,
    engagement: true,
    views: true,
    ctr: true,
    roi: false,
  });

  // 모의 데이터
  const kpiData = {
    totalReach: { value: 2450000, change: 12.5, period: "7일" },
    totalViews: { value: 1890000, change: 8.3, period: "7일" },
    totalEngagement: { value: 89500, change: 15.2, period: "7일" },
    avgEngagementRate: { value: 3.65, change: -2.1, period: "7일" },
  };

  const performanceData = [
    {
      contentId: "P001",
      postedAt: "2025-01-31 14:30",
      platform: "Facebook",
      reach: 45200,
      engagement: 2850,
      views: 38900,
      ctr: 4.2,
      roi: 280,
    },
    {
      contentId: "P002",
      postedAt: "2025-01-31 16:00",
      platform: "Instagram",
      reach: 52100,
      engagement: 3420,
      views: 47800,
      ctr: 5.1,
      roi: 340,
    },
    {
      contentId: "P003",
      postedAt: "2025-01-30 12:15",
      platform: "TikTok",
      reach: 128900,
      engagement: 8950,
      views: 125600,
      ctr: 6.8,
      roi: 520,
    },
    {
      contentId: "P004",
      postedAt: "2025-01-30 18:30",
      platform: "Twitter",
      reach: 22400,
      engagement: 1180,
      views: 18900,
      ctr: 3.1,
      roi: 150,
    },
    {
      contentId: "P005",
      postedAt: "2025-01-29 20:00",
      platform: "Instagram",
      reach: 38700,
      engagement: 2940,
      views: 35200,
      ctr: 4.7,
      roi: 290,
    },
  ];

  const chartData = {
    reach: [
      { date: "1/25", value: 45000 },
      { date: "1/26", value: 52000 },
      { date: "1/27", value: 48000 },
      { date: "1/28", value: 61000 },
      { date: "1/29", value: 58000 },
      { date: "1/30", value: 72000 },
      { date: "1/31", value: 69000 },
    ],
    views: [
      { date: "1/25", value: 38000 },
      { date: "1/26", value: 45000 },
      { date: "1/27", value: 42000 },
      { date: "1/28", value: 55000 },
      { date: "1/29", value: 51000 },
      { date: "1/30", value: 64000 },
      { date: "1/31", value: 61000 },
    ],
    engagement: [
      { date: "1/25", value: 2800 },
      { date: "1/26", value: 3200 },
      { date: "1/27", value: 2900 },
      { date: "1/28", value: 3800 },
      { date: "1/29", value: 3600 },
      { date: "1/30", value: 4200 },
      { date: "1/31", value: 4100 },
    ],
  };

  const platformComparison = [
    { platform: "TikTok", avgEngagement: 6.8, color: "bg-black" },
    { platform: "Instagram", avgEngagement: 4.9, color: "bg-pink-500" },
    { platform: "Facebook", avgEngagement: 4.2, color: "bg-blue-500" },
    { platform: "Twitter", avgEngagement: 3.1, color: "bg-blue-400" },
  ];

  const abTestGroups = [
    {
      id: "AB001",
      createdAt: "2025-01-29",
      variants: 3,
      winner: "A",
      status: "completed",
    },
    {
      id: "AB002",
      createdAt: "2025-01-30",
      variants: 2,
      winner: null,
      status: "running",
    },
    {
      id: "AB003",
      createdAt: "2025-01-31",
      variants: 4,
      winner: "C",
      status: "completed",
    },
  ];

  const contentTypeData = [
    { type: "이미지", percentage: 60, count: 156 },
    { type: "영상", percentage: 40, count: 104 },
  ];

  const filteredPerformanceData = performanceData.filter((item) => {
    const matchesPlatform =
      selectedPlatform === "all" || item.platform === selectedPlatform;
    const matchesSearch =
      searchTerm === "" ||
      item.contentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPlatform && matchesSearch;
  });

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getPlatformColor = (platform) => {
    const colors = {
      Facebook: "bg-blue-500 text-white",
      Instagram: "bg-pink-500 text-white",
      TikTok: "bg-black text-white",
      Twitter: "bg-blue-400 text-white",
    };
    return colors[platform] || "bg-gray-500 text-white";
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg"
      >
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent"
        >
          {t("marketing.insights")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          마케팅 성과 분석 및 인사이트
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
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* 기본 성과 KPI 카드 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          주요 성과 지표
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                    총 도달
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(kpiData.totalReach.value)}
                  </p>
                  <p
                    className={`text-xs flex items-center mt-1 ${kpiData.totalReach.change > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpiData.totalReach.change > 0 ? "+" : ""}
                    {kpiData.totalReach.change}% ({kpiData.totalReach.period})
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                    총 조회수
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(kpiData.totalViews.value)}
                  </p>
                  <p
                    className={`text-xs flex items-center mt-1 ${kpiData.totalViews.change > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpiData.totalViews.change > 0 ? "+" : ""}
                    {kpiData.totalViews.change}% ({kpiData.totalViews.period})
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                    총 반응
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(kpiData.totalEngagement.value)}
                  </p>
                  <p
                    className={`text-xs flex items-center mt-1 ${kpiData.totalEngagement.change > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpiData.totalEngagement.change > 0 ? "+" : ""}
                    {kpiData.totalEngagement.change}% (
                    {kpiData.totalEngagement.period})
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">
                    평균 참여율
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {kpiData.avgEngagementRate.value}%
                  </p>
                  <p
                    className={`text-xs flex items-center mt-1 ${kpiData.avgEngagementRate.change > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpiData.avgEngagementRate.change > 0 ? "+" : ""}
                    {kpiData.avgEngagementRate.change}% (
                    {kpiData.avgEngagementRate.period})
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 시계열 차트 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            추이 분석
          </h2>
          <div className="flex gap-2">
            <select
              className="px-3 py-1 border rounded-md text-sm"
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
            >
              <option value="reach">일별 도달 추이</option>
              <option value="views">일별 조회수 추이</option>
              <option value="engagement">일별 반응 추이</option>
            </select>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="h-80">
              <div className="flex items-end justify-between h-full space-x-2">
                {chartData[selectedChart].map((data, index) => {
                  const maxValue = Math.max(
                    ...chartData[selectedChart].map((d) => d.value),
                  );
                  const height = (data.value / maxValue) * 100;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className="bg-gradient-to-t from-blue-500 to-blue-300 w-full rounded-t-md transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`${data.date}: ${formatNumber(data.value)}`}
                      ></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {data.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 플랫폼별 성과 비교 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              플랫폼별 평균 참여율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformComparison.map((platform, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${platform.color} mr-3`}
                    ></div>
                    <span className="text-sm font-medium">
                      {platform.platform}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${platform.color}`}
                        style={{
                          width: `${(platform.avgEngagement / 7) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold w-12">
                      {platform.avgEngagement}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              콘텐츠 유형별 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentTypeData.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{type.type}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({type.count}개)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${index === 0 ? "bg-blue-500" : "bg-purple-500"}`}
                        style={{ width: `${type.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold w-12">
                      {type.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 플랫폼별 세부 성과 표 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            세부 성과 데이터
          </h2>
          <div className="flex gap-2">
            <select
              className="px-3 py-1 border rounded-md text-sm"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option value="all">전체 플랫폼</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="Twitter">Twitter</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {visibleColumns.contentId && (
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        콘텐츠 ID
                      </th>
                    )}
                    {visibleColumns.postedAt && (
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        게시 일시
                      </th>
                    )}
                    {visibleColumns.platform && (
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        플랫폼
                      </th>
                    )}
                    {visibleColumns.reach && (
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        도달
                      </th>
                    )}
                    {visibleColumns.engagement && (
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        반응
                      </th>
                    )}
                    {visibleColumns.views && (
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        조회수
                      </th>
                    )}
                    {visibleColumns.ctr && (
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        CTR (%)
                      </th>
                    )}
                    {visibleColumns.roi && (
                      <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                        ROI
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredPerformanceData.map((item) => (
                    <tr
                      key={item.contentId}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      {visibleColumns.contentId && (
                        <td className="p-3 text-gray-900 dark:text-white font-medium">
                          {item.contentId}
                        </td>
                      )}
                      {visibleColumns.postedAt && (
                        <td className="p-3 text-gray-600 dark:text-gray-400">
                          {item.postedAt}
                        </td>
                      )}
                      {visibleColumns.platform && (
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={getPlatformColor(item.platform)}
                          >
                            {item.platform}
                          </Badge>
                        </td>
                      )}
                      {visibleColumns.reach && (
                        <td className="p-3 text-gray-900 dark:text-white">
                          {formatNumber(item.reach)}
                        </td>
                      )}
                      {visibleColumns.engagement && (
                        <td className="p-3 text-gray-900 dark:text-white">
                          {formatNumber(item.engagement)}
                        </td>
                      )}
                      {visibleColumns.views && (
                        <td className="p-3 text-gray-900 dark:text-white">
                          {formatNumber(item.views)}
                        </td>
                      )}
                      {visibleColumns.ctr && (
                        <td className="p-3 text-gray-900 dark:text-white">
                          {item.ctr}%
                        </td>
                      )}
                      {visibleColumns.roi && (
                        <td className="p-3 text-green-600 dark:text-green-400 font-medium">
                          ${item.roi}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* A/B 테스트 성과 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          A/B 테스트 현황
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {abTestGroups.map((group) => (
            <Card
              key={group.id}
              className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {group.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {group.createdAt}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      group.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                    }
                  >
                    {group.status === "completed" ? "완료" : "진행중"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    변형 수:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {group.variants}개
                    </span>
                  </p>
                  {group.winner && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      승자:{" "}
                      <span className="font-medium text-gray-900 dark:text-white ml-1 flex items-center">
                        변형 {group.winner}{" "}
                        <Trophy className="w-4 h-4 ml-1 text-yellow-500" />
                      </span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
