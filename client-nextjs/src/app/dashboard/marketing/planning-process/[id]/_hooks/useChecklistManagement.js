
"use client";

import { useState, useCallback } from "react";

export const useChecklistManagement = (initialObjectives = []) => {
  const [objectives, setObjectives] = useState(initialObjectives);

  // 체크리스트 항목 토글
  const toggleChecklistItem = useCallback((objectiveIndex, itemIndex) => {
    setObjectives(prev => 
      prev.map((objective, objIdx) => {
        if (objIdx === objectiveIndex) {
          return {
            ...objective,
            checklist: objective.checklist?.map((item, itemIdx) => {
              if (itemIdx === itemIndex) {
                return {
                  ...item,
                  completed: !item.completed,
                  completedAt: !item.completed ? new Date().toISOString() : null
                };
              }
              return item;
            }) || []
          };
        }
        return objective;
      })
    );
  }, []);

  // 체크리스트 항목 추가
  const addChecklistItem = useCallback((objectiveIndex, newItem) => {
    setObjectives(prev => 
      prev.map((objective, objIdx) => {
        if (objIdx === objectiveIndex) {
          return {
            ...objective,
            checklist: [
              ...(objective.checklist || []),
              {
                id: Date.now(),
                text: newItem,
                completed: false,
                createdAt: new Date().toISOString(),
                completedAt: null
              }
            ]
          };
        }
        return objective;
      })
    );
  }, []);

  // 체크리스트 항목 삭제
  const removeChecklistItem = useCallback((objectiveIndex, itemIndex) => {
    setObjectives(prev => 
      prev.map((objective, objIdx) => {
        if (objIdx === objectiveIndex) {
          return {
            ...objective,
            checklist: objective.checklist?.filter((_, itemIdx) => itemIdx !== itemIndex) || []
          };
        }
        return objective;
      })
    );
  }, []);

  // 체크리스트 항목 수정
  const updateChecklistItem = useCallback((objectiveIndex, itemIndex, newText) => {
    setObjectives(prev => 
      prev.map((objective, objIdx) => {
        if (objIdx === objectiveIndex) {
          return {
            ...objective,
            checklist: objective.checklist?.map((item, itemIdx) => {
              if (itemIdx === itemIndex) {
                return {
                  ...item,
                  text: newText
                };
              }
              return item;
            }) || []
          };
        }
        return objective;
      })
    );
  }, []);

  // 체크리스트 진행률 계산
  const getChecklistProgress = useCallback((objectiveIndex) => {
    const objective = objectives[objectiveIndex];
    if (!objective?.checklist || objective.checklist.length === 0) return 0;
    
    const completedItems = objective.checklist.filter(item => item.completed).length;
    return Math.round((completedItems / objective.checklist.length) * 100);
  }, [objectives]);

  // API 저장 함수 (향후 구현용)
  const saveChecklistToAPI = useCallback(async (objectiveIndex, itemIndex, completed) => {
    try {
      // TODO: API 호출 구현
      // const response = await fetch('/api/checklist', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     objectiveId: objectives[objectiveIndex].id,
      //     itemId: objectives[objectiveIndex].checklist[itemIndex].id,
      //     completed,
      //     completedAt: completed ? new Date().toISOString() : null
      //   })
      // });
      
      console.log('체크리스트 상태 저장:', { objectiveIndex, itemIndex, completed });
      return true;
    } catch (error) {
      console.error('체크리스트 저장 실패:', error);
      return false;
    }
  }, [objectives]);

  return {
    objectives,
    setObjectives,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    updateChecklistItem,
    getChecklistProgress,
    saveChecklistToAPI,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    updateChecklistItem,
    getChecklistProgress,
    saveChecklistToAPI
  };
};
