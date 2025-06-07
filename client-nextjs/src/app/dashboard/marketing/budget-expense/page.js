
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
import { useLanguage } from "@/contexts/languageContext.js";
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Calculator,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Filter,
  Search,
  FileText,
  CreditCard,
  Wallet,
} from "lucide-react";

export default function BudgetExpensePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("budget");
  const [selectedPeriod, setSelectedPeriod] = useState("2024-06");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      category: "콘텐츠 제작",
      allocated: 10000000,
      spent: 6500000,
      period: "2024-06",
      description: "소셜미디어 콘텐츠 제작 비용",
      subcategories: [
        { name: "촬영 비용", allocated: 4000000, spent: 2800000 },
        { name: "편집 비용", allocated: 3000000, spent: 1900000 },
        { name: "모델료", allocated: 3000000, spent: 1800000 }
      ]
    },
    {
      id: 2,
      category: "광고비",
      allocated: 15000000,
      spent: 12300000,
      period: "2024-06",
      description: "페이스북, 인스타그램, 구글 광고비",
      subcategories: [
        { name: "Facebook 광고", allocated: 6000000, spent: 5200000 },
        { name: "Instagram 광고", allocated: 5000000, spent: 4100000 },
        { name: "Google 광고", allocated: 4000000, spent: 3000000 }
      ]
    },
    {
      id: 3,
      category: "인플루언서",
      allocated: 8000000,
      spent: 5500000,
      period: "2024-06",
      description: "인플루언서 협업 비용",
      subcategories: [
        { name: "메가 인플루언서", allocated: 5000000, spent: 3500000 },
        { name: "매크로 인플루언서", allocated: 2000000, spent: 1500000 },
        { name: "마이크로 인플루언서", allocated: 1000000, spent: 500000 }
      ]
    },
    {
      id: 4,
      category: "이벤트/프로모션",
      allocated: 5000000,
      spent: 2800000,
      period: "2024-06",
      description: "이벤트 및 프로모션 활동 비용",
      subcategories: [
        { name: "상품 제작", allocated: 2000000, spent: 1200000 },
        { name: "배송비", allocated: 1500000, spent: 900000 },
        { name: "운영비", allocated: 1500000, spent: 700000 }
      ]
    }
  ]);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2024-06-15",
      category: "콘텐츠 제작",
      subcategory: "촬영 비용",
      description: "신제품 촬영 스튜디오 대여",
      amount: 800000,
      receipt: "receipt_001.pdf",
      approver: "김마케팅",
      status: "approved"
    },
    {
      id: 2,
      date: "2024-06-14",
      category: "광고비",
      subcategory: "Facebook 광고",
      description: "Facebook 광고 캠페인 비용",
      amount: 1200000,
      receipt: "fb_invoice_001.pdf",
      approver: "박광고",
      status: "approved"
    },
    {
      id: 3,
      date: "2024-06-13",
      category: "인플루언서",
      subcategory: "메가 인플루언서",
      description: "김뷰티 인플루언서 협업비",
      amount: 2000000,
      receipt: "influencer_001.pdf",
      approver: "이매니저",
      status: "pending"
    },
    {
      id: 4,
      date: "2024-06-12",
      category: "이벤트/프로모션",
      subcategory: "상품 제작",
      description: "이벤트 굿즈 제작비",
      amount: 600000,
      receipt: "goods_001.pdf",
      approver: "최이벤트",
      status: "approved"
    }
  ]);
  const [newBudget, setNewBudget] = useState({
    category: "",
    allocated: "",
    period: "",
    description: "",
    subcategories: [{ name: "", allocated: "" }]
  });
  const [newExpense, setNewExpense] = useState({
    date: "",
    category: "",
    subcategory: "",
    description: "",
    amount: "",
    receipt: null
  });

  const tabs = [
    { id: "budget", label: "예산 관리", icon: Calculator },
    { id: "expenses", label: "지출 내역", icon: Receipt },
    { id: "reports", label: "리포트", icon: BarChart3 },
    { id: "analytics", label: "분석", icon: PieChart },
  ];

  const categories = ["all", "콘텐츠 제작", "광고비", "인플루언서", "이벤트/프로모션", "기타"];
  const periods = ["2024-06", "2024-05", "2024-04", "2024-03", "2024-02", "2024-01"];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const getUsagePercentage = (spent, allocated) => {
    return allocated > 0 ? (spent / allocated) * 100 : 0;
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return "text-red-600 bg-red-100";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { label: "승인", color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { label: "대기", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      rejected: { label: "반려", color: "bg-red-100 text-red-800", icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const addSubcategory = () => {
    setNewBudget(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, { name: "", allocated: "" }]
    }));
  };

  const updateSubcategory = (index, field, value) => {
    setNewBudget(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) => 
        i === index ? { ...sub, [field]: value } : sub
      )
    }));
  };

  const removeSubcategory = (index) => {
    setNewBudget(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const handleSaveBudget = () => {
    if (newBudget.category && newBudget.allocated && newBudget.period) {
      const budget = {
        ...newBudget,
        id: Date.now(),
        allocated: parseInt(newBudget.allocated),
        spent: 0,
        subcategories: newBudget.subcategories.map(sub => ({
          ...sub,
          allocated: parseInt(sub.allocated) || 0,
          spent: 0
        }))
      };
      setBudgets(prev => [...prev, budget]);
      setNewBudget({
        category: "",
        allocated: "",
        period: "",
        description: "",
        subcategories: [{ name: "", allocated: "" }]
      });
      setShowBudgetModal(false);
    }
  };

  const handleSaveExpense = () => {
    if (newExpense.date && newExpense.category && newExpense.amount) {
      const expense = {
        ...newExpense,
        id: Date.now(),
        amount: parseInt(newExpense.amount),
        status: "pending",
        approver: "대기중"
      };
      setExpenses(prev => [...prev, expense]);
      setNewExpense({
        date: "",
        category: "",
        subcategory: "",
        description: "",
        amount: "",
        receipt: null
      });
      setShowExpenseModal(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewExpense(prev => ({ ...prev, receipt: file }));
    }
  };

  const filteredBudgets = budgets.filter(budget => 
    budget.period === selectedPeriod &&
    (selectedCategory === "all" || budget.category === selectedCategory)
  );

  const filteredExpenses = expenses.filter(expense => {
    const expenseMonth = expense.date.substring(0, 7);
    const matchesPeriod = expenseMonth === selectedPeriod;
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPeriod && matchesCategory && matchesSearch;
  });

  const totalBudget = filteredBudgets.reduce((acc, budget) => acc + budget.allocated, 0);
  const totalSpent = filteredBudgets.reduce((acc, budget) => acc + budget.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const overallUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const monthlyExpenses = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const pendingExpenses = filteredExpenses.filter(exp => exp.status === "pending").length;
  const approvedExpenses = filteredExpenses.filter(exp => exp.status === "approved").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                예산·지출 관리
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                마케팅 활동별 예산 배분과 실제 지출 내역을 관리합니다
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowBudgetModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                예산 설정
              </Button>
              <Button onClick={() => setShowExpenseModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                지출 등록
              </Button>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <Label>기간 선택</Label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>카테고리</Label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "전체 카테고리" : category}
                    </option>
                  ))}
                </select>
              </div>
              {(activeTab === "expenses") && (
                <div className="lg:col-span-2">
                  <Label>검색</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="지출 내역 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 예산</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
                </div>
                <Calculator className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">사용 금액</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                  <p className="text-xs text-gray-500">{overallUsage.toFixed(1)}% 사용</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">잔여 예산</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(remainingBudget)}</p>
                </div>
                <Wallet className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">대기 승인</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingExpenses}</p>
                  <p className="text-xs text-gray-500">건</p>
                </div>
                <Receipt className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
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

        {/* Budget Management Tab */}
        {activeTab === "budget" && (
          <div className="space-y-6">
            {filteredBudgets.map((budget) => {
              const usagePercentage = getUsagePercentage(budget.spent, budget.allocated);
              return (
                <Card key={budget.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{budget.category}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUsageColor(usagePercentage)}`}>
                          {usagePercentage.toFixed(1)}% 사용
                        </span>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{budget.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Overall Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>전체 진행률</span>
                          <span>{formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              usagePercentage >= 90 ? "bg-red-500" :
                              usagePercentage >= 70 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Subcategories */}
                      <div>
                        <h4 className="font-medium mb-3">세부 항목</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {budget.subcategories.map((sub, index) => {
                            const subUsage = getUsagePercentage(sub.spent, sub.allocated);
                            return (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">{sub.name}</span>
                                  <span className="text-sm text-gray-600">{subUsage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                  <div
                                    className={`h-2 rounded-full ${
                                      subUsage >= 90 ? "bg-red-400" :
                                      subUsage >= 70 ? "bg-yellow-400" : "bg-green-400"
                                    }`}
                                    style={{ width: `${Math.min(subUsage, 100)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>사용: {formatCurrency(sub.spent)}</span>
                                  <span>예산: {formatCurrency(sub.allocated)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === "expenses" && (
          <Card>
            <CardHeader>
              <CardTitle>지출 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">날짜</th>
                      <th className="text-left py-3 px-4 font-semibold">카테고리</th>
                      <th className="text-left py-3 px-4 font-semibold">세부항목</th>
                      <th className="text-left py-3 px-4 font-semibold">내용</th>
                      <th className="text-right py-3 px-4 font-semibold">금액</th>
                      <th className="text-center py-3 px-4 font-semibold">상태</th>
                      <th className="text-center py-3 px-4 font-semibold">승인자</th>
                      <th className="text-center py-3 px-4 font-semibold">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{expense.date}</td>
                        <td className="py-3 px-4">{expense.category}</td>
                        <td className="py-3 px-4">{expense.subcategory}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            {expense.receipt && (
                              <p className="text-xs text-gray-500">영수증: {expense.receipt}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(expense.status)}
                        </td>
                        <td className="py-3 px-4 text-center">{expense.approver}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            {expense.receipt && (
                              <Button size="sm" variant="outline">
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="text-center p-6 cursor-pointer hover:shadow-lg transition-shadow">
              <Download className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold mb-2">월간 예산 리포트</h3>
              <p className="text-sm text-gray-600 mb-4">
                선택한 기간의 예산 사용 현황과 카테고리별 분석을 제공합니다
              </p>
              <Button>PDF 다운로드</Button>
            </Card>

            <Card className="text-center p-6 cursor-pointer hover:shadow-lg transition-shadow">
              <FileText className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">지출 내역 리포트</h3>
              <p className="text-sm text-gray-600 mb-4">
                상세한 지출 내역과 영수증을 포함한 종합 리포트입니다
              </p>
              <Button>Excel 다운로드</Button>
            </Card>

            <Card className="text-center p-6 cursor-pointer hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="font-semibold mb-2">예산 분석 리포트</h3>
              <p className="text-sm text-gray-600 mb-4">
                예산 대비 실적 분석과 향후 예산 계획을 위한 인사이트를 제공합니다
              </p>
              <Button>PDF 다운로드</Button>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 예산 사용률</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBudgets.map((budget) => {
                    const usagePercentage = getUsagePercentage(budget.spent, budget.allocated);
                    return (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{budget.category}</span>
                          <span className="text-sm text-gray-600">{usagePercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              usagePercentage >= 90 ? "bg-red-500" :
                              usagePercentage >= 70 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{formatCurrency(budget.spent)}</span>
                          <span>{formatCurrency(budget.allocated)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>최근 3개월 지출 트렌드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">차트 데이터를 불러오는 중...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>예산 효율성 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="font-semibold text-lg">{((totalSpent / totalBudget) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">예산 집행률</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold text-lg">{formatCurrency(monthlyExpenses / filteredExpenses.length || 0)}</p>
                    <p className="text-sm text-gray-600">평균 지출</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="font-semibold text-lg">
                      {filteredBudgets.filter(b => getUsagePercentage(b.spent, b.allocated) >= 90).length}
                    </p>
                    <p className="text-sm text-gray-600">위험 카테고리</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="font-semibold text-lg">{approvedExpenses}</p>
                    <p className="text-sm text-gray-600">승인된 지출</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>예산 알림</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredBudgets
                    .filter(budget => getUsagePercentage(budget.spent, budget.allocated) >= 80)
                    .map((budget) => {
                      const usagePercentage = getUsagePercentage(budget.spent, budget.allocated);
                      return (
                        <div key={budget.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <AlertTriangle className={`w-5 h-5 ${
                            usagePercentage >= 90 ? "text-red-500" : "text-yellow-500"
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium">{budget.category}</p>
                            <p className="text-sm text-gray-600">
                              예산의 {usagePercentage.toFixed(1)}%를 사용했습니다
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  {filteredBudgets.filter(budget => getUsagePercentage(budget.spent, budget.allocated) >= 80).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      현재 예산 위험 항목이 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Budget Modal */}
        {showBudgetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>새 예산 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label>카테고리</Label>
                    <Input
                      value={newBudget.category}
                      onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="예: 콘텐츠 제작"
                    />
                  </div>
                  <div>
                    <Label>기간</Label>
                    <select
                      value={newBudget.period}
                      onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value }))}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">기간 선택</option>
                      {periods.map(period => (
                        <option key={period} value={period}>{period}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-2">
                    <Label>총 예산 (원)</Label>
                    <Input
                      type="number"
                      value={newBudget.allocated}
                      onChange={(e) => setNewBudget(prev => ({ ...prev, allocated: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label>설명</Label>
                  <textarea
                    value={newBudget.description}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="예산 항목에 대한 설명을 입력하세요"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md h-24 resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>세부 항목</Label>
                    <Button size="sm" variant="outline" onClick={addSubcategory}>
                      <Plus className="w-3 h-3 mr-1" />
                      항목 추가
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {newBudget.subcategories.map((sub, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 items-end">
                        <div>
                          <Label className="text-xs">항목명</Label>
                          <Input
                            value={sub.name}
                            onChange={(e) => updateSubcategory(index, "name", e.target.value)}
                            placeholder="항목명"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">예산</Label>
                          <Input
                            type="number"
                            value={sub.allocated}
                            onChange={(e) => updateSubcategory(index, "allocated", e.target.value)}
                            placeholder="0"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          {newBudget.subcategories.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeSubcategory(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowBudgetModal(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSaveBudget}>
                    예산 설정
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Expense Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>지출 등록</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>날짜</Label>
                    <Input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>금액 (원)</Label>
                    <Input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label>카테고리</Label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">카테고리 선택</option>
                    {categories.filter(cat => cat !== "all").map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>세부 항목</Label>
                  <Input
                    value={newExpense.subcategory}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, subcategory: e.target.value }))}
                    placeholder="세부 항목을 입력하세요"
                  />
                </div>

                <div>
                  <Label>내용</Label>
                  <textarea
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="지출 내용을 입력하세요"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md h-24 resize-none"
                  />
                </div>

                <div>
                  <Label>영수증</Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label htmlFor="receipt-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">영수증을 업로드하세요</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG 지원</p>
                    </label>
                    {newExpense.receipt && (
                      <p className="text-sm text-green-600 mt-2">
                        선택된 파일: {newExpense.receipt.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowExpenseModal(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSaveExpense}>
                    지출 등록
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
