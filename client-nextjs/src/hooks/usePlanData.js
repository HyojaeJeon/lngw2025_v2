
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MARKETING_PLAN } from '@/lib/graphql/marketingQueries.js';

export const usePlanData = (planId) => {
  const [objectives, setObjectives] = useState([]);
  const [keyResults, setKeyResults] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // GraphQL query with error handling
  const { data, loading, error, refetch } = useQuery(GET_MARKETING_PLAN, {
    variables: { id: planId },
    skip: !planId,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error('마케팅 계획 로드 중 오류:', error);
    }
  });

  console.log('Loading plan data for ID:', planId);
  console.log('Query result:', { data, loading, error });

  useEffect(() => {
    if (data?.marketingPlan) {
      try {
        const plan = data.marketingPlan;
        console.log('Plan data received:', plan);
        
        // 안전한 objectives 설정
        const safeObjectives = Array.isArray(plan.objectives) ? plan.objectives : [];
        setObjectives(safeObjectives);
        
        // 모든 keyResults를 평면 배열로 수집
        const allKeyResults = [];
        safeObjectives.forEach(objective => {
          if (objective && Array.isArray(objective.keyResults)) {
            allKeyResults.push(...objective.keyResults);
          }
        });
        
        setKeyResults(allKeyResults);
        console.log('Objectives set:', safeObjectives);
        console.log('Key Results set:', allKeyResults);
      } catch (err) {
        console.error('계획 데이터 처리 중 오류:', err);
        setObjectives([]);
        setKeyResults([]);
      }
    } else if (error) {
      console.error('GraphQL 오류:', error);
      setObjectives([]);
      setKeyResults([]);
    }
  }, [data, error]);

  // 오류 발생 시 빈 배열들을 반환
  if (error && !data) {
    return {
      plan: null,
      loading: false,
      error,
      objectives: [],
      setObjectives: () => {},
      keyResults: [],
      setKeyResults: () => {},
      isEditMode: false,
      setIsEditMode: () => {},
      refetch
    };
  }

  return {
    plan: data?.marketingPlan || null,
    loading,
    error,
    objectives,
    setObjectives,
    keyResults,
    setKeyResults,
    isEditMode,
    setIsEditMode,
    refetch
  };
};
