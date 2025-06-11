
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

export default function SalesPipelinePage() {
  const { t } = useLanguage();
  
  const { data: opportunitiesData, loading } = useQuery(GET_SALES_OPPORTUNITIES);
  const { data: customersData } = useQuery(GET_CUSTOMERS);

  const opportunities = opportunitiesData?.salesOpportunities || [];
  const customers = customersData?.customers || [];

  const stages = [
    { value: 'prospect', label: { ko: '잠재고객', vi: 'Khách hàng tiềm năng', en: 'Prospect' }, color: 'bg-gray-500' },
    { value: 'qualification', label: { ko: '자격심사', vi: 'Đánh giá', en: 'Qualification' }, color: 'bg-blue-500' },
    { value: 'proposal', label: { ko: '제안', vi: 'Đề xuất', en: 'Proposal' }, color: 'bg-yellow-500' },
    { value: 'negotiation', label: { ko: '협상', vi: 'Đàm phán', en: 'Negotiation' }, color: 'bg-orange-500' },
    { value: 'closed_won', label: { ko: '성사', vi: 'Thành công', en: 'Closed Won' }, color: 'bg-green-500' },
    { value: 'closed_lost', label: { ko: '실패', vi: 'Thất bại', en: 'Closed Lost' }, color: 'bg-red-500' }
  ];

  const getOpportunitiesByStage = (stage) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const getTotalAmount = (stageOpportunities) => {
    return stageOpportunities.reduce((sum, opp) => sum + (opp.expectedAmount || 0), 0);
  };

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
            {t('sales.pipeline')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            영업 파이프라인 현황을 단계별로 확인하세요
          </p>
        </div>

        {/* 파이프라인 보드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stages.map((stage, stageIndex) => {
            const stageOpportunities = getOpportunitiesByStage(stage.value);
            const totalAmount = getTotalAmount(stageOpportunities);
            
            return (
              <div 
                key={stage.value}
                className="animate-slideUp"
                style={{ animationDelay: `${stageIndex * 100}ms` }}
              >
                <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-sm font-medium text-white px-3 py-1 rounded-full ${stage.color}`}>
                        {stage.label.ko}
                      </CardTitle>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {stageOpportunities.length}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      총 ₩{totalAmount.toLocaleString()}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {stageOpportunities.map((opportunity, index) => {
                      const customer = customers.find(c => c.id === opportunity.customerId);
                      
                      return (
                        <div
                          key={opportunity.id}
                          className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                                   transform transition-all duration-300 hover:scale-105 hover:shadow-md
                                   border border-gray-200 dark:border-gray-600"
                        >
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                            {opportunity.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                            {customer?.companyName || 'N/A'}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              ₩{(opportunity.expectedAmount || 0).toLocaleString()}
                            </span>
                            {opportunity.expectedCloseDate && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {stageOpportunities.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                        해당 단계의 영업기회가 없습니다
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {opportunities.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                총 영업기회
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₩{getTotalAmount(opportunities).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                총 예상 매출
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {getOpportunitiesByStage('negotiation').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                협상 단계
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round((getOpportunitiesByStage('closed_won').length / Math.max(opportunities.length, 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                성공률
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
