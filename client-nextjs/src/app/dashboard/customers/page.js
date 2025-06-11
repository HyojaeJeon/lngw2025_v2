"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Badge } from "@/components/ui/badge.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import { useToast } from "@/hooks/useToast.js";
import { GET_CUSTOMERS } from "@/lib/graphql/queries.js";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { t } = useTranslation();
  const router = useRouter();

  const itemsPerPage = 6;
  const offset = (currentPage - 1) * itemsPerPage;

  const { loading, error, data, refetch } = useQuery(GET_CUSTOMERS, {
    variables: {
      limit: itemsPerPage,
      offset: offset,
      search: searchTerm,
    },
    errorPolicy: "all",
  });

  if (error) {
    console.error("Customers query error:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">
          {t("common.error")}: {error.message}
        </p>
        <Button onClick={() => refetch()} className="mt-4">
          다시 시도
        </Button>
      </div>
    );
  }

  const customers = data?.customers || [];

  const filteredCustomers = customers.filter((customer) => {
    // Safe property access with fallbacks
    const customerName = customer?.name || customer?.companyName || "";
    const contactName = customer?.contactName || "";
    const industry = customer?.industry || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === "" || customer?.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  // Pagination calculations
  const totalFilteredItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900 dark:to-red-800 dark:text-red-300";
      case "B":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900 dark:to-blue-800 dark:text-blue-300";
      case "C":
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300";
    }
  };

  const getGradeName = (grade) => {
    const gradeLabels = {
      A: t("customer.grade.vip") || "VIP",
      B: t("customer.grade.excellent") || "우수",
      C: t("customer.grade.normal") || "일반",
      D: t("customer.grade.standard") || "표준",
      E: t("customer.grade.basic") || "기본",
    };
    return gradeLabels[grade] || "미분류";
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="relaitve flex justify-center items-center space-x-2 mt-8">
        {loading && (
          <div className="absolute flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 z-[999]"></div>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="transition-all duration-300 "
        >
          &lt;
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              className="transition-all duration-300 "
            >
              1
            </Button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(pageNum)}
            className={`transition-all duration-300  ${
              currentPage === pageNum
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : ""
            }`}
          >
            {pageNum}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-400">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              className="transition-all duration-300 "
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="transition-all duration-300 "
        >
          &gt;
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Enhanced Header Section */}
      <div
        className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 
                        dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 
                        rounded-2xl p-8 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                         dark:from-blue-400/10 dark:to-purple-400/10"
        ></div>
        <div className="relative z-10">
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
                           bg-clip-text text-transparent mb-2"
          >
            {t("customers.list")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("customers.description")}
          </p>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                총 {customers.length}명의 고객
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <Card
        className="transform transition-all duration-500 hover:shadow-2xl
                        bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl
                        border border-gray-200/20 dark:border-gray-700/20"
      >
        <CardHeader
          className="bg-gradient-to-r from-blue-50 to-purple-50 
                                dark:from-gray-800 dark:to-gray-700 rounded-t-lg"
        >
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {t("customers.searchAndFilter")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder={t("customers.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2 transition-all duration-300  focus:shadow-lg
                          border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-300 focus:shadow-lg"
            >
              <option value="">{t("customers.allGrades")}</option>
              <option value="A">{t("customers.gradeA")}</option>
              <option value="B">{t("customers.gradeB")}</option>
              <option value="C">{t("customers.gradeC")}</option>
            </select>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="transition-all duration-300 transform  hover:shadow-lg"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              새로고침
            </Button>
            <Button
              onClick={() => router.push("/dashboard/customers/add")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                         transition-all duration-300 transform  hover:shadow-lg"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {t("customers.addNew")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: t("customers.total"),
            value: customers.length,
            color: "from-blue-500 to-cyan-500",
            icon: "👥",
          },
          {
            title: t("customers.gradeA"),
            value: customers.filter((c) => c.grade === "A").length,
            color: "from-red-500 to-pink-500",
            icon: "⭐",
          },
          {
            title: t("customers.gradeB"),
            value: customers.filter((c) => c.grade === "B").length,
            color: "from-blue-500 to-indigo-500",
            icon: "🏆",
          },
          {
            title: t("customers.gradeC"),
            value: customers.filter((c) => c.grade === "C").length,
            color: "from-gray-500 to-slate-500",
            icon: "📊",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="transform transition-all duration-500  hover:shadow-xl
                                        bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-lg
                                        group cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {stat.title}
                  </p>
                  <p
                    className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent
                                    transition-transform duration-300`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className="text-3xl group-hover:animate-bounce">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Customer List */}
      <div className="grid gap-6">
        {currentCustomers.map((customer, index) => {
          const customerName =
            customer?.name || customer?.companyName || "Unknown Company";
          const contactName = customer?.contactName || "Unknown Contact";

          return (
            <Card
              key={customer.id}
              className="transform transition-all duration-500  hover:shadow-2xl
                             bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-lg
                             group overflow-hidden animate-slideUp border border-gray-200/20 dark:border-gray-700/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 
                               group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"
              ></div>
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg
                                     shadow-lg group-hover:shadow-xl transition-all duration-300 
                                     ${
                                       customer.grade === "A"
                                         ? "bg-gradient-to-br from-red-500 to-red-600"
                                         : customer.grade === "B"
                                           ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                           : "bg-gradient-to-br from-gray-500 to-gray-600"
                                     }`}
                    >
                      {customerName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle
                          className="text-xl text-gray-900 dark:text-white group-hover:text-blue-600 
                                               dark:group-hover:text-blue-400 transition-colors duration-300"
                        >
                          {customerName}
                        </CardTitle>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getGradeColor(customer.grade)}`}
                        >
                          {customer.grade}등급 ({getGradeName(customer.grade)})
                        </span>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {t("customers.contact")}: {contactName}
                      </CardDescription>
                      {customer.industry && (
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          {t("customers.industry")}: {customer.industry}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      {t("customers.registeredDate")}:{" "}
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                    {customer.assignedUser && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        담당자: {customer.assignedUser.name}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {customer.email && (
                    <div
                      className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50
                                     group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {customer.email}
                      </span>
                    </div>
                  )}
                  {customer.phone && (
                    <div
                      className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50
                                     group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500 group-hover:text-green-500 transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {customer.phone}
                      </span>
                    </div>
                  )}
                  {customer.address && (
                    <div
                      className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50
                                     group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500 group-hover:text-purple-500 transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {customer.address}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/customers/${customer.id}`)
                    }
                    className="transition-all duration-300 transform hover:shadow-md
                               group-hover:border-blue-300 group-hover:text-blue-600 
                               dark:group-hover:border-blue-500 dark:group-hover:text-blue-400"
                  >
                    상세보기
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/customers/${customer.id}`)
                    }
                    className="transition-all duration-300 transform hover:shadow-md
                               group-hover:border-green-300 group-hover:text-green-600 
                               dark:group-hover:border-green-500 dark:group-hover:text-green-400"
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-300 transform hover:shadow-md
                               group-hover:border-purple-300 group-hover:text-purple-600 
                               dark:group-hover:border-purple-500 dark:group-hover:text-purple-400"
                  >
                    활동이력
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Empty State */}
      {currentCustomers.length === 0 && (
        <Card className="text-center py-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
          <CardContent>
            <div className="animate-bounce mb-4">
              <svg
                className="w-20 h-20 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg">
              {searchTerm ? "검색 결과가 없습니다" : t("customers.noResults")}
            </p>
            <Button
              onClick={() => router.push("/dashboard/customers/add")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                         transition-all duration-300 transform  hover:shadow-lg px-8 py-3"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {searchTerm ? "새 고객 추가" : t("customers.addFirst")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
