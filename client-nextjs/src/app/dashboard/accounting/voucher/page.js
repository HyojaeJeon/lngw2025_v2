'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Badge } from '../../../../components/ui/badge.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Label } from '../../../../components/ui/label.js'
import { 
  Plus, 
  FileText, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function VoucherManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // 전표 데이터
  const vouchers = [
    {
      id: 'V2024-001',
      date: '2024-01-15',
      description: '광고비 지출',
      debitAccount: '광고선전비',
      creditAccount: '현금',
      amount: 1500000,
      status: 'approved',
      creator: '김회계',
      approver: '이부장'
    },
    {
      id: 'V2024-002',
      date: '2024-01-14',
      description: '제품 판매 수익',
      debitAccount: '현금',
      creditAccount: '매출',
      amount: 3200000,
      status: 'pending',
      creator: '박영업',
      approver: null
    },
    {
      id: 'V2024-003',
      date: '2024-01-13',
      description: '사무용품 구매',
      debitAccount: '사무용품비',
      creditAccount: '현금',
      amount: 450000,
      status: 'draft',
      creator: '김회계',
      approver: null
    },
    {
      id: 'V2024-004',
      date: '2024-01-12',
      description: '컨설팅 수익',
      debitAccount: '현금',
      creditAccount: '용역수익',
      amount: 2800000,
      status: 'approved',
      creator: '정영업',
      approver: '이부장'
    },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">승인완료</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">승인대기</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">임시저장</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            전표 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            회계 전표를 작성하고 관리하세요
          </p>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          새 전표 작성
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="전표번호 또는 적요로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">상태 필터</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="draft">임시저장</option>
                <option value="pending">승인대기</option>
                <option value="approved">승인완료</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 전표 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>전표 목록</CardTitle>
          <CardDescription>
            총 {filteredVouchers.length}개의 전표
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">전표번호</th>
                  <th className="text-left py-3 px-4 font-semibold">날짜</th>
                  <th className="text-left py-3 px-4 font-semibold">적요</th>
                  <th className="text-left py-3 px-4 font-semibold">차대계정</th>
                  <th className="text-left py-3 px-4 font-semibold">대변계정</th>
                  <th className="text-right py-3 px-4 font-semibold">금액</th>
                  <th className="text-center py-3 px-4 font-semibold">상태</th>
                  <th className="text-center py-3 px-4 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredVouchers.map((voucher) => (
                  <tr key={voucher.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-mono text-sm">{voucher.id}</td>
                    <td className="py-3 px-4">{voucher.date}</td>
                    <td className="py-3 px-4">{voucher.description}</td>
                    <td className="py-3 px-4">{voucher.debitAccount}</td>
                    <td className="py-3 px-4">{voucher.creditAccount}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formatCurrency(voucher.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(voucher.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 전표 작성 폼 (모달) */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>새 전표 작성</CardTitle>
              <CardDescription>
                회계 전표를 작성하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voucherDate">날짜</Label>
                  <Input
                    id="voucherDate"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="voucherNumber">전표번호</Label>
                  <Input
                    id="voucherNumber"
                    placeholder="자동 생성"
                    disabled
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">적요</Label>
                <Input
                  id="description"
                  placeholder="거래 내용을 입력하세요"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="debitAccount">차변 계정</Label>
                  <select
                    id="debitAccount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">계정을 선택하세요</option>
                    <option value="현금">현금</option>
                    <option value="예금">예금</option>
                    <option value="매출채권">매출채권</option>
                    <option value="사무용품비">사무용품비</option>
                    <option value="광고선전비">광고선전비</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="creditAccount">대변 계정</Label>
                  <select
                    id="creditAccount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">계정을 선택하세요</option>
                    <option value="현금">현금</option>
                    <option value="예금">예금</option>
                    <option value="매출">매출</option>
                    <option value="용역수익">용역수익</option>
                    <option value="매입채무">매입채무</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="amount">금액</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  취소
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  임시저장
                </Button>
                <Button>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  저장 및 승인요청
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}