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

  // 더미 데이터 (실제로는 API에서 가져올 데이터)
  useEffect(() => {
    const fetchPlanData = () => {
      const dummyPlan = {
        id: planId,
        title: "2025년 1분기 마케팅 계획",
        status: "진행중",
        progress: 65,
        createdAt: "2025-01-15",
        updatedAt: "2025-06-08",
        startDate: "2025-01-01",
        endDate: "2025-03-31",
        manager: "김마케팅",
        description: "Z세대를 타겟으로 한 브랜드 인지도 향상 및 온라인 매출 증대를 목표로 하는 1분기 마케팅 전략",
        targetPersona: "20-30대 직장인",
        coreMessage: "일상을 더 스마트하게, 더 편리하게",
        channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
        objectives: [
          {
            id: 1,
            title: "Z세대 인지도 확보",
            keyResults: [
              {
                id: 101,
                title: "틱톡 팔로워 5만 달성",
                current: 32000,
                target: 50000,
                measurementType: "number",
                unit: "명"
              },
              {
                id: 102,
                title: "브랜드 인지도 20% 증가",
                current: 15,
                target: 20,
                measurementType: "percentage",
                unit: "%"
              },
              {
                id: 103,
                title: "UGC 콘텐츠 수집",
                measurementType: "checklist",
                checklist: [
                  { id: 1, text: "인플루언서 협업 10건", completed: true },
                  { id: 2, text: "고객 리뷰 영상 50개", completed: true },
                  { id: 3, text: "해시태그 챌린지 진행", completed: false },
                  { id: 4, text: "UGC 콘테스트 개최", completed: false }
                ]
              }
            ]
          },
          {
            id: 2,
            title: "온라인 매출 증대",
            keyResults: [
              {
                id: 201,
                title: "온라인 매출 30% 증가",
                current: 25,
                target: 30,
                measurementType: "percentage",
                unit: "%"
              },
              {
                id: 202,
                title: "전환율 3.5% 달성",
                current: 2.8,
                target: 3.5,
                measurementType: "percentage",
                unit: "%"
              },
              {
                id: 203,
                title: "신규 고객 획득",
                measurementType: "checklist",
                checklist: [
                  { id: 1, text: "리타겟팅 캠페인 설정", completed: true },
                  { id: 2, text: "신규 고객 할인 이벤트", completed: false },
                  { id: 3, text: "추천 프로그램 런칭", completed: false }
                ]
              }
            ]
          }
        ]
      };

      setPlan(dummyPlan);
      setLoading(false);

      // 초기 확장 상태 설정 (첫 번째 목표만 확장)
      setExpandedObjectives({ [dummyPlan.objectives[0].id]: true });
    };

    fetchPlanData();
  }, [planId]);

  // 더미 코멘트 데이터
  useEffect(() => {
    setComments([
      {
        id: 1,
        author: "이기획",
        content: "틱톡 팔로워 증가 속도가 예상보다 빨라서 목표 달성이 가능할 것 같습니다.",
        createdAt: "2025-06-07 14:30"
      },
      {
        id: 2,
        author: "박마케팅",
        content: "UGC 콘테스트 기획안 검토 완료했습니다. 다음 주부터 진행 가능합니다.",
        createdAt: "2025-06-06 10:15"
      }
    ]);

    setHistory([
      {
        id: 1,
        action: "목표 업데이트",
        user: "김마케팅",
        detail: "틱톡 팔로워 현재값이 32,000명으로 업데이트됨",
        timestamp: "2025-06-08 09:30"
      },
      {
        id: 2,
        action: "체크리스트 완료",
        user: "이기획",
        detail: "인플루언서 협업 10건 체크리스트 항목 완료",
        timestamp: "2025-06-07 16:45"
      }
    ]);
  }, []);

  // 진행률 계산 함수
  const calculateProgress = (current, target) => {
    if (!current || !target || isNaN(current) || isNaN(target)) return null;
    return Math.min((current / target) * 100, 100);
  };

  // Objective 전체 달성률 계산
  const calculateObjectiveProgress = (keyResults) => {
    if (!keyResults || keyResults.length === 0) return 0;

    const validResults = keyResults.filter((kr) => {
      if (kr.measurementType === "checklist") {
        return kr.checklist && kr.checklist.length > 0;
      }
      return (
        kr.current !== null &&
        !isNaN(kr.current) &&
        kr.target !== null &&
        !isNaN(kr.target)
      );
    });

    if (validResults.length === 0) return 0;

    const totalProgress = validResults.reduce((sum, kr) => {
      if (kr.measurementType === "checklist") {
        const completed = kr.checklist
          ? kr.checklist.filter((item) => item.completed).length
          : 0;
        const total = kr.checklist ? kr.checklist.length : 1;
        return sum + (completed / total) * 100;
      }
      return sum + Math.min((kr.current / kr.target) * 100, 100);
    }, 0);

    return Math.round(totalProgress / validResults.length);
  };

  // 진행률 표시 텍스트
  const getProgressText = (current, target, unit) => {
    if (current === null || target === null || isNaN(current) || isNaN(target)) {
      return "데이터 없음";
    }
    return `${current.toLocaleString()}${unit} / ${target.toLocaleString()}${unit}`;
  };

  // 목표 토글 함수
  const toggleObjective = (objectiveId) => {
    setExpandedObjectives((prev) => ({
      ...prev,
      [objectiveId]: !prev[objectiveId],
    }));
  };

  // 목표 삭제 확인 함수
  const handleDeleteObjective = () => {
    if (!objectiveToDelete) return;

    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((obj) => obj.id !== objectiveToDelete),
    }));
    setShowDeleteModal(false);
    setObjectiveToDelete(null);
  };

  // Key Result 업데이트
  const handleUpdateKeyResult = (objectiveId, keyResultId, value) => {
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              keyResults: objective.keyResults.map((keyResult) =>
                keyResult.id === keyResultId
                  ? { ...keyResult, current: parseFloat(value) }
                  : keyResult,
              ),
            }
          : objective,
      ),
    }));
    setUpdateValues((prev) => ({ ...prev, [keyResultId]: "" }));
  };

  // 체크리스트 항목 토글
  const handleToggleChecklistItem = (objectiveId, keyResultId, itemIndex) => {
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              keyResults: objective.keyResults.map((keyResult) =>
                keyResult.id === keyResultId
                  ? {
                      ...keyResult,
                      checklist: keyResult.checklist.map((item, index) =>
                        index === itemIndex ? { ...item, completed: !item.completed } : item
                      )
                    }
                  : keyResult
              )
            }
          : objective
      )
    }));
  };

  // 코멘트 추가
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      author: "현재 사용자",
      content: newComment,
      createdAt: new Date().toLocaleString("ko-KR"),
    };

    setComments((prev) => [newCommentObj, ...prev]);
    setNewComment("");
  };

  // 목표 모달 렌더링
  const renderObjectiveModal = () => {
    const isEditMode = !!editingObjective;
    const [title, setTitle] = useState(editingObjective?.title || "");

    const handleSubmit = () => {
      if (!title.trim()) return;

      if (isEditMode) {
        // 목표 수정 로직
        setPlan((prev) => ({
          ...prev,
          objectives: prev.objectives.map((obj) =>
            obj.id === editingObjective.id ? { ...obj, title } : obj
          ),
        }));
      } else {
        // 목표 추가 로직
        const newObjective = {
          id: Date.now(),
          title,
          keyResults: [],
        };
        setPlan((prev) => ({
          ...prev,
          objectives: [...prev.objectives, newObjective],
        }));
      }

      // 모달 닫기 및 상태 초기화
      setShowObjectiveModal(false);
      setEditingObjective(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isEditMode ? "목표 수정" : "새 목표 추가"}
          </h3>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            목표 제목
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="목표를 입력하세요"
            className="mb-4"
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowObjectiveModal(false);
                setEditingObjective(null);
              }}
            >
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim()}>
              {isEditMode ? "수정" : "추가"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 삭제 확인 모달
  const renderDeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          목표 삭제 확인
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          이 목표를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteModal(false);
              setObjectiveToDelete(null);
            }}
          >
            취소
          </Button>
          <Button variant="destructive" onClick={handleDeleteObjective}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-8">
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
              <CardTitle className="text-2xl mb-2">{plan.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <Badge variant={plan.status === "진행중" ? "default" : "secondary"}>
                  {plan.status}
                </Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {plan.startDate} ~ {plan.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  담당자: {plan.manager}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
              <Button size="sm" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                보고서
              </Button>
            </div>
          </div>

          {/* 전체 진행률 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">전체 진행률</span>
              <span className="font-medium">{plan.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${plan.progress}%` }}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 계획 개요 */}
      {(plan.description || plan.targetPersona || plan.coreMessage) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              계획 개요
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.description && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">설명</h4>
                <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.targetPersona && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">타겟 고객</h4>
                  <p className="text-gray-600 dark:text-gray-400">{plan.targetPersona}</p>
                </div>
              )}

              {plan.coreMessage && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">핵심 메시지</h4>
                  <p className="text-gray-600 dark:text-gray-400">{plan.coreMessage}</p>
                </div>
              )}
            </div>

            {plan.channels && plan.channels.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">주요 채널</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.channels.map((channel, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 목표 설정 (OKRs) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              목표 설정 (OKRs)
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => setShowObjectiveModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              목표 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {plan.objectives?.map((objective, objIndex) => {
            const isExpanded = expandedObjectives[objective.id] || false;
            const objectiveProgress = calculateObjectiveProgress(objective.keyResults);

            return (
              <div key={objective.id || objIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                {/* Objective 헤더 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {objective.title}
                        </h3>
                        <Badge variant="outline" className={`${
                          objectiveProgress >= 100 ? 'bg-green-100 text-green-800 border-green-300' :
                          objectiveProgress >= 75 ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          objectiveProgress >= 50 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                          objectiveProgress > 0 ? 'bg-orange-100 text-orange-800 border-orange-300' :
                          'bg-gray-100 text-gray-800 border-gray-300'
                        }`}>
                          {objectiveProgress}% 달성
                        </Badge>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            objectiveProgress >= 100 ? 'bg-green-500' :
                            objectiveProgress >= 75 ? 'bg-blue-500' :
                            objectiveProgress >= 50 ? 'bg-yellow-500' :
                            objectiveProgress > 0 ? 'bg-orange-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min(objectiveProgress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleObjective(objective.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
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
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Key Results ({objective.keyResults.length}개)
                    </h4>

                    {objective.keyResults.map((kr, krIndex) => (
                      <div key={kr.id || krIndex} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-medium text-gray-900 dark:text-white flex-1">
                            {kr.title}
                          </h5>
                          {kr.measurementType !== "checklist" && (
                            <div className="text-right">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {getProgressText(kr.current, kr.target, kr.unit)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                진행률: {calculateProgress(kr.current, kr.target)?.toFixed(1) || 0}%
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 진행률 바 (체크리스트가 아닌 경우) */}
                        {kr.measurementType !== "checklist" && (
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(calculateProgress(kr.current, kr.target) || 0, 100)}%`
                              }}
                            ></div>
                          </div>
                        )}

                        {/* 체크리스트 */}
                        {kr.measurementType === "checklist" && kr.checklist && (
                          <div className="space-y-2 mb-3">
                            {kr.checklist.map((item, itemIndex) => (
                              <div key={item.id || itemIndex} className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleChecklistItem(objective.id, kr.id, itemIndex)}
                                  className="flex-shrink-0"
                                >
                                  {item.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-gray-400" />
                                  )}
                                </button>
                                <span className={`text-sm ${
                                  item.completed 
                                    ? 'text-gray-500 line-through' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 업데이트 버튼 */}
                        {kr.measurementType !== "checklist" && (
                          <div className="flex items-center gap-2 mt-3">
                            <Input
                              type="number"
                              placeholder="현재값 입력"
                              value={updateValues[kr.id] || ""}
                              onChange={(e) => setUpdateValues(prev => ({
                                ...prev,
                                [kr.id]: e.target.value
                              }))}
                              className="w-32"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateKeyResult(objective.id, kr.id, updateValues[kr.id])}
                              disabled={!updateValues[kr.id]}
                            >
                              <Save className="w-4 h-4 mr-1" />
                              업데이트
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 코멘트 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            코멘트 ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 새 코멘트 입력 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="코멘트를 작성하세요..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
              >
                코멘트 추가
              </Button>
            </div>
          </div>

          {/* 코멘트 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 모달들 */}
      {showObjectiveModal && renderObjectiveModal()}
      {showDeleteModal && renderDeleteModal()}
    </div>
  );
}