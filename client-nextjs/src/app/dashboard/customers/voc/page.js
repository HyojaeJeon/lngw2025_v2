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
import { useTranslation } from "@/hooks/useLanguage.js";

export default function VOCPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  // 샘플 VOC 데이터
  const vocData = [
    {
      id: 1,
      customer: "삼성전자",
      contact: "김철수 과장",
      type: "불만",
      title: "납기 지연 관련 문의",
      content: "주문한 제품의 납기가 예정보다 1주일 지연되고 있습니다.",
      status: "처리중",
      priority: "높음",
      createdAt: "2024-01-15",
      assignedTo: "박영희",
    },
    {
      id: 2,
      customer: "LG화학",
      contact: "이민수 대리",
      type: "요청",
      title: "추가 기능 개발 요청",
      content: "현재 시스템에 보고서 자동화 기능을 추가해주셨으면 합니다.",
      status: "완료",
      priority: "보통",
      createdAt: "2024-01-10",
      assignedTo: "최민정",
    },
    {
      id: 3,
      customer: "현대모비스",
      contact: "정수영 차장",
      type: "문의",
      title: "시스템 사용법 문의",
      content: "신규 직원 교육을 위한 사용자 매뉴얼을 요청합니다.",
      status: "대기",
      priority: "낮음",
      createdAt: "2024-01-12",
      assignedTo: "김도현",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "완료":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "처리중":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "대기":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "높음":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "보통":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "낮음":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "불만":
        return (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "요청":
        return (
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        );
      case "문의":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredVOC = vocData.filter(
    (item) =>
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          {t("customers.voc")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          고객의 소리(Voice of Customer)를 관리합니다
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card
        className="transform transition-all duration-500 hover:shadow-xl
                        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
      >
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <svg
              className="w-6 h-6 mr-3 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="고객명, 제목, 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 transition-all duration-300 focus:scale-105 focus:shadow-md"
            />
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                               transition-all duration-300 transform hover:scale-105"
            >
              새 VOC 등록
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* VOC 목록 */}
      <div className="grid gap-6">
        {filteredVOC.map((item, index) => (
          <Card
            key={item.id}
            className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg
                           animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(item.type)}
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {item.customer} - {item.contact}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}
                  >
                    {item.priority}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {item.content}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>등록일: {item.createdAt}</span>
                  <span>담당자: {item.assignedTo}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-300 transform hover:scale-105"
                  >
                    상세보기
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-300 transform hover:scale-105"
                  >
                    답변하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVOC.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5.657-2.343l-1.04 1.04A9.938 9.938 0 0012 22a9.938 9.938 0 007.697-2.303l-1.04-1.04z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              검색 조건에 맞는 VOC가 없습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
