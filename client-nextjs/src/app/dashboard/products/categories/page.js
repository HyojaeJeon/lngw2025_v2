"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useLanguage } from "@/contexts/languageContext.js";

// 기본 카테고리 데이터 (다국어 지원)
const mockCategories = [
  {
    id: 1,
    code: "FILLER",
    names: {
      ko: "필러",
      vi: "Filler",
      en: "Filler",
    },
    descriptions: {
      ko: "주름 개선 및 볼륨 증대용 필러",
      vi: "Filler để cải thiện nếp nhăn và tăng thể tích",
      en: "Fillers for wrinkle improvement and volume enhancement",
    },
    parentId: null,
    level: 1,
    sortOrder: 1,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    code: "BOTOX",
    names: {
      ko: "보톡스",
      vi: "Botox",
      en: "Botox",
    },
    descriptions: {
      ko: "근육 이완을 통한 주름 개선",
      vi: "Cải thiện nếp nhăn thông qua thư giãn cơ",
      en: "Wrinkle improvement through muscle relaxation",
    },
    parentId: null,
    level: 1,
    sortOrder: 2,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: 3,
    code: "LIFTING",
    names: {
      ko: "리프팅실",
      vi: "Chỉ nâng cơ",
      en: "Lifting Thread",
    },
    descriptions: {
      ko: "얼굴 라인 개선용 리프팅 실",
      vi: "Chỉ nâng cơ để cải thiện đường nét khuôn mặt",
      en: "Lifting threads for facial line improvement",
    },
    parentId: null,
    level: 1,
    sortOrder: 3,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: 4,
    code: "SKINBOOSTER",
    names: {
      ko: "스킨부스터",
      vi: "Skin Booster",
      en: "Skin Booster",
    },
    descriptions: {
      ko: "피부 수분 공급 및 탄력 개선",
      vi: "Cung cấp độ ẩm và cải thiện độ đàn hồi da",
      en: "Skin hydration and elasticity improvement",
    },
    parentId: null,
    level: 1,
    sortOrder: 4,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: 5,
    code: "FILLER_HA",
    names: {
      ko: "히알루론산 필러",
      vi: "Filler Hyaluronic Acid",
      en: "Hyaluronic Acid Filler",
    },
    descriptions: {
      ko: "히알루론산 기반 필러",
      vi: "Filler dựa trên axit hyaluronic",
      en: "Hyaluronic acid based filler",
    },
    parentId: 1,
    level: 2,
    sortOrder: 1,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: 6,
    code: "FILLER_PLLA",
    names: {
      ko: "PLLA 필러",
      vi: "Filler PLLA",
      en: "PLLA Filler",
    },
    descriptions: {
      ko: "폴리락틱산 기반 필러",
      vi: "Filler dựa trên axit polylactic",
      en: "Poly-L-lactic acid based filler",
    },
    parentId: 1,
    level: 2,
    sortOrder: 2,
    isActive: true,
    createdAt: "2024-01-01",
  },
];

