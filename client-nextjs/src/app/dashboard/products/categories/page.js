"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GET_CATEGORIES, CHECK_CATEGORY_CODE } from "@/lib/graphql/categoryQueries.js";
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from "@/lib/graphql/categoryMutations.js";
import { LoadingModal } from "@/components/ui/LoadingModal.js";
import debounce from 'lodash.debounce';

const CategoryForm = ({ category, onSave, onCancel, isOpen }) => {
  const { t, currentLanguage } = useTranslation();
  const [formData, setFormData] = useState({
    code: "",
    names: { ko: "", vi: "", en: "" },
    descriptions: { ko: "", vi: "", en: "" },
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [codeCheckResult, setCodeCheckResult] = useState(null);
  const [isCheckingCode, setIsCheckingCode] = useState(false);

  const [createCategory, { loading: createLoading }] = useMutation(CREATE_CATEGORY);
  const [updateCategory, { loading: updateLoading }] = useMutation(UPDATE_CATEGORY);
  const [checkCategoryCode] = useLazyQuery(CHECK_CATEGORY_CODE);

  const loading = createLoading || updateLoading;

  useEffect(() => {
    if (category) {
      setFormData({
        code: category.code || "",
        names: category.names || { ko: "", vi: "", en: "" },
        descriptions: category.descriptions || { ko: "", vi: "", en: "" },
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
    } else {
      setFormData({
        code: "",
        names: { ko: "", vi: "", en: "" },
        descriptions: { ko: "", vi: "", en: "" },
        isActive: true,
      });
    }
    setErrors({});
    setCodeCheckResult(null);
  }, [category, isOpen]);

  const debouncedCodeCheck = useMemo(
    () => debounce(async (code) => {
      if (!code || code.trim().length === 0) {
        setCodeCheckResult(null);
        setIsCheckingCode(false);
        return;
      }

      if (category && code === category.code) {
        setCodeCheckResult(null);
        setIsCheckingCode(false);
        return;
      }

      try {
        const { data } = await checkCategoryCode({
          variables: { code: code.trim().toUpperCase() }
        });

        if (data?.checkCategoryCode) {
          setCodeCheckResult(data.checkCategoryCode);
        }
      } catch (error) {
        console.error('코드 중복 검사 오류:', error);
        setCodeCheckResult({
          isAvailable: false,
          message: t('products.categories.codeCheckError')
        });
      }
      setIsCheckingCode(false);
    }, 500),
    [category, checkCategoryCode, t]
  );

  const handleCodeChange = (value) => {
    const upperValue = value.toUpperCase();
    setFormData(prev => ({ ...prev, code: upperValue }));
    
    if (!category || upperValue !== category.code) {
      setIsCheckingCode(true);
      debouncedCodeCheck(upperValue);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = t('products.categories.codeRequired');
    }

    if (!formData.names.ko.trim()) {
      newErrors.nameKo = t('products.categories.nameKoRequired');
    }

    if (!formData.names.vi.trim()) {
      newErrors.nameVi = t('products.categories.nameViRequired');
    }

    if (codeCheckResult && !codeCheckResult.isAvailable) {
      newErrors.code = codeCheckResult.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const input = {
        code: formData.code.trim().toUpperCase(),
        names: {
          ko: formData.names.ko.trim(),
          vi: formData.names.vi.trim(),
          en: formData.names.en.trim() || formData.names.ko.trim()
        },
        descriptions: {
          ko: formData.descriptions.ko.trim() || null,
          vi: formData.descriptions.vi.trim() || null,
          en: formData.descriptions.en.trim() || null
        },
        isActive: formData.isActive
      };

      if (category) {
        await updateCategory({
          variables: { id: category.id, input },
          refetchQueries: [{ query: GET_CATEGORIES }]
        });
      } else {
        await createCategory({
          variables: { input },
          refetchQueries: [{ query: GET_CATEGORIES }]
        });
      }

      onSave();
    } catch (error) {
      console.error('카테고리 저장 오류:', error);
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        alert(`${t('common.error')}: ${error.graphQLErrors[0].message}`);
      } else {
        alert(t('products.categories.saveError'));
      }
    }
  };

  const handleNameChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      names: { ...prev.names, [lang]: value },
    }));
  };

  const handleDescriptionChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      descriptions: { ...prev.descriptions, [lang]: value },
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {loading && <LoadingModal message={t('products.categories.saving')} />}
      
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {category ? t('products.categories.edit') : t('products.categories.add')}
              </h2>
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 카테고리 코드 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t('products.categories.code')} <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="예: FILLER, BOTOX"
                className={errors.code ? 'border-red-500' : ''}
                maxLength={50}
              />
              {isCheckingCode && (
                <p className="text-sm text-blue-600 mt-1">{t('products.categories.checkingCode')}</p>
              )}
              {codeCheckResult && (
                <p className={`text-sm mt-1 ${codeCheckResult.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {codeCheckResult.message}
                </p>
              )}
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>

            {/* 다국어 이름 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('products.categories.categoryNames')}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('products.categories.nameKo')} <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.names.ko}
                  onChange={(e) => handleNameChange("ko", e.target.value)}
                  placeholder="한국어 카테고리 이름"
                  className={errors.nameKo ? 'border-red-500' : ''}
                />
                {errors.nameKo && <p className="text-red-500 text-sm mt-1">{errors.nameKo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('products.categories.nameVi')} <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.names.vi}
                  onChange={(e) => handleNameChange("vi", e.target.value)}
                  placeholder="Tên danh mục tiếng Việt"
                  className={errors.nameVi ? 'border-red-500' : ''}
                />
                {errors.nameVi && <p className="text-red-500 text-sm mt-1">{errors.nameVi}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('products.categories.nameEnOptional')}
                </label>
                <Input
                  value={formData.names.en}
                  onChange={(e) => handleNameChange("en", e.target.value)}
                  placeholder="English category name"
                />
              </div>
            </div>

            {/* 다국어 설명 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('products.categories.descriptionsOptional')}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('products.categories.descriptionKo')}
                </label>
                <textarea
                  value={formData.descriptions.ko}
                  onChange={(e) => handleDescriptionChange("ko", e.target.value)}
                  placeholder="한국어 설명"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('products.categories.descriptionVi')}
                </label>
                <textarea
                  value={formData.descriptions.vi}
                  onChange={(e) => handleDescriptionChange("vi", e.target.value)}
                  placeholder="Mô tả tiếng Việt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('products.categories.descriptionEn')}
                </label>
                <textarea
                  value={formData.descriptions.en}
                  onChange={(e) => handleDescriptionChange("en", e.target.value)}
                  placeholder="English description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                />
              </div>
            </div>

            {/* 활성 상태 */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('products.categories.isActive')}
              </label>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={loading}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading || (codeCheckResult && !codeCheckResult.isAvailable)}
              >
                {category ? t('common.edit') : t('common.add')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default function ProductCategoriesPage() {
  const { t, currentLanguage } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "sortOrder", direction: "asc" });

  const { data, loading, error, refetch } = useQuery(GET_CATEGORIES);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const categories = data?.categories || [];

  // 필터링된 카테고리
  const filteredCategories = useMemo(() => {
    let filtered = categories;

    if (searchKeyword) {
      filtered = filtered.filter(
        (category) =>
          category.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          category.names.ko.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          category.names.vi.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          category.names.en.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "name") {
        aValue = a.names[currentLanguage] || a.names.ko;
        bValue = b.names[currentLanguage] || b.names.ko;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [categories, searchKeyword, sortConfig, currentLanguage]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm(t('products.categories.confirmDelete'))) {
      try {
        await deleteCategory({
          variables: { id: categoryId },
          refetchQueries: [{ query: GET_CATEGORIES }]
        });
      } catch (error) {
        console.error('카테고리 삭제 오류:', error);
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          alert(`${t('common.error')}: ${error.graphQLErrors[0].message}`);
        } else {
          alert(t('products.categories.deleteError'));
        }
      }
    }
  };

  const handleSaveCategory = () => {
    setShowForm(false);
    setEditingCategory(null);
    refetch();
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
        {isActive ? t('products.active') : t('products.inactive')}
      </span>
    );
  };

  if (loading) return <div className="p-6">{t('common.loading')}</div>;
  if (error) return <div className="p-6">{t('common.error')}: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('products.categories.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('products.categories.subtitle')}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + {t('products.categories.add')}
        </Button>
      </div>

      {/* 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('products.categories.searchFilter')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('common.search')}</label>
              <Input
                placeholder={t('products.categories.searchPlaceholder')}
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
                {t('common.clear')} {t('common.filter')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('products.categories.title')} ({filteredCategories.length}{t('common.count')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('code')}
                  >
                    {t('products.categories.code')} {getSortIcon('code')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    {t('products.name')} {getSortIcon('name')}
                  </th>
                  <th className="text-left p-3 font-semibold">{t('products.description')}</th>
                  <th className="text-left p-3 font-semibold">{t('products.status')}</th>
                  <th className="text-left p-3 font-semibold">{t('products.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-mono text-sm">{category.code}</td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {category.names[currentLanguage] || category.names.ko}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {category.descriptions[currentLanguage] || category.descriptions.ko || '-'}
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(category.isActive)}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          {t('common.edit')}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          {t('common.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCategories.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('products.noProducts')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Form Modal */}
      <CategoryForm
        category={editingCategory}
        onSave={handleSaveCategory}
        onCancel={handleCancelForm}
        isOpen={showForm}
      />
    </div>
  );
}
