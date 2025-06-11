import { useState } from "react";

export const useObjectiveManagement = (
  objectives,
  setObjectives,
  keyResults,
  setKeyResults,
) => {
  // 목표 관리 기능을 위한 상태들
  const [collapsedObjectives, setCollapsedObjectives] = useState(new Set());
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [editingObjectiveId, setEditingObjectiveId] = useState(null);
  const [editingObjectiveData, setEditingObjectiveData] = useState({});
  const [showNewObjectiveModal, setShowNewObjectiveModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showKRModal, setShowKRModal] = useState(false);
  const [showEditKRModal, setShowEditKRModal] = useState(false);
  const [selectedKR, setSelectedKR] = useState(null);
  const [editingObjIndex, setEditingObjIndex] = useState(null);
  const [editingKRIndex, setEditingKRIndex] = useState(null);
  const [newObjectiveTitle, setNewObjectiveTitle] = useState("");
  const [showEditObjectiveModal, setShowEditObjectiveModal] = useState(false);

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
  const [editKR, setEditKR] = useState({
    title: "",
    description: "",
    type: "number",
    target: "",
    current: "",
    unit: "",
    checklist: [],
  });

  // 목표 확장/축소 토글 함수
  const toggleObjectiveCollapse = (objectiveId) => {
    const newCollapsed = new Set(collapsedObjectives);
    if (newCollapsed.has(objectiveId)) {
      newCollapsed.delete(objectiveId);
    } else {
      newCollapsed.add(objectiveId);
    }
    setCollapsedObjectives(newCollapsed);
  };

  // 목표 편집 시작 함수
  const startEditObjective = (objective) => {
    setEditingObjectiveId(objective.id);
    setEditingObjectiveData({
      title: objective.title,
      description: objective.description || "",
      keyResults: objective.keyResults?.map((kr) => ({
        ...kr,
        checklist: kr.checklist || [],
      })),
    });
  };

  // 목표 편집 취소 함수
  const cancelEditObjective = () => {
    setEditingObjectiveId(null);
    setEditingObjectiveData({});
  };

  // 목표 삭제(비활성화) 확인 함수
  const confirmDeleteObjective = (objective) => {
    setObjectiveToDelete(objective);
    setShowDeleteConfirmModal(true);
  };

  // 목표 비활성화 실행 함수
  const handleDeleteObjective = async () => {
    if (!objectiveToDelete) return;

    try {
      // 여기서 실제 API 호출을 수행합니다
      // await api.deactivateObjective(objectiveToDelete.id);

      // 목표를 비활성화하고 리스트 최하단으로 이동
      const updatedObjectives = objectives?.map((obj) =>
        obj.id === objectiveToDelete.id ? { ...obj, isActive: false } : obj,
      );

      // 활성 목표와 비활성 목표를 분리하여 정렬
      const activeObjectives = updatedObjectives?.filter((obj) => obj.isActive);
      const inactiveObjectives = updatedObjectives?.filter(
        (obj) => !obj.isActive,
      );

      setObjectives([...activeObjectives, ...inactiveObjectives]);
      setObjectiveToDelete(null);
      setShowDeleteConfirmModal(false);
    } catch (error) {
      console.error("목표 비활성화 중 오류 발생:", error);
    }
  };

  // 목표 편집 저장 함수
  const handleSaveEditObjective = async () => {
    if (!editingObjectiveId || !editingObjectiveData) return;

    try {
      const updatedObjectives = objectives?.map((obj) =>
        obj.id === editingObjectiveId
          ? { ...obj, ...editingObjectiveData }
          : obj,
      );

      setObjectives(updatedObjectives);
      setEditingObjectiveId(null);
      setEditingObjectiveData({});
    } catch (error) {
      console.error("목표 편집 중 오류 발생:", error);
    }
  };

  // Key Result 편집 헬퍼 함수들
  const updateKeyResultTitle = (krIndex, title) => {
    setEditingObjectiveData((prev) => ({
      ...prev,
      keyResults: prev.keyResults?.map((kr, index) =>
        index === krIndex ? { ...kr, description: title } : kr,
      ),
    }));
  };

  const updateKeyResultValue = (krIndex, field, value) => {
    setEditingObjectiveData((prev) => ({
      ...prev,
      keyResults: prev.keyResults?.map((kr, index) =>
        index === krIndex ? { ...kr, [field]: value } : kr,
      ),
    }));
  };

  const updateChecklistItemInEdit = (krIndex, itemIndex, text) => {
    setEditingObjectiveData((prev) => ({
      ...prev,
      keyResults: prev.keyResults?.map((kr, index) =>
        index === krIndex
          ? {
              ...kr,
              checklist: kr.checklist?.map((item, idx) =>
                idx === itemIndex ? { ...item, text } : item,
              ),
            }
          : kr,
      ),
    }));
  };

  const addChecklistItemInEdit = (krIndex) => {
    setEditingObjectiveData((prev) => ({
      ...prev,
      keyResults: prev.keyResults?.map((kr, index) =>
        index === krIndex
          ? {
              ...kr,
              checklist: [
                ...(kr.checklist || []),
                { text: "", completed: false },
              ],
            }
          : kr,
      ),
    }));
  };

  const removeChecklistItemInEdit = (krIndex, itemIndex) => {
    setEditingObjectiveData((prev) => ({
      ...prev,
      keyResults: prev.keyResults?.map((kr, index) =>
        index === krIndex
          ? {
              ...kr,
              checklist: kr.checklist.filter((_, idx) => idx !== itemIndex),
            }
          : kr,
      ),
    }));
  };

  // 체크리스트 항목 추가
  const addChecklistItem = (krId) => {
    const updatedKeyResults = keyResults?.map((kr) =>
      kr.id === krId
        ? {
            ...kr,
            checklist: [
              ...(kr.checklist || []),
              { text: "", completed: false },
            ],
          }
        : kr,
    );
    setKeyResults(updatedKeyResults);

    // 선택된 목표 수정 시에도 업데이트
    if (selectedObjective) {
      setSelectedObjective((prev) => ({
        ...prev,
        keyResults: updatedKeyResults,
      }));
    }
  };

  // 체크리스트 항목 업데이트
  const updateChecklistItem = (krId, itemIndex, text) => {
    const updatedKeyResults = keyResults?.map((kr) =>
      kr.id === krId
        ? {
            ...kr,
            checklist: (kr.checklist || [])?.map((item, index) =>
              index === itemIndex ? { ...item, text } : item,
            ),
          }
        : kr,
    );
    setKeyResults(updatedKeyResults);

    // 선택된 목표 수정 시에도 업데이트
    if (selectedObjective) {
      setSelectedObjective((prev) => ({
        ...prev,
        keyResults: updatedKeyResults,
      }));
    }
  };

  // 체크리스트 항목 토글
  const toggleChecklistItem = (krId, itemIndex) => {
    if (!keyResults) return;
    setKeyResults(
      keyResults?.map((kr) =>
        kr.id === krId
          ? {
              ...kr,
              checklist: kr.checklist.map((item, index) =>
                index === itemIndex
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
            }
          : kr,
      ),
    );
  };

  // 체크리스트 항목 삭제
  const removeChecklistItem = (krId, itemIndex) => {
    if (!keyResults) return;
    setKeyResults(
      keyResults?.map((kr) =>
        kr.id === krId
          ? {
              ...kr,
              checklist: kr.checklist.filter((_, index) => index !== itemIndex),
            }
          : kr,
      ),
    );
  };

  // 새 목표 추가
  const addNewObjective = () => {
    if (!newObjective.title.trim()) return;

    const newId = objectives.length + 1;
    const newObj = {
      id: newId,
      title: newObjective.title,
      isActive: true,
      keyResults: newObjective?.keyResults?.map((kr, index) => ({
        id: keyResults.length + index + 1,
        type: kr.type,
        description: kr.description,
        target: kr.target,
        currentValue: kr.currentValue || 0,
        unit: kr.unit || "",
        checklist: kr.checklist || [],
      })),
    };

    setObjectives([...objectives, newObj]);
    setKeyResults([...keyResults, ...newObj.keyResults]);
    setShowNewObjectiveModal(false);
  };

  return {
    // States
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
    selectedObjective,
    setSelectedObjective,
    showObjectiveModal,
    setShowObjectiveModal,
    showKRModal,
    setShowKRModal,
    showEditKRModal,
    setShowEditKRModal,
    selectedKR,
    setSelectedKR,
    editingObjIndex,
    setEditingObjIndex,
    editingKRIndex,
    setEditingKRIndex,
    newObjectiveTitle,
    setNewObjectiveTitle,
    showEditObjectiveModal,
    setShowEditObjectiveModal,
    newObjective,
    setNewObjective,
    editKR,
    setEditKR,

    // Functions
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
    addNewObjective,
  };
};
