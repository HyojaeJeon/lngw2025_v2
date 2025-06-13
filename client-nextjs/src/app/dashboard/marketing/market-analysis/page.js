"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import {
  TrendingUp,
  Target,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  AlertCircle,
  Calendar,
  Globe,
  Star,
  Zap,
} from "lucide-react";

export default function MarketAnalysisPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("market");
  const [marketData, setMarketData] = useState({
    size: 2.5,
    growth: 15.2,
    segments: [
      { name: "스킨케어", share: 45, growth: 12 },
      { name: "메이크업", share: 35, growth: 18 },
      { name: "헤어케어", share: 20, growth: 8 },
    ],
  });
  const [trendKeywords, setTrendKeywords] = useState([
    { keyword: "K-뷰티", score: 95, trend: "up" },
    { keyword: "천연성분", score: 88, trend: "up" },
    { keyword: "비건뷰티", score: 82, trend: "stable" },
    { keyword: "항노화", score: 75, trend: "down" },
    { keyword: "선케어", score: 92, trend: "up" },
  ]);
  const [competitors, setCompetitors] = useState([
    {
      id: 1,
      name: "The Face Shop",
      marketShare: 12.5,
      strengths: ["브랜드 인지도", "유통망"],
      weaknesses: ["혁신성 부족", "높은 가격"],
      opportunities: ["온라인 확장", "젊은층 타겟"],
      threats: ["신규 브랜드", "가격 경쟁"],
    },
    {
      id: 2,
      name: "Innisfree",
      marketShare: 8.3,
      strengths: ["자연 친화적", "제주 브랜딩"],
      weaknesses: ["제한적 제품군", "마케팅"],
      opportunities: ["친환경 트렌드", "아시아 확장"],
      threats: ["모회사 정책", "경쟁 심화"],
    },
  ]);
  const [reports, setReports] = useState([]);
  const [newCompetitor, setNewCompetitor] = useState({
    name: "",
    marketShare: "",
    strengths: [""],
    weaknesses: [""],
    opportunities: [""],
    threats: [""],
  });
  const [showAddCompetitor, setShowAddCompetitor] = useState(false);

  const tabs = [
    { id: "market", label: "시장 현황", icon: TrendingUp },
    { id: "trends", label: "트렌드 분석", icon: Zap },
    { id: "competitors", label: "경쟁사 분석", icon: Target },
    { id: "reports", label: "리포트 관리", icon: Upload },
  ];

  const addSWOTItem = (category) => {
    setNewCompetitor((prev) => ({
      ...prev,
      [category]: [...prev[category], ""],
    }));
  };

  const updateSWOTItem = (category, index, value) => {
    setNewCompetitor((prev) => ({
      ...prev,
      [category]: prev[category].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeSWOTItem = (category, index) => {
    setNewCompetitor((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleAddCompetitor = () => {
    if (newCompetitor.name && newCompetitor.marketShare) {
      setCompetitors((prev) => [
        ...prev,
        {
          ...newCompetitor,
          id: Date.now(),
          marketShare: parseFloat(newCompetitor.marketShare),
        },
      ]);
      setNewCompetitor({
        name: "",
        marketShare: "",
        strengths: [""],
        weaknesses: [""],
        opportunities: [""],
        threats: [""],
      });
      setShowAddCompetitor(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newReports = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file),
    }));
    setReports((prev) => [...prev, ...newReports]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            시장 및 경쟁 분석
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            베트남 화장품 시장 동향과 경쟁사 현황을 실시간으로 파악합니다
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Market Overview Tab */}
        {activeTab === "market" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Market Size Cards */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      시장 규모
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${marketData.size}B
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">성장률</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {marketData.growth}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      주요 세그먼트
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {marketData.segments.length}
                    </p>
                  </div>
                  <PieChart className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            {/* Market Segments Chart */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>시장 세그먼트 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.segments.map((segment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{segment.name}</span>
                          <span className="text-sm text-gray-600">
                            {segment.share}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${segment.share}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-sm text-gray-600">성장률</p>
                        <p
                          className={`font-medium ${segment.growth > 10 ? "text-green-600" : "text-orange-600"}`}
                        >
                          +{segment.growth}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === "trends" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trending Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>트렌드 키워드</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            keyword.trend === "up"
                              ? "bg-green-500"
                              : keyword.trend === "down"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <span className="font-medium">{keyword.keyword}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">
                          {keyword.score}
                        </span>
                        <p className="text-xs text-gray-500">트렌드 점수</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keyword Cloud Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>키워드 클라우드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center space-y-2">
                    <div className="flex flex-wrap justify-center gap-2">
                      {trendKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            index === 0
                              ? "text-2xl bg-blue-100 text-blue-800"
                              : index === 1
                                ? "text-xl bg-green-100 text-green-800"
                                : index === 2
                                  ? "text-lg bg-purple-100 text-purple-800"
                                  : "text-base bg-gray-100 text-gray-800"
                          }`}
                          style={{
                            fontSize: `${1.5 - index * 0.1}rem`,
                          }}
                        >
                          {keyword.keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === "competitors" && (
          <div className="space-y-6">
            {/* Add Competitor Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">경쟁사 목록</h2>
              <Button onClick={() => setShowAddCompetitor(true)}>
                <Plus className="w-4 h-4 mr-2" />
                경쟁사 추가
              </Button>
            </div>

            {/* Competitors List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {competitors.map((competitor) => (
                <Card key={competitor.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{competitor.name}</CardTitle>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {competitor.marketShare}% 점유율
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">
                          강점 (Strengths)
                        </h4>
                        <ul className="text-sm space-y-1">
                          {competitor.strengths.map((strength, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-1"
                            >
                              <span className="w-1 h-1 bg-green-500 rounded-full" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">
                          약점 (Weaknesses)
                        </h4>
                        <ul className="text-sm space-y-1">
                          {competitor.weaknesses.map((weakness, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-1"
                            >
                              <span className="w-1 h-1 bg-red-500 rounded-full" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">
                          기회 (Opportunities)
                        </h4>
                        <ul className="text-sm space-y-1">
                          {competitor.opportunities.map(
                            (opportunity, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-1"
                              >
                                <span className="w-1 h-1 bg-blue-500 rounded-full" />
                                <span>{opportunity}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-600 mb-2">
                          위협 (Threats)
                        </h4>
                        <ul className="text-sm space-y-1">
                          {competitor.threats.map((threat, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-1"
                            >
                              <span className="w-1 h-1 bg-orange-500 rounded-full" />
                              <span>{threat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Competitor Modal */}
            {showAddCompetitor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>경쟁사 추가</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>회사명</Label>
                        <Input
                          value={newCompetitor.name}
                          onChange={(e) =>
                            setNewCompetitor((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="경쟁사명을 입력하세요"
                        />
                      </div>
                      <div>
                        <Label>시장 점유율 (%)</Label>
                        <Input
                          type="number"
                          value={newCompetitor.marketShare}
                          onChange={(e) =>
                            setNewCompetitor((prev) => ({
                              ...prev,
                              marketShare: e.target.value,
                            }))
                          }
                          placeholder="0.0"
                        />
                      </div>
                    </div>

                    {/* SWOT Analysis Form */}
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        "strengths",
                        "weaknesses",
                        "opportunities",
                        "threats",
                      ].map((category) => (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="capitalize">
                              {category === "strengths"
                                ? "강점"
                                : category === "weaknesses"
                                  ? "약점"
                                  : category === "opportunities"
                                    ? "기회"
                                    : "위협"}
                            </Label>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addSWOTItem(category)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {newCompetitor[category].map((item, index) => (
                              <div key={index} className="flex space-x-2">
                                <Input
                                  value={item}
                                  onChange={(e) =>
                                    updateSWOTItem(
                                      category,
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`${category} 항목을 입력하세요`}
                                  className="text-sm"
                                />
                                {newCompetitor[category].length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      removeSWOTItem(category, index)
                                    }
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddCompetitor(false)}
                      >
                        취소
                      </Button>
                      <Button onClick={handleAddCompetitor}>추가</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>외부 리포트 관리</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="report-upload"
                  />
                  <label htmlFor="report-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-600">
                      시장 리포트를 업로드하세요
                    </p>
                    <p className="text-sm text-gray-400">
                      PDF, DOC, XLS 파일 지원
                    </p>
                  </label>
                </div>

                {reports.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">업로드된 리포트</h3>
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="font-medium">{report.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(report.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            다운로드
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
