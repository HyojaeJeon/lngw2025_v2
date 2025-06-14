
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CUSTOMER_GRADES, GET_CUSTOMER_GRADE_STATS } from '@/lib/graphql/customerOperations';
import { CREATE_GRADE_RULE, UPDATE_GRADE_RULE, DELETE_GRADE_RULE } from '@/lib/graphql/customerOperations';
import { useTranslation } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus, TrendingUp, Users, Award } from 'lucide-react';

const CustomerGradesPage = () => {
  const { t } = useTranslation();
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    minPurchaseAmount: 0,
    minPurchaseCount: 0,
    benefits: '',
    discountRate: 0,
    description: ''
  });

  // GraphQL 쿼리
  const { data: gradesData, loading: gradesLoading, refetch: refetchGrades } = useQuery(GET_CUSTOMER_GRADES);
  const { data: statsData, loading: statsLoading } = useQuery(GET_CUSTOMER_GRADE_STATS);

  // GraphQL 뮤테이션
  const [createGradeRule] = useMutation(CREATE_GRADE_RULE, {
    onCompleted: () => {
      refetchGrades();
      setIsModalOpen(false);
      resetForm();
    }
  });

  const [updateGradeRule] = useMutation(UPDATE_GRADE_RULE, {
    onCompleted: () => {
      refetchGrades();
      setIsModalOpen(false);
      resetForm();
    }
  });

  const [deleteGradeRule] = useMutation(DELETE_GRADE_RULE, {
    onCompleted: () => {
      refetchGrades();
    }
  });

  const resetForm = () => {
    setFormData({
      grade: '',
      minPurchaseAmount: 0,
      minPurchaseCount: 0,
      benefits: '',
      discountRate: 0,
      description: ''
    });
    setSelectedGrade(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedGrade) {
        await updateGradeRule({
          variables: {
            id: selectedGrade.id,
            input: formData
          }
        });
      } else {
        await createGradeRule({
          variables: {
            input: formData
          }
        });
      }
    } catch (error) {
      console.error('Grade rule save error:', error);
    }
  };

  const handleEdit = (grade) => {
    setSelectedGrade(grade);
    setFormData({
      grade: grade.grade || '',
      minPurchaseAmount: grade.minPurchaseAmount || 0,
      minPurchaseCount: grade.minPurchaseCount || 0,
      benefits: grade.benefits || '',
      discountRate: grade.discountRate || 0,
      description: grade.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        await deleteGradeRule({
          variables: { id }
        });
      } catch (error) {
        console.error('Grade rule delete error:', error);
      }
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'BRONZE': 'bg-orange-100 text-orange-800',
      'SILVER': 'bg-gray-100 text-gray-800',
      'GOLD': 'bg-yellow-100 text-yellow-800',
      'PLATINUM': 'bg-purple-100 text-purple-800',
      'DIAMOND': 'bg-blue-100 text-blue-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  if (gradesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('customer.gradeManagement')}</h1>
          <p className="text-gray-600">{t('customer.gradeManagementDescription')}</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('customer.addGradeRule')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedGrade ? t('customer.editGradeRule') : t('customer.addGradeRule')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="grade">{t('customer.grade')}</Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('customer.selectGrade')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRONZE">Bronze</SelectItem>
                    <SelectItem value="SILVER">Silver</SelectItem>
                    <SelectItem value="GOLD">Gold</SelectItem>
                    <SelectItem value="PLATINUM">Platinum</SelectItem>
                    <SelectItem value="DIAMOND">Diamond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="minPurchaseAmount">{t('customer.minPurchaseAmount')}</Label>
                <Input
                  id="minPurchaseAmount"
                  type="number"
                  value={formData.minPurchaseAmount}
                  onChange={(e) => setFormData({...formData, minPurchaseAmount: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="minPurchaseCount">{t('customer.minPurchaseCount')}</Label>
                <Input
                  id="minPurchaseCount"
                  type="number"
                  value={formData.minPurchaseCount}
                  onChange={(e) => setFormData({...formData, minPurchaseCount: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="discountRate">{t('customer.discountRate')} (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  step="0.1"
                  value={formData.discountRate}
                  onChange={(e) => setFormData({...formData, discountRate: parseFloat(e.target.value) || 0})}
                  placeholder="0.0"
                />
              </div>

              <div>
                <Label htmlFor="benefits">{t('customer.benefits')}</Label>
                <Input
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  placeholder={t('customer.benefitsPlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="description">{t('common.description')}</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={t('common.descriptionPlaceholder')}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {selectedGrade ? t('common.update') : t('common.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('common.overview')}</TabsTrigger>
          <TabsTrigger value="rules">{t('customer.gradeRules')}</TabsTrigger>
          <TabsTrigger value="history">{t('customer.gradeHistory')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('customer.totalCustomers')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData?.customerGradeStats?.totalCustomers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t('customer.activeCustomers')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('customer.averageGrade')}</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData?.customerGradeStats?.averageGrade || 'BRONZE'}</div>
                <p className="text-xs text-muted-foreground">
                  {t('customer.currentAverageGrade')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('customer.monthlyPromotions')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData?.customerGradeStats?.monthlyPromotions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t('customer.thisMonth')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 등급별 분포 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('customer.gradeDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statsData?.customerGradeStats?.gradeDistribution?.map((grade) => (
                  <div key={grade.grade} className="text-center">
                    <Badge className={`${getGradeColor(grade.grade)} mb-2`}>
                      {grade.grade}
                    </Badge>
                    <div className="text-2xl font-bold">{grade.count}</div>
                    <div className="text-sm text-gray-600">
                      {((grade.count / (statsData?.customerGradeStats?.totalCustomers || 1)) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('customer.gradeRules')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradesData?.customerGrades?.map((grade) => (
                  <div key={grade.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getGradeColor(grade.grade)}>
                            {grade.grade}
                          </Badge>
                          <span className="font-medium">{grade.description}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">{t('customer.minPurchaseAmount')}:</span>
                            <div>${grade.minPurchaseAmount?.toLocaleString() || 0}</div>
                          </div>
                          <div>
                            <span className="font-medium">{t('customer.minPurchaseCount')}:</span>
                            <div>{grade.minPurchaseCount || 0}회</div>
                          </div>
                          <div>
                            <span className="font-medium">{t('customer.discountRate')}:</span>
                            <div>{grade.discountRate || 0}%</div>
                          </div>
                          <div>
                            <span className="font-medium">{t('customer.benefits')}:</span>
                            <div>{grade.benefits || '-'}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(grade)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(grade.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('customer.gradeHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                {t('common.comingSoon')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerGradesPage;
