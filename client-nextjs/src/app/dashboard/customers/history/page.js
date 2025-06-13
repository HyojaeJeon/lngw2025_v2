
"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import { useToast } from "@/hooks/useToast.js";
import { 
  GET_CUSTOMER_ACTIVITIES, 
  CREATE_CUSTOMER_ACTIVITY, 
  UPDATE_CUSTOMER_ACTIVITY, 
  DELETE_CUSTOMER_ACTIVITY 
} from "@/lib/graphql/customerActivityOperations.js";
import { GET_CUSTOMERS } from "@/lib/graphql/customerOperations.js";
import CustomCalendar from "@/components/common/CustomCalendar.js";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  X,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Save,
  User
} from "lucide-react";

// 활동 등록/수정 모달 컴포넌트
const ActivityModal = ({ isOpen, onClose, activity, onSave, customers }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customerId: '',
    type: '미팅',
    title: '',
    description: '',
    activityDate: new Date().toISOString().split('T')[0],
    duration: '',
    participants: [],
    result: '진행중',
    nextAction: '',
    attachments: []
  });
  
  const [newParticipant, setNewParticipant] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    if (activity) {
      setFormData({
        customerId: activity.customerId || '',
        type: activity.type || '미팅',
        title: activity.title || '',
        description: activity.description || '',
        activityDate: activity.activityDate ? new Date(activity.activityDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        duration: activity.duration || '',
        participants: activity.participants || [],
        result: activity.result || '진행중',
        nextAction: activity.nextAction || '',
        attachments: activity.attachments || []
      });
    } else {
      setFormData({
        customerId: '',
        type: '미팅',
        title: '',
        description: '',
        activityDate: new Date().toISOString().split('T')[0],
        duration: '',
        participants: [],
        result: '진행중',
        nextAction: '',
        attachments: []
      });
    }
  }, [activity, isOpen]);

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

  const handleFileUpload = async (files) => {
    setUploadingFiles(true);
    const uploadedFiles = [];

    for (const file of files) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('type', 'activity');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        if (response.ok) {
          const result = await response.json();
          uploadedFiles.push({
            fileName: result.fileName,
            originalName: result.originalName,
            url: result.url,
            size: result.size,
            type: result.type
          });
        }
      } catch (error) {
        console.error('파일 업로드 오류:', error);
        toast({
          title: "오류",
          description: `${file.name} 업로드에 실패했습니다.`,
          variant: "destructive",
        });
      }
    }

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...uploadedFiles]
    }));
    setUploadingFiles(false);
  };

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.title) {
      toast({
        title: "오류",
        description: "고객과 제목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {activity ? '활동 수정' : '새 활동 등록'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  고객 선택 *
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">고객을 선택하세요</option>
                  {customers?.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  활동 유형 *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="미팅">미팅</option>
                  <option value="통화">통화</option>
                  <option value="이메일">이메일</option>
                  <option value="방문">방문</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                활동 제목 *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="활동 제목을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                활동 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="활동에 대한 상세한 설명을 입력하세요"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  활동 일시 *
                </label>
                <Input
                  type="date"
                  value={formData.activityDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, activityDate: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  소요 시간
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="예: 2시간, 30분"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  결과
                </label>
                <select
                  value={formData.result}
                  onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="성공">성공</option>
                  <option value="완료">완료</option>
                  <option value="해결">해결</option>
                  <option value="발송완료">발송완료</option>
                  <option value="진행중">진행중</option>
                  <option value="실패">실패</option>
                  <option value="취소">취소</option>
                </select>
              </div>
            </div>

            {/* 참석자 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                참석자
              </label>
              <div className="flex gap-2 mb-2">
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
              <div className="flex flex-wrap gap-2">
                {formData.participants.map((participant, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    {participant}
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 다음 액션 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                다음 액션
              </label>
              <Input
                value={formData.nextAction}
                onChange={(e) => setFormData(prev => ({ ...prev, nextAction: e.target.value }))}
                placeholder="다음에 수행할 액션을 입력하세요"
              />
            </div>

            {/* 첨부파일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                첨부파일
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                  className="hidden"
                  id="file-upload"
                  disabled={uploadingFiles}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {uploadingFiles ? '파일 업로드 중...' : '파일을 선택하거나 드래그하세요'}
                  </span>
                </label>
              </div>
              
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {file.originalName || file.fileName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.url && (
                          <a
                            href={file.url}
                            download={file.originalName || file.fileName}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={uploadingFiles}>
              <Save className="w-4 h-4 mr-2" />
              {activity ? '수정' : '등록'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CustomerHistoryPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedResult, setSelectedResult] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  // GraphQL 쿼리
  const { data: activitiesData, loading: activitiesLoading, error: activitiesError, refetch } = useQuery(GET_CUSTOMER_ACTIVITIES, {
    variables: {
      limit: 50,
      offset: 0,
      filter: {
        ...(selectedCustomer && { customerId: selectedCustomer }),
        ...(selectedType && { type: selectedType }),
        ...(selectedResult && { result: selectedResult }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        ...(searchTerm && { search: searchTerm })
      }
    },
    fetchPolicy: 'cache-and-network'
  });

  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    variables: { limit: 100, offset: 0 }
  });

  // GraphQL 뮤테이션
  const [createActivity] = useMutation(CREATE_CUSTOMER_ACTIVITY, {
    onCompleted: () => {
      toast({
        title: "성공",
        description: "활동이 성공적으로 등록되었습니다.",
      });
      setShowModal(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const [updateActivity] = useMutation(UPDATE_CUSTOMER_ACTIVITY, {
    onCompleted: () => {
      toast({
        title: "성공",
        description: "활동이 성공적으로 수정되었습니다.",
      });
      setShowModal(false);
      setEditingActivity(null);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const [deleteActivity] = useMutation(DELETE_CUSTOMER_ACTIVITY, {
    onCompleted: () => {
      toast({
        title: "성공",
        description: "활동이 성공적으로 삭제되었습니다.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSaveActivity = async (formData) => {
    try {
      const activityInput = {
        customerId: formData.customerId,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        activityDate: formData.activityDate,
        duration: formData.duration,
        participants: formData.participants,
        result: formData.result,
        nextAction: formData.nextAction,
        attachments: formData.attachments.map(file => file.originalName || file.fileName)
      };

      if (editingActivity) {
        await updateActivity({
          variables: {
            id: editingActivity.id,
            input: activityInput
          }
        });
      } else {
        await createActivity({
          variables: {
            input: activityInput
          }
        });
      }
    } catch (error) {
      console.error('활동 저장 오류:', error);
    }
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setShowModal(true);
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('정말로 이 활동을 삭제하시겠습니까?')) {
      await deleteActivity({
        variables: { id: activityId }
      });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "미팅":
        return <Users className="w-5 h-5 text-blue-500" />;
      case "통화":
        return <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>;
      case "이메일":
        return <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>;
      case "방문":
        return <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case "성공":
      case "완료":
      case "해결":
      case "발송완료":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "진행중":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "실패":
      case "취소":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "성공":
      case "완료":
      case "해결":
      case "발송완료":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "진행중":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "실패":
      case "취소":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const activities = activitiesData?.customerActivities || [];
  const customers = customersData?.customers || [];

  if (activitiesError) {
    console.error('활동 조회 오류:', activitiesError);
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t("customers.history") || "고객 활동 이력"}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          고객과의 모든 활동 이력을 관리하고 추적합니다
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="transform transition-all duration-500 hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Search className="w-6 h-6 mr-3 text-blue-500" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <Input
              placeholder="제목, 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="transition-all duration-300 focus:scale-105 focus:shadow-md"
            />
            
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:scale-105 focus:shadow-md"
            >
              <option value="">모든 고객</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:scale-105 focus:shadow-md"
            >
              <option value="">모든 유형</option>
              <option value="미팅">미팅</option>
              <option value="통화">통화</option>
              <option value="이메일">이메일</option>
              <option value="방문">방문</option>
              <option value="기타">기타</option>
            </select>

            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:scale-105 focus:shadow-md"
            >
              <option value="">모든 결과</option>
              <option value="성공">성공</option>
              <option value="완료">완료</option>
              <option value="해결">해결</option>
              <option value="발송완료">발송완료</option>
              <option value="진행중">진행중</option>
              <option value="실패">실패</option>
              <option value="취소">취소</option>
            </select>

            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 활동 등록
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                시작 날짜
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                종료 날짜
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 활동 이력 리스트 */}
      <div className="space-y-6">
        {activitiesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">활동 이력을 불러오는 중...</p>
          </div>
        ) : activities.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || selectedCustomer || selectedType || selectedResult ? 
                  "검색 조건에 맞는 활동 이력이 없습니다." : 
                  "등록된 활동 이력이 없습니다. 새 활동을 등록해보세요."}
              </p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity, index) => (
            <Card
              key={activity.id}
              className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          {activity.title}
                        </CardTitle>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                          {activity.type}
                        </span>
                        <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getResultColor(activity.result)}`}>
                          {getResultIcon(activity.result)}
                          <span className="ml-1">{activity.result}</span>
                        </span>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {activity.customer?.name} - {activity.customer?.contactName}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400 mr-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(activity.activityDate).toLocaleDateString("ko-KR")}
                      </div>
                      {activity.duration && (
                        <div className="flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {activity.duration}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditActivity(activity)}
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {activity.description && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {activity.description}
                  </p>
                )}

                {activity.participants && activity.participants.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      참석자:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activity.participants.map((participant, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          <User className="w-3 h-3 mr-1" />
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activity.nextAction && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      다음 액션:
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      {activity.nextAction}
                    </p>
                  </div>
                )}

                {activity.attachments && activity.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      첨부파일:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activity.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                            {file}
                          </span>
                          <Download className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4 mr-1" />
                    작성자: {activity.creator?.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.createdAt).toLocaleString("ko-KR")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 활동 등록/수정 모달 */}
      <ActivityModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingActivity(null);
        }}
        activity={editingActivity}
        onSave={handleSaveActivity}
        customers={customers}
      />
    </div>
  );
}
