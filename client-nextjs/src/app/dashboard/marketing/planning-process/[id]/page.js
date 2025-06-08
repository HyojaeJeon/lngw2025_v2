"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Target,
  Users,
  Calendar,
  ArrowLeft,
  Edit,
  Save,
  MessageSquare,
  Clock,
  User,
  TrendingUp,
  ExternalLink,
  Link,
  BarChart3,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Circle,
  AlertCircle,
  Plus,
  Send,
  Activity,
  History,
  FileText,
  Eye,
  Settings,
  Zap,
  Globe,
  Star,
  ThumbsUp,
  Share2,
  MessageCircle,
  AtSign,
  MoreHorizontal,
  Database,
  Unlink,
  X,
  Trash2,
} from "lucide-react";

export default function MarketingPlanDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const planId = params.id;

  // 상태 관리
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [history, setHistory] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [showDataConnectionModal, setShowDataConnectionModal] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [selectedKR, setSelectedKR] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  useEffect(() => {
    // 실제 API 호출 대신 샘플 데이터 로드
    const samplePlan = {
      id: parseInt(planId),
      title: "2025년 1분기 마케팅 계획",
      status: "진행중",
      progress: 65,
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      manager: "김마케팅",
      description:
        "2025년 첫 분기를 위한 종합적인 마케팅 전략 수립 및 실행 계획",
      createdAt: "2025-01-15",
      updatedAt: "2025-06-08",
      objectives: [
        {
          id: 1,
          title: "Z세대 인지도 확보",
          keyResults: [
            {
              id: 1,
              text: "틱톡 팔로워 5만 달성",
              target: 50000,
              current: 40000,
              measurementType: "automatic", // automatic, manual, checklist
              dataConnected: true,
              dataSource: "인사이트 > TikTok 채널 > 팔로워 수",
              checklist: [],
            },
            {
              id: 2,
              text: "브랜드 인지도 20% 증가",
              target: 20,
              current: 13,
              measurementType: "manual",
              dataConnected: false,
              dataSource: null,
              checklist: [],
            },
            {
              id: 3,
              text: "UGC 콘텐츠 100건 수집",
              target: 10,
              current: 7,
              measurementType: "checklist",
              dataConnected: false,
              dataSource: null,
              checklist: [
                { id: 1, text: "인스타그램 인플루언서 A", completed: true },
                { id: 2, text: "틱톡 챌린지 이벤트", completed: true },
                { id: 3, text: "블로그 체험단 모집", completed: false },
                { id: 4, text: "유튜브 언박싱 영상", completed: true },
                { id: 5, text: "네이버 블로그 체험단", completed: true },
                { id: 6, text: "인스타그램 스토리 이벤트", completed: true },
                { id: 7, text: "트위터 해시태그 캠페인", completed: true },
                { id: 8, text: "페이스북 그룹 프로모션", completed: true },
                { id: 9, text: "카카오톡 플러스친구 이벤트", completed: false },
                { id: 10, text: "틱톡 댄스 챌린지", completed: false },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "온라인 매출 증대",
          keyResults: [
            {
              id: 4,
              text: "온라인 매출 30% 증가",
              target: 30,
              current: 18,
              measurementType: "manual",
              dataConnected: false,
              dataSource: null,
              checklist: [],
            },
            {
              id: 5,
              text: "전환율 3.5% 달성",
              target: 3.5,
              current: 2.8,
              measurementType: "automatic",
              dataConnected: true,
              dataSource: "인사이트 > 웹사이트 > 전환율",
              checklist: [],
            },
          ],
        },
      ],
      targetPersona: "20-30대 직장인",
      coreMessage: "일상을 더 스마트하게, 더 편리하게",
      channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
      initiatives: [
        {
          id: 1,
          name: "여름 바캉스 캠페인",
          status: "진행중",
          linkedToCampaign: true,
          campaignId: "camp1",
          campaignName: "2025 여름 프로모션",
          performance: {
            reach: "1.2M",
            engagement: "85K",
            cost: "₩3,000,000",
          },
        },
        {
          id: 2,
          name: "대학생 앰배서더 운영",
          status: "진행중",
          linkedToCampaign: false,
          campaignId: null,
          campaignName: null,
          performance: {
            reach: "850K",
            engagement: "42K",
            cost: "₩1,500,000",
          },
        },
        {
          id: 3,
          name: "인플루언서 협업 프로젝트",
          status: "완료",
          linkedToCampaign: true,
          campaignId: "camp2",
          campaignName: "인플루언서 콜라보 캠페인",
          performance: {
            reach: "2.1M",
            engagement: "156K",
            cost: "₩5,000,000",
          },
        },
      ],
    };

    // 샘플 댓글 데이터
    const sampleComments = [
      {
        id: 1,
        user: "김마케팅",
        avatar: "KM",
        comment:
          "1분기 목표 달성을 위해 틱톡 콘텐츠 제작을 더 적극적으로 진행해야겠습니다.",
        timestamp: "2025-06-08 14:30",
        mentions: [],
      },
      {
        id: 2,
        user: "이기획",
        avatar: "LG",
        comment:
          "@김마케팅 동의합니다! 특히 Z세대 타겟팅 콘텐츠에 집중하면 좋을 것 같아요.",
        timestamp: "2025-06-08 15:15",
        mentions: ["김마케팅"],
      },
    ];

    // 샘플 히스토리 데이터
    const sampleHistory = [
      {
        id: 1,
        action: "상태 변경",
        user: "김마케팅",
        detail: "계획됨 → 진행중",
        timestamp: "2025-06-08 09:00",
      },
      {
        id: 2,
        action: "목표 수정",
        user: "김마케팅",
        detail: "틱톡 팔로워 목표를 4만에서 5만으로 증가",
        timestamp: "2025-06-07 16:30",
      },
      {
        id: 3,
        action: "활동 추가",
        user: "이기획",
        detail: "대학생 앰배서더 운영 활동 추가",
        timestamp: "2025-06-06 11:20",
      },
    ];

    setTimeout(() => {
      setPlan(samplePlan);
      setComments(sampleComments);
      setHistory(sampleHistory);
      setLoading(false);
    }, 500);
  }, [planId]);

  // 상태별 배지 색상
  const getStatusBadge = (status) => {
    switch (status) {
      case "진행중":
        return <Badge className="bg-blue-500 hover:bg-blue-600">진행중</Badge>;
      case "계획됨":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">계획됨</Badge>
        );
      case "완료":
        return <Badge className="bg-green-500 hover:bg-green-600">완료</Badge>;
      case "보류":
        return <Badge className="bg-gray-500 hover:bg-gray-600">보류</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 상태 변경 핸들러
  const handleStatusChange = (newStatus) => {
    setPlan((prev) => ({ ...prev, status: newStatus }));
    setShowStatusDropdown(false);

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "상태 변경",
      user: "현재 사용자",
      detail: `${plan.status} → ${newStatus}`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 인라인 편집 시작
  const startEditing = (
    field,
    currentValue,
    objectiveId = null,
    krId = null,
  ) => {
    setEditingField({ field, objectiveId, krId });
    setEditingValue(currentValue);
  };

  // 인라인 편집 저장
  const saveEdit = () => {
    if (!editingField) return;

    const { field, objectiveId, krId } = editingField;

    setPlan((prev) => {
      const newPlan = { ...prev };

      if (field === "targetPersona" || field === "coreMessage") {
        newPlan[field] = editingValue;
      } else if (field === "objectiveTitle") {
        const objIndex = newPlan.objectives.findIndex(
          (obj) => obj.id === objectiveId,
        );
        if (objIndex !== -1) {
          newPlan.objectives[objIndex].title = editingValue;
        }
      } else if (field === "krText" || field === "krTarget") {
        const objIndex = newPlan.objectives.findIndex(
          (obj) => obj.id === objectiveId,
        );
        if (objIndex !== -1) {
          const krIndex = newPlan.objectives[objIndex].keyResults.findIndex(
            (kr) => kr.id === krId,
          );
          if (krIndex !== -1) {
            if (field === "krText") {
              newPlan.objectives[objIndex].keyResults[krIndex].text =
                editingValue;
            } else {
              newPlan.objectives[objIndex].keyResults[krIndex].target =
                parseFloat(editingValue);
            }
          }
        }
      }

      return newPlan;
    });

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "내용 수정",
      user: "현재 사용자",
      detail: `${field} 수정됨`,
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);

    setEditingField(null);
    setEditingValue("");
  };

  // 편집 취소
  const cancelEdit = () => {
    setEditingField(null);
    setEditingValue("");
  };

  // 새 목표 추가
  const addObjective = () => {
    const newObjective = {
      id: Date.now(),
      title: "새 목표",
      keyResults: [
        {
          id: Date.now() + 1,
          text: "새 핵심 결과",
          target: 0,
          current: 0,
          dataConnected: false,
          dataSource: null,
          measurementType: "automatic",
          checklist: [],
        },
      ],
    };

    setPlan((prev) => ({
      ...prev,
      objectives: [...prev.objectives, newObjective],
    }));

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "목표 추가",
      user: "현재 사용자",
      detail: "새 목표가 추가됨",
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 새 KR 추가
  const addKeyResult = (objectiveId) => {
    const newKR = {
      id: Date.now(),
      text: "새 핵심 결과",
      target: 0,
      current: 0,
      dataConnected: false,
      dataSource: null,
      measurementType: "automatic",
      checklist: [],
    };

    setPlan((prev) => ({
      ...prev,
      objectives: prev.objectives.map((obj) =>
        obj.id === objectiveId
          ? { ...obj, keyResults: [...obj.keyResults, newKR] }
          : obj,
      ),
    }));

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "핵심 결과 추가",
      user: "현재 사용자",
      detail: "새 핵심 결과가 추가됨",
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 새 활동 추가
  const addInitiative = () => {
    const newInitiative = {
      id: Date.now(),
      name: "새 활동",
      status: "계획됨",
      linkedToCampaign: false,
      campaignId: null,
      campaignName: null,
      performance: {
        reach: "0",
        engagement: "0",
        cost: "₩0",
      },
    };

    setPlan((prev) => ({
      ...prev,
      initiatives: [...prev.initiatives, newInitiative],
    }));

    // 히스토리에 기록 추가
    const newHistoryItem = {
      id: history.length + 1,
      action: "활동 추가",
      user: "현재 사용자",
      detail: "새 활동이 추가됨",
      timestamp: new Date().toLocaleString("ko-KR"),
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  // 댓글 추가
  const addComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      user: "현재 사용자",
      avatar: "CU",
      comment: newComment,
      timestamp: new Date().toLocaleString("ko-KR"),
      mentions: [],
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  // 데이터 연결 모달
  const DataConnectionModal = () => {
    if (!showDataConnectionModal || !selectedKR) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">데이터 연결 설정</h3>
              <Button
                variant="outline"
                onClick={() => setShowDataConnectionModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-medium mb-2">연결할 핵심 결과</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedKR.text}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  데이터 소스 선택
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                  <option value="">데이터 소스를 선택하세요</option>
                  <option value="insight_tiktok_followers">
                    인사이트 &gt; TikTok 채널 &gt; 팔로워 수
                  </option>
                  <option value="insight_instagram_followers">
                    인사이트 &gt; Instagram &gt; 팔로워 수
                  </option>
                  <option value="insight_website_conversion">
                    인사이트 &gt; 웹사이트 &gt; 전환율
                  </option>
                  <option value="engagement_ugc">
                    참여도 관리 &gt; UGC 수집
                  </option>
                  <option value="manual">수동 입력</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  현재 값
                </label>
                <Input
                  type="number"
                  value={selectedKR.current}
                  placeholder="현재 달성 값을 입력하세요"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDataConnectionModal(false)}
            >
              취소
            </Button>
            <Button onClick={() => setShowDataConnectionModal(false)}>
              연결 저장
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 측정 방식 설정 모달
  const MeasurementModal = () => {
    if (!showMeasurementModal || !selectedKR) return null;

    const handleMeasurementTypeChange = (type) => {
      setPlan((prev) => {
        const newPlan = { ...prev };
        newPlan.objectives = newPlan.objectives.map((obj) => {
          obj.keyResults = obj.keyResults.map((kr) => {
            if (kr.id === selectedKR.id) {
              kr.measurementType = type;
            }
            return kr;
          });
          return obj;
        });
        return newPlan;
      });
      setShowMeasurementModal(false);
    };

    const handleInputChange = (e) => {
      setPlan((prev) => {
        const newPlan = { ...prev };
        newPlan.objectives = newPlan.objectives.map((obj) => {
          obj.keyResults = obj.keyResults.map((kr) => {
            if (kr.id === selectedKR.id) {
              kr.current = parseFloat(e.target.value);
            }
            return kr;
          });
          return obj;
        });
        return newPlan;
      });
    };

    const handleChecklistItemAdd = () => {
      if (!newChecklistItem.trim()) return;

      const newItem = {
        id: Date.now(),
        text: newChecklistItem,
        completed: false,
      };

      setPlan((prev) => {
        const newPlan = { ...prev };
        newPlan.objectives = newPlan.objectives.map((obj) => {
          obj.keyResults = obj.keyResults.map((kr) => {
            if (kr.id === selectedKR.id) {
              kr.checklist = [...kr.checklist, newItem];
            }
            return kr;
          });
          return obj;
        });
        return newPlan;
      });

      setNewChecklistItem("");
    };

    const handleChecklistItemToggle = (itemId) => {
      setPlan((prev) => {
        const newPlan = { ...prev };
        newPlan.objectives = newPlan.objectives.map((obj) => {
          obj.keyResults = obj.keyResults.map((kr) => {
            if (kr.id === selectedKR.id) {
              kr.checklist = kr.checklist.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item,
              );
            }
            return kr;
          });
          return obj;
        });
        return newPlan;
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">성과 측정 방식 설정</h3>
              <Button
                variant="outline"
                onClick={() => setShowMeasurementModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-medium mb-2">핵심 결과</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedKR.text}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                이 핵심 결과(KR)의 달성도를 어떻게 측정하시겠습니까?
              </h4>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleMeasurementTypeChange("automatic")}
                >
                  <span className="flex-1 text-left">
                    자동 데이터 연결 (권장)
                  </span>
                  <TrendingUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleMeasurementTypeChange("manual")}
                >
                  <span className="flex-1 text-left">직접 수동 입력</span>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleMeasurementTypeChange("checklist")}
                >
                  <span className="flex-1 text-left">체크리스트 달성</span>
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {selectedKR.measurementType === "manual" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    현재 값
                  </label>
                  <Input
                    type="number"
                    value={selectedKR.current}
                    onChange={handleInputChange}
                    placeholder="현재 달성 값을 입력하세요"
                  />
                </div>
              </div>
            )}

            {selectedKR.measurementType === "checklist" && (
              <div className="space-y-4">
                <ul className="space-y-2">
                  {selectedKR.checklist.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={item.completed}
                          onChange={() => handleChecklistItemToggle(item.id)}
                        />
                        {item.text}
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="새 체크리스트 항목 추가"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                  />
                  <Button size="sm" onClick={handleChecklistItemAdd}>
                    추가
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowMeasurementModal(false)}
            >
              취소
            </Button>
            <Button onClick={() => setShowMeasurementModal(false)}>
              설정 저장
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 계획 수정 모달
  const EditPlanModal = () => {
    if (!showEditModal || !plan) return null;

    const [editForm, setEditForm] = useState({
      title: plan.title,
      manager: plan.manager,
      startDate: plan.startDate,
      endDate: plan.endDate,
      description: plan.description,
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">계획 정보 수정</h3>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">계획명</label>
              <Input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">담당자</label>
              <select
                value={editForm.manager}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, manager: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                <option value="김마케팅">김마케팅</option>
                <option value="이기획">이기획</option>
                <option value="박전략">박전략</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">시작일</label>
                <Input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">종료일</label>
                <Input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">설명</label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 resize-none"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                setPlan((prev) => ({ ...prev, ...editForm }));
                setShowEditModal(false);
              }}
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 편집 모달 렌더링 함수
  const renderEditModal = () => {
    return <EditPlanModal />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            계획을 찾을 수 없습니다
          </h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 animate-fadeIn">
      {/* 헤더 영역 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {plan.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-gray-600 dark:text-gray-400">
                  담당자: {plan.manager}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  기간: {plan.startDate} ~ {plan.endDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 상태 변경 드롭다운 */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2"
              >
                {getStatusBadge(plan.status)}
                <ChevronDown className="w-4 h-4" />
              </Button>

              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {["계획됨", "진행중", "완료", "보류"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* 편집 버튼 */}
            ```python
            <Button variant="outline" onClick={() => setShowEditModal(true)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              전체 진행률
            </span>
            <span className="font-medium">{plan.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${plan.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 */}
        <div className="xl:col-span-2 space-y-6">
          {/* 목표 달성도 (OKRs) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                목표 달성도 (OKRs)
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addObjective}
                  className="ml-auto flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  목표 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {plan.objectives.map((objective) => (
                <div
                  key={objective.id}
                  className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    {editingField?.field === "objectiveTitle" &&
                    editingField?.objectiveId === objective.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button size="sm" onClick={saveEdit}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <h4
                        className="font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded"
                        onClick={() =>
                          startEditing(
                            "objectiveTitle",
                            objective.title,
                            objective.id,
                          )
                        }
                      >
                        Objective: {objective.title}
                      </h4>
                    )}

                    <div className="text-sm text-gray-500">
                      달성률:{" "}
                      {Math.round(
                        objective.keyResults.reduce(
                          (acc, kr) => acc + (kr.current / kr.target) * 100,
                          0,
                        ) / objective.keyResults.length,
                      )}
                      %
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Key Results:
                    </p>
                    {objective.keyResults.map((kr) => (
                      <div
                        key={kr.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          {editingField?.field === "krText" &&
                          editingField?.krId === kr.id ? (
                            <div className="flex items-center gap-2 mb-2">
                              <Input
                                value={editingValue}
                                onChange={(e) =>
                                  setEditingValue(e.target.value)
                                }
                                className="flex-1"
                                autoFocus
                              />
                              <Button size="sm" onClick={saveEdit}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <h5
                              className="font-medium text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded mb-2"
                              onClick={() =>
                                startEditing(
                                  "krText",
                                  kr.text,
                                  objective.id,
                                  kr.id,
                                )
                              }
                            >
                              {kr.text}
                            </h5>
                          )}

                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              진행률:{" "}
                              {Math.round((kr.current / kr.target) * 100)}%
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              ({kr.current.toLocaleString()} /
                              {editingField?.field === "krTarget" &&
                              editingField?.krId === kr.id ? (
                                <span className="inline-flex items-center gap-1 ml-1">
                                  <Input
                                    type="number"
                                    value={editingValue}
                                    onChange={(e) =>
                                      setEditingValue(e.target.value)
                                    }
                                    className="w-20 h-6 text-xs"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    onClick={saveEdit}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Save className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEdit}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </span>
                              ) : (
                                <span
                                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 rounded ml-1"
                                  onClick={() =>
                                    startEditing(
                                      "krTarget",
                                      kr.target.toString(),
                                      objective.id,
                                      kr.id,
                                    )
                                  }
                                >
                                  {kr.target.toLocaleString()}
                                </span>
                              )}
                              )
                            </span>
                          </div>
                          {kr.measurementType === "checklist" && (
                            <ul className="mt-2 space-y-1">
                              {kr.checklist.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => {
                                      setPlan((prev) => {
                                        const newPlan = { ...prev };
                                        newPlan.objectives =
                                          newPlan.objectives.map((obj) => {
                                            obj.keyResults = obj.keyResults.map(
                                              (k) => {
                                                if (k.id === kr.id) {
                                                  k.checklist = k.checklist.map(
                                                    (i) =>
                                                      i.id === item.id
                                                        ? {
                                                            ...i,
                                                            completed:
                                                              !i.completed,
                                                          }
                                                        : i,
                                                  );
                                                }
                                                return k;
                                              },
                                            );
                                            return obj;
                                          });
                                        return newPlan;
                                      });
                                    }}
                                  />
                                  <span>{item.text}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (kr.current / kr.target) * 100,
                                  100,
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {kr.measurementType === "automatic" &&
                          kr.dataConnected ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedKR(kr);
                                setShowDataConnectionModal(true);
                              }}
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              📈 연결됨
                            </Button>
                          ) : kr.measurementType === "manual" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedKR(kr);
                                setShowMeasurementModal(true);
                              }}
                              className="text-xs bg-green-50 text-green-700 border-green-200"
                            >
                              ✍️ 수동 입력
                            </Button>
                          ) : kr.measurementType === "checklist" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedKR(kr);
                                setShowMeasurementModal(true);
                              }}
                              className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                            >
                              ✔️ 체크리스트
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedKR(kr);
                                setShowMeasurementModal(true);
                              }}
                              className="text-xs"
                            >
                              ⚙️ 성과 측정 방식 설정
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addKeyResult(objective.id)}
                      className="w-full flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      핵심 결과(KR) 추가
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 전략 개요 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                전략 개요
                <Button size="sm" variant="outline" className="ml-auto">
                  <Edit className="w-4 h-4" />
                  편집
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    타겟 고객
                  </h4>
                  {editingField?.field === "targetPersona" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p
                      className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() =>
                        startEditing("targetPersona", plan.targetPersona)
                      }
                    >
                      {plan.targetPersona}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    핵심 메시지
                  </h4>
                  {editingField?.field === "coreMessage" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p
                      className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() =>
                        startEditing("coreMessage", plan.coreMessage)
                      }
                    >
                      {plan.coreMessage}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    주요 채널
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.channels.map((channel, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-orange-50 text-orange-700 border-orange-200"
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 주요 활동 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                주요 활동
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addInitiative}
                  className="ml-auto flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  활동 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.initiatives.map((initiative) => (
                <div
                  key={initiative.id}
                  className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {initiative.name}
                      </h4>
                      {getStatusBadge(initiative.status)}
                      {initiative.linkedToCampaign && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          캠페인연동
                        </Badge>
                      )}
                    </div>

                    <div className="relative">
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">도달:</span>
                      <span className="ml-2 font-medium">
                        {initiative.performance.reach}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">반응:</span>
                      <span className="ml-2 font-medium">
                        {initiative.performance.engagement}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">비용:</span>
                      <span className="ml-2 font-medium">
                        {initiative.performance.cost}
                      </span>
                    </div>
                  </div>

                  {initiative.linkedToCampaign && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          연결된 캠페인: {initiative.campaignName}
                        </span>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 댓글 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                댓글
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.user}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-sm"
                />
                <Button onClick={addComment} size="sm" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  댓글 등록
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 히스토리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-orange-500" />
                히스토리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-2 border-gray-200 dark:border-gray-700 pl-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{item.action}</span>
                      <span className="text-xs text-gray-500">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.user}: {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 모달들 */}
      {renderEditModal()}
      <MeasurementModal />
      <DataConnectionModal />
    </div>
  );
}
