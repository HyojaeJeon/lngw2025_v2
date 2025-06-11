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
  Save,
  Upload,
  Download,
  History,
  Palette,
  AlertTriangle,
  Lightbulb,
  Type,
  Image,
  FileText,
  Edit3,
  Eye,
  Plus,
  Trash2,
  RefreshCw,
  Users,
  User,
  Target,
  Quote,
  MapPin,
  Briefcase,
  DollarSign,
  Heart,
  Calendar,
  ShoppingBag,
  Award,
  Star,
  Copy,
  Edit,
  Camera,
  X,
} from "lucide-react";

export default function BrandStrategyPage() {
  const { t } = useLanguage();
  const [brandData, setBrandData] = useState({
    mission: "",
    vision: "",
    values: [""],
    slogan: "",
    story: "",
  });
  const [colorPalette, setColorPalette] = useState([
    { name: "Primary", color: "#FF6B35", description: "메인 브랜드 컬러" },
    { name: "Secondary", color: "#F7931E", description: "보조 컬러" },
    { name: "Accent", color: "#FFD23F", description: "포인트 컬러" },
  ]);
  const [logos, setLogos] = useState([]);
  const [guidelines, setGuidelines] = useState([]);
  const [history, setHistory] = useState([]);
  const [personas, setPersonas] = useState([
    {
      id: 1,
      name: "Nguyễn Thuỳ Linh",
      archetype: "트렌드에 민감한 K-뷰티 꿈나무",
      quote:
        "여드름 자국만 없어도 화장 안 하고 다닐 텐데. 빨리 효과 보고 싶어요!",
      image: null,
      demographics: {
        age: 22,
        location: "호치민시 7군, RMIT 대학 근처",
        occupation: "호치민 인사대 4학년",
        income: "부모님 용돈 및 카페 아르바이트 월 800만 동",
        family: "부모님과 함께 거주",
      },
      skinProfile: {
        skinType: "수분 부족형 지성, 민감성",
        concerns: [
          "턱과 볼에 반복적으로 올라오는 화농성 여드름",
          "여드름을 짜고 난 뒤 생긴 붉은 자국",
          "오후만 되면 번들거리는 T존과 넓어 보이는 모공",
        ],
        routine:
          "아침: 물세안, 저녁: 강한 스크럽 클렌저, 토너 생략, 여드름 스팟 제품",
        knowledgeLevel: "초급",
        experience:
          "티트리 오일은 효과를 봤지만, BHA 토너는 너무 자극적이었어요.",
      },
      goals: {
        functional: "2주 안에 트러블 진정시키기, 여드름 흉터 옅게 만들기",
        emotional: "화장 없이도 자신감 갖기, 피부 때문에 스트레스 안 받기",
        painPoints:
          "효과 있다는 제품은 너무 비싸요, 광고만큼 효과가 없어서 실망한 적이 많아요",
      },
      lifestyle: {
        dailyLife:
          "아침 7시 기상 → 대학 수업 → 카페 아르바이트 → 저녁 10시 귀가",
        sns: ["TikTok", "Instagram", "Facebook"],
        content: ["댄스 챌린지", "GRWM", "제품 리뷰 비포/애프터"],
        influencers: ["Call Me Duy", "Quynh Anh Shyn"],
        communities: ["Nghiện Skincare", "Beauty Tips & Reviews"],
        shopping: ["Shopee", "TikTok Shop", "Lazada"],
        journey:
          "TikTok에서 인플루언서 영상을 보고 → Shopee에서 검색 → 사용자 리뷰 수백 개 확인 후 → 할인쿠폰 적용하여 구매",
      },
      brand: {
        preferences: "의류는 Shein, 신발은 Nike - 트렌디하고 가성비 좋은",
        trustFactors:
          "피부과 테스트 완료, 전문가(약사) 추천, 수많은 긍정적 실사용 후기",
        disappointmentFactors: "광고와 다른 효과, 피부 트러블 유발, 비싼 가격",
      },
    },
  ]);
  const [activeTab, setActiveTab] = useState("mission");
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [newPersona, setNewPersona] = useState({
    name: "",
    archetype: "",
    quote: "",
    image: null,
    demographics: {
      age: "",
      location: "",
      occupation: "",
      income: "",
      family: "",
    },
    skinProfile: {
      skinType: "",
      concerns: [""],
      routine: "",
      knowledgeLevel: "초급",
      experience: "",
    },
    goals: {
      functional: "",
      emotional: "",
      painPoints: "",
    },
    lifestyle: {
      dailyLife: "",
      sns: [""],
      content: [""],
      influencers: [""],
      communities: [""],
      shopping: [""],
      journey: "",
    },
    brand: {
      preferences: "",
      trustFactors: "",
      disappointmentFactors: "",
    },
  });

  // SWOT 분석 데이터
  const [swotData, setSwotData] = useState({
    strengths: [
      {
        id: 1,
        category: "제품 및 가치 제안",
        title: "대표 제품 AHA-BHA-PHA 30 Days Miracle Toner",
        content: "3초당 1병 판매 – 시장 흡인력 입증",
      },
      {
        id: 2,
        category: "제품 및 가치 제안",
        title: "Clean-ical 포뮬러",
        content:
          "Tea Tree 10,000ppm, AHA/BHA/PHA, 2% 나이아신아마이드 → 성분 비율 투명 공개 + 유해 성분 20가지 무첨가",
      },
      {
        id: 3,
        category: "고객 및 경험",
        title: "Hasaki 기준 높은 고객 만족도",
        content: "Toner 평균 평점 4.9 / 5 (리뷰 73건), 반품률 낮음",
      },
      {
        id: 4,
        category: "채널 및 마케팅",
        title: "TikTok 베트남 채널",
        content:
          "@somebymi.official_vn: 팔로워 48.8K, 좋아요 189K, ER 4~6% (뷰티 평균 3.5% 이상)",
      },
    ],
    weaknesses: [
      {
        id: 1,
        category: "제품 및 가치 제안",
        title: "복잡한 제품 라인업",
        content: "라인업이 많고 이름이 길어 → 신규 고객이 선택 시 혼란",
      },
      {
        id: 2,
        category: "제품 및 가치 제안",
        title: "민감성 피부 자극 우려",
        content:
          "일부 산 성분/레티놀 제품은 민감성 피부에 자극 보고 존재 → 정확한 사용법 안내 필요",
      },
      {
        id: 3,
        category: "고객 및 경험",
        title: "오프라인 체험 기회 부족",
        content:
          "오프라인 플래그십 매장 없음 → Innisfree처럼 제품 '직접 체험' 기회 부족",
      },
      {
        id: 4,
        category: "채널 및 마케팅",
        title: "높은 할인 의존도",
        content: "30–40% 할인 의존도 높음 → 매출 유지 위해 마진 희생 우려",
      },
    ],
    opportunities: [
      {
        id: 1,
        category: "제품 및 가치 제안",
        title: "Gen Z의 성분 니즈 증가",
        content:
          "강력하지만 순한 성분 니즈 증가, 투명한 농도 표기 브랜드가 적은 상황에서 차별화 우위",
      },
      {
        id: 2,
        category: "고객 및 경험",
        title: "오프라인 체험 확장 가능성",
        content:
          "Watsons/Guardian 등 오프라인 체험 키오스크 개설로 브랜드 인지도 향상",
      },
      {
        id: 3,
        category: "채널 및 마케팅",
        title: "TikTok Shop 폭발적 성장",
        content: "2024년 VN 이커머스 점유율 24%, GMV 전년 대비 53% 성장",
      },
      {
        id: 4,
        category: "재무 및 시장 점유율",
        title: "베트남 화장품 시장 성장",
        content:
          "연평균 성장률 9.5% 예상 (2030까지), 이커머스 뷰티 분야 지속적인 두 자릿수 성장세",
      },
    ],
    threats: [
      {
        id: 1,
        category: "제품 및 가치 제안",
        title: "K-beauty 경쟁사 모방",
        content:
          "COSRX, Axis-Y 등 K-beauty 경쟁사들이 Clean-ical 콘셉트와 성분 투명성 모방 중",
      },
      {
        id: 2,
        category: "고객 및 경험",
        title: "오프라인 체험 선호 트렌드",
        content:
          "베트남 소비자들은 직접 테스트 선호 → 오프라인 체험 부재 시 경쟁사에 밀릴 수 있음",
      },
      {
        id: 3,
        category: "채널 및 마케팅",
        title: "플랫폼 규제 리스크",
        content:
          "국가의 TikTok Shop / 라이브 방송 규제 가능성, 이커머스 플랫폼 수수료 인상 리스크",
      },
      {
        id: 4,
        category: "재무 및 시장 점유율",
        title: "가격 경쟁 심화",
        content:
          "가격 경쟁 심화, 광고 단가 상승, COSRX, Innisfree는 플래시 세일 강화로 시장 공세 확대 중",
      },
    ],
  });
  const [newSwotItem, setNewSwotItem] = useState({
    category: "",
    title: "",
    content: "",
  });
  const [editingSwotItem, setEditingSwotItem] = useState(null);
  const [showSwotModal, setShowSwotModal] = useState(false);
  const [selectedSwotType, setSelectedSwotType] = useState("strengths");

  const handleBrandDataChange = (field, value) => {
    setBrandData((prev) => ({ ...prev, [field]: value }));
  };

  const addValue = () => {
    setBrandData((prev) => ({
      ...prev,
      values: [...prev.values, ""],
    }));
  };

  const updateValue = (index, value) => {
    setBrandData((prev) => ({
      ...prev,
      values: prev.values.map((v, i) => (i === index ? value : v)),
    }));
  };

  const removeValue = (index) => {
    setBrandData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const addColor = () => {
    setColorPalette((prev) => [
      ...prev,
      { name: "", color: "#000000", description: "" },
    ]);
  };

  const updateColor = (index, field, value) => {
    setColorPalette((prev) =>
      prev.map((color, i) =>
        i === index ? { ...color, [field]: value } : color,
      ),
    );
  };

  const removeColor = (index) => {
    setColorPalette((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (type, event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file),
    }));

    if (type === "logo") {
      setLogos((prev) => [...prev, ...newFiles]);
    } else if (type === "guideline") {
      setGuidelines((prev) => [...prev, ...newFiles]);
    }
  };

  const saveBrandData = () => {
    const historyEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      changes: "브랜드 정보 업데이트",
      user: "현재 사용자",
      data: {
        ...brandData,
        colorPalette: [...colorPalette],
        personas: [...personas],
      },
    };
    setHistory((prev) => [historyEntry, ...prev]);
    alert("브랜드 전략이 저장되었습니다.");
  };

  // 페르소나 관련 함수들
  const openPersonaModal = (persona = null) => {
    if (persona) {
      setEditingPersona(persona);
      setNewPersona(persona);
    } else {
      setEditingPersona(null);
      setNewPersona({
        name: "",
        archetype: "",
        quote: "",
        image: null,
        demographics: {
          age: "",
          location: "",
          occupation: "",
          income: "",
          family: "",
        },
        skinProfile: {
          skinType: "",
          concerns: [""],
          routine: "",
          knowledgeLevel: "초급",
          experience: "",
        },
        goals: {
          functional: "",
          emotional: "",
          painPoints: "",
        },
        lifestyle: {
          dailyLife: "",
          sns: [""],
          content: [""],
          influencers: [""],
          communities: [""],
          shopping: [""],
          journey: "",
        },
        brand: {
          preferences: "",
          trustFactors: "",
          disappointmentFactors: "",
        },
      });
    }
    setShowPersonaModal(true);
  };

  const savePersona = () => {
    if (editingPersona) {
      setPersonas((prev) =>
        prev.map((p) =>
          p.id === editingPersona.id
            ? { ...newPersona, id: editingPersona.id }
            : p,
        ),
      );
    } else {
      setPersonas((prev) => [...prev, { ...newPersona, id: Date.now() }]);
    }
    setShowPersonaModal(false);
    setEditingPersona(null);
  };

  const deletePersona = (id) => {
    setPersonas((prev) => prev.filter((p) => p.id !== id));
  };

  const duplicatePersona = (persona) => {
    const newPersona = {
      ...persona,
      id: Date.now(),
      name: `${persona.name} (복사본)`,
    };
    setPersonas((prev) => [...prev, newPersona]);
  };

  const updatePersonaField = (section, field, value) => {
    if (section) {
      setNewPersona((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setNewPersona((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addArrayItem = (section, field) => {
    setNewPersona((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], ""],
      },
    }));
  };

  const updateArrayItem = (section, field, index, value) => {
    setNewPersona((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) =>
          i === index ? value : item,
        ),
      },
    }));
  };

  const removeArrayItem = (section, field, index) => {
    setNewPersona((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index),
      },
    }));
  };

  // SWOT 분석 관련 함수들
  const openSwotModal = (type, item = null) => {
    setSelectedSwotType(type);
    if (item) {
      setEditingSwotItem(item);
      setNewSwotItem({
        category: item.category,
        title: item.title,
        content: item.content,
      });
    } else {
      setEditingSwotItem(null);
      setNewSwotItem({
        category: "",
        title: "",
        content: "",
      });
    }
    setShowSwotModal(true);
  };

  const saveSwotItem = () => {
    if (!newSwotItem.title || !newSwotItem.content) return;

    if (editingSwotItem) {
      setSwotData((prev) => ({
        ...prev,
        [selectedSwotType]: prev[selectedSwotType].map((item) =>
          item.id === editingSwotItem.id
            ? { ...newSwotItem, id: editingSwotItem.id }
            : item,
        ),
      }));
    } else {
      setSwotData((prev) => ({
        ...prev,
        [selectedSwotType]: [
          ...prev[selectedSwotType],
          {
            ...newSwotItem,
            id: Date.now(),
          },
        ],
      }));
    }
    setShowSwotModal(false);
    setEditingSwotItem(null);
  };

  const deleteSwotItem = (type, id) => {
    setSwotData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };

  const getSwotIcon = (type) => {
    switch (type) {
      case "strengths":
        return Award;
      case "weaknesses":
        return AlertTriangle;
      case "opportunities":
        return Star;
      case "threats":
        return RefreshCw;
      default:
        return Target;
    }
  };

  const getSwotColor = (type) => {
    switch (type) {
      case "strengths":
        return "from-green-500 to-emerald-500";
      case "weaknesses":
        return "from-red-500 to-rose-500";
      case "opportunities":
        return "from-blue-500 to-cyan-500";
      case "threats":
        return "from-orange-500 to-yellow-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getSwotLabel = (type) => {
    switch (type) {
      case "strengths":
        return "강점 (Strengths)";
      case "weaknesses":
        return "약점 (Weaknesses)";
      case "opportunities":
        return "기회 (Opportunities)";
      case "threats":
        return "위협 (Threats)";
      default:
        return "";
    }
  };

  const tabs = [
    { id: "mission", label: "미션/비전/가치", icon: FileText },
    { id: "personas", label: "고객 페르소나", icon: Users },
    { id: "swot", label: "SWOT 분석", icon: Target },
    { id: "assets", label: "브랜드 자산", icon: Palette },
    { id: "guidelines", label: "가이드라인", icon: Upload },
    { id: "history", label: "변경 이력", icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  브랜드 전략 관리
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Neul20's 브랜드 아이덴티티와 핵심 메시지를 관리합니다
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={saveBrandData}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg"
                >
                  <Save className="w-5 h-5 mr-2" />
                  변경사항 저장
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-white/20">
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "mission" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission & Vision */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <Edit3 className="w-6 h-6" />
                  <span>미션 & 비전</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div>
                  <Label
                    htmlFor="mission"
                    className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 block"
                  >
                    미션
                  </Label>
                  <textarea
                    id="mission"
                    value={brandData.mission}
                    onChange={(e) =>
                      handleBrandDataChange("mission", e.target.value)
                    }
                    placeholder="우리의 사명과 존재 이유를 입력하세요"
                    className="w-full mt-1 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl h-32 resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="vision"
                    className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 block"
                  >
                    비전
                  </Label>
                  <textarea
                    id="vision"
                    value={brandData.vision}
                    onChange={(e) =>
                      handleBrandDataChange("vision", e.target.value)
                    }
                    placeholder="우리가 꿈꾸는 미래를 입력하세요"
                    className="w-full mt-1 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl h-32 resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Core Values */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6" />
                    <span>핵심 가치</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={addValue}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    추가
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {brandData.values.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <Input
                        value={value}
                        onChange={(e) => updateValue(index, e.target.value)}
                        placeholder={`핵심 가치 ${index + 1}`}
                        className="flex-1 border-2 focus:border-orange-500"
                      />
                      {brandData.values.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeValue(index)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Slogan & Story */}
            <Card className="lg:col-span-2 shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-xl">
                  슬로건 & 브랜드 스토리
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div>
                  <Label
                    htmlFor="slogan"
                    className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 block"
                  >
                    슬로건
                  </Label>
                  <Input
                    id="slogan"
                    value={brandData.slogan}
                    onChange={(e) =>
                      handleBrandDataChange("slogan", e.target.value)
                    }
                    placeholder="브랜드를 대표하는 슬로건을 입력하세요"
                    className="mt-1 p-4 border-2 focus:border-purple-500 text-lg"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="story"
                    className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 block"
                  >
                    브랜드 스토리
                  </Label>
                  <textarea
                    id="story"
                    value={brandData.story}
                    onChange={(e) =>
                      handleBrandDataChange("story", e.target.value)
                    }
                    placeholder="브랜드의 탄생 배경과 스토리를 입력하세요"
                    className="w-full mt-1 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl h-40 resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "personas" && (
          <div className="space-y-8">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  고객 페르소나
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  타겟 고객의 특성과 니즈를 상세히 정의하고 관리하세요
                </p>
              </div>
              <Button
                onClick={() => openPersonaModal()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />새 페르소나 추가
              </Button>
            </div>

            {/* 페르소나 카드들 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {personas.map((persona) => (
                <Card
                  key={persona.id}
                  className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          {persona.image ? (
                            <img
                              src={persona.image}
                              alt={persona.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{persona.name}</h3>
                          <p className="text-indigo-100 text-sm">
                            {persona.demographics.age}세 •{" "}
                            {persona.demographics.occupation}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          onClick={() => openPersonaModal(persona)}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => duplicatePersona(persona)}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deletePersona(persona.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-300/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    {/* 아키타입 */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-sm text-indigo-600 dark:text-indigo-400">
                          아키타입
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {persona.archetype}
                      </p>
                    </div>

                    {/* 핵심 인용구 */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <Quote className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                          핵심 인용구
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 italic">
                        "{persona.quote}"
                      </p>
                    </div>

                    {/* 주요 정보 */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400 truncate">
                          {persona.demographics.location}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400 truncate">
                          {persona.demographics.occupation}
                        </span>
                      </div>
                    </div>

                    {/* 피부 고민 */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="font-semibold text-sm text-pink-600 dark:text-pink-400">
                          주요 피부 고민
                        </span>
                      </div>
                      <div className="space-y-1">
                        {persona.skinProfile.concerns
                          .slice(0, 2)
                          .map((concern, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 dark:text-gray-400 truncate"
                            >
                              {index + 1}. {concern}
                            </div>
                          ))}
                        {persona.skinProfile.concerns.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{persona.skinProfile.concerns.length - 2}개 더
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "swot" && (
          <div className="space-y-8">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  SWOT 분석
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  브랜드의 강점, 약점, 기회, 위협 요소를 체계적으로 분석하고
                  관리하세요
                </p>
              </div>
            </div>

            {/* SWOT 매트릭스 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {["strengths", "weaknesses", "opportunities", "threats"].map(
                (type) => {
                  const Icon = getSwotIcon(type);
                  return (
                    <Card
                      key={type}
                      className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                    >
                      <CardHeader
                        className={`bg-gradient-to-r ${getSwotColor(type)} text-white`}
                      >
                        <CardTitle className="flex items-center justify-between text-xl">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-6 h-6" />
                            <span>{getSwotLabel(type)}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => openSwotModal(type)}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            추가
                          </Button>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-6">
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {swotData[type].map((item) => (
                            <div
                              key={item.id}
                              className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                                type === "strengths"
                                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-gray-700 dark:to-gray-600"
                                  : type === "weaknesses"
                                    ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 dark:from-gray-700 dark:to-gray-600"
                                    : type === "opportunities"
                                      ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 dark:from-gray-700 dark:to-gray-600"
                                      : "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 dark:from-gray-700 dark:to-gray-600"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        type === "strengths"
                                          ? "bg-green-200 text-green-800"
                                          : type === "weaknesses"
                                            ? "bg-red-200 text-red-800"
                                            : type === "opportunities"
                                              ? "bg-blue-200 text-blue-800"
                                              : "bg-orange-200 text-orange-800"
                                      }`}
                                    >
                                      {item.category}
                                    </span>
                                  </div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                                    {item.title}
                                  </h4>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {item.content}
                                  </p>
                                </div>
                                <div className="flex space-x-1 ml-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openSwotModal(type, item)}
                                    className="p-2 h-8 w-8"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      deleteSwotItem(type, item.id)
                                    }
                                    className="p-2 h-8 w-8 text-red-600 border-red-300 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {swotData[type].length === 0 && (
                            <div className="text-center py-8">
                              <Icon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                              <p className="text-gray-500">
                                아직 등록된 항목이 없습니다.
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openSwotModal(type)}
                                className="mt-3"
                              >
                                첫 번째 항목 추가하기
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                },
              )}
            </div>

            {/* 결론 및 인사이트 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <Lightbulb className="w-6 h-6" />
                  <span>SWOT 분석 결론 및 전략적 인사이트</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      핵심 인사이트
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                          🎯 핵심 강점 활용
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          성분 투명성을 갖춘 Clean-ical 제품군으로 차별화된
                          강점을 보유하며, 30일 안에 효과라는 명확한 포지셔닝과
                          TikTok 중심의 강력한 디지털 존재감
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                          🚀 기회 포착 전략
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          베트남 화장품 시장의 지속적인 성장세와 TikTok Shop의
                          폭발적 성장을 활용하여 시장 점유율 확대 가능
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">
                          ⚠️ 약점 보완 방안
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          오프라인 채널 다변화와 지나친 할인 의존 탈피가 향후
                          지속 성장을 위한 과제
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">
                          🛡️ 위협 대응 전략
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          피부 진단 및 사용 가이드가 포함된 체험형 서비스로 경쟁
                          심화되는 K-beauty 시장에서 우위를 유지해야 함
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "assets" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Color Palette */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-6 h-6" />
                    <span>컬러 팔레트</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={addColor}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    추가
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-pink-300 transition-all"
                    >
                      <div
                        className="w-16 h-16 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg"
                        style={{ backgroundColor: color.color }}
                      />
                      <div className="flex-1 space-y-3">
                        <Input
                          value={color.name}
                          onChange={(e) =>
                            updateColor(index, "name", e.target.value)
                          }
                          placeholder="컬러 이름"
                          className="font-medium"
                        />
                        <div className="flex space-x-3">
                          <input
                            type="color"
                            value={color.color}
                            onChange={(e) =>
                              updateColor(index, "color", e.target.value)
                            }
                            className="w-20 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-600 cursor-pointer"
                          />
                          <Input
                            value={color.description}
                            onChange={(e) =>
                              updateColor(index, "description", e.target.value)
                            }
                            placeholder="설명"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeColor(index)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Logo Library */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <Image className="w-6 h-6" />
                  <span>로고 라이브러리</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload("logo", e)}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                        로고 파일을 업로드하세요
                      </p>
                      <p className="text-sm text-gray-400">
                        PNG, JPG, SVG 지원
                      </p>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {logos.map((logo) => (
                      <div
                        key={logo.id}
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:border-blue-400 transition-all"
                      >
                        <img
                          src={logo.url}
                          alt={logo.name}
                          className="w-full h-24 object-contain mb-3 rounded-lg"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
                          {logo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "guidelines" && (
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <FileText className="w-6 h-6" />
                <span>브랜드 가이드라인</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-violet-400 transition-all">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => handleFileUpload("guideline", e)}
                    className="hidden"
                    id="guideline-upload"
                  />
                  <label htmlFor="guideline-upload" className="cursor-pointer">
                    <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                    <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                      가이드라인 문서를 업로드하세요
                    </p>
                    <p className="text-gray-400">PDF, DOC, DOCX 파일 지원</p>
                  </label>
                </div>

                {guidelines.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      업로드된 가이드라인
                    </h3>
                    {guidelines.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-violet-400 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="w-10 h-10 text-violet-500" />
                          <div>
                            <p className="font-medium text-lg">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(file.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-violet-300 text-violet-600 hover:bg-violet-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            미리보기
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-violet-300 text-violet-600 hover:bg-violet-50"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            다운로드
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

        {activeTab === "history" && (
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <History className="w-6 h-6" />
                <span>변경 이력</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {history.length === 0 ? (
                <div className="text-center py-16">
                  <History className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl text-gray-500">
                    아직 변경 이력이 없습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="border-l-4 border-blue-500 pl-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-r-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {entry.changes}
                        </h4>
                        <span className="text-sm text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                          {new Date(entry.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        변경자: {entry.user}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* SWOT 모달 */}
        {showSwotModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl">
              {/* 모달 헤더 */}
              <div
                className={`bg-gradient-to-r ${getSwotColor(selectedSwotType)} text-white p-6`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingSwotItem
                      ? `${getSwotLabel(selectedSwotType)} 수정`
                      : `${getSwotLabel(selectedSwotType)} 추가`}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSwotModal(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* 모달 콘텐츠 */}
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      카테고리 *
                    </Label>
                    <Input
                      value={newSwotItem.category}
                      onChange={(e) =>
                        setNewSwotItem((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      placeholder="예: 제품 및 가치 제안, 고객 및 경험, 채널 및 마케팅..."
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      제목 *
                    </Label>
                    <Input
                      value={newSwotItem.title}
                      onChange={(e) =>
                        setNewSwotItem((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="항목의 제목을 입력하세요"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      내용 *
                    </Label>
                    <textarea
                      value={newSwotItem.content}
                      onChange={(e) =>
                        setNewSwotItem((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="세부 내용을 입력하세요"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 모달 푸터 */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSwotModal(false)}
                  className="px-6"
                >
                  취소
                </Button>
                <Button
                  onClick={saveSwotItem}
                  disabled={!newSwotItem.title || !newSwotItem.content}
                  className={`bg-gradient-to-r ${getSwotColor(selectedSwotType)} hover:opacity-90 text-white px-6 disabled:opacity-50`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 페르소나 모달 */}
        {showPersonaModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
              {/* 모달 헤더 */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingPersona ? "페르소나 수정" : "새 페르소나 추가"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPersonaModal(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* 모달 콘텐츠 */}
              <div className="overflow-y-auto max-h-[calc(95vh-120px)] p-8">
                <div className="space-y-10">
                  {/* Part 1: 기본 프로필 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white font-bold flex items-center justify-center">
                        1
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        기본 프로필 (The Basics)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 flex items-center gap-6">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                          {newPersona.image ? (
                            <img
                              src={newPersona.image}
                              alt="페르소나"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            대표 이미지
                          </Label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setNewPersona((prev) => ({
                                  ...prev,
                                  image: URL.createObjectURL(file),
                                }));
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          페르소나 이름 *
                        </Label>
                        <Input
                          value={newPersona.name}
                          onChange={(e) =>
                            updatePersonaField(null, "name", e.target.value)
                          }
                          placeholder="예: Nguyễn Thuỳ Linh"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          아키타입 *
                        </Label>
                        <Input
                          value={newPersona.archetype}
                          onChange={(e) =>
                            updatePersonaField(
                              null,
                              "archetype",
                              e.target.value,
                            )
                          }
                          placeholder="예: 트렌드에 민감한 K-뷰티 꿈나무"
                          className="w-full"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          핵심 인용구 *
                        </Label>
                        <textarea
                          value={newPersona.quote}
                          onChange={(e) =>
                            updatePersonaField(null, "quote", e.target.value)
                          }
                          placeholder="예: 여드름 자국만 없어도 화장 안 하고 다닐 텐데. 빨리 효과 보고 싶어요!"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 2: 인구통계학적 정보 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-emerald-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-bold flex items-center justify-center">
                        2
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        인구통계학적 정보 (Demographics)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          나이
                        </Label>
                        <Input
                          value={newPersona.demographics.age}
                          onChange={(e) =>
                            updatePersonaField(
                              "demographics",
                              "age",
                              e.target.value,
                            )
                          }
                          placeholder="예: 22"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          거주지
                        </Label>
                        <Input
                          value={newPersona.demographics.location}
                          onChange={(e) =>
                            updatePersonaField(
                              "demographics",
                              "location",
                              e.target.value,
                            )
                          }
                          placeholder="예: 호치민시 7군, RMIT 대학 근처"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          직업 및 소속
                        </Label>
                        <Input
                          value={newPersona.demographics.occupation}
                          onChange={(e) =>
                            updatePersonaField(
                              "demographics",
                              "occupation",
                              e.target.value,
                            )
                          }
                          placeholder="예: 호치민 인사대 4학년"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          월 소득 / 소비력
                        </Label>
                        <Input
                          value={newPersona.demographics.income}
                          onChange={(e) =>
                            updatePersonaField(
                              "demographics",
                              "income",
                              e.target.value,
                            )
                          }
                          placeholder="예: 부모님 용돈 및 카페 아르바이트 월 800만 동"
                          className="w-full"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          가족 관계
                        </Label>
                        <Input
                          value={newPersona.demographics.family}
                          onChange={(e) =>
                            updatePersonaField(
                              "demographics",
                              "family",
                              e.target.value,
                            )
                          }
                          placeholder="예: 부모님과 함께 거주"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 3: 피부 및 스킨케어 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-pink-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-bold flex items-center justify-center">
                        3
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        피부 및 스킨케어 (Skin Profile & Routine)
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          피부 타입
                        </Label>
                        <Input
                          value={newPersona.skinProfile.skinType}
                          onChange={(e) =>
                            updatePersonaField(
                              "skinProfile",
                              "skinType",
                              e.target.value,
                            )
                          }
                          placeholder="예: 수분 부족형 지성, 민감성"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          주요 피부 고민 (우선순위별)
                        </Label>
                        <div className="space-y-3">
                          {newPersona.skinProfile.concerns.map(
                            (concern, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                  {index + 1}
                                </span>
                                <Input
                                  value={concern}
                                  onChange={(e) =>
                                    updateArrayItem(
                                      "skinProfile",
                                      "concerns",
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`${index + 1}순위 피부 고민`}
                                  className="flex-1"
                                />
                                {newPersona.skinProfile.concerns.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      removeArrayItem(
                                        "skinProfile",
                                        "concerns",
                                        index,
                                      )
                                    }
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ),
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              addArrayItem("skinProfile", "concerns")
                            }
                            className="text-pink-600 border-pink-300"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            피부 고민 추가
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            현재 스킨케어 루틴
                          </Label>
                          <textarea
                            value={newPersona.skinProfile.routine}
                            onChange={(e) =>
                              updatePersonaField(
                                "skinProfile",
                                "routine",
                                e.target.value,
                              )
                            }
                            placeholder="아침/저녁 사용하는 제품 유형 또는 브랜드명"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            스킨케어 지식 수준
                          </Label>
                          <select
                            value={newPersona.skinProfile.knowledgeLevel}
                            onChange={(e) =>
                              updatePersonaField(
                                "skinProfile",
                                "knowledgeLevel",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          >
                            <option value="초급">초급</option>
                            <option value="중급">중급</option>
                            <option value="고급">고급</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          과거의 성공/실패 경험
                        </Label>
                        <textarea
                          value={newPersona.skinProfile.experience}
                          onChange={(e) =>
                            updatePersonaField(
                              "skinProfile",
                              "experience",
                              e.target.value,
                            )
                          }
                          placeholder="예: 티트리 오일은 효과를 봤지만, BHA 토너는 너무 자극적이었어요."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 4: 목표와 과제 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-orange-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-bold flex items-center justify-center">
                        4
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        목표와 과제 (Goals & Challenges)
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          기능적 목표 (원하는 결과)
                        </Label>
                        <Input
                          value={newPersona.goals.functional}
                          onChange={(e) =>
                            updatePersonaField(
                              "goals",
                              "functional",
                              e.target.value,
                            )
                          }
                          placeholder="예: 2주 안에 트러블 진정시키기, 여드름 흉터 옅게 만들기"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          감성적 목표 (원하는 감정)
                        </Label>
                        <Input
                          value={newPersona.goals.emotional}
                          onChange={(e) =>
                            updatePersonaField(
                              "goals",
                              "emotional",
                              e.target.value,
                            )
                          }
                          placeholder="예: 화장 없이도 자신감 갖기, 피부 때문에 스트레스 안 받기"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          가장 큰 불만/어려움 (Pain Point)
                        </Label>
                        <textarea
                          value={newPersona.goals.painPoints}
                          onChange={(e) =>
                            updatePersonaField(
                              "goals",
                              "painPoints",
                              e.target.value,
                            )
                          }
                          placeholder="예: 효과 있다는 제품은 너무 비싸요, 광고만큼 효과가 없어서 실망한 적이 많아요"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 5: 라이프스타일 및 미디어 소비 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-bold flex items-center justify-center">
                        5
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        라이프스타일 및 미디어 소비 (Lifestyle & Media)
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          하루 일과 (A Day in Life)
                        </Label>
                        <textarea
                          value={newPersona.lifestyle.dailyLife}
                          onChange={(e) =>
                            updatePersonaField(
                              "lifestyle",
                              "dailyLife",
                              e.target.value,
                            )
                          }
                          placeholder="아침 기상부터 잠들 때까지의 시간대별 활동을 간략히 서술"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            주로 사용하는 SNS
                          </Label>
                          <div className="space-y-2">
                            {newPersona.lifestyle.sns.map((platform, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={platform}
                                  onChange={(e) =>
                                    updateArrayItem(
                                      "lifestyle",
                                      "sns",
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`${index + 1}순위 SNS`}
                                  className="flex-1"
                                />
                                {newPersona.lifestyle.sns.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      removeArrayItem("lifestyle", "sns", index)
                                    }
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addArrayItem("lifestyle", "sns")}
                              className="text-blue-600 border-blue-300"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              SNS 추가
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            즐겨보는 콘텐츠 유형
                          </Label>
                          <div className="space-y-2">
                            {newPersona.lifestyle.content.map(
                              (contentType, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    value={contentType}
                                    onChange={(e) =>
                                      updateArrayItem(
                                        "lifestyle",
                                        "content",
                                        index,
                                        e.target.value,
                                      )
                                    }
                                    placeholder="콘텐츠 유형"
                                    className="flex-1"
                                  />
                                  {newPersona.lifestyle.content.length > 1 && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        removeArrayItem(
                                          "lifestyle",
                                          "content",
                                          index,
                                        )
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              ),
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addArrayItem("lifestyle", "content")
                              }
                              className="text-blue-600 border-blue-300"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              콘텐츠 유형 추가
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          구매 결정 과정 (Customer Journey)
                        </Label>
                        <textarea
                          value={newPersona.lifestyle.journey}
                          onChange={(e) =>
                            updatePersonaField(
                              "lifestyle",
                              "journey",
                              e.target.value,
                            )
                          }
                          placeholder="예: TikTok에서 인플루언서 영상을 보고 → Shopee에서 검색 → 사용자 리뷰 수백 개 확인 후 → 할인쿠폰 적용하여 구매"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 6: 브랜드 및 가치관 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-purple-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold flex items-center justify-center">
                        6
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        브랜드 및 가치관 (Brand & Values)
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          선호하는 다른 브랜드
                        </Label>
                        <Input
                          value={newPersona.brand.preferences}
                          onChange={(e) =>
                            updatePersonaField(
                              "brand",
                              "preferences",
                              e.target.value,
                            )
                          }
                          placeholder="예: 의류는 Shein, 신발은 Nike - 트렌디하고 가성비 좋은"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          브랜드를 신뢰하게 되는 계기
                        </Label>
                        <Input
                          value={newPersona.brand.trustFactors}
                          onChange={(e) =>
                            updatePersonaField(
                              "brand",
                              "trustFactors",
                              e.target.value,
                            )
                          }
                          placeholder="예: 피부과 테스트 완료, 전문가(약사) 추천, 수많은 긍정적 실사용 후기"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          브랜드에 실망하게 되는 계기
                        </Label>
                        <Input
                          value={newPersona.brand.disappointmentFactors}
                          onChange={(e) =>
                            updatePersonaField(
                              "brand",
                              "disappointmentFactors",
                              e.target.value,
                            )
                          }
                          placeholder="예: 광고와 다른 효과, 피부 트러블 유발, 비싼 가격"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 모달 푸터 */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPersonaModal(false)}
                  className="px-6"
                >
                  취소
                </Button>
                <Button
                  onClick={savePersona}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
