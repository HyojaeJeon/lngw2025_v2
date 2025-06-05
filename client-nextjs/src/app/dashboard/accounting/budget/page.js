'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Badge } from '../../../../components/ui/badge.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Label } from '../../../../components/ui/label.js'
import { 
  Target, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Plus,
  Edit,
  PieChart
} from 'lucide-react'

export default function BudgetManagementPage() {
  const [selectedYear, setSelectedYear] = useState('2024')
  const [showAddForm, setShowAddForm] = useState(false)

  // 예산 데이터
  const budgetData = [
    {
      category: '매출',
      type: 'revenue',
      budget: 200000000,
      actual: 163000000,
      variance: -37000000,
      percentage: 81.5
    },
    {
      category: '매출원가',
      type: 'expense',
      budget: 90000000,
      actual: 85000000,
      variance: -5000000,
      percentage: 94.4
    },
    {
      category: '급여',
      type: 'expense',
      budget: 40000000,
      actual: 35000000,
      variance: -5000000,
      percentage: 87.5
    },
    {
      category: '임차료',
      type: 'expense',
      budget: 15000000,
      actual: 12000000,
      variance: -3000000,
      percentage: 80.0
    },
    {
      category: '광고선전비',
      type: 'expense',
      budget: 10000000,
      actual: 8500000,
      variance: -1500000,
      percentage: 85.0
    },
    {
      category: '기타 운영비',
      type: 'expense',
      budget: 20000000,
      actual: 18500000,
      variance: -1500000,
      percentage: 92.5
    }
  ]

  // 월별 예산 실적
  const monthlyBudget = [
    { month: '1월', budget: 16666667, actual: 15200000 },
    { month: '2월', budget: 16666667, actual: 14800000 },
    { month: '3월', budget: 16666667, actual: 18500000 },
    { month: '4월', budget: 16666667, actual: 17200000 },
    { month: '5월', budget: 16666667, actual: 16800000 },
    { month: '6월', budget: 16666667, actual: 15900000 },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const getVarianceColor = (variance, type) => {
    if (type === 'revenue') {
      return variance >= 0 ? 'text-green-600' : 'text-red-600'
    } else {
      return variance <= 0 ? 'text-green-600' : 'text-red-600'
    }
  }

  const getVarianceIcon = (variance, type) => {
    if (type === 'revenue') {
      return variance >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
    } else {
      return variance <= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
    }
  }

  const totalBudgetRevenue = budgetData.filter(item => item.type === 'revenue').reduce((sum, item) => sum + item.budget, 0)
  const totalActualRevenue = budgetData.filter(item => item.type === 'revenue').reduce((sum, item) => sum + item.actual, 0)
  const totalBudgetExpense = budgetData.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.budget, 0)
  const totalActualExpense = budgetData.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.actual, 0)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            예산 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            예산 대비 실적을 분석하고 관리하세요
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024">2024년</option>
            <option value="2023">2023년</option>
            <option value="2022">2022년</option>
          </select>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            예산 항목 추가
          </Button>
        </div>
      </div>

      {/* 예산 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 예산 수익</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalBudgetRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              연간 목표 수익
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">실제 수익</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalActualRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              달성률: {((totalActualRevenue / totalBudgetRevenue) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예산 비용</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalBudgetExpense)}
            </div>
            <p className="text-xs text-muted-foreground">
              연간 목표 비용
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">실제 비용</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalActualExpense)}
            </div>
            <p className="text-xs text-muted-foreground">
              집행률: {((totalActualExpense / totalBudgetExpense) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 예산 대비 실적 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">예산 대비 실적</CardTitle>
            <CardDescription>
              항목별 예산 달성률을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">항목</th>
                    <th className="text-right py-3 px-4 font-semibold">예산</th>
                    <th className="text-right py-3 px-4 font-semibold">실적</th>
                    <th className="text-right py-3 px-4 font-semibold">차이</th>
                    <th className="text-center py-3 px-4 font-semibold">달성률</th>
                    <th className="text-center py-3 px-4 font-semibold">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 font-medium">{item.category}</td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(item.budget)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {formatCurrency(item.actual)}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${getVarianceColor(item.variance, item.type)}`}>
                        {formatCurrency(Math.abs(item.variance))}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="font-semibold">{item.percentage}%</span>
                          <div className={getVarianceColor(item.variance, item.type)}>
                            {getVarianceIcon(item.variance, item.type)}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.type === 'revenue' ? (
                          item.percentage >= 95 ? (
                            <Badge className="bg-green-100 text-green-800">달성</Badge>
                          ) : item.percentage >= 80 ? (
                            <Badge className="bg-yellow-100 text-yellow-800">양호</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">미달</Badge>
                          )
                        ) : (
                          item.percentage <= 95 ? (
                            <Badge className="bg-green-100 text-green-800">절약</Badge>
                          ) : item.percentage <= 105 ? (
                            <Badge className="bg-yellow-100 text-yellow-800">적정</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">초과</Badge>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 월별 예산 실적 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">월별 수익 추이</CardTitle>
            <CardDescription>
              월별 예산 대비 실적 현황
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyBudget.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.month}</span>
                  <span className={`font-semibold ${
                    item.actual >= item.budget ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {((item.actual / item.budget) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>예산: {formatCurrency(item.budget)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>실적: {formatCurrency(item.actual)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.actual >= item.budget ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((item.actual / item.budget) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 예산 항목 추가 폼 (모달) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-xl mx-4">
            <CardHeader>
              <CardTitle>새 예산 항목 추가</CardTitle>
              <CardDescription>
                새로운 예산 항목을 추가하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="categoryName">항목명</Label>
                <Input
                  id="categoryName"
                  placeholder="예산 항목명을 입력하세요"
                />
              </div>
              
              <div>
                <Label htmlFor="categoryType">분류</Label>
                <select
                  id="categoryType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">분류를 선택하세요</option>
                  <option value="revenue">수익</option>
                  <option value="expense">비용</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="budgetAmount">예산 금액</Label>
                <Input
                  id="budgetAmount"
                  type="number"
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  placeholder="예산 항목에 대한 설명 (선택사항)"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  취소
                </Button>
                <Button>
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}