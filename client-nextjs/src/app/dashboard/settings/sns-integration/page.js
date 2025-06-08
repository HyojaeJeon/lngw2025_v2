
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
import { useLanguage } from "@/contexts/languageContext.js";
import {
  Facebook,
  Instagram,
  Music,
  Youtube,
  Twitter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Link,
  Unlink,
  Shield,
  Eye,
  MessageSquare,
  BarChart3,
  Clock,
  Settings,
  Globe,
  Users,
  Zap,
  Grid3X3,
  List,
} from "lucide-react";

export default function SnsIntegrationPage() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" 또는 "list"
  const [channels, setChannels] = useState([
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      isConnected: true,
      accountInfo: {
        username: "@LN_Partners_Official",
        pageId: "123456789012345",
        followers: "12.5K",
      },
      permissions: [
        { name: "콘텐츠 게시", granted: true },
        { name: "인사이트 수집", granted: true },
        { name: "댓글 관리", granted: true },
      ],
      lastSync: "2024-01-15 14:30",
      status: "active",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      isConnected: true,
      accountInfo: {
        username: "@ln_partners_korea",
        userId: "17841234567890",
        followers: "8.2K",
      },
      permissions: [
        { name: "콘텐츠 게시", granted: true },
        { name: "인사이트 수집", granted: true },
        { name: "댓글 관리", granted: false },
      ],
      lastSync: "2024-01-15 14:25",
      status: "warning",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: Music,
      color: "bg-black",
      isConnected: false,
      accountInfo: null,
      permissions: [],
      lastSync: null,
      status: "disconnected",
    },
    {
      id: "youtube",
      name: "YouTube Shorts",
      icon: Youtube,
      color: "bg-red-600",
      isConnected: false,
      accountInfo: null,
      permissions: [],
      lastSync: null,
      status: "disconnected",
    },
    {
      id: "twitter",
      name: "Twitter (X)",
      icon: Twitter,
      color: "bg-gray-900",
      isConnected: false,
      accountInfo: null,
      permissions: [],
      lastSync: null,
      status: "disconnected",
    },
  ]);

  const handleConnect = async (channelId) => {
    setIsLoading(true);
    try {
      // OAuth 인증 시뮬레이션
      console.log(`Connecting to ${channelId}...`);
      
      // 실제 구현에서는 OAuth 팝업을 열고 인증을 처리
      const authWindow = window.open(
        `/api/auth/${channelId}`,
        'oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // 인증 완료 대기 (실제로는 postMessage로 처리)
      setTimeout(() => {
        setChannels(prev => prev.map(channel => 
          channel.id === channelId 
            ? {
                ...channel,
                isConnected: true,
                accountInfo: {
                  username: `@test_${channelId}`,
                  userId: Math.random().toString(36).substr(2, 15),
                  followers: Math.floor(Math.random() * 10000) + "K",
                },
                permissions: [
                  { name: "콘텐츠 게시", granted: true },
                  { name: "인사이트 수집", granted: true },
                  { name: "댓글 관리", granted: true },
                ],
                lastSync: new Date().toLocaleString(),
                status: "active"
              }
            : channel
        ));
        if (authWindow) authWindow.close();
      }, 2000);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (channelId) => {
    if (!confirm('정말로 연결을 해제하시겠습니까?')) return;
    
    setIsLoading(true);
    try {
      // API 호출로 연결 해제 처리
      console.log(`Disconnecting from ${channelId}...`);
      
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? {
              ...channel,
              isConnected: false,
              accountInfo: null,
              permissions: [],
              lastSync: null,
              status: "disconnected"
            }
          : channel
      ));
    } catch (error) {
      console.error('Disconnection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (channelId) => {
    setIsLoading(true);
    try {
      console.log(`Syncing ${channelId}...`);
      
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? {
              ...channel,
              lastSync: new Date().toLocaleString(),
              status: "active"
            }
          : channel
      ));
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            연결됨
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            권한 부족
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <XCircle className="w-3 h-3 mr-1" />
            연결 안됨
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {channels.map((channel) => {
        const IconComponent = channel.icon;
        return (
          <Card key={channel.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${channel.color} text-white`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{channel.name}</h3>
                    {channel.isConnected && channel.accountInfo && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {channel.accountInfo.username}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(channel.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {channel.isConnected ? (
                <>
                  {/* 계정 정보 */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      계정 정보
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>사용자명: {channel.accountInfo.username}</p>
                      <p>팔로워: {channel.accountInfo.followers}</p>
                      {channel.accountInfo.pageId && (
                        <p>페이지 ID: {channel.accountInfo.pageId}</p>
                      )}
                      {channel.accountInfo.userId && (
                        <p>사용자 ID: {channel.accountInfo.userId}</p>
                      )}
                    </div>
                  </div>

                  {/* 권한 상태 */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      권한 범위
                    </h4>
                    <div className="space-y-2">
                      {channel.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{permission.name}</span>
                          {permission.granted ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 동기화 정보 */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">마지막 동기화</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {channel.lastSync}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(channel.id)}
                        disabled={isLoading}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        동기화
                      </Button>
                    </div>
                  </div>

                  {/* 연결 해제 버튼 */}
                  <Button
                    variant="outline"
                    onClick={() => handleDisconnect(channel.id)}
                    disabled={isLoading}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Unlink className="w-4 h-4 mr-2" />
                    연결 해제
                  </Button>
                </>
              ) : (
                <>
                  {/* 연결되지 않은 상태 */}
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className={`inline-flex p-4 rounded-full ${channel.color} text-white opacity-50`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {channel.name} 계정이 연결되지 않았습니다
                    </p>
                    <Button
                      onClick={() => handleConnect(channel.id)}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Link className="w-4 h-4 mr-2" />
                      {isLoading ? '연결 중...' : '연결하기'}
                    </Button>
                  </div>

                  {/* 연결 시 제공되는 기능 미리보기 */}
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">연결 시 이용 가능한 기능</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        자동 콘텐츠 게시
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        성과 데이터 수집
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        실시간 모니터링
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <Card>
      <CardHeader>
        <CardTitle>채널 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {channels.map((channel) => {
            const IconComponent = channel.icon;
            return (
              <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${channel.color} text-white`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{channel.name}</h3>
                      {getStatusBadge(channel.status)}
                    </div>
                    {channel.isConnected && channel.accountInfo ? (
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>{channel.accountInfo.username}</span>
                        <span className="mx-2">•</span>
                        <span>팔로워: {channel.accountInfo.followers}</span>
                        {channel.lastSync && (
                          <>
                            <span className="mx-2">•</span>
                            <span>마지막 동기화: {channel.lastSync}</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        연결되지 않음
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {channel.isConnected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(channel.id)}
                        disabled={isLoading}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(channel.id)}
                        disabled={isLoading}
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Unlink className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(channel.id)}
                      disabled={isLoading}
                      size="sm"
                    >
                      <Link className="w-4 h-4 mr-1" />
                      연결하기
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 transform transition-all duration-500 hover:scale-105 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SNS 채널 연동 관리
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              소셜미디어 계정을 연결하고 권한을 관리하세요
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "card" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("card")}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              카드
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4 mr-1" />
              리스트
            </Button>
          </div>
        </div>
      </div>

      {/* 전체 상태 요약 - 다크테마 가시성 개선 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            연동 상태 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900 dark:text-green-100">연결된 채널</span>
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {channels.filter(c => c.isConnected).length}
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">권한 문제</span>
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {channels.filter(c => c.status === "warning").length}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">총 팔로워</span>
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">20.7K</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">활성 연동</span>
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {channels.filter(c => c.status === "active").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 채널별 연동 관리 - 뷰 모드에 따라 렌더링 */}
      {viewMode === "card" ? renderCardView() : renderListView()}

      {/* 도움말 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            연동 가이드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">연결 방법</h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>원하는 SNS 채널의 '연결하기' 버튼을 클릭</li>
                <li>해당 SNS 로그인 페이지에서 인증</li>
                <li>권한 승인 후 자동으로 연결 완료</li>
                <li>연동 상태 및 권한 확인</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">주의사항</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>계정 연결 시 필요한 권한만 요청됩니다</li>
                <li>언제든지 연결을 해제할 수 있습니다</li>
                <li>권한 문제 발생 시 재연결을 시도해보세요</li>
                <li>데이터는 안전하게 암호화되어 저장됩니다</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
