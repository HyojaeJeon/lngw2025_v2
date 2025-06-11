
import { useState, useCallback } from 'react';

export const useObjectiveManagement = (objectives = [], setObjectives, keyResults = [], setKeyResults) => {
  const [collapsedObjectives, setCollapsedObjectives] = useState(new Set());
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [editingObjectiveId, setEditingObjectiveId] = useState(null);
  const [editingObjectiveData, setEditingObjectiveData] = useState(null);
  const [showNewObjectiveModal, setShowNewObjectiveModal] = useState(false);

  // 안전한 배열 확보 함수
  const getSafeArray = (arr) => Array.isArray(arr) ? arr : [];

  const toggleObjectiveCollapse = useCallback((objectiveId) => {
    if (!objectiveId) return;
    
    setCollapsedObjectives(prev => {
      const newSet = new Set(prev);
      if (newSet.has(objectiveId)) {
        newSet.delete(objectiveId);
      } else {
        newSet.add(objectiveId);
      }
      return newSet;
    });
  }, []);

  const startEditObjective = useCallback((objective) => {
    if (!objective) return;
    
    setEditingObjectiveId(objective.id);
    setEditingObjectiveData({ ...objective });
  }, []);

  const cancelEditObjective = useCallback(() => {
    setEditingObjectiveId(null);
    setEditingObjectiveData(null);
  }, []);

  const confirmDeleteObjective = useCallback((objective) => {
    if (!objective) return;
    
    setObjectiveToDelete(objective);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleDeleteObjective = useCallback(() => {
    if (!objectiveToDelete || !setObjectives) return;

    try {
      const safeObjectives = getSafeArray(objectives);
      const updatedObjectives = safeObjectives.filter(obj => obj?.id !== objectiveToDelete.id);
      setObjectives(updatedObjectives);
      
      setObjectiveToDelete(null);
      setShowDeleteConfirmModal(false);
    } catch (error) {
      console.error('목표 삭제 중 오류 발생:', error);
    }
  }, [objectiveToDelete, objectives, setObjectives]);

  const handleSaveEditObjective = useCallback(() => {
    if (!editingObjectiveData || !setObjectives) return;

    try {
      const safeObjectives = getSafeArray(objectives);
      const updatedObjectives = safeObjectives.map(obj => 
        obj?.id === editingObjectiveData.id ? { ...obj, ...editingObjectiveData } : obj
      );
      
      setObjectives(updatedObjectives);
      setEditingObjectiveId(null);
      setEditingObjectiveData(null);
    } catch (error) {
      console.error('목표 수정 중 오류 발생:', error);
    }
  }, [editingObjectiveData, objectives, setObjectives]);

  const updateKeyResultTitle = useCallback((krId, title) => {
    if (!krId || !setKeyResults) return;

    try {
      const safeKeyResults = getSafeArray(keyResults);
      const updatedKeyResults = safeKeyResults.map(kr => 
        kr?.id === krId ? { ...kr, title } : kr
      );
      setKeyResults(updatedKeyResults);
    } catch (error) {
      console.error('핵심 결과 제목 업데이트 중 오류 발생:', error);
    }
  }, [keyResults, setKeyResults]);

  const updateKeyResultValue = useCallback((krId, currentValue) => {
    if (!krId || !setKeyResults) return;

    try {
      const safeKeyResults = getSafeArray(keyResults);
      const updatedKeyResults = safeKeyResults.map(kr => 
        kr?.id === krId ? { ...kr, currentValue } : kr
      );
      setKeyResults(updatedKeyResults);
    } catch (error) {
      console.error('핵심 결과 값 업데이트 중 오류 발생:', error);
    }
  }, [keyResults, setKeyResults]);

  const updateChecklistItemInEdit = useCallback((krId, itemIndex, text) => {
    if (!editingObjectiveData || !setEditingObjectiveData) return;

    try {
      const updatedData = { ...editingObjectiveData };
      if (!updatedData.keyResults) updatedData.keyResults = [];
      
      const keyResultIndex = updatedData.keyResults.findIndex(kr => kr?.id === krId);
      if (keyResultIndex === -1) return;

      if (!updatedData.keyResults[keyResultIndex].checklist) {
        updatedData.keyResults[keyResultIndex].checklist = [];
      }

      if (itemIndex >= 0 && itemIndex < updatedData.keyResults[keyResultIndex].checklist.length) {
        updatedData.keyResults[keyResultIndex].checklist[itemIndex] = {
          ...updatedData.keyResults[keyResultIndex].checklist[itemIndex],
          text
        };
        setEditingObjectiveData(updatedData);
      }
    } catch (error) {
      console.error('편집 중 체크리스트 항목 업데이트 중 오류 발생:', error);
    }
  }, [editingObjectiveData, setEditingObjectiveData]);

  const addChecklistItemInEdit = useCallback((krId) => {
    if (!editingObjectiveData || !setEditingObjectiveData) return;

    try {
      const updatedData = { ...editingObjectiveData };
      if (!updatedData.keyResults) updatedData.keyResults = [];
      
      const keyResultIndex = updatedData.keyResults.findIndex(kr => kr?.id === krId);
      if (keyResultIndex === -1) return;

      if (!updatedData.keyResults[keyResultIndex].checklist) {
        updatedData.keyResults[keyResultIndex].checklist = [];
      }

      const newItem = {
        id: Date.now(),
        text: '새 체크리스트 항목',
        completed: false,
        sortOrder: updatedData.keyResults[keyResultIndex].checklist.length
      };

      updatedData.keyResults[keyResultIndex].checklist.push(newItem);
      setEditingObjectiveData(updatedData);
    } catch (error) {
      console.error('편집 중 체크리스트 항목 추가 중 오류 발생:', error);
    }
  }, [editingObjectiveData, setEditingObjectiveData]);

  const removeChecklistItemInEdit = useCallback((krId, itemIndex) => {
    if (!editingObjectiveData || !setEditingObjectiveData) return;

    try {
      const updatedData = { ...editingObjectiveData };
      if (!updatedData.keyResults) return;
      
      const keyResultIndex = updatedData.keyResults.findIndex(kr => kr?.id === krId);
      if (keyResultIndex === -1 || !updatedData.keyResults[keyResultIndex].checklist) return;

      updatedData.keyResults[keyResultIndex].checklist.splice(itemIndex, 1);
      setEditingObjectiveData(updatedData);
    } catch (error) {
      console.error('편집 중 체크리스트 항목 제거 중 오류 발생:', error);
    }
  }, [editingObjectiveData, setEditingObjectiveData]);

  const addChecklistItem = useCallback((krId, text) => {
    if (!krId || !text || !setKeyResults) return;

    try {
      const safeKeyResults = getSafeArray(keyResults);
      const updatedKeyResults = safeKeyResults.map(kr => {
        if (kr?.id === krId) {
          const checklist = getSafeArray(kr.checklist);
          const newItem = {
            id: Date.now(),
            text,
            completed: false,
            sortOrder: checklist.length
          };
          return { ...kr, checklist: [...checklist, newItem] };
        }
        return kr;
      });
      setKeyResults(updatedKeyResults);
    } catch (error) {
      console.error('체크리스트 항목 추가 중 오류 발생:', error);
    }
  }, [keyResults, setKeyResults]);

  const updateChecklistItem = useCallback((krId, itemId, text) => {
    if (!krId || !itemId || !setKeyResults) return;

    try {
      const safeKeyResults = getSafeArray(keyResults);
      const updatedKeyResults = safeKeyResults.map(kr => {
        if (kr?.id === krId && kr.checklist) {
          const updatedChecklist = kr.checklist.map(item =>
            item?.id === itemId ? { ...item, text } : item
          );
          return { ...kr, checklist: updatedChecklist };
        }
        return kr;
      });
      setKeyResults(updatedKeyResults);
    } catch (error) {
      console.error('체크리스트 항목 업데이트 중 오류 발생:', error);
    }
  }, [keyResults, setKeyResults]);

  const toggleChecklistItem = useCallback(({ krId, itemIndex }) => {
    console.log('체크리스트 토글:', { krId, itemIndex });
    
    if (!krId || itemIndex == null || !setKeyResults) {
      console.warn('toggleChecklistItem: 필수 파라미터가 누락되었습니다:', { krId, itemIndex, setKeyResults: !!setKeyResults });
      return;
    }

    try {
      const safeKeyResults = getSafeArray(keyResults);
      console.log('현재 키 결과들:', safeKeyResults);
      
      const updatedKeyResults = safeKeyResults.map(kr => {
        if (kr?.id === krId) {
          const checklist = getSafeArray(kr.checklist);
          console.log('체크리스트:', checklist);
          
          if (itemIndex >= 0 && itemIndex < checklist.length) {
            const updatedChecklist = checklist.map((item, index) => {
              if (index === itemIndex) {
                return { ...item, completed: !item.completed };
              }
              return item;
            });
            return { ...kr, checklist: updatedChecklist };
          }
        }
        return kr;
      });
      
      console.log('업데이트된 키 결과들:', updatedKeyResults);
      setKeyResults(updatedKeyResults);
    } catch (error) {
      console.error('체크리스트 항목 토글 중 오류 발생:', error);
    }
  }, [keyResults, setKeyResults]);

  const removeChecklistItem = useCallback((krId, itemId) => {
    if (!krId || !itemId || !setKeyResults) return;

    try {
      const safeKeyResults = getSafeArray(keyResults);
      const updatedKeyResults = safeKeyResults.map(kr => {
        if (kr?.id === krId && kr.checklist) {
          const updatedChecklist = kr.checklist.filter(item => item?.id !== itemId);
          return { ...kr, checklist: updatedChecklist };
        }
        return kr;
      });
      setKeyResults(updatedKeyResults);
    } catch (error) {
      console.error('체크리스트 항목 제거 중 오류 발생:', error);
    }
  }, [keyResults, setKeyResults]);

  return {
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
  };
};
