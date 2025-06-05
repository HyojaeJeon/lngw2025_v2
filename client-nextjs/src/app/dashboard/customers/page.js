
"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
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
import { useToast } from "@/hooks/useToast.js";
import { useLanguage } from "@/contexts/languageContext.js";
import { GET_CUSTOMERS } from "@/lib/graphql/queries.js";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  
  const { loading, error, data } = useQuery(GET_CUSTOMERS);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-12">
          <p className="text-red-500">{t('common.error')}: {error.message}</p>
        </div>  
    );
  }

  const customers = data?.customers || [];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.industry && customer.industry.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGrade = selectedGrade === "" || customer.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "B": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "C": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getGradeName = (grade) => {
    switch (grade) {
      case "A": return "VIP";
      case "B": return "우수";
      case "C": return "일반";
      default: return "미분류";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent\">
            {t('customers.list')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('customers.description')}
          </p>
        </div>

        {/* 검색 및 필터 */}
        <Card className="transform transition-all duration-500 hover:shadow-xl
                        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t('customers.searchAndFilter')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder={t('customers.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:col-span-2 transition-all duration-300 focus:scale-105 focus:shadow-md"
              />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-300 focus:scale-105 focus:shadow-md"
              >
                <option value="">{t('customers.allGrades')}</option>
                <option value="A">{t('customers.gradeA')}</option>
                <option value="B">{t('customers.gradeB')}</option>
                <option value="C">{t('customers.gradeC')}</option>
              </select>
              <Button 
                onClick={() => router.push("/dashboard/customers/add")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                         transition-all duration-300 transform hover:scale-105">
                {t('customers.addNew')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 고객 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('customers.total')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {customers.length}
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('customers.gradeA')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {customers.filter(c => c.grade === "A").length}
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('customers.gradeB')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {customers.filter(c => c.grade === "B").length}
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('customers.gradeC')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {customers.filter(c => c.grade === "C").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 고객 목록 */}
        <div className="grid gap-6">
          {filteredCustomers.map((customer, index) => (
            <Card key={customer.id} 
                  className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg
                           animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg
                                   ${customer.grade === 'A' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                     customer.grade === 'B' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                     'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
                      {customer.companyName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                          {customer.companyName}
                        </CardTitle>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(customer.grade)}`}>
                          {customer.grade}등급 ({getGradeName(customer.grade)})
                        </span>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {t('customers.contact')}: {customer.contactName}
                      </CardDescription>
                      {customer.industry && (
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          {t('customers.industry')}: {customer.industry}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    <div>{t('customers.registeredDate')}: {new Date(customer.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {customer.email && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{customer.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" size="sm"
                          className="transition-all duration-300 transform hover:scale-105">
                    {t('customers.viewDetails')}
                  </Button>
                  <Button variant="outline" size="sm"
                          className="transition-all duration-300 transform hover:scale-105">
                    {t('customers.edit')}
                  </Button>
                  <Button variant="outline" size="sm"
                          className="transition-all duration-300 transform hover:scale-105">
                    {t('customers.activityHistory')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t('customers.noResults')}
              </p>
              <Button 
                onClick={() => router.push("/dashboard/customers/add")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                         transition-all duration-300 transform hover:scale-105">
                {t('customers.addFirst')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
