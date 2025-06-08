
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Target,
  Users,
  Calendar,
  ArrowLeft,
  Edit,
  Save,
  MessageSquare,
  Clock,
  User,
  TrendingUp,
  ExternalLink,
  Link,
  BarChart3,
  ChevronRight,
  CheckCircle,
  Circle,
  AlertCircle,
  Plus,
  Send,
  Activity,
  History,
  FileText,
  Eye,
  Settings,
  Zap,
  Globe,
  Star,
  ThumbsUp,
  Share2,
  MessageCircle,
  AtSign,
} from "lucide-react";

export default function MarketingPlanDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const planId = params.id;

  // 마케팅 계획 상세 데이터 (실제로는 API에서 가져옴)
  const [planDetail, setPlanDetail] = useState({
    id: 1,
    title: "2025년 1분기 마케팅 계획",
    manager: "김마케팅",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    status: "진행중",
    progress: 72,
    description: "Z세대 타겟 브랜드 인지도 확산 및 온라인 매출 증대를 위한 종합 마케팅 전략",
    createdAt: "2025-01-15",
    updatedAt: "2025-06-08",
    objectives: [
      {
        id: 1,
        title: "Z세대 인지도 확보",
        progress: 71,
        keyResults: [
          {
            id: 1,
            title: "틱톡 팔로워 5만 달성",
            targetValue: 50000,
            currentValue: 40000,
            progress: 80,
            unit: "명",
            connectedMetric: "인사이트 > TikTok 채널 > 팔로워 수",
            isConnected: true
          },
          {
            id: 2,
            title: "브랜드 인지도 20% 증가",
            targetValue: 20,
            currentValue: 13,
            progress: 65,
            unit: "%",
            connectedMetric: "설문조사(수동입력)",
            isConnected: true
          },
          {
            id: 3,
            title: "UGC 콘텐츠 100건 수집",
            targetValue: 100,
            currentValue: 70,
            progress: 70,
            unit: "건",
            connectedMetric: "참여도 관리",
            isConnected: true
          }
        ]
      },
      {
        id: 2,
        title: "온라인 매출 증대",
        progress: 73,
        keyResults: [
          {
            id: 4,
            title: "온라인 매출 30% 증가",
            targetValue: 30,
            currentValue: 22,
            progress: 73,
            unit: "%",
            connectedMetric: "매출 분석 > 온라인 채널",
            isConnected: true
          },
          {
            id: 5,
            title: "전환율 3.5% 달성",
            targetValue: 3.5,
            currentValue: 2.8,
            progress: 80,
            unit: "%",
            connectedMetric: "인사이트 > 전환율",
            isConnected: true
          },
          {
            id: 6,
            title: "고객 생애가치 25% 향상",
            targetValue: 25,
            currentValue: 15,
            progress: 60,
            unit: "%",
            connectedMetric: null,
            isConnected: false
          }
        ]
      }
    ],
    initiatives: [
      {
        id: 1,
        name: "여름 바캉스 캠페인",
        status: "진행중",
        linkedToCampaign: true,
        campaignId: "camp001",
        performance: {
          reach: "1.2M",
          engagement: "85K",
          budget: "₩3,500,000",
          roi: "240%"
        }
      },
      {
        id: 2,
        name: "대학생 앰배서더 운영",
        status: "진행중",
        linkedToCampaign: true,
        campaignId: "camp002",
        performance: {
          content: "25건",
          reach: "680K",
          budget: "₩2,000,000",
          roi: "180%"
        }
      },
      {
        id: 3,
        name: "인플루언서 협업 프로젝트",
        status: "완료",
        linkedToCampaign: true,
        campaignId: "camp003",
        performance: {
          collaborations: "12건",
          reach: "2.1M",
          budget: "₩5,000,000",
          roi: "320%"
        }
      }
    ]
  });

  // 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(planDetail.status);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [selectedKR, setSelectedKR] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "박기획",
      content: "Q2 목표 달성률이 예상보다 높네요! 👍",
      timestamp: "2025-06-08 14:30",
      mentions: []
    },
    {
      id: 2,
      author: "이분석",
      content: "@김마케팅 틱톡 팔로워 증가세가 좋습니다. 이 추세라면 목표 달성 가능할 것 같아요.",
      timestamp: "2025-06-08 10:15",
      mentions: ["김마케팅"]
    }
  ]);

  // 히스토리 데이터
  const [history, setHistory] = useState([
    {
      id: 1,
      action: "상태 변경",
      detail: "계획됨 → 진행중",
      author: "김마케팅",
      timestamp: "2025-01-20 09:00"
    },
    {
      id: 2,
      action: "목표 수정",
      detail: "틱톡 팔로워 목표를 4만에서 5만으로 상향 조정",
      author: "김마케팅",
      timestamp: "2025-02-15 16:30"
    },
    {
      id: 3,
      action: "활동 연결",
      detail: "여름 바캉스 캠페인을 주요 활동에 연결",
      author: "박기획",
      timestamp: "2025-03-01 11:20"
    }
  ]);

  // 가용 메트릭 데이터 (실제로는 인사이트 모듈에서 가져옴)
  const [availableMetrics, setAvailableMetrics] = useState([
    { id: "tiktok_followers", name: "TikTok 팔로워 수", category: "TikTok 채널" },
    { id: "instagram_followers", name: "Instagram 팔로워 수", category: "Instagram 채널" },
    { id: "brand_awareness", name: "브랜드 인지도", category: "설문조사" },
    { id: "conversion_rate", name: "전환율", category: "웹사이트 분석" },
    { id: "online_revenue", name: "온라인 매출", category: "매출 분석" },
    { id: "customer_ltv", name: "고객 생애가치", category: "고객 분석" },
    { id: "ugc_count", name: "UGC 콘텐츠 수", category: "참여도 관리" }
  ]);

  // 상태 배지 렌더링
  const getStatusBadge = (status) => {
    switch (status) {
      case "진행중":
        return <Badge className="bg-blue-500 hover:bg-blue-600">진행중</Badge>;
      case "계획됨":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">계획됨</Badge>;
      case "완료":
        return <Badge className="bg-green-500 hover:bg-green-600">완료</Badge>;
      case "보류":
        return <Badge className="bg-gray-500 hover:bg-gray-600">보류</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 상태 변경 핸들러
  const handleStatusChange = () => {
    setPlanDetail(prev => ({ ...prev, status: editedStatus }));
    setIsEditing(false);

    // 히스토리에 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "상태 변경",
      detail: `${planDetail.status} → ${editedStatus}`,
      author: "현재 사용자",
      timestamp: new Date().toLocaleString('ko-KR')
    };
    setHistory(prev => [newHistoryItem, ...prev]);
  };

  // 메트릭 연결 핸들러
  const handleMetricConnect = (metricId) => {
    const selectedMetric = availableMetrics.find(m => m.id === metricId);
    
    setPlanDetail(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => ({
        ...obj,
        keyResults: obj.keyResults.map(kr => 
          kr.id === selectedKR.id 
            ? { ...kr, connectedMetric: `${selectedMetric.category} > ${selectedMetric.name}`, isConnected: true }
            : kr
        )
      }))
    }));

    setShowMetricModal(false);
    setSelectedKR(null);

    // 히스토리에 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "메트릭 연결",
      detail: `"${selectedKR.title}"에 "${selectedMetric.name}" 연결`,
      author: "현재 사용자",
      timestamp: new Date().toLocaleString('ko-KR')
    };
    setHistory(prev => [newHistoryItem, ...prev]);
  };

  // 댓글 추가 핸들러
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentItem = {
      id: comments.length + 1,
      author: "현재 사용자",
      content: newComment,
      timestamp: new Date().toLocaleString('ko-KR'),
      mentions: newComment.match(/@\w+/g) || []
    };

    setComments(prev => [newCommentItem, ...prev]);
    setNewComment("");
  };

  // 메트릭 연결 모달 렌더링
  const renderMetricModal = () => {
    if (!showMetricModal || !selectedKR) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              메트릭 연결: {selectedKR.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              인사이트 모듈의 측정 항목을 선택하여 자동 데이터 연결을 설정하세요
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {availableMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleMetricConnect(metric.id)}
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {metric.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metric.category}
                    </p>
                  </div>
                  <Button size="sm">연결</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowMetricModal(false)}>
                취소
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-none space-y-6 animate-fadeIn">
      {/* 뒤로가기 및 네비게이션 */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로
        </Button>
        <div className="flex items-center text-sm text-gray-500">
          <span>마케팅</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>계획 및 프로세스</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 dark:text-white font-medium">
            {planDetail.title}
          </span>
        </div>
      </div>

      {/* 헤더 영역: 요약 및 제어 */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-3">{planDetail.title}</CardTitle>
              
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">담당자:</span>
                  <span className="text-sm font-medium">{planDetail.manager}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">기간:</span>
                  <span className="text-sm font-medium">
                    {planDetail.startDate} ~ {planDetail.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">최근 업데이트:</span>
                  <span className="text-sm font-medium">{planDetail.updatedAt}</span>
                </div>
              </div>

              {/* 상태 변경 */}
              <div className="flex items-center gap-4 mb-4">
                {!isEditing ? (
                  <>
                    {getStatusBadge(planDetail.status)}
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-1" />
                      상태 변경
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    >
                      <option value="계획됨">계획됨</option>
                      <option value="진행중">진행중</option>
                      <option value="완료">완료</option>
                      <option value="보류">보류</option>
                    </select>
                    <Button size="sm" onClick={handleStatusChange}>
                      <Save className="w-4 h-4 mr-1" />
                      저장
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      취소
                    </Button>
                  </div>
                )}
              </div>

              {/* 전체 진행률 바 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    전체 진행률
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {planDetail.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{width: `${planDetail.progress}%`}}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  목표 달성도와 주요 활동 완료율을 기반으로 자동 계산됨
                </p>
              </div>
            </div>
          </div>

          {/* 계획 설명 */}
          {planDetail.description && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">{planDetail.description}</p>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* 메인 콘텐츠 영역 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 왼쪽: 목표 달성도 (OKRs) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* 목표 달성도 트래킹 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                목표 달성도 (OKRs) 트래킹
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {planDetail.objectives.map((objective) => (
                <div key={objective.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {objective.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">달성률:</span>
                      <span className="text-lg font-bold text-blue-600">{objective.progress}%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {objective.keyResults.map((kr) => (
                      <div key={kr.id} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {kr.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {kr.isConnected ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Activity className="w-3 h-3 mr-1" />
                                연결됨
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedKR(kr);
                                  setShowMetricModal(true);
                                }}
                              >
                                <Link className="w-3 h-3 mr-1" />
                                데이터 연결
                              </Button>
                            )}
                          </div>
                        </div>

                        {kr.isConnected ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                진행률: {kr.progress}%
                              </span>
                              <span className="font-medium">
                                {kr.currentValue.toLocaleString()}{kr.unit} / {kr.targetValue.toLocaleString()}{kr.unit}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{width: `${kr.progress}%`}}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              데이터: {kr.connectedMetric}
                            </p>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            데이터 연결이 필요합니다
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 주요 활동 과정 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                주요 활동 과정 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planDetail.initiatives.map((initiative) => (
                  <div key={initiative.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {initiative.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(initiative.status)}
                          {initiative.linkedToCampaign && (
                            <Badge variant="outline" className="text-xs">
                              캠페인연동
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        상세보기
                      </Button>
                    </div>

                    {/* 성과 요약 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      {Object.entries(initiative.performance).map(([key, value]) => (
                        <div key={key} className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <p className="text-xs text-gray-500 capitalize">{key}</p>
                          <p className="font-semibold text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 커뮤니케이션 및 히스토리 */}
        <div className="space-y-6">
          
          {/* 댓글 (커뮤니케이션) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                댓글
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 댓글 입력 */}
              <div className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="의견을 나누거나 진행 상황을 공유해보세요... (@로 담당자 호출 가능)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
                <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="w-4 h-4 mr-1" />
                  댓글 추가
                </Button>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-purple-200 pl-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 히스토리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-orange-500" />
                변경 히스토리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {history.map((item) => (
                  <div key={item.id} className="border-l-2 border-orange-200 pl-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.action}
                      </span>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      {item.detail}
                    </p>
                    <p className="text-xs text-gray-500">by {item.author}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 빠른 액션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                빠른 액션
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                보고서 생성
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                성과 분석
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Share2 className="w-4 h-4 mr-2" />
                계획 공유
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                계획 설정
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 메트릭 연결 모달 */}
      {renderMetricModal()}
    </div>
  );
}
