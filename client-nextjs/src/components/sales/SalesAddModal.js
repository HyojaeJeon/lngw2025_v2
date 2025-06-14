
"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import { 
  GET_SALES_REPS, 
  GET_CUSTOMERS_FOR_SALES,
  GET_PRODUCTS_FOR_SALES,
  GET_SALES_CATEGORIES
} from "@/lib/graphql/salesOperations.js";
import { X, CalendarIcon } from "lucide-react";

export default function SalesAddModal({
  isOpen,
  onClose,
  onSubmit,
  salesReps = [],
  customers = [],
  products = [],
  categories = []
}) {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    salesDate: new Date().toISOString().split('T')[0],
    salesRepId: '',
    customerId: '',
    categoryId: '',
    productId: '',
    productModelId: '',
    type: 'SALE',
    quantity: 1,
    unitPrice: 0,
    salesPrice: 0,
    cost: 0,
    margin: 0,
    marginRate: 0,
    paymentStatus: 'UNPAID',
    paidAmount: 0,
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // 계산된 값들 업데이트
  useEffect(() => {
    const totalPrice = formData.quantity * formData.unitPrice;
    const totalCost = formData.quantity * formData.cost;
    const totalMargin = totalPrice - totalCost;
    const marginRate = totalPrice > 0 ? (totalMargin / totalPrice) * 100 : 0;

    setFormData(prev => ({
      ...prev,
      salesPrice: formData.unitPrice,
      totalPrice,
      totalCost,
      totalMargin: totalMargin,
      finalMargin: totalMargin,
      marginRate: marginRate
    }));
  }, [formData.quantity, formData.unitPrice, formData.cost]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.salesDate) newErrors.salesDate = "매출 일시는 필수입니다";
    if (!formData.salesRepId) newErrors.salesRepId = "영업사원은 필수입니다";
    if (!formData.customerId) newErrors.customerId = "고객사는 필수입니다";
    if (!formData.categoryId) newErrors.categoryId = "카테고리는 필수입니다";
    if (formData.quantity <= 0) newErrors.quantity = "수량은 1 이상이어야 합니다";
    if (formData.unitPrice <= 0) newErrors.unitPrice = "단가는 0보다 커야 합니다";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      salesDate: new Date(formData.salesDate),
      salesRepId: parseInt(formData.salesRepId),
      customerId: parseInt(formData.customerId),
      categoryId: parseInt(formData.categoryId),
      productId: formData.productId ? parseInt(formData.productId) : null,
      productModelId: formData.productModelId ? parseInt(formData.productModelId) : null,
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      salesPrice: parseFloat(formData.salesPrice),
      cost: parseFloat(formData.cost),
      paidAmount: parseFloat(formData.paidAmount)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">매출 추가</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 매출 일시 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                매출 일시 <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.salesDate}
                onChange={(e) => handleChange('salesDate', e.target.value)}
                className={errors.salesDate ? 'border-red-500' : ''}
              />
              {errors.salesDate && (
                <p className="text-red-500 text-sm mt-1">{errors.salesDate}</p>
              )}
            </div>

            {/* 영업사원 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                영업사원 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.salesRepId}
                onChange={(e) => handleChange('salesRepId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.salesRepId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">영업사원 선택</option>
                {salesReps.map(rep => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name} ({rep.email})
                  </option>
                ))}
              </select>
              {errors.salesRepId && (
                <p className="text-red-500 text-sm mt-1">{errors.salesRepId}</p>
              )}
            </div>

            {/* 고객사 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                고객사 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => handleChange('customerId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.customerId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">고객사 선택</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>
              )}
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">카테고리 선택</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>

            {/* 구분 */}
            <div>
              <label className="block text-sm font-medium mb-2">구분</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="SALE">판매</option>
                <option value="SAMPLE">샘플</option>
                <option value="DEFECTIVE">불량</option>
                <option value="EXPIRED">파손</option>
              </select>
            </div>

            {/* 제품 */}
            <div>
              <label className="block text-sm font-medium mb-2">제품</label>
              <select
                value={formData.productId}
                onChange={(e) => handleChange('productId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">제품 선택</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            {/* 수량 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                수량 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* 단가 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                단가 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                step="100"
                value={formData.unitPrice}
                onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
                className={errors.unitPrice ? 'border-red-500' : ''}
              />
              {errors.unitPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.unitPrice}</p>
              )}
            </div>

            {/* 원가 */}
            <div>
              <label className="block text-sm font-medium mb-2">원가</label>
              <Input
                type="number"
                min="0"
                step="100"
                value={formData.cost}
                onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* 결제 상태 */}
            <div>
              <label className="block text-sm font-medium mb-2">결제 상태</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => handleChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="UNPAID">미지급</option>
                <option value="PARTIAL_PAID">부분지급</option>
                <option value="PAID">완료</option>
              </select>
            </div>

            {/* 지급액 */}
            <div>
              <label className="block text-sm font-medium mb-2">지급액</label>
              <Input
                type="number"
                min="0"
                step="100"
                value={formData.paidAmount}
                onChange={(e) => handleChange('paidAmount', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* 계산 결과 표시 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">계산 결과</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">총액:</span>
                <div className="font-medium">₩{(formData.quantity * formData.unitPrice).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">총 원가:</span>
                <div className="font-medium">₩{(formData.quantity * formData.cost).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">마진:</span>
                <div className="font-medium">₩{((formData.quantity * formData.unitPrice) - (formData.quantity * formData.cost)).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">마진율:</span>
                <div className="font-medium">
                  {formData.unitPrice > 0 ? 
                    (((formData.unitPrice - formData.cost) / formData.unitPrice) * 100).toFixed(1) : 0
                  }%
                </div>
              </div>
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-sm font-medium mb-2">메모</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="추가 메모를 입력하세요"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
