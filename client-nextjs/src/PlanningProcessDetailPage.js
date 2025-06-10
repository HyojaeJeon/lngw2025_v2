"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { useLanguage } from "@/contexts/languageContext.js";
import {
  ArrowLeft,
  Target,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Custom hooks
import { usePlanData } from "./hooks/usePlanData";
import { useObjectiveManagement } from "./hooks/useObjectiveManagement";

// Components
import PlanHeader from "./components/PlanHeader";
import ObjectiveCard from "./components/ObjectiveCard";
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal";

// Utils
import { calculateObjectiveProgress } from "./utils/calculations";

export default function PlanningProcessDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const planId = params.id;

  // Plan data management
  const {
    plan,
    loading,
    objectives,
    setObjectives,
    keyResults,
    setKeyResults,
    isEditMode,
    setIsEditMode,
  } = usePlanData(planId);

  // Objective management
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
  } = useObjectiveManagement(objectives, setObjectives, keyResults, setKeyResults);

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
          {objectives
            .filter((obj) => obj.isActive)
            .map((objective) => {
              const isCollapsed = collapsedObjectives.has(objective.id);
              const isEditing = editingObjectiveId === objective.id;

              return (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  isCollapsed={isCollapsed}
                  isEditing={isEditing}
                  editingObjectiveData={editingObjectiveData}
                  onToggleCollapse={toggleObjectiveCollapse}
                  onStartEdit={startEditObjective}
                  onCancelEdit={cancelEditObjective}
                  onSaveEdit={handleSaveEditObjective}
                  onDelete={confirmDeleteObjective}
                  onUpdateTitle={(title) => 
                    setEditingObjectiveData(prev => ({ ...prev, title }))
                  }
                  onUpdateDescription={(description) => 
                    setEditingObjectiveData(prev => ({ ...prev, description }))
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
                />
              );
            })}

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

      {/* 목표 삭제 확인 모달 */}
      <DeleteConfirmModal
        show={showDeleteConfirmModal}
        onClose={() => {
          setObjectiveToDelete(null);
          setShowDeleteConfirmModal(false);
        }}
        onConfirm={handleDeleteObjective}
        objectiveToDelete={objectiveToDelete}
      />
    </div>
  );
}