const CategoryForm = ({ category, onSave, onCancel, isOpen, categories }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    code: "",
    names: { ko: "", vi: "", en: "" },
    descriptions: { ko: "", vi: "", en: "" },
    parentId: null,
    sortOrder: 1,
    isActive: true,
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        code: "",
        names: { ko: "", vi: "", en: "" },
        descriptions: { ko: "", vi: "", en: "" },
        parentId: null,
        sortOrder: 1,
        isActive: true,
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.code || !formData.names.ko) {
      alert("카테고리 코드와 한국어 이름은 필수입니다.");
      return;
    }

    const categoryData = {
      ...formData,
      id: category ? category.id : Date.now(),
      level: formData.parentId ? 2 : 1,
      createdAt: category
        ? category.createdAt
        : new Date().toISOString().split("T")[0],
    };

    onSave(categoryData);
  };

  const handleNameChange = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      names: { ...prev.names, [lang]: value },
    }));
  };

  const handleDescriptionChange = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      descriptions: { ...prev.descriptions, [lang]: value },
    }));
  };

  if (!isOpen) return null;

  const parentCategories = categories.filter((cat) => cat.level === 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {category ? "카테고리 수정" : "카테고리 추가"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              카테고리 코드 *
            </label>
            <Input
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code: e.target.value.toUpperCase(),
                }))
              }
              placeholder="예: FILLER, BOTOX"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              상위 카테고리
            </label>
            <select
              value={formData.parentId || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parentId: e.target.value ? parseInt(e.target.value) : null,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">상위 카테고리 (최상위)</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.names[language] || cat.names.ko}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                한국어 이름 *
              </label>
              <Input
                value={formData.names.ko}
                onChange={(e) => handleNameChange("ko", e.target.value)}
                placeholder="한국어 카테고리 이름"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                베트남어 이름
              </label>
              <Input
                value={formData.names.vi}
                onChange={(e) => handleNameChange("vi", e.target.value)}
                placeholder="Tên danh mục tiếng Việt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                영어 이름
              </label>
              <Input
                value={formData.names.en}
                onChange={(e) => handleNameChange("en", e.target.value)}
                placeholder="English category name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                한국어 설명
              </label>
              <textarea
                value={formData.descriptions.ko}
                onChange={(e) => handleDescriptionChange("ko", e.target.value)}
                placeholder="한국어 설명"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                베트남어 설명
              </label>
              <textarea
                value={formData.descriptions.vi}
                onChange={(e) => handleDescriptionChange("vi", e.target.value)}
                placeholder="Mô tả tiếng Việt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                영어 설명
              </label>
              <textarea
                value={formData.descriptions.en}
                onChange={(e) => handleDescriptionChange("en", e.target.value)}
                placeholder="English description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                정렬 순서
              </label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sortOrder: parseInt(e.target.value),
                  }))
                }
                min="1"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                활성
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {category ? "수정" : "추가"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ProductCategoriesPage() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState(mockCategories);
  const [filteredCategories, setFilteredCategories] = useState(mockCategories);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "sortOrder",
    direction: "asc",
  });

  // 필터링 및 검색
  useEffect(() => {
    let filtered = categories;

    if (searchKeyword) {
      filtered = filtered.filter(
        (category) =>
          category.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          category.names.ko
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          category.names.vi
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          category.names.en.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    }

    setFilteredCategories(filtered);
  }, [categories, searchKeyword]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCategories].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === "name") {
        aValue = a.names[language] || a.names.ko;
        bValue = b.names[language] || b.names.ko;
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCategories(sorted);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("정말로 이 카테고리를 삭제하시겠습니까?")) {
      setCategories(categories.filter((c) => c.id !== categoryId));
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      setCategories(
        categories.map((c) => (c.id === editingCategory.id ? categoryData : c)),
      );
    } else {
      setCategories([...categories, categoryData]);
    }

    setShowForm(false);
    setEditingCategory(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↕";
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {isActive ? "활성" : "비활성"}
      </span>
    );
  };

  const getLevelBadge = (level) => {
    const levelColors = {
      1: "bg-blue-100 text-blue-800",
      2: "bg-purple-100 text-purple-800",
      3: "bg-orange-100 text-orange-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[level] || "bg-gray-100 text-gray-800"}`}
      >
        {level}단계
      </span>
    );
  };

  const getParentName = (parentId) => {
    if (!parentId) return "-";
    const parent = categories.find((c) => c.id === parentId);
    return parent ? parent.names[language] || parent.names.ko : "-";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            카테고리 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            제품 카테고리를 등록하고 관리합니다.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + 카테고리 추가
        </Button>
      </div>

      {/* 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">검색</label>
              <Input
                placeholder="카테고리 코드, 이름으로 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setSearchKeyword("")}
                className="w-full"
              >
                검색 초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>카테고리 목록 ({filteredCategories.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort("code")}
                  >
                    코드 {getSortIcon("code")}
                  </th>
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort("name")}
                  >
                    이름 {getSortIcon("name")}
                  </th>
                  <th className="text-left p-3 font-semibold">설명</th>
                  <th className="text-left p-3 font-semibold">상위 카테고리</th>
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort("level")}
                  >
                    레벨 {getSortIcon("level")}
                  </th>
                  <th
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort("sortOrder")}
                  >
                    정렬순서 {getSortIcon("sortOrder")}
                  </th>
                  <th className="text-left p-3 font-semibold">상태</th>
                  <th className="text-left p-3 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3 font-mono text-sm">{category.code}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {category.names[language] || category.names.ko}
                        </div>
                        {language !== "ko" && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {category.names.ko}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {category.descriptions[language] ||
                          category.descriptions.ko}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm">
                        {getParentName(category.parentId)}
                      </span>
                    </td>
                    <td className="p-3">{getLevelBadge(category.level)}</td>
                    <td className="p-3 text-center">{category.sortOrder}</td>
                    <td className="p-3">{getStatusBadge(category.isActive)}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCategories.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                검색 조건에 맞는 카테고리가 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">📁</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  총 카테고리
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categories.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  활성 카테고리
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categories.filter((c) => c.isActive).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">🏷️</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  1단계 카테고리
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categories.filter((c) => c.level === 1).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">📂</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  2단계 카테고리
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categories.filter((c) => c.level === 2).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        category={editingCategory}
        onSave={handleSaveCategory}
        onCancel={handleCancelForm}
        isOpen={showForm}
        categories={categories}
      />
    </div>
  );
}
