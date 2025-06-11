
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { useLanguage } from "@/hooks/useLanguage.js";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  Target,
} from "lucide-react";

export default function CampaignCalendarPage() {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // month, week, list
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "신제품 런칭 캠페인",
      startDate: "2024-06-10",
      endDate: "2024-06-24",
      status: "active",
      budget: 50000,
      spent: 32000,
      manager: "김마케팅",
      platforms: ["Instagram", "Facebook", "TikTok"],
      kpis: {
        reach: 125000,
        engagement: 8500,
        conversion: 2.3,
        roi: 185
      },
      color: "blue"
    },
    {
      id: 2,
      title: "여름 스킨케어 프로모션",
      startDate: "2024-06-15",
      endDate: "2024-07-15",
      status: "scheduled",
      budget: 30000,
      spent: 0,
      manager: "박광고",
      platforms: ["YouTube", "Instagram"],
      kpis: {
        reach: 0,
        engagement: 0,
        conversion: 0,
        roi: 0
      },
      color: "green"
    },
    {
      id: 3,
      title: "브랜드 인지도 캠페인",
      startDate: "2024-05-20",
      endDate: "2024-06-05",
      status: "completed",
      budget: 25000,
      spent: 24500,
      manager: "이컨텐츠",
      platforms: ["Facebook", "Instagram"],
      kpis: {
        reach: 95000,
        engagement: 12000,
        conversion: 1.8,
        roi: 142
      },
      color: "purple"
    }
  ]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    startDate: "",
    endDate: "",
    budget: "",
    manager: "",
    platforms: [],
    description: "",
    goals: [""],
    color: "blue"
  });

  const statusConfig = {
    scheduled: { label: "예정", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    active: { label: "진행중", color: "bg-green-100 text-green-800", icon: PlayCircle },
    paused: { label: "일시정지", color: "bg-orange-100 text-orange-800", icon: PauseCircle },
    completed: { label: "완료", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    cancelled: { label: "취소", color: "bg-red-100 text-red-800", icon: XCircle }
  };

  const platformOptions = ["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn", "Twitter"];
  const colorOptions = ["blue", "green", "purple", "red", "yellow", "indigo"];

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getCampaignsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return campaigns.filter(campaign => {
      return dateStr >= campaign.startDate && dateStr <= campaign.endDate;
    });
  };

  const addGoal = () => {
    setNewCampaign(prev => ({
      ...prev,
      goals: [...prev.goals, ""]
    }));
  };

  const updateGoal = (index, value) => {
    setNewCampaign(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal)
    }));
  };

  const removeGoal = (index) => {
    setNewCampaign(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handlePlatformToggle = (platform) => {
    setNewCampaign(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSaveCampaign = () => {
    if (newCampaign.title && newCampaign.startDate && newCampaign.endDate) {
      const campaign = {
        ...newCampaign,
        id: Date.now(),
        status: "scheduled",
        spent: 0,
        kpis: { reach: 0, engagement: 0, conversion: 0, roi: 0 }
      };
      setCampaigns(prev => [...prev, campaign]);
      setNewCampaign({
        title: "",
        startDate: "",
        endDate: "",
        budget: "",
        manager: "",
        platforms: [],
        description: "",
        goals: [""],
        color: "blue"
      });
      setShowCampaignModal(false);
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                캠페인 캘린더
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                분기별·월별 캠페인 일정 관리 및 진행 현황을 추적합니다
              </p>
            </div>
            <Button onClick={() => setShowCampaignModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              캠페인 추가
            </Button>
          </div>
        </div>

        {/* View Controls */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            {["month", "week", "list"].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode(mode)}
              >
                {mode === "month" ? "월별" : mode === "week" ? "주별" : "목록"}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
            >
              이전
            </Button>
            <span className="text-lg font-semibold">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
            >
              다음
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        {viewMode === "month" && (
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <div key={day} className="p-4 text-center font-medium bg-gray-50 dark:bg-gray-800">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const dayCampaigns = getCampaignsForDate(date);
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border-r border-b ${
                        isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                      } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <div className={`text-sm mb-2 ${
                        isCurrentMonth ? "text-gray-900 dark:text-white" : "text-gray-400"
                      } ${isToday ? "font-bold text-blue-600" : ""}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayCampaigns.slice(0, 2).map((campaign) => (
                          <div
                            key={campaign.id}
                            className={`text-xs p-1 rounded truncate cursor-pointer ${
                              campaign.color === "blue" ? "bg-blue-100 text-blue-800" :
                              campaign.color === "green" ? "bg-green-100 text-green-800" :
                              campaign.color === "purple" ? "bg-purple-100 text-purple-800" :
                              campaign.color === "red" ? "bg-red-100 text-red-800" :
                              campaign.color === "yellow" ? "bg-yellow-100 text-yellow-800" :
                              "bg-indigo-100 text-indigo-800"
                            }`}
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            {campaign.title}
                          </div>
                        ))}
                        {dayCampaigns.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayCampaigns.length - 2} 더보기
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaign List View */}
        {viewMode === "list" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const StatusIcon = statusConfig[campaign.status].icon;
              const progressPercentage = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;
              
              return (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[campaign.status].color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {statusConfig[campaign.status].label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {campaign.startDate} ~ {campaign.endDate}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Budget Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>예산 사용률</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              progressPercentage > 90 ? "bg-red-500" :
                              progressPercentage > 70 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>사용: ${campaign.spent?.toLocaleString()}</span>
                          <span>총예산: ${campaign.budget?.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* KPIs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="text-xs text-gray-600">도달률</p>
                          <p className="font-semibold">{campaign.kpis.reach?.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <p className="text-xs text-gray-600">참여율</p>
                          <p className="font-semibold">{campaign.kpis.engagement?.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Manager & Platforms */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>담당자: {campaign.manager}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {campaign.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          상세
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          수정
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Campaign Details Modal */}
        {selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedCampaign.title}</CardTitle>
                  <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Campaign Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">캠페인 정보</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>기간:</strong> {selectedCampaign.startDate} ~ {selectedCampaign.endDate}</p>
                        <p><strong>상태:</strong> {statusConfig[selectedCampaign.status].label}</p>
                        <p><strong>담당자:</strong> {selectedCampaign.manager}</p>
                        <p><strong>플랫폼:</strong> {selectedCampaign.platforms.join(", ")}</p>
                      </div>
                    </div>
                    
                    {/* Budget */}
                    <div>
                      <h3 className="font-semibold mb-2">예산 현황</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>총 예산</span>
                          <span>${selectedCampaign.budget?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>사용 금액</span>
                          <span>${selectedCampaign.spent?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>잔여 예산</span>
                          <span>${(selectedCampaign.budget - selectedCampaign.spent)?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">성과 지표 (KPI)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">도달률</p>
                        <p className="text-2xl font-bold">{selectedCampaign.kpis.reach?.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">참여율</p>
                        <p className="text-2xl font-bold">{selectedCampaign.kpis.engagement?.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">전환율</p>
                        <p className="text-2xl font-bold">{selectedCampaign.kpis.conversion}%</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <DollarSign className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">ROI</p>
                        <p className="text-2xl font-bold">{selectedCampaign.kpis.roi}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Campaign Modal */}
        {showCampaignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>새 캠페인 추가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label>캠페인명</Label>
                    <Input
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="캠페인명을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label>담당자</Label>
                    <Input
                      value={newCampaign.manager}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, manager: e.target.value }))}
                      placeholder="담당자명을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label>시작일</Label>
                    <Input
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>종료일</Label>
                    <Input
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>예산 ($)</Label>
                    <Input
                      type="number"
                      value={newCampaign.budget}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>색상</Label>
                    <div className="flex space-x-2 mt-1">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewCampaign(prev => ({ ...prev, color }))}
                          className={`w-6 h-6 rounded-full ${
                            color === "blue" ? "bg-blue-500" :
                            color === "green" ? "bg-green-500" :
                            color === "purple" ? "bg-purple-500" :
                            color === "red" ? "bg-red-500" :
                            color === "yellow" ? "bg-yellow-500" :
                            "bg-indigo-500"
                          } ${newCampaign.color === color ? "ring-2 ring-gray-400" : ""}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <Label>플랫폼 선택</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {platformOptions.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => handlePlatformToggle(platform)}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          newCampaign.platforms.includes(platform)
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label>캠페인 설명</Label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="캠페인 목표와 설명을 입력하세요"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md h-24 resize-none"
                  />
                </div>

                {/* Goals */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>캠페인 목표</Label>
                    <Button size="sm" variant="outline" onClick={addGoal}>
                      <Plus className="w-3 h-3 mr-1" />
                      추가
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newCampaign.goals.map((goal, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={goal}
                          onChange={(e) => updateGoal(index, e.target.value)}
                          placeholder={`목표 ${index + 1}`}
                          className="flex-1"
                        />
                        {newCampaign.goals.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeGoal(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCampaignModal(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSaveCampaign}>
                    캠페인 추가
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
