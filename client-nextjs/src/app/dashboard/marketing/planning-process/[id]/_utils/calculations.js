// 목표 진행률 계산 함수
export const calculateObjectiveProgress = (objective) => {
  if (!objective.keyResults || objective.keyResults.length === 0) return 0;

  const totalProgress = objective.keyResults.reduce((sum, kr) => {
    if (kr.type === "numeric") {
      const progress = Math.min(
        (kr.currentValue / parseFloat(kr.target)) * 100,
        100,
      );
      return sum + progress;
    } else if (kr.type === "checklist") {
      const completed = kr.checklist.filter((item) => item.completed).length;
      const total = kr.checklist.length;
      return sum + (total > 0 ? (completed / total) * 100 : 0);
    }
    return sum;
  }, 0);

  return Math.round(totalProgress / objective.keyResults.length);
};

// 전체 진행률 계산 함수
export const calculateOverallProgress = (objectives) => {
  if (!objectives || objectives.length === 0) return 0;

  const totalProgress = objectives.reduce((sum, objective) => {
    const objectiveProgress = calculateObjectiveProgress(objective);
    return sum + objectiveProgress;
  }, 0);

  return Math.round(totalProgress / objectives.length);
};
