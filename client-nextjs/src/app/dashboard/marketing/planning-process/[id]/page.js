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
  FileText,
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
  const [editedPlan, setEditedPlan] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

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
            isActive: true,
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
            isActive: true,
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

    // 목표를 비활성화
    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj) =>
        obj.id === objectiveToDelete ? { ...obj, isActive: false } : obj
      ),
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
    // 계획 수정 관련 함수들
  const handleEditStart = () => {
    setIsEditMode(true);
    setEditedPlan({ ...plan });
  };

  const handleEditCancel = () => {
    setIsEditMode(false);
    setEditedPlan(null);
  };

  const handleEditSave = () => {
    // 실제 API 호출로 데이터 저장
    setPlan(editedPlan);
    setIsEditMode(false);
    setEditedPlan(null);

    // 성공 메시지 표시
    alert('계획이 성공적으로 수정되었습니다.');
  };

  const updateEditedPlan = (field, value) => {
    setEditedPlan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateObjective = (objIndex, field, value) => {
    setEditedPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, index) => 
        index === objIndex ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const updateKeyResult = (objIndex, krIndex, field, value) => {
    setEditedPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, oIndex) => 
        oIndex === objIndex 
          ? {
              ...obj,
              keyResults: obj.keyResults.map((kr, kIndex) => 
                kIndex === krIndex ? { ...kr, [field]: value } : kr
              )
            }
          : obj
      )
    }));
  };

  const addChannel = (newChannel) => {
    if (newChannel && !editedPlan.channels.includes(newChannel)) {
      setEditedPlan(prev => ({
        ...prev,
        channels: [...prev.channels, newChannel]
      }));
    }
  };

  const removeChannel = (channelToRemove) => {
    setEditedPlan(prev => ({
      ...prev,
      channels: prev.channels.filter(channel => channel !== channelToRemove)
    }));
  };

  // 보고서 관련 함수들
  const generateReport = () => {
    setShowReportModal(true);
  };

  const calculateOverallProgress = () => {
    if (!plan?.objectives?.length) return 0;

    const totalProgress = plan.objectives.reduce((acc, obj) => {
      return acc + calculateObjectiveProgress(obj.keyResults);
    }, 0);

    return Math.round(totalProgress / plan.objectives.length);
  };

  // 보고서 모달 렌더링
  const renderReportModal = () => {
    if (!showReportModal || !plan) return null;

    const overallProgress = calculateOverallProgress();
    const objectiveProgress = plan.objectives.map(obj => ({
      title: obj.title,
      progress: calculateObjectiveProgress(obj.keyResults)
    }));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.title} - 진행 보고서
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  보고서 생성일: {new Date().toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  PDF 내보내기
                </Button>
                <Button variant="outline" onClick={() => setShowReportModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">담당자</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{plan.manager}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">계획 기간</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {plan.startDate} ~ {plan.endDate}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">전체 진행률</h3>
                <p className="text-2xl font-bold text-blue-600">{overallProgress}%</p>
              </div>
            </div>

            {/* 전체 진행 현황 */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                전체 진행 현황
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(overallProgress / 100) * 377} 377`}
                      className="text-blue-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overallProgress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 목표별 달성 현황 */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                목표별 달성 현황
              </h3>
              <div className="space-y-4">
                {objectiveProgress.map((obj, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{obj.title}</span>
                      <span className="text-sm font-semibold text-blue-600">{obj.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                        style={{width: `${obj.progress}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 핵심 결과 상세 */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                핵심 결과 상세 현황
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plan.objectives.map((objective, objIndex) => (
                  <div key={objIndex} className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white border-b pb-2">
                      {objective.title}
                    </h4>
                    {objective.keyResults.map((kr, krIndex) => (
                      <div key={krIndex} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {kr.title}
                          </span>
                          {kr.measurementType === 'number' && (
                            <span className="text-sm text-blue-600 font-semibold">
                              {Math.round((kr.current / kr.target) * 100)}%
                            </span>
                          )}
                        </div>
                        {kr.measurementType === 'number' && (
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{width: `${Math.min((kr.current / kr.target) * 100, 100)}%`}}
                            ></div>
                          </div>
                        )}
                        {kr.measurementType === 'percentage' && (
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{width: `${Math.min((kr.current / kr.target) * 100, 100)}%`}}
                            ></div>
                          </div>
                        )}
                        {kr.measurementType === 'checklist' && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            완료: {kr.checklist.filter(item => item.completed).length} / {kr.checklist.length}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 주요 코멘트 요약 */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                주요 코멘트 요약
              </h3>
              <div className="space-y-3">
                {comments.slice(-3).map((comment, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{comment.text}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-gray-500 italic">등록된 코멘트가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 목표 모달 컴포넌트
  const ObjectiveModal = ({ isOpen, editingObj, onClose }) => {
    const isEditMode = !!editingObj;
    const [title, setTitle] = useState(editingObj?.title || "");

    // editingObj가 변경될 때마다 title 업데이트
    React.useEffect(() => {
      setTitle(editingObj?.title || "");
    }, [editingObj]);

    const handleSubmit = () => {
      if (!title.trim()) return;

      if (isEditMode) {
        // 목표 수정 로직
        setPlan((prev) => ({
          ...prev,
          objectives: prev.objectives.map((obj) =>
            obj.id === editingObj.id ? { ...obj, title } : obj
          ),
        }));
      } else {
        // 목표 추가 로직
        const newObjective = {
          id: Date.now(),
          title,
          keyResults: [],
          isActive: true, // 새 목표는 활성화 상태
        };
        setPlan((prev) => ({
          ...prev,
          objectives: [...prev.objectives, newObjective],
        }));
      }

      // 모달 닫기 및 상태 초기화
      onClose();
    };

    if (!isOpen) return null;

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
              onClick={onClose}
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
                <div className="flex items-center gap-3 mb-2">
                  {isEditMode ? (
                    <Input
                      value={editedPlan.title}
                      onChange={(e) => updateEditedPlan('title', e.target.value)}
                      className="text-2xl font-semibold border-2 border-blue-500"
                    />
                  ) : (
                    <CardTitle className="text-2xl">{plan.title}</CardTitle>
                  )}
                  <Badge className="bg-blue-500 hover:bg-blue-600">{plan.status}</Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {isEditMode ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={editedPlan.startDate}
                          onChange={(e) => updateEditedPlan('startDate', e.target.value)}
                          className="w-32 h-8 text-xs border border-blue-500"
                        />
                        <span>~</span>
                        <Input
                          type="date"
                          value={editedPlan.endDate}
                          onChange={(e) => updateEditedPlan('endDate', e.target.value)}
                          className="w-32 h-8 text-xs border border-blue-500"
                        />
                      </div>
                    ) : (
                      `${plan.startDate} ~ ${plan.endDate}`
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    담당자: {isEditMode ? (
                      <select
                        value={editedPlan.manager}
                        onChange={(e) => updateEditedPlan('manager', e.target.value)}
                        className="ml-1 px-2 py-1 border border-blue-500 rounded text-sm bg-white dark:bg-gray-700"
                      >
                        <option value="김마케팅">김마케팅</option>
                        <option value="이기획">이기획</option>
                        <option value="박전략">박전략</option>
                        <option value="최브랜드">최브랜드</option>
                      </select>
                    ) : plan.manager}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    진행률: {plan.progress}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button size="sm" variant="default" onClick={handleEditSave}>
                      <Save className="w-4 h-4 mr-1" />
                      저장
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleEditCancel}>
                      <X className="w-4 h-4 mr-1" />
                      취소
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={handleEditStart}>
                      <Edit className="w-4 h-4 mr-1" />
                      수정
                    </Button>
                    <Button size="sm" variant="outline" onClick={generateReport}>
                      <FileText className="w-4 h-4 mr-1" />
                      보고서
                    </Button>
                  </>
                )}
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
            {/* 계획 개요 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">설명</h3>
                {isEditMode ? (
                  <textarea
                    value={editedPlan.description}
```python
                    onChange={(e) => updateEditedPlan('description', e.target.value)}
                    className="w-full p-3 border-2 border-blue-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">타겟 고객</h3>
                {isEditMode ? (
                  <Input
                    value={editedPlan.targetPersona}
                    onChange={(e) => updateEditedPlan('targetPersona', e.target.value)}
                    className="border-2 border-blue-500"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{plan.targetPersona}</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">핵심 메시지</h3>
                {isEditMode ? (
                  <Input
                    value={editedPlan.coreMessage}
                    onChange={(e) => updateEditedPlan('coreMessage', e.target.value)}
                    className="border-2 border-blue-500"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{plan.coreMessage}</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">주요 채널</h3>
                {isEditMode ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {editedPlan.channels.map((channel, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                        >
                          {channel}
                          <button
                            onClick={() => removeChannel(channel)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="새 채널을 입력하고 Enter를 누르세요"
                      className="border-2 border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addChannel(e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {plan.channels.map((channel, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
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

            // 목표가 비활성화된 경우 렌더링하지 않음
            if (!objective.isActive) {
              return null;
            }

            return (
              <div key={objective.id || objIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                {/* Objective 헤더 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
목표 수정
                  

// 렌더링 함수들
  const renderObjectiveModal = () => {
    const isEditMode = !!editingObjective;
    const [title, setTitle] = useState(editingObjective?.title || "");

    // editingObj가 변경될 때마다 title 업데이트
    React.useEffect(() => {
      setTitle(editingObj?.title || "");
    }, [editingObj]);

    const handleSubmit = () => {
      if (!title.trim()) return;

      if (isEditMode) {
        // 목표 수정 로직
        setPlan((prev) => ({
          ...prev,
          objectives: prev.objectives.map((obj) =>
            obj.id === editingObj.id ? { ...obj, title } : obj
          ),
        }));
      } else {
        // 목표 추가 로직
        const newObjective = {
          id: Date.now(),
          title,
          keyResults: [],
          isActive: true, // 새 목표는 활성화 상태
        };
        setPlan((prev) => ({
          ...prev,
          objectives: [...prev.objectives, newObjective],
        }));
      }

      // 모달 닫기 및 상태 초기화
      onClose();
    };

    if (!isOpen) return null;

    return (
      
        
          
            {isEditMode ? "목표 수정" : "새 목표 추가"}
          
          
            목표 제목
          
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="목표를 입력하세요"
            className="mb-4"
          />
          
            
              취소
            
            <Button onClick={handleSubmit} disabled={!title.trim()}>
              {isEditMode ? "수정" : "추가"}
            </Button>
          
        
      
    );
  };

  // 삭제 확인 모달
  const renderDeleteModal = () => (
    
      
        
          목표 삭제 확인
        
        
          이 목표를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        
        
          
            취소
          
          <Button variant="destructive" onClick={handleDeleteObjective}>
            삭제
          </Button>
        
      
    
  );

  if (loading) {
    return (
      
        
      
    );
  }

  if (!plan) {
    return (
      
        계획을 찾을 수 없습니다.
      
    );
  }

  return (
    
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
                <div className="flex items-center gap-3 mb-2">
                  {isEditMode ? (
                    <Input
                      value={editedPlan.title}
                      onChange={(e) => updateEditedPlan('title', e.target.value)}
                      className="text-2xl font-semibold border-2 border-blue-500"
                    />
                  ) : (
                    <CardTitle className="text-2xl">{plan.title}</CardTitle>
                  )}
                  <Badge className="bg-blue-500 hover:bg-blue-600">{plan.status}</Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {isEditMode ? (
                      
                        <Input
                          type="date"
                          value={editedPlan.startDate}
                          onChange={(e) => updateEditedPlan('startDate', e.target.value)}
                          className="w-32 h-8 text-xs border border-blue-500"
                        />
                        <span>~</span>
                        <Input
                          type="date"
                          value={editedPlan.endDate}
                          onChange={(e) => updateEditedPlan('endDate', e.target.value)}
                          className="w-32 h-8 text-xs border border-blue-500"
                        />
                      
                    ) : (
                      `${plan.startDate} ~ ${plan.endDate}`
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    담당자: {isEditMode ? (
                      
                        김마케팅
                        이기획
                        박전략
                        최브랜드
                      
                    ) : plan.manager}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    진행률: {plan.progress}%
                  </span>
                </div>
              </div>
              
                {isEditMode ? (
                  
                    
                      저장
                    
                    
                      취소
                    
                  
                ) : (
                  
                    
                      수정
                    
                    
                      보고서
                    
                  
                )}
              
            
          

          {/* 전체 진행률 */}
          
            
              전체 진행률
              {plan.progress}%
            
            
              
            
          
        </CardHeader>
      </Card>

      {/* 계획 개요 */}
      {(plan.description || plan.targetPersona || plan.coreMessage) && (
        
          
            
              
              계획 개요
            
          
          
            {/* 계획 개요 */}
            
              
                
                  설명
                  {isEditMode ? (
                    
                      
                    
                  ) : (
                    
                      {plan.description}
                    
                  )}
                
                
                  타겟 고객
                  {isEditMode ? (
                    
                  ) : (
                    
                      {plan.targetPersona}
                    
                  )}
                
                
                  핵심 메시지
                  {isEditMode ? (
                    
                  ) : (
                    
                      {plan.coreMessage}
                    
                  )}
                
                
                  주요 채널
                  {isEditMode ? (
                    
                      
                        
                          {editedPlan.channels.map((channel, index) => (
                            
                              {channel}
                              
                            
                          ))}
                        
                        
                          새 채널을 입력하고 Enter를 누르세요
                        
                      
                    
                  ) : (
                    
                      {plan.channels.map((channel, index) => (
                        
                          {channel}
                        
                      ))}
                    
                  )}
                
              
            
          
        
      )}

      {/* 목표 설정 (OKRs) */}
      <Card>
        
          
            
              
              목표 설정 (OKRs)
            
            <Button 
              size="sm" 
              onClick={() => setShowObjectiveModal(true)}
              className="flex items-center gap-2"
            >
              
              목표 추가
            </Button>
          
        
        
          {plan.objectives?.map((objective, objIndex) => {
            const isExpanded = expandedObjectives[objective.id] || false;
            const objectiveProgress = calculateObjectiveProgress(objective.keyResults);

            // 목표가 비활성화된 경우 렌더링하지 않음
            if (!objective.isActive) {
              return null;
            }

            return (
              
                
                  
                    
                      
                        
                          
                          {isEditMode ? (
                            
                              onClick={(e) => updateObjective(objIndex, 'title', e.target.value)}
                              className="font-semibold text-lg border-2 border-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            
                              {objective.title}
                            
                          )}
                          {!isEditMode && (
                            isExpanded ? (
                              
                            ) : (
                              
                            )
                          )}
                        
                        
                          달성률:
                          {objectiveProgress}%
                        
                      
                      {!isEditMode && (
                        
                          
                            
                              
                            
                          
                          
                            
                              
                            
                          
                        
                      )}
                    
                  
                

                {/* Key Results */}
                {isExpanded && (
                  
                    
                      Key Results ({objective.keyResults.length}개)
                    

                    {objective.keyResults.map((kr, krIndex) => (
                      
                        
                          
                            {isEditMode ? (
                              
                                onClick={(e) => updateKeyResult(objIndex, krIndex, 'title', e.target.value)}
                                className="font-medium border-2 border-blue-500 flex-1 mr-2"
                              />
                            ) : (
                              
                                {kr.title}
                              
                            )}
                            {!isEditMode && (
                              
                                
                                  
                                
                                
                                  
                                
                              
                            )}
                          
                          {kr.measurementType === "number" && (
                              
                                
                                  
                                    현재: {isEditMode ? (
                                      
                                        onChange={(e) => updateKeyResult(objIndex, krIndex, 'current', parseInt(e.target.value) || 0)}
                                        className="w-20 h-8 text-xs border border-blue-500 ml-1"
                                      />
                                    ) : (kr.current?.toLocaleString() || 0)}
                                  
                                  
                                    목표: {kr.target?.toLocaleString() || 0}
                                  
                                
                                
                                  
                                
                                
                                  {Math.round((kr.current / kr.target) * 100)}% 달성
                                
                              
                            )}
                            {kr.measurementType === "checklist" && (
                              
                                
                                  {kr.checklist.map((item, itemIndex) => (
                                    
                                      
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={(e) => {
                                          if (isEditMode) {
                                            const updatedChecklist = [...editedPlan.objectives[objIndex].keyResults[krIndex].checklist];
                                            updatedChecklist[itemIndex].completed = e.target.checked;
                                            updateKeyResult(objIndex, krIndex, 'checklist', updatedChecklist);
                                          } else {
                                            const updatedPlan = { ...plan };
                                            updatedPlan.objectives[objIndex].keyResults[krIndex].checklist[itemIndex].completed = e.target.checked;
                                            setPlan(updatedPlan);
                                          }
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                      />
                                      {isEditMode ? (
                                        
                                          
                                            onChange={(e) => {
                                              const updatedChecklist = [...editedPlan.objectives[objIndex].keyResults[krIndex].checklist];
                                              updatedChecklist[itemIndex].text = e.target.value;
                                              updateKeyResult(objIndex, krIndex, 'checklist', updatedChecklist);
                                            }}
                                            className={`text-sm border border-blue-500 ${item.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
                                          />
                                          
                                            
                                              
                                                const updatedChecklist = editedPlan.objectives[objIndex].keyResults[krIndex].checklist.filter((_, i) => i !== itemIndex);
                                                updateKeyResult(objIndex, krIndex, 'checklist', updatedChecklist);
                                              
                                            
                                          
                                        
                                      ) : (
                                        
                                          {item.text}
                                        
                                      )}
                                    
                                  ))}
                                  {isEditMode && (
                                    
                                      
                                        
                                          const updatedChecklist = [...editedPlan.objectives[objIndex].keyResults[krIndex].checklist, { text: '', completed: false }];
                                          updateKeyResult(objIndex, krIndex, 'checklist', updatedChecklist);
                                        
                                      
                                      
                                      항목 추가
                                    
                                  )}
                                
                                
                                  {kr.checklist.filter(item => item.completed).length} / {kr.checklist.length} 완료
                                
                              
                            )}
                          
                        
                      
                    ))}
                  
                )}
              
            );
          })}
        
      </Card>

      {/* 코멘트 섹션 */}
      <Card>
        
          
            
              
              코멘트 ({comments.length})
            
          
        
        
          {/* 새 코멘트 입력 */}
          
            
              
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="코멘트를 작성하세요..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            
            
              
                
                  코멘트 추가
                
              
            
          

          {/* 코멘트 목록 */}
          
            {comments.map((comment) => (
              
                
                  
                    
                      
                        {comment.author}
                      
                      
                        {comment.createdAt}
                      
                    
                    
                      {comment.content}
                    
                  
                
              
            ))}
          
        
      </Card>

      {/* 모달들 */}
      
        onClose={() => {
          setShowObjectiveModal(false);
          setEditingObjective(null);
        }}
      />
      {renderDeleteModal()}
      {renderReportModal()}
    
  );
}