
"use client";

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';
import { Badge } from '@/components/ui/badge.js';
import { useTranslation } from '@/hooks/useLanguage.js';
import { useToast } from '@/hooks/useToast.js';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Plus,
  Minus,
  Save,
  Loader2
} from 'lucide-react';
import {
  CREATE_CUSTOMER_ACTIVITY,
  UPDATE_CUSTOMER_ACTIVITY,
  GET_CUSTOMER_ACTIVITY_TYPES
} from '@/lib/graphql/customerActivityOperations.js';
import { GET_CUSTOMERS } from '@/lib/graphql/customerOperations.js';
import CustomSelect from '@/components/common/CustomSelect.js';

const CustomerActivityModal = ({ activity, onClose, onSave }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isEditing = !!activity;

  // 폼 상태
  const [formData, setFormData] = useState({
    customerId: '',
    type: '',
    title: '',
    description: '',
    activityDate: '',
    duration: '',
    participants: [],
    result: '',
    nextAction: '',
    attachments: []
  });

  const [participantInput, setParticipantInput] = useState('');
  const [errors, setErrors] = useState({});

  // GraphQL 쿼리 및 뮤테이션
  const { data: typesData } = useQuery(GET_CUSTOMER_ACTIVITY_TYPES);
  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    variables: { limit: 100 }
  });

  const [createActivity, { loading: createLoading }] = useMutation(CREATE_CUSTOMER_ACTIVITY, {
    onCompleted: () => {
      toast({
        title: t('common.success'),
        description: '활동이 성공적으로 등록되었습니다.',
      });
      onSave();
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const [updateActivity, { loading: updateLoading }] = useMutation(UPDATE_CUSTOMER_ACTIVITY, {
    onCompleted: () => {
      toast({
        title: t('common.success'),
        description: '활동이 성공적으로 수정되었습니다.',
      });
      onSave();
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // 편집 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (activity) {
      setFormData({
        customerId: activity.customerId,
        type: activity.type,
        title: activity.title,
        description: activity.description || '',
        activityDate: activity.activityDate ? activity.activityDate.slice(0, 16) : '',
        duration: activity.duration || '',
        participants: activity.participants || [],
        result: activity.result || '',
        nextAction: activity.nextAction || '',
        attachments: activity.attachments || []
      });
    }
  }, [activity]);

  // 활동 유형 번역
  const getActivityTypeLabel = (type) => {
    const typeMap = {
      meeting: '미팅',
      call: '전화',
      email: '이메일',
      visit: '방문',
      demo: '데모',
      presentation: '프레젠테이션',
      negotiation: '협상',
      followup: '후속조치',
      support: '지원',
      consultation: '상담'
    };
    return typeMap[type] || type;
  };

  // 폼 데이터 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // 참석자 추가
  const handleAddParticipant = () => {
    if (participantInput.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, participantInput.trim()]
      }));
      setParticipantInput('');
    }
  };

  // 참석자 제거
  const handleRemoveParticipant = (index) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) newErrors.customerId = '고객사를 선택해주세요.';
    if (!formData.type) newErrors.type = '활동 유형을 선택해주세요.';
    if (!formData.title.trim()) newErrors.title = '활동 제목을 입력해주세요.';
    if (!formData.activityDate) newErrors.activityDate = '활동 일시를 선택해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!validateForm()) return;

    const activityData = {
      ...formData,
      activityDate: new Date(formData.activityDate).toISOString()
    };

    try {
      if (isEditing) {
        await updateActivity({
          variables: {
            id: activity.id,
            input: activityData
          }
        });
      } else {
        await createActivity({
          variables: {
            input: activityData
          }
        });
      }
    } catch (error) {
      console.error('Activity save error:', error);
    }
  };

  const customerOptions = customersData?.customers?.map(customer => ({
    value: customer.id,
    label: customer.name
  })) || [];

  const typeOptions = typesData?.customerActivityTypes?.map(type => ({
    value: type,
    label: getActivityTypeLabel(type)
  })) || [];

  const loading = createLoading || updateLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>
            {isEditing ? '활동 수정' : '새 활동 등록'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                고객사 *
              </label>
              <CustomSelect
                options={customerOptions}
                value={formData.customerId}
                onChange={(value) => handleInputChange('customerId', value)}
                placeholder="고객사를 선택하세요"
                disabled={isEditing}
              />
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                활동 유형 *
              </label>
              <CustomSelect
                options={typeOptions}
                value={formData.type}
                onChange={(value) => handleInputChange('type', value)}
                placeholder="활동 유형을 선택하세요"
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              활동 제목 *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="활동 제목을 입력하세요"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* 일시 및 소요시간 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                활동 일시 *
              </label>
              <Input
                type="datetime-local"
                value={formData.activityDate}
                onChange={(e) => handleInputChange('activityDate', e.target.value)}
              />
              {errors.activityDate && (
                <p className="mt-1 text-sm text-red-600">{errors.activityDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                소요 시간
              </label>
              <Input
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="예: 1시간 30분"
              />
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              활동 내용
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="활동에 대한 상세한 설명을 입력하세요"
            />
          </div>

          {/* 참석자 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              참석자
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                placeholder="참석자 이름을 입력하세요"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddParticipant();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddParticipant}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.participants.map((participant, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-2">
                  {participant}
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* 결과 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              활동 결과
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
              value={formData.result}
              onChange={(e) => handleInputChange('result', e.target.value)}
              placeholder="활동의 결과나 성과를 입력하세요"
            />
          </div>

          {/* 후속조치 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              후속 조치
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
              value={formData.nextAction}
              onChange={(e) => handleInputChange('nextAction', e.target.value)}
              placeholder="다음에 취해야 할 조치나 계획을 입력하세요"
            />
          </div>
        </CardContent>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 dark:bg-gray-800">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? '수정' : '등록'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerActivityModal;
