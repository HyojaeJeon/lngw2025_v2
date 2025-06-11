
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useTranslation, useLocaleFormat } from "@/hooks/useLanguage.js";
import { useDebounce } from "@/hooks/useDebounce.js";
import ProductAddModal from "@/components/products/ProductAddModal.js";
import CustomCategorySelect from "@/components/common/CustomCategorySelect.js";
import { GET_CATEGORIES } from "@/lib/graphql/categoryQueries.js";

// Mock data for demonstration - 실제 환경에서는 GraphQL 쿼리로 대체
const mockProducts = [
  {
    id: 1,
    name: "ERP 시스템",
    code: "ERP-001",
    categoryId: 1,
    category: "IT솔루션",
    modelName: "Enterprise ERP Pro",
    price: 1200000000,
    consumerPrice: 1350000000,
    cost: 720000000,
    currentStock: 50,
    soldQuantity: 25,
    sampleQuantity: 5,
    defectiveQuantity: 2,
    status: "active",
    description: "통합 전사관리 시스템",
    specifications: "Web 기반, 다국어 지원",
    modelsCount: 3
  },
  {
    id: 2,
    name: "CRM 시스템",
    code: "CRM-001",
    categoryId: 1,
    category: "IT솔루션",
    modelName: "Customer Pro CRM",
    price: 600000000,
    consumerPrice: 750000000,
    cost: 360000000,
    currentStock: 30,
    soldQuantity: 15,
    sampleQuantity: 3,
    defectiveQuantity: 1,
    status: "active",
    description: "고객관계관리 시스템",
    specifications: "클라우드 기반, 모바일 지원",
    modelsCount: 2
  },
  {
    id: 3,
    name: "Office Suite",
    code: "OFF-001",
    categoryId: 2,
    category: "소프트웨어",
    modelName: "Office Professional 2024",
    price: 300000000,
    consumerPrice: 350000000,
    cost: 180000000,
    currentStock: 100,
    soldQuantity: 80,
    sampleQuantity: 10,
    defectiveQuantity: 3,
    status: "active",
    description: "오피스 통합 소프트웨어",
    specifications: "Windows/Mac 지원",
    modelsCount: 1
  }
];

export default function ProductsPage() {
  const { t } = useTranslation();
  const { formatCurrency, formatNumber } = useLocaleFormat();
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 디바운스된 검색어 (500ms 지연)
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  // Filter and search functionality
  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === parseInt(selectedCategory));
    }

    if (debouncedSearchKeyword) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
        product.code.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
        product.modelName.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchKeyword.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, debouncedSearchKeyword]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredProducts(sorted);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm(t('products.confirmDelete') || '정말로 이 제품을 삭제하시겠습니까?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
      ));
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: Math.max(...products.map(p => p.id), 0) + 1
      };
      setProducts([...products, newProduct]);
    }
    
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: t('products.active') || '활성', className: 'bg-green-100 text-green-800' },
      inactive: { label: t('products.inactive') || '비활성', className: 'bg-gray-100 text-gray-800' },
      discontinued: { label: t('products.discontinued') || '단종', className: 'bg-red-100 text-red-800' }
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('products.title') || '제품 관리'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('products.subtitle') || '제품 정보를 관리하고 재고를 추적하세요'}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + {t('products.addNew') || '제품 추가'}
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.filter') || '필터'} 및 {t('common.search') || '검색'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('products.category') || '카테고리'}
              </label>
              <CustomCategorySelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder={t('products.filterByCategory') || '카테고리로 필터링'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('common.search') || '검색'}
              </label>
              <Input
                placeholder={t('products.searchPlaceholder') || '제품명, 모델명, 코드로 검색...'}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("");
                  setSearchKeyword("");
                }}
                className="w-full"
              >
                {t('common.clear') || '초기화'} {t('common.filter') || '필터'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 제품 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('products.list') || '제품 목록'} ({filteredProducts.length}{t('common.count') || '개'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    {t('products.name') || '제품명'} {getSortIcon('name')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('modelName')}
                  >
                    {t('products.modelName') || '모델명'} {getSortIcon('modelName')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('code')}
                  >
                    {t('products.sku') || '제품코드'} {getSortIcon('code')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('category')}
                  >
                    {t('products.category') || '카테고리'} {getSortIcon('category')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('price')}
                  >
                    {t('products.price') || '가격'} {getSortIcon('price')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('currentStock')}
                  >
                    {t('products.stock') || '재고'} {getSortIcon('currentStock')}
                  </th>
                  <th className="text-left p-3 font-semibold">{t('products.status') || '상태'}</th>
                  <th className="text-left p-3 font-semibold">{t('products.models') || '모델 수'}</th>
                  <th className="text-left p-3 font-semibold">{t('products.actions') || '작업'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{product.description}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900 dark:text-white">{product.modelName}</div>
                    </td>
                    <td className="p-3 font-mono text-sm">{product.code}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div className="font-medium">{formatCurrency(product.price, 'KRW')}</div>
                        <div className="text-gray-500">{t('products.consumerPrice') || '소비자가'}: {formatCurrency(product.consumerPrice, 'KRW')}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div className="font-medium">{formatNumber(product.currentStock)}{t('common.count') || '개'}</div>
                        <div className="text-gray-500">{t('products.sold') || '판매'}: {formatNumber(product.soldQuantity)}{t('common.count') || '개'}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="p-3">
                      <span className="font-medium">{product.modelsCount}{t('common.count') || '개'}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          {t('common.edit') || '수정'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          {t('common.delete') || '삭제'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('products.noProducts') || '제품이 없습니다'}
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
                  <span className="text-blue-600 font-semibold">📦</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('common.total') || '전체'} {t('products.list') || '제품'}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</div>
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
                  {t('products.active') || '활성'} {t('products.list') || '제품'}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.filter(p => p.status === 'active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('common.total') || '전체'} {t('products.stock') || '재고'}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(products.reduce((sum, p) => sum + p.currentStock, 0))}
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
                  <span className="text-purple-600 font-semibold">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('common.total') || '전체'} {t('products.soldQuantity') || '판매량'}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(products.reduce((sum, p) => sum + p.soldQuantity, 0))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Add Modal */}
      <ProductAddModal
        isOpen={showAddForm}
        onClose={handleCancelForm}
        onSuccess={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
}
