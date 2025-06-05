
"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { useLanguage } from "@/contexts/languageContext.js";
import Link from "next/link";

export default function RevenueDashboardPage() {
  const { t } = useLanguage();

  const revenueStats = [
    {
      name: "월간 매출",
      value: "₩89,400,000",
      change: "+12.5%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      name: "미수금",
      value: "₩15,200,000",
      change: "-5.2%",
      changeType: "negative",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: "처리된 견적서",
      value: "45",
      change: "+8.1%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: "목표 달성률",
      value: "78.5%",
      change: "+3.2%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  const quickActions = [
    { name: "매출 기록", href: "/dashboard/revenue/record", color: "bg-blue-500" },
    { name: "견적서 관리", href: "/dashboard/revenue/quotes", color: "bg-green-500" },
    { name: "입금 관리", href: "/dashboard/revenue/payment", color: "bg-purple-500" },
    { name: "매출 통계", href: "/dashboard/revenue/statistics", color: "bg-orange-500" },
  ];

  return (
    
      <div className="space-y-8 animate-fadeIn">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 
                         bg-clip-text text-transparent">
            {t('revenue.dashboard')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            매출 현황과 실적을 종합적으로 관리하세요
          </p>
        </div>

        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {revenueStats.map((item, index) => (
            <Card key={item.name} 
                  className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg
                           animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {item.name}
                </CardTitle>
                <div className={`p-2 rounded-full transition-all duration-300 hover:rotate-12
                               ${item.changeType === 'positive' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                                                                 : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
                  {item.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {item.value}
                </div>
                <p className={`text-xs flex items-center ${
                    item.changeType === "positive"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                  <span className={`mr-1 transition-transform duration-300 hover:scale-125 ${
                    item.changeType === "positive" ? "rotate-0" : "rotate-180"
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M7 7l10 10" />
                    </svg>
                  </span>
                  {item.change} 전월 대비
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 빠른 액션 및 최근 활동 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 빠른 액션 */}
          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                빠른 액션
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                자주 사용하는 기능에 빠르게 접근하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className={`${action.color} text-white p-4 rounded-lg text-center font-medium
                               transition-all duration-300 hover:scale-105 hover:shadow-lg transform`}
                  >
                    {action.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 최근 매출 */}
          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                최근 매출
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                최근 확정된 매출 건들을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { company: "삼성전자", amount: "₩25,000,000", date: "2024-06-01" },
                  { company: "LG화학", amount: "₩18,500,000", date: "2024-05-30" }
                ].map((revenue, index) => (
                  <div key={index} 
                       className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                                 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 
                                 hover:scale-105 hover:shadow-md">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {revenue.company}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {revenue.date}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400 
                                   bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                      {revenue.amount}
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
