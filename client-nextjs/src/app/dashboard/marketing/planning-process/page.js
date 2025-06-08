
"use client";

import React, { useState } from "react";
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
  MessageSquare,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronRight,
  ArrowRight,
  Clock,
  User,
  FileText,
  BarChart3,
  CheckCircle,
  Circle,
  GitBranch,
  Settings,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  TrendingUp,
  Zap,
  Globe,
  Link,
  Copy,
  ExternalLink,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  Star,
  BookOpen,
  Lightbulb,
  Workflow,
  FlowChart,
} from "lucide-react";

export default function MarketingPlanningProcessPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("planning");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 마케팅 계획 데이터
  const [plans, setPlans] = useState([
    {
      id: 1,
      title: "2025년 1분기 마케팅 계획",
      status: "진행중",
      progress: 65,
      createdAt: "2025-01-15",
      updatedAt: "2025-06-08",
      objectives: [
        {
          title: "Z세대 인지도 확보",
          keyResults: ["틱톡 팔로워 5만 달성", "브랜드 인지도 20% 증가", "UGC 콘텐츠 100건 수집"]
        },
        {
          title: "온라인 매출 증대",
          keyResults: ["온라인 매출 30% 증가", "전환율 3.5% 달성", "고객 생애가치 25% 향상"]
        }
      ],
      targetPersona: "20-30대 직장인",
      coreMessage: "일상을 더 스마트하게, 더 편리하게",
      channels: ["Instagram", "TikTok", "YouTube", "네이버 블로그"],
      initiatives: [
        { name: "여름 바캉스 캠페인", status: "계획됨", linkedToCampaign: true },
        { name: "대학생 앰배서더 운영", status: "진행중", linkedToCampaign: false },
        { name: "인플루언서 협업 프로젝트", status: "완료", linkedToCampaign: true }
      ]
    },
    {
      id: 2,
      title: "신제품 런칭 마케팅 전략",
      status: "계획됨",
      progress: 25,
      createdAt: "2025-05-20",
      updatedAt: "2025-06-05",
      objectives: [
        {
          title: "신제품 인지도 구축",
          keyResults: ["런칭 첫 달 1만 다운로드", "언론 보도 20건 확보", "초기 사용자 만족도 4.5점"]
        }
      ],
      targetPersona: "30-40대 직장맘",
      coreMessage: "바쁜 일상 속 똑똑한 선택",
      channels: ["Facebook", "Instagram", "카카오톡", "네이버"],
      initiatives: [
        { name: "프리런칭 이벤트", status: "계획됨", linkedToCampaign: false },
        { name: "미디어 데이", status: "계획됨", linkedToCampaign: false }
      ]
    }
  ]);

  // 업무 프로세스 데이터
  const [processes, setProcesses] = useState([
    {
      id: 1,
      name: "콘텐츠 제작 및 승인 프로세스",
      description: "모든 마케팅 콘텐츠의 기획부터 발행까지의 표준 절차",
      status: "활성화",
      usageCount: 24,
      lastUsed: "2025-06-08",
      steps: [
        { id: 1, name: "아이디어 기획", assignee: "마케팅팀", duration: "1일", status: "active" },
        { id: 2, name: "초안 작성", assignee: "콘텐츠 담당자", duration: "2일", status: "pending" },
        { id: 3, name: "디자인 요청", assignee: "디자인팀", duration: "3일", status: "pending" },
        { id: 4, name: "내부 검토", assignee: "팀장", duration: "1일", status: "pending" },
        { id: 5, name: "최종 승인", assignee: "마케팅 총괄", duration: "1일", status: "pending" },
        { id: 6, name: "발행", assignee: "마케팅팀", duration: "0.5일", status: "pending" }
      ]
    },
    {
      id: 2,
      name: "주간 성과 보고 프로세스",
      description: "매주 마케팅 성과를 정리하고 보고하는 표준 절차",
      status: "활성화",
      usageCount: 12,
      lastUsed: "2025-06-07",
      steps: [
        { id: 1, name: "데이터 수집", assignee: "마케팅 분석가", duration: "0.5일", status: "active" },
        { id: 2, name: "보고서 작성", assignee: "마케팅 분석가", duration: "1일", status: "pending" },
        { id: 3, name: "팀 검토", assignee: "마케팅팀", duration: "0.5일", status: "pending" },
        { id: 4, name: "경영진 보고", assignee: "마케팅 총괄", duration: "0.5일", status: "pending" }
      ]
    },
    {
      id: 3,
      name: "캠페인 론칭 프로세스",
      description: "새로운 마케팅 캠페인을 기획하고 실행하는 표준 절차",
      status: "비활성화",
      usageCount: 8,
      lastUsed: "2025-05-15",
      steps: [
        { id: 1, name: "캠페인 기획", assignee: "마케팅 기획자", duration: "3일", status: "pending" },
        { id: 2, name: "예산 승인", assignee: "마케팅 총괄", duration: "1일", status: "pending" },
        { id: 3, name: "크리에이티브 제작", assignee: "크리에이티브팀", duration: "5일", status: "pending" },
        { id: 4, name: "매체 셋팅", assignee: "미디어 플래너", duration: "2일", status: "pending" },
        { id: 5, name: "캠페인 론칭", assignee: "마케팅팀", duration: "1일", status: "pending" }
      ]
    }
  ]);

  // 새 계획 생성 폼 데이터
  const [newPlan, setNewPlan] = useState({
    title: "",
    targetPersona: "",
    coreMessage: "",
    channels: [],
    objectives: [{ title: "", keyResults: [""] }],
    initiatives: [{ name: "", status: "계획됨" }]
  });

  // 새 프로세스 생성 폼 데이터
  const [newProcess, setNewProcess] = useState({
    name: "",
    description: "",
    steps: [{ name: "", assignee: "", duration: "" }]
  });

  // 상태별 배지 색상
  const getStatusBadge = (status) => {
    switch (status) {
      case "진행중":
        return <Badge className="bg-blue-500 hover:bg-blue-600">진행중</Badge>;
      case "계획됨":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">계획됨</Badge>;
      case "완료":
        return <Badge className="bg-green-500 hover:bg-green-600">완료</Badge>;
      case "활성화":
        return <Badge className="bg-green-500 hover:bg-green-600">활성화</Badge>;
      case "비활성화":
        return <Badge variant="secondary">비활성화</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 프로세스 단계 상태 아이콘
  const getStepIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  // 계획 목록 렌더링
  const renderPlanningTab = () => (
    <div className="space-y-6">
      {/* 헤더 및 액션 */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            마케팅 계획 관리
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            연간, 분기별 마케팅 전략을 수립하고 관리하세요
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          새 계획 작성
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="계획 제목으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          필터
        </Button>
      </div>

      {/* 계획 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{plan.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {getStatusBadge(plan.status)}
                    <span>진행률: {plan.progress}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedPlan(plan)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* 진행률 바 */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${plan.progress}%`}}
                ></div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* 목표 요약 */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                  주요 목표 ({plan.objectives.length}개)
                </h4>
                <div className="space-y-1">
                  {plan.objectives.slice(0, 2).map((obj, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="w-3 h-3 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {obj.title}
                      </span>
                    </div>
                  ))}
                  {plan.objectives.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{plan.objectives.length - 2}개 더
                    </span>
                  )}
                </div>
              </div>

              {/* 주요 활동 */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                  주요 활동 ({plan.initiatives.length}개)
                </h4>
                <div className="space-y-1">
                  {plan.initiatives.slice(0, 2).map((initiative, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {initiative.name}
                      </span>
                      {initiative.linkedToCampaign && (
                        <Badge variant="outline" className="text-xs">
                          캠페인연동
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 메타 정보 */}
              <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>생성: {plan.createdAt}</span>
                <span>수정: {plan.updatedAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // 프로세스 목록 렌더링
  const renderWorkflowTab = () => (
    <div className="space-y-6">
      {/* 헤더 및 액션 */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            업무 프로세스 관리
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            반복적인 업무를 표준화하여 효율성을 높이세요
          </p>
        </div>
        <Button onClick={() => setShowProcessModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          새 프로세스 생성
        </Button>
      </div>

      {/* 프로세스 목록 */}
      <div className="space-y-4">
        {processes.map((process) => (
          <Card key={process.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{process.name}</CardTitle>
                    {getStatusBadge(process.status)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {process.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <RotateCcw className="w-4 h-4" />
                      {process.usageCount}회 사용
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      최근 사용: {process.lastUsed}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedProcess(process)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* 프로세스 단계 미리보기 */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  프로세스 단계 ({process.steps.length}단계)
                </h4>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {process.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                        {getStepIcon(step.status)}
                        <span className="text-sm font-medium">{step.name}</span>
                        <span className="text-xs text-gray-500">({step.duration})</span>
                      </div>
                      {index < process.steps.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // 계획 상세 모달
  const renderPlanDetailModal = () => {
    if (!selectedPlan) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedPlan.title}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  {getStatusBadge(selectedPlan.status)}
                  <span className="text-sm text-gray-500">
                    진행률: {selectedPlan.progress}%
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* 목표 설정 (OKRs) */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                목표 설정 (OKRs)
              </h3>
              <div className="space-y-4">
                {selectedPlan.objectives.map((objective, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Objective: {objective.title}
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Key Results:
                      </p>
                      {objective.keyResults.map((kr, krIndex) => (
                        <div key={krIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{kr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 타겟 고객 및 메시지 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  타겟 고객
                </h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  {selectedPlan.targetPersona}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  핵심 메시지
                </h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  {selectedPlan.coreMessage}
                </p>
              </div>
            </div>

            {/* 채널 전략 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" />
                주요 채널
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlan.channels.map((channel, index) => (
                  <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 주요 활동 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                주요 활동
              </h3>
              <div className="space-y-3">
                {selectedPlan.initiatives.map((initiative, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {initiative.name}
                      </span>
                      {getStatusBadge(initiative.status)}
                      {initiative.linkedToCampaign && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          캠페인연동
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!initiative.linkedToCampaign && (
                        <Button size="sm" variant="outline">
                          <Link className="w-4 h-4 mr-1" />
                          캠페인 연결
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 프로세스 상세 모달
  const renderProcessDetailModal = () => {
    if (!selectedProcess) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedProcess.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {selectedProcess.description}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  {getStatusBadge(selectedProcess.status)}
                  <span className="text-sm text-gray-500">
                    {selectedProcess.usageCount}회 사용
                  </span>
                  <span className="text-sm text-gray-500">
                    최근 사용: {selectedProcess.lastUsed}
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedProcess(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-blue-500" />
              프로세스 플로우
            </h3>
            
            {/* 프로세스 시각화 */}
            <div className="space-y-4">
              {selectedProcess.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  {/* 단계 번호 */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  
                  {/* 단계 정보 */}
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {step.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {step.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {step.duration}
                          </span>
                        </div>
                      </div>
                      {getStepIcon(step.status)}
                    </div>
                  </div>
                  
                  {/* 연결선 */}
                  {index < selectedProcess.steps.length - 1 && (
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                프로세스 실행
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                복사하기
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                수정하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-none space-y-6 animate-fadeIn">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          마케팅 계획 및 프로세스
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          마케팅 활동의 설계도와 작업 매뉴얼을 관리하세요
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("planning")}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "planning"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Target className="w-4 h-4" />
            마케팅 계획
          </button>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "workflow"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Workflow className="w-4 h-4" />
            업무 프로세스
          </button>
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="mt-6">
        {activeTab === "planning" && renderPlanningTab()}
        {activeTab === "workflow" && renderWorkflowTab()}
      </div>

      {/* 모달들 */}
      {selectedPlan && renderPlanDetailModal()}
      {selectedProcess && renderProcessDetailModal()}
    </div>
  );
}
