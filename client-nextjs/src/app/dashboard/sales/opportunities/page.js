
"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { GET_SALES_OPPORTUNITIES, GET_CUSTOMERS } from "@/lib/graphql/queries.js";
import { CREATE_SALES_OPPORTUNITY, UPDATE_SALES_OPPORTUNITY, DELETE_SALES_OPPORTUNITY } from "@/lib/graphql/mutations.js";
import { useLanguage } from "@/contexts/languageContext.js";

export default function SalesOpportunitiesPage() {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    customerId: '',
    expectedAmount: '',
    expectedCloseDate: '',
    stage: 'prospect',
    notes: ''
  });

  const { data: opportunitiesData, loading: opportunitiesLoading, refetch } = useQuery(GET_SALES_OPPORTUNITIES);
  const { data: customersData } = useQuery(GET_CUSTOMERS);

  const [createOpportunity] = useMutation(CREATE_SALES_OPPORTUNITY);
  const [updateOpportunity] = useMutation(UPDATE_SALES_OPPORTUNITY);
  const [deleteOpportunity] = useMutation(DELETE_SALES_OPPORTUNITY);

  const opportunities = opportunitiesData?.salesOpportunities || [];
  const customers = customersData?.customers || [];

  const stages = [
    { value: 'prospect', label: { ko: '잠재고객', vi: 'Khách hàng tiềm năng', en: 'Prospect' }, color: 'bg-gray-500' },
    { value: 'qualification', label: { ko: '자격심사', vi: 'Đánh giá', en: 'Qualification' }, color: 'bg-blue-500' },
    { value: 'proposal', label: { ko: '제안', vi: 'Đề xuất', en: 'Proposal' }, color: 'bg-yellow-500' },
    { value: 'negotiation', label: { ko: '협상', vi: 'Đàm phán', en: 'Negotiation' }, color: 'bg-orange-500' },
    { value: 'closed_won', label: { ko: '성사', vi: 'Thành công', en: 'Closed Won' }, color: 'bg-green-500' },
    { value: 'closed_lost', label: { ko: '실패', vi: 'Thất bại', en: 'Closed Lost' }, color: 'bg-red-500' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOpportunity) {
        await updateOpportunity({
          variables: {
            id: editingOpportunity.id,
            input: {
              ...formData,
              expectedAmount: parseFloat(formData.expectedAmount),
              customerId: parseInt(formData.customerId)
            }
          }
        });
      } else {
        await createOpportunity({
          variables: {
            input: {
              ...formData,
              expectedAmount: parseFloat(formData.expectedAmount),
              customerId: parseInt(formData.customerId)
            }
          }
        });
      }
      
      setFormData({
        title: '',
        customerId: '',
        expectedAmount: '',
        expectedCloseDate: '',
        stage: 'prospect',
        notes: ''
      });
      setShowAddForm(false);
      setEditingOpportunity(null);
      refetch();
    } catch (error) {
      console.error('Error saving opportunity:', error);
    }
  };

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      customerId: opportunity.customerId?.toString() || '',
      expectedAmount: opportunity.expectedAmount?.toString() || '',
      expectedCloseDate: opportunity.expectedCloseDate || '',
      stage: opportunity.stage,
      notes: opportunity.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteOpportunity({ variables: { id } });
        refetch();
      } catch (error) {
        console.error('Error deleting opportunity:', error);
      }
    }
  };

  const getStageInfo = (stage) => stages.find(s => s.value === stage) || stages[0];

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
                {t('sales.opportunities')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                영업 기회를 등록하고 관리하세요
              </p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                        text-white shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              영업기회 추가
            </Button>
          </div>
        </div>

        {/* 추가/편집 폼 */}
        {showAddForm && (
          <Card className="transform transition-all duration-500 animate-slideUp bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                {editingOpportunity ? '영업기회 수정' : '새 영업기회 추가'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="customerId" className="text-gray-700 dark:text-gray-300">고객</Label>
                    <select
                      id="customerId"
                      value={formData.customerId}
                      onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                      className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600"
                      required
                    >
                      <option value="">고객 선택</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="expectedAmount" className="text-gray-700 dark:text-gray-300">예상 금액</Label>
                    <Input
                      id="expectedAmount"
                      type="number"
                      value={formData.expectedAmount}
                      onChange={(e) => setFormData({...formData, expectedAmount: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <Label htmlFor="expectedCloseDate" className="text-gray-700 dark:text-gray-300">예상 종료일</Label>
                    <Input
                      id="expectedCloseDate"
                      type="date"
                      value={formData.expectedCloseDate}
                      onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})}
                      className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stage" className="text-gray-700 dark:text-gray-300">단계</Label>
                    <select
                      id="stage"
                      value={formData.stage}
                      onChange={(e) => setFormData({...formData, stage: e.target.value})}
                      className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600"
                    >
                      {stages.map(stage => (
                        <option key={stage.value} value={stage.value}>
                          {stage.label.ko}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">메모</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {editingOpportunity ? '수정' : '추가'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingOpportunity(null);
                      setFormData({
                        title: '',
                        customerId: '',
                        expectedAmount: '',
                        expectedCloseDate: '',
                        stage: 'prospect',
                        notes: ''
                      });
                    }}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 영업기회 목록 */}
        <div className="grid grid-cols-1 gap-4">
          {opportunitiesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : opportunities.length > 0 ? (
            opportunities.map((opportunity, index) => {
              const stageInfo = getStageInfo(opportunity.stage);
              const customer = customers.find(c => c.id === opportunity.customerId);
              
              return (
                <Card 
                  key={opportunity.id}
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
                            {opportunity.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${stageInfo.color}`}>
                            {stageInfo.label.ko}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="font-medium">고객:</span> {customer?.companyName || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">예상 금액:</span> 
                            {opportunity.expectedAmount ? `₩${opportunity.expectedAmount.toLocaleString()}` : 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">예상 종료일:</span> 
                            {opportunity.expectedCloseDate ? new Date(opportunity.expectedCloseDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        
                        {opportunity.notes && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {opportunity.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(opportunity)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400"
                        >
                          수정
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(opportunity.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">등록된 영업기회가 없습니다.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
