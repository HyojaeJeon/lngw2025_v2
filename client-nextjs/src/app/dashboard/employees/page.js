
"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Badge } from "@/components/ui/badge.js";
import { useLanguage } from '@/hooks/useLanguage.js';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EMPLOYEES, CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '@/lib/graphql/employeeOperations.js';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  User,
  Filter
} from "lucide-react";
import Link from "next/link";

export default function EmployeesPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hireDate: "",
    salary: "",
    status: "ACTIVE"
  });

  const { data: employeesData, loading, error, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      filter: {
        search: searchTerm,
        department: departmentFilter
      }
    }
  });

  const [createEmployee] = useMutation(CREATE_EMPLOYEE);
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEmployee) {
        await updateEmployee({
          variables: {
            id: selectedEmployee.id,
            input: formData
          }
        });
      } else {
        await createEmployee({
          variables: {
            input: formData
          }
        });
      }
      setShowAddForm(false);
      setSelectedEmployee(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        hireDate: "",
        salary: "",
        status: "ACTIVE"
      });
      refetch();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      position: employee.position || "",
      hireDate: employee.hireDate || "",
      salary: employee.salary || "",
      status: employee.status || "ACTIVE"
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('정말로 이 직원을 삭제하시겠습니까?')) {
      try {
        await deleteEmployee({
          variables: {
            id
          }
        });
        refetch();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { variant: "default", label: "재직", className: "bg-green-100 text-green-800" },
      INACTIVE: { variant: "secondary", label: "휴직", className: "bg-yellow-100 text-yellow-800" },
      TERMINATED: { variant: "destructive", label: "퇴사", className: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status] || statusConfig.ACTIVE;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const employees = employeesData?.employees || [];
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">직원 정보를 불러오는 중...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              직원 관리
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              직원 정보를 관리하고 추적하세요
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 직원 추가
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 직원 수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {employees.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">재직자</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {employees.filter(emp => emp.status === 'ACTIVE').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">부서 수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departments.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">신규 입사 (이번 달)</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="직원 이름, 이메일로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">모든 부서</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 직원 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                  </div>
                  {getStatusBadge(employee.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    {employee.department}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {employee.email}
                  </div>
                  {employee.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {employee.phone}
                    </div>
                  )}
                  {employee.hireDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      입사일: {new Date(employee.hireDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(employee)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    편집
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 빠른 액세스 링크 */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 액세스</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/employees/attendance">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Calendar className="w-6 h-6 mb-2" />
                  출근 관리
                </Button>
              </Link>
              <Link href="/dashboard/employees/salary">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  급여 관리
                </Button>
              </Link>
              <Link href="/dashboard/employees/evaluation">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <User className="w-6 h-6 mb-2" />
                  평가 관리
                </Button>
              </Link>
              <Link href="/dashboard/employees/leave">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Calendar className="w-6 h-6 mb-2" />
                  휴가 관리
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 직원 추가/편집 모달 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {selectedEmployee ? '직원 정보 수정' : '새 직원 추가'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">이름</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">이메일</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">전화번호</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">부서</label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">직책</label>
                    <Input
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">입사일</label>
                    <Input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">급여</label>
                    <Input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">상태</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="ACTIVE">재직</option>
                      <option value="INACTIVE">휴직</option>
                      <option value="TERMINATED">퇴사</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedEmployee(null);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        department: "",
                        position: "",
                        hireDate: "",
                        salary: "",
                        status: "ACTIVE"
                      });
                    }}
                  >
                    취소
                  </Button>
                  <Button type="submit">
                    {selectedEmployee ? '수정' : '추가'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
