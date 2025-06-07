
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
  Save,
  Upload,
  Download,
  History,
  Palette,
  Type,
  Image,
  FileText,
  Edit3,
  Eye,
  Plus,
  Trash2,
  RefreshCw,
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
  const [activeTab, setActiveTab] = useState("mission");

  const handleBrandDataChange = (field, value) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const addValue = () => {
    setBrandData(prev => ({
      ...prev,
      values: [...prev.values, ""]
    }));
  };

  const updateValue = (index, value) => {
    setBrandData(prev => ({
      ...prev,
      values: prev.values.map((v, i) => i === index ? value : v)
    }));
  };

  const removeValue = (index) => {
    setBrandData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const addColor = () => {
    setColorPalette(prev => [
      ...prev,
      { name: "", color: "#000000", description: "" }
    ]);
  };

  const updateColor = (index, field, value) => {
    setColorPalette(prev => prev.map((color, i) => 
      i === index ? { ...color, [field]: value } : color
    ));
  };

  const removeColor = (index) => {
    setColorPalette(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (type, event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));

    if (type === "logo") {
      setLogos(prev => [...prev, ...newFiles]);
    } else if (type === "guideline") {
      setGuidelines(prev => [...prev, ...newFiles]);
    }
  };

  const saveBrandData = () => {
    const historyEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      changes: "브랜드 정보 업데이트",
      user: "현재 사용자",
      data: { ...brandData, colorPalette: [...colorPalette] }
    };
    setHistory(prev => [historyEntry, ...prev]);
    alert("브랜드 전략이 저장되었습니다.");
  };

  const tabs = [
    { id: "mission", label: "미션/비전/가치", icon: FileText },
    { id: "assets", label: "브랜드 자산", icon: Palette },
    { id: "guidelines", label: "가이드라인", icon: Upload },
    { id: "history", label: "변경 이력", icon: History },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            브랜드 전략 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Neul20's 브랜드 아이덴티티와 핵심 메시지를 관리합니다
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

        {/* Tab Content */}
        {activeTab === "mission" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mission & Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit3 className="w-5 h-5" />
                  <span>미션 & 비전</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="mission">미션</Label>
                  <textarea
                    id="mission"
                    value={brandData.mission}
                    onChange={(e) => handleBrandDataChange("mission", e.target.value)}
                    placeholder="우리의 사명과 존재 이유를 입력하세요"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md h-24 resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="vision">비전</Label>
                  <textarea
                    id="vision"
                    value={brandData.vision}
                    onChange={(e) => handleBrandDataChange("vision", e.target.value)}
                    placeholder="우리가 꿈꾸는 미래를 입력하세요"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md h-24 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Core Values */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>핵심 가치</span>
                  </div>
                  <Button size="sm" onClick={addValue}>
                    <Plus className="w-4 h-4 mr-1" />
                    추가
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {brandData.values.map((value, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={value}
                        onChange={(e) => updateValue(index, e.target.value)}
                        placeholder={`핵심 가치 ${index + 1}`}
                        className="flex-1"
                      />
                      {brandData.values.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeValue(index)}
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
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>슬로건 & 브랜드 스토리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="slogan">슬로건</Label>
                  <Input
                    id="slogan"
                    value={brandData.slogan}
                    onChange={(e) => handleBrandDataChange("slogan", e.target.value)}
                    placeholder="브랜드를 대표하는 슬로건을 입력하세요"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="story">브랜드 스토리</Label>
                  <textarea
                    id="story"
                    value={brandData.story}
                    onChange={(e) => handleBrandDataChange("story", e.target.value)}
                    placeholder="브랜드의 탄생 배경과 스토리를 입력하세요"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md h-32 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "assets" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Color Palette */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>컬러 팔레트</span>
                  </div>
                  <Button size="sm" onClick={addColor}>
                    <Plus className="w-4 h-4 mr-1" />
                    추가
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {colorPalette.map((color, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div
                        className="w-12 h-12 rounded-md border"
                        style={{ backgroundColor: color.color }}
                      />
                      <div className="flex-1 space-y-2">
                        <Input
                          value={color.name}
                          onChange={(e) => updateColor(index, "name", e.target.value)}
                          placeholder="컬러 이름"
                          className="text-sm"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={color.color}
                            onChange={(e) => updateColor(index, "color", e.target.value)}
                            className="w-16 h-8 rounded border"
                          />
                          <Input
                            value={color.description}
                            onChange={(e) => updateColor(index, "description", e.target.value)}
                            placeholder="설명"
                            className="flex-1 text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeColor(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Logo Library */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Image className="w-5 h-5" />
                  <span>로고 라이브러리</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload("logo", e)}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">로고 파일을 업로드하세요</p>
                      <p className="text-xs text-gray-400">PNG, JPG, SVG 지원</p>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {logos.map((logo) => (
                      <div key={logo.id} className="border rounded-lg p-3">
                        <img
                          src={logo.url}
                          alt={logo.name}
                          className="w-full h-20 object-contain mb-2"
                        />
                        <p className="text-xs text-gray-600 truncate">{logo.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "guidelines" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>브랜드 가이드라인</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => handleFileUpload("guideline", e)}
                    className="hidden"
                    id="guideline-upload"
                  />
                  <label htmlFor="guideline-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-600">가이드라인 문서를 업로드하세요</p>
                    <p className="text-sm text-gray-400">PDF, DOC, DOCX 파일 지원</p>
                  </label>
                </div>

                {guidelines.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">업로드된 가이드라인</h3>
                    {guidelines.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(file.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            미리보기
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>변경 이력</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  아직 변경 이력이 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="border-l-4 border-blue-500 pl-4 py-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{entry.changes}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">변경자: {entry.user}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={saveBrandData} className="px-8">
            <Save className="w-4 h-4 mr-2" />
            변경사항 저장
          </Button>
        </div>
      </div>
    </div>
  );
}
