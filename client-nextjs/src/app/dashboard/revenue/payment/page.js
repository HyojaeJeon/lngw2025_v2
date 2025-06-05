
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { useLanguage } from "@/contexts/languageContext.js";

export default function PaymentManagementPage() {
  const { t } = useLanguage();
  
  const [payments, setPayments] = useState([
    {
      id: 1,
      customer: "삼성전자",
      amount: 45000000,
      dueDate: "2024-06-15",
      paymentDate: "2024-06-15",
      status: "완료",
      method: "계좌이체",
      invoiceNumber: "INV-2024-001",
      overdueDays: 0
    },
    {
      id: 2,
      customer: "LG화학",
      amount: 18500000,
      dueDate: "2024-06-10",
      paymentDate: "",
      status: "미수금",
      method: "",
      invoiceNumber: "INV-2024-002",
      overdueDays: 5
    },
    {
      id: 3,
      customer: "SK하이닉스",
      amount: 30000000,
      dueDate: "2024-06-20",
      paymentDate: "",
      status: "예정",
      method: "",
      invoiceNumber: "INV-2024-003",
      overdueDays: 0
    }
  ]);

  const getStatusColor = (status, overdueDays) => {
    if (status === "완료") return "bg-green-100 text-green-800";
    if (status === "미수금" && overdueDays > 0) return "bg-red-100 text-red-800";
    if (status === "미수금") return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const updatePaymentStatus = (id, status, paymentDate, method) => {
    setPayments(payments.map(payment => 
      payment.id === id 
        ? { ...payment, status, paymentDate, method, overdueDays: 0 }
        : payment
    ));
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedAmount = payments.filter(p => p.status === "완료").reduce((sum, payment) => sum + payment.amount, 0);
  const overdueAmount = payments.filter(p => p.status === "미수금" && p.overdueDays > 0).reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 
                         bg-clip-text text-transparent">
            {t('revenue.payment')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            입금 현황과 미수금을 관리하세요
          </p>
        </div>

        {/* 입금 통계 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">총 매출액</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">₩{totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">입금 완료</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">₩{completedAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">연체 미수금</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">₩{overdueAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 입금 관리 테이블 */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>입금 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="p-3 border text-left">계산서 번호</th>
                    <th className="p-3 border text-left">고객사</th>
                    <th className="p-3 border text-right">금액</th>
                    <th className="p-3 border text-center">입금 예정일</th>
                    <th className="p-3 border text-center">입금일</th>
                    <th className="p-3 border text-center">결제 방법</th>
                    <th className="p-3 border text-center">상태</th>
                    <th className="p-3 border text-center">연체일</th>
                    <th className="p-3 border text-center">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3 border">{payment.invoiceNumber}</td>
                      <td className="p-3 border">{payment.customer}</td>
                      <td className="p-3 border text-right">₩{payment.amount.toLocaleString()}</td>
                      <td className="p-3 border text-center">{payment.dueDate}</td>
                      <td className="p-3 border text-center">{payment.paymentDate || "-"}</td>
                      <td className="p-3 border text-center">{payment.method || "-"}</td>
                      <td className="p-3 border text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status, payment.overdueDays)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        {payment.overdueDays > 0 ? (
                          <span className="text-red-600 font-bold">{payment.overdueDays}일</span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3 border text-center">
                        {payment.status !== "완료" && (
                          <Button
                            onClick={() => updatePaymentStatus(payment.id, "완료", new Date().toISOString().split('T')[0], "계좌이체")}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            입금 확인
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 연체 알림 */}
        {overdueAmount > 0 && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                연체 알림
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-300">
                총 ₩{overdueAmount.toLocaleString()}의 연체 미수금이 있습니다. 
                해당 고객들에게 연락하여 입금을 독려해주세요.
              </p>
              <Button className="mt-3 bg-red-600 hover:bg-red-700 text-white">
                연체 고객에게 알림 발송
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
