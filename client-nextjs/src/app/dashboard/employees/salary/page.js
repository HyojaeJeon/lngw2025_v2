'use client'

import { useState } from 'react'
import { useLanguage } from '../../../../contexts/languageContext.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Badge } from '../../../../components/ui/badge.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Label } from '../../../../components/ui/label.js'
import { 
  DollarSign, 
  Plus, 
  Search, 
  Download,
  TrendingUp,
  Calendar,
  Calculator,
  FileText,
  Shield
} from 'lucide-react'

export default function SalaryManagementPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('2024-02')
  const [showSalaryForm, setShowSalaryForm] = useState(false)

  // 베트남 급여 데이터 (VND 단위)
  const salaryData = [
    {
      id: 'EMP-001',
      employee: '김민수',
      department: '개발팀',
      position: '시니어 개발자',
      baseSalary: 25000000, // 25M VND
      allowances: {
        meal: 2000000,
        transport: 1500000,
        phone: 500000,
        housing: 5000000
      },
      overtime: {
        hours: 20,
        rate: 150000,
        amount: 3000000
      },
      deductions: {
        socialInsurance: 2000000, // 8%
        healthInsurance: 625000,  // 2.5%
        unemployment: 250000,     // 1%
        tax: 3500000
      },
      netSalary: 31625000,
      status: 'processed'
    },
    {
      id: 'EMP-002',
      employee: 'Nguyen Van A',
      department: '마케팅팀',
      position: '마케팅 매니저',
      baseSalary: 20000000,
      allowances: {
        meal: 2000000,
        transport: 1500000,
        phone: 500000,
        housing: 4000000
      },
      overtime: {
        hours: 15,
        rate: 120000,
        amount: 1800000
      },
      deductions: {
        socialInsurance: 1600000,
        healthInsurance: 500000,
        unemployment: 200000,
        tax: 2800000
      },
      netSalary: 25200000,
      status: 'pending'
    },
    {
      id: 'EMP-003',
      employee: 'Tran Thi B',
      department: '인사팀',
      position: '인사 담당자',
      baseSalary: 18000000,
      allowances: {
        meal: 2000000,
        transport: 1500000,
        phone: 500000,
        housing: 3500000
      },
      overtime: {
        hours: 10,
        rate: 110000,
        amount: 1100000
      },
      deductions: {
        socialInsurance: 1440000,
        healthInsurance: 450000,
        unemployment: 180000,
        tax: 2200000
      },
      netSalary: 22330000,
      status: 'processed'
    }
  ]

  // 베트남 노동법 기준 급여 정책
  const vietnamSalaryPolicy = {
    minimumWage: 4680000, // VND/month (2024년 기준)
    socialInsurance: 8, // 8%
    healthInsurance: 2.5, // 2.5%
    unemployment: 1, // 1%
    maxOvertimeHours: 200, // 연간 최대 200시간
    overtimeRate: 150 // 150% 기본급
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">처리중</Badge>
      case 'processed':
        return <Badge className="bg-green-100 text-green-800">완료</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">오류</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateTotalSalary = () => {
    return salaryData.reduce((total, emp) => total + emp.netSalary, 0)
  }

  const filteredSalaryData = salaryData.filter(emp =>
    emp.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('employees.salary')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            베트남 노동법 기준 급여 관리 시스템
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            급여명세서 다운로드
          </Button>
          <Button onClick={() => setShowSalaryForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            급여 계산
          </Button>
        </div>
      </div>

      {/* 월별 급여 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 급여 지급액</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculateTotalSalary())}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedMonth} 기준
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 급여</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(calculateTotalSalary() / salaryData.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              직원 {salaryData.length}명 기준
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">초과근무 총액</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(salaryData.reduce((total, emp) => total + emp.overtime.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              총 {salaryData.reduce((total, emp) => total + emp.overtime.hours, 0)}시간
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">법정공제 총액</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(salaryData.reduce((total, emp) => 
                total + emp.deductions.socialInsurance + emp.deductions.healthInsurance + emp.deductions.unemployment, 0
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              사회보험 + 건강보험 + 실업보험
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 베트남 급여 정책 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">베트남 노동법 기준 급여 정책</CardTitle>
          <CardDescription>
            현지 법규에 따른 급여 계산 기준
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm text-blue-600">최저임금</h4>
              <p className="text-xl font-bold">{formatCurrency(vietnamSalaryPolicy.minimumWage)}</p>
              <p className="text-xs text-gray-600">월 기준 (2024년)</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm text-green-600">사회보험료</h4>
              <p className="text-xl font-bold">{vietnamSalaryPolicy.socialInsurance}%</p>
              <p className="text-xs text-gray-600">기본급의 8%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm text-purple-600">건강보험료</h4>
              <p className="text-xl font-bold">{vietnamSalaryPolicy.healthInsurance}%</p>
              <p className="text-xs text-gray-600">기본급의 2.5%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm text-orange-600">실업보험료</h4>
              <p className="text-xl font-bold">{vietnamSalaryPolicy.unemployment}%</p>
              <p className="text-xs text-gray-600">기본급의 1%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm text-red-600">초과근무 한도</h4>
              <p className="text-xl font-bold">{vietnamSalaryPolicy.maxOvertimeHours}시간</p>
              <p className="text-xs text-gray-600">연간 최대</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm text-indigo-600">초과근무 수당</h4>
              <p className="text-xl font-bold">{vietnamSalaryPolicy.overtimeRate}%</p>
              <p className="text-xs text-gray-600">기본 시급 대비</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 검색 및 필터 */}
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
              <Label htmlFor="month">급여 월</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 급여 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>급여 명세서</CardTitle>
          <CardDescription>
            {selectedMonth} 급여 계산 결과 ({filteredSalaryData.length}명)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">직원명</th>
                  <th className="text-left py-3 px-4 font-semibold">부서/직책</th>
                  <th className="text-right py-3 px-4 font-semibold">기본급</th>
                  <th className="text-right py-3 px-4 font-semibold">수당</th>
                  <th className="text-right py-3 px-4 font-semibold">초과근무</th>
                  <th className="text-right py-3 px-4 font-semibold">공제액</th>
                  <th className="text-right py-3 px-4 font-semibold">실수령액</th>
                  <th className="text-center py-3 px-4 font-semibold">상태</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaryData.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{emp.employee}</div>
                        <div className="text-sm text-gray-500">{emp.id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{emp.department}</div>
                        <div className="text-sm text-gray-500">{emp.position}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(emp.baseSalary)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(Object.values(emp.allowances).reduce((a, b) => a + b, 0))}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div>
                        <div className="font-medium">{formatCurrency(emp.overtime.amount)}</div>
                        <div className="text-sm text-gray-500">{emp.overtime.hours}시간</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      {formatCurrency(Object.values(emp.deductions).reduce((a, b) => a + b, 0))}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-green-600">
                      {formatCurrency(emp.netSalary)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(emp.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 급여 계산 폼 (모달) */}
      {showSalaryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>급여 계산</CardTitle>
              <CardDescription>
                베트남 노동법 기준에 따른 급여를 계산합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="empName">직원명</Label>
                  <Input id="empName" placeholder="직원명을 입력하세요" />
                </div>
                <div>
                  <Label htmlFor="empDept">부서</Label>
                  <Input id="empDept" placeholder="부서명을 입력하세요" />
                </div>
              </div>

              {/* 기본급 */}
              <div>
                <Label htmlFor="baseSalary">기본급 (VND)</Label>
                <Input 
                  id="baseSalary" 
                  type="number" 
                  placeholder={`최저임금: ${vietnamSalaryPolicy.minimumWage.toLocaleString()}`}
                />
              </div>

              {/* 수당 */}
              <div>
                <Label className="text-base font-semibold">수당</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="mealAllowance">식대</Label>
                    <Input id="mealAllowance" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="transportAllowance">교통비</Label>
                    <Input id="transportAllowance" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="phoneAllowance">통신비</Label>
                    <Input id="phoneAllowance" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="housingAllowance">주거비</Label>
                    <Input id="housingAllowance" type="number" placeholder="0" />
                  </div>
                </div>
              </div>

              {/* 초과근무 */}
              <div>
                <Label className="text-base font-semibold">초과근무</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="overtimeHours">초과근무 시간</Label>
                    <Input 
                      id="overtimeHours" 
                      type="number" 
                      placeholder={`최대 ${vietnamSalaryPolicy.maxOvertimeHours}시간/년`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="overtimeRate">시간당 수당 (VND)</Label>
                    <Input id="overtimeRate" type="number" placeholder="기본급의 150%" />
                  </div>
                </div>
              </div>

              {/* 법정 공제 (자동 계산) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-base font-semibold">법정 공제 (자동 계산)</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">사회보험</p>
                    <p className="font-semibold">{vietnamSalaryPolicy.socialInsurance}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">건강보험</p>
                    <p className="font-semibold">{vietnamSalaryPolicy.healthInsurance}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">실업보험</p>
                    <p className="font-semibold">{vietnamSalaryPolicy.unemployment}%</p>
                  </div>
                </div>
              </div>

              {/* 소득세 */}
              <div>
                <Label htmlFor="incomeTax">소득세 (VND)</Label>
                <Input id="incomeTax" type="number" placeholder="소득세액을 입력하세요" />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowSalaryForm(false)}>
                  취소
                </Button>
                <Button>
                  급여 계산
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}