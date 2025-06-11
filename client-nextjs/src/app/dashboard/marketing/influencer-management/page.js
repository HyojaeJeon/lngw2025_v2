
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
import { useLanguage } from "@/hooks/useLanguage.js";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  Instagram,
  Youtube,
  MessageSquare,
  Heart,
  Share2,
  Download,
  Upload,
  Phone,
  Mail,
  MapPin,
  Camera,
  Video,
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function InfluencerManagementPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [influencers, setInfluencers] = useState([
    {
      id: 1,
      name: "김뷰티",
      profileImage: "/uploads/influencer1.jpg",
      platforms: [
        { name: "Instagram", handle: "@kimbeauty", followers: 125000, engagement: 3.2 },
        { name: "TikTok", handle: "@kimbeauty_official", followers: 89000, engagement: 5.8 },
      ],
      category: "뷰티",
      tier: "메가",
      contactInfo: {
        email: "kimbeauty@gmail.com",
        phone: "010-1234-5678",
        manager: "박매니저",
        agency: "뷰티 매니지먼트"
      },
      contracts: [
        {
          id: "C001",
          campaign: "신제품 런칭 캠페인",
          startDate: "2024-06-01",
          endDate: "2024-06-30",
          budget: 5000000,
          status: "active",
          deliverables: ["인스타그램 포스트 3개", "스토리 5개", "릴스 1개"]
        }
      ],
      performance: {
        totalReach: 245000,
        totalEngagement: 12500,
        avgCTR: 2.8,
        completedCampaigns: 8
      },
      notes: "반응이 좋고 협조적임. 재계약 추천"
    },
    {
      id: 2,
      name: "이패션",
      profileImage: "/uploads/influencer2.jpg",
      platforms: [
        { name: "Instagram", handle: "@fashioneee", followers: 78000, engagement: 4.1 },
        { name: "YouTube", handle: "이패션 채널", followers: 45000, engagement: 6.2 },
      ],
      category: "패션",
      tier: "매크로",
      contactInfo: {
        email: "fashion.lee@naver.com",
        phone: "010-2345-6789",
        manager: "최매니저",
        agency: "패션 크리에이터스"
      },
      contracts: [
        {
          id: "C002",
          campaign: "여름 컬렉션 프로모션",
          startDate: "2024-05-15",
          endDate: "2024-07-15",
          budget: 3000000,
          status: "completed",
          deliverables: ["유튜브 리뷰 영상 1개", "인스타그램 포스트 2개"]
        }
      ],
      performance: {
        totalReach: 156000,
        totalEngagement: 8900,
        avgCTR: 3.1,
        completedCampaigns: 5
      },
      notes: "콘텐츠 퀄리티 우수"
    },
    {
      id: 3,
      name: "박라이프",
      profileImage: "/uploads/influencer3.jpg",
      platforms: [
        { name: "TikTok", handle: "@parklife_daily", followers: 195000, engagement: 7.3 },
        { name: "Instagram", handle: "@parklife_style", followers: 112000, engagement: 3.8 },
      ],
      category: "라이프스타일",
      tier: "메가",
      contactInfo: {
        email: "parklife.official@gmail.com",
        phone: "010-3456-7890",
        manager: "김매니저",
        agency: "라이프 크리에이터"
      },
      contracts: [
        {
          id: "C003",
          campaign: "건강한 라이프스타일 캠페인",
          startDate: "2024-06-10",
          endDate: "2024-08-10",
          budget: 7000000,
          status: "pending",
          deliverables: ["틱톡 영상 5개", "인스타그램 포스트 4개", "스토리 10개"]
        }
      ],
      performance: {
        totalReach: 389000,
        totalEngagement: 28500,
        avgCTR: 4.2,
        completedCampaigns: 12
      },
      notes: "젊은층에게 인기가 높음"
    }
  ]);
  const [newInfluencer, setNewInfluencer] = useState({
    name: "",
    category: "",
    tier: "",
    platforms: [{ name: "", handle: "", followers: "", engagement: "" }],
    contactInfo: {
      email: "",
      phone: "",
      manager: "",
      agency: ""
    },
    notes: ""
  });

  const categories = ["all", "뷰티", "패션", "라이프스타일", "푸드", "여행", "테크", "기타"];
  const statusOptions = ["all", "active", "pending", "completed", "cancelled"];
  const tierOptions = ["나노", "마이크로", "매크로", "메가", "셀럽"];
  const platformOptions = ["Instagram", "TikTok", "YouTube", "Facebook", "Twitter"];

  const tabs = [
    { id: "list", label: "인플루언서 목록", icon: Users },
    { id: "contracts", label: "계약 관리", icon: FileText },
    { id: "performance", label: "성과 분석", icon: TrendingUp },
    { id: "reports", label: "리포트", icon: Download },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "진행중", color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { label: "대기중", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      completed: { label: "완료", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      cancelled: { label: "취소", color: "bg-red-100 text-red-800", icon: XCircle }
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

  const getTierColor = (tier) => {
    switch (tier) {
      case "셀럽": return "bg-purple-100 text-purple-800";
      case "메가": return "bg-red-100 text-red-800";
      case "매크로": return "bg-blue-100 text-blue-800";
      case "마이크로": return "bg-green-100 text-green-800";
      case "나노": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "Instagram": return Instagram;
      case "TikTok": return Video;
      case "YouTube": return Youtube;
      case "Facebook": return MessageSquare;
      default: return Camera;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const addPlatform = () => {
    setNewInfluencer(prev => ({
      ...prev,
      platforms: [...prev.platforms, { name: "", handle: "", followers: "", engagement: "" }]
    }));
  };

  const updatePlatform = (index, field, value) => {
    setNewInfluencer(prev => ({
      ...prev,
      platforms: prev.platforms.map((platform, i) => 
        i === index ? { ...platform, [field]: value } : platform
      )
    }));
  };

  const removePlatform = (index) => {
    setNewInfluencer(prev => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index)
    }));
  };

  const handleSaveInfluencer = () => {
    if (newInfluencer.name && newInfluencer.category) {
      const influencer = {
        ...newInfluencer,
        id: Date.now(),
        contracts: [],
        performance: {
          totalReach: 0,
          totalEngagement: 0,
          avgCTR: 0,
          completedCampaigns: 0
        }
      };
      setInfluencers(prev => [...prev, influencer]);
      setNewInfluencer({
        name: "",
        category: "",
        tier: "",
        platforms: [{ name: "", handle: "", followers: "", engagement: "" }],
        contactInfo: {
          email: "",
          phone: "",
          manager: "",
          agency: ""
        },
        notes: ""
      });
      setShowAddModal(false);
    }
  };

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.platforms.some(p => p.handle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || influencer.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || 
                         influencer.contracts.some(c => c.status === selectedStatus);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalInfluencers = influencers.length;
  const activeContracts = influencers.reduce((acc, inf) => 
    acc + inf.contracts.filter(c => c.status === "active").length, 0);
  const totalBudget = influencers.reduce((acc, inf) => 
    acc + inf.contracts.reduce((contractAcc, contract) => contractAcc + contract.budget, 0), 0);
  const avgEngagement = influencers.reduce((acc, inf) => {
    const avgPlatformEngagement = inf.platforms.reduce((pAcc, platform) => 
      pAcc + platform.engagement, 0) / inf.platforms.length;
    return acc + avgPlatformEngagement;
  }, 0) / influencers.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                인플루언서 관리
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                협업 인플루언서 목록과 성과를 관리합니다
              </p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              인플루언서 추가
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 인플루언서</p>
                  <p className="text-2xl font-bold text-gray-900">{totalInfluencers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">진행중 계약</p>
                  <p className="text-2xl font-bold text-gray-900">{activeContracts}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 예산</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">평균 참여율</p>
                  <p className="text-2xl font-bold text-gray-900">{avgEngagement.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
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

        {/* Filters */}
        {activeTab === "list" && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="인플루언서명, 핸들로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "전체 카테고리" : category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status === "all" ? "전체 상태" : 
                         status === "active" ? "진행중" :
                         status === "pending" ? "대기중" :
                         status === "completed" ? "완료" : "취소"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content based on active tab */}
        {activeTab === "list" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <Card key={influencer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{influencer.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getTierColor(influencer.tier)}`}>
                          {influencer.tier}
                        </span>
                        <span className="text-sm text-gray-500">{influencer.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="space-y-2 mb-4">
                    {influencer.platforms.map((platform, index) => {
                      const Icon = getPlatformIcon(platform.name);
                      return (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{platform.handle}</span>
                          </div>
                          <div className="text-right">
                            <div>{formatNumber(platform.followers)}</div>
                            <div className="text-xs text-gray-500">{platform.engagement}% 참여율</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Contract Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>활성 계약</span>
                      <span>{influencer.contracts.filter(c => c.status === "active").length}개</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>완료 캠페인</span>
                      <span>{influencer.performance.completedCampaigns}개</span>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-xs text-gray-600">총 도달</p>
                      <p className="font-semibold">{formatNumber(influencer.performance.totalReach)}</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-xs text-gray-600">평균 CTR</p>
                      <p className="font-semibold">{influencer.performance.avgCTR}%</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedInfluencer(influencer)}>
                      <Eye className="w-3 h-3 mr-1" />
                      상세
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "contracts" && (
          <Card>
            <CardHeader>
              <CardTitle>계약 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">계약 ID</th>
                      <th className="text-left py-3 px-4 font-semibold">인플루언서</th>
                      <th className="text-left py-3 px-4 font-semibold">캠페인</th>
                      <th className="text-left py-3 px-4 font-semibold">기간</th>
                      <th className="text-right py-3 px-4 font-semibold">예산</th>
                      <th className="text-center py-3 px-4 font-semibold">상태</th>
                      <th className="text-center py-3 px-4 font-semibold">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {influencers.flatMap(influencer => 
                      influencer.contracts.map(contract => (
                        <tr key={contract.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{contract.id}</td>
                          <td className="py-3 px-4">{influencer.name}</td>
                          <td className="py-3 px-4">{contract.campaign}</td>
                          <td className="py-3 px-4">
                            {contract.startDate} ~ {contract.endDate}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold">
                            {formatCurrency(contract.budget)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {getStatusBadge(contract.status)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "performance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>상위 성과 인플루언서</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {influencers
                    .sort((a, b) => b.performance.totalReach - a.performance.totalReach)
                    .slice(0, 5)
                    .map((influencer, index) => (
                      <div key={influencer.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{influencer.name}</p>
                            <p className="text-sm text-gray-600">{influencer.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatNumber(influencer.performance.totalReach)}</p>
                          <p className="text-sm text-gray-600">총 도달</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>카테고리별 성과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.filter(cat => cat !== "all").map(category => {
                    const categoryInfluencers = influencers.filter(inf => inf.category === category);
                    const totalReach = categoryInfluencers.reduce((acc, inf) => acc + inf.performance.totalReach, 0);
                    const avgEngagement = categoryInfluencers.length > 0 
                      ? categoryInfluencers.reduce((acc, inf) => {
                          const avgPlatformEngagement = inf.platforms.reduce((pAcc, platform) => 
                            pAcc + platform.engagement, 0) / inf.platforms.length;
                          return acc + avgPlatformEngagement;
                        }, 0) / categoryInfluencers.length 
                      : 0;

                    return (
                      <div key={category} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{category}</span>
                          <span className="text-sm text-gray-600">{categoryInfluencers.length}명</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">총 도달</p>
                            <p className="font-semibold">{formatNumber(totalReach)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">평균 참여율</p>
                            <p className="font-semibold">{avgEngagement.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reports" && (
          <Card>
            <CardHeader>
              <CardTitle>리포트 생성</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <Download className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2">인플루언서 성과 리포트</h3>
                  <p className="text-sm text-gray-600 mb-4">전체 인플루언서의 성과를 분석한 리포트를 생성합니다</p>
                  <Button>PDF 다운로드</Button>
                </div>

                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2">계약 현황 리포트</h3>
                  <p className="text-sm text-gray-600 mb-4">진행중인 계약과 완료된 계약의 현황을 정리합니다</p>
                  <Button>Excel 다운로드</Button>
                </div>

                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2">ROI 분석 리포트</h3>
                  <p className="text-sm text-gray-600 mb-4">캠페인별 투자 대비 수익률을 분석합니다</p>
                  <Button>PDF 다운로드</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Influencer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>새 인플루언서 추가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label>인플루언서명</Label>
                    <Input
                      value={newInfluencer.name}
                      onChange={(e) => setNewInfluencer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="인플루언서명을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label>카테고리</Label>
                    <select
                      value={newInfluencer.category}
                      onChange={(e) => setNewInfluencer(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">카테고리 선택</option>
                      {categories.filter(cat => cat !== "all").map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>티어</Label>
                    <select
                      value={newInfluencer.tier}
                      onChange={(e) => setNewInfluencer(prev => ({ ...prev, tier: e.target.value }))}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">티어 선택</option>
                      {tierOptions.map(tier => (
                        <option key={tier} value={tier}>{tier}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>플랫폼</Label>
                    <Button size="sm" variant="outline" onClick={addPlatform}>
                      <Plus className="w-3 h-3 mr-1" />
                      플랫폼 추가
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {newInfluencer.platforms.map((platform, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-end">
                        <div>
                          <Label className="text-xs">플랫폼</Label>
                          <select
                            value={platform.name}
                            onChange={(e) => updatePlatform(index, "name", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="">선택</option>
                            {platformOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs">핸들</Label>
                          <Input
                            value={platform.handle}
                            onChange={(e) => updatePlatform(index, "handle", e.target.value)}
                            placeholder="@handle"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">팔로워</Label>
                          <Input
                            type="number"
                            value={platform.followers}
                            onChange={(e) => updatePlatform(index, "followers", e.target.value)}
                            placeholder="0"
                            className="text-sm"
                          />
                        </div>
                        <div className="flex space-x-1">
                          <Input
                            type="number"
                            step="0.1"
                            value={platform.engagement}
                            onChange={(e) => updatePlatform(index, "engagement", e.target.value)}
                            placeholder="참여율"
                            className="text-sm flex-1"
                          />
                          {newInfluencer.platforms.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removePlatform(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <Label className="mb-2 block">연락처 정보</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">이메일</Label>
                      <Input
                        type="email"
                        value={newInfluencer.contactInfo.email}
                        onChange={(e) => setNewInfluencer(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, email: e.target.value }
                        }))}
                        placeholder="이메일"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">전화번호</Label>
                      <Input
                        value={newInfluencer.contactInfo.phone}
                        onChange={(e) => setNewInfluencer(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, phone: e.target.value }
                        }))}
                        placeholder="전화번호"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">매니저</Label>
                      <Input
                        value={newInfluencer.contactInfo.manager}
                        onChange={(e) => setNewInfluencer(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, manager: e.target.value }
                        }))}
                        placeholder="매니저명"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">소속사</Label>
                      <Input
                        value={newInfluencer.contactInfo.agency}
                        onChange={(e) => setNewInfluencer(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, agency: e.target.value }
                        }))}
                        placeholder="소속사"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label>메모</Label>
                  <textarea
                    value={newInfluencer.notes}
                    onChange={(e) => setNewInfluencer(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="인플루언서에 대한 메모를 입력하세요"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md h-24 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSaveInfluencer}>
                    추가
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Influencer Detail Modal */}
        {selectedInfluencer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedInfluencer.name} 상세 정보</CardTitle>
                  <Button variant="outline" onClick={() => setSelectedInfluencer(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">기본 정보</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">카테고리:</span>
                          <span>{selectedInfluencer.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">티어:</span>
                          <span className={`px-2 py-1 rounded ${getTierColor(selectedInfluencer.tier)}`}>
                            {selectedInfluencer.tier}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">이메일:</span>
                          <span>{selectedInfluencer.contactInfo.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">전화번호:</span>
                          <span>{selectedInfluencer.contactInfo.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">매니저:</span>
                          <span>{selectedInfluencer.contactInfo.manager}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">소속사:</span>
                          <span>{selectedInfluencer.contactInfo.agency}</span>
                        </div>
                      </div>
                    </div>

                    {/* Platforms */}
                    <div>
                      <h3 className="font-semibold mb-2">플랫폼</h3>
                      <div className="space-y-2">
                        {selectedInfluencer.platforms.map((platform, index) => {
                          const Icon = getPlatformIcon(platform.name);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center space-x-2">
                                <Icon className="w-5 h-5" />
                                <div>
                                  <p className="font-medium">{platform.name}</p>
                                  <p className="text-sm text-gray-600">{platform.handle}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatNumber(platform.followers)}</p>
                                <p className="text-sm text-gray-600">{platform.engagement}% 참여율</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Performance & Contracts */}
                  <div className="space-y-4">
                    {/* Performance */}
                    <div>
                      <h3 className="font-semibold mb-2">성과 지표</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">총 도달</p>
                          <p className="font-semibold">{formatNumber(selectedInfluencer.performance.totalReach)}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <Heart className="w-6 h-6 text-green-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">총 참여</p>
                          <p className="font-semibold">{formatNumber(selectedInfluencer.performance.totalEngagement)}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <MessageSquare className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">평균 CTR</p>
                          <p className="font-semibold">{selectedInfluencer.performance.avgCTR}%</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded">
                          <Star className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">완료 캠페인</p>
                          <p className="font-semibold">{selectedInfluencer.performance.completedCampaigns}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contracts */}
                    <div>
                      <h3 className="font-semibold mb-2">계약 내역</h3>
                      {selectedInfluencer.contracts.length === 0 ? (
                        <p className="text-sm text-gray-500">계약 내역이 없습니다.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedInfluencer.contracts.map((contract) => (
                            <div key={contract.id} className="p-3 border rounded">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{contract.campaign}</span>
                                {getStatusBadge(contract.status)}
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>기간: {contract.startDate} ~ {contract.endDate}</p>
                                <p>예산: {formatCurrency(contract.budget)}</p>
                                <div className="mt-1">
                                  <p className="font-medium">산출물:</p>
                                  <ul className="list-disc list-inside ml-2">
                                    {contract.deliverables.map((deliverable, index) => (
                                      <li key={index}>{deliverable}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {selectedInfluencer.notes && (
                      <div>
                        <h3 className="font-semibold mb-2">메모</h3>
                        <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                          {selectedInfluencer.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
