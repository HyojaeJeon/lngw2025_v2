import { useState, useEffect } from "react";
import { samplePlan, sampleObjectives } from "../../_utils/sampleData";

const usePlanData = (planId) => {
  const [plan, setPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [objectives, setObjectives] = useState([]);
  const [keyResults, setKeyResults] = useState([]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadPlanData = async () => {
      try {
        console.log("Loading plan data for ID:", planId);
        setLoading(true);

        // 실제 API 호출 대신 샘플 데이터 사용
        setTimeout(() => {
          setPlan(samplePlan);
          setCurrentPlan(samplePlan);
          setEditingPlan(samplePlan);
          setObjectives(sampleObjectives);

          // 모든 핵심 결과를 평면화하여 keyResults 배열에 저장
          const allKeyResults = sampleObjectives.flatMap(
            (obj) => obj.keyResults,
          );
          setKeyResults(allKeyResults);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Network error:", error);
        setLoading(false);
      }
    };

    if (planId) {
      loadPlanData();
    }
  }, [planId]);

  return {
    plan,
    setPlan,
    currentPlan,
    setCurrentPlan,
    editingPlan,
    setEditingPlan,
    isEditMode,
    setIsEditMode,
    loading,
    objectives,
    setObjectives,
    keyResults,
    setKeyResults,
  };
};

export default usePlanData;
