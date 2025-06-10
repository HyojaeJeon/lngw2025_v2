
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/useToast';
import { 
  GET_MARKETING_PLAN, 
  GET_MARKETING_PLAN_OBJECTIVES 
} from '@/lib/graphql/marketingQueries';
import { 
  CREATE_MARKETING_OBJECTIVE,
  UPDATE_MARKETING_OBJECTIVE,
  DELETE_MARKETING_OBJECTIVE,
  CREATE_KEY_RESULT,
  UPDATE_KEY_RESULT,
  DELETE_KEY_RESULT,
  CREATE_CHECKLIST_ITEM,
  UPDATE_CHECKLIST_ITEM,
  DELETE_CHECKLIST_ITEM,
  TOGGLE_CHECKLIST_ITEM
} from '@/lib/graphql/marketingMutations';
import PlanHeader from './_components/PlanHeader';
import ObjectiveCard from './_components/ObjectiveCard';

export default function PlanningProcessDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [editingObjective, setEditingObjective] = useState(null);
  const [editingKeyResult, setEditingKeyResult] = useState(null);
  const [newObjectiveData, setNewObjectiveData] = useState({
    title: '',
    description: '',
    priority: '보통',
    status: '진행중'
  });
  const [showNewObjectiveForm, setShowNewObjectiveForm] = useState(false);

  console.log('Loading plan data for ID:', id);

  // GraphQL 쿼리
  const { data: planData, loading: planLoading, error: planError } = useQuery(GET_MARKETING_PLAN, {
    variables: { id },
    skip: !id
  });

  const { data: objectivesData, loading: objectivesLoading, error: objectivesError, refetch: refetchObjectives } = useQuery(GET_MARKETING_PLAN_OBJECTIVES, {
    variables: { planId: id },
    skip: !id
  });

  // GraphQL 뮤테이션
  const [createObjective] = useMutation(CREATE_MARKETING_OBJECTIVE);
  const [updateObjective] = useMutation(UPDATE_MARKETING_OBJECTIVE);
  const [deleteObjective] = useMutation(DELETE_MARKETING_OBJECTIVE);
  const [createKeyResult] = useMutation(CREATE_KEY_RESULT);
  const [updateKeyResult] = useMutation(UPDATE_KEY_RESULT);
  const [deleteKeyResult] = useMutation(DELETE_KEY_RESULT);
  const [createChecklistItem] = useMutation(CREATE_CHECKLIST_ITEM);
  const [updateChecklistItem] = useMutation(UPDATE_CHECKLIST_ITEM);
  const [deleteChecklistItem] = useMutation(DELETE_CHECKLIST_ITEM);
  const [toggleChecklistItemMutation] = useMutation(TOGGLE_CHECKLIST_ITEM);

  // 에러 처리
  useEffect(() => {
    if (planError) {
      console.error('Plan loading error:', planError);
      toast({
        title: "오류",
        description: "마케팅 계획을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    }
    if (objectivesError) {
      console.error('Objectives loading error:', objectivesError);
      toast({
        title: "오류", 
        description: "목표를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [planError, objectivesError]);

  // 새 목표 추가
  const handleAddObjective = useCallback(async () => {
    if (!newObjectiveData.title.trim()) {
      toast({
        title: "오류",
        description: "목표 제목은 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createObjective({
        variables: {
          planId: id,
          input: newObjectiveData
        }
      });

      setNewObjectiveData({
        title: '',
        description: '',
        priority: '보통',
        status: '진행중'
      });
      setShowNewObjectiveForm(false);
      refetchObjectives();
      
      toast({
        title: "성공",
        description: "새 목표가 추가되었습니다.",
      });
    } catch (error) {
      console.error('목표 추가 오류:', error);
      toast({
        title: "오류",
        description: "목표 추가에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [newObjectiveData, id, createObjective, refetchObjectives]);

  // 목표 업데이트
  const handleUpdateObjective = useCallback(async (objectiveId, updatedData) => {
    try {
      await updateObjective({
        variables: {
          id: objectiveId,
          input: updatedData
        }
      });

      refetchObjectives();
      setEditingObjective(null);
      
      toast({
        title: "성공",
        description: "목표가 업데이트되었습니다.",
      });
    } catch (error) {
      console.error('목표 업데이트 오류:', error);
      toast({
        title: "오류",
        description: "목표 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [updateObjective, refetchObjectives]);

  // 목표 삭제
  const handleDeleteObjective = useCallback(async (objectiveId) => {
    if (!confirm('정말로 이 목표를 삭제하시겠습니까?')) return;

    try {
      await deleteObjective({
        variables: { id: objectiveId }
      });

      refetchObjectives();
      
      toast({
        title: "성공",
        description: "목표가 삭제되었습니다.",
      });
    } catch (error) {
      console.error('목표 삭제 오류:', error);
      toast({
        title: "오류",
        description: "목표 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [deleteObjective, refetchObjectives]);

  // 핵심 결과 추가
  const handleAddKeyResult = useCallback(async (objectiveId, keyResultData) => {
    try {
      await createKeyResult({
        variables: {
          objectiveId,
          input: keyResultData
        }
      });

      refetchObjectives();
      
      toast({
        title: "성공",
        description: "핵심 결과가 추가되었습니다.",
      });
    } catch (error) {
      console.error('핵심 결과 추가 오류:', error);
      toast({
        title: "오류",
        description: "핵심 결과 추가에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [createKeyResult, refetchObjectives]);

  // 핵심 결과 업데이트
  const handleUpdateKeyResult = useCallback(async (keyResultId, updatedData) => {
    try {
      await updateKeyResult({
        variables: {
          id: keyResultId,
          input: updatedData
        }
      });

      refetchObjectives();
      setEditingKeyResult(null);
      
      toast({
        title: "성공",
        description: "핵심 결과가 업데이트되었습니다.",
      });
    } catch (error) {
      console.error('핵심 결과 업데이트 오류:', error);
      toast({
        title: "오류",
        description: "핵심 결과 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [updateKeyResult, refetchObjectives]);

  // 핵심 결과 삭제
  const handleDeleteKeyResult = useCallback(async (keyResultId) => {
    if (!confirm('정말로 이 핵심 결과를 삭제하시겠습니까?')) return;

    try {
      await deleteKeyResult({
        variables: { id: keyResultId }
      });

      refetchObjectives();
      
      toast({
        title: "성공",
        description: "핵심 결과가 삭제되었습니다.",
      });
    } catch (error) {
      console.error('핵심 결과 삭제 오류:', error);
      toast({
        title: "오류",
        description: "핵심 결과 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [deleteKeyResult, refetchObjectives]);

  // 체크리스트 항목 추가
  const handleAddChecklistItem = useCallback(async (keyResultId, text) => {
    try {
      await createChecklistItem({
        variables: {
          keyResultId,
          input: { text, completed: false }
        }
      });

      refetchObjectives();
      
      toast({
        title: "성공",
        description: "체크리스트 항목이 추가되었습니다.",
      });
    } catch (error) {
      console.error('체크리스트 항목 추가 오류:', error);
      toast({
        title: "오류",
        description: "체크리스트 항목 추가에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [createChecklistItem, refetchObjectives]);

  // 체크리스트 항목 토글
  const toggleChecklistItem = useCallback(async (itemId) => {
    try {
      await toggleChecklistItemMutation({
        variables: { id: itemId }
      });

      refetchObjectives();
    } catch (error) {
      console.error('체크리스트 토글 오류:', error);
      toast({
        title: "오류",
        description: "체크리스트 토글에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [toggleChecklistItemMutation, refetchObjectives]);

  // 체크리스트 항목 삭제
  const handleDeleteChecklistItem = useCallback(async (itemId) => {
    try {
      await deleteChecklistItem({
        variables: { id: itemId }
      });

      refetchObjectives();
      
      toast({
        title: "성공",
        description: "체크리스트 항목이 삭제되었습니다.",
      });
    } catch (error) {
      console.error('체크리스트 항목 삭제 오류:', error);
      toast({
        title: "오류",
        description: "체크리스트 항목 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [deleteChecklistItem, refetchObjectives]);

  if (planLoading || objectivesLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!planData?.marketingPlan) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">마케팅 계획을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const plan = planData.marketingPlan;
  const objectives = objectivesData?.marketingPlanObjectives || [];

  return (
    <div className="p-6 space-y-6">
      {/* 플랜 헤더 */}
      <PlanHeader 
        plan={plan}
        onUpdate={() => window.location.reload()}
      />

      {/* 목표 목록 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">마케팅 목표</h2>
          <Button 
            onClick={() => setShowNewObjectiveForm(!showNewObjectiveForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showNewObjectiveForm ? '취소' : '목표 추가'}
          </Button>
        </div>

        {/* 새 목표 추가 폼 */}
        {showNewObjectiveForm && (
          <Card>
            <CardHeader>
              <CardTitle>새 목표 추가</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="목표 제목"
                value={newObjectiveData.title}
                onChange={(e) => setNewObjectiveData({
                  ...newObjectiveData,
                  title: e.target.value
                })}
              />
              <Input
                placeholder="목표 설명"
                value={newObjectiveData.description}
                onChange={(e) => setNewObjectiveData({
                  ...newObjectiveData,
                  description: e.target.value
                })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddObjective}>
                  추가
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewObjectiveForm(false);
                    setNewObjectiveData({
                      title: '',
                      description: '',
                      priority: '보통',
                      status: '진행중'
                    });
                  }}
                >
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 목표 카드들 */}
        {objectives.map((objective) => (
          <ObjectiveCard
            key={objective.id}
            objective={objective}
            onUpdate={handleUpdateObjective}
            onDelete={handleDeleteObjective}
            onAddKeyResult={handleAddKeyResult}
            onUpdateKeyResult={handleUpdateKeyResult}
            onDeleteKeyResult={handleDeleteKeyResult}
            onAddChecklistItem={handleAddChecklistItem}
            onToggleChecklistItem={toggleChecklistItem}
            onDeleteChecklistItem={handleDeleteChecklistItem}
            editingObjective={editingObjective}
            setEditingObjective={setEditingObjective}
            editingKeyResult={editingKeyResult}
            setEditingKeyResult={setEditingKeyResult}
          />
        ))}

        {objectives.length === 0 && !showNewObjectiveForm && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                아직 설정된 목표가 없습니다. 첫 번째 목표를 추가해보세요.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
