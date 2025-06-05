
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";

const mockCategories = [
  { id: 1, name: "IT솔루션", code: "IT" },
  { id: 2, name: "소프트웨어", code: "SW" },
  { id: 3, name: "하드웨어", code: "HW" },
  { id: 4, name: "컨설팅", code: "CS" },
  { id: 5, name: "교육", code: "ED" },
];

export function ProductForm({ product, onSave, onCancel, isOpen }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    categoryId: '',
    category: '',
    price: 0,
    consumerPrice: 0,
    cost: 0,
    description: '',
    specifications: '',
    currentStock: 0,
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        categoryId: product.categoryId || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        categoryId: '',
        category: '',
        price: 0,
        consumerPrice: 0,
        cost: 0,
        description: '',
        specifications: '',
        currentStock: 0,
        status: 'active'
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categoryId') {
      const selectedCategory = mockCategories.find(cat => cat.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        categoryId: value,
        category: selectedCategory?.name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('price') || name.includes('cost') || name.includes('Stock') 
          ? parseFloat(value) || 0 
          : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '제품명을 입력해주세요.';
    }

    if (!formData.code.trim()) {
      newErrors.code = '제품코드를 입력해주세요.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = '카테고리를 선택해주세요.';
    }

    if (formData.price <= 0) {
      newErrors.price = '판매가를 올바르게 입력해주세요.';
    }

    if (formData.consumerPrice <= 0) {
      newErrors.consumerPrice = '소비자가를 올바르게 입력해주세요.';
    }

    if (formData.cost <= 0) {
      newErrors.cost = '원가를 올바르게 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submissionData = {
        ...formData,
        id: product?.id || Date.now(), // Use existing ID or generate new one
        modelsCount: product?.modelsCount || 0,
        soldQuantity: product?.soldQuantity || 0,
        sampleQuantity: product?.sampleQuantity || 0,
        defectiveQuantity: product?.defectiveQuantity || 0,
      };
      
      onSave(submissionData);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-none shadow-none">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                {product ? '제품 수정' : '신제품 등록'}
              </CardTitle>
              <Button variant="ghost" onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    제품명 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="제품명을 입력하세요"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    제품코드 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="제품코드를 입력하세요 (예: PRD-001)"
                    className={errors.code ? 'border-red-500' : ''}
                  />
                  {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    카테고리 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">카테고리를 선택하세요</option>
                    {mockCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">상태</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="discontinued">단종</option>
                  </select>
                </div>
              </div>

              {/* 가격 정보 */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">가격 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      판매가 (VND) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {formData.price > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.price)}</p>
                    )}
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      소비자가 (VND) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="consumerPrice"
                      value={formData.consumerPrice}
                      onChange={handleChange}
                      placeholder="0"
                      className={errors.consumerPrice ? 'border-red-500' : ''}
                    />
                    {formData.consumerPrice > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.consumerPrice)}</p>
                    )}
                    {errors.consumerPrice && <p className="text-red-500 text-xs mt-1">{errors.consumerPrice}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      원가 (VND) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      placeholder="0"
                      className={errors.cost ? 'border-red-500' : ''}
                    />
                    {formData.cost > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.cost)}</p>
                    )}
                    {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
                  </div>
                </div>

                {/* 마진 정보 표시 */}
                {formData.price > 0 && formData.cost > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">마진: </span>
                        <span className="font-medium">{formatCurrency(formData.price - formData.cost)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">마진율: </span>
                        <span className="font-medium">
                          {(((formData.price - formData.cost) / formData.price) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 재고 정보 */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">재고 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">현재 재고</label>
                    <Input
                      type="number"
                      name="currentStock"
                      value={formData.currentStock}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">상세 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">제품 설명</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="제품에 대한 간략한 설명을 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">제품 사양</label>
                    <textarea
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleChange}
                      rows={3}
                      placeholder="제품의 상세 사양을 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  취소
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {product ? '수정하기' : '등록하기'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
