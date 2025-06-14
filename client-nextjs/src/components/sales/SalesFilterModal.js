
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import { X, Filter } from "lucide-react";

export default function SalesFilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  salesReps = [],
  customers = [],
  products = [],
  categories = []
}) {
  const { t } = useTranslation();
  
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      salesRepId: null,
      customerId: null,
      categoryId: null,
      productId: null,
      type: null,
      paymentStatus: null,
      dateFrom: null,
      dateTo: null
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-xl font-semibold">필터 설정</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* 검색어 */}
          <div>
            <label className="block text-sm font-medium mb-2">검색어</label>
            <Input
              type="text"
              value={localFilters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="고객사명, 제품명, 메모 등으로 검색"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 영업사원 */}
            <div>
              <label className="block text-sm font-medium mb-2">영업사원</label>
              <select
                value={localFilters.salesRepId || ''}
                onChange={(e) => handleChange('salesRepId', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">전체 영업사원</option>
                {salesReps.map(rep => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name} ({rep.email})
                  </option>
                ))}
              </select>
            </div>

            {/* 고객사 */}
            <div>
              <label className="block text-sm font-medium mb-2">고객사</label>
              <select
                value={localFilters.customerId || ''}
                onChange={(e) => handleChange('customerId', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">전체 고객사</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium mb-2">카테고리</label>
              <select
                value={localFilters.categoryId || ''}
                onChange={(e) => handleChange('categoryId', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">전체 카테고리</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 제품 */}
            <div>
              <label className="block text-sm font-medium mb-2">제품</label>
              <select
                value={localFilters.productId || ''}
                onChange={(e) => handleChange('productId', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">전체 제품</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            {/* 구분 */}
            <div>
              <label className="block text-sm font-medium mb-2">구분</label>
              <select
                value={localFilters.type || ''}
                onChange={(e) => handleChange('type', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">전체 구분</option>
                <option value="SALE">판매</option>
                <option value="SAMPLE">샘플</option>
                <option value="DEFECTIVE">불량</option>
                <option value="EXPIRED">파손</option>
              </select>
            </div>

            {/* 결제 상태 */}
            <div>
              <label className="block text-sm font-medium mb-2">결제 상태</label>
              <select
                value={localFilters.paymentStatus || ''}
                onChange={(e) => handleChange('paymentStatus', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">전체 상태</option>
                <option value="UNPAID">미지급</option>
                <option value="PARTIAL_PAID">부분지급</option>
                <option value="PAID">완료</option>
              </select>
            </div>

            {/* 시작 날짜 */}
            <div>
              <label className="block text-sm font-medium mb-2">시작 날짜</label>
              <Input
                type="date"
                value={localFilters.dateFrom || ''}
                onChange={(e) => handleChange('dateFrom', e.target.value || null)}
              />
            </div>

            {/* 종료 날짜 */}
            <div>
              <label className="block text-sm font-medium mb-2">종료 날짜</label>
              <Input
                type="date"
                value={localFilters.dateTo || ''}
                onChange={(e) => handleChange('dateTo', e.target.value || null)}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              초기화
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button type="button" onClick={handleApply}>
                적용
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
