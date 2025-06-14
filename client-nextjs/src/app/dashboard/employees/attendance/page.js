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
  GET_ATTENDANCE_RECORDS,
  RECORD_ATTENDANCE,
  UPDATE_ATTENDANCE
} from "@/lib/graphql/employeeOperations.js";
import {
  Clock,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  LogIn,
  LogOut,
  Coffee,
  RotateCcw,
  TrendingUp,
  UserCheck,
  UserX,
  Timer,
  Activity
} from "lucide-react";

export default function AttendancePage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState("");

  // GraphQL 쿼리
  const { data, loading, error, refetch } = useQuery(GET_ATTENDANCE_RECORDS, {
    variables: {
      dateFrom: dateFilter,
      dateTo: dateFilter
    }
  });

  // 뮤테이션
  const [recordAttendance] = useMutation(RECORD_ATTENDANCE, {
    refetchQueries: [{ query: GET_ATTENDANCE_RECORDS }]
  });

  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE, {
    refetchQueries: [{ query: GET_ATTENDANCE_RECORDS }]
  });

  const attendanceRecords = data?.attendanceRecords || [];

  // 통계 계산
  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(record => record.status === 'PRESENT').length,
    absent: attendanceRecords.filter(record => record.status === 'ABSENT').length,
    late: attendanceRecords.filter(record => record.status === 'LATE').length,
    avgWorkHours: attendanceRecords.reduce((sum, record) => sum + (record.workHours || 0), 0) / attendanceRecords.length || 0
  };

  const getStatusBadge = (status) => {
    const badges = {
      PRESENT: "bg-green-500 text-white",
      ABSENT: "bg-red-500 text-white",
      LATE: "bg-yellow-500 text-white",
      HALF_DAY: "bg-blue-500 text-white",
      SICK_LEAVE: "bg-purple-500 text-white",
      VACATION: "bg-indigo-500 text-white"
    };
    return badges[status] || "bg-gray-500 text-white";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PRESENT': return <CheckCircle className="w-4 h-4" />;
      case 'ABSENT': return <XCircle className="w-4 h-4" />;
      case 'LATE': return <Clock className="w-4 h-4" />;
      case 'HALF_DAY': return <Activity className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      PRESENT: '출근',
      ABSENT: '결근',
      LATE: '지각',
      HALF_DAY: '반차',
      SICK_LEAVE: '병가',
      VACATION: '휴가'
    };
    return statusMap[status] || status;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 
                         bg-clip-text text-transparent">
            출근/퇴근 관리
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            직원 근태 관리 및 출퇴근 기록
          </p>
          <div className="flex gap-2 mt-4">
            <Button className="hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <Plus className="w-4 h-4 mr-2" />
              출근 등록
            </Button>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
            <Button
              variant="outline"
              className="hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              근태현황 다운로드
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
                    전체 기록
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
                    정상 출근
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.present}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    지각/결근
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.absent + stats.late}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    평균 근무시간
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.avgWorkHours.toFixed(1)}h
                  </p>
                </div>
                <Timer className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 필터 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="직원명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">모든 상태</option>
                  <option value="PRESENT">출근</option>
                  <option value="ABSENT">결근</option>
                  <option value="LATE">지각</option>
                  <option value="HALF_DAY">반차</option>
                  <option value="SICK_LEAVE">병가</option>
                  <option value="VACATION">휴가</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 출근 기록 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              출근 기록 ({attendanceRecords.length}건)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">직원</th>
                    <th className="text-left py-3 px-4">날짜</th>
                    <th className="text-left py-3 px-4">출근시간</th>
                    <th className="text-left py-3 px-4">퇴근시간</th>
                    <th className="text-left py-3 px-4">근무시간</th>
                    <th className="text-left py-3 px-4">상태</th>
                    <th className="text-left py-3 px-4">비고</th>
                    <th className="text-center py-3 px-4">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords
                    .filter(record => 
                      !searchTerm || 
                      record.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .filter(record => !statusFilter || record.status === statusFilter)
                    .map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {record.employee?.name?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{record.employee?.name}</p>
                            <p className="text-sm text-gray-500">{record.employee?.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <LogIn className="w-4 h-4 text-green-500" />
                          <span>{formatTime(record.checkIn)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>{formatTime(record.checkOut)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-blue-500" />
                          <span>{record.workHours ? `${record.workHours.toFixed(1)}h` : '-'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusBadge(record.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(record.status)}
                            <span>{getStatusText(record.status)}</span>
                          </div>
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {record.notes || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
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

            {attendanceRecords.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">해당 날짜의 출근 기록이 없습니다.</p>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  출근 기록 추가
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}