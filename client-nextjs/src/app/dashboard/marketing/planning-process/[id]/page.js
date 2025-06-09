"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { useLanguage } from "@/contexts/languageContext.js";
import {
  ArrowLeft,
  Target,
  Calendar,
  User,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Activity,
  Users,
  MessageSquare,
  Clock,
  Zap,
  Award,
  RefreshCw
} from "lucide-react";

export default function MarketingPlanDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const planId = params.id;

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedObjectives, setExpandedObjectives] = useState({});
  const [keyResults, setKeyResults] = useState([]);
  const [objectiveTitle, setObjectiveTitle] = useState("");

  // 새로운 편집 상태
  const [editingPeriod, setEditingPeriod] = useState(false);
  const [editingManager, setEditingManager] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [editingMessage, setEditingMessage] = useState(false);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [tempManager, setTempManager] = useState("");
  const [tempTarget, setTempTarget] = useState("");
  const [tempMessage, setTempMessage] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 샘플 데이터
  const samplePlan = {
    id: parseInt(planId),
    title: "2025년 1분기 마케팅 계획",
    description: "Z세대 타겟 마케팅을 통한 브랜드 인지도 향상 및 매출 증대를 목표로 하는 전략적 마케팅 계획입니다.",
    status: "진행중",
    progress: 65,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    manager: "김마케팅",
    createdAt: "2025-01-15",
    updatedAt: "2025-06-08",
    targetPersona: "20-30대 직장인",
    coreMessage: "일상을 더 스마트하게, 더 편리하게",
    channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
    objectives: [
      {
        id: 1,
        title: "Z세대 인지도 확보",
        progress: 75,
        confidence: "On Track",
        isActive: true,
        keyResults: [
          { id: 1, title: "틱톡 팔로워 수", target: 50000, current: 38500, unit: "명", type: "number", isActive: true },
          { id: 2, title: "브랜드 인지도", target: 20, current: 15, unit: "%", type: "percentage", isActive: true },
          { id: 3, title: "UGC 콘텐츠 수집", target: 100, current: 82, unit: "건", type: "number", isActive: true },
          { id: 4, title: "참여율 증가", target: 5, current: 3.8, unit: "%", type: "percentage", isActive: true },
          { id: 5, title: "해시태그 사용량", target: 1000, current: 750, unit: "회", type: "number", isActive: true }
        ]
      },
      {
        id: 2,
        title: "온라인 매출 증대",
        progress: 55,
        confidence: "At Risk",
        isActive: true,
        keyResults: [
          { id: 6, title: "온라인 매출", target: 30, current: 18, unit: "%", type: "percentage", isActive: true },
          { id: 7, title: "전환율", target: 3.5, current: 2.1, unit: "%", type: "percentage", isActive: true },
          { id: 8, title: "고객 생애가치", target: 25, current: 12, unit: "%", type: "percentage", isActive: true },
          { id: 9, title: "신규 고객 획득", target: 500, current: 280, unit: "명", type: "number", isActive: true }
        ]
      },
      {
        id: 3,
        title: "고객 만족도 향상",
        progress: 88,
        confidence: "On Track",
        isActive: true,
        keyResults: [
          { id: 10, title: "고객 만족도", target: 4.5, current: 4.2, unit: "점", type: "rating", isActive: true },
          { id: 11, title: "재구매율", target: 40, current: 38, unit: "%", type: "percentage", isActive: true },
          { id: 12, title: "리뷰 평점", target: 4.7, current: 4.6, unit: "점", type: "rating", isActive: true }
        ]
      }
    ]
  };

  // 히스토리 데이터
  const activityHistory = [
    {
      id: 1,
      action: "목표 수정",
      description: "Z세대 인지도 확보 목표의 틱톡 팔로워 수 업데이트",
      user: "김마케팅",
      timestamp: "2025-06-08 14:30",
      type: "edit"
    },
    {
      id: 2,
      action: "진행률 업데이트",
      description: "온라인 매출 증대 목표 진행률 55%로 업데이트",
      user: "이분석",
      timestamp: "2025-06-08 10:15",
      type: "progress"
    },
    {
      id: 3,
      action: "새 목표 추가",
      description: "고객 만족도 향상 목표 추가",
      user: "박전략",
      timestamp: "2025-06-07 16:45",
      type: "create"
    }
  ];

  // 사용자 데이터 가져오기
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      // 실제 환경에서는 API 호출
      // const response = await fetch('/api/users');
      // const users = await response.json();

      // 임시 데이터
      const mockUsers = [
        { id: 1, name: "김마케팅", email: "kim.marketing@company.com", role: "마케팅 총괄", avatar: "/api/placeholder/40/40" },
        { id: 2, name: "이기획", email: "lee.planning@company.com", role: "마케팅 기획자", avatar: "/api/placeholder/40/40" },
        { id: 3, name: "박전략", email: "park.strategy@company.com", role: "전략 기획자", avatar: "/api/placeholder/40/40" },
        { id: 4, name: "최브랜드", email: "choi.brand@company.com", role: "브랜드 매니저", avatar: "/api/placeholder/40/40" },
        { id: 5, name: "정콘텐츠", email: "jung.content@company.com", role: "콘텐츠 팀장", avatar: "/api/placeholder/40/40" },
        { id: 6, name: "한디자인", email: "han.design@company.com", role: "디자이너", avatar: "/api/placeholder/40/40" }
      ];

      setAvailableUsers(mockUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 계획 데이터 로드
  useEffect(() => {
    const loadPlanData = async () => {
      try {
        console.log("Loading plan data for ID:", planId);
        setLoading(true);

        // 실제 환경에서는 API 호출
        // const response = await fetch(`/api/marketing/plans/${planId}`);
        // const planData = await response.json();

        // 임시 데이터 (실제로는 API에서 가져옴)
        const mockPlan = {
          id: parseInt(planId),
          title: "2025년 1분기 마케팅 계획",
          status: "진행중",
          progress: 65,
          startDate: "2025-01-01",
          endDate: "2025-03-31",
          manager: "김마케팅",
          targetPersona: "20-30대 직장인",
          coreMessage: "일상을 더 스마트하게, 더 편리하게",
          createdAt: "2025-01-15",
          updatedAt: "2025-06-08",
          objectives: [
            {
              id: 1,
              title: "Z세대 인지도 확보",
              status: "진행중",
              progress: 70,
              keyResults: [
                { id: 1, title: "틱톡 팔로워 5만 달성", target: 50000, current: 35000, unit: "명" },
                { id: 2, title: "브랜드 인지도 20% 증가", target: 20, current: 15, unit: "%" },
                { id: 3, title: "UGC 콘텐츠 100건 수집", target: 100, current: 78, unit: "건" }
              ]
            },
            {
              id: 2,
              title: "온라인 매출 증대",
              status: "진행중",
              progress: 60,
              keyResults: [
                { id: 4, title: "온라인 매출 30% 증가", target: 30, current: 18, unit: "%" },
                { id: 5, title: "전환율 3.5% 달성", target: 3.5, current: 2.8, unit: "%" },
                { id: 6, title: "고객 생애가치 25% 향상", target: 25, current: 15, unit: "%" }
              ]
            }
          ],
          initiatives: [
            { id: 1, name: "여름 바캉스 캠페인", status: "계획됨", linkedToCampaign: true },
            { id: 2, name: "대학생 앰배서더 운영", status: "진행중", linkedToCampaign: false },
            { id: 3, name: "인플루언서 협업 프로젝트", status: "완료", linkedToCampaign: true }
          ]
        };

        setPlan(mockPlan);
        setTempTitle(mockPlan.title);
        setTempStartDate(mockPlan.startDate);
        setTempEndDate(mockPlan.endDate);
        setTempManager(mockPlan.manager);
        setTempTarget(mockPlan.targetPersona);
        setTempMessage(mockPlan.coreMessage);
      } catch (error) {
        console.error("Failed to load plan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      loadPlanData();
      fetchUsers();
    }
  }, [planId]);

  // 유틸리티 함수들
  const updateEditedPlan = (field, value) => {
    setEditedPlan(prev => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditedPlan({ ...plan });
    }
  };

  const saveChanges = () => {
    setPlan(editedPlan);
    setIsEditMode(false);
  };

  const cancelEdit = () => {
    setEditedPlan({ ...plan });
    setIsEditMode(false);
  };

  const toggleObjectiveExpansion = (objectiveId) => {
    setExpandedObjectives(prev => ({
      ...prev,
      [objectiveId]: !prev[objectiveId]
    }));
  };

  const calculateObjectiveProgress = (objective) => {
    const validResults = objective.keyResults.filter(kr => 
      kr.isActive && 
      kr.target !== null && 
      !isNaN(kr.target) && 
      kr.target > 0
    );

    if (validResults.length === 0) return 0;

    const totalProgress = validResults.reduce((sum, kr) => {
      const progress = Math.min((kr.current / kr.target) * 100, 100);
      return sum + progress;
    }, 0);

    return Math.round(totalProgress / validResults.length);
  };

  const getConfidenceBadge = (confidence) => {
    switch (confidence) {
      case "On Track":
        return <Badge className="bg-green-100 text-green-800 border-green-200">순항</Badge>;
      case "At Risk":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">위험</Badge>;
      case "Off Track":
        return <Badge className="bg-red-100 text-red-800 border-red-200">지연</Badge>;
      default:
        return <Badge variant="outline">{confidence}</Badge>;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "edit":
        return <Edit className="w-4 h-4 text-blue-500" />;
      case "progress":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "create":
        return <Plus className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  // 목표 관련 함수들
  const editObjective = (objective) => {
    setEditingObjective(objective);
    setShowObjectiveModal(true);
  };

  const deleteObjective = (objectiveId) => {
    setObjectives(prev =>
      prev.map(obj =>
        obj.id === objectiveId ? { ...obj, isActive: false } : obj
      )
    );
    setShowDeleteModal(false);
    setObjectiveToDelete(null);
  };

  const addNewObjective = () => {
    setEditingObjective(null);
    setShowObjectiveModal(true);
  };

  // 제목 수정 핸들러
  const saveTitle = async () => {
    try {
      // 실제 환경에서는 API 호출
      // await fetch(`/api/marketing/plans/${planId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ title: tempTitle })
      // });

      setPlan(prev => ({ ...prev, title: tempTitle }));
      setEditingTitle(false);
    } catch (error) {
      console.error("Failed to save title:", error);
    }
  };

  // 기간 수정 핸들러
  const savePeriod = async () => {
    try {
      setPlan(prev => ({ ...prev, startDate: tempStartDate, endDate: tempEndDate }));
      setEditingPeriod(false);
    } catch (error) {
      console.error("Failed to save period:", error);
    }
  };

  // 담당자 수정 핸들러
  const saveManager = async (selectedUser) => {
    try {
      setPlan(prev => ({ ...prev, manager: selectedUser.name }));
      setTempManager(selectedUser.name);
      setEditingManager(false);
      setShowManagerDropdown(false);
    } catch (error) {
      console.error("Failed to save manager:", error);
    }
  };

  // 타겟 고객 수정 핸들러
  const saveTarget = async () => {
    try {
      setPlan(prev => ({ ...prev, targetPersona: tempTarget }));
      setEditingTarget(false);
    } catch (error) {
      console.error("Failed to save target:", error);
    }
  };

  // 핵심 메시지 수정 핸들러
  const saveMessage = async () => {
    try {
      setPlan(prev => ({ ...prev, coreMessage: tempMessage }));
      setEditingMessage(false);
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  // 키 결과 토글
  const toggleKeyResult = (objectiveId) => {
    setExpandedObjectives(prev => ({
      ...prev,
      [objectiveId]: !prev[objectiveId]
    }));
  };

  // 커스텀 드롭다운 컴포넌트
  const CustomManagerDropdown = ({ isOpen, onSelect, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
        {loadingUsers ? (
          <div className="p-4 text-center">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">사용자 정보를 불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">책임 담당자 선택</h4>
            </div>
            <div className="py-2">
              {availableUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelect(user)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.role}
                    </p>
                  </div>
                  {plan.manager === user.name && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // 목표 모달 컴포넌트
  const ObjectiveModal = () => {
    const isEditMode = !!editingObjective;
    const [title, setTitle] = useState(editingObjective?.title || "");
    const [keyResults, setKeyResults] = useState(editingObjective?.keyResults || [
      { id: Date.now(), title: "", target: 0, current: 0, unit: "", type: "number", isActive: true }
    ]);

    useEffect(() => {
      setTitle(editingObjective?.title || "");
      setKeyResults(editingObjective?.keyResults || [
        { id: Date.now(), title: "", target: 0, current: 0, unit: "", type: "number", isActive: true }
      ]);
    }, [editingObjective]);

    const addKeyResult = () => {
      setKeyResults(prev => [...prev, { 
        id: Date.now(), 
        title: "", 
        target: 0, 
        current: 0, 
        unit: "", 
        type: "number", 
        isActive: true 
      }]);
    };

    const updateKeyResult = (id, field, value) => {
      setKeyResults(prev =>
        prev.map(kr =>
          kr.id === id ? { ...kr, [field]: value } : kr
        )
      );
    };

    const deleteKeyResult = (id) => {
      setKeyResults(prev => prev.filter(kr => kr.id !== id));
    };

    const saveObjective = () => {
      if (!title.trim()) {
        alert('목표 제목을 입력해주세요.');
        return;
      }

      const validKeyResults = keyResults.filter(kr => kr.title.trim() && kr.target > 0);
      if (validKeyResults.length === 0) {
        alert('최소 하나의 유효한 핵심 결과를 추가해주세요.');
        return;
      }

      if (isEditMode) {
        setObjectives(prev =>
          prev.map(obj =>
            obj.id === editingObjective.id ? { 
              ...obj, 
              title, 
              keyResults: validKeyResults,
              progress: calculateObjectiveProgress({ keyResults: validKeyResults })
            } : obj
          )
        );
      } else {
        const newObjective = {
          id: Date.now(),
          title,
          progress: 0,
          confidence: "On Track",
          isActive: true,
          keyResults: validKeyResults
        };
        setObjectives(prev => [...prev, newObjective]);
      }
      setShowObjectiveModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {isEditMode ? "목표 수정" : "새 목표 추가"}
                  </h2>
                  <p className="text-blue-100 text-sm">OKR 방법론을 활용한 목표 설정</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowObjectiveModal(false)}
                className="text-white hover:bg-white/20 border-white/30"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-8 space-y-8">
              {/* 목표 설정 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-blue-500 to-purple-500">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                    O
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    목표 (Objective)
                  </h3>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    목표 제목 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: Z세대 인지도 확보"
                    className="text-lg font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* 핵심 결과 설정 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-green-500 to-teal-500">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                    KR
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    핵심 결과 (Key Results)
                  </h3>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                  {keyResults.map((kr, index) => (
                    <div key={kr.id} className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-green-200 dark:border-gray-600 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white font-bold flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                          핵심 결과 #{index + 1}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                            결과 제목 <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={kr.title}
                            onChange={(e) => updateKeyResult(kr.id, "title", e.target.value)}
                            placeholder="예: 틱톡 팔로워 수"
                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                            측정 단위
                          </Label>
                          <select
                            value={kr.unit}
                            onChange={(e) => updateKeyResult(kr.id, "unit", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-green-500 focus:ring-green-200"
                          >
                            <option value="">단위 선택</option>
                            <option value="명">명</option>
                            <option value="%">%</option>
                            <option value="건">건</option>
                            <option value="점">점</option>
                            <option value="회">회</option>
                            <option value="원">원</option>
                            <option value="개">개</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                            목표 수치 <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            value={kr.target}
                            onChange={(e) => updateKeyResult(kr.id, "target", parseFloat(e.target.value) || 0)}
                            placeholder="목표값"
                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                          />
                        </div>

                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                              현재 달성 수치
                            </Label>
                            <Input
                              type="number"
                              value={kr.current}
                              onChange={(e) => updateKeyResult(kr.id, "current", parseFloat(e.target.value) || 0)}
                              placeholder="현재값"
                              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                            />
                          </div>
                          {keyResults.length > 1 && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteKeyResult(kr.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* 진행률 표시 */}
                      {kr.target > 0 && (
                        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">진행률</span>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {Math.min(Math.round((kr.current / kr.target) * 100), 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-500" 
                              style={{width: `${Math.min((kr.current / kr.target) * 100, 100)}%`}}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={addKeyResult}
                  className="flex items-center gap-2 w-full py-4 text-lg bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-dashed border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/30 dark:hover:to-teal-900/30"
                >
                  <Plus className="w-5 h-5" />
                  핵심 결과 추가
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {keyResults.filter(kr => kr.title.trim() && kr.target > 0).length}개의 유효한 핵심 결과
                </span>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowObjectiveModal(false)}
                  className="px-6"
                >
                  취소
                </Button>
                <Button 
                  size="lg"
                  onClick={saveObjective}
                  className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? "수정 완료" : "목표 추가"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full max-w-none flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">계획을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="w-full max-w-none flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">계획을 찾을 수 없습니다</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">요청하신 마케팅 계획이 존재하지 않거나 삭제되었습니다.</p>
          <Button onClick={() => router.push("/dashboard/marketing/planning-process")}>
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
        목록으로 돌아가기
      </Button>

      {/* 타이틀 박스 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {editingTitle ? (
                  <div className="flex items-center gap-3">
                    <Input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="text-3xl font-bold bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
                      placeholder="계획 제목을 입력하세요"
                      autoFocus
                    />
                    <Button
                      onClick={saveTitle}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingTitle(false);
                        setTempTitle(plan.title);
                      }}
                      size="sm"
                      variant="outline"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{plan.title}</h1>
                    <Button
                      onClick={() => setEditingTitle(true)}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Badge 
                  className={`${
                    plan.status === "진행중" 
                      ? "bg-green-500 hover:bg-green-600" 
                      : plan.status === "계획됨"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  } text-white font-medium px-4 py-2 text-sm`}
                >
                  {plan.status}
                </Badge>
                <div className="text-right">
                  <div className="text-2xl font-bold">{plan.progress}%</div>
                  <div className="text-blue-100 text-sm">진행률</div>
                </div>
              </div>
            </div>

            {/* 진행률 바 */}
            <div className="mb-8">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000 shadow-sm" 
                  style={{width: `${plan.progress}%`}}
                ></div>
              </div>
            </div>

            {/* 정보 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* 기간 편집 */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-100 text-sm font-medium">기간</span>
                  {!editingPeriod && (
                    <Button
                      onClick={() => setEditingPeriod(true)}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {editingPeriod ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        type="date"
                        value={tempStartDate}
                        onChange={(e) => setTempStartDate(e.target.value)}
                        className="text-sm bg-white/20 border-white/30 text-white"
                      />
                      <Input
                        type="date"
                        value={tempEndDate}
                        onChange={(e) => setTempEndDate(e.target.value)}
                        className="text-sm bg-white/20 border-white/30 text-white"
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={savePeriod}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingPeriod(false);
                          setTempStartDate(plan.startDate);
                          setTempEndDate(plan.endDate);
                        }}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white font-semibold text-sm">
                    {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* 담당자 편집 */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm relative">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-100 text-sm font-medium">담당자</span>
                  {!editingManager && (
                    <Button
                      onClick={() => {
                        setEditingManager(true);
                        setShowManagerDropdown(true);
                      }}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {editingManager ? (
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setShowManagerDropdown(!showManagerDropdown)}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 justify-between w-full text-sm p-2"
                      >
                        <span>{tempManager}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingManager(false);
                          setShowManagerDropdown(false);
                        }}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <CustomManagerDropdown
                      isOpen={showManagerDropdown}
                      onSelect={saveManager}
                      onClose={() => setShowManagerDropdown(false)}
                    />
                  </div>
                ) : (
                  <p className="text-white font-semibold">{plan.manager}</p>
                )}
              </div>

              {/* 타겟 고객 편집 */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-100 text-sm font-medium">타겟 고객</span>
                  {!editingTarget && (
                    <Button
                      onClick={() => setEditingTarget(true)}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {editingTarget ? (
                  <div className="space-y-2">
                    <Input
                      value={tempTarget}
                      onChange={(e) => setTempTarget(e.target.value)}
                      className="text-sm bg-white/20 border-white/30 text-white placeholder-white/70"
                      placeholder="타겟 고객을 입력하세요"
                    />
                    <div className="flex gap-1">
                      <Button
                        onClick={saveTarget}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingTarget(false);
                          setTempTarget(plan.targetPersona);
                        }}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white font-semibold">{plan.targetPersona}</p>
                )}
              </div>

              {/* 핵심 메시지 편집 */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-100 text-sm font-medium">핵심 메시지</span>
                  {!editingMessage && (
                    <Button
                      onClick={() => setEditingMessage(true)}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {editingMessage ? (
                  <div className="space-y-2">
                    <Input
                      value={tempMessage}
                      onChange={(e) => setTempMessage(e.target.value)}
                      className="text-sm bg-white/20 border-white/30 text-white placeholder-white/70"
                      placeholder="핵심 메시지를 입력하세요"
                    />
                    <div className="flex gap-1">
                      <Button
                        onClick={saveMessage}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingMessage(false);
                          setTempMessage(plan.coreMessage);
                        }}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1 h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white font-semibold">{plan.coreMessage}</p>
                )}
              </div>
            </div>
          </div>

      {/* OKR 대시보드 */}
      <Card className="shadow-lg border-2 border-gray-200 dark:border-gray-600">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  OKR 대시보드
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  {objectives.filter(obj => obj.isActive).length}개의 활성 목표
                </p>
              </div>
            </div>
            <Button onClick={addNewObjective} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
              <Plus className="w-4 h-4 mr-2" />
              새 목표 추가
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {objectives.filter(obj => obj.isActive).map((objective) => (
            <div key={objective.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-md overflow-hidden">
              {/* 목표 헤더 */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                        O
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {objective.title}
                      </h3>
                      {getConfidenceBadge(objective.confidence)}
                    </div>

                    {/* 진행률 바 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          목표 진행률
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {calculateObjectiveProgress(objective)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700" 
                          style={{width: `${calculateObjectiveProgress(objective)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleObjectiveExpansion(objective.id)}
                      className="flex items-center gap-1"
                    >
                      {expandedObjectives[objective.id] ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          축소
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          확장
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => editObjective(objective)}
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
                      className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* 핵심 결과 */}
              {expandedObjectives[objective.id] && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded text-white font-bold flex items-center justify-center text-xs">
                      KR
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      핵심 결과 ({objective.keyResults.filter(kr => kr.isActive).length}개)
                    </h4>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                    {objective.keyResults.filter(kr => kr.isActive).map((kr) => (
                      <div key={kr.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg flex items-center justify-center">
                              {kr.current >= kr.target ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {kr.title}
                              </h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {kr.current} / {kr.target} {kr.unit}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {Math.min(Math.round((kr.current / kr.target) * 100), 100)}%
                            </div>
                            {kr.current >= kr.target && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <Award className="w-3 h-3 mr-1" />
                                달성
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* 진행률 바 */}
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              kr.current >= kr.target 
                                ? 'bg-gradient-to-r from-green-500 to-teal-500' 
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                            style={{width: `${Math.min((kr.current / kr.target) * 100, 100)}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {objectives.filter(obj => obj.isActive).length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                목표가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                첫 번째 목표를 추가하여 계획을 시작하세요
              </p>
              <Button onClick={addNewObjective} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                <Plus className="w-4 h-4 mr-2" />
                목표 추가하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 활동 히스토리 */}
      <Card className="shadow-lg border-2 border-gray-200 dark:border-gray-600">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                활동 히스토리
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                최근 계획 변경 내역
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {activityHistory.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0">
                  {getActivityIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.action}
                    </span>
                    <span className="text-sm text-gray-500">
                      by {item.user}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {item.description}
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
      {showObjectiveModal && <ObjectiveModal />}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">목표 삭제 확인</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              이 목표를 정말 삭제하시겠습니까? 삭제된 목표는 비활성화되며 복구할 수 있습니다.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                취소
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteObjective(objectiveToDelete)}
                className="flex-1 bg-red-600 hover:bg-red-700"
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