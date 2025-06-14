
"use client";

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import { useToast } from '@/hooks/useToast.js';
import { X, Plus, Trash2, Calendar, Clock } from 'lucide-react';
import {
  CREATE_CUSTOMER_ACTIVITY,
  UPDATE_CUSTOMER_ACTIVITY,
  GET_CUSTOMER_ACTIVITY_TYPES
} from '@/lib/graphql/customerActivityOperations.js';
import { GET_CUSTOMERS } from '@/lib/graphql/customerOperations.js';
import CustomSelect from '@/components/common/CustomSelect.js';

const CustomerActivityModal = ({ activity, onClose, onSave }) => {
  const { toast } = useToast();
  const isEditing = !!activity;
  
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
  
  const [newParticipant, setNewParticipant] = useState('');

  // GraphQL 쿼리
  const { data: typesData } = useQuery(GET_CUSTOMER_ACTIVITY_TYPES);
  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    variables: { limit: 100 }
  });

  // 뮤테이션
  const [createActivity, { loading: creating }] = useMutation(CREATE_CUSTOMER_ACTIVITY, {
    onCompleted: () => {
      toast({
        title: '성공',
        description: '활동 이력이 등록되었습니다.',
      });
      onSave();
    },
    onError: (error) => {
      toast({
        title: '오류',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const [updateActivity, { loading: updating }] = useMutation(UPDATE_CUSTOMER_ACTIVITY, {
    onCompleted: () => {
      toast({
        title: '성공',
        description: '활동 이력이 수정되었습니다.',
      });
      onSave();
    },
    onError: (error) => {
      toast({
        title: '오류',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    if (activity) {
      setFormData({
        customerId: activity.customerId,
        type: activity.type,
        title: activity.title,
        description: activity.description || '',
        activityDate: activity.activityDate ? activity.activityDate.split('T')[0] : '',
        duration: activity.duration || '',
        participants: activity.participants || [],
        result: activity.result || '',
        nextAction: activity.nextAction || '',
        attachments: activity.attachments || []
      });
    } else {
      // 새 활동인 경우 현재 날짜로 초기화
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        activityDate: today
      }));
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }));
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (index) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.type || !formData.title || !formData.activityDate) {
      toast({
        title: '입력 오류',
        description: '필수 항목을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    const input = {
      customerId: formData.customerId,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      activityDate: formData.activityDate,
      duration: formData.duration,
      participants: formData.participants,
      result: formData.result,
      nextAction: formData.nextAction,
      attachments: formData.attachments
    };

    try {
      if (isEditing) {
        await updateActivity({
          variables: {
            id: activity.id,
            input
          }
        });
      } else {
        await createActivity({
          variables: { input }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? '활동 이력 수정' : '새 활동 이력 등록'}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerId" className="text-sm font-medium">
                  고객사 <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  options={customerOptions}
                  value={formData.customerId}
                  onChange={(value) => handleInputChange('customerId', value)}
                  placeholder="고객사를 선택하세요"
                  searchable
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium">
                  활동 유형 <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  options={typeOptions}
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', value)}
                  placeholder="활동 유형을 선택하세요"
                />
              </div>

              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  활동 제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="활동 제목을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="activityDate" className="text-sm font-medium">
                    활동 날짜 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="activityDate"
                      type="date"
                      value={formData.activityDate}
                      onChange={(e) => handleInputChange('activityDate', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-sm font-medium">
                    소요 시간
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="예: 1시간 30분"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  활동 상세 내용
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="활동 내용을 상세히 기록하세요"
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">참석자</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      placeholder="참석자 이름을 입력하세요"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParticipant())}
                    />
                    <Button type="button" onClick={handleAddParticipant} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.participants.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.participants.map((participant, index) => (
                        <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                          {participant}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveParticipant(index)}
                            className="h-auto p-0 ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 결과 및 후속조치 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="result" className="text-sm font-medium">
                활동 결과
              </Label>
              <textarea
                id="result"
                value={formData.result}
                onChange={(e) => handleInputChange('result', e.target.value)}
                placeholder="활동 결과를 입력하세요"
                className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />
            </div>

            <div>
              <Label htmlFor="nextAction" className="text-sm font-medium">
                후속 조치
              </Label>
              <textarea
                id="nextAction"
                value={formData.nextAction}
                onChange={(e) => handleInputChange('nextAction', e.target.value)}
                placeholder="후속 조치 사항을 입력하세요"
                className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={creating || updating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {creating || updating ? '저장 중...' : (isEditing ? '수정' : '등록')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerActivityModal;
