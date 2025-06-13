"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useLanguage.js";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Database,
  Zap,
  FileText,
  Bell,
  Settings,
} from "lucide-react";

export default function BillingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("subscription");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [currentPlan, setCurrentPlan] = useState({
    name: "Professional",
    price: 89000,
    currency: "KRW",
    billingCycle: "monthly",
    users: 25,
    storage: "100GB",
    features: [
      "무제한 고객 관리",
      "고급 분석 도구",
      "API 접근",
      "24/7 지원",
      "자동 백업",
    ],
    nextBillingDate: "2024-12-15",
    status: "active",
  });

  const [usageStats, setUsageStats] = useState({
    users: { current: 18, limit: 25 },
    storage: { current: 67, limit: 100 },
    apiCalls: { current: 8547, limit: 10000 },
    emailSent: { current: 1234, limit: 2000 },
  });

  const [billingHistory, setBillingHistory] = useState([
    {
      id: 1,
      date: "2024-11-15",
      description: "Professional Plan - 월간 구독",
      amount: 89000,
      currency: "KRW",
      status: "paid",
      invoiceUrl: "/invoices/2024-11-001.pdf",
    },
    {
      id: 2,
      date: "2024-10-15",
      description: "Professional Plan - 월간 구독",
      amount: 89000,
      currency: "KRW",
      status: "paid",
      invoiceUrl: "/invoices/2024-10-001.pdf",
    },
    {
      id: 3,
      date: "2024-09-15",
      description: "Professional Plan - 월간 구독",
      amount: 89000,
      currency: "KRW",
      status: "paid",
      invoiceUrl: "/invoices/2024-09-001.pdf",
    },
    {
      id: 4,
      date: "2024-08-15",
      description: "Standard Plan - 월간 구독",
      amount: 49000,
      currency: "KRW",
      status: "paid",
      invoiceUrl: "/invoices/2024-08-001.pdf",
    },
  ]);

  const [availablePlans, setAvailablePlans] = useState([
    {
      id: "starter",
      name: "Starter",
      price: 29000,
      currency: "KRW",
      period: "월",
      users: 5,
      storage: "10GB",
      features: ["기본 고객 관리", "기본 리포트", "이메일 지원", "일일 백업"],
      recommended: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: 89000,
      currency: "KRW",
      period: "월",
      users: 25,
      storage: "100GB",
      features: [
        "무제한 고객 관리",
        "고급 분석 도구",
        "API 접근",
        "24/7 지원",
        "자동 백업",
        "사용자 정의 필드",
      ],
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 189000,
      currency: "KRW",
      period: "월",
      users: "무제한",
      storage: "1TB",
      features: [
        "모든 Professional 기능",
        "전담 계정 매니저",
        "온프레미스 배포",
        "고급 보안",
        "사용자 정의 통합",
        "교육 및 컨설팅",
      ],
      recommended: false,
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "card",
      brand: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      brand: "MasterCard",
      last4: "5555",
      expiryMonth: 8,
      expiryYear: 2025,
      isDefault: false,
    },
  ]);

  const tabs = [
    { id: "subscription", name: "구독 현황", icon: CreditCard },
    { id: "usage", name: "사용량", icon: TrendingUp },
    { id: "plans", name: "플랜 변경", icon: Settings },
    { id: "history", name: "결제 내역", icon: FileText },
    { id: "payment", name: "결제 수단", icon: DollarSign },
  ];

  const formatCurrency = (amount, currency) => {
    if (currency === "KRW") {
      return `₩${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getUsagePercentage = (current, limit) => {
    if (limit === "무제한") return 0;
    return Math.round((current / limit) * 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return "text-red-600 bg-red-100";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const renderSubscriptionTab = () => (
    <div className="space-y-6">
      {/* 현재 플랜 정보 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            현재 구독 플랜
          </h3>
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              currentPlan.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {currentPlan.status === "active" ? "활성" : "비활성"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {currentPlan.name} 플랜
            </h4>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(currentPlan.price, currentPlan.currency)}
              <span className="text-sm font-normal text-gray-500">/ 월</span>
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• 사용자: {currentPlan.users}명</p>
              <p>• 저장공간: {currentPlan.storage}</p>
              <p>• 다음 결제일: {currentPlan.nextBillingDate}</p>
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              포함된 기능
            </h5>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            플랜 업그레이드
          </button>
          <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            구독 관리
          </button>
        </div>
      </div>

      {/* 다음 결제 정보 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              다음 결제 예정
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              {currentPlan.nextBillingDate}에{" "}
              {formatCurrency(currentPlan.price, currentPlan.currency)}이
              결제됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsageTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(usageStats).map(([key, usage]) => {
          const percentage = getUsagePercentage(usage.current, usage.limit);
          const colorClass = getUsageColor(percentage);

          return (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {key === "users"
                    ? "사용자"
                    : key === "storage"
                      ? "저장공간"
                      : key === "apiCalls"
                        ? "API 호출"
                        : "이메일 발송"}
                </h4>
                {key === "users" && <Users className="w-5 h-5 text-gray-400" />}
                {key === "storage" && (
                  <Database className="w-5 h-5 text-gray-400" />
                )}
                {key === "apiCalls" && (
                  <Zap className="w-5 h-5 text-gray-400" />
                )}
                {key === "emailSent" && (
                  <Bell className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {usage.current} /{" "}
                    {usage.limit === "무제한" ? "∞" : usage.limit}
                    {key === "storage" ? "GB" : ""}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${colorClass}`}
                  >
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      percentage >= 90
                        ? "bg-red-500"
                        : percentage >= 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 사용량 차트 영역 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          월별 사용량 추이
        </h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
            <p>사용량 차트가 여기에 표시됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlansTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          플랜을 선택하세요
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          비즈니스에 맞는 최적의 플랜을 선택하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availablePlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white dark:bg-gray-800 border-2 rounded-lg p-6 ${
              plan.recommended
                ? "border-blue-500"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  추천
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h4>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(plan.price, plan.currency)}
                <span className="text-sm font-normal text-gray-500">
                  / {plan.period}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                사용자 {plan.users}명, 저장공간 {plan.storage}
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                currentPlan.name === plan.name
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : plan.recommended
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              disabled={currentPlan.name === plan.name}
            >
              {currentPlan.name === plan.name ? "현재 플랜" : "선택하기"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          결제 내역
        </h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>전체 내역 다운로드</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                날짜
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {billingHistory.map((bill) => (
              <tr key={bill.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {bill.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {bill.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(bill.amount, bill.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      bill.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {bill.status === "paid" ? "결제완료" : "결제실패"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>영수증</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          결제 수단 관리
        </h3>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          결제 수단 추가
        </button>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {method.brand} **** {method.last4}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    만료일: {method.expiryMonth}/{method.expiryYear}
                    {method.isDefault && (
                      <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        기본 결제 수단
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-500">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-500">
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 결제 수단 추가 모달 */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                결제 수단 추가
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  카드 번호
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    만료일
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  카드 소유자명
                </label>
                <input
                  type="text"
                  placeholder="홍길동"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  기본 결제 수단으로 설정
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("billing.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("billing.description")}
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
        {activeTab === "subscription" && renderSubscriptionTab()}
        {activeTab === "usage" && renderUsageTab()}
        {activeTab === "plans" && renderPlansTab()}
        {activeTab === "history" && renderHistoryTab()}
        {activeTab === "payment" && renderPaymentTab()}
      </div>
    </div>
  );
}
