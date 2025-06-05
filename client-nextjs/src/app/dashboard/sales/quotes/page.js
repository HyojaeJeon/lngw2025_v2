
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
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

export default function SalesQuotesPage() {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      quoteNumber: 'Q2024-001',
      customer: '삼성전자',
      title: 'ERP 시스템 구축 견적서',
      amount: 50000000,
      status: 'sent',
      validUntil: '2024-07-01',
      createdAt: '2024-06-01'
    },
    {
      id: 2,
      quoteNumber: 'Q2024-002',
      customer: 'LG화학',
      title: '클라우드 마이그레이션 견적서',
      amount: 30000000,
      status: 'approved',
      validUntil: '2024-06-30',
      createdAt: '2024-05-28'
    }
  ]);

  const [formData, setFormData] = useState({
    customer: '',
    title: '',
    amount: '',
    validUntil: '',
    items: [{ name: '', quantity: 1, price: '' }]
  });

  const quoteStatuses = [
    { value: 'draft', label: '임시저장', color: 'bg-gray-500' },
    { value: 'sent', label: '발송완료', color: 'bg-blue-500' },
    { value: 'approved', label: '승인됨', color: 'bg-green-500' },
    { value: 'rejected', label: '거절됨', color: 'bg-red-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuote = {
      id: quotes.length + 1,
      quoteNumber: `Q2024-${String(quotes.length + 1).padStart(3, '0')}`,
      ...formData,
      amount: parseInt(formData.amount),
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuotes([newQuote, ...quotes]);
    setFormData({
      customer: '',
      title: '',
      amount: '',
      validUntil: '',
      items: [{ name: '', quantity: 1, price: '' }]
    });
    setShowAddForm(false);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, price: '' }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = formData.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, items: newItems });
  };

  const getStatusInfo = (status) => {
    return quoteStatuses.find(s => s.value === status) || quoteStatuses[0];
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const exportToPDF = (quote) => {
    // PDF 내보내기 로직 (실제 구현에서는 PDF 라이브러리 사용)
    alert(`${quote.quoteNumber} 견적서를 PDF로 내보냅니다.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-xl p-6 transform transition-all duration-500 hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                             bg-clip-text text-transparent">
                {t('sales.quotes')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                견적서를 작성하고 관리하세요
              </p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                        text-white shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              견적서 작성
            </Button>
          </div>
        </div>

        {/* 상태별 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quoteStatuses.map((status, index) => {
            const count = quotes.filter(quote => quote.status === status.value).length;
            return (
              <Card 
                key={status.value}
                className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg
                          animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-3 h-3 rounded-full ${status.color} mx-auto mb-3`}></div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{status.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 견적서 작성 폼 */}
        {showAddForm && (
          <Card className="transform transition-all duration-500 animate-slideUp bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">새 견적서 작성</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer" className="text-gray-700 dark:text-gray-300">고객</Label>
                    <Input
                      id="customer"
                      value={formData.customer}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">제목</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">총 금액</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="validUntil" className="text-gray-700 dark:text-gray-300">유효기간</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>

                {/* 품목 입력 */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-gray-700 dark:text-gray-300">견적 품목</Label>
                    <Button 
                      type="button" 
                      onClick={addItem}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      품목 추가
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <Label className="text-gray-700 dark:text-gray-300">품목명</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                            className="bg-white/50 dark:bg-gray-600/50"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700 dark:text-gray-300">수량</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                            className="bg-white/50 dark:bg-gray-600/50"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700 dark:text-gray-300">단가</Label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                            className="bg-white/50 dark:bg-gray-600/50"
                            required
                          />
                        </div>
                        <div className="flex items-end">
                          {formData.items.length > 1 && (
                            <Button 
                              type="button" 
                              onClick={() => removeItem(index)}
                              className="bg-red-500 hover:bg-red-600 text-white w-full"
                            >
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    견적서 저장
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 견적서 목록 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">견적서 목록</h2>
          
          {quotes.map((quote, index) => {
            const statusInfo = getStatusInfo(quote.status);
            return (
              <Card 
                key={quote.id}
                className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg
                          animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quote.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <div>
                          <span className="font-medium">견적번호:</span> {quote.quoteNumber}
                        </div>
                        <div>
                          <span className="font-medium">고객:</span> {quote.customer}
                        </div>
                        <div>
                          <span className="font-medium">금액:</span> ₩{quote.amount.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">유효기간:</span> {formatDate(quote.validUntil)}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        작성일: {formatDate(quote.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => exportToPDF(quote)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        PDF 내보내기
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400"
                      >
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
