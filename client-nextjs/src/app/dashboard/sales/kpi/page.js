
"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { GET_SALES_OPPORTUNITIES, GET_CUSTOMERS } from "@/lib/graphql/queries.js";
import { useLanguage } from '@/hooks/useLanguage.js';

export default function SalesKpiPage() {
  const { t } = useLanguage();
  
  const { data: opportunitiesData, loading } = useQuery(GET_SALES_OPPORTUNITIES);
  const { data: customersData } = useQuery(GET_CUSTOMERS);

  const opportunities = opportunitiesData?.salesOpportunities || [];
  const customers = customersData?.customers || [];

  // KPI 계산
  const totalOpportunities = opportunities.length;
  const wonOpportunities = opportunities.filter(opp => opp.stage === 'closed_won').length;
  const lostOpportunities = opportunities.filter(opp => opp.stage === 'closed_lost').length;
  const activeOpportunities = opportunities.filter(opp => !['closed_won', 'closed_lost'].includes(opp.stage)).length;
  
  const totalExpectedRevenue = opportunities.reduce((sum, opp) => sum + (opp.expectedAmount || 0), 0);
  const wonRevenue = opportunities
    .filter(opp => opp.stage === 'closed_won')
    .reduce((sum, opp) => sum + (opp.expectedAmount || 0), 0);
  
  const conversionRate = totalOpportunities > 0 ? Math.round((wonOpportunities / totalOpportunities) * 100) : 0;
  const averageDealSize = wonOpportunities > 0 ? Math.round(wonRevenue / wonOpportunities) : 0;

  // 월별 데이터 (모의 데이터)
  const monthlyData = [
    { month: '1월', opportunities: 12, revenue: 45000000, conversion: 25 },
    { month: '2월', opportunities: 18, revenue: 62000000, conversion: 28 },
    { month: '3월', opportunities: 15, revenue: 58000000, conversion: 22 },
    { month: '4월', opportunities: 22, revenue: 78000000, conversion: 32 },
    { month: '5월', opportunities: 19, revenue: 71000000, conversion: 29 },
    { month: '6월', opportunities: 25, revenue: 89000000, conversion: 35 }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent">
            {t('sales.kpi')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            영업 성과 지표와 팀 실적을 확인하세요
          </p>
        </div>

        {/* 주요 KPI 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                총 영업기회
              </CardTitle>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalOpportunities}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                활성: {activeOpportunities}개
              </p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                성공률
              </CardTitle>
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {conversionRate}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                성사: {wonOpportunities}건 / 실패: {lostOpportunities}건
              </p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                총 예상 매출
              </CardTitle>
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₩{Math.round(totalExpectedRevenue / 1000000)}M
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                확정 매출: ₩{Math.round(wonRevenue / 1000000)}M
              </p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                평균 거래 규모
              </CardTitle>
              <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₩{Math.round(averageDealSize / 1000000)}M
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                성사된 거래 평균
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 월별 성과 트렌드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">월별 영업기회</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{data.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(data.opportunities / 25) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                        {data.opportunities}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">월별 매출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{data.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(data.revenue / 89000000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                        ₩{Math.round(data.revenue / 1000000)}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 팀 성과 */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">팀원별 성과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: '김영업', deals: 8, revenue: 25000000, conversion: 35 },
                { name: '박세일즈', deals: 12, revenue: 38000000, conversion: 42 },
                { name: '이마케팅', deals: 6, revenue: 18000000, conversion: 28 }
              ].map((member, index) => (
                <div 
                  key={member.name}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 
                           transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">{member.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">거래 건수:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{member.deals}건</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">매출:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₩{Math.round(member.revenue / 1000000)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">성공률:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{member.conversion}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
