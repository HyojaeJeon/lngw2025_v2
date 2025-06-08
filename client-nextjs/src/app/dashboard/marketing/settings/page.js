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
  Settings,
  Clock,
  Target,
  Bell,
  Key,
  Brain,
  Database,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  MemoryStick,
  Zap,
  RefreshCw,
  Save,
  TestTube,
  Globe,
  Mail,
  Webhook,
  Eye,
  EyeOff,
  Calendar,
  Gauge,
  Server,
  RotateCcw,
  Play,
  Pause,
  Lock,
  Unlock,
  Facebook,
  Instagram,
  Twitter,
  Music,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";

export default function MarketingSettingsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("scheduling");
  const [showApiKeys, setShowApiKeys] = useState({
    facebook: false,
    tiktok: false,
    twitter: false,
    cloudinary: false,
  });

  // SNS 연동 상태
  const [viewMode, setViewMode] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 시스템 상태 모의 데이터
  const systemHealth = {
    avgResponseTime: {
      ai: 1.2,
      facebook: 0.8,
      tiktok: 1.5,
      instagram: 0.9,
    },
    errorRate: 2.3,
    serverUsage: {
      cpu: 45,
      memory: 67,
    },
  };

  // SNS 채널 데이터
  const snsChannels = [
    {
      id: "facebook_page",
      name: "Facebook 페이지",
      platform: "Facebook",
      icon: <Facebook className="w-6 h-6" />,
      connected: true,
      accountName: "@LN_Partners_Official",
      lastSync: "2025-06-08 14:30",
      permissions: ["콘텐츠 게시", "인사이트 수집", "댓글 관리"],
      status: "active",
      color: "bg-blue-500",
    },
    {
      id: "facebook_reels",
      name: "Facebook 릴스",
      platform: "Facebook",
      icon: <Facebook className="w-6 h-6" />,
      connected: true,
      accountName: "@LN_Partners_Official",
      lastSync: "2025-06-08 14:30",
      permissions: ["릴스 게시", "인사이트 수집"],
      status: "active",
      color: "bg-blue-500",
    },
    {
      id: "instagram_post",
      name: "Instagram 포스트",
      platform: "Instagram",
      icon: <Instagram className="w-6 h-6" />,
      connected: true,
      accountName: "@lnpartners_official",
      lastSync: "2025-06-08 13:45",
      permissions: ["포스트 게시", "스토리 게시", "인사이트 수집"],
      status: "warning",
      color: "bg-pink-500",
    },
    {
      id: "instagram_reels",
      name: "Instagram 릴스",
      platform: "Instagram",
      icon: <Instagram className="w-6 h-6" />,
      connected: false,
      accountName: null,
      lastSync: null,
      permissions: [],
      status: "disconnected",
      color: "bg-pink-500",
    },
    {
      id: "tiktok",
      name: "TikTok",
      platform: "TikTok",
      icon: <Music className="w-6 h-6" />,
      connected: false,
      accountName: null,
      lastSync: null,
      permissions: [],
      status: "error",
      color: "bg-black dark:bg-gray-800",
    },
    {
      id: "twitter",
      name: "Twitter",
      platform: "Twitter",
      icon: <Twitter className="w-6 h-6" />,
      connected: false,
      accountName: null,
      lastSync: null,
      permissions: [],
      status: "disconnected",
      color: "bg-blue-400",
    },
  ];

  // 탭 설정
  const tabs = [
    { id: "scheduling", name: "스케줄링", icon: Clock },
    { id: "ai", name: "AI 설정", icon: Brain },
    { id: "sns", name: "SNS 연동", icon: Globe },
    { id: "system", name: "시스템", icon: Server },
  ];

  // 설정 저장 함수
  const handleSave = (section) => {
    console.log(`Saving ${section} settings`);
    // API 호출 로직
  };

  // API 연결 테스트 함수
  const testApiConnection = (platform) => {
    console.log(`Testing ${platform} API connection`);
    // API 테스트 로직
  };

  // 필터링된 채널 목록
  const filteredChannels = snsChannels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "connected" && channel.connected) ||
                         (filterStatus === "disconnected" && !channel.connected);
    return matchesSearch && matchesFilter;
  });

  // 상태별 배지 렌더링
  const getStatusBadge = (status, connected) => {
    if (!connected) {
      return <Badge variant="destructive">연결 끊김</Badge>;
    }

    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">활성</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">주의</Badge>;
      case "error":
        return <Badge variant="destructive">오류</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  // SNS 연동 상태 요약
  const connectionSummary = {
    total: snsChannels.length,
    connected: snsChannels.filter(ch => ch.connected).length,
    active: snsChannels.filter(ch => ch.status === "active").length,
    warning: snsChannels.filter(ch => ch.status === "warning").length,
    error: snsChannels.filter(ch => ch.status === "error").length,
  };

  const renderSnsIntegrationTab = () => (
    <div className="space-y-6">
      {/* 연동 상태 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {connectionSummary.total}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                전체 채널
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {connectionSummary.connected}
              </div>
              <div className="text-sm text-green-800 dark:text-green-300 font-medium">
                연결됨
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {connectionSummary.active}
              </div>
              <div className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                정상 작동
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {connectionSummary.warning}
              </div>
              <div className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                주의 필요
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {connectionSummary.error}
              </div>
              <div className="text-sm text-red-800 dark:text-red-300 font-medium">
                오류 발생
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 뷰 옵션 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              SNS 채널 관리
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="채널 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-60"
                  />
                </div>
                <div className="flex gap-1 border rounded-md">
                  <Button
                    variant={filterStatus === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className="text-xs"
                  >
                    전체
                  </Button>
                  <Button
                    variant={filterStatus === "connected" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterStatus("connected")}
                    className="text-xs"
                  >
                    연결됨
                  </Button>
                  <Button
                    variant={filterStatus === "disconnected" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterStatus("disconnected")}
                    className="text-xs"
                  >
                    연결 끊김
                  </Button>
                </div>
              </div>
              <div className="flex gap-1 border rounded-md">
                <Button
                  variant={viewMode === "card" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("card")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChannels.map((channel) => (
                <Card
                  key={channel.id}
                  className={`hover:shadow-md transition-all duration-300 ${
                    channel.connected
                      ? "border-green-200 dark:border-green-700"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${channel.color} text-white`}>
                          {channel.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base">{channel.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {channel.platform}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(channel.status, channel.connected)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {channel.connected ? (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            연결된 계정
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {channel.accountName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            마지막 동기화
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {channel.lastSync}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            권한 범위
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {channel.permissions.map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            동기화
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1">
                            연결 해제
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          이 채널은 아직 연결되지 않았습니다.
                        </p>
                        <Button className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          연결하기
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${channel.color} text-white`}>
                      {channel.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{channel.name}</h3>
                        {getStatusBadge(channel.status, channel.connected)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {channel.connected
                          ? `${channel.accountName} • 마지막 동기화: ${channel.lastSync}`
                          : "연결되지 않음"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {channel.connected ? (
                      <>
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        연결하기
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSchedulingTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            자동 게시 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">자동 게시 활성화</span>
              <Button size="sm" variant="outline">
                <Play className="w-4 h-4 mr-2" />
                활성화
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">게시 시간 간격</span>
              <select className="px-3 py-1 border rounded text-sm">
                <option>30분</option>
                <option>1시간</option>
                <option>2시간</option>
                <option>4시간</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">최대 일일 게시 수</span>
              <Input type="number" defaultValue="10" className="w-20 text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            게시 일정 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">주말 게시</span>
              <Button size="sm" variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                비활성화
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">최적 게시 시간 사용</span>
              <Button size="sm" variant="default">
                <Zap className="w-4 h-4 mr-2" />
                활성화
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">시간대</span>
              <select className="px-3 py-1 border rounded text-sm">
                <option>Asia/Seoul</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAiTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            AI 콘텐츠 생성 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AI 자동 생성</span>
              <Button size="sm" variant="default">
                <CheckCircle className="w-4 h-4 mr-2" />
                활성화
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">창의성 수준</span>
              <select className="px-3 py-1 border rounded text-sm">
                <option>보수적</option>
                <option>균형적</option>
                <option>창의적</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">언어 모델</span>
              <select className="px-3 py-1 border rounded text-sm">
                <option>GPT-4</option>
                <option>GPT-3.5</option>
                <option>Claude</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            콘텐츠 품질 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">자동 검토</span>
              <Button size="sm" variant="default">
                <Shield className="w-4 h-4 mr-2" />
                활성화
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">최소 품질 점수</span>
              <Input type="number" defaultValue="80" className="w-20 text-sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">해시태그 자동 생성</span>
              <Button size="sm" variant="default">
                <CheckCircle className="w-4 h-4 mr-2" />
                활성화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              시스템 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">CPU 사용률</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{width: `${systemHealth.serverUsage.cpu}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{systemHealth.serverUsage.cpu}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">메모리 사용률</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{width: `${systemHealth.serverUsage.memory}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{systemHealth.serverUsage.memory}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">오류율</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {systemHealth.errorRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              API 응답 시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">AI 서비스</span>
                <span className="text-sm font-medium">{systemHealth.avgResponseTime.ai}초</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Facebook</span>
                <span className="text-sm font-medium">{systemHealth.avgResponseTime.facebook}초</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Instagram</span>
                <span className="text-sm font-medium">{systemHealth.avgResponseTime.instagram}초</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">TikTok</span>
                <span className="text-sm font-medium">{systemHealth.avgResponseTime.tiktok}초</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              데이터베이스
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">연결 상태</span>
                <Badge className="bg-green-500 hover:bg-green-600">정상</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">마지막 백업</span>
                <span className="text-sm font-medium">2시간 전</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">스토리지 사용량</span>
                <span className="text-sm font-medium">2.1GB / 10GB</span>
              </div>
              <Button size="sm" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                백업 실행
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-none space-y-6 animate-fadeIn">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          마케팅 설정
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          마케팅 자동화 시스템의 모든 설정을 관리하세요
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="mt-6">
        {activeTab === "scheduling" && renderSchedulingTab()}
        {activeTab === "ai" && renderAiTab()}
        {activeTab === "sns" && renderSnsIntegrationTab()}
        {activeTab === "system" && renderSystemTab()}
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button onClick={() => handleSave(activeTab)} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}