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
  ChevronDown,
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
  MoreHorizontal,
  Database,
  Unlink,
  X,
  Trash2,
} from "lucide-react";

export default function MarketingPlanDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const planId = params.id;

  // 상태 관리
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDataConnectionModal, setShowDataConnectionModal] = useState(false);
  const [selectedKR, setSelectedKR] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);

  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  useEffect(() => {
    // 실제 API 호출 대신 샘플 데이터 로드
    const samplePlan = {
      id: parseInt(planId),
      title: "2025년 1분기 마케팅 계획",
      status: "진행중",
      progress: 65,
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      manager: "김마케팅",
      description:
        "2025년 첫 분기를 위한 종합적인 마케팅 전략 수립 및 실행 계획",
      createdAt: "2025-01-15",
      updatedAt: "2025-06-08",
      objectives: [
        {
          id: 1,
          title: "Z세대 인지도 확보",
          keyResults: [
            {
              id: 1,
              text: "틱톡 팔로워 5만 달성",
              target: 50000,
              current: 40000,
              dataConnected: true,
              dataSource: "인사이트 > TikTok 채널 > 팔로워 수",
            },
            {
              id: 2,
              text: "브랜드 인지도 20% 증가",
              target: 20,
              current: 13,
              dataConnected: false,
              dataSource: null,
            },
            {
              id: 3,
              text: "UGC 콘텐츠 100건 수집",
              target: 100,
              current: 70,
              dataConnected: true,
              dataSource: "참여도 관리 > UGC 수집",
            },
          ],
        },
        {
          id: 2,
          title: "온라인 매출 증대",
          keyResults: [
            {
              id: 4,
              text: "온라인 매출 30% 증가",
              target: 30,
              current: 18,
              dataConnected: false,
              dataSource: null,
            },
            {
              id: 5,
              text: "전환율 3.5% 달성",
              target: 3.5,
              current: 2.8,
              dataConnected: true,
              dataSource: "인사이트 > 웹사이트 > 전환율",
            },
          ],
        },
      ],
      targetPersona: "20-30대 직장인",
      coreMessage: "일상을 더 스마트하게, 더 편리하게",
      channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
      initiatives: [
        {
          id: 1,
          name: "여름 바캉스 캠페인",
          status: "진행중",
          linkedToCampaign: true,
          campaignId: "camp1",
          campaignName: "2025 여름 프로모션",
          performance: {
            reach: "1.2M",
            engagement: "85K",
            cost: "₩3,000,000",
          },
        },
        {
          id: 2,
          name: "대학생 앰배서더 운영",
          status: "진행중",
          linkedToCampaign: false,
          campaignId: null,
          campaignName: null,
          performance: {
            reach: "850K",
            engagement: "42K",
            cost: "₩1,500,000",
          },
        },
        {
          id: 3,
          name: "인플루언서 협업 프로젝트",
          status: "완료",
          linkedToCampaign: true,
          campaignId: "camp2",
          campaignName: "인플루언서 콜라보 캠페인",
          performance: {
            reach: "2.1M",
            engagement: "156K",
            cost: "₩5,000,000",
          },
        },
      ],
    };

    // 샘플 댓글 데이터
    const sampleComments = [
      {
        id: 1,
        user: "김마케팅",
        avatar: "KM",
        comment:
          "1분기 목표 달성을 위해 틱톡 콘텐츠 제작을 더 적극적으로 진행해야겠습니다.",
        timestamp: "2025-06-08 14:30",
        mentions: [],
      },
      {
        id: 2,
        user: "이기획",
        avatar: "LG",
        comment:
          "@김마케팅 동의합니다! 특히 Z세대 타겟팅 콘텐츠에 집중하면 좋을 것 같아요.",
        timestamp: "2025-06-08 15:15",
        mentions: ["김마케팅"],
      },
    ];

    // 샘플 히스토리 데이터
    const sampleHistory = [
      {
        id: 1,
        action: "상태 변경",
        user: "김마케팅",
        detail: "계획됨 → 진행중",
        timestamp: "2025-06-08 09:00",
      },
      {
        id: 2,
        action: "목표 수정",
        user: "김마케팅",
        detail: "틱톡 팔로워 목표를 4만에서 5만으로 증가",
        timestamp: "2025-06-07 16:30",
      },
      {
        id: 3,
        action: "활동 추가",
        user: "이기획",
        detail: "대학생 앰배서더 운영 활동 추가",
        timestamp: "2025-06-06 11:20",
      },
    ];

    setTimeout(() => {
      setPlan(samplePlan);
      setComments(sampleComments);
      setHistory(sampleHistory);
      setLoading(false);
    }, 500);
  }, [planId]);

  // 상태별 배지 색상
  const getStatusBadge = (status) => {
    switch (status) {
      case "진행중":
        return <Badge className="bg-blue-500 hover:bg-blue-600">진행중</Badge>;
      case "계획됨":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">계획됨</Badge>
        );
      case "완료":
        return <Badge className="bg-green-500 hover:bg-green-600">완료</Badge>;
      case "보류":
        return <Badge className="bg-gray-500 hover:bg-gray-600">보류</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 상태 변경 핸들러
  const handleStatusChange = (newStatus) => {
    setPlan((prev) => ({ ...prev, status: newStatus }));
    setShowStatusDropdown(false);

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "상태 변경",
      user: "현재 사용자",
      detail: `${plan.status} → ${newStatus}`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 인라인 편집 시작
  const startEditing = (
    field,
    currentValue,
    objectiveId = null,
    krId = null,
  ) => {
    setEditingField({ field, objectiveId, krId });
    setEditingValue(currentValue);
  };

  // 인라인 편집 저장
  const saveEdit = () => {
    if (!editingField) return;

    const { field, objectiveId, krId } = editingField;

    setPlan((prev) => {
      const newPlan = { ...prev };

      if (field === "targetPersona" || field === "coreMessage") {
        newPlan[field] = editingValue;
      } else if (field === "objectiveTitle") {
        const objIndex = newPlan.objectives.findIndex(
          (obj) => obj.id === objectiveId,
        );
        if (objIndex !== -1) {
          newPlan.objectives[objIndex].title = editingValue;
        }
      } else if (field === "krText" || field === "krTarget") {
        const objIndex = newPlan.objectives.findIndex(
          (obj) => obj.id === objectiveId,
        );
        if (objIndex !== -1) {
          const krIndex = newPlan.objectives[objIndex].keyResults.findIndex(
            (kr) => kr.id === krId,
          );
          if (krIndex !== -1) {
            if (field === "krText") {
              newPlan.objectives[objIndex].keyResults[krIndex].text =
                editingValue;
            } else {
              newPlan.objectives[objIndex].keyResults[krIndex].target =
                parseFloat(editingValue);
            }
          }
        }
      }

      return newPlan;
    });

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "내용 수정",
      user: "현재 사용자",
      detail: `${field} 수정됨`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);

    setEditingField(null);
    setEditingValue("");
  };

  // 편집 취소
  const cancelEdit = () => {
    setEditingField(null);
    setEditingValue("");
  };

  // 새 목표 추가
  const addObjective = () => {
    const newObjective = {
      id: Date.now(),
      title: "새 목표",
      keyResults: [
        {
          id: Date.now() + 1,
          text: "새 핵심 결과",
          target: 0,
          current: 0,
          dataConnected: false,
          dataSource: null,
        },
      ],
    };

    setPlan((prev) => ({
      ...prev,
      objectives: [...prev.objectives, newObjective],
    }));

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "목표 추가",
      user: "현재 사용자",
      detail: "새 목표가 추가됨",
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 새 KR 추가
  const addKeyResult = (objectiveId) => {
    const newKR = {
      id: Date.now(),
      text: "새 핵심 결과",
      target: 0,
      current: 0,
      dataConnected: false,
      dataSource: null,
    };

    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj) =>
        obj.id === objectiveId
          ? { ...obj, keyResults: [...obj.keyResults, newKR] }
          : obj,
      ),
    }));

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "핵심 결과 추가",
      user: "현재 사용자",
      detail: "새 핵심 결과가 추가됨",
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 새 활동 추가
  const addInitiative = () => {
    const newInitiative = {
      id: Date.now(),
      name: "새 활동",
      status: "계획됨",
      linkedToCampaign: false,
      campaignId: null,
      campaignName: null,
      performance: {
        reach: "0",
        engagement: "0",
        cost: "₩0",
      },
    };

    setPlan((prev) => ({
      ...prev,
      initiatives: [...prev.initiatives, newInitiative],
    }));

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "활동 추가",
      user: "현재 사용자",
      detail: "새 활동이 추가됨",
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 댓글 추가
  const addComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      user: "현재 사용자",
      avatar: "CU",
      comment: newComment,
      timestamp: new Date().toLocaleString("ko-KR"),
      mentions: [],
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  // 데이터 연결 모달
  const DataConnectionModal = () => {
    if (!showDataConnectionModal || !selectedKR) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">데이터 연결 설정</h3>
              <Button
                variant="outline"
                onClick={() => setShowDataConnectionModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-medium mb-2">연결할 핵심 결과</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedKR.text}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  데이터 소스 선택
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                  <option value="">데이터 소스를 선택하세요</option>
                  <option value="insight_tiktok_followers">
                    인사이트 &gt; TikTok 채널 &gt; 팔로워 수
                  </option>
                  <option value="insight_instagram_followers">
                    인사이트 &gt; Instagram &gt; 팔로워 수
                  </option>
                  <option value="insight_website_conversion">
                    인사이트 &gt; 웹사이트 &gt; 전환율
                  </option>
                  <option value="engagement_ugc">
                    참여도 관리 &gt; UGC 수집
                  </option>
                  <option value="manual">수동 입력</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  현재 값
                </label>
                <Input
                  type="number"
                  value={selectedKR.current}
                  placeholder="현재 달성 값을 입력하세요"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDataConnectionModal(false)}
            >
              취소
            </Button>
            <Button onClick={() => setShowDataConnectionModal(false)}>
              연결 저장
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 계획 수정 모달
  const EditPlanModal = () => {
    if (!showEditModal || !plan) return null;

    const [editForm, setEditForm] = useState({
      title: plan.title,
      manager: plan.manager,
      startDate: plan.startDate,
      endDate: plan.endDate,
      description: plan.description,
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">계획 정보 수정</h3>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">계획명</label>
              <Input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">담당자</label>
              <select
                value={editForm.manager}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, manager: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                <option value="김마케팅">김마케팅</option>
                <option value="이기획">이기획</option>
                <option value="박전략">박전략</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">시작일</label>
                <Input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">종료일</label>
                <Input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">설명</label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 resize-none"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                setPlan((prev) => ({ ...prev, ...editForm }));
                setShowEditModal(false);
              }}
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            계획을 찾을 수 없습니다
          </h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 animate-fadeIn">
      {/* 헤더 영역 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {plan.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-gray-600 dark:text-gray-400">
                  담당자: {plan.manager}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  기간: {plan.startDate} ~ {plan.endDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 상태 변경 드롭다운 */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2"
              >
                {getStatusBadge(plan.status)}
                <ChevronDown className="w-4 h-4" />
              </Button>

              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {["계획됨", "진행중", "완료", "보류"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 편집 버튼 */}
            <Button variant="outline" onClick={() => setShowEditModal(true)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              전체 진행률
            </span>
            <span className="font-medium">{plan.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${plan.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 */}
        <div className="xl:col-span-2 space-y-6">
          {/* 목표 달성도 (OKRs) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                목표 달성도 (OKRs)
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addObjective}
                  className="ml-auto flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  목표 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {plan.objectives.map((objective) => (
                <div
                  key={objective.id}
                  className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    {editingField?.field === "objectiveTitle" &&
                    editingField?.objectiveId === objective.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button size="sm" onClick={saveEdit}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <h4
                        className="font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded"
                        onClick={() =>
                          startEditing(
                            "objectiveTitle",
                            objective.title,
                            objective.id,
                          )
                        }
                      >
                        Objective: {objective.title}
                      </h4>
                    )}

                    <div className="text-sm text-gray-500">
                      달성률:{" "}
                      {Math.round(
                        objective.keyResults.reduce(
                          (acc, kr) => acc + (kr.current / kr.target) * 100,
                          0,
                        ) / objective.keyResults.length,
                      )}
                      %
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Key Results:
                    </p>
                    {objective.keyResults.map((kr) => (
                      <div
                        key={kr.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          {editingField?.field === "krText" &&
                          editingField?.krId === kr.id ? (
                            <div className="flex items-center gap-2 mb-2">
                              <Input
                                value={editingValue}
                                onChange={(e) =>
                                  setEditingValue(e.target.value)
                                }
                                className="flex-1"
                                autoFocus
                              />
                              <Button size="sm" onClick={saveEdit}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <h5
                              className="font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded mb-2"
                              onClick={() =>
                                startEditing(
                                  "krText",
                                  kr.text,
                                  objective.id,
                                  kr.id,
                                )
                              }
                            >
                              {kr.text}
                            </h5>
                          )}

                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              진행률:{" "}
                              {Math.round((kr.current / kr.target) * 100)}%
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              ({kr.current.toLocaleString()} /
                              {editingField?.field === "krTarget" &&
                              editingField?.krId === kr.id ? (
                                <span className="inline-flex items-center gap-1 ml-1">
                                  <Input
                                    type="number"
                                    value={editingValue}
                                    onChange={(e) =>
                                      setEditingValue(e.target.value)
                                    }
                                    className="w-20 h-6 text-xs"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    onClick={saveEdit}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Save className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEdit}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </span>
                              ) : (
                                <span
                                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 rounded ml-1"
                                  onClick={() =>
                                    startEditing(
                                      "krTarget",
                                      kr.target.toString(),
                                      objective.id,
                                      kr.id,
                                    )
                                  }
                                >
                                  {kr.target.toLocaleString()}
                                </span>
                              )}
                              )
                            </span>
                          </div>

                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min((kr.current / kr.target) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {kr.dataConnected ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedKR(kr);
                                setShowDataConnectionModal(true);
                              }}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <Database className="w-4 h-4 mr-1" />
                              연결됨
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedKR(kr);
                                setShowDataConnectionModal(true);
                              }}
                            >
                              <Link className="w-4 h-4 mr-1" />
                              데이터 연결
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addKeyResult(objective.id)}
                      className="w-full flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      핵심 결과(KR) 추가
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 전략 개요 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                전략 개요
                <Button size="sm" variant="outline" className="ml-auto">
                  <Edit className="w-4 h-4" />
                  편집
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    타겟 고객
                  </h4>
                  {editingField?.field === "targetPersona" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p
                      className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() =>
                        startEditing("targetPersona", plan.targetPersona)
                      }
                    >
                      {plan.targetPersona}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    핵심 메시지
                  </h4>
                  {editingField?.field === "coreMessage" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p
                      className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() =>
                        startEditing("coreMessage", plan.coreMessage)
                      }
                    >
                      {plan.coreMessage}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    주요 채널
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.channels.map((channel, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-orange-50 text-orange-700 border-orange-200"
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 주요 활동 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                주요 활동
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addInitiative}
                  className="ml-auto flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  활동 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.initiatives.map((initiative) => (
                <div
                  key={initiative.id}
                  className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {initiative.name}
                      </h4>
                      {getStatusBadge(initiative.status)}
                      {initiative.linkedToCampaign && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          캠페인연동
                        </Badge>
                      )}
                    </div>

                    <div className="relative">
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">도달:</span>
                      <span className="ml-2 font-medium">
                        {initiative.performance.reach}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">반응:</span>
                      <span className="ml-2 font-medium">
                        {initiative.performance.engagement}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">비용:</span>
                      <span className="ml-2 font-medium">
                        {initiative.performance.cost}
                      </span>
                    </div>
                  </div>

                  {initiative.linkedToCampaign && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          연결된 캠페인: {initiative.campaignName}
                        </span>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 댓글 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                댓글
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.user}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-sm"
                />
                <Button onClick={addComment} size="sm" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  댓글 등록
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 히스토리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-orange-500" />
                히스토리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-2 border-gray-200 dark:border-gray-700 pl-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{item.action}</span>
                      <span className="text-xs text-gray-500">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.user}: {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 모달들 */}
      <DataConnectionModal />
      <EditPlanModal />
    </div>
  );
}
