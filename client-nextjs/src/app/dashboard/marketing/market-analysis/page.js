
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/hooks/useLanguage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from 'react-textarea-autosize'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X,
  TrendingUp,
  Users,
  Target,
  BarChart3
} from 'lucide-react'

export default function MarketAnalysisPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [showDetail, setShowDetail] = useState(false)

  // 샘플 시장 분석 데이터
  const [marketAnalysisData, setMarketAnalysisData] = useState([
    {
      id: 1,
      title: "2025년 K-뷰티 시장 동향 분석",
      description: "한국 화장품 시장의 글로벌 확장 전략 및 주요 트렌드 분석",
      status: "완료",
      priority: "높음",
      marketSize: "15.2조원",
      growthRate: "+12.5%",
      targetSegment: "MZ세대 여성",
      competitorCount: 45,
      analysisDate: "2025-01-08",
      keyInsights: [
        "친환경 제품 수요 급증",
        "온라인 D2C 채널 확대",
        "개인 맞춤형 제품 선호도 증가"
      ],
      threats: [
        "중국 브랜드의 가격 경쟁력",
        "원재료 가격 상승",
        "규제 강화 움직임"
      ],
      opportunities: [
        "동남아시아 시장 진출",
        "남성 화장품 시장 확대",
        "K-컬처 콘텐츠와의 시너지"
      ]
    },
    {
      id: 2,
      title: "베트남 소비재 시장 진출 전략",
      description: "베트남 현지 소비 패턴 분석 및 진출 전략 수립",
      status: "진행중",
      priority: "중간",
      marketSize: "8.7조원",
      growthRate: "+18.3%",
      targetSegment: "20-40대 도시 거주자",
      competitorCount: 28,
      analysisDate: "2025-01-05",
      keyInsights: [
        "모바일 커머스 급성장",
        "브랜드 인지도 중요성 증가",
        "현지화 전략 필수"
      ],
      threats: [
        "복잡한 규제 환경",
        "현지 브랜드 강세",
        "물류 인프라 한계"
      ],
      opportunities: [
        "젊은 인구 구조",
        "가처분 소득 증가",
        "한류 문화 영향력"
      ]
    },
    {
      id: 3,
      title: "친환경 패키징 시장 조사",
      description: "지속가능한 포장재 시장의 성장 가능성 및 기술 동향 분석",
      status: "검토중",
      priority: "낮음",
      marketSize: "2.1조원",
      growthRate: "+25.7%",
      targetSegment: "환경 의식 소비자",
      competitorCount: 12,
      analysisDate: "2025-01-03",
      keyInsights: [
        "생분해성 소재 기술 발전",
        "대기업 ESG 경영 확산",
        "정부 정책 지원 확대"
      ],
      threats: [
        "높은 생산 비용",
        "기술적 한계",
        "소비자 인식 부족"
      ],
      opportunities: [
        "규제 강화로 인한 수요 증가",
        "기업 브랜드 이미지 향상",
        "새로운 기술 개발 기회"
      ]
    }
  ])

  const handleView = (item) => {
    setSelectedItem(item)
    setShowDetail(true)
    setIsEditing(false)
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setEditData({ ...item })
    setIsEditing(true)
    setShowDetail(true)
  }

  const handleDelete = (id) => {
    if (confirm('정말로 이 분석을 삭제하시겠습니까?')) {
      setMarketAnalysisData(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleSave = () => {
    setMarketAnalysisData(prev => 
      prev.map(item => 
        item.id === editData.id ? { ...editData } : item
      )
    )
    setIsEditing(false)
    setShowDetail(false)
    setSelectedItem(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setShowDetail(false)
    setSelectedItem(null)
    setEditData({})
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayInputChange = (field, index, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setEditData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field, index) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case '완료': return 'bg-green-100 text-green-800'
      case '진행중': return 'bg-blue-100 text-blue-800'
      case '검토중': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case '높음': return 'bg-red-100 text-red-800'
      case '중간': return 'bg-orange-100 text-orange-800'
      case '낮음': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (showDetail && selectedItem) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {isEditing ? '시장 분석 수정' : '시장 분석 상세보기'}
          </h1>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => handleEdit(selectedItem)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  닫기
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>제목</Label>
                {isEditing ? (
                  <Input
                    value={editData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                ) : (
                  <p className="mt-1">{selectedItem.title}</p>
                )}
              </div>
              
              <div>
                <Label>설명</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{selectedItem.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>상태</Label>
                  {isEditing ? (
                    <select
                      value={editData.status || ''}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      <option value="완료">완료</option>
                      <option value="진행중">진행중</option>
                      <option value="검토중">검토중</option>
                    </select>
                  ) : (
                    <Badge className={`mt-1 ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status}
                    </Badge>
                  )}
                </div>
                
                <div>
                  <Label>우선순위</Label>
                  {isEditing ? (
                    <select
                      value={editData.priority || ''}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      <option value="높음">높음</option>
                      <option value="중간">중간</option>
                      <option value="낮음">낮음</option>
                    </select>
                  ) : (
                    <Badge className={`mt-1 ${getPriorityColor(selectedItem.priority)}`}>
                      {selectedItem.priority}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 시장 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>시장 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>시장 규모</Label>
                  {isEditing ? (
                    <Input
                      value={editData.marketSize || ''}
                      onChange={(e) => handleInputChange('marketSize', e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 font-semibold text-lg">{selectedItem.marketSize}</p>
                  )}
                </div>
                
                <div>
                  <Label>성장률</Label>
                  {isEditing ? (
                    <Input
                      value={editData.growthRate || ''}
                      onChange={(e) => handleInputChange('growthRate', e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 font-semibold text-lg text-green-600">{selectedItem.growthRate}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>목표 세그먼트</Label>
                {isEditing ? (
                  <Input
                    value={editData.targetSegment || ''}
                    onChange={(e) => handleInputChange('targetSegment', e.target.value)}
                  />
                ) : (
                  <p className="mt-1">{selectedItem.targetSegment}</p>
                )}
              </div>

              <div>
                <Label>경쟁사 수</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.competitorCount || ''}
                    onChange={(e) => handleInputChange('competitorCount', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="mt-1">{selectedItem.competitorCount}개</p>
                )}
              </div>

              <div>
                <Label>분석 일자</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.analysisDate || ''}
                    onChange={(e) => handleInputChange('analysisDate', e.target.value)}
                  />
                ) : (
                  <p className="mt-1">{selectedItem.analysisDate}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 핵심 인사이트 */}
          <Card>
            <CardHeader>
              <CardTitle>핵심 인사이트</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  {editData.keyInsights?.map((insight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={insight}
                        onChange={(e) => handleArrayInputChange('keyInsights', index, e.target.value)}
                      />
                      <Button
                        onClick={() => removeArrayItem('keyInsights', index)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addArrayItem('keyInsights')}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    인사이트 추가
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {selectedItem.keyInsights?.map((insight, index) => (
                    <li key={index} className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                      {insight}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* 위협 요소 */}
          <Card>
            <CardHeader>
              <CardTitle>위협 요소</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  {editData.threats?.map((threat, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={threat}
                        onChange={(e) => handleArrayInputChange('threats', index, e.target.value)}
                      />
                      <Button
                        onClick={() => removeArrayItem('threats', index)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addArrayItem('threats')}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    위협 추가
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {selectedItem.threats?.map((threat, index) => (
                    <li key={index} className="flex items-center">
                      <Target className="w-4 h-4 mr-2 text-red-500" />
                      {threat}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* 기회 요소 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>기회 요소</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  {editData.opportunities?.map((opportunity, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={opportunity}
                        onChange={(e) => handleArrayInputChange('opportunities', index, e.target.value)}
                      />
                      <Button
                        onClick={() => removeArrayItem('opportunities', index)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addArrayItem('opportunities')}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    기회 추가
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedItem.opportunities?.map((opportunity, index) => (
                    <div key={index} className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-green-500" />
                      {opportunity}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('marketing.marketAnalysis')}</h1>
          <p className="text-gray-600 mt-1">시장 동향 및 경쟁 환경을 분석하고 전략을 수립하세요</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          새 분석 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketAnalysisData.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {item.description}
                  </CardDescription>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleView(item)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">시장 규모</span>
                    <p className="font-semibold">{item.marketSize}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">성장률</span>
                    <p className="font-semibold text-green-600">{item.growthRate}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-500">목표 세그먼트</span>
                  <p>{item.targetSegment}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>경쟁사: {item.competitorCount}개</span>
                  <span>{item.analysisDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
