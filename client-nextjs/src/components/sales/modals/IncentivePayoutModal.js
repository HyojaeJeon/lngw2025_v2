"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { Badge } from "@/components/ui/badge.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import { Award, DollarSign, Plus, Trash2, CheckCircle, Clock, XCircle, Calculator, Users } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/format.js";

const PAYOUT_STATUSES = {
  PENDING: { label: "대기중", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  APPROVED: { label: "승인", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  PAID: { label: "지급완료", color: "bg-green-100 text-green-800", icon: CheckCircle },
  REJECTED: { label: "거부", color: "bg-red-100 text-red-800", icon: XCircle },
  CANCELLED: { label: "취소", color: "bg-gray-100 text-gray-800", icon: XCircle }
};

const INCENTIVE_TYPES = {
  A: "인센티브 A",
  B: "인센티브 B",
  BONUS: "보너스",
  COMMISSION: "커미션"
};

export default function IncentivePayoutModal({ 
  isOpen = false, 
  onClose = () => {}, 
  salesItemId = null,
  salesItem = null,
  salesReps = [],
  onUpdatePayout = () => {},
  onAddPayout = () => {},
  onDeletePayout = () => {}
}) {
  const { t } = useTranslation();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // 새 인센티브 지급 폼 상태
  const [newPayout, setNewPayout] = useState({
    salesRepId: "",
    incentiveType: "A",
    baseAmount: "",
    rate: "",
    calculatedAmount: "",
    manualAmount: "",
    useManualAmount: false,
    payoutDate: new Date().toISOString().split('T')[0],
    status: "PENDING",
    notes: ""
  });

  // 모달이 열릴 때 인센티브 지급 내역 로드
  useEffect(() => {
    if (isOpen && salesItemId) {
      loadIncentivePayouts();
    }
  }, [isOpen, salesItemId]);

  // 인센티브 자동 계산
  useEffect(() => {
    if (newPayout.baseAmount && newPayout.rate && !newPayout.useManualAmount) {
      const calculated = (parseFloat(newPayout.baseAmount) * parseFloat(newPayout.rate)) / 100;
      setNewPayout(prev => ({
        ...prev,
        calculatedAmount: calculated.toString()
      }));
    }
  }, [newPayout.baseAmount, newPayout.rate, newPayout.useManualAmount]);

  const loadIncentivePayouts = async () => {
    setLoading(true);
    try {
      // TODO: GraphQL 쿼리로 실제 인센티브 지급 내역 로드
      // 현재는 mock 데이터 사용
      const mockPayouts = [
        {
          id: 1,
          salesRepId: 1,
          salesRepName: "김영업",
          incentiveType: "A",
          baseAmount: 100000,
          rate: 5,
          calculatedAmount: 5000,
          finalAmount: 5000,
          payoutDate: "2024-06-15",
          status: "APPROVED",
          notes: "월 인센티브 A",
          createdAt: "2024-06-10T10:30:00Z"
        },
        {
          id: 2,
          salesRepId: 2,
          salesRepName: "이판매",
          incentiveType: "B",
          baseAmount: 150000,
          rate: 3,
          calculatedAmount: 4500,
          finalAmount: 5000,
          payoutDate: "2024-06-15",
          status: "PENDING",
          notes: "추가 보너스 적용",
          createdAt: "2024-06-12T14:15:00Z"
        }
      ];
      setPayouts(mockPayouts);
    } catch (error) {
      console.error("인센티브 지급 내역 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayout = async () => {
    try {
      const finalAmount = newPayout.useManualAmount 
        ? parseFloat(newPayout.manualAmount)
        : parseFloat(newPayout.calculatedAmount);

      const selectedSalesRep = salesReps.find(rep => rep.id === parseInt(newPayout.salesRepId));

      const payoutData = {
        ...newPayout,
        baseAmount: parseFloat(newPayout.baseAmount),
        rate: parseFloat(newPayout.rate),
        calculatedAmount: parseFloat(newPayout.calculatedAmount),
        finalAmount,
        salesItemId,
        salesRepName: selectedSalesRep?.name || "Unknown"
      };

      // TODO: GraphQL 뮤테이션으로 실제 인센티브 지급 추가
      const newPayoutRecord = {
        id: Date.now(),
        ...payoutData,
        createdAt: new Date().toISOString()
      };

      setPayouts(prev => [...prev, newPayoutRecord]);
      setNewPayout({
        salesRepId: "",
        incentiveType: "A",
        baseAmount: "",
        rate: "",
        calculatedAmount: "",
        manualAmount: "",
        useManualAmount: false,
        payoutDate: new Date().toISOString().split('T')[0],
        status: "PENDING",
        notes: ""
      });
      setShowAddForm(false);
      
      // 상위 컴포넌트에 변경 알림
      onAddPayout(newPayoutRecord);
    } catch (error) {
      console.error("인센티브 지급 추가 실패:", error);
    }
  };

  const handleDeletePayout = async (payoutId) => {
    try {
      // TODO: GraphQL 뮤테이션으로 실제 인센티브 지급 삭제
      setPayouts(prev => prev.filter(p => p.id !== payoutId));
      onDeletePayout(payoutId);
    } catch (error) {
      console.error("인센티브 지급 삭제 실패:", error);
    }
  };

  const handleStatusChange = async (payoutId, newStatus) => {
    try {
      // TODO: GraphQL 뮤테이션으로 실제 인센티브 지급 상태 업데이트
      setPayouts(prev => 
        prev.map(p => p.id === payoutId ? { ...p, status: newStatus } : p)
      );
      onUpdatePayout(payoutId, { status: newStatus });
    } catch (error) {
      console.error("인센티브 지급 상태 업데이트 실패:", error);
    }
  };

  // 자동 계산 함수들
  const calculateIncentiveFromSalesItem = () => {
    if (!salesItem) return;
    
    // salesList.md 요구사항에 따른 자동 계산
    const productIncentiveA = salesItem.productIncentiveA || 0;
    const productIncentiveB = salesItem.productIncentiveB || 0;
    const quantity = salesItem.quantity || 1;
    const totalAmount = salesItem.totalAmount || 0;

    setNewPayout(prev => ({
      ...prev,
      baseAmount: totalAmount.toString(),
      rate: newPayout.incentiveType === "A" ? 
        ((productIncentiveA / totalAmount) * 100).toFixed(2) :
        ((productIncentiveB / totalAmount) * 100).toFixed(2)
    }));
  };

  // 총 인센티브 계산
  const totalPending = payouts
    .filter(p => p.status === "PENDING" || p.status === "APPROVED")
    .reduce((sum, p) => sum + p.finalAmount, 0);

  const totalPaid = payouts
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + p.finalAmount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            인센티브 지급 관리
            {salesItem && (
              <Badge variant="outline" className="ml-2">
                {salesItem.salesItemCode || `Item #${salesItemId}`}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 인센티브 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">매출 기준금액</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(salesItem?.totalAmount || 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">지급 예정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalPending)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">지급 완료</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPaid)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">제품 인센티브</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <div>A: {formatCurrency(salesItem?.productIncentiveA || 0)}</div>
                  <div>B: {formatCurrency(salesItem?.productIncentiveB || 0)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 새 인센티브 지급 추가 버튼 */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">인센티브 지급 내역</h3>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              인센티브 지급 추가
            </Button>
          </div>

          {/* 새 인센티브 지급 추가 폼 */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  새 인센티브 지급 추가
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={calculateIncentiveFromSalesItem}
                    className="ml-auto"
                  >
                    <Calculator className="h-4 w-4 mr-1" />
                    자동 계산
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salesRep">영업담당자</Label>
                    <Select 
                      value={newPayout.salesRepId} 
                      onValueChange={(value) => setNewPayout(prev => ({...prev, salesRepId: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="담당자 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {salesReps.map((rep) => (
                          <SelectItem key={rep.id} value={rep.id.toString()}>
                            {rep.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="incentiveType">인센티브 유형</Label>
                    <Select 
                      value={newPayout.incentiveType} 
                      onValueChange={(value) => setNewPayout(prev => ({...prev, incentiveType: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(INCENTIVE_TYPES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="payoutDate">지급 예정일</Label>
                    <Input
                      id="payoutDate"
                      type="date"
                      value={newPayout.payoutDate}
                      onChange={(e) => setNewPayout(prev => ({...prev, payoutDate: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="baseAmount">기준 금액</Label>
                    <Input
                      id="baseAmount"
                      type="number"
                      value={newPayout.baseAmount}
                      onChange={(e) => setNewPayout(prev => ({...prev, baseAmount: e.target.value}))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate">인센티브율 (%)</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.1"
                      value={newPayout.rate}
                      onChange={(e) => setNewPayout(prev => ({...prev, rate: e.target.value}))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="calculatedAmount">계산된 금액</Label>
                    <Input
                      id="calculatedAmount"
                      type="number"
                      value={newPayout.calculatedAmount}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newPayout.useManualAmount}
                      onChange={(e) => setNewPayout(prev => ({...prev, useManualAmount: e.target.checked}))}
                    />
                    수동 금액 입력
                  </label>
                  {newPayout.useManualAmount && (
                    <div className="flex-1 max-w-xs">
                      <Input
                        type="number"
                        value={newPayout.manualAmount}
                        onChange={(e) => setNewPayout(prev => ({...prev, manualAmount: e.target.value}))}
                        placeholder="수동 입력 금액"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">메모</Label>
                  <Input
                    id="notes"
                    value={newPayout.notes}
                    onChange={(e) => setNewPayout(prev => ({...prev, notes: e.target.value}))}
                    placeholder="인센티브 지급 관련 메모"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddPayout} 
                    disabled={!newPayout.salesRepId || (!newPayout.calculatedAmount && !newPayout.manualAmount)}
                  >
                    인센티브 지급 추가
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 인센티브 지급 내역 목록 */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">로딩 중...</div>
            ) : payouts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">등록된 인센티브 지급 내역이 없습니다.</div>
            ) : (
              payouts.map((payout) => {
                const statusInfo = PAYOUT_STATUSES[payout.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <Card key={payout.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {payout.salesRepName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {INCENTIVE_TYPES[payout.incentiveType]} • {formatDate(payout.payoutDate)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium">
                              {formatCurrency(payout.finalAmount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              기준: {formatCurrency(payout.baseAmount)} × {payout.rate}%
                            </div>
                          </div>
                          
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Select 
                            value={payout.status} 
                            onValueChange={(value) => handleStatusChange(payout.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(PAYOUT_STATUSES).map(([key, info]) => (
                                <SelectItem key={key} value={key}>{info.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePayout(payout.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {payout.notes && (
                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {payout.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
