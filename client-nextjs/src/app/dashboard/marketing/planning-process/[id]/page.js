"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { useLanguage } from "@/contexts/languageContext.js";
import {
  Target,
  Calendar,
  Users,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  X,
  Save,
  CheckCircle,
  Circle,
  Clock,
  User,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Award,
  Zap,
  Eye,
  Settings,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Activity,
} from "lucide-react";

export default function PlanningProcessDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const planId = params.id;

  // 상태 관리
  const [plan, setPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [objectives, setObjectives] = useState([]);
  const [keyResults, setKeyResults] = useState([]);
  const [showNewObjectiveModal, setShowNewObjectiveModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showKRModal, setShowKRModal] = useState(false);
  const [showEditKRModal, setShowEditKRModal] = useState(false);
  const [selectedKR, setSelectedKR] = useState(null);
  const [editingObjIndex, setEditingObjIndex] = useState(null);
  const [editingKRIndex, setEditingKRIndex] = useState(null);
  const [newObjectiveTitle, setNewObjectiveTitle] = useState("");
  const [newObjective, setNewObjective] = useState({
    title: "",
    description: "",
    keyResults: [
      {
        title: "",
        description: "",
        type: "number",
        target: "",
        current: "",
        unit: "",
        checklist: [],
      },
    ],
  });

  const [editKR, setEditKR] = useState({
    title: "",
    description: "",
    type: "number",
    target: "",
    current: "",
    unit: "",
    checklist: [],
  });
  const [editingObjective, setEditingObjective] = useState(null);
  const [showEditObjectiveModal, setShowEditObjectiveModal] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [collapsedObjectives, setCollapsedObjectives] = useState(new Set());

  // 사용자 목록 (담당자 선택용)
  const availableUsers = [
    { value: "김마케팅", label: "김마케팅", color: "bg-blue-400" },
    { value: "이기획", label: "이기획", color: "bg-green-400" },
    { value: "박전략", label: "박전략", color: "bg-purple-400" },
    { value: "최브랜드", label: "최브랜드", color: "bg-pink-400" },
  ];

  // 샘플 데이터
  const samplePlan = {
    id: 1,
    title: "2025년 1분기 마케팅 계획",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    manager: "김마케팅",
    status: "진행중",
    description:
      "새로운 년도를 맞아 브랜드 인지도 향상과 고객 확보를 목표로 하는 종합적인 마케팅 전략",
    targetPersona: "20-30대 직장인",
    coreMessage: "일상을 더 스마트하게, 더 편리하게",
    progress: 65,
  };

  // 목표 및 핵심 결과 샘플 데이터
  const sampleObjectives = [
    {
      id: 1,
      title: "Z세대 인지도 확보",
      isActive: true,
      keyResults: [
        {
          id: 1,
          type: "numeric",
          description: "틱톡 팔로워 증가",
          target: "50000",
          currentValue: 32500,
          unit: "명",
        },
        {
          id: 2,
          type: "checklist",
          description: "브랜드 캠페인 실행",
          checklist: [
            { text: "인플루언서 5명과 협업 계약 체결", completed: true },
            { text: "브랜드 해시태그 캠페인 기획", completed: true },
            { text: "틱톡 챌린지 콘텐츠 제작", completed: false },
            { text: "캠페인 성과 분석 리포트 작성", completed: false },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "온라인 매출 증대",
      isActive: true,
      keyResults: [
        {
          id: 3,
          type: "numeric",
          description: "온라인 매출 증가",
          target: "30",
          currentValue: 18,
          unit: "%",
        },
        {
          id: 4,
          type: "numeric",
          description: "전환율 향상",
          target: "3.5",
          currentValue: 2.8,
          unit: "%",
        },
      ],
    },
  ];

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadPlanData = async () => {
      try {
        console.log("Loading plan data for ID:", planId);
        setLoading(true);

        // 실제 API 호출 대신 샘플 데이터 사용
        setTimeout(() => {
          setPlan(samplePlan);
          setCurrentPlan(samplePlan);
          setEditingPlan(samplePlan);
          setObjectives(sampleObjectives);

          // 모든 핵심 결과를 평면화하여 keyResults 배열에 저장
          const allKeyResults = sampleObjectives.flatMap(
            (obj) => obj.keyResults,
          );
          setKeyResults(allKeyResults);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Network error:", error);
        setLoading(false);
      }
    };

    if (planId) {
      loadPlanData();
    }
  }, [planId]);

  // 목표 진행률 계산 함수
  const calculateObjectiveProgress = (objective) => {
    if (!objective.keyResults || objective.keyResults.length === 0) return 0;

    const totalProgress = objective.keyResults.reduce((sum, kr) => {
      if (kr.type === "numeric") {
        const progress = Math.min(
          (kr.currentValue / parseFloat(kr.target)) * 100,
          100,
        );
        return sum + progress;
      } else if (kr.type === "checklist") {
        const completed = kr.checklist.filter((item) => item.completed).length;
        const total = kr.checklist.length;
        return sum + (total > 0 ? (completed / total) * 100 : 0);
      }
      return sum;
    }, 0);

    return Math.round(totalProgress / objective.keyResults.length);
  };

  // 전체 진행률 계산 함수
  const calculateOverallProgress = () => {
    if (!objectives || objectives.length === 0) return 0;

    const totalProgress = objectives.reduce((sum, objective) => {
      const objectiveProgress = calculateObjectiveProgress(objective);
      return sum + objectiveProgress;
    }, 0);

    return Math.round(totalProgress / objectives.length);
  };

  // 체크리스트 항목 추가
  const addChecklistItem = (krId) => {
    const updatedKeyResults = keyResults.map((kr) =>
      kr.id === krId
        ? {
            ...kr,
            checklist: [
              ...(kr.checklist || []),
              { text: "", completed: false },
            ],
          }
        : kr,
    );
    setKeyResults(updatedKeyResults);

    // 선택된 목표 수정 시에도 업데이트
    if (selectedObjective) {
      setSelectedObjective((prev) => ({
        ...prev,
        keyResults: updatedKeyResults,
      }));
    }
  };

  // 체크리스트 항목 업데이트
  const updateChecklistItem = (krId, itemIndex, text) => {
    const updatedKeyResults = keyResults.map((kr) =>
      kr.id === krId
        ? {
            ...kr,
            checklist: (kr.checklist || []).map((item, index) =>
              index === itemIndex ? { ...item, text } : item,
            ),
          }
        : kr,
    );
    setKeyResults(updatedKeyResults);

    // 선택된 목표 수정 시에도 업데이트
    if (selectedObjective) {
      setSelectedObjective((prev) => ({
        ...prev,
        keyResults: updatedKeyResults,
      }));
    }
  };

  // 체크리스트 항목 토글
  const toggleChecklistItem = (krId, itemIndex) => {
    setKeyResults(
      keyResults.map((kr) =>
        kr.id === krId
          ? {
              ...kr,
              checklist: kr.checklist.map((item, index) =>
                index === itemIndex
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
            }
          : kr,
      ),
    );
  };

  // 체크리스트 항목 삭제
  const removeChecklistItem = (krId, itemIndex) => {
    setKeyResults(
      keyResults.map((kr) =>
        kr.id === krId
          ? {
              ...kr,
              checklist: kr.checklist.filter((_, index) => index !== itemIndex),
            }
          : kr,
      ),
    );
  };

  // 새 목표 추가
  const addNewObjective = () => {
    if (!newObjective.title.trim()) return;

    const newId = objectives.length + 1;
    const newObj = {
      id: newId,
      title: newObjective.title,
      isActive: true,
      keyResults: newObjective.keyResults.map((kr, index) => ({
        id: keyResults.length + index + 1,
        type: kr.type,
        description: kr.description,
        target: kr.target,
        currentValue: kr.currentValue || 0,
        unit: kr.unit || "",
        checklist: kr.checklist || [],
      })),
    };

    setObjectives([...objectives, newObj]);
    setKeyResults([...keyResults, ...newObj.keyResults]);
    setShowNewObjectiveModal(false);
  };

  // 핵심결과 편집 함수
  const handleEditKeyResult = (objIndex, krIndex) => {
    const objective = objectives[objIndex];
    const keyResult = objective.keyResults[krIndex];

    setSelectedKR(keyResult);
    setEditingObjIndex(objIndex);
    setEditingKRIndex(krIndex);
    setShowEditKRModal(true);
  };

  // 핵심결과 확장(복제) 함수
  const handleExpandKeyResult = (objIndex, krIndex) => {
    const objective = objectives[objIndex];
    const keyResult = objective.keyResults[krIndex];

    const expandedKR = {
      ...keyResult,
      id: `kr_${Date.now()}`,
      title: `${keyResult.title} (복사본)`,
      progress: 0,
    };

    setObjectives((prev) =>
      prev.map((obj, i) =>
        i === objIndex
          ? { ...obj, keyResults: [...obj.keyResults, expandedKR] }
          : obj,
      ),
    );
  };

  // 핵심결과 삭제 함수
  const handleDeleteKeyResult = (objIndex, krIndex) => {
    if (window.confirm("이 핵심결과를 삭제하시겠습니까?")) {
      setObjectives((prev) =>
        prev.map((obj, i) =>
          i === objIndex
            ? {
                ...obj,
                keyResults: obj.keyResults.filter((_, ki) => ki !== krIndex),
              }
            : obj,
        ),
      );
    }
  };

  const updateKeyResult = useCallback((id, updates) => {
    setKeyResults((prev) =>
      prev.map((kr) => (kr.id === id ? { ...kr, ...updates } : kr)),
    );
  }, []);

  const deleteKR = useCallback((id) => {
    setKeyResults((prev) => prev.filter((kr) => kr.id !== id));
  }, []);

  // 목표 확장/축소 토글 함수
  const toggleObjectiveCollapse = (objectiveId) => {
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

  // 목표 수정 함수
  const handleEditObjective = (objective) => {
    setEditingObjective({
      ...objective,
      originalIndex: objectives.findIndex((obj) => obj.id === objective.id),
    });
    setShowEditObjectiveModal(true);
  };

  // 목표 삭제 확인 함수
  const handleDeleteObjective = (objective) => {
    setObjectiveToDelete(objective);
    setShowDeleteConfirmModal(true);
  };

  // 목표 비활성화 함수
  const confirmDeleteObjective = async () => {
    if (!objectiveToDelete) return;

    try {
      // 백엔드 API 호출 (실제 구현 시 사용)
      // await fetch(`/api/objectives/${objectiveToDelete.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isActive: false })
      // });

      // 현재는 프론트엔드에서만 처리
      setObjectives((prev) => {
        const updatedObjectives = prev.map((obj) =>
          obj.id === objectiveToDelete.id ? { ...obj, isActive: false } : obj,
        );

        // 비활성화된 목표를 최하단으로 이동
        const activeObjectives = updatedObjectives.filter(
          (obj) => obj.isActive,
        );
        const inactiveObjectives = updatedObjectives.filter(
          (obj) => !obj.isActive,
        );

        return [...activeObjectives, ...inactiveObjectives];
      });

      setShowDeleteConfirmModal(false);
      setObjectiveToDelete(null);
    } catch (error) {
      console.error("목표 비활성화 중 오류 발생:", error);
    }
  };

  // 목표 수정 저장 함수
  const saveEditedObjective = () => {
    if (!editingObjective) return;

    setObjectives((prev) =>
      prev.map((obj) =>
        obj.id === editingObjective.id
          ? { ...obj, title: editingObjective.title }
          : obj,
      ),
    );

    setShowEditObjectiveModal(false);
    setEditingObjective(null);
  };

  // 커스텀 드롭다운 컴포넌트
  const CustomDropdown = ({
    value,
    options,
    onChange,
    placeholder,
    className = "",
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 backdrop-blur-sm"
        >
          <span className={value ? "text-white" : "text-white/70"}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200 text-gray-900 dark:text-white"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 커스텀 캘린더 입력 컴포넌트
  const CustomDateInput = ({
    value,
    onChange,
    placeholder,
    className = "",
  }) => {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 backdrop-blur-sm [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 ${className}`}
        placeholder={placeholder}
      />
    );
  };

  // 저장 핸들러
  const handleSave = () => {
    setCurrentPlan(editingPlan);
    setPlan(editingPlan);
    setIsEditMode(false);
  };

  // 헤더 렌더링 함수
  const renderHeader = () => {
    if (!currentPlan) return null;

    if (isEditMode) {
      return (
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 첫 번째 행 */}
            <div className="lg:col-span-2">
              <Label className="block text-sm font-medium text-white/90 mb-2">
                계획명
              </Label>
              <Input
                value={editingPlan.title}
                onChange={(e) =>
                  setEditingPlan((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 backdrop-blur-sm"
                placeholder="계획명을 입력하세요"
              />
            </div>

            {/* 두 번째 행 */}
            <div>
              <Label className="block text-sm font-medium text-white/90 mb-2">
                시작일
              </Label>
              <CustomDateInput
                value={editingPlan.startDate}
                onChange={(value) =>
                  setEditingPlan((prev) => ({ ...prev, startDate: value }))
                }
                placeholder="시작일을 선택하세요"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-white/90 mb-2">
                종료일
              </Label>
              <CustomDateInput
                value={editingPlan.endDate}
                onChange={(value) =>
                  setEditingPlan((prev) => ({ ...prev, endDate: value }))
                }
                placeholder="종료일을 선택하세요"
              />
            </div>

            {/* 세 번째 행 */}
            <div>
              <Label className="block text-sm font-medium text-white/90 mb-2">
                담당자
              </Label>
              <CustomDropdown
                value={editingPlan.manager}
                options={availableUsers}
                onChange={(value) =>
                  setEditingPlan((prev) => ({ ...prev, manager: value }))
                }
                placeholder="담당자를 선택하세요"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-white/90 mb-2">
                상태
              </Label>
              <CustomDropdown
                value={editingPlan.status}
                options={[
                  { value: "미시작", label: "미시작" },
                  { value: "보류", label: "보류" },
                  { value: "진행중", label: "진행중" },
                  { value: "중단", label: "중단" },
                  { value: "완료", label: "완료" },
                ]}
                onChange={(value) =>
                  setEditingPlan((prev) => ({ ...prev, status: value }))
                }
                placeholder="상태를 선택하세요"
              />
            </div>

            {/* 네 번째 행 */}
            <div>
              <Label className="block text-sm font-medium text-white/90 mb-2">
                타겟 고객
              </Label>
              <Input
                value={editingPlan.targetPersona}
                onChange={(e) =>
                  setEditingPlan((prev) => ({
                    ...prev,
                    targetPersona: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 backdrop-blur-sm"
                placeholder="타겟 고객을 입력하세요"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-white/90 mb-2">
                핵심 메시지
              </Label>
              <Input
                value={editingPlan.coreMessage}
                onChange={(e) =>
                  setEditingPlan((prev) => ({
                    ...prev,
                    coreMessage: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 backdrop-blur-sm"
                placeholder="핵심 메시지를 입력하세요"
              />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setEditingPlan(currentPlan);
                setIsEditMode(false);
              }}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="bg-white text-blue-600 hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">{currentPlan.title}</h1>
            <p className="text-blue-100 text-lg mb-4">
              {currentPlan.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-xs text-blue-200">기간</p>
                    <p className="font-semibold">
                      {currentPlan.startDate} ~ {currentPlan.endDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-green-200" />
                  <div>
                    <p className="text-xs text-green-200">담당자</p>
                    <p className="font-semibold">{currentPlan.manager}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-200" />
                  <div>
                    <p className="text-xs text-purple-200">타겟 고객</p>
                    <p className="font-semibold">{currentPlan.targetPersona}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-pink-200" />
                  <div>
                    <p className="text-xs text-pink-200">핵심 메시지</p>
                    <p className="font-semibold text-sm">
                      {currentPlan.coreMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 진행률 표시 */}
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/90">
                  전체 진행률
                </span>
                <span className="text-lg font-bold">
                  {calculateOverallProgress()}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${calculateOverallProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsEditMode(true)}
            className="bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            수정
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            계획 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            계획을 찾을 수 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            요청하신 마케팅 계획이 존재하지 않거나 삭제되었습니다.
          </p>
          <Button
            onClick={() => router.push("/dashboard/marketing/planning-process")}
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-8 animate-fadeIn">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="outline"
        onClick={() => router.push("/dashboard/marketing/planning-process")}
        className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        마케팅 계획 목록으로
      </Button>

      {/* 헤더 */}
      {renderHeader()}

      {/* 목표(Objectives) 섹션 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              목표 설정 (OKR)
            </h2>
          </div>
          <Button
            onClick={() => setShowNewObjectiveModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4" />새 목표 추가
          </Button>
        </div>

        <div className="grid gap-6">
          {objectives.map((objective, objIndex) => {
            const isCollapsed = collapsedObjectives.has(objective.id);
            const isInactive = !objective.isActive;

            return (
              <Card
                key={objective.id}
                className={`bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 relative ${
                  isInactive ? "opacity-50" : ""
                }`}
              >
                {isInactive && (
                  <div className="absolute inset-0 bg-gray-500 bg-opacity-30 rounded-lg flex items-center justify-center z-10">
                    <span className="text-gray-700 dark:text-gray-300 font-medium bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
                      비활성화된 목표입니다
                    </span>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <svg
                          className="w-12 h-12 transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            strokeDasharray={`${calculateObjectiveProgress(objective)}, 100`}
                          />
                          <defs>
                            <linearGradient id="gradient">
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          {objective.title}
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400">
                          {calculateObjectiveProgress(objective)}% 완료
                        </p>
                      </div>
                    </div>

                    {/* 관리 버튼들 */}
                    <div className="flex items-center gap-2">
                      {/* 확장/축소 버튼 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleObjectiveCollapse(objective.id)}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={isInactive}
                      >
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </Button>

                      {/* 수정 버튼 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditObjective(objective)}
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        disabled={isInactive}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      {/* 삭제 버튼 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteObjective(objective)}
                        className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        disabled={isInactive}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {!isCollapsed && (
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded text-white font-bold flex items-center justify-center text-xs">
                          KR
                        </div>
                        핵심 결과 (Key Results)
                      </h4>

                      {objective.keyResults.map((kr, index) => (
                        <div
                          key={kr.id}
                          className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {kr.description}
                            </h5>
                            <Badge
                              variant="outline"
                              className={
                                kr.type === "numeric"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-green-50 text-green-700 border-green-200"
                              }
                            >
                              {kr.type === "numeric"
                                ? "수치 기반"
                                : "체크리스트 기반"}
                            </Badge>
                          </div>

                          {kr.type === "numeric" && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  현재: {kr.currentValue.toLocaleString()}
                                  {kr.unit} / 목표:{" "}
                                  {parseFloat(kr.target).toLocaleString()}
                                  {kr.unit}
                                </span>
                                <span className="font-semibold text-blue-600">
                                  {Math.min(
                                    Math.round(
                                      (kr.currentValue /
                                        parseFloat(kr.target)) *
                                        100,
                                    ),
                                    100,
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 shadow-sm"
                                  style={{
                                    width: `${Math.min((kr.currentValue / parseFloat(kr.target)) * 100, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {kr.type === "checklist" && (
                            <div className="space-y-3">
                              <div className="space-y-2">
                                {kr.checklist.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center gap-3 group"
                                  >
                                    <button
                                      onClick={() =>
                                        toggleChecklistItem(kr.id, itemIndex)
                                      }
                                      className="flex-shrink-0"
                                    >
                                      {item.completed ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-gray-400" />
                                      )}
                                    </button>
                                    <Input
                                      value={item.text}
                                      onChange={(e) =>
                                        updateChecklistItem(
                                          kr.id,
                                          itemIndex,
                                          e.target.value,
                                        )
                                      }
                                      className={`flex-1 bg-transparent border-none p-0 h-auto focus:ring-0 
                                  ${item.completed ? "line-through text-gray-500" : ""}`}
                                      placeholder="체크리스트 항목을 입력하세요"
                                    />
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        removeChecklistItem(kr.id, itemIndex)
                                      }
                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addChecklistItem(kr.id)}
                                className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                <Plus className="w-4 h-4" />
                                항목 추가
                              </Button>

                              {kr.checklist.length > 0 && (
                                <div className="mt-4">
                                  <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      완료:{" "}
                                      {
                                        kr.checklist.filter(
                                          (item) => item.completed,
                                        ).length
                                      }{" "}
                                      / {kr.checklist.length}
                                    </span>
                                    <span className="font-semibold text-green-600">
                                      {kr.checklist.length > 0
                                        ? Math.round(
                                            (kr.checklist.filter(
                                              (item) => item.completed,
                                            ).length /
                                              kr.checklist.length) *
                                              100,
                                          )
                                        : 0}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                      className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-700 shadow-sm"
                                      style={{
                                        width: `${kr.checklist.length > 0 ? (kr.checklist.filter((item) => item.completed).length / kr.checklist.length) * 100 : 0}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {objectives.filter((obj) => obj.isActive).length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                목표가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                첫 번째 목표를 추가하여 계획을 시작하세요.
              </p>
              <Button
                onClick={() => setShowNewObjectiveModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                목표 추가
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 핵심결과 편집 모달 */}
      {showEditKRModal && selectedKR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* 헤더 */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Edit className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">핵심결과 편집</h2>
                    <p className="text-blue-100 text-sm">
                      핵심결과의 세부 정보를 수정하세요
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditKRModal(false);
                    setSelectedKR(null);
                    setEditingObjIndex(null);
                    setEditingKRIndex(null);
                  }}
                  className="text-white hover:bg-white/20 border-white/30"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  기본 정보
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    핵심결과 제목 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={editKR.title || selectedKR.title}
                    onChange={(e) =>
                      setEditKR((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="핵심결과 제목을 입력하세요"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    상세 설명
                  </label>
                  <textarea
                    value={editKR.description || selectedKR.description || ""}
                    onChange={(e) =>
                      setEditKR((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="핵심결과에 대한 상세 설명을 입력하세요"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              {/* 결과 유형 선택 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  결과 유형
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setEditKR((prev) => ({ ...prev, type: "number" }))
                    }
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      (editKR.type || selectedKR.type) === "number"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="text-center">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        수치 기반
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        목표 수치와 현재 값으로 진행률 측정
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setEditKR((prev) => ({ ...prev, type: "checklist" }))
                    }
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      (editKR.type || selectedKR.type) === "checklist"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        체크리스트 기반
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        완료된 항목 수로 진행률 측정
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 수치 기반 입력 */}
              {(editKR.type || selectedKR.type) === "number" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    수치 설정
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        목표 값
                      </label>
                      <Input
                        type="number"
                        value={editKR.target || selectedKR.target || ""}
                        onChange={(e) =>
                          setEditKR((prev) => ({
                            ...prev,
                            target: e.target.value,
                          }))
                        }
                        placeholder="100"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        현재 값
                      </label>
                      <Input
                        type="number"
                        value={editKR.current || selectedKR.current || ""}
                        onChange={(e) =>
                          setEditKR((prev) => ({
                            ...prev,
                            current: e.target.value,
                          }))
                        }
                        placeholder="65"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        단위
                      </label>
                      <Input
                        value={editKR.unit || selectedKR.unit || ""}
                        onChange={(e) =>
                          setEditKR((prev) => ({
                            ...prev,
                            unit: e.target.value,
                          }))
                        }
                        placeholder="명, %, 건"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 체크리스트 기반 입력 */}
              {(editKR.type || selectedKR.type) === "checklist" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    체크리스트 항목
                  </h3>

                  <div className="space-y-3">
                    {(
                      (editKR.checklist && editKR.checklist.length > 0
                        ? editKR.checklist
                        : selectedKR.checklist) || []
                    ).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed || false}
                          onChange={(e) => {
                            const updatedChecklist = [
                              ...(editKR.checklist ||
                                selectedKR.checklist ||
                                []),
                            ];
                            updatedChecklist[index] = {
                              ...item,
                              completed: e.target.checked,
                            };
                            setEditKR((prev) => ({
                              ...prev,
                              checklist: updatedChecklist,
                            }));
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Input
                          value={item.text || ""}
                          onChange={(e) => {
                            const updatedChecklist = [
                              ...(editKR.checklist ||
                                selectedKR.checklist ||
                                []),
                            ];
                            updatedChecklist[index] = {
                              ...item,
                              text: e.target.value,
                            };
                            setEditKR((prev) => ({
                              ...prev,
                              checklist: updatedChecklist,
                            }));
                          }}
                          placeholder="체크리스트 항목을 입력하세요"
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const updatedChecklist = (
                              editKR.checklist ||
                              selectedKR.checklist ||
                              []
                            ).filter((_, i) => i !== index);
                            setEditKR((prev) => ({
                              ...prev,
                              checklist: updatedChecklist,
                            }));
                          }}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => {
                        const newItem = { text: "", completed: false };
                        const currentChecklist =
                          editKR.checklist || selectedKR.checklist || [];
                        setEditKR((prev) => ({
                          ...prev,
                          checklist: [...currentChecklist, newItem],
                        }));
                      }}
                      className="w-full flex items-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      <Plus className="w-4 h-4" />
                      항목 추가
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShowEditKRModal(false);
                    setSelectedKR(null);
                    setEditingObjIndex(null);
                    setEditingKRIndex(null);
                    setEditKR({});
                  }}
                  className="px-6"
                >
                  취소
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    // 편집된 내용으로 업데이트
                    const updatedKR = {
                      ...selectedKR,
                      ...editKR,
                      title: editKR.title || selectedKR.title,
                      description: editKR.description || selectedKR.description,
                      type: editKR.type || selectedKR.type,
                      target: editKR.target || selectedKR.target,
                      current: editKR.current || selectedKR.current,
                      unit: editKR.unit || selectedKR.unit,
                      checklist: editKR.checklist || selectedKR.checklist,
                    };

                    // 진행률 재계산
                    if (
                      updatedKR.type === "number" &&
                      updatedKR.target &&
                      updatedKR.current
                    ) {
                      updatedKR.progress = Math.min(
                        Math.round(
                          (updatedKR.current / updatedKR.target) * 100,
                        ),
                        100,
                      );
                    } else if (
                      updatedKR.type === "checklist" &&
                      updatedKR.checklist
                    ) {
                      const completed = updatedKR.checklist.filter(
                        (item) => item.completed,
                      ).length;
                      updatedKR.progress =
                        updatedKR.checklist.length > 0
                          ? Math.round(
                              (completed / updatedKR.checklist.length) * 100,
                            )
                          : 0;
                    }

                    setObjectives((prev) =>
                      prev.map((obj, i) =>
                        i === editingObjIndex
                          ? {
                              ...obj,
                              keyResults: obj.keyResults.map((kr, ki) =>
                                ki === editingKRIndex ? updatedKR : kr,
                              ),
                            }
                          : obj,
                      ),
                    );

                    setShowEditKRModal(false);
                    setSelectedKR(null);
                    setEditingObjIndex(null);
                    setEditingKRIndex(null);
                    setEditKR({});
                  }}
                  className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  변경사항 저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 목표 상세 모달 */}
      {selectedObjective && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl">
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">목표 상세 정보</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedObjective(null)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* 스크롤 가능한 모달 바디 */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
              {/* 목표 정보 */}
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    목표 (Objective)
                  </Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedObjective.title}
                  </p>
                </div>

                {/* 핵심 결과 */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    핵심 결과 (Key Results)
                  </Label>

                  <div className="space-y-4">
                    {selectedObjective.keyResults.map((kr, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {kr.description}
                          </h5>
                          <Badge
                            variant="outline"
                            className={
                              kr.type === "numeric"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-green-50 text-green-700 border-green-200"
                            }
                          >
                            {kr.type === "numeric"
                              ? "수치 기반"
                              : "체크리스트 기반"}
                          </Badge>
                        </div>

                        {kr.type === "numeric" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                현재: {kr.currentValue.toLocaleString()}
                                {kr.unit} / 목표:{" "}
                                {parseFloat(kr.target).toLocaleString()}
                                {kr.unit}
                              </span>
                              <span className="font-semibold text-blue-600">
                                {Math.min(
                                  Math.round(
                                    (kr.currentValue / parseFloat(kr.target)) *
                                      100,
                                  ),
                                  100,
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 shadow-sm"
                                style={{
                                  width: `${Math.min((kr.currentValue / parseFloat(kr.target)) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {kr.type === "checklist" && (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              {kr.checklist.map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex items-center gap-3 group"
                                >
                                  <button
                                    onClick={() =>
                                      toggleChecklistItem(kr.id, itemIndex)
                                    }
                                    className="flex-shrink-0"
                                  >
                                    {item.completed ? (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-gray-400" />
                                    )}
                                  </button>
                                  <Input
                                    value={item.text}
                                    onChange={(e) =>
                                      updateChecklistItem(
                                        kr.id,
                                        itemIndex,
                                        e.target.value,
                                      )
                                    }
                                    className={`flex-1 bg-transparent border-none p-0 h-auto focus:ring-0 ${
                                      item.completed
                                        ? "line-through text-gray-500"
                                        : ""
                                    }`}
                                    placeholder="체크리스트 항목을 입력하세요"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      removeChecklistItem(kr.id, itemIndex)
                                    }
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addChecklistItem(kr.id)}
                              className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <Plus className="w-4 h-4" />
                              항목 추가
                            </Button>

                            {kr.checklist.length > 0 && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    완료:{" "}
                                    {
                                      kr.checklist.filter(
                                        (item) => item.completed,
                                      ).length
                                    }{" "}
                                    / {kr.checklist.length}
                                  </span>
                                  <span className="font-semibold text-green-600">
                                    {kr.checklist.length > 0
                                      ? Math.round(
                                          (kr.checklist.filter(
                                            (item) => item.completed,
                                          ).length /
                                            kr.checklist.length) *
                                            100,
                                        )
                                      : 0}
                                    %
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                  <div
                                    className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-700 shadow-sm"
                                    style={{
                                      width: `${kr.checklist.length > 0 ? (kr.checklist.filter((item) => item.completed).length / kr.checklist.length) * 100 : 0}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 고정 Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t-2 border-gray-200 dark:border-gray-600 p-6">
              <div className="flex justify-end">
                <Button onClick={() => setSelectedObjective(null)}>닫기</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 새 목표 추가 모달 */}
      {showNewObjectiveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl">
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">새 목표 추가</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewObjectiveModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* 스크롤 가능한 모달 바디 */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
              <div className="space-y-6">
                {/* 목표 제목 */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    목표 (Objective) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={newObjective.title}
                    onChange={(e) =>
                      setNewObjective((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="예: Z세대 인지도 확보"
                    className="w-full"
                  />
                </div>

                {/* 핵심 결과 */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    핵심 결과 (Key Results)
                  </Label>

                  <div className="space-y-4">
                    {newObjective.keyResults.map((kr, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4"
                      >
                        {/* 결과 유형 선택 */}
                        <div className="flex items-center gap-4 mb-4">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            결과 유형:
                          </Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                kr.type === "numeric" ? "default" : "outline"
                              }
                              onClick={() => {
                                const updatedKRs = [...newObjective.keyResults];
                                updatedKRs[index] = {
                                  ...kr,
                                  type: "numeric",
                                  checklist: [],
                                };
                                setNewObjective((prev) => ({
                                  ...prev,
                                  keyResults: updatedKRs,
                                }));
                              }}
                              className={
                                kr.type === "numeric"
                                  ? "bg-blue-500 hover:bg-blue-600"
                                  : ""
                              }
                            >
                              수치 기반
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                kr.type === "checklist" ? "default" : "outline"
                              }
                              onClick={() => {
                                const updatedKRs = [...newObjective.keyResults];
                                updatedKRs[index] = {
                                  ...kr,
                                  type: "checklist",
                                  target: "",
                                  unit: "",
                                  currentValue: 0,
                                  checklist: [],
                                };
                                setNewObjective((prev) => ({
                                  ...prev,
                                  keyResults: updatedKRs,
                                }));
                              }}
                              className={
                                kr.type === "checklist"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : ""
                              }
                            >
                              체크리스트 기반
                            </Button>
                          </div>
                        </div>

                        {/* 핵심 결과 설명 */}
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            핵심 결과 설명
                          </Label>
                          <Input
                            value={kr.description}
                            onChange={(e) => {
                              const updatedKRs = [...newObjective.keyResults];
                              updatedKRs[index] = {
                                ...kr,
                                description: e.target.value,
                              };
                              setNewObjective((prev) => ({
                                ...prev,
                                keyResults: updatedKRs,
                              }));
                            }}
                            placeholder="예: 틱톡 팔로워 증가"
                          />
                        </div>

                        {/* 수치 기반 입력 필드 */}
                        {kr.type === "numeric" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                목표 수치
                              </Label>
                              <Input
                                value={kr.target}
                                onChange={(e) => {
                                  const updatedKRs = [
                                    ...newObjective.keyResults,
                                  ];
                                  updatedKRs[index] = {
                                    ...kr,
                                    target: e.target.value,
                                  };
                                  setNewObjective((prev) => ({
                                    ...prev,
                                    keyResults: updatedKRs,
                                  }));
                                }}
                                placeholder="예: 50000"
                              />
                            </div>
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                단위
                              </Label>
                              <Input
                                value={kr.unit}
                                onChange={(e) => {
                                  const updatedKRs = [
                                    ...newObjective.keyResults,
                                  ];
                                  updatedKRs[index] = {
                                    ...kr,
                                    unit: e.target.value,
                                  };
                                  setNewObjective((prev) => ({
                                    ...prev,
                                    keyResults: updatedKRs,
                                  }));
                                }}
                                placeholder="예: 명, %, 건"
                              />
                            </div>
                          </div>
                        )}

                        {/* 체크리스트 기반 입력 필드 */}
                        {kr.type === "checklist" && (
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              체크리스트 항목
                            </Label>
                            <div className="space-y-2">
                              {(kr.checklist || []).map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    value={item.text}
                                    onChange={(e) => {
                                      const updatedKRs = [
                                        ...newObjective.keyResults,
                                      ];
                                      const updatedChecklist = [
                                        ...(kr.checklist || []),
                                      ];
                                      updatedChecklist[itemIndex] = {
                                        ...item,
                                        text: e.target.value,
                                      };
                                      updatedKRs[index] = {
                                        ...kr,
                                        checklist: updatedChecklist,
                                      };
                                      setNewObjective((prev) => ({
                                        ...prev,
                                        keyResults: updatedKRs,
                                      }));
                                    }}
                                    placeholder="체크리스트 항목을 입력하세요"
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const updatedKRs = [
                                        ...newObjective.keyResults,
                                      ];
                                      const updatedChecklist = (
                                        kr.checklist || []
                                      ).filter((_, i) => i !== itemIndex);
                                      updatedKRs[index] = {
                                        ...kr,
                                        checklist: updatedChecklist,
                                      };
                                      setNewObjective((prev) => ({
                                        ...prev,
                                        keyResults: updatedKRs,
                                      }));
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const updatedKRs = [
                                    ...newObjective.keyResults,
                                  ];
                                  const updatedChecklist = [
                                    ...(kr.checklist || []),
                                    { text: "", completed: false },
                                  ];
                                  updatedKRs[index] = {
                                    ...kr,
                                    checklist: updatedChecklist,
                                  };
                                  setNewObjective((prev) => ({
                                    ...prev,
                                    keyResults: updatedKRs,
                                  }));
                                }}
                                className="flex items-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                항목 추가
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* 핵심 결과 삭제 버튼 */}
                        {newObjective.keyResults.length > 1 && (
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const updatedKRs =
                                  newObjective.keyResults.filter(
                                    (_, i) => i !== index,
                                  );
                                setNewObjective((prev) => ({
                                  ...prev,
                                  keyResults: updatedKRs,
                                }));
                              }}
                              className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              핵심 결과 삭제
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* 핵심 결과 추가 버튼 */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setNewObjective((prev) => ({
                          ...prev,
                          keyResults: [
                            ...prev.keyResults,
                            {
                              type: "numeric",
                              description: "",
                              target: "",
                              currentValue: 0,
                              unit: "",
                              checklist: [],
                            },
                          ],
                        }));
                      }}
                      className="w-full flex items-center gap-2 border-dashed border-2"
                    >
                      <Plus className="w-4 h-4" />
                      핵심 결과 추가
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 고정 Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t-2 border-gray-200 dark:border-gray-600 p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    변경사항이 자동으로 저장됩니다
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewObjectiveModal(false)}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={addNewObjective}
                    disabled={!newObjective.title.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    목표 추가
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Objective Modal */}
      {showEditObjectiveModal && editingObjective && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Edit Objective</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditObjectiveModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Objective Title
                  </Label>
                  <Input
                    value={editingObjective.title}
                    onChange={(e) =>
                      setEditingObjective((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter objective title"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t-2 border-gray-200 dark:border-gray-600 p-6">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEditObjectiveModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEditedObjective}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && objectiveToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Deletion
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to disable the objective "
                {objectiveToDelete.title}"? This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteObjective}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
