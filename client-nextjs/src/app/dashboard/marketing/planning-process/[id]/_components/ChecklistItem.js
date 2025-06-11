"use client";

import React from "react";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { CheckCircle, Circle, Trash2 } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage.js';

const ChecklistItem = ({
  item,
  itemIndex,
  krId,
  krIndex,
  isEditing,
  onToggle,
  onUpdate,
  onRemove,
}) => {
  const { t } = useLanguage();

  const handleToggle = () => {
    if (!isEditing) {
      onToggle(krId, itemIndex);
    }
  };

  const handleTextChange = (e) => {
    onUpdate(e.target.value);
  };

  return (
    <div className="flex items-center gap-3 group">
      {/* 체크박스 (편집 모드가 아닐 때만 표시) */}
      {!isEditing && (
        <button
          onClick={handleToggle}
          className="flex-shrink-0 transition-colors hover:scale-110 transform duration-200"
          type="button"
        >
          {item.completed ? (
            <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      )}

      {/* 텍스트 입력 */}
      <Input
        value={item.text || ""}
        onChange={handleTextChange}
        className={`flex-1 transition-all duration-200 ${
          isEditing
            ? "border-gray-300 dark:border-gray-600"
            : "bg-transparent border-none p-0 h-auto focus:ring-0 hover:bg-gray-50 dark:hover:bg-gray-800"
        } ${
          item.completed && !isEditing
            ? "line-through text-gray-500 dark:text-gray-400"
            : ""
        }`}
        placeholder={t("체크리스트 항목을 입력하세요")}
        readOnly={!isEditing}
      />

      {/* 삭제 버튼 */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className={`h-auto p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ${
          isEditing 
            ? "opacity-100" 
            : "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        }`}
        type="button"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChecklistItem;