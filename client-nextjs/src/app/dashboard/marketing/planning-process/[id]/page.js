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
import { Label } from "@/components/ui/label.js";
import { useLanguage } from "@/contexts/languageContext.js";
import {
  ArrowLeft,
  Target,
  Calendar,
  User,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Activity,
  Users,
  MessageSquare,
  Clock,
  Zap,
  Award,
  RefreshCw,
  CalendarDays,
  UserCheck,
  Globe,
} from "lucide-react";

export default function MarketingPlanDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const planId = params.id;

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showResponsibleDropdown, setShowResponsibleDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  // 사용자 목록 상태
  const [users, setUsers] = useState([]);

  // 계획 데이터 (실제로는 API에서 가져와야 함)
  const [planData, setPlanData] = useState({
    id: 1,
    title: "2025년 1분기 마케팅 계획",
    status: "진행중",
    progress: 65,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    responsible: {
      id: 1,
      name: "김마케팅",
      email: "kim@company.com",
      avatar: null,
    },
    teamMembers: [
      { id: 2, name: "이기획", email: "lee@company.com", avatar: null },
      { id: 3, name: "박전략", email: "park@company.com", avatar: null },
    ],
    targetPersona: "20-30대 직장인",
    coreMessage: "일상을 더 스마트하게, 더 편리하게",
    description:
      "2025년 첫 분기 마케팅 전략으로 Z세대 타겟 인지도 확보와 온라인 매출 증대를 목표로 합니다.",
    objectives: [
      {
        id: 1,
        title: "Z세대 인지도 확보",
        keyResults: [
          {
            id: 1,
            description: "틱톡 팔로워 5만 달성",
            target: "50,000명",
            current: 32000,
            progress: 64,
          },
          {
            id: 2,
            description: "브랜드 인지도 증가",
            target: "20%",
            current: 12,
            progress: 60,
          },
          {
            id: 3,
            description: "UGC 콘텐츠 수집",
            target: "100건",
            current: 65,
            progress: 65,
          },
        ],
      },
      {
        id: 2,
        title: "온라인 매출 증대",
        keyResults: [
          {
            id: 4,
            description: "온라인 매출 증가",
            target: "30%",
            current: 18,
            progress: 60,
          },
          {
            id: 5,
            description: "전환율 달성",
            target: "3.5%",
            current: 2.8,
            progress: 80,
          },
          {
            id: 6,
            description: "고객 생애가치 향상",
            target: "25%",
            current: 15,
            progress: 60,
          },
        ],
      },
    ],
    channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
    initiatives: [
      {
        id: 1,
        name: "여름 바캉스 캠페인",
        status: "계획됨",
        linkedToCampaign: true,
        progress: 25,
        startDate: "2025-06-01",
        endDate: "2025-08-31",
      },
      {
        id: 2,
        name: "대학생 앰배서더 운영",
        status: "진행중",
        linkedToCampaign: false,
        progress: 70,
        startDate: "2025-03-01",
        endDate: "2025-12-31",
      },
      {
        id: 3,
        name: "인플루언서 협업 프로젝트",
        status: "완료",
        linkedToCampaign: true,
        progress: 100,
        startDate: "2025-01-15",
        endDate: "2025-03-15",
      },
    ],
    createdAt: "2025-01-15",
    updatedAt: "2025-06-08",
  });

  // 편집용 임시 데이터
  const [editData, setEditData] = useState({});

  // 컴포넌트 마운트 시 사용자 목록 로드
  useEffect(() => {
    loadUsers();
  }, []);

  // 편집 모드 시작
  const handleEditStart = () => {
    setEditData({
      title: planData.title,
      startDate: planData.startDate,
      endDate: planData.endDate,
      responsible: planData.responsible,
      teamMembers: [...planData.teamMembers],
      targetPersona: planData.targetPersona,
      coreMessage: planData.coreMessage,
      description: planData.description,
    });
    setIsEditing(true);
  };

  // 편집 취소
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData({});
    setShowResponsibleDropdown(false);
    setShowTeamDropdown(false);
  };

  // 편집 저장
  const handleEditSave = async () => {
    try {
      // API 호출하여 업데이트
      // await updatePlan(planId, editData);

      // 로컬 상태 업데이트
      setPlanData((prev) => ({
        ...prev,
        ...editData,
        updatedAt: new Date().toISOString().split("T")[0],
      }));

      setIsEditing(false);
      setEditData({});
      alert("계획이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("업데이트 실패:", error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  // 사용자 목록 로드
  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // 실제로는 API 호출
      // const response = await fetch('/api/users');
      // const userData = await response.json();

      // 임시 데이터
      const userData = [
        {
          id: 1,
          name: "김마케팅",
          email: "kim@company.com",
          department: "마케팅팀",
          position: "팀장",
          avatar: null,
        },
        {
          id: 2,
          name: "이기획",
          email: "lee@company.com",
          department: "마케팅팀",
          position: "선임",
          avatar: null,
        },
        {
          id: 3,
          name: "박전략",
          email: "park@company.com",
          department: "마케팅팀",
          position: "주임",
          avatar: null,
        },
        {
          id: 4,
          name: "최브랜드",
          email: "choi@company.com",
          department: "마케팅팀",
          position: "사원",
          avatar: null,
        },
        {
          id: 5,
          name: "정콘텐츠",
          email: "jung@company.com",
          department: "크리에이티브팀",
          position: "선임",
          avatar: null,
        },
        {
          id: 6,
          name: "한디자인",
          email: "han@company.com",
          department: "크리에이티브팀",
          position: "주임",
          avatar: null,
        },
      ];

      setUsers(userData);
    } catch (error) {
      console.error("사용자 목록 로드 실패:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 책임 담당자 선택
  const handleResponsibleSelect = (user) => {
    setEditData((prev) => ({
      ...prev,
      responsible: user,
    }));
    setShowResponsibleDropdown(false);
  };

  // 팀원 추가/제거
  const handleTeamMemberToggle = (user) => {
    setEditData((prev) => {
      const isSelected = prev.teamMembers.some(
        (member) => member.id === user.id,
      );

      if (isSelected) {
        return {
          ...prev,
          teamMembers: prev.teamMembers.filter(
            (member) => member.id !== user.id,
          ),
        };
      } else {
        return {
          ...prev,
          teamMembers: [...prev.teamMembers, user],
        };
      }
    });
  };

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

  // 진행률에 따른 색상
  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  // 사용자 드롭다운 컴포넌트
  const UserDropdown = ({
    isOpen,
    onClose,
    selectedUser,
    onSelect,
    placeholder,
    multiple = false,
    selectedUsers = [],
  }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
        {isLoadingUsers ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <span className="mt-2 block">사용자 목록을 불러오는 중...</span>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {placeholder}
              </p>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {users.map((user) => {
                const isSelected = multiple
                  ? selectedUsers.some((u) => u.id === user.id)
                  : selectedUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => onSelect(user)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.department} · {user.position}
                          </p>
                        </div>
                      </div>
                      {multiple && (
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-300 dark:border-gray-500"
                          }`}
                        >
                          {isSelected && <CheckCircle className="w-3 h-3" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="p-2 border-t border-gray-200 dark:border-gray-600">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full"
          >
            닫기
          </Button>
        </div>
      </div>
    );
  };


  // 상태 관리
  const [plan, setPlan] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState({});
  const [expandedObjectives, setExpandedObjectives] = useState({});
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // 샘플 데이터
  const samplePlan = {
    id: parseInt(planId),
    title: "2025년 1분기 마케팅 계획",
    description: "Z세대 타겟 마케팅을 통한 브랜드 인지도 향상 및 매출 증대를 목표로 하는 전략적 마케팅 계획입니다.",
    status: "진행중",
    progress: 65,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    manager: "김마케팅",
    createdAt: "2025-01-15",
    updatedAt: "2025-06-08",
    targetPersona: "20-30대 직장인",
    coreMessage: "일상을 더 스마트하게, 더 편리하게",
    channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
    objectives: [
      {
        id: 1,
        title: "Z세대 인지도 확보",
        progress: 75,
        confidence: "On Track",
        isActive: true,
        keyResults: [
          { id: 1, title: "틱톡 팔로워 수", target: 50000, current: 38500, unit: "명", type: "number", isActive: true },
          { id: 2, title: "브랜드 인지도", target: 20, current: 15, unit: "%", type: "percentage", isActive: true },
          { id: 3, title: "UGC 콘텐츠 수집", target: 100, current: 82, unit: "건", type: "number", isActive: true },
          { id: 4, title: "참여율 증가", target: 5, current: 3.8, unit: "%", type: "percentage", isActive: true },
          { id: 5, title: "해시태그 사용량", target: 1000, current: 750, unit: "회", type: "number", isActive: true }
        ]
      },
      {
        id: 2,
        title: "온라인 매출 증대",
        progress: 55,
        confidence: "At Risk",
        isActive: true,
        keyResults: [
          { id: 6, title: "온라인 매출", target: 30, current: 18, unit: "%", type: "percentage", isActive: true },
          { id: 7, title: "전환율", target: 3.5, current: 2.1, unit: "%", type: "percentage", isActive: true },
          { id: 8, title: "고객 생애가치", target: 25, current: 12, unit: "%", type: "percentage", isActive: true },
          { id: 9, title: "신규 고객 획득", target: 500, current: 280, unit: "명", type: "number", isActive: true }
        ]
      },
      {
        id: 3,
        title: "고객 만족도 향상",
        progress: 88,
        confidence: "On Track",
        isActive: true,
        keyResults: [
          { id: 10, title: "고객 만족도", target: 4.5, current: 4.2, unit: "점", type: "rating", isActive: true },
          { id: 11, title: "재구매율", target: 40, current: 38, unit: "%", type: "percentage", isActive: true },
          { id: 12, title: "리뷰 평점", target: 4.7, current: 4.6, unit: "점", type: "rating", isActive: true }
        ]
      }
    ]
  };

  // 히스토리 데이터
  const activityHistory = [
    {
      id: 1,
      action: "목표 수정",
      description: "Z세대 인지도 확보 목표의 틱톡 팔로워 수 업데이트",
      user: "김마케팅",
      timestamp: "2025-06-08 14:30",
      type: "edit"
    },
    {
      id: 2,
      action: "진행률 업데이트",
      description: "온라인 매출 증대 목표 진행률 55%로 업데이트",
      user: "이분석",
      timestamp: "2025-06-08 10:15",
      type: "progress"
    },
    {
      id: 3,
      action: "새 목표 추가",
      description: "고객 만족도 향상 목표 추가",
      user: "박전략",
      timestamp: "2025-06-07 16:45",
      type: "create"
    }
  ];

  // 컴포넌트 초기화
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPlan(samplePlan);
      setObjectives(samplePlan.objectives);
      setEditedPlan(samplePlan);

      // 모든 목표를 기본적으로 확장상태로 설정
      const expanded = {};
      samplePlan.objectives.forEach(obj => {
        expanded[obj.id] = true;
      });
      setExpandedObjectives(expanded);
      setLoading(false);
    }, 500);
  }, [planId]);

  // 유틸리티 함수들
  const updateEditedPlan = (field, value) => {
    setEditedPlan(prev => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditedPlan({ ...plan });
    }
  };

  const saveChanges = () => {
    setPlan(editedPlan);
    setIsEditMode(false);
  };

  const cancelEdit = () => {
    setEditedPlan({ ...plan });
    setIsEditMode(false);
  };

  const toggleObjectiveExpansion = (objectiveId) => {
    setExpandedObjectives(prev => ({
      ...prev,
      [objectiveId]: !prev[objectiveId]
    }));
  };

  // 목표 모달 컴포넌트
  const ObjectiveModal = () => {
    const isEditMode = !!editingObjective;
    const [title, setTitle] = useState(editingObjective?.title || "");
    const [keyResults, setKeyResults] = useState(editingObjective?.keyResults || [
      { id: Date.now(), title: "", target: 0, current: 0, unit: "", type: "number", isActive: true }
    ]);

    useEffect(() => {
      setTitle(editingObjective?.title || "");
      setKeyResults(editingObjective?.keyResults || [
        { id: Date.now(), title: "", target: 0, current: 0, unit: "", type: "number", isActive: true }
      ]);
    }, [editingObjective]);

    const addKeyResult = () => {
      setKeyResults(prev => [...prev, { 
        id: Date.now(), 
        title: "", 
        target: 0, 
        current: 0, 
        unit: "", 
        type: "number", 
        isActive: true 
      }]);
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
      if (!title.trim()) {
        alert('목표 제목을 입력해주세요.');
        return;
      }

      const validKeyResults = keyResults.filter(kr => kr.title.trim() && kr.target > 0);
      if (validKeyResults.length === 0) {
        alert('최소 하나의 유효한 핵심 결과를 추가해주세요.');
        return;
      }

      if (isEditMode) {
        setObjectives(prev =>
          prev.map(obj =>
            obj.id === editingObjective.id ? { 
              ...obj, 
              title, 
              keyResults: validKeyResults,
              progress: calculateObjectiveProgress({ keyResults: validKeyResults })
            } : obj
          )
        );
      } else {
        const newObjective = {
          id: Date.now(),
          title,
          progress: 0,
          confidence: "On Track",
          isActive: true,
          keyResults: validKeyResults
        };
        setObjectives(prev => [...prev, newObjective]);
      }
      setShowObjectiveModal(false);
    };
  const calculateObjectiveProgress = (objective) => {
    const validResults = objective.keyResults.filter(kr => 
      kr.isActive && 
      kr.target !== null && 
      !isNaN(kr.target) && 
      kr.target > 0
    );

    if (validResults.length === 0) return 0;

    const totalProgress = validResults.reduce((sum, kr) => {
      const progress = Math.min((kr.current / kr.target) * 100, 100);
      return sum + progress;
    }, 0);

    return Math.round(totalProgress / validResults.length);
  };

  const getConfidenceBadge = (confidence) => {
    switch (confidence) {
      case "On Track":
        return <Badge className="bg-green-100 text-green-800 border-green-200">순항</Badge>;
      case "At Risk":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">위험</Badge>;
      case "Off Track":
        return <Badge className="bg-red-100 text-red-800 border-red-200">지연</Badge>;
      default:
        return <Badge variant="outline">{confidence}</Badge>;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "edit":
        return <Edit className="w-4 h-4 text-blue-500" />;
      case "progress":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "create":
        return <Plus className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  // 목표 관련 함수들
  const editObjective = (objective) => {
    setEditingObjective(objective);
    setShowObjectiveModal(true);
  };

  const deleteObjective = (objectiveId) => {
    setObjectives(prev =>
      prev.map(obj =>
        obj.id === objectiveId ? { ...obj, isActive: false } : obj
      )
    );
    setShowDeleteModal(false);
    setObjectiveToDelete(null);
  };

  const addNewObjective = () => {
    setEditingObjective(null);
    setShowObjectiveModal(true);
  };

  // 목표 모달 컴포넌트
  const ObjectiveModal = () => {
    const isEditMode = !!editingObjective;
    const [title, setTitle] = useState(editingObjective?.title || "");
    const [keyResults, setKeyResults] = useState(editingObjective?.keyResults || [
      { id: Date.now(), title: "", target: 0, current: 0, unit: "", type: "number", isActive: true }
    ]);

    useEffect(() => {
      setTitle(editingObjective?.title || "");
      setKeyResults(editingObjective?.keyResults || [
        { id: Date.now(), title: "", target: 0, current: 0, unit: "", type: "number", isActive: true }
      ]);
    }, [editingObjective]);

    const addKeyResult = () => {
      setKeyResults(prev => [...prev, { 
        id: Date.now(), 
        title: "", 
        target: 0, 
        current: 0, 
        unit: "", 
        type: "number", 
        isActive: true 
      }]);
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
      if (!title.trim()) {
        alert('목표 제목을 입력해주세요.');
        return;
      }

      const validKeyResults = keyResults.filter(kr => kr.title.trim() && kr.target > 0);
      if (validKeyResults.length === 0) {
        alert('최소 하나의 유효한 핵심 결과를 추가해주세요.');
        return;
      }

      if (isEditMode) {
        setObjectives(prev =>
          prev.map(obj =>
            obj.id === editingObjective.id ? { 
              ...obj, 
              title, 
              keyResults: validKeyResults,
              progress: calculateObjectiveProgress({ keyResults: validKeyResults })
            } : obj
          )
        );
      } else {
        const newObjective = {
          id: Date.now(),
          title,
          progress: 0,
          confidence: "On Track",
          isActive: true,
          keyResults: validKeyResults
        };
        setObjectives(prev => [...prev, newObjective]);
      }
      setShowObjectiveModal(false);
    };


    // 목표 모달 컴포넌트
    const ObjectiveModal = () => {
      const isEditMode = !!editingObjective;
      const [title, setTitle] = useState(editingObjective?.title || "");
      const [keyResults, setKeyResults] = useState(editingObjective?.keyResults || [
        { id: Date.now(), title: "", target: 0, current: 0, unit: "", type: "number", isActive: true }
      ]);

      useEffect(() => {
        setTitle(editingObjective?.title || "");
        setKeyResults(editingObjective?.keyResults || [
          { id: Date.now(), title: "", target: 0, current: 0, unit: "", type: "number", isActive: true }
        ]);
      }, [editingObjective]);

      const addKeyResult = () => {
        setKeyResults(prev => [...prev, { 
          id: Date.now(), 
          title: "", 
          target: 0, 
          current: 0, 
          unit: "", 
          type: "number", 
          isActive: true 
        }]);
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
        if (!title.trim()) {
          alert('목표 제목을 입력해주세요.');
          return;
        }

        const validKeyResults = keyResults.filter(kr => kr.title.trim() && kr.target > 0);
        if (validKeyResults.length === 0) {
          alert('최소 하나의 유효한 핵심 결과를 추가해주세요.');
          return;
        }

        if (isEditMode) {
          setObjectives(prev =>
            prev.map(obj =>
              obj.id === editingObjective.id ? { 
                ...obj, 
                title, 
                keyResults: validKeyResults,
                progress: calculateObjectiveProgress({ keyResults: validKeyResults })
              } : obj
            )
          );
        } else {
          const newObjective = {
            id: Date.now(),
            title,
            progress: 0,
            confidence: "On Track",
            isActive: true,
            keyResults: validKeyResults
          };
          setObjectives(prev => [...prev, newObjective]);
        }
        setShowObjectiveModal(false);
      };
      
  if (!planData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 animate-fadeIn">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              마케팅 계획 상세
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              계획 ID: {planId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button
              onClick={handleEditStart}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              편집
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleEditCancel}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                취소
              </Button>
              <Button
                onClick={handleEditSave}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                저장
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 기본 정보 카드 */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">기본 정보</CardTitle>
            {getStatusBadge(planData.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 제목 */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              계획명
            </Label>
            {isEditing ? (
              <Input
                value={editData.title || ""}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="text-lg font-semibold"
                placeholder="계획명을 입력하세요"
              />
            ) : (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {planData.title}
              </h2>
            )}
          </div>

          {/* 기간 */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              계획 기간
            </Label>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    시작일
                  </Label>
                  <Input
                    type="date"
                    value={editData.startDate || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    종료일
                  </Label>
                  <Input
                    type="date"
                    value={editData.endDate || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(planData.startDate).toLocaleDateString("ko-KR")}
                </span>
                <span className="text-gray-500">~</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(planData.endDate).toLocaleDateString("ko-KR")}
                </span>
                <Badge variant="outline" className="ml-auto">
                  {Math.ceil(
                    (new Date(planData.endDate) -
                      new Date(planData.startDate)) /
                      (1000 * 60 * 60 * 24),
                  )}
                  일
                </Badge>
              </div>
            )}
          </div>

          {/* 담당자 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 책임 담당자 */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                책임 담당자
              </Label>
              {isEditing ? (
                <div className="relative">
                  <div
                    onClick={() =>
                      setShowResponsibleDropdown(!showResponsibleDropdown)
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  >
                    {editData.responsible ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {editData.responsible.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {editData.responsible.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {editData.responsible.email}
                          </p>
                        </div>
                        <ChevronDown className="w-4 h-4 ml-auto text-gray-500" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-gray-500">
                        <span>책임 담당자를 선택하세요</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <UserDropdown
                    isOpen={showResponsibleDropdown}
                    onClose={() => setShowResponsibleDropdown(false)}
                    selectedUser={editData.responsible}
                    onSelect={handleResponsibleSelect}
                    placeholder="책임 담당자 선택"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {planData.responsible.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {planData.responsible.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {planData.responsible.email}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 팀원 */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                <Users className="w-4 h-4" />
                팀원 (
                {isEditing
                  ? editData.teamMembers?.length || 0
                  : planData.teamMembers.length}
                명)
              </Label>
              {isEditing ? (
                <div className="relative">
                  <div
                    onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  >
                    {editData.teamMembers && editData.teamMembers.length > 0 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {editData.teamMembers
                            .slice(0, 3)
                            .map((member, index) => (
                              <div
                                key={member.id}
                                className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-white dark:border-gray-700"
                                style={{ zIndex: 10 - index }}
                              >
                                {member.name.charAt(0)}
                              </div>
                            ))}
                          {editData.teamMembers.length > 3 && (
                            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-white dark:border-gray-700">
                              +{editData.teamMembers.length - 3}
                            </div>
                          )}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-gray-500">
                        <span>팀원을 선택하세요</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <UserDropdown
                    isOpen={showTeamDropdown}
                    onClose={() => setShowTeamDropdown(false)}
                    selectedUsers={editData.teamMembers || []}
                    onSelect={handleTeamMemberToggle}
                    placeholder="팀원 선택 (다중 선택 가능)"
                    multiple={true}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {planData.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 타겟 고객 및 핵심 메시지 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                <Users className="w-4 h-4" />
                타겟 고객
              </Label>
              {isEditing ? (
                <Input
                  value={editData.targetPersona || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      targetPersona: e.target.value,
                    }))
                  }
                  placeholder="타겟 고객을 입력하세요"
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {planData.targetPersona}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                핵심 메시지
              </Label>
              {isEditing ? (
                <Input
                  value={editData.coreMessage || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      coreMessage: e.target.value,
                    }))
                  }
                  placeholder="핵심 메시지를 입력하세요"
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {planData.coreMessage}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 설명 */}
          {(isEditing || planData.description) && (
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                설명
              </Label>
              {isEditing ? (
                <textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="계획에 대한 상세 설명을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    {planData.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 진행률 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                전체 진행률
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {planData.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(planData.progress)}`}
                style={{ width: `${planData.progress}%` }}
              ></div>
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="flex justify-between text-sm text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span>
              생성일: {new Date(planData.createdAt).toLocaleDateString("ko-KR")}
            </span>
            <span>
              최종 수정:{" "}
              {new Date(planData.updatedAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </CardContent>
      </Card>

     

 
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {isEditMode ? "목표 수정" : "새 목표 추가"}
                      </h2>
                      <p className="text-blue-100 text-sm">OKR 방법론을 활용한 목표 설정</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowObjectiveModal(false)}
                    className="text-white hover:bg-white/20 border-white/30"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-8 space-y-8">
                  {/* 목표 설정 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-blue-500 to-purple-500">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                        O
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        목표 (Objective)
                      </h3>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        목표 제목 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="예: Z세대 인지도 확보"
                        className="text-lg font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  {/* 핵심 결과 설정 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-green-500 to-teal-500">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                        KR
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        핵심 결과 (Key Results)
                      </h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                      {keyResults.map((kr, index) => (
                        <div key={kr.id} className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-green-200 dark:border-gray-600 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white font-bold flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                              핵심 결과 #{index + 1}
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                결과 제목 <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                value={kr.title}
                                onChange={(e) => updateKeyResult(kr.id, "title", e.target.value)}
                                placeholder="예: 틱톡 팔로워 수"
                                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                측정 단위
                              </Label>
                              <select
                                value={kr.unit}
                                onChange={(e) => updateKeyResult(kr.id, "unit", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-green-500 focus:ring-green-200"
                              >
                                <option value="">단위 선택</option>
                                <option value="명">명</option>
                                <option value="%">%</option>
                                <option value="건">건</option>
                                <option value="점">점</option>
                                <option value="회">회</option>
                                <option value="원">원</option>
                                <option value="개">개</option>
                              </select>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                목표 수치 <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                type="number"
                                value={kr.target}
                                onChange={(e) => updateKeyResult(kr.id, "target", parseFloat(e.target.value) || 0)}
                                placeholder="목표값"
                                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                              />
                            </div>

                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                  현재 달성 수치
                                </Label>
                                <Input
                                  type="number"
                                  value={kr.current}
                                  onChange={(e) => updateKeyResult(kr.id, "current", parseFloat(e.target.value) || 0)}
                                  placeholder="현재값"
                                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                                />
                              </div>
                              {keyResults.length > 1 && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => deleteKeyResult(kr.id)}
                                  className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* 진행률 표시 */}
                          {kr.target > 0 && (
                            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">진행률</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                  {Math.min(Math.round((kr.current / kr.target) * 100), 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-500" 
                                  style={{width: `${Math.min((kr.current / kr.target) * 100, 100)}%`}}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={addKeyResult}
                      className="flex items-center gap-2 w-full py-4 text-lg bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-dashed border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/30 dark:hover:to-teal-900/30"
                    >
                      <Plus className="w-5 h-5" />
                      핵심 결과 추가
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {keyResults.filter(kr => kr.title.trim() && kr.target > 0).length}개의 유효한 핵심 결과
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setShowObjectiveModal(false)}
                      className="px-6"
                    >
                      취소
                    </Button>
                    <Button 
                      size="lg"
                      onClick={saveObjective}
                      className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isEditMode ? "수정 완료" : "목표 추가"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
  
       {/* OKR 대시보드 */}
          <Card className="shadow-lg border-2 border-gray-200 dark:border-gray-600">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      OKR 대시보드
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      {objectives.filter(obj => obj.isActive).length}개의 활성 목표
                    </p>
                  </div>
                </div>
                <Button onClick={addNewObjective} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  새 목표 추가
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {objectives.filter(obj => obj.isActive).map((objective) => (
                <div key={objective.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-md overflow-hidden">
                  {/* 목표 헤더 */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                            O
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {objective.title}
                          </h3>
                          {getConfidenceBadge(objective.confidence)}
                        </div>

                        {/* 진행률 바 */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              목표 진행률
                            </span>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {calculateObjectiveProgress(objective)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700" 
                              style={{width: `${calculateObjectiveProgress(objective)}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleObjectiveExpansion(objective.id)}
                          className="flex items-center gap-1"
                        >
                          {expandedObjectives[objective.id] ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              축소
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              확장
                            </>
                          )}
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
                          className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 핵심 결과 */}
                  {expandedObjectives[objective.id] && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded text-white font-bold flex items-center justify-center text-xs">
                          KR
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          핵심 결과 ({objective.keyResults.filter(kr => kr.isActive).length}개)
                        </h4>
                      </div>

                      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                        {objective.keyResults.filter(kr => kr.isActive).map((kr) => (
                          <div key={kr.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg flex items-center justify-center">
                                  {kr.current >= kr.target ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 dark:text-white">
                                    {kr.title}
                                  </h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {kr.current} / {kr.target} {kr.unit}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {Math.min(Math.round((kr.current / kr.target) * 100), 100)}%
                                </div>
                                {kr.current >= kr.target && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <Award className="w-3 h-3 mr-1" />
                                    달성
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* 진행률 바 */}
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  kr.current >= kr.target 
                                    ? 'bg-gradient-to-r from-green-500 to-teal-500' 
                                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                }`}
                                style={{width: `${Math.min((kr.current / kr.target) * 100, 100)}%`}}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {objectives.filter(obj => obj.isActive).length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    목표가 없습니다
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    첫 번째 목표를 추가하여 계획을 시작하세요
                  </p>
                  <Button onClick={addNewObjective} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                    <Plus className="w-4 h-4 mr-2" />
                    목표 추가하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
      

  
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {isEditMode ? "목표 수정" : "새 목표 추가"}
                      </h2>
                      <p className="text-blue-100 text-sm">OKR 방법론을 활용한 목표 설정</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowObjectiveModal(false)}
                    className="text-white hover:bg-white/20 border-white/30"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-8 space-y-8">
                  {/* 목표 설정 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-blue-500 to-purple-500">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                        O
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        목표 (Objective)
                      </h3>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        목표 제목 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="예: Z세대 인지도 확보"
                        className="text-lg font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  {/* 핵심 결과 설정 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-green-500 to-teal-500">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                        KR
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        핵심 결과 (Key Results)
                      </h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                      {keyResults.map((kr, index) => (
                        <div key={kr.id} className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-green-200 dark:border-gray-600 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white font-bold flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                              핵심 결과 #{index + 1}
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                결과 제목 <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                value={kr.title}
                                onChange={(e) => updateKeyResult(kr.id, "title", e.target.value)}
                                placeholder="예: 틱톡 팔로워 수"
                                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                측정 단위
                              </Label>
                              <select
                                value={kr.unit}
                                onChange={(e) => updateKeyResult(kr.id, "unit", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-green-500 focus:ring-green-200"
                              >
                                <option value="">단위 선택</option>
                                <option value="명">명</option>
                                <option value="%">%</option>
                                <option value="건">건</option>
                                <option value="점">점</option>
                                <option value="회">회</option>
                                <option value="원">원</option>
                                <option value="개">개</option>
                              </select>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                목표 수치 <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                type="number"
                                value={kr.target}
                                onChange={(e) => updateKeyResult(kr.id, "target", parseFloat(e.target.value) || 0)}
                                placeholder="목표값"
                                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                              />
                            </div>

                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                  현재 달성 수치
                                </Label>
                                <Input
                                  type="number"
                                  value={kr.current}
                                  onChange={(e) => updateKeyResult(kr.id, "current", parseFloat(e.target.value) || 0)}
                                  placeholder="현재값"
                                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200"
                                />
                              </div>
                              {keyResults.length > 1 && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => deleteKeyResult(kr.id)}
                                  className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* 진행률 표시 */}
                          {kr.target > 0 && (
                            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">진행률</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                  {Math.min(Math.round((kr.current / kr.target) * 100), 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-500" 
                                  style={{width: `${Math.min((kr.current / kr.target) * 100, 100)}%`}}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={addKeyResult}
                      className="flex items-center gap-2 w-full py-4 text-lg bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-dashed border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/30 dark:hover:to-teal-900/30"
                    >
                      <Plus className="w-5 h-5" />
                      핵심 결과 추가
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {keyResults.filter(kr => kr.title.trim() && kr.target > 0).length}개의 유효한 핵심 결과
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setShowObjectiveModal(false)}
                      className="px-6"
                    >
                      취소
                    </Button>
                    <Button 
                      size="lg"
                      onClick={saveObjective}
                      className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isEditMode ? "수정 완료" : "목표 추가"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

       {/* OKR 대시보드 */}
          <Card className="shadow-lg border-2 border-gray-200 dark:border-gray-600">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      OKR 대시보드
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      {objectives.filter(obj => obj.isActive).length}개의 활성 목표
                    </p>
                  </div>
                </div>
                <Button onClick={addNewObjective} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  새 목표 추가
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {objectives.filter(obj => obj.isActive).map((objective) => (
                <div key={objective.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-md overflow-hidden">
                  {/* 목표 헤더 */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                            O
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {objective.title}
                          </h3>
                          {getConfidenceBadge(objective.confidence)}
                        </div>

                        {/* 진행률 바 */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              목표 진행률
                            </span>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {calculateObjectiveProgress(objective)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700" 
                              style={{width: `${calculateObjectiveProgress(objective)}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleObjectiveExpansion(objective.id)}
                          className="flex items-center gap-1"
                        >
                          {expandedObjectives[objective.id] ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              축소
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              확장
                            </>
                          )}
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
                          className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 핵심 결과 */}
                  {expandedObjectives[objective.id] && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded text-white font-bold flex items-center justify-center text-xs">
                          KR
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          핵심 결과 ({objective.keyResults.filter(kr => kr.isActive).length}개)
                        </h4>
                      </div>

                      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                        {objective.keyResults.filter(kr => kr.isActive).map((kr) => (
                          <div key={kr.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg flex items-center justify-center">
                                  {kr.current >= kr.target ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 dark:text-white">
                                    {kr.title}
                                  </h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {kr.current} / {kr.target} {kr.unit}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {Math.min(Math.round((kr.current / kr.target) * 100), 100)}%
                                </div>
                                {kr.current >= kr.target && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <Award className="w-3 h-3 mr-1" />
                                    달성
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* 진행률 바 */}
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  kr.current >= kr.target 
                                    ? 'bg-gradient-to-r from-green-500 to-teal-500' 
                                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                }`}
                                style={{width: `${Math.min((kr.current / kr.target) * 100, 100)}%`}}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {objectives.filter(obj => obj.isActive).length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    목표가 없습니다
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    첫 번째 목표를 추가하여 계획을 시작하세요
                  </p>
                  <Button onClick={addNewObjective} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                    <Plus className="w-4 h-4 mr-2" />
                    목표 추가하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

      {/* 목표 (OKRs) 카드 */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            목표 설정 (OKRs)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {planData.objectives.map((objective) => (
            <div
              key={objective.id}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-blue-200 dark:border-gray-600"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center text-xs">
                  O
                </div>
                {objective.title}
              </h3>

              <div className="space-y-4 ml-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-teal-500 rounded text-white font-bold flex items-center justify-center text-xs">
                    KR
                  </div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    핵심 결과 (Key Results)
                  </label>
                </div>

                {objective.keyResults.map((kr) => (
                  <div
                    key={kr.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {kr.description}
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {kr.progress}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>목표: {kr.target}</span>
                      <span>현재: {kr.current.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(kr.progress)}`}
                        style={{ width: `${kr.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 주요 채널 */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-500" />
            주요 채널
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {planData.channels.map((channel, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200 text-sm py-1 px-3"
              >
                {channel}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 주요 활동 */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            주요 활동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {planData.initiatives.map((initiative) => (
              <div
                key={initiative.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
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
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>
                      {new Date(initiative.startDate).toLocaleDateString(
                        "ko-KR",
                      )}{" "}
                      ~{" "}
                      {new Date(initiative.endDate).toLocaleDateString("ko-KR")}
                    </span>
                    <span>진행률: {initiative.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(initiative.progress)}`}
                      style={{ width: `${initiative.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
    }

