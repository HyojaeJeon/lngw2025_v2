import React from "react";
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
import {
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { calculateObjectiveProgress } from "../utils/calculations";

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
}) => {
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
                  placeholder="목표 제목을 입력하세요"
                />
                <div>
                  <Label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                    설명 (선택사항)
                  </Label>
                  <textarea
                    value={editingObjectiveData.description || ""}
                    onChange={(e) => onUpdateDescription(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="목표에 대한 상세한 설명을 입력하세요"
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
                  <p className="text-xs text-gray-500">진행률</p>
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
      {!isCollapsed && (
        <CardContent className="p-6">
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded bg-gradient-to-r from-green-500 to-teal-500">
                KR
              </div>
              핵심 결과 (Key Results)
            </h4>

            {(isEditing
              ? editingObjectiveData.keyResults
              : objective.keyResults
            ).map((kr, index) => (
              <div
                key={kr.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  {isEditing ? (
                    <Input
                      value={kr.title || kr.description}
                      onChange={(e) => onUpdateKeyResultTitle(index, e.target.value)}
                      placeholder="핵심 결과 제목을 입력하세요"
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
                      ? "수치 기반"
                      : "체크리스트 기반"}
                  </Badge>
                </div>

                {kr.type === "numeric" && (
                  <div className="space-y-3">
                    {isEditing ? (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                            현재 값
                          </Label>
                          <Input
                            type="number"
                            value={kr.current || kr.currentValue || ""}
                            onChange={(e) =>
                              onUpdateKeyResultValue(
                                index,
                                "currentValue",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                            목표 값
                          </Label>
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
                          <Label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                            단위
                          </Label>
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
                            현재: {(kr.currentValue || 0).toLocaleString()}
                            {kr.unit} / 목표:{" "}
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
                        <div
                          key={itemIndex}
                          className="flex items-center gap-3 group"
                        >
                          {!isEditing && (
                            <button
                              onClick={() =>
                                onToggleChecklistItem(kr.id, itemIndex)
                              }
                              className="flex-shrink-0"
                            >
                              {item.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          )}
                          <Input
                            value={item.text}
                            onChange={(e) =>
                              isEditing
                                ? onUpdateChecklistItemInEdit(
                                    index,
                                    itemIndex,
                                    e.target.value,
                                  )
                                : onUpdateChecklistItem(
                                    kr.id,
                                    itemIndex,
                                    e.target.value,
                                  )
                            }
                            className={`flex-1 ${
                              isEditing
                                ? "border-gray-300"
                                : "bg-transparent border-none p-0 h-auto focus:ring-0"
                            } ${
                              item.completed && !isEditing
                                ? "line-through text-gray-500"
                                : ""
                            }`}
                            placeholder="체크리스트 항목을 입력하세요"
                            readOnly={!isEditing && item.completed}
                          />
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                onRemoveChecklistItemInEdit(index, itemIndex)
                              }
                              className="h-auto p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          {!isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                onRemoveChecklistItem(kr.id, itemIndex)
                              }
                              className="h-auto p-1 text-red-500 transition-opacity opacity-0 group-hover:opacity-100 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        isEditing
                          ? onAddChecklistItemInEdit(index)
                          : onAddChecklistItem(kr.id)
                      }
                      className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Plus className="w-4 h-4" />
                      항목 추가
                    </Button>

                    {(kr.checklist || []).length > 0 && !isEditing && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            완료:{" "}
                            {
                              kr.checklist.filter((item) => item.completed)
                                .length
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
                        <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
                          <div
                            className="h-3 transition-all duration-700 rounded-full shadow-sm bg-gradient-to-r from-green-500 to-teal-500"
                            style={{
                              width: `${
                                kr.checklist.length > 0
                                  ? (kr.checklist.filter(
                                      (item) => item.completed,
                                    ).length /
                                      kr.checklist.length) *
                                    100
                                  : 0
                              }%`,
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
};

export default ObjectiveCard;
