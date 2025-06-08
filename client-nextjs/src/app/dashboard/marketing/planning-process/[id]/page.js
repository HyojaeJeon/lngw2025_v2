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

  // 상태 관리
  const [objectives, setObjectives] = useState([
    {
      id: 1,
      title: "Z세대 인지도 확보",
      deleted: false,
      keyResults: [
        {
          id: 1,
          text: "틱톡 팔로워 5만 달성",
          target: 50000,
          current: 32000,
          dataConnected: true,
          dataSource: "TikTok API",
          measurementType: "automatic",
        },
        {
          id: 2,
          text: "브랜드 인지도 20% 증가",
          target: 20,
          current: null,
          dataConnected: false,
          dataSource: null,
          measurementType: "manual",
        },
        {
          id: 3,
          text: "UGC 콘텐츠 100건 수집",
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
      deleted: false,
      keyResults: [
        {
          id: 4,
          text: "온라인 매출 30% 증가",
          target: 30,
          current: 18,
          dataConnected: true,
          dataSource: "Google Analytics",
          measurementType: "automatic",
        },
        {
          id: 5,
          text: "전환율 3.5% 달성",
          target: 3.5,
          current: null,
          dataConnected: false,
          dataSource: null,
          measurementType: "manual",
        },
        {
          id: 6,
          text: "고객 생애가치 25% 향상",
          target: 25,
          current: 15,
          dataConnected: false,
          dataSource: null,
          measurementType: "manual",
        },
      ],
    },
  ]);

  const [expandedObjectives, setExpandedObjectives] = useState({
    1: true,
    2: true,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [selectedKeyResult, setSelectedKeyResult] = useState(null);

  // 성과 측정 방식 설정 모달 표시
  const [selectedKr, setSelectedKr] = useState(null);

  // 전략 개요 편집 상태
  const [isEditingStrategy, setIsEditingStrategy] = useState(false);
  const [editingStrategyData, setEditingStrategyData] = useState({
    targetPersona: "",
    coreMessage: "",
    channels: [],
  });

  // 주요 활동 관련 상태
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: "",
    campaignId: "",
    budget: "",
  });

  // 성과 측정 방식 설정
  const handleSetMeasurement = (objectiveIndex, krIndex) => {
    setSelectedKr({ objectiveIndex, krIndex });
    setShowMeasurementModal(true);
  };

  // 측정 방식 선택 처리
  const handleMeasurementSelection = (type) => {
    const { objectiveIndex, krIndex } = selectedKr;
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj, oIndex) =>
        oIndex === objectiveIndex
          ? {
              ...obj,
              keyResults: obj.keyResults.map((kr, kIndex) =>
                kIndex === krIndex
                  ? {
                      ...kr,
                      measurementType: type,
                      currentValue:
                        type === "checklist" ? 0 : kr.currentValue || 0,
                      checklistItems: type === "checklist" ? [] : undefined,
                    }
                  : kr,
              ),
            }
          : obj,
      ),
    }));

    setShowMeasurementModal(false);
    setSelectedKr(null);
  };

  // 체크리스트 항목 추가
  const handleAddChecklistItem = (objectiveIndex, krIndex, itemText) => {
    if (!itemText.trim()) return;

    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj, oIndex) =>
        oIndex === objectiveIndex
          ? {
              ...obj,
              keyResults: obj.keyResults.map((kr, kIndex) =>
                kIndex === krIndex
                  ? {
                      ...kr,
                      checklistItems: [
                        ...(kr.checklistItems || []),
                        {
                          id: Date.now(),
                          text: itemText,
                          completed: false,
                        },
                      ],
                    }
                  : kr,
              ),
            }
          : obj,
      ),
    }));
  };

  // 체크리스트 항목 삭제
  const handleDeleteChecklistItem = (objectiveIndex, krIndex, itemId) => {
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj, oIndex) =>
        oIndex === objectiveIndex
          ? {
              ...obj,
              keyResults: obj.keyResults.map((kr, kIndex) =>
                kIndex === krIndex
                  ? {
                      ...kr,
                      checklistItems: kr.checklistItems?.filter(
                        (item) => item.id !== itemId,
                      ),
                    }
                  : kr,
              ),
            }
          : obj,
      ),
    }));
  };

  // 체크리스트 항목 토글
  const handleToggleChecklistItem = (objectiveIndex, krIndex, itemId) => {
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj, oIndex) =>
        oIndex === objectiveIndex
          ? {
              ...obj,
              keyResults: obj.keyResults.map((kr, kIndex) =>
                kIndex === krIndex
                  ? {
                      ...kr,
                      checklistItems: kr.checklistItems?.map((item) =>
                        item.id === itemId
                          ? { ...item, completed: !item.completed }
                          : item,
                      ),
                      currentValue: kr.checklistItems
                        ? kr.checklistItems.filter((item) =>
                            item.id === itemId
                              ? !item.completed
                              : item.completed,
                          ).length +
                          (kr.checklistItems.find((item) => item.id === itemId)
                            ?.completed
                            ? 0
                            : 1)
                        : 0,
                    }
                  : kr,
              ),
            }
          : obj,
      ),
    }));
  };

  // 목표 복원
  const handleRestoreObjective = (objectiveIndex) => {
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj, index) =>
        index === objectiveIndex ? { ...obj, isDeleted: false } : obj,
      ),
    }));

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "목표 복원",
      user: "현재 사용자",
      detail: `목표가 복원됨`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 전략 개요 편집 시작
  const handleStartEditStrategy = () => {
    setEditingStrategyData({
      targetPersona: plan.targetPersona || "",
      coreMessage: plan.coreMessage || "",
      channels: [...(plan.channels || [])],
    });
    setIsEditingStrategy(true);
  };

  // 전략 개요 편집 저장
  const handleSaveStrategy = () => {
    setPlan((prev) => ({
      ...prev,
      targetPersona: editingStrategyData.targetPersona,
      coreMessage: editingStrategyData.coreMessage,
      channels: editingStrategyData.channels,
    }));

    setIsEditingStrategy(false);

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "전략 개요 수정",
      user: "현재 사용자",
      detail: "전략 개요가 수정됨",
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 전략 개요 편집 취소
  const handleCancelEditStrategy = () => {
    setIsEditingStrategy(false);
    setEditingStrategyData({
      targetPersona: "",
      coreMessage: "",
      channels: [],
    });
  };

  // 채널 추가
  const handleAddChannel = (channel) => {
    if (channel.trim() && !editingStrategyData.channels.includes(channel)) {
      setEditingStrategyData((prev) => ({
        ...prev,
        channels: [...prev.channels, channel.trim()],
      }));
    }
  };

  // 채널 삭제
  const handleRemoveChannel = (channelToRemove) => {
    setEditingStrategyData((prev) => ({
      ...prev,
      channels: prev.channels.filter((channel) => channel !== channelToRemove),
    }));
  };

  // 새 활동 추가 시작
  const handleStartAddActivity = () => {
    setNewActivity({
      name: "",
      campaignId: "",
      budget: "",
    });
    setShowAddActivity(true);
  };

  // 새 활동 저장
  const handleSaveNewActivity = () => {
    if (!newActivity.name.trim()) {
      alert("활동명을 입력해주세요.");
      return;
    }

    const newActivityData = {
      id: plan.initiatives.length + 1,
      name: newActivity.name,
      status: "계획됨",
      campaignId: newActivity.campaignId || null,
      linkedToCampaign: !!newActivity.campaignId,
      budget: parseInt(newActivity.budget) || 0,
    };

    setPlan((prev) => ({
      ...prev,
      initiatives: [...prev.initiatives, newActivityData],
    }));

    setShowAddActivity(false);
    setNewActivity({
      name: "",
      campaignId: "",
      budget: "",
    });

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "활동 추가",
      user: "현재 사용자",
      detail: `활동 '${newActivity.name}'이 추가됨`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 새 활동 추가 취소
  const handleCancelAddActivity = () => {
    setShowAddActivity(false);
    setNewActivity({
      name: "",
      campaignId: "",
      budget: "",
    });
  };

  // 모의 데이터
  useEffect(() => {
    const mockPlan = {
      id: parseInt(planId),
      title: "2025년 1분기 마케팅 계획",
      status: "진행중",
      progress: 65,
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      manager: "김마케팅",
      description: "Z세대 고객층 확보를 위한 디지털 마케팅 전략",
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
              dataSource: "TikTok API",
              measurementType: "automatic",
            },
            {
              id: 2,
              text: "브랜드 인지도 20% 증가",
              target: 20,
              current: 13,
              dataConnected: false,
              dataSource: null,
              measurementType: "manual",
            },
            {
              id: 3,
              text: "UGC 콘텐츠 100건 수집",
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
              text: "온라인 매출 30% 증가",
              target: 30,
              current: 18,
              dataConnected: true,
              dataSource: "Google Analytics",
              measurementType: "automatic",
            },
            {
              id: 5,
              text: "전환율 3.5% 달성",
              target: 3.5,
              current: null,
              dataConnected: false,
              dataSource: null,
              measurementType: "automatic",
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
        user: "이기획",
        message: "1분기 목표가 도전적이지만 달성 가능해 보입니다.",
        timestamp: "2025-01-15 14:30",
      },
      {
        id: 2,
        user: "박전략",
        message: "틱톡 채널 운영에 더 집중해야 할 것 같아요.",
        timestamp: "2025-01-16 09:15",
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
  }, [planId]);

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

 
  // 목표 삭제/복원
  const handleDeleteObjective = (objectiveId) => {
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

  // 달성률 계산 (NaN 처리 포함)
  const calculateProgress = (current, target) => {
    if (!current || !target || target === 0) return null;
    return Math.round((current / target) * 100);
  };

  // Objective 전체 달성률 계산
  const calculateObjectiveProgress = (keyResults) => {
    const validProgress = keyResults
      .map((kr) => calculateProgress(kr.current, kr.target))
      .filter((progress) => progress !== null && !isNaN(progress));

    if (validProgress.length === 0) return null;
    return Math.round(
      validProgress.reduce((sum, progress) => sum + progress, 0) /
        validProgress.length,
    );
  };

  // 진행률 표시 텍스트
  const formatProgress = (progress) => {
    return progress === null || isNaN(progress) ? "측정 대기" : `${progress}%`;
  };

  // 채널 추가
  const addChannel = (channel) => {
    if (channel && !strategyData.channels.includes(channel)) {
      setStrategyData((prev) => ({
        ...prev,
        channels: [...prev.channels, channel],
      }));
    }
  };

  // 채널 제거
  const removeChannel = (channelToRemove) => {
    setStrategyData((prev) => ({
      ...prev,
      channels: prev.channels.filter((channel) => channel !== channelToRemove),
    }));
  };

  // 활동 추가
  const handleAddActivity = () => {
    if (!newActivity.name.trim()) return;

    const activity = {
      id: plan.initiatives.length + 1,
      name: newActivity.name,
      status: "계획됨",
      linkedToCampaign: !!newActivity.campaignId,
      campaignId: newActivity.campaignId || null,
      budget: parseInt(newActivity.budget) || 0,
    };

    setPlan((prev) => ({
      ...prev,
      initiatives: [...prev.initiatives, activity],
    }));

    setNewActivity({ name: "", campaignId: "", budget: "" });
    setShowAddActivity(false);

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "활동 추가",
      user: "현재 사용자",
      detail: `새 활동 '${activity.name}'이 추가됨`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 활동 수정
  const handleEditActivity = (activityId) => {
    const activity = plan.initiatives.find((init) => init.id === activityId);
    setEditingActivity({
      ...activity,
      originalId: activityId,
    });
    setShowActivityDropdown(null);
  };

  // 활동 수정 저장
  const handleSaveEditActivity = () => {
    setPlan((prev) => ({
      ...prev,
      initiatives: prev.initiatives.map((init) =>
        init.id === editingActivity.originalId
          ? {
              ...init,
              name: editingActivity.name,
              campaignId: editingActivity.campaignId,
              linkedToCampaign: !!editingActivity.campaignId,
              budget: parseInt(editingActivity.budget) || 0,
            }
          : init,
      ),
    }));

    setEditingActivity(null);

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "활동 수정",
      user: "현재 사용자",
      detail: `활동 '${editingActivity.name}'이 수정됨`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 활동 삭제
  const handleDeleteActivity = (activityId) => {
    if (confirm("해당 활동을 삭제하시겠습니까?")) {
      const activity = plan.initiatives.find((init) => init.id === activityId);
      setPlan((prev) => ({
        ...prev,
        initiatives: prev.initiatives.filter((init) => init.id !== activityId),
      }));

      // 히스토리에 기록 추가
      const newHistoryItem = {
        id: history.length + 1,
        action: "활동 삭제",
        user: "현재 사용자",
        detail: `활동 '${activity.name}'이 삭제됨`,
        timestamp: new Date().toLocaleString("ko-KR"),
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    }
    setShowActivityDropdown(null);
  };

  // 댓글 추가
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      user: "현재 사용자",
      message: newComment,
      timestamp: new Date().toLocaleString("ko-KR"),
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  // 목표 토글 함수
  const toggleObjective = (objectiveId) => {
    setExpandedObjectives((prev) => ({
      ...prev,
      [objectiveId]: !prev[objectiveId],
    }));
  };
  // 목표 접기/펼치기
  const toggleObjective = (objectiveId) => {
    setCollapsedObjectives((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(objectiveId)) {
        newSet.delete(objectiveId);
      } else {
        newSet.add(objectiveId);
      }
      return newSet;
    });
  };

  // 목표 삭제 함수
  const deleteObjective = (objectiveId) => {
    setObjectiveToDelete(objectiveId);
    setShowDeleteModal(true);
  };

  // 목표 복원 함수
  const restoreObjective = (objectiveId) => {
    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === objectiveId ? { ...obj, deleted: false } : obj,
      ),
    );
  };

  // 삭제 확인 함수
  const confirmDelete = () => {
    if (objectiveToDelete) {
      setObjectives((prev) =>
        prev.map((obj) =>
          obj.id === objectiveToDelete ? { ...obj, deleted: true } : obj,
        ),
      );
    }
    setShowDeleteModal(false);
    setObjectiveToDelete(null);
  };

  // 달성률 계산 함수
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

  // 성과 달성 옵션 모달 열기
  const openMeasurementModal = (keyResult) => {
    setSelectedKeyResult(keyResult);
    setShowMeasurementModal(true);
  };

  // Key Result 측정 방법 업데이트
  const updateKeyResultMeasurement = (keyResultId, field, value) => {
    setObjectives((prev) =>
      prev.map((obj) => ({
        ...obj,
        keyResults: obj.keyResults.map((kr) =>
          kr.id === keyResultId ? { ...kr, [field]: value } : kr,
        ),
      })),
    );

    // 선택된 Key Result도 업데이트
    if (selectedKeyResult && selectedKeyResult.id === keyResultId) {
      setSelectedKeyResult((prev) => ({ ...prev, [field]: value }));
    }
  };

  // 체크리스트 항목 토글
  const toggleChecklistItem = (keyResultId, itemId) => {
    setObjectives((prev) =>
      prev.map((obj) => ({
        ...obj,
        keyResults: obj.keyResults.map((kr) =>
          kr.id === keyResultId
            ? {
                ...kr,
                checklist: kr.checklist.map((item) =>
                  item.id === itemId
                    ? { ...item, completed: !item.completed }
                    : item,
                ),
              }
            : kr,
        ),
      })),
    );
  };

  // 체크리스트 항목 추가
  const addChecklistItem = (keyResultId) => {
    const newItemText = prompt("새로운 체크리스트 항목을 입력하세요:");
    if (newItemText && newItemText.trim()) {
      setObjectives((prev) =>
        prev.map((obj) => ({
          ...obj,
          keyResults: obj.keyResults.map((kr) =>
            kr.id === keyResultId
              ? {
                  ...kr,
                  checklist: [
                    ...(kr.checklist || []),
                    {
                      id: Date.now(),
                      text: newItemText.trim(),
                      completed: false,
                    },
                  ],
                }
              : kr,
          ),
        })),
      );
    }
  };

  // 체크리스트 항목 삭제
  const deleteChecklistItem = (keyResultId, itemId) => {
    if (confirm("이 체크리스트 항목을 삭제하시겠습니까?")) {
      setObjectives((prev) =>
        prev.map((obj) => ({
          ...obj,
          keyResults: obj.keyResults.map((kr) =>
            kr.id === keyResultId
              ? {
                  ...kr,
                  checklist: kr.checklist.filter((item) => item.id !== itemId),
                }
              : kr,
          ),
        })),
      );
    }
  };

  // 목표 달성도(OKRs) 렌더링
  const renderObjectives = () => (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
      <CardHeader className="bg-white dark:bg-gray-800 rounded-t-lg border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            목표 달성도 (OKRs)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {objectives.map((objective) => (
          <div
            key={objective.id}
            className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:shadow-lg ${objective.deleted ? "opacity-50" : ""}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() =>
                    !objective.deleted && toggleObjective(objective.id)
                  }
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded"
                  disabled={objective.deleted}
                >
                  {expandedObjectives[objective.id] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                    Objective: {objective.title}
                  </h4>
                  {objective.deleted && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    >
                      삭제됨
                    </Badge>
                  )}
                </div>
              </div>

              {/* Progress Section with proper spacing */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    전체 달성률
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {calculateObjectiveProgress(objective.keyResults)}%
                  </div>
                </div>

                {/* Delete/Restore button with proper margin */}
                <button
                  onClick={() =>
                    objective.deleted
                      ? restoreObjective(objective.id)
                      : deleteObjective(objective.id)
                  }
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    objective.deleted
                      ? "text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                  title={objective.deleted ? "복원" : "삭제"}
                >
                  {objective.deleted ? (
                    <RotateCcw className="w-5 h-5" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Enhanced Progress bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 transition-all duration-700 shadow-sm"
                  style={{
                    width: `${calculateObjectiveProgress(objective.keyResults)}%`,
                  }}
                ></div>
              </div>
            </div>

            {expandedObjectives[objective.id] && !objective.deleted && (
              <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Key Results
                  </span>
                </div>
                {objective.keyResults.map((kr) => (
                  <div
                    key={kr.id}
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {kr.text}
                      </span>
                      <button
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded transition-colors"
                        onClick={() => openMeasurementModal(kr)}
                        title="성과 달성 옵션 설정"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>

                    {kr.measurementType === "checklist" ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>
                            진행률:{" "}
                            {kr.checklist
                              ? kr.checklist.filter((item) => item.completed)
                                  .length
                              : 0}{" "}
                            / {kr.checklist ? kr.checklist.length : 0}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            체크리스트
                          </Badge>
                        </div>
                        {kr.checklist &&
                          kr.checklist.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded border"
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() =>
                                  toggleChecklistItem(kr.id, item.id)
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              <span
                                className={`text-sm flex-1 ${item.completed ? "line-through text-gray-500" : "text-gray-700 dark:text-gray-300"}`}
                              >
                                {item.text}
                              </span>
                              <button
                                onClick={() =>
                                  deleteChecklistItem(kr.id, item.id)
                                }
                                className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                                title="삭제"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        <button
                          onClick={() => addChecklistItem(kr.id)}
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full justify-center border-2 border-dashed border-blue-300 dark:border-blue-600"
                        >
                          <Plus className="w-4 h-4" />
                          체크리스트 항목 추가
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            달성률:{" "}
                            {kr.current !== null
                              ? Math.round((kr.current / kr.target) * 100)
                              : "측정 대기"}
                            %
                          </span>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {kr.current !== null ? kr.current : "측정 대기"} /{" "}
                            {kr.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 shadow-sm"
                            style={{
                              width: `${kr.current !== null ? Math.min((kr.current / kr.target) * 100, 100) : 0}%`,
                            }}
                          ></div>
                        </div>
                        {kr.dataSource && (
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>연결됨: {kr.dataSource}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  // 삭제 확인 모달
  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">목표 삭제 확인</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            정말 이 목표를 삭제하시겠습니까? 삭제된 목표는 복원할 수 있습니다.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              아니오
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              예
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 성과 달성 옵션 설정 모달
  const renderMeasurementModal = () => {
    if (!showMeasurementModal || !selectedKeyResult) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">성과 달성 옵션 설정</h3>
            <button
              onClick={() => setShowMeasurementModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Result
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded">
                {selectedKeyResult.text}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                달성치 수집 방법
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="measurementType"
                    value="automatic"
                    checked={selectedKeyResult.measurementType === "automatic"}
                    onChange={(e) =>
                      updateKeyResultMeasurement(
                        selectedKeyResult.id,
                        "measurementType",
                        e.target.value,
                      )
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      SNS 채널 연결
                    </div>
                    <div className="text-sm text-gray-500">
                      소셜 미디어 플랫폼에서 자동으로 데이터 수집
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="measurementType"
                    value="manual"
                    checked={selectedKeyResult.measurementType === "manual"}
                    onChange={(e) =>
                      updateKeyResultMeasurement(
                        selectedKeyResult.id,
                        "measurementType",
                        e.target.value,
                      )
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      수동 입력
                    </div>
                    <div className="text-sm text-gray-500">
                      직접 수치를 입력하여 관리
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="measurementType"
                    value="checklist"
                    checked={selectedKeyResult.measurementType === "checklist"}
                    onChange={(e) =>
                      updateKeyResultMeasurement(
                        selectedKeyResult.id,
                        "measurementType",
                        e.target.value,
                      )
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      체크리스트
                    </div>
                    <div className="text-sm text-gray-500">
                      작업 항목을 체크하여 진행률 관리
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {selectedKeyResult.measurementType === "automatic" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  데이터 소스 선택
                </label>
                <select
                  value={selectedKeyResult.dataSource || ""}
                  onChange={(e) =>
                    updateKeyResultMeasurement(
                      selectedKeyResult.id,
                      "dataSource",
                      e.target.value,
                    )
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                >
                  <option value="">데이터 소스를 선택하세요</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Google Analytics">Google Analytics</option>
                  <option value="Naver Analytics">Naver Analytics</option>
                </select>
              </div>
            )}

            {selectedKeyResult.measurementType === "manual" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    목표값
                  </label>
                  <Input
                    type="number"
                    value={selectedKeyResult.target || ""}
                    onChange={(e) =>
                      updateKeyResultMeasurement(
                        selectedKeyResult.id,
                        "target",
                        parseFloat(e.target.value),
                      )
                    }
                    placeholder="목표값"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    현재값
                  </label>
                  <Input
                    type="number"
                    value={selectedKeyResult.current || ""}
                    onChange={(e) =>
                      updateKeyResultMeasurement(
                        selectedKeyResult.id,
                        "current",
                        parseFloat(e.target.value),
                      )
                    }
                    placeholder="현재값"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowMeasurementModal(false)}
            >
              취소
            </Button>
            <Button onClick={() => setShowMeasurementModal(false)}>저장</Button>
          </div>
        </div>
      </div>
    );
  };

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
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  담당자: {plan.manager}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  기간: {plan.startDate} ~ {plan.endDate}
                </span>
              </div>
              {plan.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {plan.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* 상태 변경 버튼 */}
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
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${plan.progress}%`,
                  background: "linear-gradient(to right, #3b82f6, #1e40af)",
                }}
              ></div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 목표 달성도 (OKRs) */}
      {renderObjectives()}

      {/* 전략 개요 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              전략 개요
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
              onClick={
                isEditingStrategy ? handleSaveStrategy : handleStartEditStrategy
              }
            >
              {isEditingStrategy ? (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  저장
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-1" />
                  편집
                </>
              )}
            </Button>
            {isEditingStrategy && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEditStrategy}
                className="text-gray-500"
              >
                <X className="w-4 h-4 mr-1" />
                취소
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  타겟 고객
                </h4>
                {isEditingStrategy ? (
                  <textarea
                    value={editingStrategyData.targetPersona}
                    onChange={(e) =>
                      setEditingStrategyData((prev) => ({
                        ...prev,
                        targetPersona: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={3}
                    placeholder="타겟 고객을 입력하세요"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    {plan.targetPersona}
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  핵심 메시지
                </h4>
                {isEditingStrategy ? (
                  <textarea
                    value={editingStrategyData.coreMessage}
                    onChange={(e) =>
                      setEditingStrategyData((prev) => ({
                        ...prev,
                        coreMessage: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={3}
                    placeholder="핵심 메시지를 입력하세요"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    {plan.coreMessage}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                주요 채널
              </h4>
              {isEditingStrategy ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {editingStrategyData.channels.map((channel, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 flex items-center gap-1"
                      >
                        {channel}
                        <button
                          onClick={() => handleRemoveChannel(channel)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="채널을 입력하고 Enter를 누르세요"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        handleAddChannel(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {plan.channels?.map((channel, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300"
                    >
                      {channel}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주요 활동 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              주요 활동
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
              onClick={handleStartAddActivity}
            >
              <Plus className="w-4 h-4 mr-1" />
              활동 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="space-y-3">
              {plan.initiatives?.map((initiative, index) => (
                <div key={index}>
                  {editingActivity?.originalId === initiative.id ? (
                    // 편집 모드
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            활동명
                          </label>
                          <Input
                            value={editingActivity.name}
                            onChange={(e) =>
                              setEditingActivity((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="활동명을 입력하세요"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              캠페인 연결
                            </label>
                            <select
                              value={editingActivity.campaignId || ""}
                              onChange={(e) =>
                                setEditingActivity((prev) => ({
                                  ...prev,
                                  campaignId: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="">캠페인을 선택하세요</option>
                              <option value="camp1">
                                2025 신제품 런칭 캠페인
                              </option>
                              <option value="camp2">여름 시즌 프로모션</option>
                              <option value="camp3">
                                브랜드 인지도 향상 캠페인
                              </option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              예산 (만원)
                            </label>
                            <Input
                              type="number"
                              value={editingActivity.budget}
                              onChange={(e) =>
                                setEditingActivity((prev) => ({
                                  ...prev,
                                  budget: e.target.value,
                                }))
                              }
                              placeholder="예산을 입력하세요"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEditActivity}>
                            <Save className="w-4 h-4 mr-1" />
                            저장
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingActivity(null)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            취소
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 표시 모드
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {initiative.name}
                        </span>
                        {getStatusBadge(initiative.status)}
                        {initiative.linkedToCampaign && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300"
                          >
                            캠페인연동
                          </Badge>
                        )}
                        {initiative.budget > 0 && (
                          <Badge variant="outline" className="text-xs">
                            예산: {initiative.budget}만원
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!initiative.linkedToCampaign && (
                          <Button size="sm" variant="outline">
                            <Link className="w-4 h-4 mr-1" />
                            캠페인 연결
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setShowActivityDropdown(
                              showActivityDropdown === index ? null : index,
                            )
                          }
                          className="relative"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        {showActivityDropdown === index && (
                          <div className="absolute right-0 top-8 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                            <button
                              onClick={() => handleEditActivity(initiative.id)}
                              className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              수정
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteActivity(initiative.id)
                              }
                              className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* 새 활동 추가 폼 */}
              {showAddActivity && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        활동명 *
                      </label>
                      <Input
                        value={newActivity.name}
                        onChange={(e) =>
                          setNewActivity((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="활동명을 입력하세요"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          캠페인 연결
                        </label>
                        <select
                          value={newActivity.campaignId}
                          onChange={(e) =>
                            setNewActivity((prev) => ({
                              ...prev,
                              campaignId: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">캠페인을 선택하세요</option>
                          <option value="camp1">2025 신제품 런칭 캠페인</option>
                          <option value="camp2">여름 시즌 프로모션</option>
                          <option value="camp3">
                            브랜드 인지도 향상 캠페인
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          예산 (만원)
                        </label>
                        <Input
                          type="number"
                          value={newActivity.budget}
                          onChange={(e) =>
                            setNewActivity((prev) => ({
                              ...prev,
                              budget: e.target.value,
                            }))
                          }
                          placeholder="예산을 입력하세요"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveNewActivity}>
                        <Save className="w-4 h-4 mr-1" />
                        저장
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelAddActivity}
                      >
                        <X className="w-4 h-4 mr-1" />
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            댓글
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{comment.user}</span>
                <span className="text-xs text-gray-500">
                  {comment.timestamp}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {comment.message}{" "}
              </p>
            </div>
          ))}

          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Input
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleAddComment}>
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 히스토리 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            히스토리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.action}</span>
                    <span className="text-gray-500">by {item.user}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.detail}
                  </p>
                  <span className="text-xs text-gray-500">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 모달들 */}
      {renderDeleteModal()}
      {renderMeasurementModal()}
    </div>
  );
}
