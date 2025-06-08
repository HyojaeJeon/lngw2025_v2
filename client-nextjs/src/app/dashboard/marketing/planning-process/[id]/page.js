"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useLanguage } from "@/contexts/languageContext.js";
import {
  ArrowLeft,
  Target,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  User,
  Clock,
  CheckCircle,
  Circle,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Download
} from "lucide-react";

export default function MarketingPlanDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const planId = params.id;

  // 상태 관리
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedObjectives, setExpandedObjectives] = useState({});
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [editingObjective, setEditingObjective] = useState(null);
  const [updateValues, setUpdateValues] = useState({});
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState({});

  // 더미 데이터
  const dummyPlan = {
    id: 1,
    title: "2025년 1분기 마케팅 계획",
    description: "Z세대를 대상으로 한 브랜드 인지도 확보 및 온라인 매출 증대를 목표로 하는 통합 마케팅 전략",
    status: "진행중",
    progress: 65,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    manager: "김마케팅",
    targetPersona: "20-30대 직장인",
    coreMessage: "일상을 더 스마트하게, 더 편리하게",
    channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
    objectives: [
      {
        id: 1,
        title: "Z세대 인지도 확보",
        progress: 63,
        isActive: true,
        keyResults: [
          {
            id: 1,
            title: "틱톡 팔로워 5만 달성",
            type: "number",
            target: 50000,
            current: 32000,
            unit: "명",
            progress: 64,
            isActive: true
          },
          {
            id: 2,
            title: "브랜드 인지도 20% 증가",
            type: "percentage",
            target: 20,
            current: 12,
            unit: "%",
            progress: 60,
            isActive: true
          },
          {
            id: 3,
            title: "UGC 콘텐츠 100건 수집",
            type: "checklist",
            items: [
              { id: 1, text: "인플루언서 10명 섭외", completed: true },
              { id: 2, text: "해시태그 캠페인 론칭", completed: true },
              { id: 3, text: "UGC 이벤트 진행", completed: false },
              { id: 4, text: "수집된 콘텐츠 분석", completed: false }
            ],
            progress: 50,
            isActive: true
          }
        ]
      },
      {
        id: 2,
        title: "온라인 매출 증대",
        progress: 45,
        isActive: true,
        keyResults: [
          {
            id: 4,
            title: "온라인 매출 30% 증가",
            type: "percentage",
            target: 30,
            current: 18,
            unit: "%",
            progress: 60,
            isActive: true
          },
          {
            id: 5,
            title: "전환율 3.5% 달성",
            type: "percentage",
            target: 3.5,
            current: 2.1,
            unit: "%",
            progress: 60,
            isActive: true
          },
          {
            id: 6,
            title: "고객 생애가치 25% 향상",
            type: "percentage",
            target: 25,
            current: 8,
            unit: "%",
            progress: 32,
            isActive: true
          }
        ]
      }
    ]
  };

  const dummyComments = [
    {
      id: 1,
      author: "김마케팅",
      content: "틱톡 팔로워 증가 속도가 예상보다 빠릅니다. 현재 전략을 유지하겠습니다.",
      timestamp: "2025-01-15 14:30",
      objectiveId: 1
    },
    {
      id: 2,
      author: "이기획",
      content: "브랜드 인지도 조사 결과 긍정적인 반응을 보이고 있습니다.",
      timestamp: "2025-01-14 09:15",
      objectiveId: 1
    }
  ];

  const dummyHistory = [
    {
      id: 1,
      action: "목표 수정",
      description: "틱톡 팔로워 목표를 4만에서 5만으로 상향 조정",
      user: "김마케팅",
      timestamp: "2025-01-10 16:20"
    },
    {
      id: 2,
      action: "진행률 업데이트",
      description: "Z세대 인지도 확보 목표 진행률 60% → 63%",
      user: "시스템",
      timestamp: "2025-01-09 10:00"
    }
  ];

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 실제 API 호출 시 여기서 데이터를 가져옵니다
        setPlan(dummyPlan);
        setEditedPlan(dummyPlan);
        setComments(dummyComments);
        setHistory(dummyHistory);

        // 모든 목표를 기본적으로 펼쳐놓음
        const expanded = {};
        dummyPlan.objectives.forEach(obj => {
          expanded[obj.id] = true;
        });
        setExpandedObjectives(expanded);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [planId]);

  // 목표 토글
  const toggleObjective = (objectiveId) => {
    setExpandedObjectives(prev => ({
      ...prev,
      [objectiveId]: !prev[objectiveId]
    }));
  };

  // 진행률 계산
  const calculateObjectiveProgress = (objective) => {
    const validResults = objective.keyResults.filter(kr => 
      kr.isActive && 
      (kr.type === "number" || kr.type === "percentage") && 
      kr.target !== null && 
      !isNaN(kr.target)
    );

    if (validResults.length === 0) return 0;

    const totalProgress = validResults.reduce((sum, kr) => {
      if (kr.type === "checklist") {
        const completedItems = kr.items.filter(item => item.completed).length;
        return sum + (completedItems / kr.items.length) * 100;
      }
      return sum + ((kr.current / kr.target) * 100);
    }, 0);

    return Math.min(Math.round(totalProgress / validResults.length), 100);
  };

  // Key Result 업데이트
  const updateKeyResult = (objectiveId, keyResultId, field, value) => {
    setPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj =>
        obj.id === objectiveId
          ? {
              ...obj,
              keyResults: obj.keyResults.map(kr =>
                kr.id === keyResultId
                  ? { ...kr, [field]: value }
                  : kr
              )
            }
          : obj
      )
    }));
  };

  // 체크리스트 아이템 토글
  const toggleChecklistItem = (objectiveId, keyResultId, itemId) => {
    setPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj =>
        obj.id === objectiveId
          ? {
              ...obj,
              keyResults: obj.keyResults.map(kr =>
                kr.id === keyResultId
                  ? {
                      ...kr,
                      items: kr.items.map(item =>
                        item.id === itemId
                          ? { ...item, completed: !item.completed }
                          : item
                      )
                    }
                  : kr
              )
            }
          : obj
      )
    }));
  };

  // 목표 삭제 (비활성화)
  const handleDeleteObjective = (objectiveId) => {
    setPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj =>
        obj.id === objectiveId
          ? { ...obj, isActive: false }
          : obj
      )
    }));
    setShowDeleteModal(false);
    setObjectiveToDelete(null);
  };

  // 코멘트 추가
  const addComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      author: "김마케팅", // 현재 사용자
      content: newComment,
      timestamp: new Date().toLocaleString(),
      objectiveId: null
    };

    setComments(prev => [...prev, comment]);
    setNewComment("");
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditedPlan({ ...plan });
    }
  };

  // 편집된 계획 업데이트
  const updateEditedPlan = (field, value) => {
    setEditedPlan(prev => ({ ...prev, [field]: value }));
  };

  // 편집 저장
  const saveEdits = () => {
    setPlan(editedPlan);
    setIsEditMode(false);
  };

  // 편집 취소
  const cancelEdits = () => {
    setEditedPlan({ ...plan });
    setIsEditMode(false);
  };

  // 목표 모달 렌더링
  const renderObjectiveModal = () => {
    if (!showObjectiveModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingObjective ? "목표 수정" : "새 목표 추가"}
          </h3>
          <Input
            placeholder="목표를 입력하세요"
            className="mb-4"
          />
          <div className="flex gap-3">
            <Button onClick={() => setShowObjectiveModal(false)}>취소</Button>
            <Button>저장</Button>
          </div>
        </div>
      </div>
    );
  };

  // 삭제 확인 모달
  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">목표 삭제 확인</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            이 목표를 정말 삭제하시겠습니까? 삭제된 목표는 비활성화되며 복구할 수 있습니다.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteObjective(objectiveToDelete)}
            >
              삭제
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">계획을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 animate-fadeIn">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="outline"
        onClick={() => router.push("/dashboard/marketing/planning-process")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        목록으로 돌아가기
      </Button>

      {/* 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditMode ? (
                <Input
                  value={editedPlan.title}
                  onChange={(e) => updateEditedPlan('title', e.target.value)}
                  className="text-2xl font-bold mb-2 border-2 border-blue-500"
                />
              ) : (
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
              )}
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  {plan.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  진행률: {plan.progress}%
                </span>
                <span className="text-sm text-gray-500">
                  담당자: {plan.manager}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditMode ? (
                <>
                  <Button onClick={saveEdits} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    저장
                  </Button>
                  <Button variant="outline" onClick={cancelEdits}>
                    <X className="w-4 h-4" />
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={toggleEditMode}>
                    <Edit className="w-4 h-4" />
                    수정
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4" />
                    보고서
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
              style={{width: `${plan.progress}%`}}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 계획 정보 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                계획 기간
              </h3>
              {isEditMode ? (
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={editedPlan.startDate}
                    onChange={(e) => updateEditedPlan('startDate', e.target.value)}
                    className="border-2 border-blue-500"
                  />
                  <Input
                    type="date"
                    value={editedPlan.endDate}
                    onChange={(e) => updateEditedPlan('endDate', e.target.value)}
                    className="border-2 border-blue-500"
                  />
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {plan.startDate} ~ {plan.endDate}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                계획 설명
              </h3>
              {isEditMode ? (
                <textarea
                  value={editedPlan.description}
                  onChange={(e) => updateEditedPlan('description', e.target.value)}
                  className="w-full p-3 border-2 border-blue-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {plan.description}
                </p>
              )}
            </div>
          </div>

          {/* 타겟 고객 및 핵심 메시지 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                타겟 고객
              </h3>
              {isEditMode ? (
                <Input
                  value={editedPlan.targetPersona}
                  onChange={(e) => updateEditedPlan('targetPersona', e.target.value)}
                  className="border-2 border-blue-500"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {plan.targetPersona}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                핵심 메시지
              </h3>
              {isEditMode ? (
                <Input
                  value={editedPlan.coreMessage}
                  onChange={(e) => updateEditedPlan('coreMessage', e.target.value)}
                  className="border-2 border-blue-500"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {plan.coreMessage}
                </p>
              )}
            </div>
          </div>

          {/* 주요 채널 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              주요 채널
            </h3>
            <div className="flex flex-wrap gap-2">
              {plan.channels.map((channel, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-indigo-50 text-indigo-700 border-indigo-200"
                >
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OKRs 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              목표 설정 (OKRs)
            </CardTitle>
            <Button 
              onClick={() => setShowObjectiveModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              목표 추가
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {plan.objectives.filter(obj => obj.isActive).map((objective) => (
            <div key={objective.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              {/* Objective 헤더 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleObjective(objective.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {expandedObjectives[objective.id] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {objective.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{width: `${calculateObjectiveProgress(objective)}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {calculateObjectiveProgress(objective)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingObjective(objective);
                        setShowObjectiveModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setObjectiveToDelete(objective.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Key Results */}
              {expandedObjectives[objective.id] && (
                <div className="p-4 space-y-4">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300">
                    Key Results:
                  </h5>

                  {objective.keyResults.filter(kr => kr.isActive).map((keyResult) => (
                    <div key={keyResult.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="font-medium text-gray-900 dark:text-white">
                          {keyResult.title}
                        </h6>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>

                      {keyResult.type === "checklist" ? (
                        <div className="space-y-2">
                          {keyResult.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <button
                                onClick={() => toggleChecklistItem(objective.id, keyResult.id, item.id)}
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  item.completed 
                                    ? "bg-green-500 border-green-500 text-white" 
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {item.completed && <CheckCircle className="w-3 h-3" />}
                              </button>
                              <span className={`text-sm ${
                                item.completed 
                                  ? "line-through text-gray-500" 
                                  : "text-gray-700 dark:text-gray-300"
                              }`}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                          <div className="mt-2 text-sm text-gray-500">
                            진행률: {Math.round((keyResult.items.filter(item => item.completed).length / keyResult.items.length) * 100)}%
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">현재:</span>
                              <Input
                                type="number"
                                value={keyResult.current}
                                onChange={(e) => updateKeyResult(objective.id, keyResult.id, 'current', parseFloat(e.target.value))}
                                className="w-20 h-8 text-sm"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {keyResult.unit}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">목표:</span>
                              <span className="text-sm font-medium">
                                {keyResult.target} {keyResult.unit}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{width: `${Math.min((keyResult.current / keyResult.target) * 100, 100)}%`}}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {Math.round((keyResult.current / keyResult.target) * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 코멘트 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            코멘트
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 새 코멘트 작성 */}
          <div className="flex gap-3">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="코멘트를 입력하세요..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addComment()}
            />
            <Button onClick={addComment}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* 코멘트 목록 */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.author}
                  </span>
                  <span className="text-sm text-gray-500">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 변경 이력 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            변경 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.action}
                    </span>
                    <span className="text-sm text-gray-500">
                      by {item.user}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {item.description}
                  </p>
                  <span className="text-xs text-gray-500">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 모달들 */}
      {renderObjectiveModal()}
      {renderDeleteModal()}
    </div>
  );
}