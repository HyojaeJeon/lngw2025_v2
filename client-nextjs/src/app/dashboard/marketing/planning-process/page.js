"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useLanguage } from "@/contexts/languageContext.js";
import {
  Target,
  Users,
  Calendar,
  Plus,
  Edit,
  Eye,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Filter,
  Search,
  BarChart3,
  Star,
  User,
  Globe,
  Zap,
  DollarSign,
  Workflow,
  MoreVertical,
  Flag
} from "lucide-react";

export default function OKRDashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("mine");
  const [selectedPeriod, setSelectedPeriod] = useState("2025-Q1");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // OKR 데이터
  const [objectives, setObjectives] = useState([
    {
      id: 1,
      title: "Z세대 인지도 확보",
      owner: "김마케팅",
      ownerTeam: "마케팅팀",
      period: "2025.01 - 2025.03",
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      progress: 72,
      confidence: "on-track",
      category: "brand",
      priority: "high",
      keyResults: [
        { id: 1, title: "틱톡 팔로워 5만 달성", current: 52000, target: 50000, unit: "명", status: "completed" },
        { id: 2, title: "브랜드 인지도 20% 증가", current: 15, target: 20, unit: "%", status: "in-progress" },
        { id: 3, title: "UGC 콘텐츠 100건 수집", current: 45, target: 100, unit: "건", status: "at-risk" }
      ],
      description: "Z세대를 타겟으로 한 브랜드 인지도 향상 및 팬베이스 구축",
      scope: "company"
    },
    {
      id: 2,
      title: "온라인 매출 증대",
      owner: "박기획",
      ownerTeam: "영업팀",
      period: "2025.01 - 2025.03",
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      progress: 58,
      confidence: "at-risk",
      category: "revenue",
      priority: "high",
      keyResults: [
        { id: 1, title: "온라인 매출 30% 증가", current: 18, target: 30, unit: "%", status: "in-progress" },
        { id: 2, title: "전환율 3.5% 달성", current: 2.8, target: 3.5, unit: "%", status: "in-progress" },
        { id: 3, title: "고객 생애가치 25% 향상", current: 8, target: 25, unit: "%", status: "behind" }
      ],
      description: "디지털 채널을 통한 매출 성장 및 고객 가치 극대화",
      scope: "team"
    },
    {
      id: 3,
      title: "글로벌 시장 진출",
      owner: "최전략",
      ownerTeam: "전략기획팀",
      period: "2025.01 - 2025.12",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      progress: 25,
      confidence: "off-track",
      category: "expansion",
      priority: "medium",
      keyResults: [
        { id: 1, title: "해외 파트너 3개사 확보", current: 1, target: 3, unit: "개사", status: "in-progress" },
        { id: 2, title: "해외 매출 비중 15% 달성", current: 3, target: 15, unit: "%", status: "behind" },
        { id: 3, title: "현지화 프로젝트 완료", current: 0, target: 1, unit: "개", status: "not-started" }
      ],
      description: "동남아시아 시장을 중심으로 한 글로벌 진출 전략 실행",
      scope: "company"
    },
    {
      id: 4,
      title: "신제품 런칭",
      owner: "이제품",
      ownerTeam: "제품개발팀",
      period: "2025.04 - 2025.06",
      startDate: "2025-04-01",
      endDate: "2025-06-30",
      progress: 35,
      confidence: "at-risk",
      category: "product",
      priority: "high",
      keyResults: [
        { id: 1, title: "베타 테스트 완료", current: 0.8, target: 1, unit: "완료율", status: "in-progress" },
        { id: 2, title: "런칭 후 첫 달 1만 다운로드", current: 0, target: 10000, unit: "건", status: "not-started" },
        { id: 3, title: "사용자 만족도 4.5점 달성", current: 0, target: 4.5, unit: "점", status: "not-started" }
      ],
      description: "혁신적인 신제품 개발 및 성공적인 시장 론칭",
      scope: "team"
    }
  ]);

  // 탭별 필터링
  const getFilteredObjectives = () => {
    let filtered = objectives;

    switch (activeTab) {
      case "mine":
        // 현재 로그인한 사용자 관련 목표 (예시로 김마케팅)
        filtered = objectives.filter(obj => obj.owner.includes("김") || obj.ownerTeam === "마케팅팀");
        break;
      case "team":
        filtered = objectives.filter(obj => obj.scope === "team");
        break;
      case "company":
        filtered = objectives.filter(obj => obj.scope === "company");
        break;
      default:
        break;
    }

    if (searchTerm) {
      filtered = filtered.filter(obj => 
        obj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // 신뢰도별 배지 색상
  const getConfidenceBadge = (confidence) => {
    switch (confidence) {
      case "on-track":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">🟢 On Track</Badge>;
      case "at-risk":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">🟡 At Risk</Badge>;
      case "off-track":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">🔴 Off Track</Badge>;
      default:
        return <Badge variant="outline">{confidence}</Badge>;
    }
  };

  // KR 상태별 아이콘
  const getKRStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "at-risk":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "behind":
      case "not-started":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // 카테고리별 아이콘
  const getCategoryIcon = (category) => {
    switch (category) {
      case "brand":
        return <Star className="w-5 h-5 text-purple-500" />;
      case "revenue":
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case "expansion":
        return <Globe className="w-5 h-5 text-blue-500" />;
      case "product":
        return <Zap className="w-5 h-5 text-orange-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  // 우선순위별 색상
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-400";
      case "medium":
        return "border-l-4 border-yellow-400";
      case "low":
        return "border-l-4 border-green-400";
      default:
        return "border-l-4 border-gray-400";
    }
  };

  return (
    <div className="w-full max-w-none space-y-6 animate-fadeIn">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          OKR 대시보드
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          목표와 핵심 결과를 추적하고 관리하세요
        </p>
      </div>

      {/* 컨트롤 영역 */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* 기간 선택 */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="2025-Q1">2025 Q1</option>
              <option value="2025-Q2">2025 Q2</option>
              <option value="2025-Q3">2025 Q3</option>
              <option value="2025-Q4">2025 Q4</option>
              <option value="2025-H1">2025 상반기</option>
              <option value="2025-H2">2025 하반기</option>
              <option value="2025">2025년</option>
            </select>
          </div>

          {/* 검색 */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="목표 또는 담당자 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          새 목표 만들기
        </Button>
      </div>

      {/* 보기 옵션 탭 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("mine")}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "mine"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <User className="w-4 h-4" />
            내 목표
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "team"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Users className="w-4 h-4" />
            팀 목표
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "company"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Flag className="w-4 h-4" />
            전사 목표
          </button>
        </nav>
      </div>

      {/* 목표 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getFilteredObjectives().map((objective) => (
          <Card 
            key={objective.id} 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${getPriorityColor(objective.priority)}`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1">
                  {getCategoryIcon(objective.category)}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{objective.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {objective.owner}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{objective.ownerTeam}</span>
                    </div>

                    {/* 진행률 바 */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">진행률</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{objective.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            objective.progress >= 70 ? 'bg-green-500' :
                            objective.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{width: `${objective.progress}%`}}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {getConfidenceBadge(objective.confidence)}
                      <span className="text-xs text-gray-500">{objective.period}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => router.push(`/dashboard/marketing/planning-process/${objective.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Results 요약 */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Key Results ({objective.keyResults.length}개)
                </h4>
                <div className="space-y-2">
                  {objective.keyResults.slice(0, 3).map((kr, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {getKRStatusIcon(kr.status)}
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                        {kr.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {kr.current}/{kr.target}{kr.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 메타 정보 */}
              <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  objective.priority === 'high' ? 'bg-red-100 text-red-700' :
                  objective.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {objective.priority === 'high' ? '높음' : 
                   objective.priority === 'medium' ? '보통' : '낮음'}
                </span>
                <span>{objective.startDate} ~ {objective.endDate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 결과가 없을 때 */}
      {getFilteredObjectives().length === 0 && (
        <Card className="p-12 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            목표를 찾을 수 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            검색 조건을 확인하거나 새로운 목표를 만들어보세요.
          </p>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            새 목표 만들기
          </Button>
        </Card>
      )}

      {/* 새 목표 생성 모달 (임시 플레이스홀더) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">새 목표 만들기</h2>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                ✕
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              목표 생성 폼이 여기에 표시됩니다.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                취소
              </Button>
              <Button onClick={() => setShowCreateModal(false)}>
                저장
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}