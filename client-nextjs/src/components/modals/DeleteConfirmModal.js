import React from "react";
import { Button } from "@/components/ui/button.js";
import { AlertCircle } from "lucide-react";

const DeleteConfirmModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  objectiveToDelete 
}) => {
  if (!show || !objectiveToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/20">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                목표 비활성화
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                이 작업은 되돌릴 수 있습니다
              </p>
            </div>
          </div>

          <p className="mb-6 text-gray-700 dark:text-gray-300">
            "<strong>{objectiveToDelete.title}</strong>" 목표를
            비활성화하시겠습니까?
            <br />
            <span className="text-sm text-gray-500">
              비활성화된 목표는 목록 하단으로 이동됩니다.
            </span>
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              onClick={onConfirm}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              비활성화
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
