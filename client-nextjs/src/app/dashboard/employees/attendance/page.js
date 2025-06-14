
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
import {
  Clock,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus
} from "lucide-react";

export default function AttendancePage() {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // 샘플 출근 데이터
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: "김민수",
      department: "개발팀",
      position: "시니어 개발자",
      date: "2025-01-13",
      checkIn: "09:00",
      checkOut: "18:30",
      workHours: 8.5,
      status: "정상",
      lateMinutes: 0,
      overtimeHours: 0.5,
      notes: ""
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: "이영희",
      department: "마케팅팀",
      position: "마케팅 매니저",
      date: "2025-01-13",
      checkIn: "09:15",
      checkOut: "18:00",
      workHours: 7.75,
      status: "지각",
      lateMinutes: 15,
      overtimeHours: 0,
      notes: "교통 체증"
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: "박철수",
      department: "영업팀",
      position: "영업 대표",
      date: "2025-01-13",
      checkIn: "08:45",
      checkOut: "19:30",
      workHours: 9.75,
      status: "정상",
      lateMinutes: 0,
      overtimeHours: 1.75,
      notes: "고객 미팅"
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: "최지현",
      department: "인사팀",
      position: "인사 담당자",
      date: "2025-01-13",
      checkIn: null,
      checkOut: null,
      workHours: 0,
      status: "결근",
      lateMinutes: 0,
      overtimeHours: 0,
      notes: "병가"
    }
  ]);

  const [formData, setFormData] = useState({
    employeeId: "",
    date: currentDate,
    checkIn: "",
    checkOut: "",
    notes: ""
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      "정상": { className: "bg-green-100 text-green-800", icon: CheckCircle },
      "지각": { className: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      "결근": { className: "bg-red-100 text-red-800", icon: XCircle },
      "조퇴": { className: "bg-orange-100 text-orange-800", icon: AlertTriangle }
    };
    
    const config = statusConfig[status] || statusConfig["정상"];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const filteredData = attendanceData.filter(record => 
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (departmentFilter === "" || record.department === departmentFilter) &&
    record.date === currentDate
  );

  const departments = [...new Set(attendanceData.map(record => record.department))];

  const todayStats = {
    total: filteredData.length,
    present: filteredData.filter(r => r.status !== "결근").length,
    late: filteredData.filter(r => r.status === "지각").length,
    absent: filteredData.filter(r => r.status === "결근").length,
    overtime: filteredData.filter(r => r.overtimeHours > 0).length
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 출근 기록 추가 로직
    const newRecord = {
      id: attendanceData.length + 1,
      ...formData,
      workHours: formData.checkOut && formData.checkIn ? 
        ((new Date(`2000-01-01 ${formData.checkOut}`) - new Date(`2000-01-01 ${formData.checkIn}`)) / (1000 * 60 * 60)) : 0,
      status: "정상",
      lateMinutes: 0,
      overtimeHours: 0
    };
    
    setAttendanceData([...attendanceData, newRecord]);
    setShowAddForm(false);
    setFormData({
      employeeId: "",
      date: currentDate,
      checkIn: "",
      checkOut: "",
      notes: ""
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              출근 관리
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              직원 출퇴근 현황을 관리하고 추적하세요
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              엑셀 다운로드
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              출근 기록 추가
            </Button>
          </div>
        </div>

        {/* 날짜 선택 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-blue-500" />
              <label className="font-medium">날짜 선택:</label>
              <Input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-auto"
              />
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 인원</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">출근</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.present}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">지각</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.late}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">결근</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.absent}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">연장근무</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.overtime}
                  </p>
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
                    placeholder="직원 이름으로 검색..."
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

        {/* 출근 기록 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>출근 현황 ({currentDate})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">직원명</th>
                    <th className="text-left p-4 font-medium">부서</th>
                    <th className="text-left p-4 font-medium">직책</th>
                    <th className="text-left p-4 font-medium">출근시간</th>
                    <th className="text-left p-4 font-medium">퇴근시간</th>
                    <th className="text-left p-4 font-medium">근무시간</th>
                    <th className="text-left p-4 font-medium">상태</th>
                    <th className="text-left p-4 font-medium">지각시간</th>
                    <th className="text-left p-4 font-medium">연장시간</th>
                    <th className="text-left p-4 font-medium">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{record.employeeName}</td>
                      <td className="p-4 text-gray-600">{record.department}</td>
                      <td className="p-4 text-gray-600">{record.position}</td>
                      <td className="p-4">
                        {record.checkIn ? (
                          <span className="text-green-600 font-medium">{record.checkIn}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {record.checkOut ? (
                          <span className="text-blue-600 font-medium">{record.checkOut}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 font-medium">
                        {record.workHours ? `${record.workHours}시간` : '-'}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="p-4">
                        {record.lateMinutes > 0 ? (
                          <span className="text-yellow-600 font-medium">
                            {record.lateMinutes}분
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {record.overtimeHours > 0 ? (
                          <span className="text-purple-600 font-medium">
                            {record.overtimeHours}시간
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 출근 기록 추가 모달 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">출근 기록 추가</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">직원</label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">직원 선택</option>
                    <option value="1">김민수</option>
                    <option value="2">이영희</option>
                    <option value="3">박철수</option>
                    <option value="4">최지현</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">날짜</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">출근시간</label>
                  <Input
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">퇴근시간</label>
                  <Input
                    type="time"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">비고</label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="특이사항 입력"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">추가</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
