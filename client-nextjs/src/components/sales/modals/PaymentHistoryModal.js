"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { Badge } from "@/components/ui/badge.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.js";
import { formatCurrency, formatDate } from "@/lib/utils/format.js";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const PAYMENT_STATUSES = {
  PENDING: { label: "대기중", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  COMPLETED: { label: "완료", color: "bg-green-100 text-green-800", icon: CheckCircle },
  FAILED: { label: "실패", color: "bg-red-100 text-red-800", icon: XCircle },
  CANCELLED: { label: "취소", color: "bg-gray-100 text-gray-800", icon: XCircle },
};

const PAYMENT_METHODS = {
  CASH: "현금",
  CARD: "카드",
  TRANSFER: "계좌이체",
  CHECK: "수표",
  OTHER: "기타",
};

export default function PaymentHistoryModal({
  isOpen = false,
  onClose = () => {},
  salesItemId = null,
  salesItem = null,
  onUpdatePayment = () => {},
  onAddPayment = () => {},
  onDeletePayment = () => {},
}) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // 새 결제 추가 폼 상태
  const [newPayment, setNewPayment] = useState({
    amount: "",
    method: "",
    status: "PENDING",
    paymentDate: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  });

  // 모달이 열릴 때 결제 내역 로드
  useEffect(() => {
    if (isOpen && salesItemId) {
      loadPaymentHistory();
    }
  }, [isOpen, salesItemId]);
  const loadPaymentHistory = async () => {
    setLoading(true);
    try {
      // 실제 프로젝트에서는 GraphQL 쿼리로 결제 내역을 로드합니다
      // 현재는 mock 데이터 사용
      const mockPayments = [
        {
          id: 1,
          amount: 50000,
          method: "CARD",
          status: "COMPLETED",
          paymentDate: "2024-06-10",
          reference: "CARD-20240610-001",
          notes: "카드 결제",
          createdAt: "2024-06-10T10:30:00Z",
        },
        {
          id: 2,
          amount: 30000,
          method: "CASH",
          status: "COMPLETED",
          paymentDate: "2024-06-12",
          reference: "CASH-20240612-001",
          notes: "현금 결제",
          createdAt: "2024-06-12T14:15:00Z",
        },
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error("결제 내역 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    try {
      const paymentData = {
        ...newPayment,
        amount: parseFloat(newPayment.amount),
        salesItemId,
      }; // 실제 프로젝트에서는 GraphQL 뮤테이션으로 결제를 추가합니다
      const newPaymentRecord = {
        id: Date.now(),
        ...paymentData,
        createdAt: new Date().toISOString(),
      };

      setPayments((prev) => [...prev, newPaymentRecord]);
      setNewPayment({
        amount: "",
        method: "",
        status: "PENDING",
        paymentDate: new Date().toISOString().split("T")[0],
        reference: "",
        notes: "",
      });
      setShowAddForm(false);

      // 상위 컴포넌트에 변경 알림
      onAddPayment(newPaymentRecord);
    } catch (error) {
      console.error("결제 추가 실패:", error);
    }
  };
  const handleDeletePayment = async (paymentId) => {
    try {
      // 실제 프로젝트에서는 GraphQL 뮤테이션으로 결제를 삭제합니다
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      onDeletePayment(paymentId);
    } catch (error) {
      console.error("결제 삭제 실패:", error);
    }
  };

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      // 실제 프로젝트에서는 GraphQL 뮤테이션으로 결제 상태를 업데이트합니다
      setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p)));
      onUpdatePayment(paymentId, { status: newStatus });
    } catch (error) {
      console.error("결제 상태 업데이트 실패:", error);
    }
  };

  // 총 결제 금액 계산
  const totalPaid = payments.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0);

  const remainingAmount = (salesItem?.totalAmount || 0) - totalPaid;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            결제 내역 관리
            {salesItem && (
              <Badge variant="outline" className="ml-2">
                {salesItem.salesItemCode || `Item #${salesItemId}`}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 결제 요약 카드 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">총 주문금액</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesItem?.totalAmount || 0)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">완료된 결제</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">대기중 결제</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">미결제 금액</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${remainingAmount > 0 ? "text-red-600" : "text-green-600"}`}>{formatCurrency(remainingAmount)}</div>
              </CardContent>
            </Card>
          </div>

          {/* 새 결제 추가 버튼 */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">결제 내역</h3>
            <Button onClick={() => setShowAddForm(!showAddForm)} size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              결제 추가
            </Button>
          </div>

          {/* 새 결제 추가 폼 */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">새 결제 추가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="amount">결제 금액</Label>
                    <Input id="amount" type="number" value={newPayment.amount} onChange={(e) => setNewPayment((prev) => ({ ...prev, amount: e.target.value }))} placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="method">결제 방법</Label>
                    <Select value={newPayment.method} onValueChange={(value) => setNewPayment((prev) => ({ ...prev, method: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="결제 방법 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentDate">결제 일자</Label>
                    <Input id="paymentDate" type="date" value={newPayment.paymentDate} onChange={(e) => setNewPayment((prev) => ({ ...prev, paymentDate: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="reference">참조번호</Label>
                    <Input id="reference" value={newPayment.reference} onChange={(e) => setNewPayment((prev) => ({ ...prev, reference: e.target.value }))} placeholder="결제 참조번호" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">메모</Label>
                  <Input id="notes" value={newPayment.notes} onChange={(e) => setNewPayment((prev) => ({ ...prev, notes: e.target.value }))} placeholder="결제 관련 메모" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddPayment} disabled={!newPayment.amount || !newPayment.method}>
                    결제 추가
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 결제 내역 목록 */}
          <div className="space-y-3">
            {loading ? (
              <div className="py-8 text-center">로딩 중...</div>
            ) : payments.length === 0 ? (
              <div className="py-8 text-center text-gray-500">등록된 결제 내역이 없습니다.</div>
            ) : (
              payments.map((payment) => {
                const statusInfo = PAYMENT_STATUSES[payment.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{formatCurrency(payment.amount)}</div>
                              <div className="text-sm text-gray-500">
                                {PAYMENT_METHODS[payment.method]} • {formatDate(payment.paymentDate)}
                              </div>
                            </div>
                          </div>

                          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>

                          {payment.reference && <Badge variant="outline">{payment.reference}</Badge>}
                        </div>

                        <div className="flex items-center gap-2">
                          <Select value={payment.status} onValueChange={(value) => handleStatusChange(payment.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(PAYMENT_STATUSES).map(([key, info]) => (
                                <SelectItem key={key} value={key}>
                                  {info.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button variant="ghost" size="sm" onClick={() => handleDeletePayment(payment.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {payment.notes && <div className="p-2 mt-2 text-sm text-gray-600 rounded bg-gray-50">{payment.notes}</div>}
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

PaymentHistoryModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  salesItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  salesItem: PropTypes.object,
  onUpdatePayment: PropTypes.func,
  onAddPayment: PropTypes.func,
  onDeletePayment: PropTypes.func,
};
