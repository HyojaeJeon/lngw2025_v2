'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Badge } from '../../../../components/ui/badge.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Label } from '../../../../components/ui/label.js'
import { 
  Calculator, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Clock
} from 'lucide-react'

export default function TaxManagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01')

  // 세무 신고 현황
  const taxReports = [
    {
      id: 'VAT-2024-01',
      type: '부가가치세',
      period: '2024년 1분기',
      dueDate: '2024-04-25',
      status: 'submitted',
      amount: 2850000,
      submittedDate: '2024-04-20'
    },
    {
      id: 'CIT-2023',
      type: '법인세',
      period: '2023년도',
      dueDate: '2024-03-31',
      status: 'submitted',
      amount: 8500000,
      submittedDate: '2024-03-25'
    },
    {
      id: 'VAT-2024-02',
      type: '부가가치세',
      period: '2024년 2분기',
      dueDate: '2024-07-25',
      status: 'pending',
      amount: 3200000,
      submittedDate: null
    },
    {
      id: 'WHT-2024-01',
      type: '원천징수세',
      period: '2024년 1월',
      dueDate: '2024-02-10',
      status: 'overdue',
      amount: 450000,
      submittedDate: null
    }
  ]

  // 세무 달력
  const taxCalendar = [
    { date: '2024-02-10', type: '원천징수세', description: '1월분 원천징수세 신고' },
    { date: '2024-03-31', type: '법인세', description: '2023년도 법인세 신고' },
    { date: '2024-04-25', type: '부가가치세', description: '1분기 부가가치세 신고' },
    { date: '2024-07-25', type: '부가가치세', description: '2분기 부가가치세 신고' },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-green-100 text-green-800">신고완료</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">신고대기</Badge>
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">신고기한 초과</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            세무 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            세무 신고와 납부를 관리하세요
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            신고서 다운로드
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            신고서 작성
          </Button>
        </div>
      </div>

      {/* 세무 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 납부세액</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(3200000)}
            </div>
            <p className="text-xs text-muted-foreground">
              부가가치세 포함
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">신고 대기</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {taxReports.filter(t => t.status === 'pending').length}건
            </div>
            <p className="text-xs text-muted-foreground">
              신고가 필요한 건수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">연체 건수</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {taxReports.filter(t => t.status === 'overdue').length}건
            </div>
            <p className="text-xs text-muted-foreground">
              기한이 지난 신고
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료 건수</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {taxReports.filter(t => t.status === 'submitted').length}건
            </div>
            <p className="text-xs text-muted-foreground">
              신고 완료된 건수
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 세무 신고 현황 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">세무 신고 현황</CardTitle>
            <CardDescription>
              최근 세무 신고 내역을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">신고번호</th>
                    <th className="text-left py-3 px-4 font-semibold">세목</th>
                    <th className="text-left py-3 px-4 font-semibold">신고기간</th>
                    <th className="text-left py-3 px-4 font-semibold">신고기한</th>
                    <th className="text-right py-3 px-4 font-semibold">세액</th>
                    <th className="text-center py-3 px-4 font-semibold">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {taxReports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 font-mono text-sm">{report.id}</td>
                      <td className="py-3 px-4">{report.type}</td>
                      <td className="py-3 px-4">{report.period}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span>{report.dueDate}</span>
                          {report.status === 'pending' && getDaysUntilDue(report.dueDate) <= 7 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {formatCurrency(report.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(report.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 세무 달력 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">세무 달력</CardTitle>
            <CardDescription>
              다가오는 세무 일정을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {taxCalendar.map((item, index) => {
              const daysUntil = getDaysUntilDue(item.date)
              const isUrgent = daysUntil <= 7 && daysUntil >= 0
              const isPast = daysUntil < 0
              
              return (
                <div key={index} className={`p-3 rounded-lg border ${
                  isPast ? 'bg-red-50 border-red-200' : 
                  isUrgent ? 'bg-yellow-50 border-yellow-200' : 
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.type}</p>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{item.date}</p>
                      <p className={`text-xs ${
                        isPast ? 'text-red-600' : 
                        isUrgent ? 'text-yellow-600' : 
                        'text-gray-500'
                      }`}>
                        {isPast ? `${Math.abs(daysUntil)}일 지남` : 
                         daysUntil === 0 ? '오늘' : 
                         `${daysUntil}일 남음`}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* 세목별 신고 현황 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">세목별 신고 현황</CardTitle>
          <CardDescription>
            세목별 신고 현황을 한눈에 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">부가가치세</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(6050000)}
              </p>
              <p className="text-sm text-gray-600">연간 납부액</p>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>완료:</span>
                  <span className="text-green-600">2건</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>대기:</span>
                  <span className="text-yellow-600">1건</span>
                </div>
              </div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">법인세</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(8500000)}
              </p>
              <p className="text-sm text-gray-600">연간 납부액</p>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>완료:</span>
                  <span className="text-green-600">1건</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>대기:</span>
                  <span className="text-yellow-600">0건</span>
                </div>
              </div>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">원천징수세</h3>
              <p className="text-2xl font-bold text-orange-600 mb-2">
                {formatCurrency(5400000)}
              </p>
              <p className="text-sm text-gray-600">연간 납부액</p>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>완료:</span>
                  <span className="text-green-600">11건</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>연체:</span>
                  <span className="text-red-600">1건</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}