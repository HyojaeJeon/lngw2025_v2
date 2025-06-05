'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Badge } from '../../../../components/ui/badge.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Label } from '../../../../components/ui/label.js'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react'

export default function LedgerManagementPage() {
  const [selectedAccount, setSelectedAccount] = useState('현금')
  const [dateRange, setDateRange] = useState('month')

  // 계정과목 목록
  const accounts = [
    { code: '1010', name: '현금', type: 'asset', balance: 15000000 },
    { code: '1020', name: '예금', type: 'asset', balance: 45000000 },
    { code: '1030', name: '매출채권', type: 'asset', balance: 8500000 },
    { code: '2010', name: '매입채무', type: 'liability', balance: 3200000 },
    { code: '3010', name: '자본금', type: 'equity', balance: 50000000 },
    { code: '4010', name: '매출', type: 'revenue', balance: 25000000 },
    { code: '5010', name: '광고선전비', type: 'expense', balance: 2800000 },
    { code: '5020', name: '사무용품비', type: 'expense', balance: 1200000 },
  ]

  // 원장 거래 내역
  const ledgerEntries = [
    {
      id: 1,
      date: '2024-01-15',
      voucherId: 'V2024-001',
      description: '광고비 지불',
      debit: 0,
      credit: 1500000,
      balance: 13500000
    },
    {
      id: 2,
      date: '2024-01-14',
      voucherId: 'V2024-002',
      description: '제품 판매 수금',
      debit: 3200000,
      credit: 0,
      balance: 15000000
    },
    {
      id: 3,
      date: '2024-01-13',
      voucherId: 'V2024-003',
      description: '사무용품 구매',
      debit: 0,
      credit: 450000,
      balance: 11800000
    },
    {
      id: 4,
      date: '2024-01-12',
      voucherId: 'V2024-004',
      description: '컨설팅 수금',
      debit: 2800000,
      credit: 0,
      balance: 12250000
    },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'asset':
        return 'bg-blue-100 text-blue-800'
      case 'liability':
        return 'bg-red-100 text-red-800'
      case 'equity':
        return 'bg-purple-100 text-purple-800'
      case 'revenue':
        return 'bg-green-100 text-green-800'
      case 'expense':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccountTypeName = (type) => {
    switch (type) {
      case 'asset': return '자산'
      case 'liability': return '부채'
      case 'equity': return '자본'
      case 'revenue': return '수익'
      case 'expense': return '비용'
      default: return type
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            원장 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            계정별 원장을 조회하고 관리하세요
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            원장 내보내기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 계정과목 목록 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">계정과목</CardTitle>
            <CardDescription>
              원장을 조회할 계정을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {accounts.map((account) => (
              <div
                key={account.code}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedAccount === account.name
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setSelectedAccount(account.name)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.code}</p>
                  </div>
                  <Badge className={getAccountTypeColor(account.type)}>
                    {getAccountTypeName(account.type)}
                  </Badge>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 원장 상세 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedAccount} 원장</CardTitle>
                <CardDescription>
                  {selectedAccount} 계정의 거래 내역입니다
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={dateRange === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('week')}
                >
                  주간
                </Button>
                <Button
                  variant={dateRange === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('month')}
                >
                  월간
                </Button>
                <Button
                  variant={dateRange === 'quarter' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('quarter')}
                >
                  분기
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 계정 요약 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">기초잔액</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(9450000)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">차변 합계</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(6000000)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">대변 합계</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(1950000)}
                </p>
              </div>
            </div>

            {/* 원장 거래 내역 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">날짜</th>
                    <th className="text-left py-3 px-4 font-semibold">전표번호</th>
                    <th className="text-left py-3 px-4 font-semibold">적요</th>
                    <th className="text-right py-3 px-4 font-semibold">차변</th>
                    <th className="text-right py-3 px-4 font-semibold">대변</th>
                    <th className="text-right py-3 px-4 font-semibold">잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 기초잔액 */}
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 font-medium">2024-01-01</td>
                    <td className="py-3 px-4 text-gray-500">-</td>
                    <td className="py-3 px-4 font-medium text-gray-700">기초잔액</td>
                    <td className="py-3 px-4 text-right">-</td>
                    <td className="py-3 px-4 text-right">-</td>
                    <td className="py-3 px-4 text-right font-bold">
                      {formatCurrency(9450000)}
                    </td>
                  </tr>
                  
                  {ledgerEntries.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{entry.date}</td>
                      <td className="py-3 px-4 font-mono text-sm">{entry.voucherId}</td>
                      <td className="py-3 px-4">{entry.description}</td>
                      <td className="py-3 px-4 text-right">
                        {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {formatCurrency(entry.balance)}
                      </td>
                    </tr>
                  ))}
                  
                  {/* 합계 */}
                  <tr className="border-b-2 border-gray-300 bg-gray-100 font-bold">
                    <td className="py-3 px-4" colSpan="3">합계</td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(6000000)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(1950000)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(13500000)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}