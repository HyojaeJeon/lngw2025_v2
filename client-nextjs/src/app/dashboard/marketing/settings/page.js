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

  const tabs = [
    { id: "scheduling", name: "스케줄링 설정", icon: Clock },
    { id: "abtest", name: "A/B 테스트 기준", icon: Target },
    { id: "notifications", name: "알림 채널", icon: Bell },
    { id: "apikeys", name: "API 키 관리", icon: Key },
    { id: "aimodels", name: "AI 모델 설정", icon: Brain },
    { id: "storage", name: "데이터 저장소", icon: Database },
    { id: "security", name: "보안 및 인증", icon: Shield },
    { id: "monitoring", name: "시스템 모니터링", icon: Activity },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "scheduling":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  콘텐츠 생성 및 수집 스케줄
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      콘텐츠 생성 스케줄
                    </label>
                    <Input placeholder="0 9 * * *" defaultValue="0 9 * * *" />
                    <p className="text-xs text-gray-500 mt-1">
                      매일 오전 9시 (Cron 표현식)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      성과 수집 스케줄
                    </label>
                    <Input placeholder="0 10 * * *" defaultValue="0 10 * * *" />
                    <p className="text-xs text-gray-500 mt-1">
                      매일 오전 10시 (Cron 표현식)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      A/B 테스트 지연 설정 (분)
                    </label>
                    <Input type="number" placeholder="2" defaultValue="2" />
                    <p className="text-xs text-gray-500 mt-1">
                      변형 간 최소 지연 시간
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      자동 재시도 횟수
                    </label>
                    <Input type="number" placeholder="3" defaultValue="3" />
                    <p className="text-xs text-gray-500 mt-1">
                      게시 실패 시 재시도 횟수
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleSave("scheduling")}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  스케줄링 설정 저장
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "abtest":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  플랫폼별 우선순위 가중치
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Facebook Engagement 가중치
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.3"
                        className="w-32"
                      />
                      <span className="text-sm w-8">0.3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      TikTok Views 가중치
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.5"
                        className="w-32"
                      />
                      <span className="text-sm w-8">0.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Instagram Reach 가중치
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.2"
                        className="w-32"
                      />
                      <span className="text-sm w-8">0.2</span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <label className="text-sm font-medium block mb-2">
                    최종 승자 기준
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="winner_criteria"
                        value="weighted"
                        defaultChecked
                        className="mr-2"
                      />
                      가중치 합산 점수 기준
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="winner_criteria"
                        value="priority"
                        className="mr-2"
                      />
                      특정 플랫폼 우선 순위
                    </label>
                  </div>
                </div>
                <Button onClick={() => handleSave("abtest")} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  A/B 테스트 설정 저장
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  알림 채널 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Slack Webhook URL
                  </label>
                  <Input placeholder="https://hooks.slack.com/..." type="url" />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    관리자 이메일 주소
                  </label>
                  <Input placeholder="admin@company.com, manager@company.com" />
                  <p className="text-xs text-gray-500 mt-1">
                    쉼표로 구분하여 여러 이메일 입력
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-3">
                    알림 대상 이벤트
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "content_created", label: "콘텐츠 생성 완료" },
                      { id: "approval_request", label: "승인 요청 도착" },
                      { id: "post_success", label: "게시 성공" },
                      { id: "post_failure", label: "게시 실패" },
                      { id: "abtest_end", label: "A/B 테스트 종료" },
                      { id: "ai_error", label: "AI 오류 발생" },
                    ].map((event) => (
                      <label key={event.id} className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mr-2"
                        />
                        {event.label}
                      </label>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => handleSave("notifications")}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  알림 설정 저장
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "apikeys":
        return (
          <div className="space-y-6">
            {[
              {
                platform: "facebook",
                name: "Facebook/Instagram",
                fields: ["Page ID", "Access Token"],
              },
              {
                platform: "tiktok",
                name: "TikTok",
                fields: ["Client Key", "Client Secret", "Redirect URI"],
              },
              {
                platform: "twitter",
                name: "Twitter",
                fields: ["API Key", "API Secret", "Bearer Token"],
              },
              {
                platform: "cloudinary",
                name: "Cloudinary",
                fields: ["Cloud Name", "API Key", "API Secret"],
              },
            ].map((api) => (
              <Card key={api.platform}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      {api.name} API 설정
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        연결됨
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testApiConnection(api.platform)}
                      >
                        <TestTube className="w-4 h-4 mr-1" />
                        테스트
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {api.fields.map((field) => (
                    <div key={field}>
                      <label className="text-sm font-medium">{field}</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type={showApiKeys[api.platform] ? "text" : "password"}
                          placeholder={`Enter ${field}`}
                          defaultValue="●●●●●●●●●●●●●●●●"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShowApiKeys((prev) => ({
                              ...prev,
                              [api.platform]: !prev[api.platform],
                            }))
                          }
                        >
                          {showApiKeys[api.platform] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => handleSave(`api_${api.platform}`)}
                    className="w-full mt-4"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {api.name} 설정 저장
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "aimodels":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Google AI Ultra 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Temperature (창의성)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        defaultValue="0.7"
                        className="flex-1"
                      />
                      <span className="text-sm w-8">0.7</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Max Output Tokens
                    </label>
                    <Input type="number" defaultValue="1024" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Top-p
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.9"
                        className="flex-1"
                      />
                      <span className="text-sm w-8">0.9</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Stability AI 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      CFG Scale
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        defaultValue="7"
                        className="flex-1"
                      />
                      <span className="text-sm w-8">7</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">이미지 해상도</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="1024x1024">1024×1024 (정사각형)</option>
                      <option value="1024x768">1024×768 (가로형)</option>
                      <option value="768x1024">768×1024 (세로형)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">샘플 수</label>
                    <Input type="number" min="1" max="4" defaultValue="1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  RunwayML 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      영상 길이 (초)
                    </label>
                    <Input type="number" min="3" max="10" defaultValue="5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">해상도</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="720x1280">720×1280 (세로형)</option>
                      <option value="1080x1920">
                        1080×1920 (고화질 세로형)
                      </option>
                      <option value="1280x720">1280×720 (가로형)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => handleSave("aimodels")} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              AI 모델 설정 저장
            </Button>
          </div>
        );

      case "storage":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  데이터 저장소 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Google Sheets 사용</h4>
                    <p className="text-sm text-gray-500">
                      간단한 데이터 저장 및 공유
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="scale-125" />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    데이터베이스 연결 문자열
                  </label>
                  <Input placeholder="mongodb://localhost:27017/marketing or mysql://..." />
                  <p className="text-xs text-gray-500 mt-1">
                    RDBMS 또는 MongoDB 연결 문자열
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">백업 주기 설정</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="daily">매일 DB 스냅샷</option>
                    <option value="weekly">
                      주간 Google Sheets CSV 내보내기
                    </option>
                    <option value="both">둘 다 활성화</option>
                  </select>
                </div>
                <Button
                  onClick={() => handleSave("storage")}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  저장소 설정 저장
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  보안 및 인증 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Webhook 검증 토큰
                  </label>
                  <Input placeholder="Facebook/Instagram Webhook 검증용 토큰" />
                </div>
                <div>
                  <label className="text-sm font-medium">IP 화이트리스트</label>
                  <Input placeholder="192.168.1.1, 10.0.0.1" />
                  <p className="text-xs text-gray-500 mt-1">
                    쉼표로 구분하여 허용 IP 입력
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">2단계 인증 (2FA)</h4>
                    <p className="text-sm text-gray-500">
                      관리자 계정 보안 강화
                    </p>
                  </div>
                  <input type="checkbox" className="scale-125" />
                </div>
                <div>
                  <label className="text-sm font-medium">로그 레벨 설정</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="DEBUG">DEBUG (모든 로그)</option>
                    <option value="INFO">INFO (일반 정보)</option>
                    <option value="WARN">WARN (경고 이상)</option>
                    <option value="ERROR">ERROR (오류만)</option>
                  </select>
                </div>
                <Button
                  onClick={() => handleSave("security")}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  보안 설정 저장
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "monitoring":
        return (
          <div className="space-y-6">
            {/* 시스템 상태 배너 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  실시간 시스템 상태
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI API 응답</span>
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {systemHealth.avgResponseTime.ai}s
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">플랫폼 API</span>
                      <Globe className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-green-600">0.9s</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">오류율</span>
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <p className="text-lg font-bold text-yellow-600">
                      {systemHealth.errorRate}%
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">서버 사용량</span>
                      <Server className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-lg font-bold text-purple-600">
                      CPU {systemHealth.serverUsage.cpu}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 오류 로그 대시보드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    오류 로그 대시보드
                  </span>
                  <div className="flex gap-2">
                    <select className="text-sm border rounded px-2 py-1">
                      <option>지난 24시간</option>
                      <option>지난 7일</option>
                      <option>지난 30일</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: "2024-01-15 14:30",
                      module: "AI 텍스트 생성",
                      error: "API rate limit exceeded",
                      severity: "high",
                    },
                    {
                      time: "2024-01-15 14:25",
                      module: "Facebook API",
                      error: "Token expired",
                      severity: "medium",
                    },
                    {
                      time: "2024-01-15 14:20",
                      module: "TikTok 업로드",
                      error: "File size too large",
                      severity: "low",
                    },
                  ].map((log, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            log.severity === "high"
                              ? "destructive"
                              : log.severity === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {log.severity === "high"
                            ? "심각"
                            : log.severity === "medium"
                              ? "경고"
                              : "정보"}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{log.module}</p>
                          <p className="text-xs text-gray-500">{log.time}</p>
                        </div>
                      </div>
                      <p className="text-sm">{log.error}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 재시도 큐 상태 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    재시도 큐 상태
                  </span>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    전체 재시도
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium">
                    재시도 대기 중인 작업:{" "}
                    <span className="font-bold">3건</span>
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: "P001",
                      content: "Instagram 게시물",
                      attempts: 2,
                      lastTry: "5분 전",
                    },
                    {
                      id: "P002",
                      content: "TikTok 동영상",
                      attempts: 1,
                      lastTry: "10분 전",
                    },
                    {
                      id: "P003",
                      content: "Facebook 포스트",
                      attempts: 3,
                      lastTry: "15분 전",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.content}</p>
                        <p className="text-xs text-gray-500">
                          시도 횟수: {item.attempts}, 마지막: {item.lastTry}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Webhook 상태 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-5 h-5" />
                  Webhook 및 외부 서비스 상태
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      service: "Facebook Webhook",
                      status: "connected",
                      lastEvent: "2분 전",
                    },
                    {
                      service: "Instagram Webhook",
                      status: "connected",
                      lastEvent: "1분 전",
                    },
                    {
                      service: "Google AI Ultra",
                      status: "connected",
                      lastEvent: "30초 전",
                    },
                    {
                      service: "Stability AI",
                      status: "warning",
                      lastEvent: "5분 전",
                    },
                    {
                      service: "RunwayML",
                      status: "connected",
                      lastEvent: "1분 전",
                    },
                    {
                      service: "Database",
                      status: "connected",
                      lastEvent: "실시간",
                    },
                  ].map((service) => (
                    <div
                      key={service.service}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{service.service}</p>
                        <p className="text-xs text-gray-500">
                          마지막 이벤트: {service.lastEvent}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            service.status === "connected"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            service.status === "connected"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {service.status === "connected" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {service.status === "connected" ? "정상" : "오류"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <TestTube className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
          {t("marketing.settings")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          마케팅 자동화 시스템 설정 및 모니터링
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                      ${
                        activeTab === tab.id
                          ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }
                    `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 탭 콘텐츠 */}
      <div className="min-h-[600px]">{renderTabContent()}</div>
    </div>
  );
}
