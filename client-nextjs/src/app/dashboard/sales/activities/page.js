
"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { useLanguage } from '@/hooks/useLanguage.js';

export default function SalesActivitiesPage() {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'meeting',
      title: '고객 미팅',
      customer: '삼성전자',
      date: '2024-06-01',
      time: '14:00',
      notes: '제품 데모 진행 및 요구사항 수집',
      status: 'completed'
    },
    {
      id: 2,
      type: 'call',
      title: '전화 상담',
      customer: 'LG화학',
      date: '2024-06-02',
      time: '10:30',
      notes: '견적서 관련 문의 대응',
      status: 'completed'
    },
    {
      id: 3,
      type: 'email',
      title: '이메일 팔로업',
      customer: 'SK하이닉스',
      date: '2024-06-03',
      time: '09:00',
      notes: '제안서 발송 예정',
      status: 'scheduled'
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'meeting',
    title: '',
    customer: '',
    date: '',
    time: '',
    notes: ''
  });

  const activityTypes = [
    { value: 'meeting', label: '미팅', icon: '👥', color: 'bg-blue-500' },
    { value: 'call', label: '전화', icon: '📞', color: 'bg-green-500' },
    { value: 'email', label: '이메일', icon: '✉️', color: 'bg-purple-500' },
    { value: 'visit', label: '방문', icon: '🚗', color: 'bg-orange-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newActivity = {
      id: activities.length + 1,
      ...formData,
      status: 'scheduled'
    };
    setActivities([newActivity, ...activities]);
    setFormData({
      type: 'meeting',
      title: '',
      customer: '',
      date: '',
      time: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const getActivityTypeInfo = (type) => {
    return activityTypes.find(t => t.value === type) || activityTypes[0];
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                             bg-clip-text text-transparent">
                {t('sales.activities')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                영업 활동을 계획하고 관리하세요
              </p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                        text-white shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              활동 추가
            </Button>
          </div>
        </div>

        {/* 활동 유형별 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activityTypes.map((type, index) => {
            const count = activities.filter(activity => activity.type === type.value).length;
            return (
              <Card 
                key={type.value}
                className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg
                          animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${type.color} flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-2xl">{type.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{type.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 추가 폼 */}
        {showAddForm && (
          <Card className="transform transition-all duration-500 animate-slideUp bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">새 영업 활동 추가</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">활동 유형</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600"
                      required
                    >
                      {activityTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">제목</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="customer" className="text-gray-700 dark:text-gray-300">고객</Label>
                    <Input
                      id="customer"
                      value={formData.customer}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">날짜</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">시간</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">메모</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    추가
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 활동 목록 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">최근 활동</h2>
          
          {activities.map((activity, index) => {
            const typeInfo = getActivityTypeInfo(activity.type);
            return (
              <Card 
                key={activity.id}
                className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg
                          animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full ${typeInfo.color} flex items-center justify-center`}>
                        <span className="text-lg">{typeInfo.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {activity.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                            activity.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                          }`}>
                            {activity.status === 'completed' ? '완료' : '예정'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                          <div>
                            <span className="font-medium">고객:</span> {activity.customer}
                          </div>
                          <div>
                            <span className="font-medium">날짜:</span> {formatDate(activity.date)}
                          </div>
                          <div>
                            <span className="font-medium">시간:</span> {activity.time}
                          </div>
                        </div>
                        
                        {activity.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {activity.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            const updatedActivities = activities.map(a => 
                              a.id === activity.id ? {...a, status: 'completed'} : a
                            );
                            setActivities(updatedActivities);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          완료
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
