'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Button } from '../../../../components/ui/button.js'
import { 
  FileBarChart, 
  Download,
  PieChart,
  TrendingUp,
  Building,
  DollarSign
} from 'lucide-react'

export default function FinancialStatementsPage() {
  const [selectedStatement, setSelectedStatement] = useState('balance')
  const [period, setPeriod] = useState('2024-01')

  // 재무제표 데이터
  const balanceSheetData = {
    assets: {
      current: {
        cash: 15000000,
        bankDeposits: 45000000,
        accountsReceivable: 8500000,
        inventory: 12000000,
        total: 80500000
      },
      fixed: {
        equipment: 25000000,
        buildings: 120000000,
        land: 80000000,
        total: 225000000
      },
      total: 305500000
    },
    liabilities: {
      current: {
        accountsPayable: 3200000,
        shortTermLoans: 8000000,
        accruedExpenses: 2500000,
        total: 13700000
      },
      longTerm: {
        longTermLoans: 45000000,
        bonds: 30000000,
        total: 75000000
      },
      total: 88700000
    },
    equity: {
      capital: 200000000,
      retainedEarnings: 16800000,
      total: 216800000
    }
  }

  const incomeStatementData = {
    revenue: {
      sales: 125000000,
      services: 38000000,
      total: 163000000
    },
    expenses: {
      cogs: 85000000,
      salaries: 35000000,
      rent: 12000000,
      utilities: 3500000,
      advertising: 8500000,
      depreciation: 5000000,
      total: 149000000
    },
    netIncome: 14000000
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const statements = [
    { id: 'balance', name: '재무상태표', icon: Building },
    { id: 'income', name: '손익계산서', icon: TrendingUp },
    { id: 'cash', name: '현금흐름표', icon: DollarSign },
    { id: 'equity', name: '자본변동표', icon: PieChart },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            재무제표
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            기업의 재무상태와 경영성과를 확인하세요
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024-01">2024년 1월</option>
            <option value="2023-12">2023년 12월</option>
            <option value="2023-11">2023년 11월</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>

      {/* 재무제표 탭 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            {statements.map((statement) => (
              <Button
                key={statement.id}
                variant={selectedStatement === statement.id ? 'default' : 'outline'}
                onClick={() => setSelectedStatement(statement.id)}
                className="flex items-center space-x-2"
              >
                <statement.icon className="h-4 w-4" />
                <span>{statement.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 재무상태표 */}
      {selectedStatement === 'balance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 자산 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-600">자산</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">유동자산</h4>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between">
                    <span>현금</span>
                    <span>{formatCurrency(balanceSheetData.assets.current.cash)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>예금</span>
                    <span>{formatCurrency(balanceSheetData.assets.current.bankDeposits)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>매출채권</span>
                    <span>{formatCurrency(balanceSheetData.assets.current.accountsReceivable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>재고자산</span>
                    <span>{formatCurrency(balanceSheetData.assets.current.inventory)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>유동자산 계</span>
                    <span>{formatCurrency(balanceSheetData.assets.current.total)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">비유동자산</h4>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between">
                    <span>설비</span>
                    <span>{formatCurrency(balanceSheetData.assets.fixed.equipment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>건물</span>
                    <span>{formatCurrency(balanceSheetData.assets.fixed.buildings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>토지</span>
                    <span>{formatCurrency(balanceSheetData.assets.fixed.land)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>비유동자산 계</span>
                    <span>{formatCurrency(balanceSheetData.assets.fixed.total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg border-t-2 pt-4">
                <span>자산 총계</span>
                <span className="text-blue-600">{formatCurrency(balanceSheetData.assets.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* 부채 및 자본 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600">부채 및 자본</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">유동부채</h4>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between">
                    <span>매입채무</span>
                    <span>{formatCurrency(balanceSheetData.liabilities.current.accountsPayable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>단기차입금</span>
                    <span>{formatCurrency(balanceSheetData.liabilities.current.shortTermLoans)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>미지급비용</span>
                    <span>{formatCurrency(balanceSheetData.liabilities.current.accruedExpenses)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>유동부채 계</span>
                    <span>{formatCurrency(balanceSheetData.liabilities.current.total)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">비유동부채</h4>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between">
                    <span>장기차입금</span>
                    <span>{formatCurrency(balanceSheetData.liabilities.longTerm.longTermLoans)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>사채</span>
                    <span>{formatCurrency(balanceSheetData.liabilities.longTerm.bonds)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>비유동부채 계</span>
                    <span>{formatCurrency(balanceSheetData.liabilities.longTerm.total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>부채 총계</span>
                <span className="text-red-600">{formatCurrency(balanceSheetData.liabilities.total)}</span>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">자본</h4>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between">
                    <span>자본금</span>
                    <span>{formatCurrency(balanceSheetData.equity.capital)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>이익잉여금</span>
                    <span>{formatCurrency(balanceSheetData.equity.retainedEarnings)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>자본 총계</span>
                    <span className="text-green-600">{formatCurrency(balanceSheetData.equity.total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg border-t-2 pt-4">
                <span>부채 및 자본 총계</span>
                <span>{formatCurrency(balanceSheetData.liabilities.total + balanceSheetData.equity.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 손익계산서 */}
      {selectedStatement === 'income' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">손익계산서</CardTitle>
            <CardDescription>
              {period} 손익계산서
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 text-green-600">수익</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>매출</span>
                    <span>{formatCurrency(incomeStatementData.revenue.sales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>용역수익</span>
                    <span>{formatCurrency(incomeStatementData.revenue.services)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t-2 pt-3 text-green-600">
                    <span>수익 총계</span>
                    <span>{formatCurrency(incomeStatementData.revenue.total)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-red-600">비용</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>매출원가</span>
                    <span>{formatCurrency(incomeStatementData.expenses.cogs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>급여</span>
                    <span>{formatCurrency(incomeStatementData.expenses.salaries)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>임차료</span>
                    <span>{formatCurrency(incomeStatementData.expenses.rent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>공과금</span>
                    <span>{formatCurrency(incomeStatementData.expenses.utilities)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>광고선전비</span>
                    <span>{formatCurrency(incomeStatementData.expenses.advertising)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>감가상각비</span>
                    <span>{formatCurrency(incomeStatementData.expenses.depreciation)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t-2 pt-3 text-red-600">
                    <span>비용 총계</span>
                    <span>{formatCurrency(incomeStatementData.expenses.total)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t-4 border-gray-300 pt-6">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>당기순이익</span>
                <span className={`${
                  incomeStatementData.netIncome > 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {formatCurrency(incomeStatementData.netIncome)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                순이익률: {((incomeStatementData.netIncome / incomeStatementData.revenue.total) * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 현금흐름표 및 자본변동표는 간단한 placeholder */}
      {selectedStatement === 'cash' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">현금흐름표</CardTitle>
            <CardDescription>
              {period} 현금흐름표
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">현금흐름표 기능이 준비 중입니다.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedStatement === 'equity' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">자본변동표</CardTitle>
            <CardDescription>
              {period} 자본변동표
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">자본변동표 기능이 준비 중입니다.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}