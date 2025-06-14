
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useLanguage';
import { 
  Users, 
  Plus, 
  Search, 
  UserCheck,
  UserX,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  Loader2,
  UserPlus,
  Eye,
  Building,
  DollarSign,
  Target
} from 'lucide-react';

// GraphQL Operations
import { gql } from '@apollo/client';

const GET_EMPLOYEES = gql`
  query GetEmployees($department: String, $status: EmployeeStatus, $search: String, $first: Int, $skip: Int) {
    employees(department: $department, status: $status, search: $search, first: $first, skip: $skip) {
      id
      employeeId
      name
      email
      phone
      department
      position
      status
      hireDate
      salary
      avatar
      isActive
      createdAt
    }
  }
`;

const GET_EMPLOYEE_STATS = gql`
  query GetEmployeeStats {
    employeeStats {
      totalEmployees
      activeEmployees
      onLeaveEmployees
      newHiresThisMonth
      pendingLeaveRequests
      todayAttendance
      averageWorkHours
      departmentStats {
        department
        employeeCount
        averageSalary
        attendanceRate
      }
    }
  }
`;

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      id
      employeeId
      name
      email
      department
      position
      status
      hireDate
    }
  }
`;

export default function EmployeesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  const { data: employeesData, loading: employeesLoading, error: employeesError, refetch: refetchEmployees } = useQuery(GET_EMPLOYEES, {
    variables: { 
      first: 50,
      skip: 0,
      search: searchTerm || undefined,
      department: selectedDepartment || undefined,
      status: selectedStatus || undefined
    },
    errorPolicy: 'ignore'
  });

  const { data: statsData, loading: statsLoading } = useQuery(GET_EMPLOYEE_STATS, {
    errorPolicy: 'ignore'
  });

  const [createEmployee, { loading: createLoading }] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => {
      refetchEmployees();
    },
    onError: (error) => {
      console.error('Create employee error:', error);
    }
  });

  // 로딩 상태
  if (employeesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">직원 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (employeesError && !employeesData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            데이터 로딩 오류
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            직원 데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          <Button onClick={() => refetchEmployees()} className="flex items-center gap-2">
            <Loader2 className="w-4 h-4" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const employees = employeesData?.employees || [];
  const stats = statsData?.employeeStats || {};

  // 필터링된 직원 목록
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm || 
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
    const matchesStatus = !selectedStatus || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // 상태별 배지 색상
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'TERMINATED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 상태 한국어 변환
  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return '재직중';
      case 'ON_LEAVE': return '휴직중';
      case 'INACTIVE': return '비활성';
      case 'TERMINATED': return '퇴사';
      default: return status;
    }
  };

  // 고유 부서 목록
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                      rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                           bg-clip-text text-transparent">
              직원 관리
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              직원 정보를 체계적으로 관리하고 조직을 효율적으로 운영하세요
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => router.push('/dashboard/employees/add')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                         text-white shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              신규 직원 등록
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 직원</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalEmployees || 0}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">재직 중</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeEmployees || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">휴직 중</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.onLeaveEmployees || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <UserX className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
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
                  {stats.newHiresThisMonth || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <UserPlus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                placeholder="직원명, 사번, 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체 부서</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체 상태</option>
              <option value="ACTIVE">재직중</option>
              <option value="ON_LEAVE">휴직중</option>
              <option value="INACTIVE">비활성</option>
              <option value="TERMINATED">퇴사</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 직원 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {employee.avatar ? (
                      <img 
                        src={employee.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      employee.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {employee.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {employee.employeeId}
                    </p>
                  </div>
                </div>
                <Badge className={`${getStatusBadgeColor(employee.status)} text-xs`}>
                  {getStatusText(employee.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Building className="w-4 h-4" />
                <span>{employee.department} • {employee.position}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>입사: {new Date(employee.hireDate).toLocaleDateString('ko-KR')}</span>
              </div>

              {employee.salary && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>연봉: {employee.salary.toLocaleString()}만원</span>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <Link href={`/dashboard/employees/${employee.id}`} className="flex-1">
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
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            직원이 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedDepartment || selectedStatus
              ? '검색 조건에 맞는 직원이 없습니다.' 
              : '아직 등록된 직원이 없습니다.'}
          </p>
          {!searchTerm && !selectedDepartment && !selectedStatus && (
            <Button onClick={() => router.push('/dashboard/employees/add')}>
              <Plus className="w-4 h-4 mr-2" />
              첫 번째 직원 등록하기
            </Button>
          )}
        </div>
      )}

      {/* 부서별 통계 */}
      {stats.departmentStats && stats.departmentStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              부서별 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.departmentStats.map((dept, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {dept.department}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>직원 수:</span>
                      <span className="font-medium">{dept.employeeCount}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span>평균 연봉:</span>
                      <span className="font-medium">{dept.averageSalary.toFixed(0)}만원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>출석률:</span>
                      <span className="font-medium">{dept.attendanceRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
