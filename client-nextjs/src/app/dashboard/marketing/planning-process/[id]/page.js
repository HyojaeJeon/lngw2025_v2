` tags. I will pay close attention to preserving indentation, structure, and ensuring that no parts are skipped or omitted.

```
<replit_final_file>
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";
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
  Globe
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
    responsible: { id: 1, name: "김마케팅", email: "kim@company.com", avatar: null },
    teamMembers: [
      { id: 2, name: "이기획", email: "lee@company.com", avatar: null },
      { id: 3, name: "박전략", email: "park@company.com", avatar: null }
    ],
    targetPersona: "20-30대 직장인",
    coreMessage: "일상을 더 스마트하게, 더 편리하게",
    description: "2025년 첫 분기 마케팅 전략으로 Z세대 타겟 인지도 확보와 온라인 매출 증대를 목표로 합니다.",
    objectives: [
      {
        id: 1,
        title: "Z세대 인지도 확보",
        keyResults: [
          { id: 1, description: "틱톡 팔로워 5만 달성", target: "50,000명", current: 32000, progress: 64 },
          { id: 2, description: "브랜드 인지도 증가", target: "20%", current: 12, progress: 60 },
          { id: 3, description: "UGC 콘텐츠 수집", target: "100건", current: 65, progress: 65 }
        ]
      },
      {
        id: 2,
        title: "온라인 매출 증대",
        keyResults: [
          { id: 4, description: "온라인 매출 증가", target: "30%", current: 18, progress: 60 },
          { id: 5, description: "전환율 달성", target: "3.5%", current: 2.8, progress: 80 },
          { id: 6, description: "고객 생애가치 향상", target: "25%", current: 15, progress: 60 }
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
        progress: 25,
        startDate: "2025-06-01",
        endDate: "2025-08-31"
      },
      { 
        id: 2,
        name: "대학생 앰배서더 운영", 
        status: "진행중", 
        linkedToCampaign: false,
        progress: 70,
        startDate: "2025-03-01",
        endDate: "2025-12-31"
      },
      { 
        id: 3,
        name: "인플루언서 협업 프로젝트", 
        status: "완료", 
        linkedToCampaign: true,
        progress: 100,
        startDate: "2025-01-15",
        endDate: "2025-03-15"
      }
    ],
    createdAt: "2025-01-15",
    updatedAt: "2025-06-08"
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
      description: planData.description
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
      setPlanData(prev => ({
        ...prev,
        ...editData,
        updatedAt: new Date().toISOString().split('T')[0]
      }));

      setIsEditing(false);
      setEditData({});
      alert('계획이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('업데이트 실패:', error);
      alert('업데이트 중 오류가 발생했습니다.');
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
        { id: 1, name: "김마케팅", email: "kim@company.com", department: "마케팅팀", position: "팀장", avatar: null },
        { id: 2, name: "이기획", email: "lee@company.com", department: "마케팅팀", position: "선임", avatar: null },
        { id: 3, name: "박전략", email: "park@company.com", department: "마케팅팀", position: "주임", avatar: null },
        { id: 4, name: "최브랜드", email: "choi@company.com", department: "마케팅팀", position: "사원", avatar: null },
        { id: 5, name: "정콘텐츠", email: "jung@company.com", department: "크리에이티브팀", position: "선임", avatar: null },
        { id: 6, name: "한디자인", email: "han@company.com", department: "크리에이티브팀", position: "주임", avatar: null }
      ];

      setUsers(userData);
    } catch (error) {
      console.error('사용자 목록 로드 실패:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 책임 담당자 선택
  const handleResponsibleSelect = (user) => {
    setEditData(prev => ({
      ...prev,
      responsible: user
    }));
    setShowResponsibleDropdown(false);
  };

  // 팀원 추가/제거
  const handleTeamMemberToggle = (user) => {
    setEditData(prev => {
      const isSelected = prev.teamMembers.some(member => member.id === user.id);

      if (isSelected) {
        return {
          ...prev,
          teamMembers: prev.teamMembers.filter(member => member.id !== user.id)
        };
      } else {
        return {
          ...prev,
          teamMembers: [...prev.teamMembers, user]
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
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">계획됨</Badge>;
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
  const UserDropdown = ({ isOpen, onClose, selectedUser, onSelect, placeholder, multiple = false, selectedUsers = [] }) => {
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
                  ? selectedUsers.some(u => u.id === user.id)
                  : selectedUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => onSelect(user)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
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
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-blue-500 border-blue-500 text-white' 
                            : 'border-gray-300 dark:border-gray-500'
                        }`}>
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
            <Button onClick={handleEditStart} className="flex items-center gap-2">
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
                value={editData.title || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
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
                    value={editData.startDate || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    종료일
                  </Label>
                  <Input
                    type="date"
                    value={editData.endDate || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(planData.startDate).toLocaleDateString('ko-KR')}
                </span>
                <span className="text-gray-500">~</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(planData.endDate).toLocaleDateString('ko-KR')}
                </span>
                <Badge variant="outline" className="ml-auto">
                  {Math.ceil((new Date(planData.endDate) - new Date(planData.startDate)) / (1000 * 60 * 60 * 24))}일
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
                    onClick={() => setShowResponsibleDropdown(!showResponsibleDropdown)}
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
                팀원 ({isEditing ? editData.teamMembers?.length || 0 : planData.teamMembers.length}명)
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
                          {editData.teamMembers.slice(0, 3).map((member, index) => (
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
                    <div key={member.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
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
                  value={editData.targetPersona || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, targetPersona: e.target.value }))}
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
                  value={editData.coreMessage || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, coreMessage: e.target.value }))}
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
                  value={editData.description || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
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
                style={{width: `${planData.progress}%`}}
              ></div>
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="flex justify-between text-sm text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span>생성일: {new Date(planData.createdAt).toLocaleDateString('ko-KR')}</span>
            <span>최종 수정: {new Date(planData.updatedAt).toLocaleDateString('ko-KR')}</span>
          </div>
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
            <div key={objective.id} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-blue-200 dark:border-gray-600">
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
                  <div key={kr.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {kr.description}
                      </h4>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
                        style={{width: `${kr.progress}%`}}
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
            <Globe```xml
 className="w-5 h-5 text-orange-500" />
            주요 채널
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {planData.channels.map((channel, index) => (
              <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-sm py-1 px-3">
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
              <div key={initiative.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {initiative.name}
                    </h4>
                    {getStatusBadge(initiative.status)}
                    {initiative.linkedToCampaign && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        캠페인연동
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{new Date(initiative.startDate).toLocaleDateString('ko-KR')} ~ {new Date(initiative.endDate).toLocaleDateString('ko-KR')}</span>
                    <span>진행률: {initiative.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(initiative.progress)}`}
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