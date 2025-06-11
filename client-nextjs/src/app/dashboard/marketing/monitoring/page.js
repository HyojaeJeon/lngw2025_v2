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
import { useLanguage } from '@/hooks/useLanguage.js';
import {
  Monitor,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Eye,
  MessageSquare,
  Share2,
  Heart,
  TrendingUp,
  AlertCircle,
  Edit,
  Trash2,
  X,
  Save,
  WifiOff,
  Wifi,
} from "lucide-react";

export default function MarketingMonitoringPage() {
  const { t } = useLanguage();
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedLogLevel, setSelectedLogLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPlatformDetail, setSelectedPlatformDetail] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelingSchedule, setCancelingSchedule] = useState(null);

  // 플랫폼별 게시 현황 모의 데이터 (요구사항에 맞게 확장)
  const platformStats = [
    {
      name: "Facebook",
      todayPosts: 45,
      successCount: 42,
      failureCount: 3,
      failureRate: 6.7,
      lastError: "API rate limit exceeded - 요청 한도 초과",
      color: "bg-blue-500",
      icon: "📘",
      status: "warning",
      recentPosts: [
        {
          id: "FB001",
          contentId: "C001",
          status: "성공",
          timestamp: "14:30:22",
          error: null,
        },
        {
          id: "FB002",
          contentId: "C002",
          status: "실패",
          timestamp: "14:25:10",
          error: "API rate limit exceeded",
        },
        {
          id: "FB003",
          contentId: "C003",
          status: "성공",
          timestamp: "14:20:05",
          error: null,
        },
        {
          id: "FB004",
          contentId: "C004",
          status: "성공",
          timestamp: "14:15:33",
          error: null,
        },
        {
          id: "FB005",
          contentId: "C005",
          status: "실패",
          timestamp: "14:10:17",
          error: "Authentication failed",
        },
      ],
    },
    {
      name: "Instagram",
      todayPosts: 32,
      successCount: 32,
      failureCount: 0,
      failureRate: 0,
      lastError: null,
      color: "bg-pink-500",
      icon: "📷",
      status: "success",
      recentPosts: [
        {
          id: "IG001",
          contentId: "C006",
          status: "성공",
          timestamp: "14:28:45",
          error: null,
        },
        {
          id: "IG002",
          contentId: "C007",
          status: "성공",
          timestamp: "14:22:18",
          error: null,
        },
        {
          id: "IG003",
          contentId: "C008",
          status: "성공",
          timestamp: "14:18:02",
          error: null,
        },
        {
          id: "IG004",
          contentId: "C009",
          status: "성공",
          timestamp: "14:12:55",
          error: null,
        },
        {
          id: "IG005",
          contentId: "C010",
          status: "성공",
          timestamp: "14:08:37",
          error: null,
        },
      ],
    },
    {
      name: "TikTok",
      todayPosts: 28,
      successCount: 25,
      failureCount: 3,
      failureRate: 10.7,
      lastError: "Video processing failed - 비디오 처리 실패",
      color: "bg-black",
      icon: "🎵",
      status: "error",
      recentPosts: [
        {
          id: "TT001",
          contentId: "C011",
          status: "성공",
          timestamp: "14:26:12",
          error: null,
        },
        {
          id: "TT002",
          contentId: "C012",
          status: "실패",
          timestamp: "14:20:45",
          error: "Video processing failed",
        },
        {
          id: "TT003",
          contentId: "C013",
          status: "성공",
          timestamp: "14:16:30",
          error: null,
        },
        {
          id: "TT004",
          contentId: "C014",
          status: "실패",
          timestamp: "14:11:22",
          error: "File size too large",
        },
        {
          id: "TT005",
          contentId: "C015",
          status: "성공",
          timestamp: "14:05:18",
          error: null,
        },
      ],
    },
    {
      name: "Twitter",
      todayPosts: 52,
      successCount: 50,
      failureCount: 2,
      failureRate: 3.8,
      lastError: "Character limit exceeded - 글자 수 초과",
      color: "bg-blue-400",
      icon: "🐦",
      status: "warning",
      recentPosts: [
        {
          id: "TW001",
          contentId: "C016",
          status: "성공",
          timestamp: "14:32:08",
          error: null,
        },
        {
          id: "TW002",
          contentId: "C017",
          status: "실패",
          timestamp: "14:27:33",
          error: "Character limit exceeded",
        },
        {
          id: "TW003",
          contentId: "C018",
          status: "성공",
          timestamp: "14:23:17",
          error: null,
        },
        {
          id: "TW004",
          contentId: "C019",
          status: "성공",
          timestamp: "14:19:42",
          error: null,
        },
        {
          id: "TW005",
          contentId: "C020",
          status: "실패",
          timestamp: "14:14:28",
          error: "Duplicate content detected",
        },
      ],
    },
    {
      name: "Threads",
      todayPosts: 18,
      successCount: 18,
      failureCount: 0,
      failureRate: 0,
      lastError: null,
      color: "bg-gray-600",
      icon: "🧵",
      status: "success",
      recentPosts: [
        {
          id: "TH001",
          contentId: "C021",
          status: "성공",
          timestamp: "14:29:55",
          error: null,
        },
        {
          id: "TH002",
          contentId: "C022",
          status: "성공",
          timestamp: "14:24:11",
          error: null,
        },
        {
          id: "TH003",
          contentId: "C023",
          status: "성공",
          timestamp: "14:19:47",
          error: null,
        },
        {
          id: "TH004",
          contentId: "C024",
          status: "성공",
          timestamp: "14:15:23",
          error: null,
        },
        {
          id: "TH005",
          contentId: "C025",
          status: "성공",
          timestamp: "14:10:09",
          error: null,
        },
      ],
    },
  ];

  // 예약 게시 관리 모의 데이터 (요구사항에 맞게 확장)
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: "S001",
      contentId: "C026",
      scheduledTime: "2025-02-01 16:30:00",
      platform: "Facebook",
      mode: "Auto",
      approvalStatus: "approved",
      scheduleStatus: "active",
      createdAt: "2025-01-31 10:15:22",
    },
    {
      id: "S002",
      contentId: "C027",
      scheduledTime: "2025-02-01 17:00:00",
      platform: "Instagram",
      mode: "Manual",
      approvalStatus: "pending",
      scheduleStatus: "paused",
      createdAt: "2025-01-31 11:30:45",
    },
    {
      id: "S003",
      contentId: "C028",
      scheduledTime: "2025-02-01 18:30:00",
      platform: "TikTok",
      mode: "Auto",
      approvalStatus: "approved",
      scheduleStatus: "active",
      createdAt: "2025-01-31 12:45:18",
    },
    {
      id: "S004",
      contentId: "C029",
      scheduledTime: "2025-02-01 19:15:00",
      platform: "Twitter",
      mode: "Auto",
      approvalStatus: "approved",
      scheduleStatus: "active",
      createdAt: "2025-01-31 13:20:33",
    },
    {
      id: "S005",
      contentId: "C030",
      scheduledTime: "2025-02-01 20:00:00",
      platform: "Threads",
      mode: "Manual",
      approvalStatus: "rejected",
      scheduleStatus: "cancelled",
      createdAt: "2025-01-31 14:55:12",
    },
  ]);

  // 실시간 로그 시뮬레이션 (요구사항에 맞게 개선)
  useEffect(() => {
    const generateLog = () => {
      const levels = ["INFO", "WARN", "ERROR", "DEBUG"];
      const platforms = [
        "Facebook",
        "Instagram",
        "TikTok",
        "Twitter",
        "Threads",
      ];
      const workers = ["W001", "W002", "W003", "W004", "W005"];
      const components = [
        "API-Gateway",
        "AI-Service",
        "Content-Processor",
        "Schedule-Manager",
        "Platform-Connector",
      ];
      const messages = [
        "Content posted successfully to platform",
        "API rate limit approaching threshold",
        "Authentication token refreshed automatically",
        "Post scheduling process initiated",
        "Media upload completed successfully",
        "Media upload completed successfully",
        "Content approval workflow triggered",
        "Platform API response received",
        "Database transaction committed",
        "Cache invalidation performed",
        "Webhook notification sent",
        "Error: Connection timeout to external API",
        "Warning: High memory usage detected",
        "Background job processing started",
        "User session validated successfully",
        "Content validation rules applied",
      ];

      const level = levels[Math.floor(Math.random() * levels.length)];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const worker = workers[Math.floor(Math.random() * workers.length)];
      const component =
        components[Math.floor(Math.random() * components.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];

      return {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString("ko-KR"),
        level: level,
        platform: platform,
        workerId: worker,
        component: component,
        message: `[${component}] ${message} (Platform: ${platform})`,
      };
    };

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLog = generateLog();
        const updatedLogs = [newLog, ...prev.slice(0, 99)]; // 최대 100개 유지
        return updatedLogs;
      });
    }, 2000); // 2초마다 새로운 로그 생성

    // 초기 로그 설정
    const initialLogs = Array.from({ length: 15 }, generateLog);
    setLogs(initialLogs);

    return () => clearInterval(interval);
  }, []);

  // 로그 필터링
  const filteredLogs = logs.filter((log) => {
    const matchesLevel =
      selectedLogLevel === "all" || log.level === selectedLogLevel;
    const matchesPlatform =
      selectedPlatform === "all" || log.platform === selectedPlatform;
    const matchesSearch =
      searchTerm === "" ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.platform.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesLevel && matchesPlatform && matchesSearch;
  });

  // 플랫폼 카드 클릭 핸들러
  const handlePlatformCardClick = (platform) => {
    setSelectedPlatformDetail(platform);
    setShowDetailModal(true);
  };

  // 예약 편집 핸들러
  const handleEditSchedule = (schedule) => {
    setEditingSchedule({ ...schedule });
    setShowEditModal(true);
  };

  // 예약 취소 핸들러
  const handleCancelSchedule = (schedule) => {
    setCancelingSchedule(schedule);
    setShowCancelConfirm(true);
  };

  // 예약 편집 저장
  const handleSaveEdit = () => {
    setScheduledPosts((prev) =>
      prev.map((post) =>
        post.id === editingSchedule.id
          ? { ...post, scheduledTime: editingSchedule.scheduledTime }
          : post,
      ),
    );
    setShowEditModal(false);
    setEditingSchedule(null);
  };

  // 예약 취소 확인
  const handleConfirmCancel = () => {
    setScheduledPosts((prev) =>
      prev.map((post) =>
        post.id === cancelingSchedule.id
          ? { ...post, scheduleStatus: "cancelled" }
          : post,
      ),
    );
    setShowCancelConfirm(false);
    setCancelingSchedule(null);
  };

  const getStatusBadge = (status) => {
    const config = {
      approved: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        icon: CheckCircle,
      },
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
        icon: Clock,
      },
      rejected: {
        color: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
        icon: XCircle,
      },
      active: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
        icon: Play,
      },
      paused: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
        icon: Pause,
      },
      cancelled: {
        color: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
        icon: XCircle,
      },
      completed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        icon: CheckCircle,
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
        {status === "approved"
          ? "승인됨"
          : status === "pending"
            ? "승인대기"
            : status === "rejected"
              ? "거절됨"
              : status === "active"
                ? "활성"
                : status === "paused"
                  ? "일시정지"
                  : status === "cancelled"
                    ? "취소됨"
                    : "완료"}
      </Badge>
    );
  };

  const getLogLevelColor = (level) => {
    return level === "ERROR"
      ? "text-red-400"
      : level === "WARN"
        ? "text-yellow-400"
        : level === "DEBUG"
          ? "text-purple-400"
          : "text-green-400";
  };

  const getPlatformStatusColor = (status) => {
    return status === "success"
      ? "border-green-500"
      : status === "warning"
        ? "border-yellow-500"
        : status === "error"
          ? "border-red-500"
          : "border-gray-300";
  };

  return (
    <div className="space-y-8 animate-fadeIn">
          {/* 헤더 섹션 */}
          <div
            className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg"
          >
            <h1
              className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 
                         bg-clip-text text-transparent"
            >
              게시 모니터링
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              플랫폼별 게시 현황, 실시간 로그 및 예약 게시 관리
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
            </div>
          </div>

          {/* 1. 플랫폼별 게시 현황 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              플랫폼별 게시 현황
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {platformStats.map((platform) => (
                <Card
                  key={platform.name}
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer border-l-4 ${getPlatformStatusColor(platform.status)}`}
                  onClick={() => handlePlatformCardClick(platform)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{platform.icon}</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {platform.name}
                        </h3>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${platform.color}`}
                      ></div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          오늘 게시
                        </span>
                        <span className="font-bold text-lg">
                          {platform.todayPosts}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          성공/실패
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 font-medium flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {platform.successCount}
                          </span>
                          <span className="text-red-600 font-medium flex items-center">
                            <XCircle className="w-3 h-3 mr-1" />
                            {platform.failureCount}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          실패율
                        </span>
                        <span
                          className={`font-medium ${platform.failureRate > 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {platform.failureRate}%
                        </span>
                      </div>

                      {platform.lastError && (
                        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                          <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate" title={platform.lastError}>
                              {platform.lastError}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 2. 실시간 로그 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                실시간 로그
                <div className="flex items-center ml-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    LIVE
                  </span>
                </div>
              </h2>
              <div className="flex gap-2">
                <select
                  className="px-3 py-1 border rounded-md text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  value={selectedLogLevel}
                  onChange={(e) => setSelectedLogLevel(e.target.value)}
                >
                  <option value="all">전체 레벨</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                  <option value="DEBUG">DEBUG</option>
                </select>
                <select
                  className="px-3 py-1 border rounded-md text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option value="all">전체 플랫폼</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Threads">Threads</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="로그 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={autoScroll ? "bg-blue-50 text-blue-600" : ""}
                >
                  {autoScroll ? (
                    <Wifi className="w-4 h-4" />
                  ) : (
                    <WifiOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="h-96 overflow-y-auto bg-gray-900 dark:bg-gray-800 text-green-400 font-mono text-sm">
                  <div className="p-4 space-y-1">
                    {filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start space-x-3 hover:bg-gray-800 dark:hover:bg-gray-700 p-1 rounded text-xs"
                      >
                        <span className="text-gray-500 text-xs mt-0.5 w-20 flex-shrink-0">
                          {log.timestamp}
                        </span>
                        <span
                          className={`text-xs font-bold mt-0.5 w-12 flex-shrink-0 ${getLogLevelColor(log.level)}`}
                        >
                          [{log.level}]
                        </span>
                        <span className="text-blue-400 text-xs mt-0.5 w-20 flex-shrink-0">
                          [{log.platform}]
                        </span>
                        <span className="text-yellow-400 text-xs mt-0.5 w-12 flex-shrink-0">
                          [{log.workerId}]
                        </span>
                        <span className="text-purple-400 text-xs mt-0.5 w-24 flex-shrink-0">
                          [{log.component}]
                        </span>
                        <span className="text-green-400 flex-1">
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. 예약 게시 관리 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              예약 게시 관리
            </h2>
            <Card className="shadow-lg">
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                          콘텐츠 ID
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                          예약 일시
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                          플랫폼
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                          모드
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                          승인 상태
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                          예약 상태
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900 dark:text-white">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledPosts.map((post) => (
                        <tr
                          key={post.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <td className="p-3 text-gray-900 dark:text-white font-medium">
                            {post.contentId}
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-400">
                            {new Date(post.scheduledTime).toLocaleString("ko-KR")}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            >
                              {post.platform}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={
                                post.mode === "Auto"
                                  ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : "bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                              }
                            >
                              {post.mode}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {getStatusBadge(post.approvalStatus)}
                          </td>
                          <td className="p-3">
                            {getStatusBadge(post.scheduleStatus)}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {post.scheduleStatus === "active" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
                                    onClick={() => handleEditSchedule(post)}
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    편집
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="hover:shadow-md transition-all duration-300 transform hover:scale-105 text-red-600 hover:text-red-700"
                                    onClick={() => handleCancelSchedule(post)}
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    취소
                                  </Button>
                                </>
                              )}
                              {post.scheduleStatus !== "active" && (
                                <span className="text-sm text-gray-500">
                                  {post.scheduleStatus === "cancelled"
                                    ? "취소됨"
                                    : post.scheduleStatus === "completed"
                                      ? "완료됨"
                                      : post.scheduleStatus === "paused"
                                        ? "일시정지됨"
                                        : "-"}
                                </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 플랫폼 상세 모달 */}
        {showDetailModal && selectedPlatformDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedPlatformDetail.name} 최근 게시 내역
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {selectedPlatformDetail.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-3 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">
                        {post.contentId}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${post.status === "성공"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {post.timestamp}
                    </div>
                    {post.error && (
                      <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        {post.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 예약 편집 모달 */}
        {showEditModal && editingSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  예약 시간 편집
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    콘텐츠 ID
                  </label>
                  <span className="text-gray-600">
                    {editingSchedule.contentId}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">플랫폼</label>
                  <span className="text-gray-600">
                    {editingSchedule.platform}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    예약 일시
                  </label>
                  <input
                    type="datetime-local"
                    value={editingSchedule.scheduledTime.slice(0, 16)}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        scheduledTime: e.target.value + ":00",
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveEdit} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 예약 취소 확인 모달 */}
        {showCancelConfirm && cancelingSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  예약 취소 확인
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  정말로 이 예약 게시를 취소하시겠습니까?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="text-sm">
                    <div>
                      <strong>콘텐츠 ID:</strong> {cancelingSchedule.contentId}
                    </div>
                    <div>
                      <strong>플랫폼:</strong> {cancelingSchedule.platform}
                    </div>
                    <div>
                      <strong>예약 시간:</strong>{" "}
                      {new Date(cancelingSchedule.scheduledTime).toLocaleString(
                        "ko-KR",
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="destructive"
                    onClick={handleConfirmCancel}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    취소 확정
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1"
                  >
                    돌아가기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 플랫폼 상세 모달 */}
        {showDetailModal && selectedPlatformDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedPlatformDetail.name} 최근 게시 내역
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {selectedPlatformDetail.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-3 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">
                        {post.contentId}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${post.status === "성공"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {post.timestamp}
                    </div>
                    {post.error && (
                      <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        {post.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 예약 편집 모달 */}
        {showEditModal && editingSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  예약 시간 편집
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    콘텐츠 ID
                  </label>
                  <span className="text-gray-600">
                    {editingSchedule.contentId}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">플랫폼</label>
                  <span className="text-gray-600">
                    {editingSchedule.platform}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    예약 일시
                  </label>
                  <input
                    type="datetime-local"
                    value={editingSchedule.scheduledTime.slice(0, 16)}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        scheduledTime: e.target.value + ":00",
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveEdit} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 예약 취소 확인 모달 */}
        {showCancelConfirm && cancelingSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  예약 취소 확인
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  정말로 이 예약 게시를 취소하시겠습니까?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="text-sm">
                    <div>
                      <strong>콘텐츠 ID:</strong> {cancelingSchedule.contentId}
                    </div>
                    <div>
                      <strong>플랫폼:</strong> {cancelingSchedule.platform}
                    </div>
                    <div>
                      <strong>예약 시간:</strong>{" "}
                      {new Date(cancelingSchedule.scheduledTime).toLocaleString(
                        "ko-KR",
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="destructive"
                    onClick={handleConfirmCancel}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    취소 확정
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1"
                  >
                    돌아가기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}