"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useLanguage } from '@/hooks/useLanguage.js';

// Mock API data with VND pricing
const mockCategories = [
  { id: 1, name: "IT솔루션" },
  { id: 2, name: "소프트웨어" },
  { id: 3, name: "하드웨어" },
  { id: 4, name: "컨설팅" },
  { id: 5, name: "교육" },
  { id: 6, name: "유지보수" },
  { id: 7, name: "라이센스" },
  { id: 8, name: "클라우드" },
  { id: 9, name: "보안" },
  { id: 10, name: "데이터베이스" }
];

const mockCustomers = [
  { id: 1, name: "삼성전자" },
  { id: 2, name: "LG화학" },
  { id: 3, name: "현대자동차" },
  { id: 4, name: "SK하이닉스" },
  { id: 5, name: "POSCO" },
  { id: 6, name: "네이버" },
  { id: 7, name: "카카오" },
  { id: 8, name: "셀트리온" },
  { id: 9, name: "한화시스템" },
  { id: 10, name: "두산중공업" },
  { id: 11, name: "GS칼텍스" },
  { id: 12, name: "CJ제일제당" },
  { id: 13, name: "아모레퍼시픽" },
  { id: 14, name: "신세계" },
  { id: 15, name: "롯데케미칼" },
  { id: 16, name: "한국전력공사" },
  { id: 17, name: "KT" },
  { id: 18, name: "SK텔레콤" },
  { id: 19, name: "LG전자" },
  { id: 20, name: "현대제철" }
];

const mockProducts = {
  1: [ // IT솔루션
    { id: 1, name: "ERP 시스템", categoryId: 1 },
    { id: 2, name: "CRM 시스템", categoryId: 1 },
    { id: 3, name: "MES 시스템", categoryId: 1 },
    { id: 4, name: "WMS 시스템", categoryId: 1 },
    { id: 5, name: "HRM 시스템", categoryId: 1 }
  ],
  2: [ // 소프트웨어
    { id: 6, name: "Office Suite", categoryId: 2 },
    { id: 7, name: "개발도구", categoryId: 2 },
    { id: 8, name: "디자인 소프트웨어", categoryId: 2 }
  ],
  3: [ // 하드웨어
    { id: 9, name: "서버", categoryId: 3 },
    { id: 10, name: "네트워크 장비", categoryId: 3 }
  ]
};

const mockModels = {
  1: [ // ERP 시스템
    { 
      id: 1, 
      name: "Enterprise v3.0", 
      productId: 1,
      consumerPrice: 1200000000, // 1.2억 VND
      unitPrice: 1080000000,     // 1.08억 VND
      cost: 720000000,           // 7200만 VND
      incentiveA: 54000000,      // 5400만 VND
      incentiveB: 27000000       // 2700만 VND
    },
    { 
      id: 2, 
      name: "Professional v2.5", 
      productId: 1,
      consumerPrice: 800000000,  // 8000만 VND
      unitPrice: 720000000,      // 7200만 VND
      cost: 480000000,           // 4800만 VND
      incentiveA: 36000000,      // 3600만 VND
      incentiveB: 18000000       // 1800만 VND
    },
    { 
      id: 3, 
      name: "Standard v2.0", 
      productId: 1,
      consumerPrice: 500000000,  // 5000만 VND
      unitPrice: 450000000,      // 4500만 VND
      cost: 300000000,           // 3000만 VND
      incentiveA: 22500000,      // 2250만 VND
      incentiveB: 11250000       // 1125만 VND
    }
  ],
  2: [ // CRM 시스템
    { 
      id: 4, 
      name: "Sales Pro v4.0", 
      productId: 2,
      consumerPrice: 600000000,  // 6000만 VND
      unitPrice: 540000000,      // 5400만 VND
      cost: 360000000,           // 3600만 VND
      incentiveA: 27000000,      // 2700만 VND
      incentiveB: 13500000       // 1350만 VND
    },
    { 
      id: 5, 
      name: "Marketing Plus v3.2", 
      productId: 2,
      consumerPrice: 400000000,  // 4000만 VND
      unitPrice: 360000000,      // 3600만 VND
      cost: 240000000,           // 2400만 VND
      incentiveA: 18000000,      // 1800만 VND
      incentiveB: 9000000        // 900만 VND
    }
  ],
  3: [ // MES 시스템
    { 
      id: 6, 
      name: "Factory Pro v2.1", 
      productId: 3,
      consumerPrice: 900000000,  // 9000만 VND
      unitPrice: 810000000,      // 8100만 VND
      cost: 540000000,           // 5400만 VND
      incentiveA: 40500000,      // 4050만 VND
      incentiveB: 20250000       // 2025만 VND
    }
  ],
  4: [ // WMS 시스템
    { 
      id: 7, 
      name: "Warehouse Master v1.5", 
      productId: 4,
      consumerPrice: 700000000,  // 7000만 VND
      unitPrice: 630000000,      // 6300만 VND
      cost: 420000000,           // 4200만 VND
      incentiveA: 31500000,      // 3150만 VND
      incentiveB: 15750000       // 1575만 VND
    }
  ],
  5: [ // HRM 시스템
    { 
      id: 8, 
      name: "People Care v3.1", 
      productId: 5,
      consumerPrice: 550000000,  // 5500만 VND
      unitPrice: 495000000,      // 4950만 VND
      cost: 330000000,           // 3300만 VND
      incentiveA: 24750000,      // 2475만 VND
      incentiveB: 12375000       // 1237.5만 VND
    }
  ],
  6: [ // Office Suite
    { 
      id: 9, 
      name: "Office Professional 2024", 
      productId: 6,
      consumerPrice: 300000000,  // 3000만 VND
      unitPrice: 270000000,      // 2700만 VND
      cost: 180000000,           // 1800만 VND
      incentiveA: 13500000,      // 1350만 VND
      incentiveB: 6750000        // 675만 VND
    }
  ],
  7: [ // 개발도구
    { 
      id: 10, 
      name: "Dev Studio Enterprise", 
      productId: 7,
      consumerPrice: 450000000,  // 4500만 VND
      unitPrice: 405000000,      // 4050만 VND
      cost: 270000000,           // 2700만 VND
      incentiveA: 20250000,      // 2025만 VND
      incentiveB: 10125000       // 1012.5만 VND
    }
  ],
  8: [ // 디자인 소프트웨어
    { 
      id: 11, 
      name: "Creative Suite Pro", 
      productId: 8,
      consumerPrice: 650000000,  // 6500만 VND
      unitPrice: 585000000,      // 5850만 VND
      cost: 390000000,           // 3900만 VND
      incentiveA: 29250000,      // 2925만 VND
      incentiveB: 14625000       // 1462.5만 VND
    }
  ]
};

