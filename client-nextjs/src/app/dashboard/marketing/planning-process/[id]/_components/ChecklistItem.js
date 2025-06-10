
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { CheckCircle, Circle, Edit, Trash2, Save, X } from "lucide-react";

const ChecklistItem = ({
  item,
  index,
  isEditing,
  onToggle,
  onUpdate,
  onRemove,
  className = ""
}) => {
  const [editText, setEditText] = useState(item.text);
  const [isEditingText, setIsEditingText] = useState(false);

  const handleToggle = () => {
    onToggle(index);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate(index, editText.trim());
    }
    setIsEditingText(false);
  };

  const handleCancelEdit = () => {
    setEditText(item.text);
    setIsEditingText(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}>
      {/* 체크박스 */}
      <button
        onClick={handleToggle}
        className="flex-shrink-0 transition-colors"
        disabled={isEditing}
      >
        {item.completed ? (
          <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        )}
      </button>

      {/* 텍스트 */}
      <div className="flex-1">
        {isEditingText ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="h-auto py-1 text-sm"
            autoFocus
          />
        ) : (
          <span
            className={`text-sm cursor-pointer select-none ${
              item.completed 
                ? "line-through text-gray-500 dark:text-gray-400" 
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={handleToggle}
          >
            {item.text}
          </span>
        )}
      </div>

      {/* 완료 시간 표시 */}
      {item.completed && item.completedAt && (
        <span className="text-xs text-gray-500">
          {new Date(item.completedAt).toLocaleDateString()}
        </span>
      )}

      {/* 편집 모드일 때 액션 버튼 */}
      {isEditing && (
        <div className="flex items-center gap-1">
          {isEditingText ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveEdit}
                className="h-auto p-1 text-green-600 hover:text-green-700"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                className="h-auto p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingText(true)}
                className="h-auto p-1 text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemove(index)}
                className="h-auto p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChecklistItem;
