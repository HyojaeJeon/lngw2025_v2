
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
import { useLanguage } from '@/hooks/useLanguage.js';

export default function CustomerGradesPage() {
  const { t } = useLanguage();

  // 샘플 등급별 고객 데이터
  const gradeData = {
    A: {
      name: "A등급 (VIP)",
      description: "최우수 고객",
      color: "bg-red-500",
      lightColor: "bg-red-50 dark:bg-red-900",
      textColor: "text-red-700 dark:text-red-300",
      criteria: ["연매출 10억원 이상", "계약기간 3년 이상", "추천 실적 있음"],
      benefits: ["전담 매니저 배정", "24시간 기술지원", "특별 할인율 적용"],
      customers: [
        { id: 1, company: "삼성전자", contact: "김철수 과장", revenue: "15억원", since: "2019-01-15" },
        { id: 2, company: "LG화학", contact: "이민수 대리", revenue: "12억원", since: "2020-03-20" }
      ]
    },
    B: {
      name: "B등급 (우수)",
      description: "우수 고객",
      color: "bg-blue-500",
      lightColor: "bg-blue-50 dark:bg-blue-900",
      textColor: "text-blue-700 dark:text-blue-300",
      criteria: ["연매출 5억원 이상", "계약기간 1년 이상", "정기 거래"],
      benefits: ["우선 기술지원", "분기별 비즈니스 리뷰", "표준 할인율 적용"],
      customers: [
        { id: 3, company: "현대모비스", contact: "정수영 차장", revenue: "8억원", since: "2021-06-10" },
        { id: 4, company: "SK하이닉스", contact: "박민영 대리", revenue: "6억원", since: "2022-01-15" },
        { id: 5, company: "POSCO", contact: "최도현 팀장", revenue: "7억원", since: "2021-09-01" }
      ]
    },
    C: {
      name: "C등급 (일반)",
      description: "일반 고객",
      color: "bg-gray-500",
      lightColor: "bg-gray-50 dark:bg-gray-700",
      textColor: "text-gray-700 dark:text-gray-300",
      criteria: ["신규 고객", "연매출 5억원 미만", "계약 초기 단계"],
      benefits: ["표준 기술지원", "기본 서비스 제공", "표준 가격 적용"],
      customers: [
        { id: 6, company: "네이버", contact: "김소영 과장", revenue: "2억원", since: "2023-11-20" },
        { id: 7, company: "카카오", contact: "이준호 대리", revenue: "3억원", since: "2023-12-05" },
        { id: 8, company: "쿠팡", contact: "박지원 팀장", revenue: "4억원", since: "2024-01-10" }
      ]
    }
  };

  const [selectedGrade, setSelectedGrade] = useState("A");

  const totalCustomers = Object.values(gradeData).reduce((sum, grade) => sum + grade.customers.length, 0);
  const totalRevenue = Object.values(gradeData).reduce((sum, grade) => 
    sum + grade.customers.reduce((gradeSum, customer) => 
      gradeSum + parseFloat(customer.revenue.replace(/[^0-9]/g, '')), 0), 0);

  return (
  
      <div className="space-y-8 animate-fadeIn">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent">
            {t('customers.grades')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            고객 등급별 현황을 관리합니다
          </p>
        </div>

        {/* 전체 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                전체 고객 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalCustomers}명
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                총 매출액
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalRevenue}억원
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                VIP 고객 비율
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {((gradeData.A.customers.length / totalCustomers) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 등급별 탭 */}
        <Card className="transform transition-all duration-500 hover:shadow-xl
                        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {Object.entries(gradeData).map(([grade, data]) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300
                             ${selectedGrade === grade 
                               ? `${data.lightColor} ${data.textColor} shadow-sm` 
                               : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                             }`}
                >
                  {data.name} ({data.customers.length})
                </button>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* 선택된 등급 상세 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 등급 정보 */}
          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className={`flex items-center ${gradeData[selectedGrade].textColor}`}>
                <div className={`w-4 h-4 rounded-full ${gradeData[selectedGrade].color} mr-3`}></div>
                {gradeData[selectedGrade].name}
              </CardTitle>
              <CardDescription>
                {gradeData[selectedGrade].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">등급 기준</h4>
                <ul className="space-y-1">
                  {gradeData[selectedGrade].criteria.map((criterion, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">제공 혜택</h4>
                <ul className="space-y-1">
                  {gradeData[selectedGrade].benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 고객 목록 */}
          <Card className="lg:col-span-2 transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">
                  {gradeData[selectedGrade].name} 고객 목록
                </span>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                                 transition-all duration-300 transform hover:scale-105">
                  등급 변경
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradeData[selectedGrade].customers.map((customer, index) => (
                  <div key={customer.id} 
                       className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 
                                 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 
                                 hover:scale-105 hover:shadow-md animate-slideUp"
                       style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${gradeData[selectedGrade].color} rounded-full 
                                     flex items-center justify-center text-white font-bold`}>
                        {customer.company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {customer.company}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {customer.contact}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          거래시작: {customer.since}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {customer.revenue}
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm"
                                className="transition-all duration-300 transform hover:scale-105">
                          상세보기
                        </Button>
                        <Button variant="outline" size="sm"
                                className="transition-all duration-300 transform hover:scale-105">
                          등급변경
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
  );
}
