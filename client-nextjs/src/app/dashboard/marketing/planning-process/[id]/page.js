
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
  const [plan, setPlan] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState({});
  const [expandedObjectives, setExpandedObjectives] = useState({});
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // 컴포넌트 초기화
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPlan(samplePlan);
      setObjectives(samplePlan.objectives);
      setEditedPlan(samplePlan);
      
      // 모든 목표를 기본적으로 확장상태로 설정
      const expanded = {};
      samplePlan.objectives.forEach(obj => {
        expanded[obj.id] = true;
      });
      setExpandedObjectives(expanded);
      setLoading(false);
    }, 500);
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

      {/* 헤더 카드 */}
      <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-2 border-blue-200 dark:border-gray-600 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditMode ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      계획 제목
                    </Label>
                    <Input
                      value={editedPlan.title}
                      onChange={(e) => updateEditedPlan('title', e.target.value)}
                      className="text-2xl font-bold bg-white dark:bg-gray-700 border-2 border-blue-500 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      계획 설명
                    </Label>
                    <textarea
                      value={editedPlan.description}
                      onChange={(e) => updateEditedPlan('description', e.target.value)}
                      className="w-full p-3 border-2 border-blue-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {plan.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {plan.description}
                  </p>
                </div>
              )}

              {/* 상태 및 진행률 */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                    {plan.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    전체 진행률
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${plan.progress}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {plan.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              {isEditMode ? (
                <>
                  <Button size="sm" onClick={cancelEdit} variant="outline">
                    <X className="w-4 h-4 mr-1" />
                    취소
                  </Button>
                  <Button size="sm" onClick={saveChanges} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-1" />
                    저장
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={toggleEditMode} variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  수정
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* 기본 정보 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">기간</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {plan.startDate} ~ {plan.endDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">담당자</p>
                  <p className="font-medium text-gray-900 dark:text-white">{plan.manager}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">타겟 고객</p>
                  <p className="font-medium text-gray-900 dark:text-white">{plan.targetPersona}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">핵심 메시지</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                    {plan.coreMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
