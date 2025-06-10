"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { useLanguage } from "@/contexts/languageContext.js";
import { ArrowLeft, Target, Plus, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";

// Custom hooks
import { usePlanData } from "./_hooks/usePlanData";
import { useObjectiveManagement } from "./_hooks/useObjectiveManagement";

// Components
import PlanHeader from "./_components/PlanHeader";
import ObjectiveCard from "./_components/ObjectiveCard";
import DeleteConfirmModal from "./_components/_modals/DeleteConfirmModal";

// Utils
import { calculateObjectiveProgress } from "./_utils/calculations";

export default function PlanningProcessDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const planId = params.id;

  // Plan data management
  const planData = usePlanData(planId);
  const {
    plan,
    loading,
    objectives,
    setObjectives,
    keyResults,
    setKeyResults,
    isEditMode,
    setIsEditMode,
  } = planData;

  // Objective management
  const objectiveManagement = useObjectiveManagement(
    objectives,
    setObjectives,
    keyResults,
    setKeyResults
  );
  const {
    collapsedObjectives,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    objectiveToDelete,
    setObjectiveToDelete,
    editingObjectiveId,
    editingObjectiveData,
    setEditingObjectiveData,
    showNewObjectiveModal,
    setShowNewObjectiveModal,
    toggleObjectiveCollapse,
    startEditObjective,
    cancelEditObjective,
    confirmDeleteObjective,
    handleDeleteObjective,
    handleSaveEditObjective,
    updateKeyResultTitle,
    updateKeyResultValue,
    updateChecklistItemInEdit,
    addChecklistItemInEdit,
    removeChecklistItemInEdit,
    addChecklistItem,
    updateChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
  } = objectiveManagement;

  // 핵심 결과(Key Results) 추가 핸들러 (한 번에 1개만, 타입 교체)
  const onAddKeyResult = (type) => {
    setEditingObjectiveData((prev) => {
      const hasNew = prev.keyResults?.some(kr => kr.isNew);
      let newKR;
      if (type === 'numeric') {
        newKR = { id: `${Date.now()}_${Math.random()}`, type: 'numeric', title: '', currentValue: 0, target: 0, unit: '', isNew: true };
      } else {
        newKR = { id: `${Date.now()}_${Math.random()}`, type: 'checklist', title: '', checklist: [{ text: '', completed: false }], isNew: true };
      }
      let keyResults = prev.keyResults || [];
      if (hasNew) {
        // 기존 isNew KR의 type만 교체(내용 초기화)
        keyResults = keyResults.map(kr => kr.isNew ? newKR : kr);
      } else {
        // 새로 추가, 최상단에 위치
        keyResults = [newKR, ...keyResults];
      }
      return { ...prev, keyResults };
    });
  };

  // 새로 추가된(isNew) KR 삭제 핸들러
  const onRemoveNewKeyResult = (id) => {
    setEditingObjectiveData((prev) => ({
      ...prev,
      keyResults: prev.keyResults.filter(kr => kr.id !== id)
    }));
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 text-blue-500 animate-spin" />
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

  // 체크리스트 항목 토글
  const toggleChecklistItem = useCallback((krId, itemIndex) => {
    console.log('체크리스트 토글:', { krId, itemIndex });

    setObjectives(prev => 
      prev.map(objective => ({
        ...objective,
        keyResults: objective.keyResults.map(kr => 
          kr.id === krId 
            ? {
                ...kr,
                checklist: (kr.checklist || []).map((item, index) => 
                  index === itemIndex 
                    ? { 
                        ...item, 
                        completed: !item.completed,
                        completedAt: !item.completed ? new Date().toISOString() : null
                      }
                    : item
                )
              }
            : kr
        )
      }))
    );

    // API 저장 로직 (향후 구현)
    // saveChecklistToAPI(krId, itemIndex, !currentCompleted);
  }, []);

  return (
    <div className="w-full space-y-8 max-w-none animate-fadeIn">
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
              <ObjectiveCard
                key={objective.id}
                objective={objective}
                isCollapsed={collapsedObjectives.has(objective.id)}
                isEditing={editingObjectiveId === objective.id}
                editingObjectiveData={editingObjectiveData}
                onToggleCollapse={() => toggleObjectiveCollapse(objective.id)}
                onStartEdit={() => startEditObjective(objective)}
                onCancelEdit={cancelEditObjective}
                onSaveEdit={handleSaveEditObjective}
                onDelete={() => confirmDeleteObjective(objective)}
                onUpdateTitle={(title) =>
                  setEditingObjectiveData((prev) => ({ ...prev, title }))
                }
                onUpdateDescription={(description) =>
                  setEditingObjectiveData((prev) => ({
                    ...prev,
                    description,
                  }))
                }
                onUpdateKeyResultTitle={updateKeyResultTitle}
                onUpdateKeyResultValue={updateKeyResultValue}
                onUpdateChecklistItemInEdit={updateChecklistItemInEdit}
                onAddChecklistItemInEdit={addChecklistItemInEdit}
                onRemoveChecklistItemInEdit={removeChecklistItemInEdit}
                onToggleChecklistItem={toggleChecklistItem}
                onUpdateChecklistItem={updateChecklistItem}
                onAddChecklistItem={addChecklistItem}
                onRemoveChecklistItem={removeChecklistItem}
                onAddKeyResult={onAddKeyResult}
                onRemoveNewKeyResult={onRemoveNewKeyResult}
              />
            ))}

          {/* 비활성화된 목표들 표시 */}
          {objectives
            .filter((obj) => !obj.isActive)
            .map((objective) => (
              <Card
                key={objective.id}
                className="relative transition-all duration-300 bg-gray-100 border-0 shadow-lg opacity-60 dark:bg-gray-800"
              >
                {/* 비활성화 오버레이 */}
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-300/50 dark:bg-gray-600/50">
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      비활성화된 목표입니다
                    </p>
                  </div>
                </div>

                <CardHeader className="border-b bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-gray-400 rounded-full">
                        O
                      </div>
                      <CardTitle className="text-xl text-gray-600 dark:text-gray-400">
                        {objective.title}
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                          {calculateObjectiveProgress(objective)}%
                        </span>
                        <p className="text-xs text-gray-500">진행률</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}

          {objectives.filter((obj) => obj.isActive).length === 0 && (
            <div className="py-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                목표가 없습니다
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
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

      {/* 삭제 확인 모달 */}
      {showDeleteConfirmModal && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirmModal}
          onClose={() => setShowDeleteConfirmModal(false)}
          onConfirm={handleDeleteObjective}
          title="목표 삭제"
          message="이 목표를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        />
      )}
    </div>
  );
}