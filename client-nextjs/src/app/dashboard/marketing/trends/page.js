"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

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
  TrendingUp,
  TrendingDown,
  Hash,
  Eye,
  MessageSquare,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  Globe,
  BarChart3,
  Activity,
  Lightbulb,
} from "lucide-react";

import {
  GET_TRENDING_KEYWORDS,
  GET_TREND_ANALYSIS,
} from "@/lib/graphql/marketingQueries.js";

import { GENERATE_CONTENT } from "@/lib/graphql/marketingMutations.js";

export default function MarketingTrendsPage() {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("24h");
  const [selectedKeywords, setSelectedKeywords] = useState(["#여행", "#뷰티"]);
  const [searchTerm, setSearchTerm] = useState("");

  // GraphQL 쿼리
  const {
    data: keywordsData,
    loading: keywordsLoading,
    refetch: refetchKeywords,
  } = useQuery(GET_TRENDING_KEYWORDS, {
    variables: {
      period: selectedPeriod,
    },
    pollInterval: 60000, // 1분마다 자동 새로고침
  });

  const {
    data: trendData,
    loading: trendLoading,
    refetch: refetchTrends,
  } = useQuery(GET_TREND_ANALYSIS, {
    variables: {
      period: selectedPeriod,
    },
    pollInterval: 300000, // 5분마다 자동 새로고침
  });

  // GraphQL 뮤테이션
  const [generateContent] = useMutation(GENERATE_CONTENT);

  const trendingKeywords = keywordsData?.trendingKeywords || [];
  const trendAnalysis = trendData?.trendAnalysis || {
    rising: [],
    declining: [],
    contentRecommendations: [],
  };

  const getKeywordSize = (mentions, maxMentions) => {
    const baseSize = 12;
    const maxSize = 32;
    const ratio = mentions / maxMentions;
    return baseSize + ratio * (maxSize - baseSize);
  };

  const getGrowthColor = (growth) => {
    if (growth > 20) return "text-green-600 dark:text-green-400";
    if (growth > 0) return "text-green-500 dark:text-green-300";
    if (growth > -10) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  const getGrowthIcon = (growth) => {
    return growth > 0 ? ArrowUp : ArrowDown;
  };

  const handleGenerateContent = async (recommendation) => {
    try {
      await generateContent({
        variables: {
          input: {
            prompt: `${recommendation.title}: ${recommendation.description}`,
            platforms: ["Facebook", "Instagram", "TikTok"],
            contentType: "text",
            mode: "Auto",
            keywords: recommendation.trend,
          },
        },
      });
      console.log("Content generation initiated for:", recommendation.title);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const maxMentions = Math.max(...trendingKeywords.map((k) => k.mentions));

  const handleRefresh = () => {
    refetchKeywords();
    refetchTrends();
  };

  if (keywordsLoading || trendLoading) {
    return (
 
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
        </div>
 
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div
        className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg"
      >
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 
                         bg-clip-text text-transparent"
        >
          {t("marketing.trends")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          실시간 시장 트렌드 분석 및 콘텐츠 추천
        </p>
        <div className="flex gap-2 mt-4">
          <select
            className="px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="1h">지난 1시간</option>
            <option value="24h">지난 24시간</option>
            <option value="7d">지난 7일</option>
            <option value="30d">지난 30일</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
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

      {/* 실시간 트렌드 키워드 클라우드 */}
      <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Hash className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            실시간 트렌드 키워드 클라우드
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-sm">
              {selectedPeriod === "1h"
                ? "지난 1시간"
                : selectedPeriod === "24h"
                  ? "지난 24시간"
                  : selectedPeriod === "7d"
                    ? "지난 7일"
                    : "지난 30일"}{" "}
              수집 데이터
            </Badge>
            <Badge variant="outline" className="text-sm">
              총{" "}
              {trendingKeywords
                .reduce((sum, item) => sum + item.mentions, 0)
                .toLocaleString()}
              회 언급
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="min-h-[300px] bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 
                           rounded-lg p-8 flex flex-wrap items-center justify-center gap-4"
          >
            {trendingKeywords.length > 0 ? (
              trendingKeywords.map((item, index) => {
                const GrowthIcon = getGrowthIcon(item.growth);
                return (
                  <button
                    key={index}
                    onClick={() =>
                      console.log("Keyword clicked:", item.keyword)
                    }
                    className="group flex items-center gap-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 
                               transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <span
                      className="font-bold text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-200"
                      style={{
                        fontSize: `${getKeywordSize(item.mentions, maxMentions)}px`,
                      }}
                    >
                      {item.keyword}
                    </span>
                    <div className="flex flex-col items-center">
                      <GrowthIcon
                        className={`w-3 h-3 ${getGrowthColor(item.growth)}`}
                      />
                      <span
                        className={`text-xs ${getGrowthColor(item.growth)}`}
                      >
                        {item.growth > 0 ? "+" : ""}
                        {item.growth.toFixed(1)}%
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center">
                <Activity className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  트렌드 키워드를 불러오는 중...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 트렌드 요약 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 급상승 키워드 */}
        <Card
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 
                          border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              📈 급상승 트렌드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendAnalysis.rising.length > 0 ? (
                trendAnalysis.rising.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 
                                               dark:from-green-800 dark:to-emerald-700 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-green-800 dark:text-green-200">
                        {item.topic}
                      </span>
                      <Badge className="bg-green-600 text-white">
                        +{item.growth.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {item.description}
                    </p>
                    {item.opportunity && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        💡 {item.opportunity}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-green-600 dark:text-green-400">
                  급상승 트렌드를 분석 중입니다...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 급감 키워드 */}
        <Card
          className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-800/20 
                          border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              📉 급감 키워드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendAnalysis.declining.length > 0 ? (
                trendAnalysis.declining.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-red-100 to-orange-100 
                                               dark:from-red-800 dark:to-orange-700 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-red-800 dark:text-red-200">
                        {item.topic}
                      </span>
                      <Badge className="bg-red-600 text-white">
                        {item.growth.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {item.description}
                    </p>
                    {item.risk && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        ⚠️ {item.risk}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-red-600 dark:text-red-400">
                  급감 트렌드를 분석 중입니다...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 트렌드 변화 차트 */}
      <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            트렌드 변화 차트
          </CardTitle>
          <div className="flex gap-2 mt-2">
            {trendingKeywords.slice(0, 4).map((keyword) => (
              <Button
                key={keyword.keyword}
                variant={
                  selectedKeywords.includes(keyword.keyword)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => {
                  if (selectedKeywords.includes(keyword.keyword)) {
                    setSelectedKeywords(
                      selectedKeywords.filter((k) => k !== keyword.keyword),
                    );
                  } else {
                    setSelectedKeywords([...selectedKeywords, keyword.keyword]);
                  }
                }}
                className="transition-all duration-300 transform hover:scale-105"
              >
                {keyword.keyword}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 
                           rounded-lg p-6 flex items-center justify-center"
          >
            <div className="text-center">
              <Activity className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                선택된 키워드: {selectedKeywords.join(", ")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                차트 라이브러리 연동 예정 (Chart.js, Recharts 등)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 트렌드 기반 콘텐츠 추천 */}
      <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            AI 트렌드 기반 콘텐츠 추천
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            현재 트렌드에 맞춰 AI가 추천하는 콘텐츠 아이디어
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendAnalysis.contentRecommendations.length > 0 ? (
              trendAnalysis.contentRecommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-800/20 
                             rounded-lg border border-yellow-200 dark:border-yellow-700 hover:shadow-lg 
                             transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-yellow-600 text-white">
                      {recommendation.trend}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        recommendation.expectedEngagement === "high"
                          ? "border-green-500 text-green-600"
                          : recommendation.expectedEngagement === "medium"
                            ? "border-yellow-500 text-yellow-600"
                            : "border-red-500 text-red-600"
                      }
                    >
                      {recommendation.expectedEngagement === "high"
                        ? "높음"
                        : recommendation.expectedEngagement === "medium"
                          ? "중간"
                          : "낮음"}
                    </Badge>
                    {recommendation.priority === "high" && (
                      <Badge className="bg-red-600 text-white text-xs">
                        우선순위 높음
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {recommendation.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {recommendation.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      난이도:{" "}
                      {recommendation.difficulty === "easy"
                        ? "쉬움"
                        : recommendation.difficulty === "medium"
                          ? "보통"
                          : "어려움"}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleGenerateContent(recommendation)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-300 transform hover:scale-105"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      콘텐츠 생성
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  AI가 트렌드를 분석하여 콘텐츠를 추천하고 있습니다...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