// Date formatter based on language
const formatDateByLanguage = (dateString, language) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  };

  switch (language) {
    case 'vi':
      return date.toLocaleDateString('vi-VN', options);
    case 'en':
      return date.toLocaleDateString('en-US', options);
    case 'ko':
    default:
      return date.toLocaleDateString('ko-KR', options);
  }
};

// Format VND currency
const formatVND = (amount) => {
  if (!amount && amount !== 0) return "₫0";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with commas
const formatNumber = (num) => {
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat('vi-VN').format(num);
};

// Table Header Filter Component
const TableHeaderFilter = ({ field, data, onFilter, onSort, currentSort, isResizing, onResizeStart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState(new Set());
  const [selectAll, setSelectAll] = useState(true);
  const dropdownRef = useRef(null);

  // Get unique values for this field
  const uniqueValues = React.useMemo(() => {
    const values = data.map(row => {
      if (field === 'customerId') return mockCustomers.find(c => c.id === row[field])?.name || '';
      if (field === 'categoryId') return mockCategories.find(c => c.id === row[field])?.name || '';
      if (field === 'productId') return mockProducts[row.categoryId]?.find(p => p.id === row[field])?.name || '';
      if (field === 'modelId') return mockModels[row.productId]?.find(m => m.id === row[field])?.name || '';
      return String(row[field] || '');
    });
    return [...new Set(values)].filter(v => v !== '').sort();
  }, [data, field]);

  const filteredValues = uniqueValues.filter(value =>
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedValues(new Set());
      setSelectAll(false);
    } else {
      setSelectedValues(new Set(uniqueValues));
      setSelectAll(true);
    }
  };

  const handleValueToggle = (value) => {
    const newSelected = new Set(selectedValues);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    setSelectedValues(newSelected);
    setSelectAll(newSelected.size === uniqueValues.length);
  };

  const applyFilter = () => {
    onFilter(field, Array.from(selectedValues));
    setIsOpen(false);
  };

  const handleSort = (direction) => {
    onSort(field, direction);
    setIsOpen(false);
  };

  const getSortIcon = () => {
    if (currentSort?.field === field) {
      return currentSort.direction === 'asc' ? (
        <svg className="w-3 h-3 ml-1 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3 h-3 ml-1 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  const getFieldLabel = () => {
    const labels = {
      'date': '날짜',
      'customerId': '고객사',
      'categoryId': '품목',
      'productId': '제품명',
      'modelId': '모델명',
      'quantity': '수량',
      'consumerPrice': '소비자가',
      'unitPrice': '단가',
      'total': '합계',
      'paymentStatus': '결제여부',
      'paymentDate': '결제일',
      'discountRate': '할인율(%)',
      'incentiveA': '인센티브A',
      'incentiveB': '인센티브B',
      'shippingFee': '배송비',
      'otherCosts': '기타비용',
      'cost': '원가',
      'margin': '마진',
      'totalCost': '원가합',
      'totalMargin': '마진합',
      'marginRate': '마진율(%)',
      'notes': '비고'
    };
    return labels[field] || field;
  };

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onResizeStart) {
      onResizeStart(e, field);
    }
  };

  return (
    <div className="relative flex items-center w-full h-full group" ref={dropdownRef}>
      <button
        onClick={() => !isResizing && setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left p-3 pr-2 transition-colors group-hover:bg-blue-600 rounded-sm"
        disabled={isResizing}
        style={{ cursor: isResizing ? 'default' : 'pointer' }}
      >
        <div className="flex items-center min-w-0 flex-1">
          <span className="text-sm font-medium text-white truncate pr-2">
            {getFieldLabel()}
          </span>
          {getSortIcon()}
        </div>
        <svg 
          className={`w-4 h-4 text-blue-200 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Resize handle */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize transition-colors z-10 ${
          isResizing ? 'bg-blue-400' : 'bg-transparent hover:bg-blue-300'
        }`}
        onMouseDown={handleResizeMouseDown}
        style={{ 
          cursor: 'col-resize',
          userSelect: 'none'
        }}
      />

      {isOpen && !isResizing && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl min-w-80 max-w-96">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 rounded-t-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {getFieldLabel()} 필터
            </h4>
          </div>

          {/* Search Box */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="text"
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">정렬</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSort('asc')}
                  size="sm"
                  className="text-xs px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md border-0"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  오름차순
                </Button>
                <Button
                  onClick={() => handleSort('desc')}
                  size="sm"
                  className="text-xs px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md border-0"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  내림차순
                </Button>
              </div>
            </div>
          </div>

          {/* Select All */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <label className="flex items-center text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-900 dark:text-white font-medium">전체선택/해제</span>
            </label>
          </div>

          {/* Values List */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {filteredValues.length > 0 ? (
              filteredValues.map((value, index) => (
                <label 
                  key={index} 
                  className="flex items-center text-sm p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.has(value)}
                    onChange={() => handleValueToggle(value)}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-900 dark:text-white truncate flex-1">{value}</span>
                </label>
              ))
            ) : (
              <div className="p-6 text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.602-6.394-1.665" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">검색 결과가 없습니다</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedValues.size}개 선택됨
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  className="text-xs px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md border-0"
                >
                  취소
                </Button>
                <Button
                  onClick={applyFilter}
                  size="sm"
                  className="text-xs px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md border-0"
                >
                  적용
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, revenueRecordId, onSave }) => {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    paymentDate: '',
    amount: 0,
    transferProof: null
  });

  useEffect(() => {
    if (isOpen && revenueRecordId) {
      // Mock load payments for this revenue record
      setPayments([
        {
          id: 1,
          paymentDate: '2024-06-10',
          amount: 500000000,
          transferProof: 'proof1.jpg'
        },
        {
          id: 2,
          paymentDate: '2024-06-15',
          amount: 580000000,
          transferProof: 'proof2.jpg'
        }
      ]);
    }
  }, [isOpen, revenueRecordId]);

  const handleAddPayment = () => {
    if (newPayment.paymentDate && newPayment.amount > 0) {
      const payment = {
        id: payments.length + 1,
        ...newPayment,
        revenueRecordId
      };
      setPayments([...payments, payment]);
      setNewPayment({ paymentDate: '', amount: 0, transferProof: null });
      // Mock API call to save payment
      console.log('Saving payment:', payment);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPayment({ ...newPayment, transferProof: file.name });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              결제 정보 관리
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Existing Payments */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">기존 결제 내역</h4>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.paymentDate}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatVND(payment.amount)}
                    </p>
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {payment.transferProof}
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  등록된 결제 내역이 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* Add New Payment */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">새 결제 추가</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  결제일
                </label>
                <Input
                  type="date"
                  value={newPayment.paymentDate}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  결제금액 (VND)
                </label>
                <Input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseInt(e.target.value) || 0 })}
                  className="w-full"
                  placeholder="결제금액을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이체증명서
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end```text
 space-x-3 mt-6">
              <Button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                취소
              </Button>
              <Button
                onClick={handleAddPayment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                결제 추가
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Select Component with Search
const SearchableSelect = ({ options, value, onChange, placeholder, searchable = true, width = "w-full" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedOptions, setDisplayedOptions] = useState(options.slice(0, 10));
  const [loadedCount, setLoadedCount] = useState(10);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedOptions(filtered.slice(0, loadedCount));
  }, [searchTerm, options, loadedCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && loadedCount < options.length) {
      setLoadedCount(prev => Math.min(prev + 10, options.length));
    }
  };

  const selectedOption = options.find(opt => opt.id === value);
  const displayValue = selectedOption?.name || "";
  const shouldTruncate = displayValue.length > 20;
  const truncatedValue = shouldTruncate ? displayValue.substring(0, 20) + "..." : displayValue;

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      <div
        className={`p-2 text-xs border-2 rounded-lg cursor-pointer bg-white dark:bg-gray-800 
                   transition-all duration-200 truncate shadow-sm min-w-[150px] max-w-[250px]
                   ${isOpen 
                     ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                     : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                   }`}
        onClick={() => setIsOpen(!isOpen)}
        title={shouldTruncate ? displayValue : ""}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {truncatedValue || placeholder}
          </span>
          <svg 
            className={`w-3 h-3 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white dark:bg-gray-800 border-2 border-blue-500 
                       rounded-lg shadow-2xl min-w-[150px] max-w-[250px] animate-in slide-in-from-top-1 duration-200">
          {searchable && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <Input
                type="text"
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200"
                autoFocus
              />
            </div>
          )}

          <div 
            className="max-h-48 overflow-y-auto custom-scrollbar"
            onScroll={handleScroll}
          >
            {displayedOptions.map((option) => {
              const optionShouldTruncate = option.name.length > 30;
              const optionTruncated = optionShouldTruncate ? option.name.substring(0, 30) + "..." : option.name;

              return (
                <div
                  key={option.id}
                  className="p-3 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/50 cursor-pointer 
                            transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 
                            last:border-b-0 relative group"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  title={optionShouldTruncate ? option.name : ""}
                >
                  <span className="text-gray-900 dark:text-white font-medium">{optionTruncated}</span>
                  {optionShouldTruncate && (
                    <div className="absolute z-10 p-2 text-xs bg-gray-900 text-white rounded-lg shadow-xl 
                                   -top-8 left-0 whitespace-nowrap opacity-0 group-hover:opacity-100 
                                   transition-opacity duration-200 pointer-events-none">
                      {option.name}
                      <div className="absolute -bottom-1 left-3 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}

            {displayedOptions.length === 0 && (
              <div className="p-4 text-xs text-gray-500 text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.602-6.394-1.665" />
                </svg>
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Editable Cell Component with Tooltip
const EditableCell = ({ value, onChange, type = "text", isEditing, onEdit, onSave, onCancel, options, onCategoryChange, onProductChange, onModelChange, categoryId, productId, onPaymentClick }) => {
  const [localValue, setLocalValue] = useState(value);
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(localValue);
    onSave();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      onCancel();
    }
  };

  // Handle payment date cell click
  if (type === "paymentDate") {
    const displayValue = value?.toString() || "";
    return (
      <div
        className="p-2 text-xs cursor-pointer transition-all duration-200 rounded-md
                   hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-sm relative group"
        onClick={onPaymentClick}
      >
        <span className="text-blue-600 dark:text-blue-400 underline">{displayValue || "결제 관리"}</span>
      </div>
    );
  }

  if (type === "select") {
    return isEditing ? (
      <SearchableSelect
        options={options || []}
        value={localValue}
        onChange={(newValue) => {
          setLocalValue(newValue);
          if (onCategoryChange && type === "category") {
            onCategoryChange(newValue);
          } else if (onProductChange && type === "product") {
            onProductChange(newValue);
          } else if (onModelChange && type === "model") {
            onModelChange(newValue);
          }
          onChange(newValue);
          onSave();
        }}
        placeholder="선택..."
        width="min-w-[150px] max-w-[250px]"
      />
    ) : (
      <div
        className="p-2 text-xs cursor-pointer transition-all duration-200 rounded-md
                   hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-sm relative group min-w-[150px] max-w-[250px]"
        onClick={onEdit}
        onMouseEnter={() => {
          const selectedOption = options?.find(opt => opt.id === value);
          const displayValue = selectedOption?.name || "";
          setShowTooltip(displayValue.length > 20);
        }}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {(() => {
          const selectedOption = options?.find(opt => opt.id === value);
          const displayValue = selectedOption?.name || "";
          const shouldTruncate = displayValue.length > 20;
          const truncatedValue = shouldTruncate ? displayValue.substring(0, 20) + "..." : displayValue;

          return (
            <>
              <span className="text-gray-900 dark:text-white">{truncatedValue}</span>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 
                             dark:group-hover:border-blue-700 rounded-md transition-colors duration-200"></div>
              {showTooltip && shouldTruncate && (
                <div className="absolute z-20 p-3 text-xs bg-gray-900 text-white rounded-lg shadow-xl 
                               -top-10 left-0 whitespace-nowrap animate-in slide-in-from-bottom-1 duration-200">
                  {displayValue}
                  <div className="absolute -bottom-1 left-3 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    );
  }

  // Handle date display with language formatting
  if (type === "date") {
    const displayValue = value ? formatDateByLanguage(value, language) : "";
    const shouldTruncate = displayValue.length > 15;
    const truncatedValue = shouldTruncate ? displayValue.substring(0, 15) + "..." : displayValue;

    return isEditing ? (
      <input
        ref={inputRef}
        type="date"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className="w-full p-2 text-xs border-2 border-blue-500 rounded-lg focus:ring-2 
                  focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-white transition-all duration-200"
      />
    ) : (
      <div
        className="p-2 text-xs cursor-pointer transition-all duration-200 rounded-md
                   hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-sm relative group"
        onClick={onEdit}
        onMouseEnter={() => setShowTooltip(shouldTruncate)}
        onMouseLeave={() => setShowTooltip(false)}
        title={shouldTruncate ? displayValue : ""}
      >
        <span className="text-gray-900 dark:text-white">{truncatedValue}</span>
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 
                       dark:group-hover:border-blue-700 rounded-md transition-colors duration-200"></div>
        {showTooltip && shouldTruncate && (
          <div className="absolute z-20 p-3 text-xs bg-gray-900 text-white rounded-lg shadow-xl 
                         -top-10 left-0 whitespace-nowrap max-w-xs animate-in slide-in-from-bottom-1 duration-200">
            {displayValue}
            <div className="absolute -bottom-1 left-3 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        )}
      </div>
    );
  }

  const displayValue = value?.toString() || "";
  const shouldTruncate = displayValue.length > 15;
  const truncatedValue = shouldTruncate ? displayValue.substring(0, 15) + "..." : displayValue;

  return isEditing ? (
    <input
      ref={inputRef}
      type={type}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyPress}
      className="w-full p-2 text-xs border-2 border-blue-500 rounded-lg focus:ring-2 
                focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-800 
                text-gray-900 dark:text-white transition-all duration-200"
    />
  ) : (
    <div
      className="p-2 text-xs cursor-pointer transition-all duration-200 rounded-md
                 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-sm relative group"
      onClick={onEdit}
      onMouseEnter={() => setShowTooltip(shouldTruncate)}
      onMouseLeave={() => setShowTooltip(false)}
      title={shouldTruncate ? displayValue : ""}
    >
      <span className="text-gray-900 dark:text-white">{truncatedValue}</span>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 
                     dark:group-hover:border-blue-700 rounded-md transition-colors duration-200"></div>
      {showTooltip && shouldTruncate && (
        <div className="absolute z-20 p-3 text-xs bg-gray-900 text-white rounded-lg shadow-xl 
                       -top-10 left-0 whitespace-nowrap max-w-xs animate-in slide-in-from-bottom-1 duration-200">
          {displayValue}
          <div className="absolute -bottom-1 left-3 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default function RevenueRecordPage() {
  const { t } = useLanguage();

  // Column widths state
  const [columnWidths, setColumnWidths] = useState({
    date: '120px',
    customerId: '200px',
    categoryId: '150px',
    productId: '200px',
    modelId: '200px',
    quantity: '80px',
    consumerPrice: '120px',
    unitPrice: '120px',
    total: '120px',
    paymentStatus: '100px',
    paymentDate: '100px',
    discountRate: '100px',
    incentiveA: '120px',
    incentiveB: '120px',
    shippingFee: '100px',
    otherCosts: '120px',
    cost: '100px',
    margin: '120px',
    totalCost: '120px',
    totalMargin: '120px',
    marginRate: '100px',
    notes: '200px'
  });

  const [isResizing, setIsResizing] = useState(false);
  const [resizeField, setResizeField] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleResizeStart = useCallback((e, field) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeField(field);
    setStartX(e.clientX);
    setStartWidth(parseFloat(columnWidths[field]) || 100);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [columnWidths]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !resizeField) return;

    e.preventDefault();
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(80, startWidth + deltaX); // Minimum width of 80px

    setColumnWidths(prev => ({
      ...prev,
      [resizeField]: `${newWidth}px`
    }));
  }, [isResizing, resizeField, startX, startWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeField(null);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  // Add/remove event listeners when resizing state changes
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, []);

  const [revenueData, setRevenueData] = useState([
    {
      id: 1,
      date: "2024-06-01",
      customerId: 1,
      categoryId: 1,
      productId: 1,
      modelId: 1,
      quantity: 1,
      consumerPrice: 1200000000,
      unitPrice: 1080000000,
      total: 1080000000,
      paymentStatus: "완료",
      paymentDate: "2024-06-15",
      discountRate: 10,
      incentiveA: 54000000,
      incentiveB: 27000000,
      shippingFee: 0,
      otherCosts: 12000000,
      cost: 720000000,
      margin: 348000000,
      totalCost: 732000000,
      totalMargin: 348000000,
      marginRate: 32.2,
      notes: "초기 설치 완료"
    },
    {
      id: 2,
      date: "2024-05-30",
      customerId: 2,
      categoryId: 2,
      productId: 2,
      modelId: 4,
      quantity: 1,
      consumerPrice: 600000000,
      unitPrice: 540000000,
      total: 540000000,
      paymentStatus: "대기",
      paymentDate: "",
      discountRate: 10,
      incentiveA: 27000000,
      incentiveB: 13500000,
      shippingFee: 0,
      otherCosts: 6000000,
      cost: 360000000,
      margin: 133500000,
      totalCost: 366000000,
      totalMargin: 174000000,
      marginRate: 32.2,
      notes: "1차 단계 완료"
    }
  ]);

  const [editingCell, setEditingCell] = useState(null);
  const [availableProducts, setAvailableProducts] = useState({});
  const [availableModels, setAvailableModels] = useState({});
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, recordId: null });
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(null);
  const [filteredData, setFilteredData] = useState(revenueData);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...revenueData];

    // Apply filters
    Object.entries(filters).forEach(([field, selectedValues]) => {
      if (selectedValues && selectedValues.length > 0) {
        filtered = filtered.filter(row => {
          let rowValue = '';
          if (field === 'customerId') rowValue = mockCustomers.find(c => c.id === row[field])?.name || '';
          else if (field === 'categoryId') rowValue = mockCategories.find(c => c.id === row[field])?.name || '';
          else if (field === 'productId') rowValue = mockProducts[row.categoryId]?.find(p => p.id === row[field])?.name || '';
          else if (field === 'modelId') rowValue = mockModels[row.productId]?.find(m => m.id === row[field])?.name || '';
          else rowValue = String(row[field] || '');

          return selectedValues.includes(rowValue);
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.field];
        let bValue = b[sortConfig.field];

        // Handle special cases for sorting
        if (sortConfig.field === 'customerId') {
          aValue = mockCustomers.find(c => c.id === aValue)?.name || '';
          bValue = mockCustomers.find(c => c.id === bValue)?.name || '';
        } else if (sortConfig.field === 'categoryId') {
          aValue = mockCategories.find(c => c.id === aValue)?.name || '';
          bValue = mockCategories.find(c => c.id === bValue)?.name || '';
        } else if (sortConfig.field === 'productId') {
          aValue = mockProducts[a.categoryId]?.find(p => p.id === aValue)?.name || '';
          bValue = mockProducts[b.categoryId]?.find(p => p.id === bValue)?.name || '';
        } else if (sortConfig.field === 'modelId') {
          aValue = mockModels[a.productId]?.find(m => m.id === aValue)?.name || '';
          bValue = mockModels[b.productId]?.find(m => m.id === bValue)?.name || '';
        }

        // Convert to string for comparison if not numeric
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [revenueData, filters, sortConfig]);

  const handleFilter = (field, selectedValues) => {
    setFilters(prev => ({
      ...prev,
      [field]: selectedValues
    }));
  };

  const handleSort = (field, direction) => {
    setSortConfig({ field, direction });
  };

  // Calculate totals and margins
  const calculateTotals = (record) => {
    const subtotal = record.unitPrice * record.quantity;
    const discountAmount = subtotal * (record.discountRate / 100);
    const finalTotal = subtotal - discountAmount;
    const totalCost = record.cost + record.shippingFee + record.otherCosts;
    const margin = finalTotal - totalCost;
    const marginRate = finalTotal > 0 ? (margin / finalTotal) * 100 : 0;

    return {
      ...record,
      total: finalTotal,
      totalCost,
      margin,
      totalMargin: margin,
      marginRate: parseFloat(marginRate.toFixed(2))
    };
  };

  // Mock API calls
  const fetchCustomers = async (search = '', offset = 0, limit = 10) => {
    const filtered = mockCustomers.filter(customer =>
      customer.name.toLowerCase().includes(search.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  };

  const fetchProductsByCategory = async (categoryId) => {
    return mockProducts[categoryId] || [];
  };

  const fetchModelsByProduct = async (productId) => {
    return mockModels[productId] || [];
  };

  const saveRecord = async (record) => {
    // Mock API call
    console.log('Saving record:', record);
    return true;
  };

  const handleCellEdit = (rowId, field) => {
    setEditingCell({ rowId, field });
  };

  const handleCellSave = async (rowId, field, newValue) => {
    const updatedData = revenueData.map(row => {
      if (row.id === rowId) {
        let updatedRow = { ...row, [field]: newValue };

        // Always recalculate when price/quantity/cost related fields change
        if (['unitPrice', 'quantity', 'cost', 'discountRate', 'shippingFee', 'otherCosts', 'consumerPrice'].includes(field)) {
          updatedRow = calculateTotals(updatedRow);
        }

        return updatedRow;
      }
      return row;
    });

    setRevenueData(updatedData);
    setEditingCell(null);

    // Save to backend
    const record = updatedData.find(r => r.id === rowId);
    await saveRecord(record);
  };

  const handleCategoryChange = async (rowId, categoryId) => {
    const products = await fetchProductsByCategory(categoryId);
    setAvailableProducts(prev => ({ ...prev, [rowId]: products }));

    // Reset product and model when category changes
    const updatedData = revenueData.map(row => {
      if (row.id === rowId) {
        const updatedRow = { 
          ...row, 
          categoryId, 
          productId: null, 
          modelId: null,
          consumerPrice: 0,
          unitPrice: 0,
          cost: 0,
          incentiveA: 0,
          incentiveB: 0
        };
        return calculateTotals(updatedRow);
      }
      return row;
    });
    setRevenueData(updatedData);
  };

  const handleProductChange = async (rowId, productId) => {
    const models = await fetchModelsByProduct(productId);
    setAvailableModels(prev => ({ ...prev, [rowId]: models }));

    // Reset model when product changes
    const updatedData = revenueData.map(row => {
      if (row.id === rowId) {
        const updatedRow = { 
          ...row, 
          productId, 
          modelId: null,
          consumerPrice: 0,
          unitPrice: 0,
          cost: 0,
          incentiveA: 0,
          incentiveB: 0
        };
        return calculateTotals(updatedRow);
      }
      return row;
    });
    setRevenueData(updatedData);
  };

  const handleModelChange = async (rowId, modelId) => {
    // Find the selected model and auto-populate prices
    const updatedData = revenueData.map(row => {
      if (row.id === rowId) {
        const selectedModel = mockModels[row.productId]?.find(m => m.id === modelId);
        if (selectedModel) {
          const updatedRow = {
            ...row,
            modelId,
            consumerPrice: selectedModel.consumerPrice,
            unitPrice: selectedModel.unitPrice,
            cost: selectedModel.cost,
            incentiveA: selectedModel.incentiveA,
            incentiveB: selectedModel.incentiveB
          };
          return calculateTotals(updatedRow);
        }
      }
      return row;
    });
    setRevenueData(updatedData);
  };

  const handlePaymentClick = (recordId) => {
    setPaymentModal({ isOpen: true, recordId });
  };

  const exportToCSV = () => {
    const headers = [
      "날짜", "고객사", "품목", "제품명", "모델명", "수량", "소비자가", "단가", "합계",
      "고객사 결제여부", "결제일", "할인율", "인센티브A", "인센티브B", "배송비",
      "기타비용", "원가", "마진", "원가합", "마진합", "마진요율", "비고"
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        row.date,
        mockCustomers.find(c => c.id === row.customerId)?.name || "",
        mockCategories.find(c => c.id === row.categoryId)?.name || "",
        mockProducts[row.categoryId]?.find(p => p.id === row.productId)?.name || "",
        mockModels[row.productId]?.find(m => m.id === row.modelId)?.name || "",
        row.quantity,
        row.consumerPrice,
        row.unitPrice,
        row.total,
        row.paymentStatus,
        row.paymentDate,
        row.discountRate,
        row.incentiveA,
        row.incentiveB,
        row.shippingFee,
        row.otherCosts,
        row.cost,
        row.margin,
        row.totalCost,
        row.totalMargin,
        row.marginRate,
        row.notes
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "revenue_record.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addNewRecord = () => {
    const newId = Math.max(...revenueData.map(r => r.id)) + 1;
    const newRecord = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      customerId: null,
      categoryId: null,
      productId: null,
      modelId: null,
      quantity: 1,
      consumerPrice: 0,
      unitPrice: 0,
      total: 0,
      paymentStatus: "대기",
      paymentDate: "",
      discountRate: 0,
      incentiveA: 0,
      incentiveB: 0,
      shippingFee: 0,
      otherCosts: 0,
      cost: 0,
      margin: 0,
      totalCost: 0,
      totalMargin: 0,
      marginRate: 0,
      notes: ""
    };
    setRevenueData([...revenueData, newRecord]);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full animate-fadeIn">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 
                             bg-clip-text text-transparent">
                {t('revenue.record')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                매출 내역을 스프레드시트 형태로 관리하세요 (셀 클릭으로 바로 편집, 헤더 클릭으로 필터링)
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                필터링된 결과: {filteredData.length}개 / 전체: {revenueData.length}개
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={addNewRecord}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 
                         text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 행 추가
              </Button>
              <Button 
                onClick={exportToCSV}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                         text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV 내보내기
              </Button>
            </div>
          </div>
        </div>

        {/* 매출 기록 테이블 - 전체 영역 차지 */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              매출 기록 (헤더 클릭하여 필터링/정렬) - VND 통화
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              각 셀을 클릭하여 직접 편집할 수 있습니다. 헤더를 클릭하면 필터링과 정렬이 가능합니다.
            </p>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar" style={{ height: 'calc(100vh - 280px)' }}>
            <div className="min-w-full">
              <table className="w-full text-xs border-collapse bg-white dark:bg-gray-800">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                    <th 
                      className="border border-blue-400 text-left font-semibold relative"
                      style={{ width: columnWidths.date, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="date" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'date'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-left font-semibold relative"
                      style={{ width: columnWidths.customerId, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="customerId" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'customerId'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-left font-semibold relative"
                      style={{ width: columnWidths.categoryId, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="categoryId" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'categoryId'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-left font-semibold relative"
                      style={{ width: columnWidths.productId, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="productId" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'productId'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-left font-semibold relative"
                      style={{ width: columnWidths.modelId, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="modelId" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'modelId'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.quantity, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="quantity" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'quantity'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.consumerPrice, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="consumerPrice" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'consumerPrice'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.unitPrice, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="unitPrice" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'unitPrice'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.total, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="total" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'total'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-center font-semibold relative"
                      style={{ width: columnWidths.paymentStatus, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="paymentStatus" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'paymentStatus'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-center font-semibold relative"
                      style={{ width: columnWidths.paymentDate, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="paymentDate" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'paymentDate'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.discountRate, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="discountRate" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'discountRate'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.incentiveA, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="incentiveA" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'incentiveA'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.incentiveB, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="incentiveB" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'incentiveB'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.shippingFee, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="shippingFee" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'shippingFee'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.otherCosts, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="otherCosts" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'otherCosts'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.cost, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="cost" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'cost'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.margin, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="margin" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'margin'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.totalCost, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="totalCost" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'totalCost'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.totalMargin, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="totalMargin" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'totalMargin'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-right font-semibold relative"
                      style={{ width: columnWidths.marginRate, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="marginRate" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'marginRate'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                    <th 
                      className="border border-blue-400 text-left font-semibold relative"
                      style={{ width: columnWidths.notes, minWidth: '80px' }}
                    >
                      <TableHeaderFilter 
                        field="notes" 
                        data={revenueData} 
                        onFilter={handleFilter} 
                        onSort={handleSort}
                        currentSort={sortConfig}
                        isResizing={isResizing && resizeField === 'notes'}
                        onResizeStart={handleResizeStart}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => {
                    return (
                      <tr key={record.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors 
                                                     duration-200 border-b border-gray-200 dark:border-gray-700">
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                          <EditableCell
                            value={record.date}
                            onChange={(value) => handleCellSave(record.id, 'date', value)}
                            type="date"
                            isEditing={editingCell?.rowId === record.id && editingCell?.field === 'date'}
                            onEdit={() => handleCellEdit(record.id, 'date')}
                            onSave={() => setEditingCell(null)}
                            onCancel={() => setEditingCell(null)}
                          />
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                          <EditableCell
                            value={record.customerId}
                            onChange={(value) => handleCellSave(record.id, 'customerId', value)}
                            type="select"
                            options={mockCustomers}
                            isEditing={editingCell?.rowId === record.id && editingCell?.field === 'customerId'}
                            onEdit={() => handleCellEdit(record.id, 'customerId')}
                            onSave={() => setEditingCell(null)}
                            onCancel={() => setEditingCell(null)}
                          />
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                          <EditableCell
                            value={record.categoryId}
                            onChange={(value) => {
                              handleCategoryChange(record.id, value);
                              handleCellSave(record.id, 'categoryId', value);
                            }}
                            type="select"
                            options={mockCategories}
                            isEditing={editingCell?.rowId === record.id && editingCell?.field === 'categoryId'}
                            onEdit={() => handleCellEdit(record.id, 'categoryId')}
                            onSave={() => setEditingCell(null)}
                            onCancel={() => setEditingCell(null)}
                            onCategoryChange={(value) => handleCategoryChange(record.id, value)}
                          />
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                          <EditableCell
                            value={record.productId}
                            onChange={(value) => {
                              handleProductChange(record.id, value);
                              handleCellSave(record.id, 'productId', value);
                            }}
                            type="select"
                            options={availableProducts[record.id] || mockProducts[record.categoryId] || []}
                            isEditing={editingCell?.rowId === record.id && editingCell?.field === 'productId'}
                            onEdit={() => handleCellEdit(record.id, 'productId')}
                            onSave={() => setEditingCell(null)}
                            onCancel={() => setEditingCell(null)}
                            onProductChange={(value) => handleProductChange(record.id, value)}
                          />
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                          <EditableCell
                            value={record.modelId}
                            onChange={(value) => {
                              handleModelChange(record.id, value);
                              handleCellSave(record.id, 'modelId', value);
                            }}
                            type="select"
                            options={availableModels[record.id] || mockModels[record.productId] || []}
                            isEditing={editingCell?.rowId === record.id && editingCell?.field === 'modelId'}
                            onEdit={() => handleCellEdit(record.id, 'modelId')}
                            onSave={() => setEditingCell(null)}
                            onCancel={() => setEditingCell(null)}
                            onModelChange={(value) => handleModelChange(record.id, value)}
                          />
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-right p-2">
                          {editingCell?.rowId === record.id && editingCell?.field === 'quantity' ? (
                            <EditableCell
                              value={record.quantity}
                              onChange={(value) => handleCellSave(record.id, 'quantity', parseInt(value) || 1)}
                              type="number"
                              isEditing={true}
                              onEdit={() => handleCellEdit(record.id, 'quantity')}
                              onSave={() => setEditingCell(null)}
                              onCancel={() => setEditingCell(null)}
                            />
                          ) : (
                            <div
                              className="text-xs cursor-pointer p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              onClick={() => handleCellEdit(record.id, 'quantity')}
                            >
                              {formatNumber(record.quantity)}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-right p-2">
                          {editingCell?.rowId === record.id && editingCell?.field === 'consumerPrice' ? (
                            <EditableCell
                              value={record.consumerPrice}
                              onChange={(value) => handleCellSave(record.id, 'consumerPrice', parseInt(value) || 0)}
                              type="number"
                              isEditing={true}
                              onEdit={() => handleCellEdit(record.id, 'consumerPrice')}
                              onSave={() => setEditingCell(null)}
                              onCancel={() => setEditingCell(null)}
                            />
                          ) : (
                            <div
                              className="text-xs cursor-pointer p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              onClick={() => handleCellEdit(record.id, 'consumerPrice')}
                            >
                              {formatNumber(record.consumerPrice)}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-right p-2">
                          {editingCell?.rowId === record.id && editingCell?.field === 'unitPrice' ? (
                            <EditableCell
                              value={record.unitPrice}
                              onChange={(value) => handleCellSave(record.id, 'unitPrice', parseInt(value) || 0)}
                              type="number"
                              isEditing={true}
                              onEdit={() => handleCellEdit(record.id, 'unitPrice')}
                              onSave={() => setEditingCell(null)}
                              onCancel={() => setEditingCell(null)}
                            />
                          ) : (
                            <div
                              className="text-xs cursor-pointer p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              onClick={() => handleCellEdit(record.id, 'unitPrice')}
                            >
                              {formatNumber(record.unitPrice)}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/20 text-right p-2">
                          <span className="text-blue-900 dark:text-blue-300 font-semibold text-xs">
                            {formatVND(record.total)}
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-center p-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            record.paymentStatus === '완료' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {record.paymentStatus}
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-center">
                          <EditableCell
                            value={record.paymentDate}
                            type="paymentDate"
                            onPaymentClick={() => handlePaymentClick(record.id)}
                          />
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-right p-2">
                          {editingCell?.rowId === record.id && editingCell?.field === 'discountRate' ? (
                            <EditableCell
                              value={record.discountRate}
                              onChange={(value) => handleCellSave(record.id, 'discountRate', parseFloat(value) || 0)}
                              type="number"
                              isEditing={true}
                              onEdit={() => handleCellEdit(record.id, 'discountRate')}
                              onSave={() => setEditingCell(null)}
                              onCancel={() => setEditingCell(null)}
                            />
                          ) : (
                            <div
                              className="text-xs cursor-pointer p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              onClick={() => handleCellEdit(record.id, 'discountRate')}
                            >
                              {formatNumber(record.discountRate)}%
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-green-50 dark:bg-green-900/20 text-right p-2">
                          <span className="text-green-900 dark:text-green-300 text-xs">
                            {formatNumber(record.incentiveA)}
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-green-50 dark:bg-green-900/20 text-right p-2">
                          <span className="text-green-900 dark:text-green-300 text-xs">
                            {formatNumber(record.incentiveB)}
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-right p-2">
                          {editingCell?.rowId === record.id && editingCell?.field === 'shippingFee' ? (
                            <EditableCell
                              value={record.shippingFee}
                              onChange={(value) => handleCellSave(record.id, 'shippingFee', parseInt(value) || 0)}
                              type="number"
                              isEditing={true}
                              onEdit={() => handleCellEdit(record.id, 'shippingFee')}
                              onSave={() => setEditingCell(null)}
                              onCancel={() => setEditingCell(null)}
                            />
                          ) : (
                            <div
                              className="text-xs cursor-pointer p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              onClick={() => handleCellEdit(record.id, 'shippingFee')}
                            >
                              {formatNumber(record.shippingFee)}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-right p-2">
                          {editingCell?.rowId === record.id && editingCell?.field === 'otherCosts' ? (
                            <EditableCell
                              value={record.otherCosts}
                              onChange={(value) => handleCellSave(record.id, 'otherCosts', parseInt(value) || 0)}
                              type="number"
                              isEditing={true}
                              onEdit={() => handleCellEdit(record.id, 'otherCosts')}
                              onSave={() => setEditingCell(null)}
                              onCancel={() => setEditingCell(null)}
                            />
                          ) : (
                            <div
                              className="text-xs cursor-pointer p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              onClick={() => handleCellEdit(record.id, 'otherCosts')}
                            >
                              {formatNumber(record.otherCosts)}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-right p-2">
                          {editingCell?.rowId === record.id && editingCell?.field === 'cost' ? (
                            <EditableCell
                              value={record.cost}
                              onChange={(value) => handleCellSave(record.id, 'cost', parseInt(value) || 0)}
                              type="number"
                              isEditing={true}
                              onEdit={() => handleCellEdit(record.id, 'cost')}
                              onSave={() => setEditingCell(null)}
                              onCancel={() => setEditingCell(null)}
                            />
                          ) : (
                            <div
                              className="text-xs cursor-pointer p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              onClick={() => handleCellEdit(record.id, 'cost')}
                            >
                              {formatNumber(record.cost)}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-purple-50 dark:bg-purple-900/20 text-right p-2">
                          <span className="text-purple-900 dark:text-purple-300 font-medium text-xs">
                            {formatNumber(record.margin)}
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-right p-2">
                          <span className="text-gray-900 dark:text-white text-xs">
                            {formatNumber(record.totalCost)}
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-purple-50 dark:bg-purple-900/20 text-right p-2">
                          <span className="text-purple-900 dark:text-purple-300 font-semibold text-xs">
                            {formatNumber(record.totalMargin)}
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-indigo-50 dark:bg-indigo-900/20 text-right p-2">
                          <span className="text-indigo-900 dark:text-indigo-300 font-bold text-xs">
                            {formatNumber(record.marginRate)}%
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                          <EditableCell
                            value={record.notes}
                            onChange={(value) => handleCellSave(record.id, 'notes', value)}
                            isEditing={editingCell?.rowId === record.id && editingCell?.field === 'notes'}
                            onEdit={() => handleCellEdit(record.id, 'notes')}
                            onSave={() => setEditingCell(null)}
                            onCancel={() => setEditingCell(null)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, recordId: null })}
        revenueRecordId={paymentModal.recordId}
        onSave={() => {
          // Refresh payment data
          setPaymentModal({ isOpen: false, recordId: null });
        }}
      />
    </DashboardLayout>
  );
}