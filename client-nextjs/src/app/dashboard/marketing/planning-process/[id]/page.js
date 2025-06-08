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
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Target,
  Users,
  MessageSquare,
  Globe,
  Calendar,
  CheckCircle,
  Circle,
  BarChart3,
  TrendingUp,
  FileText,
  Star,
  Clock,
  User,
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState({});
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [expandedObjectives, setExpandedObjectives] = useState({});
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);

  // 샘플 데이터
  useEffect(() => {
    const samplePlan = {
      id: parseInt(planId),
      title: "2025년 1분기 마케팅 계획",
      status: "진행중",
      progress: 65,
      createdAt: "2025-01-15",
      updatedAt: "2025-06-08",
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      manager: "김마케팅",
      description: "Z세대를 타겟으로 한 브랜드 인지도 향상 및 온라인 매출 증대를 목표로 하는 1분기 마케팅 계획입니다.",
      targetPersona: "20-30대 직장인",
      coreMessage: "일상을 더 스마트하게, 더 편리하게",
      channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
      objectives: [
        {
          id: 1,
          title: "Z세대 인지도 확보",
          progress: 63,
          confidence: "On Track",
          isActive: true,
          keyResults: [
            {
              id: 1,
              title: "틱톡 팔로워 증가",
              target: 50000,
              current: 32000,
              unit: "명",
              type: "number",
              isActive: true
            },
            {
              id: 2,
              title: "브랜드 인지도 향상",
              target: 20,
              current: 12,
              unit: "%",
              type: "percentage",
              isActive: true
            },
            {
              id: 3,
              title: "UGC 콘텐츠 수집",
              target: 100,
              current: 75,
              unit: "건",
              type: "number",
              isActive: true
            }
          ]
        },
        {
          id: 2,
          title: "온라인 매출 증대",
          progress: 45,
          confidence: "At Risk",
          isActive: true,
          keyResults: [
            {
              id: 4,
              title: "온라인 매출 증가",
              target: 30,
              current: 18,
              unit: "%",
              type: "percentage",
              isActive: true
            },
            {
              id: 5,
              title: "전환율 달성",
              target: 3.5,
              current: 2.8,
              unit: "%",
              type: "percentage",
              isActive: true
            }
          ]
        }
      ],
      initiatives: [
        { name: "여름 바캉스 캠페인", status: "계획됨", linkedToCampaign: true },
        { name: "대학생 앰배서더 운영", status: "진행중", linkedToCampaign: false },
        { name: "인플루언서 협업 프로젝트", status: "완료", linkedToCampaign: true }
      ]
    };

    setPlan(samplePlan);
    setObjectives(samplePlan.objectives);
    setEditedPlan(samplePlan);
    setComments([
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
      ]);
    setHistory([
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
      ]);
      const expanded = {};
      samplePlan.objectives.forEach(obj => {
        expanded[obj.id] = true;
      });
      setExpandedObjectives(expanded);
  }, [planId]);

  // 계획 정보 업데이트
  const updateEditedPlan = (field, value) => {
    setEditedPlan(prev => ({ ...prev, [field]: value }));
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditedPlan({ ...plan });
    }
  };

  // 변경사항 저장
  const saveChanges = () => {
    setPlan(editedPlan);
    setIsEditMode(false);
    // 실제로는 여기서 API 호출
  };

  // 변경사항 취소
  const cancelEdit = () => {
    setEditedPlan({ ...plan });
    setIsEditMode(false);
  };

  // 목표 확장/축소
  const toggleObjectiveExpansion = (objectiveId) => {
    setExpandedObjectives(prev => ({
      ...prev,
      [objectiveId]: !prev[objectiveId]
    }));
  };

    // 진행률 계산
    const calculateObjectiveProgress = (objective) => {
      const validResults = objective.keyResults.filter(kr => 
        kr.isActive && 
        kr.target !== null && 
        !isNaN(kr.target)
      );

      if (validResults.length === 0) return 0;

      const totalProgress = validResults.reduce((sum, kr) => {
        const progress = Math.min((kr.current / kr.target) * 100, 100);
        return sum + progress;
      }, 0);

      return Math.round(totalProgress / validResults.length);
    };

  // 신뢰도 레벨에 따른 색상
  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case "On Track":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
      case "At Risk":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
      case "Off Track":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // 목표 추가
  const addObjective = () => {
    setEditingObjective(null);
    setShowObjectiveModal(true);
  };

  // 목표 수정
  const editObjective = (objective) => {
    setEditingObjective(objective);
    setShowObjectiveModal(true);
  };

    // 목표 삭제 (비활성화)
  const deleteObjective = (objectiveId) => {
    setObjectives(prev => 
      prev.map(obj => 
        obj.id === objectiveId 
          ? { ...obj, isActive: false }
          : obj
      )
    );
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

  if (!plan) {
    return (
      <div className="w-full max-w-none space-y-6 animate-fadeIn">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
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
                  className="text-2xl font-bold border-2 border-blue-500"
                />
              ) : (
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
              )}

              <div className="flex items-center gap-4 mt-3">
                <Badge className={plan.status === "진행중" ? "bg-blue-500" : "bg-gray-500"}>
                  {plan.status}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  진행률: {plan.progress}%
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  담당자: {plan.manager}
                </span>
              </div>

              {/* 진행률 바 */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${plan.progress}%`}}
                ></div>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditMode ? (
                <>
                  <Button onClick={saveChanges} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button onClick={cancelEdit} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                </>
              ) : (
                <Button onClick={toggleEditMode} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 계획 설명 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">계획 설명</h3>
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
                <MessageSquare className="w-5 h-5 text-green-500" />
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
              <Globe className="w-5 h-5 text-orange-500" />
              주요 채널
            </h3>
            <div className="flex flex-wrap gap-2">
              {plan.channels.map((channel, index) => (
                <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300">
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 목표 설정 (OKRs) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              목표 설정 (OKRs)
            </CardTitle>
            <Button onClick={addObjective} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              새 목표 추가
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {objectives.filter(obj => obj.isActive).map((objective) => (
            <div key={objective.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {objective.title}
                  </h4>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(objective.confidence)}`}>
                      {objective.confidence}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      진행률: {calculateObjectiveProgress(objective)}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleObjectiveExpansion(objective.id)}
                  >
                    {expandedObjectives[objective.id] ? "축소" : "확장"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => editObjective(objective)}
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

              {/* 진행률 바 */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${calculateObjectiveProgress(objective)}%`}}
                ></div>
              </div>

              {/* Key Results */}
              {expandedObjectives[objective.id] && (
                <div className="space-y-3 mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    핵심 결과 (Key Results)
                  </h5>
                  {objective.keyResults.filter(kr => kr.isActive).map((kr) => (
                    <div key={kr.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {kr.title}
                        </span>
                        <div className="mt-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{width: `${Math.min((kr.current / kr.target) * 100, 100)}%`}}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {kr.current.toLocaleString()}/{kr.target.toLocaleString()}{kr.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 주요 활동 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            주요 활동
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {plan.initiatives.map((initiative, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {initiative.name}
                  </span>
                  <Badge variant={initiative.status === "진행중" ? "default" : "outline"}>
                    {initiative.status}
                  </Badge>
                  {initiative.linkedToCampaign && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
                      캠페인연동
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
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

      {/* 목표 모달 */}
      {showObjectiveModal && (
        <ObjectiveModal 
          editingObjective={editingObjective}
          objectives={objectives}
          setObjectives={setObjectives}
          onClose={() => {
            setShowObjectiveModal(false);
            setEditingObjective(null);
          }}
        />
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
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
              <Button variant="destructive" onClick={() => { deleteObjective(objectiveToDelete)}}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ObjectiveModal 컴포넌트
function ObjectiveModal({ editingObjective, objectives, setObjectives, onClose }) {
  const [title, setTitle] = useState(editingObjective?.title || "");
  const [keyResults, setKeyResults] = useState(editingObjective?.keyResults || []);

  useEffect(() => {
    setTitle(editingObjective?.title || "");
    setKeyResults(editingObjective?.keyResults || []);
  }, [editingObjective]);

  const addKeyResult = () => {
    setKeyResults(prev => [...prev, { id: Date.now(), title: "", target: 0, current: 0, unit: "", type: "number", isActive: true }]);
  };

  const updateKeyResult = (id, field, value) => {
    setKeyResults(prev =>
      prev.map(kr =>
        kr.id === id ? { ...kr, [field]: value } : kr
      )
    );
  };

  const deleteKeyResult = (id) => {
    setKeyResults(prev => prev.filter(kr => kr.id !== id));
  };

  const saveObjective = () => {
    if (editingObjective) {
      // 목표 수정
      setObjectives(prev =>
        prev.map(obj =>
          obj.id === editingObjective.id ? { ...obj, title, keyResults } : obj
        )
      );
    } else {
      // 새 목표 추가
      const newObjective = {
        id: Date.now(),
        title,
        progress: 0,
        confidence: "On Track",
        isActive: true,
        keyResults
      };
      setObjectives(prev => [...prev, newObjective]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {editingObjective ? "목표 수정" : "새 목표 추가"}
        </h3>
        <Input
          placeholder="목표를 입력하세요"
          className="mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <h4 className="text-md font-semibold mb-2">핵심 결과</h4>
        {keyResults.map((kr) => (
          <div key={kr.id} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Input
              placeholder="핵심 결과 제목"
              className="mb-2"
              value={kr.title}
              onChange={(e) => updateKeyResult(kr.id, "title", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="목표 수치"
                type="number"
                value={kr.target}
                onChange={(e) => updateKeyResult(kr.id, "target", parseFloat(e.target.value))}
              />
              <Input
                placeholder="현재 수치"
                type="number"
                value={kr.current}
                onChange={(e) => updateKeyResult(kr.id, "current", parseFloat(e.target.value))}
              />
            </div>
            <Input
              placeholder="단위"
              className="mt-2"
              value={kr.unit}
              onChange={(e) => updateKeyResult(kr.id, "unit", e.target.value)}
            />
            <Button variant="destructive" size="sm" className="mt-2" onClick={() => deleteKeyResult(kr.id)}>
              삭제
            </Button>
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addKeyResult}>
          핵심 결과 추가
        </Button>

        <div className="flex gap-3 mt-4">
          <Button onClick={onClose}>취소</Button>
          <Button onClick={saveObjective}>저장</Button>
        </div>
      </div>
    </div>
  );
}