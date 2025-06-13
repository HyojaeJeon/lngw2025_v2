"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useLanguage.js";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Database,
  Settings,
  RefreshCw,
} from "lucide-react";

export default function AuditLogsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("logs");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("today");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      timestamp: "2024-12-07 14:30:25",
      user: "김관리자",
      action: "LOGIN",
      category: "authentication",
      resource: "시스템",
      details: "IP: 192.168.1.100, 브라우저: Chrome",
      status: "success",
      riskLevel: "low",
    },
    {
      id: 2,
      timestamp: "2024-12-07 14:25:10",
      user: "박매니저",
      action: "UPDATE",
      category: "customer",
      resource: "고객 정보 (ID: 123)",
      details: "회사명 변경: ABC Corp → ABC Corporation",
      status: "success",
      riskLevel: "medium",
    },
    {
      id: 3,
      timestamp: "2024-12-07 14:20:55",
      user: "이개발자",
      action: "DELETE",
      category: "system",
      resource: "사용자 계정 (ID: 456)",
      details: "비활성 사용자 계정 삭제",
      status: "success",
      riskLevel: "high",
    },
    {
      id: 4,
      timestamp: "2024-12-07 14:15:30",
      user: "unknown",
      action: "LOGIN_FAILED",
      category: "authentication",
      resource: "시스템",
      details: "IP: 192.168.1.200, 실패 사유: 잘못된 비밀번호",
      status: "failed",
      riskLevel: "high",
    },
    {
      id: 5,
      timestamp: "2024-12-07 14:10:15",
      user: "정회계",
      action: "EXPORT",
      category: "data",
      resource: "고객 데이터",
      details: "CSV 형식으로 1,000건 고객 데이터 내보내기",
      status: "success",
      riskLevel: "medium",
    },
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    totalLogs: 15847,
    todayLogs: 342,
    failedActions: 23,
    highRiskActions: 12,
    uniqueUsers: 45,
    mostActiveUser: "김관리자",
  });

  const tabs = [
    { id: "logs", name: "감사 로그", icon: FileText },
    { id: "analytics", name: "분석 및 통계", icon: Activity },
    { id: "settings", name: "로그 설정", icon: Settings },
  ];

  const categories = [
    { value: "all", label: "전체 카테고리" },
    { value: "authentication", label: "인증" },
    { value: "customer", label: "고객 관리" },
    { value: "system", label: "시스템" },
    { value: "data", label: "데이터" },
    { value: "settings", label: "설정" },
  ];

  const dateRanges = [
    { value: "today", label: "오늘" },
    { value: "yesterday", label: "어제" },
    { value: "week", label: "지난 7일" },
    { value: "month", label: "지난 30일" },
    { value: "custom", label: "사용자 정의" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getRiskBadge = (riskLevel) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[riskLevel]}`}>
        {riskLevel === "low"
          ? "낮음"
          : riskLevel === "medium"
            ? "보통"
            : "높음"}
      </span>
    );
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || log.category === selectedCategory;
    const matchesUser = selectedUser === "all" || log.user === selectedUser;
    return matchesSearch && matchesCategory && matchesUser;
  });

  const renderLogsTab = () => (
    <div className="space-y-6">
      {/* 필터 및 검색 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="사용자, 액션, 리소스 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>내보내기</span>
            </button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                오늘 로그
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {systemMetrics.todayLogs}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                실패한 액션
              </p>
              <p className="text-2xl font-bold text-red-600">
                {systemMetrics.failedActions}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                고위험 액션
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {systemMetrics.highRiskActions}
              </p>
            </div>
            <Shield className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                활성 사용자
              </p>
              <p className="text-2xl font-bold text-green-600">
                {systemMetrics.uniqueUsers}
              </p>
            </div>
            <User className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* 로그 테이블 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  액션
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  리소스
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  위험도
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        log.action.includes("FAILED") ||
                        log.action.includes("DELETE")
                          ? "bg-red-100 text-red-800"
                          : log.action.includes("UPDATE") ||
                              log.action.includes("CREATE")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status)}
                      <span className="text-sm text-gray-900 dark:text-white">
                        {log.status === "success" ? "성공" : "실패"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRiskBadge(log.riskLevel)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      title="상세보기"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 액션별 통계 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            액션별 통계
          </h3>
          <div className="space-y-3">
            {[
              { action: "LOGIN", count: 1245, percentage: 45 },
              { action: "UPDATE", count: 687, percentage: 25 },
              { action: "CREATE", count: 432, percentage: 15 },
              { action: "DELETE", count: 234, percentage: 8 },
              { action: "EXPORT", count: 189, percentage: 7 },
            ].map((item) => (
              <div
                key={item.action}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.action}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 사용자별 활동 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            사용자별 활동
          </h3>
          <div className="space-y-3">
            {[
              { user: "김관리자", actions: 156 },
              { user: "박매니저", actions: 134 },
              { user: "이개발자", actions: 98 },
              { user: "정회계", actions: 76 },
              { user: "최영업", actions: 54 },
            ].map((item) => (
              <div
                key={item.user}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.user}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.actions} 액션
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 시간별 활동 차트 영역 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          시간별 활동 추이
        </h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-2" />
            <p>시간별 활동 차트가 여기에 표시됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          로그 보존 설정
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              로그 보존 기간
            </label>
            <select className="w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="30">30일</option>
              <option value="90">90일</option>
              <option value="180">180일</option>
              <option value="365">1년</option>
              <option value="730">2년</option>
              <option value="0">무제한</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              자동 아카이브
            </label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                30일 이상 된 로그를 자동으로 아카이브
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          로깅 범위 설정
        </h3>
        <div className="space-y-3">
          {[
            { category: "인증 및 로그인", enabled: true },
            { category: "데이터 변경 (CRUD)", enabled: true },
            { category: "권한 변경", enabled: true },
            { category: "시스템 설정 변경", enabled: true },
            { category: "파일 업로드/다운로드", enabled: false },
            { category: "페이지 접근", enabled: false },
          ].map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.category}
              </span>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  item.enabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    item.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          알림 설정
        </h3>
        <div className="space-y-3">
          {[
            { event: "로그인 실패 (5회 이상)", enabled: true },
            { event: "고위험 액션 수행", enabled: true },
            { event: "시스템 설정 변경", enabled: false },
            { event: "대량 데이터 내보내기", enabled: true },
          ].map((item) => (
            <div key={item.event} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.event}
              </span>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  item.enabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    item.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("auditLogs.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("auditLogs.description")}
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === "logs" && renderLogsTab()}
        {activeTab === "analytics" && renderAnalyticsTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </div>
    </div>
  );
}
