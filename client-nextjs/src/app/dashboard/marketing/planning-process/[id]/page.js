
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { useLanguage } from "@/contexts/languageContext.js";
import { ArrowLeft, Target, Plus, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";

// Custom hooks
import { usePlanData } from "./_hooks/usePlanData";

// Components
import PlanHeader from "@/components/PlanHeader.js";

// Utils
import { calculateOverallProgress } from "../_utils/calculations";

export default function PlanningProcessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const planId = params.id;

  // Custom hook을 사용하여 계획 데이터 관리
  const {
    plan,
    setPlan,
    currentPlan,
    setCurrentPlan,
    editingPlan,
    setEditingPlan,
    isEditMode,
    setIsEditMode,
    loading,
    objectives,
    setObjectives,
    keyResults,
    setKeyResults,
  } = usePlanData(planId);

  // 상태 관리
  const [showNewObjectiveModal, setShowNewObjectiveModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [showEditObjectiveModal, setShowEditObjectiveModal] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [collapsedObjectives, setCollapsedObjectives] = useState(new Set());
  
  // 핵심 결과 관련 상태
  const [editingKeyResult, setEditingKeyResult] = useState(null);
  const [showEditKeyResultModal, setShowEditKeyResultModal] = useState(false);
  const [keyResultToDelete, setKeyResultToDelete] = useState(null);
  const [showDeleteKeyResultModal, setShowDeleteKeyResultModal] = useState(false);
  const [expandedKeyResults, setExpandedKeyResults] = useState(new Set());

  // 새 목표 폼
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

  // 핵심 결과 편집 폼
  const [editKeyResult, setEditKeyResult] = useState({
    title: "",
    description: "",
    type: "number",
    target: "",
    current: "",
    unit: "",
    checklist: [],
  });

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
          <p className="text-gray-600">계획 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 계획이 없는 경우
  if (!plan) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            계획을 찾을 수 없습니다
          </h3>
          <p className="mb-4 text-gray-600">
            요청하신 마케팅 계획이 존재하지 않거나 삭제되었습니다.
          </p>
          <Button
            onClick={() => router.push("/dashboard/marketing/planning-process")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            마케팅 계획 목록으로
          </Button>
        </div>
      </div>
    );
  }

  // 목표 접기/펴기 토글
  const toggleObjectiveCollapse = (objectiveId) => {
    setCollapsedObjectives(prev => {
      const newSet = new Set(prev);
      if (newSet.has(objectiveId)) {
        newSet.delete(objectiveId);
      } else {
        newSet.add(objectiveId);
      }
      return newSet;
    });
  };

  // 핵심 결과 확장/축소 토글
  const toggleKeyResultExpand = (keyResultId) => {
    setExpandedKeyResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyResultId)) {
        newSet.delete(keyResultId);
      } else {
        newSet.add(keyResultId);
      }
      return newSet;
    });
  };

  // 새 목표 추가
  const handleAddObjective = () => {
    const newObj = {
      id: Date.now(),
      title: newObjective.title,
      description: newObjective.description,
      isActive: true,
      keyResults: newObjective.keyResults.map((kr, index) => ({
        id: Date.now() + index,
        ...kr,
        progress: 0,
        status: "not_started",
      })),
    };

    setObjectives(prev => [...prev, newObj]);
    setNewObjective({
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
    setShowNewObjectiveModal(false);
  };

  // 목표 편집
  const handleEditObjective = (objective) => {
    setEditingObjective(objective);
    setShowEditObjectiveModal(true);
  };

  // 목표 삭제
  const handleDeleteObjective = (objectiveId) => {
    setObjectiveToDelete(objectiveId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteObjective = () => {
    setObjectives(prev => prev.filter(obj => obj.id !== objectiveToDelete));
    setShowDeleteConfirmModal(false);
    setObjectiveToDelete(null);
  };

  // 핵심 결과 편집
  const handleEditKeyResult = (keyResult) => {
    setEditingKeyResult(keyResult);
    setEditKeyResult({
      title: keyResult.title || "",
      description: keyResult.description || "",
      type: keyResult.type || "number",
      target: keyResult.target || "",
      current: keyResult.current || "",
      unit: keyResult.unit || "",
      checklist: keyResult.checklist || [],
    });
    setShowEditKeyResultModal(true);
  };

  // 핵심 결과 저장
  const handleSaveKeyResult = () => {
    setObjectives(prev => prev.map(obj => ({
      ...obj,
      keyResults: obj.keyResults.map(kr => 
        kr.id === editingKeyResult.id 
          ? { ...kr, ...editKeyResult }
          : kr
      )
    })));
    setShowEditKeyResultModal(false);
    setEditingKeyResult(null);
  };

  // 핵심 결과 삭제
  const handleDeleteKeyResult = (keyResult) => {
    setKeyResultToDelete(keyResult);
    setShowDeleteKeyResultModal(true);
  };

  const confirmDeleteKeyResult = () => {
    setObjectives(prev => prev.map(obj => ({
      ...obj,
      keyResults: obj.keyResults.filter(kr => kr.id !== keyResultToDelete.id)
    })));
    setShowDeleteKeyResultModal(false);
    setKeyResultToDelete(null);
  };

  // 핵심 결과에 새 항목 추가
  const addKeyResultItem = (objectiveId) => {
    const newKeyResult = {
      id: Date.now(),
      title: "새 핵심 결과",
      description: "",
      type: "number",
      target: "",
      current: "",
      unit: "",
      progress: 0,
      status: "not_started",
      checklist: [],
    };

    setObjectives(prev => prev.map(obj => 
      obj.id === objectiveId 
        ? { ...obj, keyResults: [...obj.keyResults, newKeyResult] }
        : obj
    ));
  };

  return (
    <div className="w-full space-y-4 lg:space-y-8 max-w-none animate-fadeIn">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="outline"
        onClick={() => router.push("/dashboard/marketing/planning-process")}
        className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        마케팅 계획 목록으로
      </Button>

      {/* 계획 헤더 */}
      <PlanHeader 
        plan={plan} 
        objectives={objectives}
        onEditClick={() => setIsEditMode(true)}
      />

      {/* OKR 목표 목록 */}
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              OKR 목표 설정
            </h2>
          </div>
          <Button
            onClick={() => setShowNewObjectiveModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            새 목표 추가
          </Button>
        </div>

        <div className="grid gap-4 lg:gap-6 xl:grid-cols-2">
          {objectives
            .filter((obj) => obj.isActive)
            .map((objective) => (
              <Card key={objective.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <circle cx="10" cy="10" r="8" />
                          </svg>
                        </div>
                        <CardTitle className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white break-words">
                          {objective.title}
                        </CardTitle>
                      </div>
                      {objective.description && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                          {objective.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditObjective(objective)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteObjective(objective.id)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleObjectiveCollapse(objective.id)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        {collapsedObjectives.has(objective.id) ? (
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {!collapsedObjectives.has(objective.id) && (
                  <CardContent className="pt-0 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        핵심 결과 ({objective.keyResults.length}개)
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addKeyResultItem(objective.id)}
                        className="text-xs h-7 px-2 w-full sm:w-auto"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        결과 추가
                      </Button>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      {objective.keyResults.map((keyResult, krIndex) => (
                        <div
                          key={keyResult.id}
                          className="p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">
                                    {krIndex + 1}
                                  </span>
                                </div>
                                <h5 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white break-words">
                                  {keyResult.title || `핵심 결과 ${krIndex + 1}`}
                                </h5>
                              </div>
                              
                              {keyResult.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 break-words">
                                  {keyResult.description}
                                </p>
                              )}
                              
                              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 text-xs">
                                <span className="text-gray-600 dark:text-gray-400">
                                  목표: {keyResult.target} {keyResult.unit}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  현재: {keyResult.current || "0"} {keyResult.unit}
                                </span>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                  진행률: {keyResult.progress || 0}%
                                </span>
                              </div>
                              
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 mt-2">
                                <div
                                  className="bg-gradient-to-r from-green-400 to-blue-400 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${keyResult.progress || 0}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditKeyResult(keyResult)}
                                className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                              >
                                <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteKeyResult(keyResult)}
                                className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleKeyResultExpand(keyResult.id)}
                                className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                              >
                                {expandedKeyResults.has(keyResult.id) ? (
                                  <ChevronUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                ) : (
                                  <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* 확장된 세부 정보 */}
                          {expandedKeyResults.has(keyResult.id) && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <div className="space-y-2">
                                <div className="text-xs">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">유형:</span>
                                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                                    {keyResult.type === 'number' ? '수치형' : '체크리스트형'}
                                  </span>
                                </div>
                                <div className="text-xs">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">상태:</span>
                                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                                    {keyResult.status === 'not_started' ? '시작 전' : 
                                     keyResult.status === 'in_progress' ? '진행중' : '완료'}
                                  </span>
                                </div>
                                {keyResult.checklist && keyResult.checklist.length > 0 && (
                                  <div className="text-xs">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">체크리스트:</span>
                                    <ul className="mt-1 space-y-1">
                                      {keyResult.checklist.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                          <input type="checkbox" className="w-3 h-3" defaultChecked={item.completed} />
                                          <span className="text-gray-600 dark:text-gray-400">{item.text}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
        </div>
      </div>

      {/* 새 목표 추가 모달 */}
      {showNewObjectiveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">새 목표 추가</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewObjectiveModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <AlertCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  목표 제목
                </label>
                <input
                  type="text"
                  value={newObjective.title}
                  onChange={(e) => setNewObjective(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="목표를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  목표 설명
                </label>
                <textarea
                  value={newObjective.description}
                  onChange={(e) => setNewObjective(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="목표에 대한 설명을 입력하세요"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewObjectiveModal(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={handleAddObjective}
                  disabled={!newObjective.title.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  목표 추가
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 핵심 결과 편집 모달 */}
      {showEditKeyResultModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">핵심 결과 편집</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditKeyResultModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <AlertCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={editKeyResult.title}
                  onChange={(e) => setEditKeyResult(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="핵심 결과 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  설명
                </label>
                <textarea
                  value={editKeyResult.description}
                  onChange={(e) => setEditKeyResult(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="핵심 결과에 대한 설명을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    목표 수치
                  </label>
                  <input
                    type="text"
                    value={editKeyResult.target}
                    onChange={(e) => setEditKeyResult(prev => ({ ...prev, target: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="목표 수치"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    현재 수치
                  </label>
                  <input
                    type="text"
                    value={editKeyResult.current}
                    onChange={(e) => setEditKeyResult(prev => ({ ...prev, current: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="현재 수치"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  단위
                </label>
                <input
                  type="text"
                  value={editKeyResult.unit}
                  onChange={(e) => setEditKeyResult(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="단위 (예: 명, %, 건)"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEditKeyResultModal(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={handleSaveKeyResult}
                  className="bg-gradient-to-r from-green-600 to-teal-600"
                >
                  저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 핵심 결과 삭제 확인 모달 */}
      {showDeleteKeyResultModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              핵심 결과 삭제
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              이 핵심 결과를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteKeyResultModal(false)}
              >
                취소
              </Button>
              <Button
                onClick={confirmDeleteKeyResult}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 목표 삭제 확인 모달 */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              목표 삭제
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              이 목표와 관련된 모든 핵심 결과가 삭제됩니다. 계속하시겠습니까?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                취소
              </Button>
              <Button
                onClick={confirmDeleteObjective}
                className="bg-red-600 hover:bg-red-700 text-white"
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
