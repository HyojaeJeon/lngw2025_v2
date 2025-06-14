"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client';
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
import { useToast } from "@/hooks/useToast.js";
import { GET_CUSTOMERS, GET_USERS } from '@/lib/graphql/queries.js';
import { DELETE_CUSTOMER } from '@/lib/graphql/customerOperations.js';
import Link from "next/link";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar
} from "lucide-react";

// 고객 등급별 색상
const getGradeColor = (grade) => {
  switch (grade?.toLowerCase()) {
    case 'vip':
    case 'a':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'b':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'c':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// 상태별 색상
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'prospect':
      return 'bg-yellow-100 text-yellow-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CustomersPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // GraphQL 쿼리
  const { data: customersData, loading: customersLoading, error: customersError, refetch } = useQuery(GET_CUSTOMERS, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: searchTerm || undefined,
      filter: {
        grade: filterGrade || undefined,
        status: filterStatus || undefined,
      }
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const { data: usersData } = useQuery(GET_USERS, {
    errorPolicy: 'all'
  });

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    onCompleted: () => {
      toast.success(t('customers.messages.deleteSuccess'));
      refetch();
    },
    onError: (error) => {
      console.error('Delete customer error:', error);
      toast.error(t('customers.messages.deleteError'));
    }
  });

  const customers = customersData?.customers || [];
  const users = usersData?.users || [];

  // 검색 디바운스
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterGrade, filterStatus, refetch]);

  // 고객 삭제 처리
  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm(t('customers.messages.confirmDelete'))) {
      try {
        await deleteCustomer({
          variables: { id: customerId }
        });
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  // 담당자명 가져오기
  const getAssignedUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.name || '-';
  };

  // 로딩 상태
  if (customersLoading && !customersData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('common.loading')}</div>
        </div>
      </DashboardLayout>
    );
  }

  // 에러 상태
  if (customersError && !customersData) {
    console.error('Customers query error:', customersError);
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            {t('common.error')}: {customersError.message}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('customers.title')}</h1>
            <p className="text-gray-600 mt-1">
              {t('customers.description')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('common.export')}
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              {t('common.import')}
            </Button>
            <Link href="/dashboard/customers/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('customers.addCustomer')}
              </Button>
            </Link>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('customers.totalCustomers')}
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('customers.activeCustomers')}
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => c.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('customers.vipCustomers')}
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => c.grade === 'VIP' || c.grade === 'A').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('customers.newThisMonth')}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => {
                  const createdDate = new Date(c.createdAt);
                  const now = new Date();
                  return createdDate.getMonth() === now.getMonth() && 
                         createdDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('customers.customerList')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('customers.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">{t('customers.allGrades')}</option>
                <option value="VIP">VIP</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">{t('customers.allStatuses')}</option>
                <option value="active">{t('customers.status.active')}</option>
                <option value="prospect">{t('customers.status.prospect')}</option>
                <option value="inactive">{t('customers.status.inactive')}</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('common.filter')}
              </Button>
            </div>

            {/* 고객 목록 */}
            <div className="space-y-4">
              {customers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {t('customers.noCustomers')}
                </div>
              ) : (
                customers.map((customer) => (
                  <div key={customer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{customer.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getGradeColor(customer.grade)}`}>
                            {customer.grade || 'N/A'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                            {t(`customers.status.${customer.status}`) || customer.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{customer.contactName || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{customer.email || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{customer.phone || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>{customer.industry || '-'}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-500">
                          <span>{t('customers.assignedUser')}: {getAssignedUserName(customer.assignedUserId)}</span>
                          <span className="mx-2">•</span>
                          <span>{t('customers.createdAt')}: {new Date(customer.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Link href={`/dashboard/customers/${customer.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/customers/${customer.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 페이지네이션 */}
            {customers.length > 0 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    {t('common.previous')}
                  </Button>
                  <span className="px-3 py-2 text-sm">
                    {t('common.page')} {currentPage}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={customers.length < pageSize}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/customers/add">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t('customers.addCustomer')}
                </CardTitle>
                <CardDescription>
                  {t('customers.addDescription')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/customers/grades">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {t('customers.customerGrades')}
                </CardTitle>
                <CardDescription>
                  {t('customers.gradesDescription')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/customers/history">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('customers.customerHistory')}
                </CardTitle>
                <CardDescription>
                  {t('customers.historyDescription')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}