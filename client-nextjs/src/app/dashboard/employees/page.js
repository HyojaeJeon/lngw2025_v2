'use client'

import { useState } from 'react'
import { useLanguage } from '../../../contexts/languageContext.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.js'
import { Badge } from '../../../components/ui/badge.js'
import { Button } from '../../../components/ui/button.js'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
  Star,
  Bell
} from 'lucide-react'

export default function EmployeeDashboardPage() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState('month')

  // 직원 대시보드 데이터
  const dashboardData = {
    summary: {
      totalEmployees: 127,
      activeEmployees: 124,
      onLeave: 8,
      newHires: 3
    },
    leaveStats: {
      pendingRequests: 12,
      approvedToday: 5,
      totalDaysUsed: 234,
      remainingDays: 1456
    },
    attendance: {
      onTime: 98,
      late: 15,
      absent: 3,
      overtime: 8
    },
    recent: {
      activities: [
        { id: 1, type: 'leave', employee: '김민수', action: '연차 신청', status: 'pending', time: '10분 전' },
        { id: 2, type: 'attendance', employee: '이영희', action: '지각 기록', status: 'warning', time: '30분 전' },
        { id: 3, type: 'salary', employee: '박철수', action: '급여 조정', status: 'approved', time: '1시간 전' },
        { id: 4, type: 'evaluation', employee: '정미영', action: '성과평가 완료', status: 'completed', time: '2시간 전' },
      ]
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">대기중</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">승인</Badge>
      case 'warning':
        return <Badge className="bg-red-100 text-red-800">주의</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">완료</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const quickActions = [
    { name: '휴가 승인', href: '/dashboard/employees/leave', icon: Calendar, color: 'bg-blue-500' },
    { name: '급여 확인', href: '/dashboard/employees/salary', icon: DollarSign, color: 'bg-green-500' },
    { name: '근태 관리', href: '/dashboard/employees/attendance', icon: Clock, color: 'bg-purple-500' },
    { name: '성과 평가', href: '/dashboard/employees/evaluation', icon: Star, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('employees.dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            직원 현황과 주요 지표를 한눈에 확인하세요
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={period === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('week')}
          >
            주간
          </Button>
          <Button
            variant={period === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('month')}
          >
            월간
          </Button>
          <Button
            variant={period === 'quarter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('quarter')}
          >
            분기
          </Button>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 직원 수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData.summary.totalEmployees}명
            </div>
            <p className="text-xs text-muted-foreground">
              활성 직원: {dashboardData.summary.activeEmployees}명
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">휴가 중</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboardData.summary.onLeave}명
            </div>
            <p className="text-xs text-muted-foreground">
              대기 요청: {dashboardData.leaveStats.pendingRequests}건
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">신규 채용</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData.summary.newHires}명
            </div>
            <p className="text-xs text-muted-foreground">
              이번 달 신규 입사
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">출근율</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {((dashboardData.attendance.onTime / dashboardData.summary.activeEmployees) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              정시 출근: {dashboardData.attendance.onTime}명
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 빠른 작업 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">빠른 작업</CardTitle>
            <CardDescription>
              자주 사용하는 직원 관리 기능에 빠르게 접근하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <Button variant="ghost" className="justify-start flex-1 h-auto p-2">
                  <span className="text-sm font-medium">{action.name}</span>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 출근 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">오늘 출근 현황</CardTitle>
            <CardDescription>
              직원들의 실시간 출근 상태입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">정시 출근</span>
              </div>
              <Badge variant="secondary">{dashboardData.attendance.onTime}명</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">지각</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">{dashboardData.attendance.late}명</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">결근</span>
              </div>
              <Badge variant="destructive">{dashboardData.attendance.absent}명</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm">초과근무</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">{dashboardData.attendance.overtime}명</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">최근 활동</CardTitle>
            <CardDescription>
              최근 직원 관련 활동들을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recent.activities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.employee}</p>
                  <p className="text-xs text-gray-600">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <div>
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 휴가 및 근태 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">휴가 현황</CardTitle>
            <CardDescription>
              전체 직원의 휴가 사용 현황입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">총 사용 일수</span>
                <span className="font-semibold">{dashboardData.leaveStats.totalDaysUsed}일</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">잔여 일수</span>
                <span className="font-semibold text-green-600">{dashboardData.leaveStats.remainingDays}일</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">오늘 승인</span>
                <span className="font-semibold text-blue-600">{dashboardData.leaveStats.approvedToday}건</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(dashboardData.leaveStats.totalDaysUsed / (dashboardData.leaveStats.totalDaysUsed + dashboardData.leaveStats.remainingDays)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                전체 휴가 사용률: {((dashboardData.leaveStats.totalDaysUsed / (dashboardData.leaveStats.totalDaysUsed + dashboardData.leaveStats.remainingDays)) * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">베트남 노동법 준수</CardTitle>
            <CardDescription>
              현지 법규 준수 현황을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">법정 휴일 적용</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">최대 근무시간 준수</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">연차 산정 기준</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">급여 지급 기준</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                모든 베트남 노동법 기준을 준수하고 있습니다
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}