'use client'

import { useState } from 'react'
import { useLanguage } from '../../../../contexts/languageContext.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.js'
import { Badge } from '../../../../components/ui/badge.js'
import { Button } from '../../../../components/ui/button.js'
import { Input } from '../../../../components/ui/input.js'
import { Label } from '../../../../components/ui/label.js'
import { 
  Bell, 
  Plus, 
  Search, 
  Calendar,
  Users,
  Pin,
  FileText,
  Edit,
  Eye,
  MessageCircle,
  AlertTriangle
} from 'lucide-react'

export default function InternalCommunicationPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showNoticeForm, setShowNoticeForm] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)

  // 공지사항 데이터
  const notices = [
    {
      id: 'NOT-2024-001',
      title: '2024년 베트남 노동법 개정사항 안내',
      category: 'policy',
      priority: 'high',
      content: '베트남 정부에서 발표한 2024년 노동법 개정사항에 대해 안내드립니다. 주요 변경사항은 최저임금 인상, 초과근무 규정 강화, 출산휴가 확대 등입니다.',
      author: '인사팀',
      authorName: '김인사',
      publishDate: '2024-02-15',
      viewCount: 45,
      isPinned: true,
      departments: ['전체'],
      status: 'published',
      attachments: ['노동법_개정안_2024.pdf']
    },
    {
      id: 'NOT-2024-002',
      title: '설날 연휴 근무 일정 안내',
      category: 'schedule',
      priority: 'medium',
      content: '2024년 설날 연휴(2월 9일~12일) 기간 중 근무 일정과 비상연락처를 안내합니다. 응급상황 시 연락 가능한 담당자 정보도 포함되어 있습니다.',
      author: '총무팀',
      authorName: '이총무',
      publishDate: '2024-02-01',
      viewCount: 78,
      isPinned: false,
      departments: ['전체'],
      status: 'published',
      attachments: []
    },
    {
      id: 'NOT-2024-003',
      title: '개발팀 새로운 코딩 컨벤션 적용',
      category: 'technical',
      priority: 'medium',
      content: '코드 품질 향상을 위한 새로운 코딩 컨벤션이 3월 1일부터 적용됩니다. ESLint 설정과 Prettier 규칙이 업데이트되었으니 확인 바랍니다.',
      author: '개발팀',
      authorName: '박개발',
      publishDate: '2024-02-10',
      viewCount: 23,
      isPinned: false,
      departments: ['개발팀'],
      status: 'published',
      attachments: ['coding_convention_v2.0.md']
    },
    {
      id: 'NOT-2024-004',
      title: '직원 건강검진 일정 안내',
      category: 'health',
      priority: 'medium',
      content: '연례 직원 건강검진이 3월 중 실시됩니다. 부서별 일정과 검진 항목, 준비사항에 대해 안내드립니다. 사전 예약이 필요하니 참고 바랍니다.',
      author: '인사팀',
      authorName: '최인사',
      publishDate: '2024-02-12',
      viewCount: 56,
      isPinned: false,
      departments: ['전체'],
      status: 'published',
      attachments: ['건강검진_안내.pdf']
    },
    {
      id: 'NOT-2024-005',
      title: '베트남 현지 문화 적응 교육 프로그램',
      category: 'training',
      priority: 'low',
      content: '한국에서 파견된 직원들을 위한 베트남 현지 문화 적응 교육이 매월 셋째 주 금요일에 진행됩니다. 언어, 문화, 비즈니스 에티켓 등을 다룹니다.',
      author: '교육팀',
      authorName: 'Nguyen 매니저',
      publishDate: '2024-02-08',
      viewCount: 31,
      isPinned: false,
      departments: ['전체'],
      status: 'published',
      attachments: []
    }
  ]

  const categories = {
    all: '전체',
    policy: '정책/규정',
    schedule: '일정',
    technical: '기술',
    health: '건강/안전',
    training: '교육/연수',
    event: '행사',
    urgent: '긴급'
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">중요</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">보통</Badge>
      case 'low':
        return <Badge className="bg-green-100 text-green-800">일반</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getCategoryBadge = (category) => {
    const colors = {
      'policy': 'bg-purple-100 text-purple-800',
      'schedule': 'bg-blue-100 text-blue-800',
      'technical': 'bg-indigo-100 text-indigo-800',
      'health': 'bg-green-100 text-green-800',
      'training': 'bg-orange-100 text-orange-800',
      'event': 'bg-pink-100 text-pink-800',
      'urgent': 'bg-red-100 text-red-800'
    }
    return <Badge className={colors[category] || 'bg-gray-100 text-gray-800'}>{categories[category]}</Badge>
  }

  const calculateStats = () => {
    const total = notices.length
    const pinned = notices.filter(n => n.isPinned).length
    const thisMonth = notices.filter(n => n.publishDate.startsWith('2024-02')).length
    const totalViews = notices.reduce((sum, n) => sum + n.viewCount, 0)

    return { total, pinned, thisMonth, totalViews }
  }

  const stats = calculateStats()

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || notice.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return b.isPinned - a.isPinned
    }
    return new Date(b.publishDate) - new Date(a.publishDate)
  })

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('employees.communication')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            사내 공지사항 및 커뮤니케이션 관리
          </p>
        </div>
        
        <Button onClick={() => setShowNoticeForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          공지사항 작성
        </Button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 공지</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}개</div>
            <p className="text-xs text-muted-foreground">
              게시된 공지사항
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">고정 공지</CardTitle>
            <Pin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pinned}개</div>
            <p className="text-xs text-muted-foreground">
              상단 고정
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.thisMonth}개</div>
            <p className="text-xs text-muted-foreground">
              2월 게시글
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 조회수</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              누적 조회수
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
                  placeholder="제목 또는 내용으로 검색..."
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
                {Object.entries(categories).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 공지사항 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>공지사항</CardTitle>
          <CardDescription>
            총 {sortedNotices.length}개의 공지사항
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedNotices.map((notice) => (
              <div key={notice.id} className={`border rounded-lg p-6 ${notice.isPinned ? 'bg-yellow-50 border-yellow-200' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {notice.isPinned && <Pin className="h-4 w-4 text-red-500" />}
                      <h3 className="text-lg font-semibold">{notice.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      {getCategoryBadge(notice.category)}
                      {getPriorityBadge(notice.priority)}
                      <Badge variant="outline">{notice.departments.join(', ')}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{notice.publishDate}</p>
                    <p>작성자: {notice.authorName}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{notice.content}</p>

                {notice.attachments.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">첨부파일:</p>
                    <div className="flex space-x-2">
                      {notice.attachments.map((file, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100">
                          <FileText className="h-3 w-3 mr-1" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{notice.viewCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>0</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedNotice(notice)}>
                      <Eye className="h-4 w-4 mr-1" />
                      상세보기
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      수정
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 공지사항 작성 폼 (모달) */}
      {showNoticeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>새 공지사항 작성</CardTitle>
              <CardDescription>
                사내 구성원들에게 전달할 공지사항을 작성하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input id="title" placeholder="공지사항 제목을 입력하세요" />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">카테고리를 선택하세요</option>
                    {Object.entries(categories).filter(([key]) => key !== 'all').map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priority">우선순위</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="low">일반</option>
                    <option value="medium">보통</option>
                    <option value="high">중요</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="department">대상 부서</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="전체">전체</option>
                    <option value="개발팀">개발팀</option>
                    <option value="마케팅팀">마케팅팀</option>
                    <option value="인사팀">인사팀</option>
                    <option value="재무팀">재무팀</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="publishDate">게시일</Label>
                  <Input id="publishDate" type="date" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isPinned" />
                <Label htmlFor="isPinned">상단에 고정</Label>
              </div>

              {/* 내용 */}
              <div>
                <Label htmlFor="content">내용</Label>
                <textarea
                  id="content"
                  placeholder="공지사항 내용을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={10}
                />
              </div>

              {/* 첨부파일 */}
              <div>
                <Label htmlFor="attachments">첨부파일</Label>
                <Input id="attachments" type="file" multiple />
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, XLS, PPT 파일을 첨부할 수 있습니다 (최대 10MB)</p>
              </div>

              {/* 베트남 현지 공지 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-blue-800 mb-2">베트남 현지 공지 가이드</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 베트남어 번역본 제공 권장</li>
                  <li>• 현지 법규 관련 내용은 법무팀 검토 필수</li>
                  <li>• 문화적 차이를 고려한 표현 사용</li>
                  <li>• 중요 공지는 이메일과 게시판 동시 발송</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowNoticeForm(false)}>
                  취소
                </Button>
                <Button variant="outline">
                  임시저장
                </Button>
                <Button>
                  게시하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 공지사항 상세보기 (모달) */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedNotice.isPinned && <Pin className="h-4 w-4 text-red-500" />}
                    <CardTitle>{selectedNotice.title}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getCategoryBadge(selectedNotice.category)}
                    {getPriorityBadge(selectedNotice.priority)}
                    <Badge variant="outline">{selectedNotice.departments.join(', ')}</Badge>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedNotice(null)}>
                  닫기
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-500 border-b pb-4">
                <p>작성자: {selectedNotice.authorName} ({selectedNotice.author})</p>
                <p>게시일: {selectedNotice.publishDate}</p>
                <p>조회수: {selectedNotice.viewCount}</p>
              </div>

              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{selectedNotice.content}</p>
              </div>

              {selectedNotice.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">첨부파일</h4>
                  <div className="space-y-2">
                    {selectedNotice.attachments.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="flex-1">{file}</span>
                        <Button variant="outline" size="sm">다운로드</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}