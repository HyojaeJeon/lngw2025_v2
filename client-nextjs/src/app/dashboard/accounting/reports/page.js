'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Label } from '../../../../components/ui/label.js'
import { 
  FileBarChart, 
  Download,
  Calendar,
  Filter,
  Eye,
  TrendingUp,
  PieChart,
  BarChart3,
  FileText
} from 'lucide-react'

export default function AccountingReportsPage() {
  const [selectedReport, setSelectedReport] = useState('trial-balance')
  const [dateFrom, setDateFrom] = useState('2024-01-01')
  const [dateTo, setDateTo] = useState('2024-01-31')

  // 보고서 유형
  const reportTypes = [
    {
      id: 'trial-balance',
      name: '시산표',
      description: '계정별 차대 잔액을 확인하는 보고서',
      icon: BarChart3
    },
    {
      id: 'income-statement',
      name: '손익계산서',
      description: '수익과 비용을 분석하는 보고서',
      icon: TrendingUp
    },
    {
      id: 'balance-sheet',
      name: '재무상태표',
      description: '자산, 부채, 자본 현황 보고서',
      icon: PieChart
    },
    {
      id: 'cash-flow',
      name: '현금흐름표',
      description: '현금의 유입과 유출을 분석하는 보고서',
      icon: FileBarChart
    },
    {
      id: 'ledger-summary',
      name: '원장 요약',
      description: '계정별 원장 거래 내역 요약',
      icon: FileText
    }
  ]

  // 시산표 데이터
  const trialBalanceData = [
    { account: '현금', code: '1010', debit: 15000000, credit: 0 },
    { account: '예금', code: '1020', debit: 45000000, credit: 0 },
    { account: '매출채권', code: '1030', debit: 8500000, credit: 0 },
    { account: '재고자산', code: '1040', debit: 12000000, credit: 0 },
    { account: '설비', code: '1510', debit: 25000000, credit: 0 },
    { account: '건물', code: '1520', debit: 120000000, credit: 0 },
    { account: '토지', code: '1530', debit: 80000000, credit: 0 },
    { account: '매입채무', code: '2010', debit: 0, credit: 3200000 },
    { account: '단기차입금', code: '2020', debit: 0, credit: 8000000 },
    { account: '장기차입금', code: '2510', debit: 0, credit: 45000000 },
    { account: '사채', code: '2520', debit: 0, credit: 30000000 },
    { account: '자본금', code: '3010', debit: 0, credit: 200000000 },
    { account: '이익잉여금', code: '3020', debit: 0, credit: 16800000 },
    { account: '매출', code: '4010', debit: 0, credit: 125000000 },
    { account: '용역수익', code: '4020', debit: 0, credit: 38000000 },
    { account: '매출원가', code: '5010', debit: 85000000, credit: 0 },
    { account: '급여', code: '5020', debit: 35000000, credit: 0 },
    { account: '임차료', code: '5030', debit: 12000000, credit: 0 },
    { account: '광고선전비', code: '5040', debit: 8500000, credit: 0 },
    { account: '감가상각비', code: '5050', debit: 5000000, credit: 0 }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const totalDebit = trialBalanceData.reduce((sum, item) => sum + item.debit, 0)
  const totalCredit = trialBalanceData.reduce((sum, item) => sum + item.credit, 0)

  const generateReport = () => {
    // 실제로는 서버에서 데이터를 가져와야 함
    console.log(`Generating ${selectedReport} from ${dateFrom} to ${dateTo}`)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            회계 보고서
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            다양한 회계 보고서를 생성하고 조회하세요
          </p>
        </div>
      </div>

      {/* 보고서 생성 옵션 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">보고서 생성</CardTitle>
          <CardDescription>
            생성하고 싶은 보고서와 기간을 선택하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="reportType">보고서 유형</Label>
              <select
                id="reportType"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reportTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="dateFrom">시작일</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="dateTo">종료일</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <Button onClick={generateReport} className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                보고서 생성
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 보고서 유형 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((type) => (
          <Card 
            key={type.id} 
            className={`cursor-pointer transition-colors ${
              selectedReport === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedReport(type.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  selectedReport === type.id ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <type.icon className={`h-6 w-6 ${
                    selectedReport === type.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{type.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 시산표 미리보기 */}
      {selectedReport === 'trial-balance' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">시산표 미리보기</CardTitle>
            <CardDescription>
              {dateFrom} ~ {dateTo} 시산표
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">계정코드</th>
                    <th className="text-left py-3 px-4 font-semibold">계정명</th>
                    <th className="text-right py-3 px-4 font-semibold">차변</th>
                    <th className="text-right py-3 px-4 font-semibold">대변</th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalanceData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-mono text-sm">{item.code}</td>
                      <td className="py-2 px-4">{item.account}</td>
                      <td className="py-2 px-4 text-right">
                        {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                      </td>
                    </tr>
                  ))}
                  
                  {/* 합계 */}
                  <tr className="border-t-2 border-gray-300 bg-gray-100 font-bold">
                    <td className="py-3 px-4" colSpan="2">합계</td>
                    <td className="py-3 px-4 text-right text-blue-600">
                      {formatCurrency(totalDebit)}
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      {formatCurrency(totalCredit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">차대 균형 검증:</span>
                <span className={`font-bold ${
                  totalDebit === totalCredit ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalDebit === totalCredit ? '균형' : '불균형'}
                </span>
              </div>
              {totalDebit !== totalCredit && (
                <p className="text-sm text-red-600 mt-2">
                  차이: {formatCurrency(Math.abs(totalDebit - totalCredit))}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 다른 보고서 타입들의 간단한 미리보기 */}
      {selectedReport === 'income-statement' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">손익계산서 미리보기</CardTitle>
            <CardDescription>
              {dateFrom} ~ {dateTo} 손익계산서
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">손익계산서가 준비 중입니다.</p>
              <p className="text-sm text-gray-400 mt-2">
                수익과 비용 내역을 포함한 상세한 손익계산서를 제공합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedReport === 'balance-sheet' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">재무상태표 미리보기</CardTitle>
            <CardDescription>
              {dateTo} 기준 재무상태표
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">재무상태표가 준비 중입니다.</p>
              <p className="text-sm text-gray-400 mt-2">
                자산, 부채, 자본의 구성을 상세히 보여주는 재무상태표를 제공합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedReport === 'cash-flow' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">현금흐름표 미리보기</CardTitle>
            <CardDescription>
              {dateFrom} ~ {dateTo} 현금흐름표
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileBarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">현금흐름표가 준비 중입니다.</p>
              <p className="text-sm text-gray-400 mt-2">
                영업, 투자, 재무활동의 현금흐름을 분석하는 보고서를 제공합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedReport === 'ledger-summary' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">원장 요약 미리보기</CardTitle>
            <CardDescription>
              {dateFrom} ~ {dateTo} 원장 요약
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">원장 요약이 준비 중입니다.</p>
              <p className="text-sm text-gray-400 mt-2">
                계정별 거래 내역과 잔액을 요약한 보고서를 제공합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}