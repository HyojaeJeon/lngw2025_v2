"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";
import { GET_SALES_OPPORTUNITIES, GET_CUSTOMERS } from "@/lib/graphql/queries.js";
import { useLanguage } from "@/contexts/languageContext.js";
import Link from "next/link";

export default function SalesDashboardPage() {
  const { t } = useLanguage();

  const { data: opportunitiesData, loading: opportunitiesLoading } = useQuery(GET_SALES_OPPORTUNITIES);
  const { data: customersData, loading: customersLoading } = useQuery(GET_CUSTOMERS);

  const opportunities = opportunitiesData?.salesOpportunities || [];
  const customers = customersData?.customers || [];

  // 영업 지표 계산
  const totalOpportunities = opportunities.length;
  const activeOpportunities = opportunities.filter((opp) => !["closed_won", "closed_lost"].includes(opp.stage)).length;
  const wonOpportunities = opportunities.filter((opp) => opp.stage === "closed_won").length;
  const totalExpectedRevenue = opportunities.reduce((sum, opp) => sum + (opp.expectedAmount || 0), 0);
  const conversionRate = totalOpportunities > 0 ? Math.round((wonOpportunities / totalOpportunities) * 100) : 0;

  // 단계별 영업기회 분포
  const stageDistribution = [
    { stage: "prospect", label: t("sales.stage.prospect"), count: opportunities.filter((o) => o.stage === "prospect").length, color: "bg-gray-500" },
    { stage: "qualification", label: t("sales.stage.qualification"), count: opportunities.filter((o) => o.stage === "qualification").length, color: "bg-blue-500" },
    { stage: "proposal", label: t("sales.stage.proposal"), count: opportunities.filter((o) => o.stage === "proposal").length, color: "bg-yellow-500" },
    { stage: "negotiation", label: t("sales.stage.negotiation"), count: opportunities.filter((o) => o.stage === "negotiation").length, color: "bg-orange-500" },
    { stage: "closed_won", label: t("sales.stage.closed_won"), count: opportunities.filter((o) => o.stage === "closed_won").length, color: "bg-green-500" },
  ];

  // 최근 영업기회
  const recentOpportunities = opportunities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  if (opportunitiesLoading || customersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div
        className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105"
      >
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 
                         bg-clip-text text-transparent"
        >
          {t("sales.dashboard.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{t("sales.dashboard.description")}</p>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("sales.totalOpportunities")}</CardTitle>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalOpportunities}</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {t("sales.active")}: {activeOpportunities}개
            </p>
          </CardContent>
        </Card>

        <Card
          className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("sales.conversionRate")}</CardTitle>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{conversionRate}%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t("sales.success")}: {wonOpportunities}건
            </p>
          </CardContent>
        </Card>

        <Card
          className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("sales.expectedRevenue")}</CardTitle>
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">₩{Math.round(totalExpectedRevenue / 1000000)}M</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t("sales.totalPipelineValue")}</p>
          </CardContent>
        </Card>

        <Card
          className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("sales.totalCustomers")}</CardTitle>
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
              <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{customers.length}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t("sales.registeredCustomers")}</p>
          </CardContent>
        </Card>
      </div>

      {/* 영업 파이프라인 및 최근 활동 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 영업 파이프라인 단계별 분포 */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              {t("sales.pipeline")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">{t("sales.pipelineDistribution")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stageDistribution.map((stage, index) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{stage.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${stage.color}`}
                        style={{ width: `${totalOpportunities > 0 ? (stage.count / totalOpportunities) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-6">{stage.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 최근 영업기회 */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("sales.recentOpportunities")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">{t("sales.newOpportunities")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOpportunities.length > 0 ? (
                recentOpportunities.map((opportunity, index) => (
                  <div
                    key={opportunity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                                   transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 
                                   hover:scale-105 hover:shadow-md"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{opportunity.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t(`sales.stage.${opportunity.stage}`)}</p>
                    </div>
                    <div
                      className="text-sm font-medium text-green-600 dark:text-green-400 
                                     bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full"
                    >
                      ₩{Math.round((opportunity.expectedAmount || 0) / 1000000)}M
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t("sales.noOpportunities")}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{t("sales.quickActions")}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">{t("sales.quickActionsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/sales/opportunities"
              className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800
                             hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 
                             transform hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{t("sales.newOpportunity")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("sales.opportunityRegistration")}</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/sales/pipeline"
              className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800
                             hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 
                             transform hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{t("sales.pipelineView")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("sales.pipelineStatus")}</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/sales/kpi"
              className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800
                             hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 
                             transform hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{t("sales.performanceAnalysis")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("sales.kpiCheck")}</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
