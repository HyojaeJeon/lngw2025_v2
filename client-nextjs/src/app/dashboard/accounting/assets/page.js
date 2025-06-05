'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Badge } from '../../../../components/ui/badge.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Label } from '../../../../components/ui/label.js'
import { 
  Package, 
  Plus, 
  Search, 
  Download,
  Edit,
  Trash2,
  TrendingDown,
  Calendar,
  DollarSign
} from 'lucide-react'

export default function AssetManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  // 자산 데이터
  const assets = [
    {
      id: 'A2024-001',
      name: '노트북 컴퓨터',
      category: 'IT장비',
      purchaseDate: '2023-03-15',
      purchasePrice: 2500000,
      currentValue: 1875000,
      depreciationMethod: '정액법',
      usefulLife: 4,
      status: 'active'
    },
    {
      id: 'A2024-002',
      name: '사무용 책상',
      category: '사무용품',
      purchaseDate: '2023-01-10',
      purchasePrice: 800000,
      currentValue: 640000,
      depreciationMethod: '정액법',
      usefulLife: 10,
      status: 'active'
    },
    {
      id: 'A2024-003',
      name: '프린터',
      category: 'IT장비',
      purchaseDate: '2022-11-20',
      purchasePrice: 1200000,
      currentValue: 720000,
      depreciationMethod: '정액법',
      usefulLife: 5,
      status: 'active'
    },
    {
      id: 'A2024-004',
      name: '회의실 테이블',
      category: '사무용품',
      purchaseDate: '2021-05-10',
      purchasePrice: 1500000,
      currentValue: 900000,
      depreciationMethod: '정액법',
      usefulLife: 10,
      status: 'disposed'
    },
  ]

  const categories = ['전체', 'IT장비', '사무용품', '차량', '기계장치', '건물', '토지']

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">사용중</Badge>
      case 'disposed':
        return <Badge className="bg-red-100 text-red-800">폐기</Badge>
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">수리중</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateDepreciation = (asset) => {
    const today = new Date()
    const purchaseDate = new Date(asset.purchaseDate)
    const yearsElapsed = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365)
    const annualDepreciation = asset.purchasePrice / asset.usefulLife
    const totalDepreciation = Math.min(annualDepreciation * yearsElapsed, asset.purchasePrice)
    return totalDepreciation
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || categoryFilter === '전체' || asset.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0)
  const totalDepreciation = assets.reduce((sum, asset) => sum + calculateDepreciation(asset), 0)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            자산 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            고정자산을 등록하고 감가상각을 관리하세요
          </p>
        </div>
        
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          자산 등록
        </Button>
      </div>

      {/* 자산 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 자산 가액</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalAssetValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {assets.filter(a => a.status === 'active').length}개 자산
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">누적 감가상각</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDepreciation)}
            </div>
            <p className="text-xs text-muted-foreground">
              총 취득가액 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">장부가액</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAssetValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              현재 장부상 가치
            </p>
          </CardContent>
        </Card>
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
                  placeholder="자산명 또는 자산번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">카테고리</Label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category === '전체' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 자산 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>자산 목록</CardTitle>
          <CardDescription>
            총 {filteredAssets.length}개의 자산
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">자산번호</th>
                  <th className="text-left py-3 px-4 font-semibold">자산명</th>
                  <th className="text-left py-3 px-4 font-semibold">분류</th>
                  <th className="text-left py-3 px-4 font-semibold">취득일</th>
                  <th className="text-right py-3 px-4 font-semibold">취득가액</th>
                  <th className="text-right py-3 px-4 font-semibold">장부가액</th>
                  <th className="text-center py-3 px-4 font-semibold">상태</th>
                  <th className="text-center py-3 px-4 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 font-mono text-sm">{asset.id}</td>
                    <td className="py-3 px-4 font-medium">{asset.name}</td>
                    <td className="py-3 px-4">{asset.category}</td>
                    <td className="py-3 px-4">{asset.purchaseDate}</td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(asset.purchasePrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formatCurrency(asset.currentValue)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(asset.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
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

      {/* 자산 등록 폼 (모달) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>새 자산 등록</CardTitle>
              <CardDescription>
                고정자산을 등록하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assetName">자산명</Label>
                  <Input
                    id="assetName"
                    placeholder="자산명을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="assetCategory">분류</Label>
                  <select
                    id="assetCategory"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">분류를 선택하세요</option>
                    <option value="IT장비">IT장비</option>
                    <option value="사무용품">사무용품</option>
                    <option value="차량">차량</option>
                    <option value="기계장치">기계장치</option>
                    <option value="건물">건물</option>
                    <option value="토지">토지</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchaseDate">취득일</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                  />
                </div>
                <div>
                  <Label htmlFor="purchasePrice">취득가액</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usefulLife">내용연수 (년)</Label>
                  <Input
                    id="usefulLife"
                    type="number"
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="depreciationMethod">감가상각방법</Label>
                  <select
                    id="depreciationMethod"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="정액법">정액법</option>
                    <option value="정률법">정률법</option>
                    <option value="생산량비례법">생산량비례법</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  placeholder="자산에 대한 설명을 입력하세요 (선택사항)"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  취소
                </Button>
                <Button>
                  등록
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}