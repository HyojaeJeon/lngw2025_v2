"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { useTranslation } from "@/hooks/useLanguage";

const Dashboard = () => {
  const { t } = useTranslation();

  const stats = [
    {
      name: t("dashboard.totalCustomers"),
      value: "2,651",
      change: "+4.75%",
      changeType: "positive",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      name: t("dashboard.activeOpportunities"),
      value: "58",
      change: "+54.02%",
      changeType: "positive",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      name: t("dashboard.monthlyRevenue"),
      value: "₩89,400,000",
      change: "-1.39%",
      changeType: "negative",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      name: t("dashboard.successRate"),
      value: "24.5%",
      change: "+2.1%",
      changeType: "positive",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 섹션 */}
      <div
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105"
      >
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent"
        >
          {t("dashboard.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {t("dashboard.description")}
        </p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <Card
            key={item.name}
            className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg
                           animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {item.name}
              </CardTitle>
              <div
                className={`p-2 rounded-full transition-all duration-300 hover:rotate-12
                               ${
                                 item.changeType === "positive"
                                   ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                                   : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                               }`}
              >
                {item.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {item.value}
              </div>
              <p
                className={`text-xs flex items-center ${
                  item.changeType === "positive"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                <span
                  className={`mr-1 transition-transform duration-300 hover:scale-125 ${
                    item.changeType === "positive" ? "rotate-0" : "rotate-180"
                  }`}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17l10-10M7 7l10 10"
                    />
                  </svg>
                </span>
                {item.change} {t("previousMonth")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 상세 정보 카드 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
        >
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {t("dashboard.recentCustomers")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {t("dashboard.recentCustomers.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { company: "삼성전자", contact: "김철수 과장" },
                { company: "LG화학", contact: "박영희 대리" },
              ].map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                                 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 
                                 hover:scale-105 hover:shadow-md"
                >
                  <div
                    className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 
                                   rounded-full flex items-center justify-center text-white font-semibold"
                  >
                    {customer.company.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.contact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card
          className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
        >
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              {t("dashboard.opportunities")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {t("dashboard.opportunities.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "ERP 시스템 구축",
                  company: "삼성전자",
                  amount: "₩50,000,000",
                },
                {
                  title: "클라우드 마이그레이션",
                  company: "LG화학",
                  amount: "₩30,000,000",
                },
              ].map((opportunity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                                 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 
                                 hover:scale-105 hover:shadow-md"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {opportunity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {opportunity.company}
                    </p>
                  </div>
                  <div
                    className="text-sm font-medium text-green-600 dark:text-green-400 
                                   bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full"
                  >
                    {opportunity.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
