"use client";

import React, { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useTranslation, useLocaleFormat } from "@/hooks/useLanguage.js";
import ProductAddModal from "@/components/products/ProductAddModal.js";

// Mock data for demonstration
const mockCategories = [
  { id: 1, name: "IT솔루션", code: "IT", level: 1, parentId: null },
  { id: 2, name: "소프트웨어", code: "SW", level: 1, parentId: null },
  { id: 3, name: "하드웨어", code: "HW", level: 1, parentId: null },
  { id: 4, name: "컨설팅", code: "CS", level: 1, parentId: null },
  { id: 5, name: "교육", code: "ED", level: 1, parentId: null },
];

const mockProducts = [
  {
    id: 1,
    name: "ERP 시스템",
    code: "ERP-001",
    categoryId: 1,
    category: "IT솔루션",
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

  // Filter and search functionality
  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === parseInt(selectedCategory));
    }

    if (searchKeyword) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        product.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        product.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchKeyword]);

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
        p.id === editingProduct.id ? productData : p
      ));
    } else {
      // Add new product
      setProducts([...products, productData]);
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
      active: { label: t('products.active'), className: 'bg-green-100 text-green-800' },
      inactive: { label: t('products.inactive'), className: 'bg-gray-100 text-gray-800' },
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
            {t('products.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('products.subtitle')}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + {t('products.addNew')}
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.filter')} 및 {t('common.search')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('products.category')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('products.filterByCategory')}</option>
                {mockCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('common.search')}
              </label>
              <Input
                placeholder={t('products.searchPlaceholder')}
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
                {t('common.clear')} {t('common.filter')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 제품 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('products.list')} ({filteredProducts.length}{t('common.count')})
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
                    {t('products.name')} {getSortIcon('name')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('code')}
                  >
                    {t('products.sku')} {getSortIcon('code')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('category')}
                  >
                    {t('products.category')} {getSortIcon('category')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('price')}
                  >
                    {t('products.price')} {getSortIcon('price')}
                  </th>
                  <th 
                    className="text-left p-3 font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('currentStock')}
                  >
                    {t('products.stock')} {getSortIcon('currentStock')}
                  </th>
                  <th className="text-left p-3 font-semibold">{t('products.status')}</th>
                  <th className="text-left p-3 font-semibold">{t('products.models') || '모델 수'}</th>
                  <th className="text-left p-3 font-semibold">{t('products.actions')}</th>
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
                        <div className="font-medium">{formatNumber(product.currentStock)}{t('common.count')}</div>
                        <div className="text-gray-500">{t('products.sold') || '판매'}: {formatNumber(product.soldQuantity)}{t('common.count')}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="p-3">
                      <span className="font-medium">{product.modelsCount}{t('common.count')}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          {t('common.edit')}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('products.noProducts')}
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
                  {t('common.total')} {t('products.list')}
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
                  {t('products.active')} {t('products.list')}
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
                  {t('common.total')} {t('products.stock')}
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
                  {t('common.total')} {t('products.soldQuantity') || '판매량'}
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
      />
    </div>
  );
}
