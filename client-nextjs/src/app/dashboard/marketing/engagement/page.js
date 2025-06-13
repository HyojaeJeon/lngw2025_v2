"use client";

import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import {
  MessageSquare,
  Bot,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  Send,
  RefreshCw,
  Download,
  Filter,
  Search,
  Wifi,
  WifiOff,
  RotateCcw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Share2,
  Reply,
  Activity,
} from "lucide-react";

export default function MarketingEngagementPage() {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [webhookStatus, setWebhookStatus] = useState({
    facebook: { status: "connected", lastEvent: "2분 전" },
    instagram: { status: "connected", lastEvent: "1분 전" },
    tiktok: { status: "error", lastEvent: "30분 전" },
  });

  // 모의 데이터
  const recentComments = [
    {
      id: "C001",
      platform: "Facebook",
      contentId: "P001",
      username: "김민수",
      comment: "정말 좋은 정보네요! 더 자세한 내용이 궁금해요.",
      receivedAt: "2025-01-31 14:30",
      autoReplied: true,
      sentiment: "positive",
      status: "replied",
    },
    {
      id: "C002",
      platform: "Instagram",
      contentId: "P002",
      username: "user_123",
      comment: "이거 정말 맞는 정보인가요? 좀 의심스러운데...",
      receivedAt: "2025-01-31 14:25",
      autoReplied: false,
      sentiment: "negative",
      status: "pending",
    },
    {
      id: "C003",
      platform: "TikTok",
      contentId: "P003",
      username: "여행러버",
      comment: "와 진짜 예쁘다! 나도 가보고 싶어요 ㅠㅠ",
      receivedAt: "2025-01-31 14:20",
      autoReplied: true,
      sentiment: "positive",
      status: "replied",
    },
    {
      id: "C004",
      platform: "Facebook",
      contentId: "P004",
      username: "이영희",
      comment: "가격이 너무 비싸요. 다른 대안은 없나요?",
      receivedAt: "2025-01-31 14:15",
      autoReplied: false,
      sentiment: "neutral",
      status: "pending",
    },
  ];

  const replyLogs = [
    {
      id: "R001",
      commentId: "C001",
      username: "김민수",
      originalComment: "정말 좋은 정보네요! 더 자세한 내용이 궁금해요.",
      aiResponse:
        "관심 가져주셔서 감사합니다! 더 자세한 정보는 프로필 링크를 참고해 주세요. 궁금한 점이 있으시면 언제든 문의해 주세요! 😊",
      status: "success",
      repliedAt: "2025-01-31 14:32",
    },
    {
      id: "R002",
      commentId: "C003",
      username: "여행러버",
      originalComment: "와 진짜 예쁘다! 나도 가보고 싶어요 ㅠㅠ",
      aiResponse:
        "정말 아름다운 곳이죠! 여행 계획을 세우실 때 도움이 필요하시면 언제든 말씀해 주세요. 좋은 여행 되세요! ✈️",
      status: "success",
      repliedAt: "2025-01-31 14:22",
    },
    {
      id: "R003",
      commentId: "C005",
      username: "test_user",
      originalComment: "테스트 댓글입니다.",
      aiResponse: "응답 생성 중 오류가 발생했습니다.",
      status: "failed",
      repliedAt: "2025-01-31 13:45",
      errorReason: "API 토큰 만료",
    },
  ];

  const failedReplies = replyLogs.filter((log) => log.status === "failed");

  const getSentimentBadge = (sentiment) => {
    const config = {
      positive: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        icon: ThumbsUp,
      },
      negative: {
        color: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
        icon: ThumbsDown,
      },
      neutral: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
        icon: MessageSquare,
      },
    };

    const { color, icon: Icon } = config[sentiment];
    return (
      <Badge variant="outline" className={`${color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {sentiment === "positive"
          ? "긍정"
          : sentiment === "negative"
            ? "부정"
            : "중립"}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      replied: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        icon: CheckCircle,
        text: "응답완료",
      },
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
        icon: Clock,
        text: "응답대기",
      },
      failed: {
        color: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
        icon: XCircle,
        text: "응답실패",
      },
    };

    const { color, icon: Icon, text } = config[status];
    return (
      <Badge variant="outline" className={`${color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {text}
      </Badge>
    );
  };

  const getPlatformColor = (platform) => {
    const colors = {
      Facebook: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      Instagram:
        "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
      TikTok: "bg-black text-white dark:bg-gray-700 dark:text-white",
    };
    return (
      colors[platform] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    );
  };

  const getWebhookStatusIcon = (status) => {
    return status === "connected" ? (
      <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
    ) : (
      <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
    );
  };

  const handleRetryReply = (commentId) => {
    console.log("Retrying reply for comment:", commentId);
    // TODO: API 호출로 응답 재시도
  };

  const handleManualReply = (commentId) => {
    console.log("Manual reply for comment:", commentId);
    // TODO: 수동 응답 모달 열기
  };

  const filteredComments = recentComments.filter((comment) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "unanswered" && !comment.autoReplied) ||
      (selectedFilter === "negative" && comment.sentiment === "negative");
    const matchesPlatform =
      selectedPlatform === "all" || comment.platform === selectedPlatform;
    const matchesSearch =
      comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.username.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesPlatform && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div
        className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg"
      >
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 
                         bg-clip-text text-transparent"
        >
          {t("marketing.engagement")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          사용자 상호작용 자동 응답 관리 시스템
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
            응답 이력 다운로드
          </Button>
        </div>
      </div>

      {/* Webhook 상태 확인 */}
      <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            실시간 Webhook 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(webhookStatus).map(([platform, data]) => (
              <div
                key={platform}
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 
                                               dark:from-blue-900/20 dark:to-indigo-800/20 rounded-lg border 
                                               border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {platform}
                  </span>
                  {getWebhookStatusIcon(data.status)}
                </div>
                <div className="text-sm">
                  <Badge
                    className={
                      data.status === "connected"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }
                  >
                    {data.status === "connected" ? "연결됨" : "오류"}
                  </Badge>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    마지막 이벤트: {data.lastEvent}
                  </p>
                </div>
                {data.status === "error" && (
                  <Button size="sm" variant="outline" className="mt-2 w-full">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    재연결
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 최근 댓글/메시지 수신 현황 */}
      <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            최근 댓글/메시지 수신 현황
          </CardTitle>

          {/* 필터 및 검색 */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                전체
              </Button>
              <Button
                variant={
                  selectedFilter === "unanswered" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedFilter("unanswered")}
              >
                미응답만
              </Button>
              <Button
                variant={selectedFilter === "negative" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("negative")}
              >
                부정적 댓글만
              </Button>
            </div>

            <div className="flex gap-2">
              {["all", "Facebook", "Instagram", "TikTok"].map((platform) => (
                <Button
                  key={platform}
                  variant={
                    selectedPlatform === platform ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {platform === "all" ? "전체 플랫폼" : platform}
                </Button>
              ))}
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="댓글 내용 또는 사용자명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                    댓글 ID
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                    플랫폼
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                    사용자
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                    댓글 내용
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                    감정
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                    상태
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                    수신 시간
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-3 text-sm font-mono text-gray-900 dark:text-white">
                      {comment.id}
                    </td>
                    <td className="p-3">
                      <Badge className={getPlatformColor(comment.platform)}>
                        {comment.platform}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-900 dark:text-white">
                      {comment.username}
                    </td>
                    <td className="p-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {comment.comment}
                    </td>
                    <td className="p-3">
                      {getSentimentBadge(comment.sentiment)}
                    </td>
                    <td className="p-3">{getStatusBadge(comment.status)}</td>
                    <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                      {comment.receivedAt}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {!comment.autoReplied && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleManualReply(comment.id)}
                            className="transition-all duration-300 transform hover:scale-105"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            응답
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            console.log("View details:", comment.id)
                          }
                          className="transition-all duration-300 transform hover:scale-105"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 자동 응답 로그 */}
      <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Bot className="h-5 w-5 text-green-600 dark:text-green-400" />
            자동 응답 로그
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {replyLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-4 bg-gradient-to-r from-green-50 to-blue-50 
                                             dark:from-green-900/20 dark:to-blue-800/20 rounded-lg border 
                                             border-green-200 dark:border-green-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {log.username}
                    </span>
                    <Badge
                      className={
                        log.status === "success"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }
                    >
                      {log.status === "success" ? "성공" : "실패"}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {log.repliedAt}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      원본 댓글:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                      {log.originalComment}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      AI 응답:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                      {log.aiResponse}
                    </p>
                    {log.errorReason && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        오류: {log.errorReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 응답 실패 항목 */}
      {failedReplies.length > 0 && (
        <Card
          className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-800/20 
                          border-red-200 dark:border-red-700 shadow-lg"
        >
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              응답 실패 항목 ({failedReplies.length}건)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {failedReplies.map((failed) => (
                <div
                  key={failed.id}
                  className="flex items-center justify-between p-3 
                                                   bg-gradient-to-r from-red-100 to-orange-100 
                                                   dark:from-red-800 dark:to-orange-700 rounded-lg"
                >
                  <div>
                    <span className="font-semibold text-red-800 dark:text-red-200">
                      {failed.username}
                    </span>
                    <span className="text-sm text-red-600 dark:text-red-400 ml-2">
                      - {failed.errorReason}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRetryReply(failed.commentId)}
                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-800/50"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    재시도
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
