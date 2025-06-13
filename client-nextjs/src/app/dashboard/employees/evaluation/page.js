"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card.js";
import { useTranslation } from "../../../../hooks/useLanguage.js";
import { Badge } from "../../../../components/ui/badge.js";
import { Button } from "../../../../components/ui/button.js";
import { Input } from "../../../../components/ui/input.js";
import { Label } from "../../../../components/ui/label.js";
import {
  Star,
  Plus,
  Search,
  Calendar,
  TrendingUp,
  Target,
  Users,
  Award,
  FileText,
  Edit,
} from "lucide-react";

export default function PerformanceEvaluationPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("2024-Q1");
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // 성과 평가 데이터
  const evaluationData = [
    {
      id: "EV-2024-001",
      employee: "김민수",
      department: "개발팀",
      position: "시니어 개발자",
      evaluationPeriod: "2024-Q1",
      evaluator: "이팀장",
      status: "completed",
      overallScore: 4.2,
      categories: {
        performance: 4.5,
        communication: 4.0,
        leadership: 3.8,
        innovation: 4.5,
        teamwork: 4.0,
      },
      goals: [
        { goal: "프로젝트 일정 준수", achievement: 90, status: "achieved" },
        { goal: "코드 품질 개선", achievement: 85, status: "achieved" },
        { goal: "팀원 멘토링", achievement: 75, status: "partially" },
      ],
      feedback: "전반적으로 우수한 성과를 보였으며, 특히 기술적 역량이 뛰어남",
      nextGoals: "리더십 역량 강화 및 신기술 도입 주도",
      createdDate: "2024-01-15",
      completedDate: "2024-01-30",
    },
    {
      id: "EV-2024-002",
      employee: "Nguyen Van A",
      department: "마케팅팀",
      position: "마케팅 매니저",
      evaluationPeriod: "2024-Q1",
      evaluator: "박부장",
      status: "in_progress",
      overallScore: 3.8,
      categories: {
        performance: 4.0,
        communication: 4.2,
        leadership: 4.0,
        innovation: 3.5,
        teamwork: 3.8,
      },
      goals: [
        { goal: "마케팅 캠페인 성과", achievement: 95, status: "achieved" },
        { goal: "고객 만족도 향상", achievement: 88, status: "achieved" },
        { goal: "신규 채널 개발", achievement: 60, status: "in_progress" },
      ],
      feedback: "마케팅 전문성이 뛰어나며 팀워크가 좋음",
      nextGoals: "디지털 마케팅 역량 강화",
      createdDate: "2024-01-15",
      completedDate: null,
    },
    {
      id: "EV-2024-003",
      employee: "Tran Thi B",
      department: "인사팀",
      position: "인사 담당자",
      evaluationPeriod: "2024-Q1",
      evaluator: "최이사",
      status: "pending",
      overallScore: null,
      categories: {
        performance: null,
        communication: null,
        leadership: null,
        innovation: null,
        teamwork: null,
      },
      goals: [],
      feedback: "",
      nextGoals: "",
      createdDate: "2024-01-15",
      completedDate: null,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">완료</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">진행중</Badge>;
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">대기</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">지연</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getGoalStatusBadge = (status) => {
    switch (status) {
      case "achieved":
        return <Badge className="bg-green-100 text-green-800">달성</Badge>;
      case "partially":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">부분달성</Badge>
        );
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">진행중</Badge>;
      case "not_achieved":
        return <Badge className="bg-red-100 text-red-800">미달성</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 4.0) return "text-green-600";
    if (score >= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateStats = () => {
    const completed = evaluationData.filter(
      (e) => e.status === "completed",
    ).length;
    const inProgress = evaluationData.filter(
      (e) => e.status === "in_progress",
    ).length;
    const pending = evaluationData.filter((e) => e.status === "pending").length;
    const averageScore =
      evaluationData
        .filter((e) => e.overallScore)
        .reduce((sum, e) => sum + e.overallScore, 0) /
      evaluationData.filter((e) => e.overallScore).length;

    return { completed, inProgress, pending, averageScore: averageScore || 0 };
  };

  const stats = calculateStats();

  const filteredEvaluations = evaluationData.filter(
    (evaluation) =>
      evaluation.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderStarRating = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= score ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        />,
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("employees.evaluation")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            직원 성과 평가 및 목표 관리 시스템
          </p>
        </div>

        <Button onClick={() => setShowEvaluationForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          평가 생성
        </Button>
      </div>

      {/* 평가 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 평가</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              전체 {evaluationData.length}건 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행중</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">평가 진행중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대기중</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">평가 대기</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}
            >
              {stats.averageScore.toFixed(1)}
            </div>
            <div className="flex space-x-1 mt-1">
              {renderStarRating(Math.round(stats.averageScore))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">직원 검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="직원명 또는 부서명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="period">평가 기간</Label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2024-Q1">2024년 1분기</option>
                <option value="2023-Q4">2023년 4분기</option>
                <option value="2023-Q3">2023년 3분기</option>
                <option value="2023-Q2">2023년 2분기</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 평가 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>성과 평가 목록</CardTitle>
          <CardDescription>
            {selectedPeriod} 평가 현황 ({filteredEvaluations.length}건)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {evaluation.employee}
                    </h3>
                    <p className="text-gray-600">
                      {evaluation.department} / {evaluation.position}
                    </p>
                    <p className="text-sm text-gray-500">
                      평가자: {evaluation.evaluator}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(evaluation.status)}
                    {evaluation.overallScore && (
                      <div className="mt-2">
                        <div
                          className={`text-2xl font-bold ${getScoreColor(evaluation.overallScore)}`}
                        >
                          {evaluation.overallScore.toFixed(1)}
                        </div>
                        <div className="flex space-x-1 justify-end">
                          {renderStarRating(
                            Math.round(evaluation.overallScore),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {evaluation.status === "completed" && (
                  <>
                    {/* 카테고리별 점수 */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">업무성과</p>
                        <p
                          className={`font-semibold ${getScoreColor(evaluation.categories.performance)}`}
                        >
                          {evaluation.categories.performance}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">소통능력</p>
                        <p
                          className={`font-semibold ${getScoreColor(evaluation.categories.communication)}`}
                        >
                          {evaluation.categories.communication}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">리더십</p>
                        <p
                          className={`font-semibold ${getScoreColor(evaluation.categories.leadership)}`}
                        >
                          {evaluation.categories.leadership}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">혁신성</p>
                        <p
                          className={`font-semibold ${getScoreColor(evaluation.categories.innovation)}`}
                        >
                          {evaluation.categories.innovation}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">팀워크</p>
                        <p
                          className={`font-semibold ${getScoreColor(evaluation.categories.teamwork)}`}
                        >
                          {evaluation.categories.teamwork}
                        </p>
                      </div>
                    </div>

                    {/* 목표 달성도 */}
                    {evaluation.goals.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">목표 달성도</h4>
                        <div className="space-y-2">
                          {evaluation.goals.map((goal, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <div className="flex-1">
                                <p className="text-sm">{goal.goal}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${goal.achievement}%` }}
                                  />
                                </div>
                              </div>
                              <div className="ml-4 text-right">
                                <p className="text-sm font-semibold">
                                  {goal.achievement}%
                                </p>
                                {getGoalStatusBadge(goal.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 피드백 */}
                    {evaluation.feedback && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">평가 피드백</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {evaluation.feedback}
                        </p>
                      </div>
                    )}

                    {/* 다음 목표 */}
                    {evaluation.nextGoals && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">다음 기간 목표</h4>
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                          {evaluation.nextGoals}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    생성일: {evaluation.createdDate}
                    {evaluation.completedDate &&
                      ` | 완료일: ${evaluation.completedDate}`}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEmployee(evaluation)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
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

      {/* 평가 생성 폼 (모달) */}
      {showEvaluationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>새 성과 평가 생성</CardTitle>
              <CardDescription>
                직원의 성과를 종합적으로 평가하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <Label className="text-base font-semibold">기본 정보</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="employee">평가 대상</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">직원을 선택하세요</option>
                      <option value="김민수">김민수 (개발팀)</option>
                      <option value="Nguyen Van A">
                        Nguyen Van A (마케팅팀)
                      </option>
                      <option value="Tran Thi B">Tran Thi B (인사팀)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="evaluator">평가자</Label>
                    <Input id="evaluator" placeholder="이팀장" />
                  </div>
                  <div>
                    <Label htmlFor="period">평가 기간</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="2024-Q1">2024년 1분기</option>
                      <option value="2024-Q2">2024년 2분기</option>
                      <option value="2024-Q3">2024년 3분기</option>
                      <option value="2024-Q4">2024년 4분기</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">완료 기한</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                </div>
              </div>

              {/* 평가 카테고리 */}
              <div>
                <Label className="text-base font-semibold">
                  평가 카테고리 (1-5점)
                </Label>
                <div className="grid grid-cols-1 gap-4 mt-2">
                  {[
                    { key: "performance", label: "업무 성과" },
                    { key: "communication", label: "소통 능력" },
                    { key: "leadership", label: "리더십" },
                    { key: "innovation", label: "혁신성" },
                    { key: "teamwork", label: "팀워크" },
                  ].map((category) => (
                    <div
                      key={category.key}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <Label htmlFor={category.key}>{category.label}</Label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            type="button"
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <Star className="h-5 w-5 text-gray-300 hover:text-yellow-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 목표 설정 */}
              <div>
                <Label className="text-base font-semibold">
                  목표 및 달성도
                </Label>
                <div className="space-y-3 mt-2">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-2 p-3 border rounded"
                    >
                      <Input placeholder={`목표 ${index}`} />
                      <Input
                        type="number"
                        placeholder="달성률 (%)"
                        min="0"
                        max="100"
                      />
                      <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">상태 선택</option>
                        <option value="achieved">달성</option>
                        <option value="partially">부분달성</option>
                        <option value="in_progress">진행중</option>
                        <option value="not_achieved">미달성</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* 피드백 */}
              <div>
                <Label htmlFor="feedback">평가 피드백</Label>
                <textarea
                  id="feedback"
                  placeholder="직원의 성과에 대한 구체적인 피드백을 작성하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              {/* 다음 목표 */}
              <div>
                <Label htmlFor="nextGoals">다음 기간 목표</Label>
                <textarea
                  id="nextGoals"
                  placeholder="다음 평가 기간의 목표와 개선 방향을 제시하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEvaluationForm(false)}
                >
                  취소
                </Button>
                <Button>평가 생성</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
