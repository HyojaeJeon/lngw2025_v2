
/**
 * 목표의 진행률을 계산하는 함수
 * @param {Object} objective - 목표 객체
 * @returns {number} - 진행률 (0-100)
 */
export const calculateObjectiveProgress = (objective) => {
  try {
    if (!objective) {
      return 0;
    }

    // keyResults가 없거나 빈 배열인 경우
    if (!Array.isArray(objective.keyResults) || objective.keyResults.length === 0) {
      return objective.progress || 0;
    }

    // 각 keyResult의 진행률을 계산
    const progressValues = objective.keyResults
      .map(kr => {
        if (!kr) return 0;
        
        // 직접적인 progress 값이 있는 경우
        if (typeof kr.progress === 'number') {
          return Math.max(0, Math.min(100, kr.progress));
        }

        // targetValue와 currentValue를 기반으로 계산
        if (typeof kr.targetValue === 'number' && typeof kr.currentValue === 'number') {
          if (kr.targetValue === 0) return 0;
          const progress = (kr.currentValue / kr.targetValue) * 100;
          return Math.max(0, Math.min(100, progress));
        }

        // 체크리스트를 기반으로 계산
        if (Array.isArray(kr.checklist) && kr.checklist.length > 0) {
          const completedItems = kr.checklist.filter(item => item && item.completed).length;
          return (completedItems / kr.checklist.length) * 100;
        }

        return 0;
      })
      .filter(progress => !isNaN(progress));

    // 평균 진행률 계산
    if (progressValues.length === 0) {
      return objective.progress || 0;
    }

    const averageProgress = progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length;
    return Math.round(Math.max(0, Math.min(100, averageProgress)));
  } catch (error) {
    console.error('진행률 계산 중 오류 발생:', error);
    return 0;
  }
};

/**
 * 키 결과의 진행률을 계산하는 함수
 * @param {Object} keyResult - 키 결과 객체
 * @returns {number} - 진행률 (0-100)
 */
export const calculateKeyResultProgress = (keyResult) => {
  try {
    if (!keyResult) {
      return 0;
    }

    // 직접적인 progress 값이 있는 경우
    if (typeof keyResult.progress === 'number') {
      return Math.max(0, Math.min(100, keyResult.progress));
    }

    // targetValue와 currentValue를 기반으로 계산
    if (typeof keyResult.targetValue === 'number' && typeof keyResult.currentValue === 'number') {
      if (keyResult.targetValue === 0) return 0;
      const progress = (keyResult.currentValue / keyResult.targetValue) * 100;
      return Math.round(Math.max(0, Math.min(100, progress)));
    }

    // 체크리스트를 기반으로 계산
    if (Array.isArray(keyResult.checklist) && keyResult.checklist.length > 0) {
      const completedItems = keyResult.checklist.filter(item => item && item.completed).length;
      const progress = (completedItems / keyResult.checklist.length) * 100;
      return Math.round(progress);
    }

    return 0;
  } catch (error) {
    console.error('키 결과 진행률 계산 중 오류 발생:', error);
    return 0;
  }
};

/**
 * 전체 계획의 진행률을 계산하는 함수
 * @param {Array} objectives - 목표 배열
 * @returns {number} - 전체 진행률 (0-100)
 */
export const calculatePlanProgress = (objectives) => {
  try {
    if (!Array.isArray(objectives) || objectives.length === 0) {
      return 0;
    }

    const activeObjectives = objectives.filter(obj => obj && obj.isActive !== false);
    
    if (activeObjectives.length === 0) {
      return 0;
    }

    const progressValues = activeObjectives
      .map(obj => calculateObjectiveProgress(obj))
      .filter(progress => !isNaN(progress));

    if (progressValues.length === 0) {
      return 0;
    }

    const averageProgress = progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length;
    return Math.round(Math.max(0, Math.min(100, averageProgress)));
  } catch (error) {
    console.error('계획 진행률 계산 중 오류 발생:', error);
    return 0;
  }
};

/**
 * 체크리스트 완료율을 계산하는 함수
 * @param {Array} checklist - 체크리스트 배열
 * @returns {number} - 완료율 (0-100)
 */
export const calculateChecklistProgress = (checklist) => {
  try {
    if (!Array.isArray(checklist) || checklist.length === 0) {
      return 0;
    }

    const completedItems = checklist.filter(item => item && item.completed).length;
    const progress = (completedItems / checklist.length) * 100;
    return Math.round(Math.max(0, Math.min(100, progress)));
  } catch (error) {
    console.error('체크리스트 진행률 계산 중 오류 발생:', error);
    return 0;
  }
};
