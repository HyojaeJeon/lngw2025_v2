
"use client";

import React, { useState } from "react";
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
import { useLanguage } from "@/contexts/languageContext.js";

export default function CustomerHistoryPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // 샘플 활동 이력 데이터
  const historyData = [
    {
      id: 1,
      customer: "삼성전자",
      contact: "김철수 과장",
      type: "미팅",
      title: "프로젝트 킥오프 미팅",
      description: "새로운 ERP 시스템 구축 프로젝트 시작을 위한 킥오프 미팅을 진행했습니다.",
      date: "2024-01-15",
      time: "14:00",
      duration: "2시간",
      participants: ["김철수 과장", "박영희 대리", "이민수 팀장"],
      result: "성공",
      nextAction: "요구사항 분석서 작성",
      attachments: ["킥오프미팅_회의록.pdf", "프로젝트_일정표.xlsx"]
    },
    {
      id: 2,
      customer: "LG화학",
      contact: "이민수 대리",
      type: "통화",
      title: "시스템 오류 관련 긴급 통화",
      description: "생산 관리 시스템에서 발생한 오류에 대한 긴급 지원 요청 통화",
      date: "2024-01-14",
      time: "16:30",
      duration: "30분",
      participants: ["이민수 대리", "최민정 엔지니어"],
      result: "해결",
      nextAction: "시스템 패치 적용",
      attachments: ["오류_로그_분석.txt"]
    },
    {
      id: 3,
      customer: "현대모비스",
      contact: "정수영 차장",
      type: "이메일",
      title: "월간 보고서 발송",
      description: "12월 시스템 운영 현황 및 성능 분석 보고서를 발송했습니다.",
      date: "2024-01-10",
      time: "09:00",
      duration: "-",
      participants: ["정수영 차장"],
      result: "발송완료",
      nextAction: "피드백 대기",
      attachments: ["12월_운영현황_보고서.pdf", "성능_분석_차트.png"]
    },
    {
      id: 4,
      customer: "삼성전자",
      contact: "김철수 과장",
      type: "방문",
      title: "현장 시스템 점검",
      description: "설치된 시스템의 정기 점검 및 사용자 교육을 실시했습니다.",
      date: "2024-01-08",
      time: "10:00",
      duration: "4시간",
      participants: ["김철수 과장", "박영희 대리", "현장 담당자 3명"],
      result: "완료",
      nextAction: "점검 보고서 제출",
      attachments: ["점검_체크리스트.pdf", "교육_자료.pptx"]
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case "미팅":
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case "통화":
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case "이메일":
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "방문":
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "성공": case "완료": case "해결": case "발송완료":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "진행중":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "실패": case "취소":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomer = selectedCustomer === "" || item.customer === selectedCustomer;
    return matchesSearch && matchesCustomer;
  });

  const customers = [...new Set(historyData.map(item => item.customer))];

  return (
    
      <div className="space-y-8 animate-fadeIn">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent">
            {t('customers.history')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            고객과의 모든 활동 이력을 관리합니다
          </p>
        </div>

        {/* 검색 및 필터 */}
        <Card className="transform transition-all duration-500 hover:shadow-xl
                        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              검색 및 필터
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="제목, 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all duration-300 focus:scale-105 focus:shadow-md"
              />
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-300 focus:scale-105 focus:shadow-md"
              >
                <option value="">모든 고객</option>
                {customers.map(customer => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                               transition-all duration-300 transform hover:scale-105">
                새 활동 등록
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 활동 이력 타임라인 */}
        <div className="space-y-6">
          {filteredHistory.map((item, index) => (
            <Card key={item.id} 
                  className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg
                           animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          {item.title}
                        </CardTitle>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 
                                       rounded-full text-xs font-medium">
                          {item.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getResultColor(item.result)}`}>
                          {item.result}
                        </span>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {item.customer} - {item.contact}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    <div>{item.date}</div>
                    <div>{item.time}</div>
                    {item.duration !== "-" && <div>소요시간: {item.duration}</div>}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
                
                {item.participants.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">참석자:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.participants.map((participant, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 
                                                   text-gray-700 dark:text-gray-300 rounded text-sm">
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {item.nextAction && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">다음 액션:</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {item.nextAction}
                    </p>
                  </div>
                )}
                
                {item.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">첨부파일:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.attachments.map((file, idx) => (
                        <button key={idx} 
                                className="flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900 
                                         text-blue-700 dark:text-blue-300 rounded text-sm
                                         hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {file}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" size="sm"
                          className="transition-all duration-300 transform hover:scale-105">
                    수정
                  </Button>
                  <Button variant="outline" size="sm"
                          className="transition-all duration-300 transform hover:scale-105">
                    복사
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                검색 조건에 맞는 활동 이력이 없습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    
  );
}
