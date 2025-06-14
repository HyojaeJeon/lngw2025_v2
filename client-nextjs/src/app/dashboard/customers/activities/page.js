
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';
import { Badge } from '@/components/ui/badge.js';
import { useTranslation } from '@/hooks/useLanguage.js';
import { useToast } from '@/hooks/useToast.js';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  FileText, 
  Clock,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import {
  GET_CUSTOMER_ACTIVITIES,
  GET_CUSTOMER_ACTIVITY_TYPES,
  DELETE_CUSTOMER_ACTIVITY
} from '@/lib/graphql/customerActivityOperations.js';
import { GET_CUSTOMERS } from '@/lib/graphql/customerOperations.js';
import CustomSelect from '@/components/common/CustomSelect.js';
import CustomerActivityModal from './components/CustomerActivityModal.js';

const CustomerActivitiesPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filter, setFilter] = useState({});

  // GraphQL 쿼리
  const { data: activitiesData, loading: activitiesLoading, refetch: refetchActivities } = useQuery(GET_CUSTOMER_ACTIVITIES, {
    variables: {
      filter: filter,
      limit: 50,
      offset: 0
    }
  });

  const { data: typesData } = useQuery(GET_CUSTOMER_ACTIVITY_TYPES);
  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    variables: { limit: 100 }
  });

  const [deleteActivity] = useMutation(DELETE_CUSTOMER_ACTIVITY, {
    onCompleted: () => {
      toast({
        title: t('common.success'),
        description: '활동 이력이 삭제되었습니다.',
      });
      refetchActivities();
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // 필터 적용
  useEffect(() => {
    const newFilter = {};
    if (selectedCustomer) newFilter.customerId = selectedCustomer;
    if (selectedType) newFilter.type = selectedType;
    setFilter(newFilter);
  }, [selectedCustomer, selectedType]);

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

  // 활동 유형별 색상
  const getActivityTypeColor = (type) => {
    const colorMap = {
      meeting: 'bg-blue-100 text-blue-800',
      call: 'bg-green-100 text-green-800',
      email: 'bg-purple-100 text-purple-800',
      visit: 'bg-orange-100 text-orange-800',
      demo: 'bg-indigo-100 text-indigo-800',
      presentation: 'bg-pink-100 text-pink-800',
      negotiation: 'bg-red-100 text-red-800',
      followup: 'bg-yellow-100 text-yellow-800',
      support: 'bg-cyan-100 text-cyan-800',
      consultation: 'bg-emerald-100 text-emerald-800'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  // 활동 유형별 아이콘
  const getActivityTypeIcon = (type) => {
    const iconMap = {
      meeting: Calendar,
      call: Phone,
      email: Mail,
      visit: User,
      demo: FileText,
      presentation: FileText,
      negotiation: FileText,
      followup: Clock,
      support: FileText,
      consultation: FileText
    };
    const IconComponent = iconMap[type] || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 활동 이력을 삭제하시겠습니까?')) {
      await deleteActivity({ variables: { id } });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingActivity(null);
  };

  const handleActivitySaved = () => {
    refetchActivities();
    handleModalClose();
  };

  const filteredActivities = activitiesData?.customerActivities?.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const customerOptions = customersData?.customers?.map(customer => ({
    value: customer.id,
    label: customer.name
  })) || [];

  const typeOptions = typesData?.customerActivityTypes?.map(type => ({
    value: type,
    label: getActivityTypeLabel(type)
  })) || [];

  if (activitiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            고객 활동 이력 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            고객과의 모든 상호작용을 기록하고 관리합니다
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          활동 추가
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="활동 제목, 고객사명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <CustomSelect
              options={customerOptions}
              value={selectedCustomer}
              onChange={setSelectedCustomer}
              placeholder="고객사 선택"
              clearable
            />
            
            <CustomSelect
              options={typeOptions}
              value={selectedType}
              onChange={setSelectedType}
              placeholder="활동 유형 선택"
              clearable
            />
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCustomer('');
                setSelectedType('');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              필터 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 활동 이력 목록 */}
      <div className="grid gap-4">
        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">등록된 활동 이력이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${getActivityTypeColor(activity.type)} flex items-center gap-1`}>
                        {getActivityTypeIcon(activity.type)}
                        {getActivityTypeLabel(activity.type)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.activityDate).toLocaleDateString('ko-KR')}
                      </span>
                      {activity.duration && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.duration}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {activity.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {activity.customer?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        작성자: {activity.creator?.name}
                      </span>
                    </div>
                    
                    {activity.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                    
                    {activity.participants && activity.participants.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-600">참석자:</span>
                        <div className="flex flex-wrap gap-1">
                          {activity.participants.map((participant, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activity.result && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <span className="text-sm font-medium text-green-800">결과:</span>
                        <p className="text-sm text-green-700 mt-1">{activity.result}</p>
                      </div>
                    )}
                    
                    {activity.nextAction && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <span className="text-sm font-medium text-orange-800">후속조치:</span>
                        <p className="text-sm text-orange-700 mt-1">{activity.nextAction}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(activity)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(activity.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/dashboard/customers/${activity.customerId}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 활동 추가/수정 모달 */}
      {showModal && (
        <CustomerActivityModal
          activity={editingActivity}
          onClose={handleModalClose}
          onSave={handleActivitySaved}
        />
      )}
    </div>
  );
};

export default CustomerActivitiesPage;
