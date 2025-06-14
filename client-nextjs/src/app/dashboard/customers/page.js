"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  GET_CUSTOMERS, 
  GET_USERS, 
  CREATE_CUSTOMER 
} from '@/lib/graphql/customerOperations';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  Calendar,
  TrendingUp,
  AlertCircle,
  Loader2,
  UserPlus,
  Eye
} from 'lucide-react';

export default function CustomersPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  const { data: customersData, loading: customersLoading, error: customersError } = useQuery(GET_CUSTOMERS, {
    variables: { 
      limit: 50,
      offset: 0
    },
    errorPolicy: 'ignore'
  });

  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS, {
    errorPolicy: 'ignore'
  });

  const [createCustomer, { loading: createLoading }] = useMutation(CREATE_CUSTOMER, {
    onCompleted: () => {
      setShowCreateModal(false);
      refetchCustomers();
    },
    onError: (error) => {
      console.error('Create customer error:', error);
    }
  });

  // 로딩 상태
  if (customersLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">고객 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (customersError && !customersData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            데이터 로딩 오류
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            고객 데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          <Button onClick={() => refetchCustomers()} className="flex items-center gap-2">
            <Loader2 className="w-4 h-4" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const customers = customersData?.customers || [];
  const users = usersData?.users || [];

  // 필터링된 고객 목록
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = !selectedGrade || customer.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  // 고객 등급별 색상
  const getGradeBadgeColor = (grade) => {
    switch (grade) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 새 고객 생성 핸들러
  const handleCreateCustomer = async (customerData) => {
    try {
      await createCustomer({
        variables: {
          input: customerData
        }
      });
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                      rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                           bg-clip-text text-transparent">
              고객 관리
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              고객 정보를 체계적으로 관리하고 관계를 강화하세요
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                         text-white shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              신규 고객 등록
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 고객</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customers.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP 고객</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customers.filter(c => c.grade === 'VIP').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">A등급 고객</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customers.filter(c => c.grade === 'A').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">이번 달 신규</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customers.filter(c => {
                    const createdDate = new Date(c.createdAt);
                    const now = new Date();
                    return createdDate.getMonth() === now.getMonth() && 
                           createdDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <UserPlus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="고객명 또는 담당자명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체 등급</option>
              <option value="VIP">VIP</option>
              <option value="A">A등급</option>
              <option value="B">B등급</option>
              <option value="C">C등급</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 고객 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {customer.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {customer.industry || '업종 미분류'}
                  </p>
                </div>
                <Badge className={`${getGradeBadgeColor(customer.grade)} text-xs`}>
                  {customer.grade || 'N/A'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.contactName && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UserPlus className="w-4 h-4" />
                  <span>{customer.contactName}</span>
                </div>
              )}

              {customer.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
              )}

              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}

              {customer.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{customer.address}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>등록: {new Date(customer.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <Link href={`/dashboard/customers/${customer.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-1" />
                    상세보기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 결과가 없는 경우 */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            고객이 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedGrade 
              ? '검색 조건에 맞는 고객이 없습니다.' 
              : '아직 등록된 고객이 없습니다.'}
          </p>
          {!searchTerm && !selectedGrade && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              첫 번째 고객 등록하기
            </Button>
          )}
        </div>
      )}
    </div>
  );
}