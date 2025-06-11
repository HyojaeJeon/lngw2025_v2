
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from '@apollo/client';
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { 
  Calendar, 
  User, 
  Users, 
  MessageSquare, 
  Edit,
  Save,
  X
} from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage.js';
import { calculateOverallProgress } from "../_utils/calculations";
import { UPDATE_MARKETING_PLAN, GET_USERS_FOR_ASSIGNMENT } from "@/lib/graphql/marketingMutations.js";



const PlanHeader = ({ plan, objectives, onEditClick }) => {
  const { t } = useLanguage();
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({ ...plan });
  const [users, setUsers] = useState([]);
  const [userOffset, setUserOffset] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userListRef = useRef(null);
  const dropdownRef = useRef(null);

  // GraphQL 훅들
  const [updateMarketingPlan, { loading: isSaving }] = useMutation(UPDATE_MARKETING_PLAN);
  const { data: usersData, loading: usersLoading, fetchMore } = useQuery(GET_USERS_FOR_ASSIGNMENT, {
    variables: { offset: 0, limit: 10 },
    skip: !isEditMode,
    onCompleted: (data) => {
      setUsers(data.users || []);
      setUserOffset(10);
    }
  });

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 사용자 목록 무한 스크롤
  const handleUserScroll = async (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && usersData?.usersCount > users.length) {
      try {
        const { data } = await fetchMore({
          variables: { offset: userOffset, limit: 10 },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...prev,
              users: [...prev.users, ...fetchMoreResult.users]
            };
          }
        });
        setUsers(prev => [...prev, ...data.users]);
        setUserOffset(prev => prev + 10);
      } catch (error) {
        console.error('사용자 목록 로드 오류:', error);
      }
    }
  };

  // 편집 모드 시작
  const handleEditStart = () => {
    setIsEditMode(true);
    setForm({ ...plan });
  };

  // 저장
  const handleSave = async () => {
    try {
      const { data } = await updateMarketingPlan({
        variables: {
          id: plan.id,
          input: {
            title: form.title,
            description: form.description,
            startDate: form.startDate,
            endDate: form.endDate,
            manager: form.manager,
            targetPersona: form.targetPersona,
            coreMessage: form.coreMessage
          }
        }
      });
      
      setIsEditMode(false);
      
      // 상위 컴포넌트에 변경사항 알림
      if (onEditClick) {
        onEditClick(data.updateMarketingPlan);
      }
      
      console.log('계획이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 취소
  const handleCancel = () => {
    setForm({ ...plan });
    setIsEditMode(false);
    setShowUserDropdown(false);
  };

  // 담당자 선택
  const handleManagerSelect = (selectedUser) => {
    setForm(prev => ({ 
      ...prev, 
      manager: selectedUser.name,
      managerId: selectedUser.id 
    }));
    setShowUserDropdown(false);
  };

  // 폼 입력 핸들러
  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 text-white shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          {/* 타이틀 */}
          {isEditMode ? (
            <Input
              className="mb-3 text-3xl font-bold bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
              value={form.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t("마케팅 계획 제목을 입력하세요")}
            />
          ) : (
            <h1 className="mb-3 text-3xl font-bold break-words">{plan.title}</h1>
          )}

          {/* 설명 */}
          {isEditMode ? (
            <textarea
              className="mb-4 text-lg bg-white/20 border border-white/30 rounded px-3 py-2 w-full text-white placeholder:text-white/60 focus:bg-white/30 focus:outline-none resize-none"
              value={form.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t("계획에 대한 설명을 입력하세요")}
              rows={3}
            />
          ) : (
            <p className="mb-4 text-lg text-blue-100">{plan.description}</p>
          )}

          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
            {/* 기간 */}
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-200" />
                <div className="flex-1">
                  <p className="text-xs text-blue-200">{t("기간")}</p>
                  {isEditMode ? (
                    <div className="space-y-1">
                      <Input
                        type="date"
                        value={form.startDate || ''}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="text-xs bg-white/20 border-white/30 text-white"
                      />
                      <Input
                        type="date"
                        value={form.endDate || ''}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="text-xs bg-white/20 border-white/30 text-white"
                      />
                    </div>
                  ) : (
                    <p className="font-semibold text-sm">
                      {plan.startDate} ~ {plan.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 담당자 */}
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-green-200" />
                <div className="flex-1">
                  <p className="text-xs text-green-200">{t("담당자")}</p>
                  {isEditMode ? (
                    <div className="relative" ref={dropdownRef}>
                      <Button
                        variant="ghost"
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="p-0 h-auto text-left font-semibold text-white hover:bg-white/10"
                      >
                        {form.manager || '담당자 선택'}
                      </Button>
                      
                      {showUserDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
                          <div 
                            ref={userListRef}
                            className="max-h-60 overflow-y-auto"
                            onScroll={handleUserScroll}
                          >
                            {users.map(user => (
                              <button
                                key={user.id}
                                onClick={() => handleManagerSelect(user)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-900"
                              >
                                <img 
                                  src={user.avatar} 
                                  alt={user.name}
                                  className="w-6 h-6 rounded-full"
                                />
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.position}</div>
                                </div>
                              </button>
                            ))}
                            {userHasMore && (
                              <div className="px-3 py-2 text-center text-gray-500 text-sm">
                                로딩 중...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="font-semibold">{plan.manager}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 타겟 고객 */}
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-200" />
                <div className="flex-1">
                  <p className="text-xs text-purple-200">{t("타겟 고객")}</p>
                  {isEditMode ? (
                    <Input
                      value={form.targetPersona || ''}
                      onChange={(e) => handleInputChange('targetPersona', e.target.value)}
                      placeholder="타겟 고객을 입력하세요"
                      className="font-semibold bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  ) : (
                    <p className="font-semibold">{plan.targetPersona}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 핵심 메시지 */}
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-pink-200" />
                <div className="flex-1">
                  <p className="text-xs text-pink-200">{t("핵심 메시지")}</p>
                  {isEditMode ? (
                    <Input
                      value={form.coreMessage || ''}
                      onChange={(e) => handleInputChange('coreMessage', e.target.value)}
                      placeholder="핵심 메시지를 입력하세요"
                      className="text-sm font-semibold bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  ) : (
                    <p className="text-sm font-semibold">{plan.coreMessage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 진행률 표시 */}
          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/90">
                {t("전체 진행률")}
              </span>
              <span className="text-lg font-bold">
                {calculateOverallProgress(objectives)}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/20">
              <div
                className="h-3 transition-all duration-700 rounded-full shadow-sm bg-gradient-to-r from-green-400 to-blue-400"
                style={{ width: `${calculateOverallProgress(objectives)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-2 ml-4">
          {isEditMode ? (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                취소
              </Button>
              <Button
                onClick={handleSave}
                className="text-white bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEditStart}
              className="text-white bg-white/10 border-white/30 hover:bg-white/20 backdrop-blur-sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              수정
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanHeader;
