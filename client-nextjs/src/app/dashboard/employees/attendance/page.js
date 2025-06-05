'use client'

import { useState } from 'react'
import { useLanguage } from '../../../../contexts/languageContext.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Badge } from '../../../../components/ui/badge.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Label } from '../../../../components/ui/label.js'
import { 
  Clock, 
  Plus, 
  Search, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  Download
} from 'lucide-react'

export default function AttendanceManagementPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('2024-02-15')
  const [viewMode, setViewMode] = useState('daily')

  // 베트남 노동법 기준 근태 데이터
  const attendanceData = [
    {
      id: 'EMP-001',
      employee: '김민수',
      department: '개발팀',
      date: '2024-02-15',
      checkIn: '08:30',
      checkOut: '17:45',
      workHours: 8.25,
      overtimeHours: 0.75,
      status: 'present',
      lateMinutes: 0,
      earlyLeaveMinutes: 0
    },
    {
      id: 'EMP-002',
      employee: 'Nguyen Van A',
      department: '마케팅팀',
      date: '2024-02-15',
      checkIn: '08:45',
      checkOut: '18:00',
      workHours: 8.25,
      overtimeHours: 1,
      status: 'late',
      lateMinutes: 15,
      earlyLeaveMinutes: 0
    },
    {
      id: 'EMP-003',
      employee: 'Tran Thi B',
      department: '인사팀',
      date: '2024-02-15',
      checkIn: '08:25',
      checkOut: '17:30',
      workHours: 8.08,
      overtimeHours: 0,
      status: 'present',
      lateMinutes: 0,
      earlyLeaveMinutes: 0
    },
    {
      id: 'EMP-004',
      employee: '정영희',
      department: '재무팀',
      date: '2024-02-15',
      checkIn: null,
      checkOut: null,
      workHours: 0,
      overtimeHours: 0,
      status: 'absent',
      lateMinutes: 0,
      earlyLeaveMinutes: 0
    }
  ]

  // 베트남 노동법 기준 근태 정책
  const vietnamAttendancePolicy = {
    standardWorkHours: 8, // 1일 8시간
    weeklyMaxHours: 48, // 주 48시간
    monthlyOvertimeLimit: 30, // 월 30시간 초과근무 한도
    yearlyOvertimeLimit: 200, // 연 200시간 초과근무 한도
    lateGracePeriod: 15, // 15분 지각 허용
    lunchBreak: 60 // 점심시간 60분
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">출근</Badge>
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">지각</Badge>
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">결근</Badge>
      case 'leave':
        return <Badge className="bg-blue-100 text-blue-800">휴가</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateAttendanceStats = () => {
    const total = attendanceData.length
    const present = attendanceData.filter(a => a.status === 'present').length
    const late = attendanceData.filter(a => a.status === 'late').length
    const absent = attendanceData.filter(a => a.status === 'absent').length
    const totalOvertimeHours = attendanceData.reduce((sum, a) => sum + a.overtimeHours, 0)

    return {
      total,
      present,
      late,
      absent,
      attendanceRate: ((present + late) / total * 100).toFixed(1),
      totalOvertimeHours
    }
  }

  const stats = calculateAttendanceStats()

  const filteredAttendance = attendanceData.filter(att =>
    att.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    att.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('employees.attendance')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            베트남 노동법 기준 근태 관리 시스템
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            근태 리포트
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            수동 체크인
          </Button>
        </div>
      </div>

      {/* 근태 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 직원</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}명</div>
            <p className="text-xs text-muted-foreground">
              {selectedDate} 기준
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">정상 출근</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}명</div>
            <p className="text-xs text-muted-foreground">
              출근율: {stats.attendanceRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">지각</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}명</div>
            <p className="text-xs text-muted-foreground">
              전체의 {((stats.late / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">결근</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}명</div>
            <p className="text-xs text-muted-foreground">
              전체의 {((stats.absent / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">초과근무</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalOvertimeHours}시간</div>
            <p className="text-xs text-muted-foreground">
              월 한도: {vietnamAttendancePolicy.monthlyOvertimeLimit}시간
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 베트남 근태 정책 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">베트남 노동법 기준 근태 정책</CardTitle>
          <CardDescription>
            현지 법규에 따른 근무시간 및 초과근무 기준
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm text-blue-600">표준 근무시간</h4>
              <p className="text-xl font-bold">{vietnamAttendancePolicy.standardWorkHours}시간/일</p>
              <p className="text-xs text-gray-600">주 {vietnamAttendancePolicy.weeklyMaxHours}시간</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm text-orange-600">월 초과근무 한도</h4>
              <p className="text-xl font-bold">{vietnamAttendancePolicy.monthlyOvertimeLimit}시간</p>
              <p className="text-xs text-gray-600">연 {vietnamAttendancePolicy.yearlyOvertimeLimit}시간</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm text-yellow-600">지각 허용</h4>
              <p className="text-xl font-bold">{vietnamAttendancePolicy.lateGracePeriod}분</p>
              <p className="text-xs text-gray-600">지각 기준</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">직원 검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="직원명 또는 부서명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="date">조회 날짜</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="viewMode">보기 모드</Label>
              <select
                id="viewMode"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">일별</option>
                <option value="weekly">주별</option>
                <option value="monthly">월별</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 근태 기록 */}
      <Card>
        <CardHeader>
          <CardTitle>근태 기록</CardTitle>
          <CardDescription>
            {selectedDate} 근태 현황 ({filteredAttendance.length}명)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">직원명</th>
                  <th className="text-left py-3 px-4 font-semibold">부서</th>
                  <th className="text-center py-3 px-4 font-semibold">출근시간</th>
                  <th className="text-center py-3 px-4 font-semibold">퇴근시간</th>
                  <th className="text-center py-3 px-4 font-semibold">근무시간</th>
                  <th className="text-center py-3 px-4 font-semibold">초과근무</th>
                  <th className="text-center py-3 px-4 font-semibold">지각</th>
                  <th className="text-center py-3 px-4 font-semibold">상태</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((att) => (
                  <tr key={att.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-medium">{att.employee}</td>
                    <td className="py-3 px-4">{att.department}</td>
                    <td className="py-3 px-4 text-center">
                      {att.checkIn || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {att.checkOut || '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-medium">
                      {att.workHours}시간
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={att.overtimeHours > 0 ? 'text-orange-600 font-medium' : ''}>
                        {att.overtimeHours}시간
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {att.lateMinutes > 0 ? (
                        <span className="text-red-600 font-medium">{att.lateMinutes}분</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(att.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 초과근무 현황 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>월별 초과근무 현황</CardTitle>
            <CardDescription>
              베트남 노동법 한도 대비 현재 사용량
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.filter(att => att.overtimeHours > 0).map((att) => (
                <div key={att.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{att.employee}</p>
                    <p className="text-sm text-gray-600">{att.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{att.overtimeHours}시간</p>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${(att.overtimeHours / vietnamAttendancePolicy.monthlyOvertimeLimit) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>근태 위반 알림</CardTitle>
            <CardDescription>
              베트남 노동법 위반 가능성 체크
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">초과근무 한도 접근</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">주의</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">연속 결근 직원</span>
                </div>
                <Badge variant="destructive">긴급</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">법규 준수 현황</span>
                </div>
                <Badge className="bg-green-100 text-green-800">양호</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}