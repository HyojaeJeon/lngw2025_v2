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
  MessageSquare,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Clock,
  User,
  FileText,
  BarChart3,
  CheckCircle,
  Circle,
  MoreVertical,
  Settings,
  Link,
  ExternalLink,
  MessageCircle,
  RotateCcw,
  TrendingUp,
  AlertCircle,
  Download,
  Check,
} from "lucide-react";

export default function MarketingPlanDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const planId = params.id;

  // 상태 관리
  const [plan, setPlan] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [collapsedObjectives, setCollapsedObjectives] = useState(new Set());
  const [deletedObjectives, setDeletedObjectives] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingStrategy, setEditingStrategy] = useState(false);
  const [strategyData, setStrategyData] = useState({});
  const [editingActivity, setEditingActivity] = useState(null);
  const [showActivityDropdown, setShowActivityDropdown] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [showKeyResultModal, setShowKeyResultModal] = useState(false);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState(null);
  const [editingKeyResult, setEditingKeyResult] = useState(null);
  const [updateValues, setUpdateValues] = useState({});

  // 모의 데이터
  useEffect(() => {
    const mockPlan = {
      id: parseInt(planId),
      title: "2025년 1분기 마케팅 계획",
      status: "진행중",
      progress: 65,
      createdAt: "2025-01-01",
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      manager: "김마케팅",
      description: "Z세대 고객층 확보를 위한 디지털 마케팅 전략",
      targetPersona: "20-30대 직장인",
      coreMessage: "일상을 더 스마트하게, 더 편리하게",
      channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
      objectives: [
        {
          id: 1,
          title: "Z세대 인지도 확보",
          keyResults: [
            {
              id: 1,
              title: "틱톡 팔로워 5만 달성",
              target: 50000,
              current: 40000,
              dataConnected: true,
              dataSource: "TikTok API",
              measurementType: "automatic",
            },
            {
              id: 2,
              title: "브랜드 인지도 20% 증가",
              target: 20,
              current: 13,
              dataConnected: false,
              dataSource: null,
              measurementType: "manual",
            },
            {
              id: 3,
              title: "UGC 콘텐츠 100건 수집",
              target: 100,
              current: 70,
              dataConnected: false,
              dataSource: null,
              measurementType: "checklist",
              checklist: [
                { id: 1, text: "인스타그램 인플루언서 A", completed: true },
                { id: 2, text: "틱톡 챌린지 이벤트", completed: true },
                { id: 3, text: "블로그 체험단 모집", completed: false },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "온라인 매출 증대",
          keyResults: [
            {
              id: 4,
              title: "온라인 매출 30% 증가",
              target: 30,
              current: 18,
              dataConnected: true,
              dataSource: "Google Analytics",
              measurementType: "automatic",
            },
            {
              id: 5,
              title: "전환율 3.5% 달성",
              target: 3.5,
              current: null,
              dataConnected: false,
              dataSource: null,
              measurementType: "automatic",
            },
          ],
        },
      ],
      initiatives: [
        {
          id: 1,
          name: "여름 바캉스 캠페인",
          status: "계획됨",
          linkedToCampaign: true,
          campaignId: "camp1",
          budget: 5000000,
        },
        {
          id: 2,
          name: "대학생 앰배서더 운영",
          status: "진행중",
          linkedToCampaign: false,
          campaignId: null,
          budget: 3000000,
        },
      ],
    };

    setPlan(mockPlan);
    setStrategyData({
      targetPersona: mockPlan.targetPersona,
      coreMessage: mockPlan.coreMessage,
      channels: [...mockPlan.channels],
    });

    // 모의 댓글 데이터
    setComments([
      {
        id: 1,
        author: "이기획",
        content: "1분기 목표가 도전적이지만 달성 가능해 보입니다.",
        createdAt: "2025-01-15 14:30",
      },
      {
        id: 2,
        author: "박전략",
        content: "틱톡 채널 운영에 더 집중해야 할 것 같아요.",
        createdAt: "2025-01-16 09:15",
      },
    ]);

    // 모의 히스토리 데이터
    setHistory([
      {
        id: 1,
        action: "계획 생성",
        user: "김마케팅",
        detail: "새 마케팅 계획이 생성됨",
        timestamp: "2025-01-15 10:00",
      },
      {
        id: 2,
        action: "목표 수정",
        user: "김마케팅",
        detail: "틱톡 팔로워 목표를 4만에서 5만으로 수정",
        timestamp: "2025-01-20 15:30",
      },
    ]);
    setLoading(false);
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
      detail: `계획 상태가 '${newStatus}'로 변경됨`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 목표 삭제 핸들러
  const handleDeleteObjective = () => {
    if (!objectiveToDelete) return;

    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((obj) => obj.id !== objectiveToDelete),
    }));
    setShowDeleteModal(false);
    setObjectiveToDelete(null);
  };

  // Key Result 삭제
  const handleDeleteKeyResult = (objectiveId, keyResultId) => {
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              keyResults: objective.keyResults.filter(
                (kr) => kr.id !== keyResultId,
              ),
            }
          : objective,
      ),
    }));
  };

  // Key Result 업데이트
  const handleUpdateKeyResult = (objectiveId, keyResultId, value) => {
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              keyResults: objective.keyResults.map((keyResult) =>
                keyResult.id === keyResultId
                  ? { ...keyResult, current: parseFloat(value) }
                  : keyResult,
              ),
            }
          : objective,
      ),
    }));
    setUpdateValues((prev) => ({ ...prev, [keyResultId]: "" }));
  };

  // 체크리스트 항목 토글
  const handleToggleChecklistItem = (objectiveId, keyResultId, itemIndex) => {
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              keyResults: objective.keyResults.map((keyResult) =>
                keyResult.id === keyResultId
                  ? {
                      ...keyResult,
                      checklist: keyResult.checklist.map((item, index) =>
                        index === itemIndex ? { ...item, completed: !item.completed } : item
                      )
                    }
                  : keyResult
              )
            }
          : objective
      )
    }));
  };

  // 목표 삭제/복원
  const handleDeleteObjectiveOld = (objectiveId) => {
    setDeletedObjectives((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(objectiveId)) {
        newSet.delete(objectiveId);
      } else {
        newSet.add(objectiveId);
      }
      return newSet;
    });
    setShowDeleteConfirm(null);

    // 히스토리에 기록 추가
    const action = deletedObjectives.has(objectiveId)
      ? "목표 복원"
      : "목표 삭제";
    const newHistoryItem = {
      id: history.length + 1,
      action,
      user: "현재 사용자",
      detail: `목표가 ${action.includes("삭제") ? "삭제" : "복원"}됨`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  const renderObjectiveModal = () => {
    const isEditMode = !!editingObjective;
    const [title, setTitle] = useState(editingObjective?.title || "");

    const handleSubmit = () => {
      if (!title.trim()) return;

      if (isEditMode) {
        // 목표 수정 로직
        setPlan((prev) => ({
          ...prev,
          objectives: prev.objectives.map((obj) =>
            obj.id === editingObjective.id ? { ...obj, title } : obj
          ),
        }));
      } else {
        // 목표 추가 로직
        const newObjective = {
          id: Date.now(),
          title,
          keyResults: [],
        };
        setPlan((prev) => ({
          ...prev,
          objectives: [...prev.objectives, newObjective],
        }));
      }

      // 모달 닫기 및 상태 초기화
      setShowObjectiveModal(false);
      setEditingObjective(null);
      setTitle("");
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isEditMode ? "목표 수정" : "새 목표 추가"}
          </h3>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            목표 제목
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="목표 제목을 입력하세요"
            className="mb-4"
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowObjectiveModal(false);
                setEditingObjective(null);
              }}
            >
              취소
            </Button>
            <Button onClick={handleSubmit}>{isEditMode ? "저장" : "추가"}</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderKeyResultModal = () => {
    const isEditMode = !!editingKeyResult;
    const [title, setTitle] = useState(editingKeyResult?.title || "");
    const [target, setTarget] = useState(editingKeyResult?.target || "");

    const handleSubmit = () => {
      if (!title.trim() || !target) return;

      if (isEditMode) {
        // Key Result 수정 로직
        setPlan((prev) => ({
          ...prev,
          objectives: prev.objectives.map((obj) =>
            obj.id === selectedObjectiveId
              ? {
                  ...obj,
                  keyResults: obj.keyResults.map((kr) =>
                    kr.id === editingKeyResult.id ? { ...kr, title, target: parseFloat(target) } : kr
                  ),
                }
              : obj
          ),
        }));
      } else {
        // Key Result 추가 로직
        const newKeyResult = {
          id: Date.now(),
          title,
          target: parseFloat(target),
          current: 0,
        };

        setPlan((prev) => ({
          ...prev,
          objectives: prev.objectives.map((obj) =>
            obj.id === selectedObjectiveId
              ? { ...obj, keyResults: [...obj.keyResults, newKeyResult] }
              : obj
          ),
        }));
      }

      // 모달 닫기 및 상태 초기화
      setShowKeyResultModal(false);
      setEditingKeyResult(null);
      setTitle("");
      setTarget("");
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isEditMode ? "핵심 결과 수정" : "새 핵심 결과 추가"}
          </h3>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            핵심 결과 제목
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="핵심 결과 제목을 입력하세요"
            className="mb-4"
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            목표 값
          </label>
          <Input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="목표 값을 입력하세요"
            className="mb-4"
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowKeyResultModal(false);
                setEditingKeyResult(null);
              }}
            >
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? "저장" : "추가"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 달성률 계산 함수 (완전히 새로 작성)
  const calculateObjectiveProgress = (keyResults) => {
    if (!keyResults || keyResults.length === 0) return 0;

    const validResults = keyResults.filter((kr) => {
      if (kr.measurementType === "checklist") {
        return kr.checklist && kr.checklist.length > 0;
      }
      return (
        kr.current !== null &&
        !isNaN(kr.current) &&
        kr.target !== null &&
        !isNaN(kr.target)
      );
    });

    if (validResults.length === 0) return 0;

    const totalProgress = validResults.reduce((sum, kr) => {
      if (kr.measurementType === "checklist") {
        const completed = kr.checklist
          ? kr.checklist.filter((item) => item.completed).length
          : 0;
        const total = kr.checklist ? kr.checklist.length : 1;
        return sum + (completed / total) * 100;
      }
      return sum + Math.min((kr.current / kr.target) * 100, 100);
    }, 0);

    return Math.round(totalProgress / validResults.length);
  };

  // 핵심결과 상태 아이콘
  const getKeyResultStatusIcon = (kr) => {
    if (kr.measurementType === "checklist") {
      const completed = kr.checklist
        ? kr.checklist.filter((item) => item.completed).length
        : 0;
      const total = kr.checklist ? kr.checklist.length : 1;
      const progress = (completed / total) * 100;

      if (progress === 100) {
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      } else if (progress > 0) {
        return <Clock className="w-4 h-4 text-orange-500" />;
      } else {
        return <Circle className="w-4 h-4 text-gray-400" />;
      }
    }

    const progress = calculateProgress(kr.current, kr.target);
    if (progress === null) {
      return <Circle className="w-4 h-4 text-gray-400" />;
    }

    if (progress >= 100) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (progress >= 75) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (progress >= 50) {
      return <Clock className="w-4 h-4 text-orange-500" />;
    } else if (progress > 0) {
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    } else {
      return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  // 진행률 계산 함수
  const calculateProgress = (current, target) => {
    if (target === null || target === 0 || isNaN(target)) return null;
    if (current === null || isNaN(current)) return 0;
    return Math.min((current / target) * 100, 100);
  };

  // 진행률 표시 텍스트
  const getProgressText = (current, target, measurementType) => {
    if (measurementType === "checklist") {
      const completed = current || 0;
      const total = target || 0;
      return `${completed}/${total} 완료`;
    }

    if (target === null || target === 0) return "목표값 없음";
    if (current === null) return "0";

    // 숫자 포맷팅
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
      }
      return num.toLocaleString();
    };

    return `${formatNumber(current)} / ${formatNumber(target)}`;
  };

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div className="w-full max-w-none space-y-6 animate-fadeIn">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">로딩 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className="w-full max-w-none space-y-6 animate-fadeIn">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 dark:text-red-400">
              계획을 불러오는 중 오류가 발생했습니다.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/marketing/planning-process")}
              className="mt-4"
            >
              목록으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 계획이 없는 경우
  if (!plan) {
    return (
      <div className="w-full max-w-none space-y-6 animate-fadeIn">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              해당 계획을 찾을 수 없습니다.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/marketing/planning-process")}
              className="mt-4"
            >
              목록으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 메인 콘텐츠 렌더링
  return (
    <div className="w-full max-w-none space-y-6 animate-fadeIn">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="outline"
        onClick={() => router.push("/dashboard/marketing/planning-process")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        목록으로 돌아가기
      </Button>

      {/* 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{plan.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {getStatusBadge(plan.status)}
                <span>진행률: {plan.progress}%</span>
                <span>생성일: {plan.createdAt}</span>
                {plan.manager && <span>담당자: {plan.manager}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-1" />
                수정
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-1" />
                내보내기
              </Button>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
              style={{width: `${plan.progress}%`}}
            ></div>
          </div>
        </CardHeader>
      </Card>

      {/* 계획 개요 */}
      {(plan.description || plan.targetPersona || plan.coreMessage) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              계획 개요
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.description && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">설명</h4>
                <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.targetPersona && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">타겟 고객</h4>
                  <p className="text-gray-600 dark:text-gray-400">{plan.targetPersona}</p>
                </div>
              )}

              {plan.coreMessage && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">핵심 메시지</h4>
                  <p className="text-gray-600 dark:text-gray-400">{plan.coreMessage}</p>
                </div>
              )}
            </div>

            {plan.channels && plan.channels.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">주요 채널</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.channels.map((channel, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 목표 설정 (OKRs) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              목표 설정 (OKRs)
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => setShowObjectiveModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              목표 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {plan.objectives?.map((objective, objIndex) => {
            const isExpanded = expandedObjectives[objective.id] || false;
            const objectiveProgress = calculateObjectiveProgress(objective.keyResults);

            return (
              <div key={objective.id || objIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                {/* Objective 헤더 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {objective.title}
                        </h3>
                        <Badge variant="outline" className={`${
                          objectiveProgress >= 100 ? 'bg-green-100 text-green-800 border-green-300' :
                          objectiveProgress >= 75 ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          objectiveProgress >= 50 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                          objectiveProgress > 0 ? 'bg-orange-100 text-orange-800 border-orange-300' :
                          'bg-gray-100 text-gray-800 border-gray-300'
                        }`}>
                          {objectiveProgress}% 달성
                        </Badge>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            objectiveProgress >= 100 ? 'bg-green-500' :
                            objectiveProgress >= 75 ? 'bg-blue-500' :
                            objectiveProgress >= 50 ? 'bg-yellow-500' :
                            objectiveProgress > 0 ? 'bg-orange-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min(objectiveProgress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleObjective(objective.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingObjective(objective);
                          setShowObjectiveModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setObjectiveToDelete(objective.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Key Results */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        핵심 결과 (Key Results)
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedObjectiveId(objective.id);
                          setShowKeyResultModal(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        KR 추가
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {objective.keyResults?.map((kr, krIndex) => {
                        const progress = kr.measurementType === "checklist" 
                          ? kr.checklist ? (kr.checklist.filter(item => item.completed).length / kr.checklist.length) * 100 : 0
                          : calculateProgress(kr.current, kr.target);

                        return (
                          <div key={kr.id || krIndex} className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                {getKeyResultStatusIcon(kr)}
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {kr.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {getProgressText(kr.current, kr.target, kr.measurementType)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingKeyResult(kr);
                                    setSelectedObjectiveId(objective.id);
                                    setShowKeyResultModal(true);
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteKeyResult(objective.id, kr.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* 진행률 바 */}
                            {kr.measurementType !== "checklist" && progress !== null && (
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    progress >= 100 ? 'bg-green-500' :
                                    progress >= 75 ? 'bg-blue-500' :
                                    progress >= 50 ? 'bg-yellow-500' :
                                    progress > 0 ? 'bg-orange-500' : 'bg-gray-400'
                                  }`}
                                  style={{ width: `${Math.min(progress || 0, 100)}%` }}
                                ></div>
                              </div>
                            )}

                            {/* 체크리스트 형태 */}
                            {kr.measurementType === "checklist" && kr.checklist && (
                              <div className="space-y-2">
                                {kr.checklist.map((item, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleToggleChecklistItem(objective.id, kr.id, index)}
                                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                        item.completed 
                                          ? 'bg-green-500 border-green-500 text-white' 
                                          : 'border-gray-300 dark:border-gray-600'
                                      }`}
                                    >
                                      {item.completed && <Check className="w-3 h-3" />}
                                    </button>
                                    <span className={`text-sm ${
                                      item.completed 
                                        ? 'line-through text-gray-500 dark:text-gray-400' 
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* 업데이트 버튼 */}
                            {kr.measurementType !== "checklist" && (
                              <div className="flex items-center gap-2 mt-3">
                                <Input
                                  type="number"
                                  placeholder="현재값 입력"
                                  value={updateValues[kr.id] || ""}
                                  onChange={(e) => setUpdateValues(prev => ({
                                    ...prev,
                                    [kr.id]: e.target.value
                                  }))}
                                  className="w-32"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateKeyResult(objective.id, kr.id, updateValues[kr.id])}
                                  disabled={!updateValues[kr.id]}
                                >
                                  업데이트
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {(!plan.objectives || plan.objectives.length === 0) && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                아직 설정된 목표가 없습니다
              </p>
              <Button onClick={() => setShowObjectiveModal(true)}>
                첫 번째 목표 추가하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주요 활동 */}
      {plan.initiatives && plan.initiatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              주요 활동
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.initiatives.map((initiative, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {initiative.name}
                    </span>
                    {getStatusBadge(initiative.status)}
                    {initiative.linkedToCampaign && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        캠페인연동
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 코멘트 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            코멘트 및 피드백
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 코멘트 입력 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="코멘트를 입력하세요..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  코멘트 추가
                </Button>
              </div>
            </div>
          </div>

          {/* 코멘트 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-4">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                아직 코멘트가 없습니다
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 목표 추가/수정 모달 */}
      {showObjectiveModal && renderObjectiveModal()}

      {/* Key Result 추가/수정 모달 */}
      {showKeyResultModal && renderKeyResultModal()}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              목표 삭제 확인
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              이 목표를 삭제하시겠습니까? 삭제된 목표는 복구할 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setObjectiveToDelete(null);
                }}
              >
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteObjective}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}