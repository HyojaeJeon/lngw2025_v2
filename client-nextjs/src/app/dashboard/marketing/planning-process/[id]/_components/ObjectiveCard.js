import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import ChecklistItem from "./ChecklistItem";
import {
  Target,
  Plus,
  Edit,
  Save,
  X,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  User,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ListChecks,
} from "lucide-react";
import { calculateObjectiveProgress } from "../_utils/calculations";
import { useLanguage } from '@/hooks/useLanguage.js';

const ObjectiveCard = ({
  objective,
  isCollapsed,
  isEditing,
  editingObjectiveData,
  onToggleCollapse,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onUpdateTitle,
  onUpdateDescription,
  onUpdateKeyResultTitle,
  onUpdateKeyResultValue,
  onUpdateChecklistItemInEdit,
  onAddChecklistItemInEdit,
  onRemoveChecklistItemInEdit,
  onToggleChecklistItem,
  onUpdateChecklistItem,
  onAddChecklistItem,
  onRemoveChecklistItem,
  onAddKeyResult,
  onRemoveNewKeyResult,
}) => {
  const { t } = useLanguage();
  // 체크리스트 변경 이력 및 모달 상태 관리
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [pendingCheck, setPendingCheck] = useState(null); // {krId, itemIndex}
  const [history, setHistory] = useState([]); // [{krId, itemIndex, date, action}]

  // 수치 기반 KR 현재값 수정 상태
  const [numericEdit, setNumericEdit] = useState({}); // {krId: {value, dirty}}

  // 체크리스트 항목 클릭 핸들러(읽기 모드)
  const handleChecklistClick = (krId, itemIndex, completed) => {
    if (!isEditing) {
      if (!completed) {
        setPendingCheck({ krId, itemIndex });
        setShowHistoryModal(true);
      } else {
        // 해제는 바로 처리
        onToggleChecklistItem(krId, itemIndex);
      }
    }
  };

  // 체크리스트 변경 이력 확인 모달 확인
  const handleConfirmHistory = () => {
    if (pendingCheck) {
      onToggleChecklistItem(pendingCheck.krId, pendingCheck.itemIndex);
      setHistory((prev) => [
        ...prev,
        {
          krId: pendingCheck.krId,
          itemIndex: pendingCheck.itemIndex,
          date: new Date().toISOString(),
          action: "checked",
        },
      ]);
    }
    setShowHistoryModal(false);
    setPendingCheck(null);
  };

  // 체크리스트 변경 이력 확인 모달 취소
  const handleCancelHistory = () => {
    setShowHistoryModal(false);
    setPendingCheck(null);
  };

  // 수치 기반 KR 현재값 변경 핸들러
  const handleNumericInput = (krId, value) => {
    setNumericEdit((prev) => ({
      ...prev,
      [krId]: { value, dirty: true },
    }));
  };
  const handleNumericUpdate = (krId, index) => {
    if (numericEdit[krId]?.dirty) {
      onUpdateKeyResultValue(
        index,
        "currentValue",
        Number(numericEdit[krId].value),
      );
      setNumericEdit((prev) => ({
        ...prev,
        [krId]: { value: numericEdit[krId].value, dirty: false },
      }));
    }
  };

  const toggleChecklistItem = useCallback(
    (krId, itemIndex) => {
      console.log('체크리스트 토글:', { krId, itemIndex });
      onToggleChecklistItem(krId, itemIndex);
    },
    [onToggleChecklistItem]
  );


  return (
    <Card className="transition-all duration-300 border-0 shadow-lg hover:shadow-xl">
      <CardHeader
        className={`border-b ${
          isEditing
            ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
            : "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 gap-3">
            <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              O
            </div>
            {isEditing ? (
              <div className="flex-1 space-y-3">
                <Input
                  value={editingObjectiveData.title || ""}
                  onChange={(e) => onUpdateTitle(e.target.value)}
                  className="w-full text-xl font-semibold"
                  placeholder={t("목표 제목을 입력하세요")}
                />
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('설명 (선택사항)')}
                  </label>
                  <textarea
                    value={editingObjectiveData.description || ""}
                    onChange={(e) => onUpdateDescription(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder={t("목표에 대한 상세한 설명을 입력하세요")}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {objective.title}
                </CardTitle>
                {objective.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {objective.description}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isEditing && (
              <>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calculateObjectiveProgress(objective)}%
                  </span>
                  <p className="text-xs text-gray-500">{t("진행률")}</p>
                </div>

                <div className="relative w-12 h-12">
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
              </>
            )}

            {/* 관리 버튼들 */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  {/* 저장 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSaveEdit}
                    className="text-green-600 hover:text-green-800 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-200 dark:hover:bg-green-900/20"
                  >
                    <Save className="w-4 h-4" />
                  </Button>

                  {/* 취소 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancelEdit}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-900/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  {/* 확장/축소 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleCollapse(objective.id)}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
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
                    onClick={() => onStartEdit(objective)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/20"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  {/* 삭제(비활성화) 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(objective)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-200 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* 축소되지 않은 경우에만 핵심 결과 표시 */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden`}
        style={{
          maxHeight: isCollapsed ? 0 : 1000,
          opacity: isCollapsed ? 0 : 1,
        }}
      >
        <CardContent className="p-6">
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded bg-gradient-to-r from-green-500 to-teal-500">
                KR
              </div>
              {t("핵심 결과 (Key Results)")}
            </h4>

            {isEditing && (
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  onClick={() => onAddKeyResult("numeric")}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  disabled={editingObjectiveData.keyResults?.some(
                    (kr) => kr.isNew,
                  )}
                >
                  + {t("수치 기반 KR 추가")}
                </Button>
                <Button
                  type="button"
                  onClick={() => onAddKeyResult("checklist")}
                  className="bg-gradient-to-r from-green-500 to-teal-400 text-white shadow-lg font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  disabled={editingObjectiveData.keyResults?.some(
                    (kr) => kr.isNew,
                  )}
                >
                  + {t("체크리스트 KR 추가")}
                </Button>
              </div>
            )}

            {(isEditing
              ? editingObjectiveData.keyResults
              : objective.keyResults
            ).map((kr, index) => {
              if (isEditing && kr.isNew) {
                return (
                  <div
                    key={kr.id}
                    className="relative p-4 mb-4 border-2 rounded-lg bg-white bg-clip-padding border-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #60a5fa, #a78bfa)",
                      padding: "2px",
                    }}
                  >
                    <div className="relative bg-white rounded-lg p-4">
                      {/* 상단 타이틀 + 휴지통 */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-blue-700 text-base">
                          {kr.type === "numeric"
                            ? t("수치 기반 핵심 결과 추가")
                            : t("체크리스트 기반 핵심 결과 추가")}
                        </span>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onRemoveNewKeyResult(kr.id)}
                          type="button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {/* 수치 기반/체크리스트 기반 입력 폼 분기 */}
                      {kr.type === "numeric" ? (
                        <>
                          <Input
                            value={kr.title || ""}
                            onChange={(e) =>
                              onUpdateKeyResultTitle(index, e.target.value)
                            }
                            placeholder={t("핵심 결과 제목을 입력하세요")}
                            className="mb-2 font-medium"
                          />
                          <div className="grid grid-cols-3 gap-3 mb-2">
                            <Input
                              type="number"
                              value={kr.currentValue || ""}
                              onChange={(e) =>
                                onUpdateKeyResultValue(
                                  index,
                                  "currentValue",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              placeholder={t("현재 값")}
                            />
                            <Input
                              type="number"
                              value={kr.target || ""}
                              onChange={(e) =>
                                onUpdateKeyResultValue(
                                  index,
                                  "target",
                                  e.target.value,
                                )
                              }
                              placeholder={t("목표 값")}
                            />
                            <Input
                              value={kr.unit || ""}
                              onChange={(e) =>
                                onUpdateKeyResultValue(
                                  index,
                                  "unit",
                                  e.target.value,
                                )
                              }
                              placeholder={t("단위")}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <Input
                            value={kr.title || ""}
                            onChange={(e) =>
                              onUpdateKeyResultTitle(index, e.target.value)
                            }
                            placeholder={t("핵심 결과 제목을 입력하세요")}
                            className="mb-2 font-medium"
                          />
                          {(kr.checklist || []).map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center gap-2 mb-1"
                            >
                              <Input
                                value={item.text}
                                onChange={(e) =>
                                  onUpdateChecklistItemInEdit(
                                    index,
                                    itemIndex,
                                    e.target.value,
                                  )
                                }
                                placeholder={t("체크리스트 항목을 입력하세요")}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  onRemoveChecklistItemInEdit(index, itemIndex)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAddChecklistItemInEdit(index)}
                            className="mt-1"
                          >
                            + {t("항목 추가")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={kr.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    {isEditing ? (
                      <Input
                        value={kr.title || kr.description}
                        onChange={(e) =>
                          onUpdateKeyResultTitle(index, e.target.value)
                        }
                        placeholder={t("핵심 결과 제목을 입력하세요")}
                        className="flex-1 mr-3 font-medium"
                      />
                    ) : (
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {kr.title || kr.description}
                      </h5>
                    )}
                    <Badge
                      variant="outline"
                      className={
                        kr.type === "numeric"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {kr.type === "numeric"
                        ? t("수치 기반")
                        : t("체크리스트 기반")}
                    </Badge>
                  </div>

                  {kr.type === "numeric" && (
                    <div className="space-y-3">
                      {isEditing ? (
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                              {t("현재 값")}
                            </label>
                            <div className="flex gap-2 items-center">
                              <Input
                                type="number"
                                value={
                                  numericEdit[kr.id]?.value ??
                                  (kr.current || kr.currentValue || "")
                                }
                                onChange={(e) =>
                                  handleNumericInput(kr.id, e.target.value)
                                }
                                className="w-full"
                                placeholder="0"
                              />
                              <Button
                                size="sm"
                                className="ml-1"
                                disabled={!numericEdit[kr.id]?.dirty}
                                onClick={() =>
                                  handleNumericUpdate(kr.id, index)
                                }
                              >
                                {t("업데이트")}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                              {t("목표 값")}
                            </label>
                            <Input
                              type="number"
                              value={kr.target || ""}
                              onChange={(e) =>
                                onUpdateKeyResultValue(
                                  index,
                                  "target",
                                  e.target.value,
                                )
                              }
                              className="w-full"
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                              {t("단위")}
                            </label>
                            <Input
                              value={kr.unit || ""}
                              onChange={(e) =>
                                onUpdateKeyResultValue(
                                  index,
                                  "unit",
                                  e.target.value,
                                )
                              }
                              className="w-full"
                              placeholder="개"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {t("현재:")}{" "}
                              {(kr.currentValue || 0).toLocaleString()}
                              {kr.unit} / {t("목표:")}{" "}
                              {parseFloat(kr.target || 0).toLocaleString()}
                              {kr.unit}
                            </span>
                            <span className="font-semibold text-blue-600">
                              {Math.min(
                                Math.round(
                                  ((kr.currentValue || 0) /
                                    parseFloat(kr.target || 1)) *
                                    100,
                                ),
                                100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
                            <div
                              className="h-3 transition-all duration-700 rounded-full shadow-sm bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{
                                width: `${Math.min(
                                  ((kr.currentValue || 0) /
                                    parseFloat(kr.target || 1)) *
                                    100,
                                  100,
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {kr.type === "checklist" && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {(kr.checklist || []).map((item, itemIndex) => (
                          <ChecklistItem
                            key={itemIndex}
                            item={item}
                            itemIndex={itemIndex}
                            krId={kr.id}
                            krIndex={index}
                            isEditing={isEditing}
                            onToggle={(krId, itemIndex) => handleChecklistClick(krId, itemIndex, item.completed)}
                            onUpdate={(text) =>
                              isEditing
                                ? onUpdateChecklistItemInEdit(index, itemIndex, text)
                                : onUpdateChecklistItem(kr.id, itemIndex, text)
                            }
                            onRemove={() =>
                              isEditing
                                ? onRemoveChecklistItemInEdit(index, itemIndex)
                                : onRemoveChecklistItem(kr.id, itemIndex)
                            }
                          />
                        ))}
                      </div>

                      {/* + 항목 추가 버튼: 수정 모드일 때만 노출 */}
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAddChecklistItemInEdit(index)}
                          className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <Plus className="w-4 h-4" />
                          {t("항목 추가")}
                        </Button>
                      )}

                      {/* 변경 이력 모달 */}
                      {showHistoryModal && pendingCheck && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                              {t("변경 이력 추가")}
                            </h3>
                            <p className="mb-4 text-gray-700">
                              {t(
                                "이 항목을 완료 처리하고 변경 이력을 추가하시겠습니까?",
                              )}
                            </p>
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={handleCancelHistory}
                                variant="outline"
                              >
                                {t("취소")}
                              </Button>
                              <Button
                                onClick={handleConfirmHistory}
                                className="bg-blue-600 text-white"
                              >
                                {t("확인")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </div>

      {/* 각 KR 카드 하단에 저장/취소 버튼(수정 모드일 때만) */}
      {isEditing && (
        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={onSaveEdit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <Save className="w-4 h-4" /> {t("저장")}
          </Button>
          <Button
            onClick={onCancelEdit}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <X className="w-4 h-4" /> {t("취소")}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ObjectiveCard;