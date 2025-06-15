"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import DashboardLayout from "@/components/layout/dashboardLayout.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useLanguage } from "@/hooks/useLanguage.js";
import { 
  GET_EMPLOYEES, 
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE 
} from "@/lib/graphql/employeeOperations.js";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  Building,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  DollarSign,
  Award,
  AlertCircle,
  CheckCircle,
  Plus,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";

export default function EmployeesPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // GraphQL 쿼리
  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      filter: {
        search: searchTerm,
        department: filterDepartment,
        status: filterStatus || undefined
      }
    }
  });

  // 뮤테이션
  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }]
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }]
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }]
  });

  const employees = data?.employeeList || [];

  // 통계 계산
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'ACTIVE').length,
    onLeave: employees.filter(emp => emp.status === 'ON_LEAVE').length,
    inactive: employees.filter(emp => emp.status === 'INACTIVE').length
  };

  const departments = [...new Set(employees.map(emp => emp.department))];

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: "bg-green-500 text-white",
      INACTIVE: "bg-gray-500 text-white", 
      ON_LEAVE: "bg-yellow-500 text-white",
      TERMINATED: "bg-red-500 text-white"
    };
    return badges[status] || "bg-gray-500 text-white";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ACTIVE': return <UserCheck className="w-4 h-4" />;
      case 'ON_LEAVE': return <Clock className="w-4 h-4" />;
      case 'INACTIVE': return <UserX className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{t("common.error")}: {error.message}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent">
            {t("employees.title")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            직원 정보 관리 및 조직 운영
          </p>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              직원 등록
            </Button>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
            <Button
              variant="outline" 
              className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              엑셀 다운로드
            </Button>
          </div>
        </div>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    전체 직원
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    재직 중
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    휴직 중
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.onLeave}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    비활성
                  </p>
                  <p className="text-2xl font-bold text-gray-600">
                    {stats.inactive}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="직원명, 이메일, 직책으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">모든 부서</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">모든 상태</option>
                  <option value="ACTIVE">재직</option>
                  <option value="ON_LEAVE">휴직</option>
                  <option value="INACTIVE">비활성</option>
                  <option value="TERMINATED">퇴사</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 직원 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              직원 목록 ({employees.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">직원정보</th>
                    <th className="text-left py-3 px-4">부서/직책</th>
                    <th className="text-left py-3 px-4">입사일</th>
                    <th className="text-left py-3 px-4">상태</th>
                    <th className="text-left py-3 px-4">연락처</th>
                    <th className="text-center py-3 px-4">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {employee.avatar ? (
                              <img 
                                src={employee.avatar} 
                                alt={employee.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {employee.firstName?.[0]}{employee.lastName?.[0]}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-gray-500">{employee.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{employee.department}</p>
                          <p className="text-sm text-gray-500">{employee.position}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(employee.hireDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusBadge(employee.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(employee.status)}
                            <span>
                              {employee.status === 'ACTIVE' ? '재직' :
                               employee.status === 'ON_LEAVE' ? '휴직' :
                               employee.status === 'INACTIVE' ? '비활성' : '퇴사'}
                            </span>
                          </div>
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{employee.email}</span>
                          </div>
                          {employee.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span>{employee.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {employees.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">등록된 직원이 없습니다.</p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  첫 번째 직원 등록
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}