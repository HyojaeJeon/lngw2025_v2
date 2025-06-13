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
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  Tag,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Plus,
  Grid,
  List,
  SortDesc,
  FolderPlus,
  Folder,
} from "lucide-react";

export default function ContentLibraryPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // date, name, type, usage
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contents, setContents] = useState([
    {
      id: 1,
      name: "신제품_론칭_포스터.jpg",
      type: "image",
      size: "2.5MB",
      uploadDate: "2024-06-01",
      uploader: "김디자인",
      tags: ["론칭", "포스터", "신제품"],
      category: "마케팅",
      campaign: "신제품 런칭 캠페인",
      usageHistory: [
        {
          date: "2024-06-01",
          user: "김마케팅",
          platform: "Instagram",
          campaign: "신제품 런칭 캠페인",
        },
        {
          date: "2024-06-03",
          user: "박소셜",
          platform: "Facebook",
          campaign: "신제품 런칭 캠페인",
        },
      ],
      description: "신제품 론칭을 위한 메인 포스터 이미지",
      url: "/uploads/poster1.jpg",
      thumbnail: "/uploads/thumb_poster1.jpg",
    },
    {
      id: 2,
      name: "여름_스킨케어_영상.mp4",
      type: "video",
      size: "15.3MB",
      uploadDate: "2024-05-28",
      uploader: "이영상",
      tags: ["여름", "스킨케어", "튜토리얼"],
      category: "콘텐츠",
      campaign: "여름 스킨케어 프로모션",
      usageHistory: [
        {
          date: "2024-05-30",
          user: "최컨텐츠",
          platform: "YouTube",
          campaign: "여름 스킨케어 프로모션",
        },
      ],
      description: "여름철 스킨케어 루틴 가이드 영상",
      url: "/uploads/summer_skincare.mp4",
      thumbnail: "/uploads/thumb_summer_skincare.jpg",
    },
    {
      id: 3,
      name: "브랜드_가이드라인.pdf",
      type: "document",
      size: "3.2MB",
      uploadDate: "2024-05-25",
      uploader: "박브랜드",
      tags: ["가이드라인", "브랜드", "디자인"],
      category: "브랜드",
      campaign: "브랜드 통합",
      usageHistory: [
        {
          date: "2024-05-26",
          user: "김디자인",
          platform: "내부",
          campaign: "브랜드 통합",
        },
        {
          date: "2024-05-28",
          user: "이마케팅",
          platform: "내부",
          campaign: "브랜드 통합",
        },
      ],
      description: "브랜드 아이덴티티 및 디자인 가이드라인",
      url: "/uploads/brand_guideline.pdf",
      thumbnail: "/uploads/thumb_brand_guideline.jpg",
    },
  ]);
  const [newContent, setNewContent] = useState({
    name: "",
    tags: [""],
    category: "",
    campaign: "",
    description: "",
  });

  const categories = ["all", "마케팅", "콘텐츠", "브랜드", "이벤트", "기타"];
  const allTags = [...new Set(contents.flatMap((content) => content.tags))];
  const campaigns = [...new Set(contents.map((content) => content.campaign))];

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "document":
        return FileText;
      default:
        return FileText;
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "audio":
        return "bg-green-100 text-green-800";
      case "document":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" || content.category === selectedCategory;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => content.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const sortedContents = [...filteredContents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "type":
        return a.type.localeCompare(b.type);
      case "usage":
        return b.usageHistory.length - a.usageHistory.length;
      case "date":
      default:
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const addTag = () => {
    setNewContent((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }));
  };

  const updateTag = (index, value) => {
    setNewContent((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? value : tag)),
    }));
  };

  const removeTag = (index) => {
    setNewContent((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const newContentItem = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("audio/")
              ? "audio"
              : "document",
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        uploader: "현재 사용자",
        tags: newContent.tags.filter((tag) => tag.trim()),
        category: newContent.category || "기타",
        campaign: newContent.campaign || "",
        usageHistory: [],
        description: newContent.description || "",
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
      };
      setContents((prev) => [newContentItem, ...prev]);
    });

    setNewContent({
      name: "",
      tags: [""],
      category: "",
      campaign: "",
      description: "",
    });
    setShowUploadModal(false);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content.url);
    alert("링크가 클립보드에 복사되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                콘텐츠 라이브러리
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                마케팅 콘텐츠를 체계적으로 보관하고 재사용합니다
              </p>
            </div>
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              콘텐츠 업로드
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="콘텐츠, 태그, 설명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "전체 카테고리" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="date">업로드일순</option>
                  <option value="name">이름순</option>
                  <option value="type">파일타입순</option>
                  <option value="usage">사용빈도순</option>
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mt-4">
              <Label className="mb-2 block">태그 필터</Label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      selectedTags.includes(tag)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Controls */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            총 {sortedContents.length}개 콘텐츠
          </div>
        </div>

        {/* Content Grid */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedContents.map((content) => {
              const FileIcon = getFileIcon(content.type);
              return (
                <Card
                  key={content.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-4">
                    {/* Thumbnail */}
                    <div className="aspect-square mb-3 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {content.type === "image" ? (
                        <img
                          src={content.thumbnail}
                          alt={content.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="space-y-2">
                      <h3
                        className="font-medium text-sm truncate"
                        title={content.name}
                      >
                        {content.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span
                          className={`px-2 py-1 rounded ${getFileTypeColor(content.type)}`}
                        >
                          {content.type.toUpperCase()}
                        </span>
                        <span>{content.size}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>업로드: {content.uploadDate}</p>
                        <p>사용: {content.usageHistory.length}회</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {content.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {content.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{content.tags.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-1 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedContent(content)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(content)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Content List */}
        {viewMode === "list" && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        파일명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        타입
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        크기
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        업로드일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용횟수
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        태그
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                    {sortedContents.map((content) => {
                      const FileIcon = getFileIcon(content.type);
                      return (
                        <tr key={content.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              {content.type === "image" ? (
                                <img
                                  src={content.thumbnail}
                                  alt={content.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              ) : (
                                <FileIcon className="w-10 h-10 text-gray-400" />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {content.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {content.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded ${getFileTypeColor(content.type)}`}
                            >
                              {content.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {content.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {content.uploadDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {content.usageHistory.length}회
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {content.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedContent(content)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(content)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>콘텐츠 업로드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-600">
                      파일을 선택하거나 드래그해서 업로드하세요
                    </p>
                    <p className="text-sm text-gray-400">
                      이미지, 비디오, 오디오, 문서 파일 지원
                    </p>
                  </label>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label>카테고리</Label>
                    <select
                      value={newContent.category}
                      onChange={(e) =>
                        setNewContent((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">카테고리 선택</option>
                      {categories
                        .filter((cat) => cat !== "all")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <Label>캠페인</Label>
                    <select
                      value={newContent.campaign}
                      onChange={(e) =>
                        setNewContent((prev) => ({
                          ...prev,
                          campaign: e.target.value,
                        }))
                      }
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">캠페인 선택</option>
                      {campaigns.map((campaign) => (
                        <option key={campaign} value={campaign}>
                          {campaign}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>태그</Label>
                    <Button size="sm" variant="outline" onClick={addTag}>
                      <Plus className="w-3 h-3 mr-1" />
                      태그 추가
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newContent.tags.map((tag, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={tag}
                          onChange={(e) => updateTag(index, e.target.value)}
                          placeholder="태그 입력"
                          className="flex-1"
                        />
                        {newContent.tags.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeTag(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label>설명</Label>
                  <textarea
                    value={newContent.description}
                    onChange={(e) =>
                      setNewContent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="콘텐츠에 대한 설명을 입력하세요"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md h-24 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                  >
                    취소
                  </Button>
                  <label htmlFor="file-upload">
                    <Button>업로드</Button>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Detail Modal */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedContent.name}</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedContent(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Preview */}
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {selectedContent.type === "image" ? (
                        <img
                          src={selectedContent.url}
                          alt={selectedContent.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          {(() => {
                            const FileIcon = getFileIcon(selectedContent.type);
                            return (
                              <FileIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                            );
                          })()}
                          <p className="text-gray-600">
                            {selectedContent.type.toUpperCase()} 파일
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedContent.size}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        다운로드
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(selectedContent)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        링크 복사
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        공유
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="font-semibold mb-3">기본 정보</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">파일명:</span>
                          <span>{selectedContent.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">타입:</span>
                          <span
                            className={`px-2 py-1 rounded ${getFileTypeColor(selectedContent.type)}`}
                          >
                            {selectedContent.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">크기:</span>
                          <span>{selectedContent.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">업로드일:</span>
                          <span>{selectedContent.uploadDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">업로더:</span>
                          <span>{selectedContent.uploader}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">카테고리:</span>
                          <span>{selectedContent.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">캠페인:</span>
                          <span>{selectedContent.campaign}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold mb-2">설명</h3>
                      <p className="text-sm text-gray-600">
                        {selectedContent.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div>
                      <h3 className="font-semibold mb-2">태그</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedContent.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Usage History */}
                    <div>
                      <h3 className="font-semibold mb-3">사용 이력</h3>
                      {selectedContent.usageHistory.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          아직 사용 이력이 없습니다.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {selectedContent.usageHistory.map((usage, index) => (
                            <div
                              key={index}
                              className="text-sm border rounded p-2"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {usage.platform}
                                </span>
                                <span className="text-gray-500">
                                  {usage.date}
                                </span>
                              </div>
                              <div className="text-gray-600">
                                사용자: {usage.user} | 캠페인: {usage.campaign}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
