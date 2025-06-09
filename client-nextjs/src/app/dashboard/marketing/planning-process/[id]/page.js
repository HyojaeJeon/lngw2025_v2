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
  AlertTriangle,
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
  Lightbulb,
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

  // 계획 데이터 상태
  const [planData, setPlanData] = useState({
    id: 1,
    title: "2025년 1분기 마케팅 계획",
    status: "진행중",
    progress: 65,
    period: {
      startDate: "2025-01-01",
      endDate: "2025-03-31"
    },
    responsible: {
      id: 1,
      name: "김마케팅",
      avatar: null
    },
    team: [
      {
        id: 2,
        name: "이기획",
        avatar: null,
        role: "기획담당"
      },
      {
        id: 3,
        name: "박디자인",
        avatar: null,
        role: "디자인담당"
      }
    ],
    targetCustomer: "20-30대 직장인",
    coreMessage: "일상을 더 스마트하게, 더 편리하게",
    description: "2025년 1분기 목표 달성을 위한 통합 마케팅 전략 및 실행 계획",
    objectives: [
      {
        id: 1,
        title: "Z세대 인지도 확보",
        keyResults: [
          { id: 1, description: "틱톡 팔로워 5만 달성", target: "5만명", progress: 70, status: "진행중" },
          { id: 2, description: "브랜드 인지도 증가", target: "20%", progress: 45, status: "진행중" },
          { id: 3, description: "UGC 콘텐츠 수집", target: "100건", progress: 85, status: "완료" }
        ]
      },
      {
        id: 2,
        title: "온라인 매출 증대",
        keyResults: [
          { id: 4, description: "온라인 매출 증가", target: "30%", progress: 60, status: "진행중" },
          { id: 5, description: "전환율 달성", target: "3.5%", progress: 40, status: "지연" },
          { id: 6, description: "고객 생애가치 향상", target: "25%", progress: 55, status: "진행중" }
        ]
      }
    ],
    channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
    initiatives: [
      { 
        id: 1, 
        name: "여름 바캉스 캠페인", 
        status: "계획됨", 
        linkedToCampaign: true,
        startDate: "2025-06-01",
        endDate: "2025-08-31",
        progress: 25
      },
      { 
        id: 2, 
        name: "대학생 앰배서더 운영", 
        status: "진행중", 
        linkedToCampaign: false,
        startDate: "2025-03-01",
        endDate: "2025-12-31",
        progress: 60
      },
      { 
        id: 3, 
        name: "인플루언서 협업 프로젝트", 
        status: "완료", 
        linkedToCampaign: true,
        startDate: "2025-01-01",
        endDate: "2025-02-28",
        progress: 100
      }
    ],
    createdAt: "2025-01-15",
    updatedAt: "2025-06-08"
  });

  // 편집용 폼 데이터
  const [editForm, setEditForm] = useState({});

  // 컴포넌트 마운트 시 실제 계획 데이터 로드
  useEffect(() => {
    loadPlanData();
    loadUsers();
  }, [planId]);

  // 편집 모드 전환 시 폼 데이터 초기화
  useEffect(() => {
    if (isEditing) {
      setEditForm({
        title: planData.title,
        startDate: planData.period.startDate,
        endDate: planData.period.endDate,
        responsibleId: planData.responsible.id,
        teamIds: planData.team.map(member => member.id),
        targetCustomer: planData.targetCustomer,
        coreMessage: planData.coreMessage,
        description: planData.description
      });
    }
  }, [isEditing, planData]);

  // 계획 데이터 로드
  const loadPlanData = async () => {
    try {
      // 실제 구현에서는 API 호출
      // const response = await fetch(`/api/marketing/plans/${planId}`);
      // const data = await response.json();
      // setPlanData(data);

      // 현재는 더미 데이터 사용
      console.log("Loading plan data for ID:", planId);
    } catch (error) {
      console.error("Failed to load plan data:", error);
    }
  };

  // 사용자 목록 로드
  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      // 실제 구현에서는 API 호출
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setUsers(data);

      // 더미 데이터
      setUsers([
        { id: 1, name: "김마케팅", email: "kim@company.com", department: "마케팅팀", avatar: null },
        { id: 2, name: "이기획", email: "lee@company.com", department: "기획팀", avatar: null },
        { id: 3, name: "박디자인", email: "park@company.com", department: "디자인팀", avatar: null },
        { id: 4, name: "최브랜드", email: "choi@company.com", department: "브랜드팀", avatar: null },
        { id: 5, name: "정콘텐츠", email: "jung@company.com", department: "콘텐츠팀", avatar: null }
      ]);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 상태별 배지 색상
  const getStatusBadge = (status) => {
    switch (status) {
      case "진행중":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">진행중</Badge>;
      case "계획됨":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">계획됨</Badge>;
      case "완료":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">완료</Badge>;
      case "지연":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">지연</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Key Result 상태별 아이콘
  const getKRStatusIcon = (status) => {
    switch (status) {
      case "완료":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "진행중":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "지연":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  // 진행률 색상
  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      // 실제 구현에서는 API 호출
      // await updateMarketingPlan(planId, editForm);

      // 로컬 상태 업데이트
      setPlanData(prev => ({
        ...prev,
        title: editForm.title,
        period: {
          startDate: editForm.startDate,
          endDate: editForm.endDate
        },
        responsible: users.find(user => user.id === editForm.responsibleId) || prev.responsible,
        team: users.filter(user => editForm.teamIds.includes(user.id)),
        targetCustomer: editForm.targetCustomer,
        coreMessage: editForm.coreMessage,
        description: editForm.description,
        updatedAt: new Date().toISOString().split('T')[0]
      }));

      setIsEditing(false);
      alert("계획이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("Failed to save plan:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  // 커스텀 드롭다운 컴포넌트
  const CustomDropdown = ({ 
    label, 
    isOpen, 
    onToggle, 
    selectedItems, 
    onItemToggle, 
    options, 
    multiple = false,
    placeholder = "선택하세요" 
  }) => (
    <div className="relative">
      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </Label>
      <div
        onClick={onToggle}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
      >
        <span className="flex-1">
          {selectedItems.length > 0 
            ? selectedItems.map(item => item.name).join(", ")
            : placeholder
          }
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoadingUsers ? (
            <div className="p-3 text-center text-gray-500">로딩 중...</div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
                onClick={() => onItemToggle(option)}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {option.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {option.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.department}
                    </div>
                  </div>
                </div>
                {selectedItems.some(item => item.id === option.id) && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

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

        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                취소
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              편집
            </Button>
          )}
        </div>
      </div>

      {/* 계획 기본 정보 */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={editForm.title || ""}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="text-xl font-bold bg-white dark:bg-gray-800"
                    placeholder="계획 제목을 입력하세요"
                  />
                ) : (
                  <CardTitle className="text-xl">{planData.title}</CardTitle>
                )}
                <div className="flex items-center gap-4 mt-2">
                  {getStatusBadge(planData.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    진행률: {planData.progress}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                최종 수정: {planData.updatedAt}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                생성일: {planData.createdAt}
              </div>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`${getProgressColor(planData.progress)} h-3 rounded-full transition-all duration-500`}
                style={{width: `${planData.progress}%`}}
              ></div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 기간 */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                기간
              </Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={editForm.startDate || ""}
                    onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  <Input
                    type="date"
                    value={editForm.endDate || ""}
                    onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {planData.period.startDate} ~ {planData.period.endDate}
                  </div>
                </div>
              )}
            </div>

            {/* 책임 담당자 */}
            <div>
              {isEditing ? (
                <CustomDropdown
                  label="책임 담당자"
                  isOpen={showResponsibleDropdown}
                  onToggle={() => setShowResponsibleDropdown(!showResponsibleDropdown)}
                  selectedItems={editForm.responsibleId ? [users.find(u => u.id === editForm.responsibleId)] : []}
                  onItemToggle={(user) => {
                    setEditForm(prev => ({ ...prev, responsibleId: user.id }));
                    setShowResponsibleDropdown(false);
                  }}
                  options={users}
                  placeholder="책임 담당자를 선택하세요"
                />
              ) : (
                <>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <UserCheck className="w-4 h-4 inline mr-2" />
                    책임 담당자
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {planData.responsible.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {planData.responsible.name}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 팀원 */}
            <div>
              {isEditing ? (
                <CustomDropdown
                  label="팀원"
                  isOpen={showTeamDropdown}
                  onToggle={() => setShowTeamDropdown(!showTeamDropdown)}
                  selectedItems={editForm.teamIds ? users.filter(u => editForm.teamIds.includes(u.id)) : []}
                  onItemToggle={(user) => {
                    setEditForm(prev => ({
                      ...prev,
                      teamIds: prev.teamIds?.includes(user.id) 
                        ? prev.teamIds.filter(id => id !== user.id)
                        : [...(prev.teamIds || []), user.id]
                    }));
                  }}
                  options={users}
                  multiple={true}
                  placeholder="팀원을 선택하세요"
                />
              ) : (
                <>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Users className="w-4 h-4 inline mr-2" />
                    팀원
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {planData.team.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {member.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 타겟 고객 */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Target className="w-4 h-4 inline mr-2" />
                타겟 고객
              </Label>
              {isEditing ? (
                <Input
                  value={editForm.targetCustomer || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, targetCustomer: e.target.value }))}
                  placeholder="타겟 고객을 입력하세요"
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {planData.targetCustomer}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 핵심 메시지 */}
          <div className="mt-6">
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              핵심 메시지
            </Label>
            {isEditing ? (
              <Input
                value={editForm.coreMessage || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, coreMessage: e.target.value }))}
                placeholder="핵심 메시지를 입력하세요"
              />
            ) : (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  "{planData.coreMessage}"
                </span>
              </div>
            )}
          </div>

          {/* 설명 */}
          {(isEditing || planData.description) && (
            <div className="mt-6">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                설명
              </Label>
              {isEditing ? (
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="계획에 대한 상세한 설명을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="text-gray-900 dark:text-white">
                    {planData.description}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 목표 설정 (OKRs) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            목표 설정 (OKRs)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {planData.objectives.map((objective, objIndex) => (
            <div key={objective.id} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-blue-200 dark:border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                  O
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {objective.title}
                </h3>
              </div>

              <div className="space-y-4 ml-10">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-teal-500 rounded text-white font-bold flex items-center justify-center text-xs">
                    KR
                  </div>
                  핵심 결과 (Key Results)
                </h4>
                {objective.keyResults.map((kr) => (
                  <div key={kr.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getKRStatusIcon(kr.status)}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {kr.description}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          목표: {kr.target}
                        </Badge>
                      </div>
                      {getStatusBadge(kr.status)}
                    </div>

                    {/* Key Result 진행률 */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>진행률</span>
                        <span>{kr.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`${getProgressColor(kr.progress)} h-2 rounded-full transition-all duration-500`}
                          style={{width: `${kr.progress}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 주요 채널 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-500" />
            주요 채널
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {planData.channels.map((channel, index) => (
              <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300">
                {channel}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 주요 활동 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            주요 활동 (Key Initiatives)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {planData.initiatives.map((initiative) => (
              <div key={initiative.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {initiative.name}
                    </h4>
                    {getStatusBadge(initiative.status)}
                    {initiative.linkedToCampaign && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
                        캠페인연동
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">시작일:</span> {initiative.startDate}
                  </div>
                  <div>
                    <span className="font-medium">종료일:</span> {initiative.endDate}
                  </div>
                  <div>
                    <span className="font-medium">진행률:</span> {initiative.progress}%
                  </div>
                </div>

                {/* 활동 진행률 */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${getProgressColor(initiative.progress)} h-2 rounded-full transition-all duration-500`}
                      style={{width: `${initiative.progress}%`}}
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