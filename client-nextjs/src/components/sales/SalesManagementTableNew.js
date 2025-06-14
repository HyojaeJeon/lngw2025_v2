"use client";

import { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Badge } from "@/components/ui/badge.js";
import {         <CustomAsyncSelectCell
          value={item.product?.id}
          displayValue={item.product?.name}
          options={products.filter((p) => !item.categoryId || p.categoryId === item.categoryId)}
          onChange={(value) => {
            handleCellUpdate(item.id, "productId", value);
            // 제품 변경 시 모델 초기화 및 기본값 설정
            handleCellUpdate(item.id, "productModelId", null);
            autoFillProductDefaults(item.id, value, null);
          }}
          searchable
          placeholder="제품명 선택"
          disabled={!item.categoryId}
        />components/ui/button.js";
import ColumnHeaderFilter from "./cells/ColumnHeaderFilter.js";
import CustomAsyncSelectCell from "./cells/CustomAsyncSelectCell.js";
import CustomSelectCell from "./cells/CustomSelectCell.js";
import DatePickerCell from "./cells/DatePickerCell.js";
import NumberInputCell from "./cells/NumberInputCell.js";
import TextInputCell from "./cells/TextInputCell.js";
import PaymentHistoryModal from "./modals/PaymentHistoryModal.js";
import IncentivePayoutModal from "./modals/IncentivePayoutModal.js";
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, DollarSign, Award } from "lucide-react";

export default function SalesManagementTable({
  salesItems = [],
  loading = false,
  pagination = {},
  sortConfig = {},
  selectedItems = [],
  salesReps = [],
  customers = [],
  products = [],
  categories = [],
  productModels = [],
  onSortChange = () => {},
  onPageChange = () => {},
  onSelectionChange = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onBulkUpdate = () => {},
  onUpdate = () => {},
}) {
  const [editingCells, setEditingCells] = useState({});
  const [columnFilters, setColumnFilters] = useState({});

  // Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [incentiveModalOpen, setIncentiveModalOpen] = useState(false);
  const [selectedSalesItemId, setSelectedSalesItemId] = useState(null);

  // Helper functions
  const getPaymentStatusBadge = (status) => {
    if (status === "PAID") return { variant: "success", text: "결제완료" };
    if (status === "PARTIAL_PAID") return { variant: "warning", text: "부분결제" };
    return { variant: "destructive", text: "미결제" };
  };

  // salesList.md 요구사항에 따른 컬럼 정의
  const columns = [
    {
      key: "select",
      label: "",
      width: "50px",
      sortable: false,
      filterable: false,
      render: (item) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={(e) => {
            if (e.target.checked) {
              onSelectionChange([...selectedItems, item.id]);
            } else {
              onSelectionChange(selectedItems.filter((id) => id !== item.id));
            }
          }}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
    },
    {
      key: "salesDate",
      label: "일시",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <DatePickerCell
          value={item.salesDate}
          onSave={(value) => handleCellUpdate(item.id, "salesDate", value)}
          isEditing={editingCells[`${item.id}-salesDate`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-salesDate`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-salesDate`]: false })}
        />
      ),
    },
    {
      key: "salesRep",
      label: "영업사원",
      width: "150px",
      sortable: true,
      filterable: true,      render: (item) => (
        <CustomAsyncSelectCell
          value={item.salesRep?.id}
          displayValue={item.salesRep?.name}
          options={salesReps}
          onChange={(value) => handleCellUpdate(item.id, "salesRepId", value)}
          searchable
          placeholder="영업사원 선택"
        />
      ),
    },
    {
      key: "type",
      label: "구분",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomSelectCell
          value={item.type}
          options={[
            { id: "SALE", name: "판매" },
            { id: "SAMPLE", name: "샘플" },
            { id: "DEFECTIVE", name: "불량/파손" },
          ]}
          onSave={(value) => handleCellUpdate(item.id, "type", value)}
          isEditing={editingCells[`${item.id}-type`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-type`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-type`]: false })}
          placeholder="구분 선택"
        />
      ),
    },
    {
      key: "customer",
      label: "고객사",
      width: "200px",
      sortable: true,
      filterable: true,
      render: (item) => (        <CustomAsyncSelectCell
          value={item.customer?.id}
          displayValue={item.customer?.companyName || item.customer?.name}
          options={customers}
          onChange={(value) => handleCellUpdate(item.id, "customerId", value)}
          searchable
          placeholder="고객사 선택"
        />
      ),
    },
    {
      key: "category",
      label: "품목(Category)",
      width: "150px",
      sortable: true,
      filterable: true,
      render: (item) => (        <CustomAsyncSelectCell
          value={item.category?.id}
          displayValue={item.category?.name}
          options={categories}
          onChange={(value) => {
            handleCellUpdate(item.id, "categoryId", value);
            // 카테고리 변경 시 제품 및 모델 초기화
            handleCellUpdate(item.id, "productId", null);
            handleCellUpdate(item.id, "productModelId", null);
          }}
          searchable
          placeholder="품목 선택"
        />
      ),
    },
    {
      key: "product",
      label: "제품명",
      width: "180px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomAsyncSelectCell
          value={item.product?.id}
          displayValue={item.product?.name}
          options={products.filter((p) => p.categoryId === item.categoryId)}
          onSave={(value) => {
            handleCellUpdate(item.id, "productId", value);
            // 제품 변경 시 모델 초기화 및 기본값 설정
            handleCellUpdate(item.id, "productModelId", null);
            autoFillProductDefaults(item.id, value, null);
          }}
          isEditing={editingCells[`${item.id}-product`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-product`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-product`]: false })}
          searchable
          placeholder="제품명 선택"
          disabled={!item.categoryId}
        />
      ),
    },
    {
      key: "productModel",
      label: "모델명",
      width: "150px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomAsyncSelectCell
          value={item.productModel?.id}
          displayValue={item.productModel?.name || item.productModel?.modelName}
          options={productModels.filter((pm) => pm.productId === item.productId)}
          onSave={(value) => {
            handleCellUpdate(item.id, "productModelId", value);
            // 모델 변경 시 기본값 설정
            autoFillProductDefaults(item.id, item.productId, value);
          }}
          isEditing={editingCells[`${item.id}-productModel`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-productModel`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-productModel`]: false })}
          searchable
          placeholder="모델명 선택"
          disabled={!item.productId}
        />
      ),
    },
    {
      key: "quantity",
      label: "수량",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.quantity}
          onSave={(value) => {
            handleCellUpdate(item.id, "quantity", value);
            // 수량 변경 시 자동 계산
            recalculateItem(item.id, { quantity: value });
          }}
          isEditing={editingCells[`${item.id}-quantity`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-quantity`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-quantity`]: false })}
          min={1}
          integer
          formatNumber
        />
      ),
    },
    {
      key: "consumerPrice",
      label: "소비자가",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.consumerPrice}
          onSave={(value) => {
            handleCellUpdate(item.id, "consumerPrice", value);
            // 소비자가 변경 시 할인율 재계산
            recalculateItem(item.id, { consumerPrice: value });
          }}
          isEditing={editingCells[`${item.id}-consumerPrice`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-consumerPrice`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-consumerPrice`]: false })}
          min={0}
          formatNumber
          currency
        />
      ),
    },
    {
      key: "unitPrice",
      label: "단가",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.unitPrice}
          onSave={(value) => {
            handleCellUpdate(item.id, "unitPrice", value);
            // 단가 변경 시 합계 및 마진 재계산
            recalculateItem(item.id, { unitPrice: value });
          }}
          isEditing={editingCells[`${item.id}-unitPrice`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-unitPrice`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-unitPrice`]: false })}
          min={0}
          formatNumber
          currency
        />
      ),
    },
    {
      key: "totalPrice",
      label: "합계",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.totalPrice}
          onSave={(value) => {
            handleCellUpdate(item.id, "totalPrice", value);
            // 합계 직접 수정 시 단가 역계산
            const newUnitPrice = item.quantity > 0 ? value / item.quantity : 0;
            handleCellUpdate(item.id, "unitPrice", newUnitPrice);
            recalculateItem(item.id, { totalPrice: value, unitPrice: newUnitPrice });
          }}
          isEditing={editingCells[`${item.id}-totalPrice`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-totalPrice`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-totalPrice`]: false })}
          min={0}
          formatNumber
          currency
        />
      ),
    },
    {
      key: "paymentStatus",
      label: "결제여부",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => {
        const statusInfo = getPaymentStatusBadge(item.paymentStatus);
        return (
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
          </div>
        );
      },
    },
    {
      key: "paymentHistory",
      label: "결제내역",
      width: "100px",
      sortable: false,
      filterable: false,
      render: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedSalesItemId(item.id);
            setPaymentModalOpen(true);
          }}
          className="h-8 w-8 p-0"
        >
          <DollarSign className="h-4 w-4" />
        </Button>
      ),
    },
    {
      key: "discountRate",
      label: "할인율(%)",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.discountRate}
          onSave={(value) => {
            handleCellUpdate(item.id, "discountRate", value);
            // 할인율 변경 시 단가 역계산
            if (item.consumerPrice > 0) {
              const newUnitPrice = item.consumerPrice * (1 - value / 100);
              handleCellUpdate(item.id, "unitPrice", newUnitPrice);
              recalculateItem(item.id, { discountRate: value, unitPrice: newUnitPrice });
            }
          }}
          isEditing={editingCells[`${item.id}-discountRate`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-discountRate`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-discountRate`]: false })}
          min={0}
          max={100}
          step={0.1}
          formatNumber
          suffix="%"
        />
      ),
    },
    {
      key: "productIncentiveA",
      label: "인센티브 A",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.productIncentiveA}
          onSave={(value) => {
            handleCellUpdate(item.id, "productIncentiveA", value);
            recalculateItem(item.id, { productIncentiveA: value });
          }}
          isEditing={editingCells[`${item.id}-productIncentiveA`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-productIncentiveA`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-productIncentiveA`]: false })}
          min={0}
          formatNumber
          currency
        />
      ),
    },
    {
      key: "productIncentiveB",
      label: "인센티브 B",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.productIncentiveB}
          onSave={(value) => {
            handleCellUpdate(item.id, "productIncentiveB", value);
            recalculateItem(item.id, { productIncentiveB: value });
          }}
          isEditing={editingCells[`${item.id}-productIncentiveB`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-productIncentiveB`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-productIncentiveB`]: false })}
          min={0}
          formatNumber
          currency
        />
      ),
    },
    {
      key: "incentiveStatus",
      label: "인센 지급여부",
      width: "120px",
      sortable: false,
      filterable: false,
      render: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedSalesItemId(item.id);
            setIncentiveModalOpen(true);
          }}
          className="h-8 w-8 p-0"
        >
          <Award className="h-4 w-4" />
        </Button>
      ),
    },
    {
      key: "shippingCost",
      label: "배송료",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.shippingCost || item.deliveryFee}
          onSave={(value) => {
            handleCellUpdate(item.id, "shippingCost", value);
            handleCellUpdate(item.id, "deliveryFee", value); // 호환성
            recalculateItem(item.id, { shippingCost: value });
          }}
          isEditing={editingCells[`${item.id}-shippingCost`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-shippingCost`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-shippingCost`]: false })}
          min={0}
          formatNumber
          currency
        />
      ),
    },
    {
      key: "otherCosts",
      label: "기타비용",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.otherCosts}
          onSave={(value) => {
            handleCellUpdate(item.id, "otherCosts", value);
            recalculateItem(item.id, { otherCosts: value });
          }}
          isEditing={editingCells[`${item.id}-otherCosts`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-otherCosts`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-otherCosts`]: false })}
          min={0}
          formatNumber
          currency
        />
      ),
    },
    {
      key: "adjustedUnitCost",
      label: "원가",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.adjustedUnitCost || item.cost}
          onSave={(value) => {
            handleCellUpdate(item.id, "adjustedUnitCost", value);
            handleCellUpdate(item.id, "cost", value); // 호환성
            recalculateItem(item.id, { adjustedUnitCost: value, cost: value });
          }}
          isEditing={editingCells[`${item.id}-adjustedUnitCost`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-adjustedUnitCost`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-adjustedUnitCost`]: false })}
          min={0}
          formatNumber
          currency
        />
      ),
    },
    {
      key: "margin",
      label: "마진",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => {
        // 마진 = 단가 - 원가
        const margin = (item.unitPrice || 0) - (item.adjustedUnitCost || item.cost || 0);
        return <div className={`text-right ${margin >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(margin)}</div>;
      },
    },
    {
      key: "totalCost",
      label: "원가합",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => {
        // 원가합 = 원가 * 수량
        const totalCost = (item.adjustedUnitCost || item.cost || 0) * (item.quantity || 0);
        return <div className="text-right">{formatCurrency(totalCost)}</div>;
      },
    },
    {
      key: "finalMargin",
      label: "마진합",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => {
        // 마진합 = (단가 * 수량) - ((원가 * 수량) + 기타비용 + 배송료 + 인센티브 A + 인센티브 B)
        const totalRevenue = (item.unitPrice || 0) * (item.quantity || 0);
        const totalCost = (item.adjustedUnitCost || item.cost || 0) * (item.quantity || 0);
        const totalExpenses = totalCost + (item.otherCosts || 0) + (item.shippingCost || item.deliveryFee || 0) + (item.productIncentiveA || 0) + (item.productIncentiveB || 0);
        const finalMargin = totalRevenue - totalExpenses;

        return <div className={`text-right font-medium ${finalMargin >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(finalMargin)}</div>;
      },
    },
    {
      key: "marginRate",
      label: "마진요율(%)",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => {
        // 마진요율 = (마진합 / 합계) * 100
        const totalRevenue = (item.unitPrice || 0) * (item.quantity || 0);
        const totalCost = (item.adjustedUnitCost || item.cost || 0) * (item.quantity || 0);
        const totalExpenses = totalCost + (item.otherCosts || 0) + (item.shippingCost || item.deliveryFee || 0) + (item.productIncentiveA || 0) + (item.productIncentiveB || 0);
        const finalMargin = totalRevenue - totalExpenses;
        const marginRate = totalRevenue > 0 ? (finalMargin / totalRevenue) * 100 : 0;

        return <div className={`text-right ${marginRate >= 0 ? "text-green-600" : "text-red-600"}`}>{marginRate.toFixed(2)}%</div>;
      },
    },
    {
      key: "notes",
      label: "비고",
      width: "200px",
      sortable: false,
      filterable: true,
      render: (item) => (
        <TextInputCell
          value={item.notes}
          onSave={(value) => handleCellUpdate(item.id, "notes", value)}
          isEditing={editingCells[`${item.id}-notes`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-notes`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-notes`]: false })}
          placeholder="비고 입력"
          multiline
        />
      ),
    },
    {
      key: "actions",
      label: "작업",
      width: "100px",
      sortable: false,
      filterable: false,
      render: (item) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => onEdit(item)} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(item)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // 셀 업데이트 핸들러
  const handleCellUpdate = useCallback(
    (itemId, field, value) => {
      onUpdate(itemId, { [field]: value });
    },
    [onUpdate]
  );

  // 제품 기본값 자동 채우기
  const autoFillProductDefaults = useCallback(
    (itemId, productId, productModelId) => {
      let product = null;
      let productModel = null;

      if (productId) {
        product = products.find((p) => p.id === productId);
      }

      if (productModelId) {
        productModel = productModels.find((pm) => pm.id === productModelId);
      }

      // 우선순위: ProductModel > Product
      const defaults = {
        consumerPrice: productModel?.consumerPrice || product?.consumerPrice || 0,
        originalUnitCost: productModel?.cost || product?.cost || 0,
        adjustedUnitCost: productModel?.cost || product?.cost || 0,
        cost: productModel?.cost || product?.cost || 0, // 호환성
        productIncentiveA: productModel?.incentiveA || product?.incentiveA || 0,
        productIncentiveB: productModel?.incentiveB || product?.incentiveB || 0,
      };

      Object.entries(defaults).forEach(([field, value]) => {
        handleCellUpdate(itemId, field, value);
      });
    },
    [products, productModels, handleCellUpdate]
  );

  // 자동 계산 함수
  const recalculateItem = useCallback(
    (itemId, changedFields) => {
      const item = salesItems.find((item) => item.id === itemId);
      if (!item) return;

      const updates = { ...changedFields };

      // 합계 계산 (단가 * 수량)
      if ("unitPrice" in changedFields || "quantity" in changedFields) {
        updates.totalPrice = (changedFields.unitPrice ?? item.unitPrice) * (changedFields.quantity ?? item.quantity);
        updates.salesPrice = updates.totalPrice; // 호환성
      }

      // 총 원가 계산 (원가 * 수량)
      if ("adjustedUnitCost" in changedFields || "cost" in changedFields || "quantity" in changedFields) {
        const unitCost = changedFields.adjustedUnitCost ?? changedFields.cost ?? item.adjustedUnitCost ?? item.cost ?? 0;
        updates.totalCost = unitCost * (changedFields.quantity ?? item.quantity);
      }

      // 할인율 계산 (소비자가 대비)
      if ("consumerPrice" in changedFields || "unitPrice" in changedFields) {
        const consumerPrice = changedFields.consumerPrice ?? item.consumerPrice ?? 0;
        const unitPrice = changedFields.unitPrice ?? item.unitPrice ?? 0;

        if (consumerPrice > 0) {
          updates.discountRate = ((consumerPrice - unitPrice) / consumerPrice) * 100;
        }
      }

      // 마진 계산 (단가 - 원가)
      if ("unitPrice" in changedFields || "adjustedUnitCost" in changedFields || "cost" in changedFields) {
        const unitPrice = changedFields.unitPrice ?? item.unitPrice ?? 0;
        const unitCost = changedFields.adjustedUnitCost ?? changedFields.cost ?? item.adjustedUnitCost ?? item.cost ?? 0;
        updates.margin = unitPrice - unitCost;

        if ("quantity" in changedFields || updates.margin !== undefined) {
          updates.totalMargin = updates.margin * (changedFields.quantity ?? item.quantity);
        }
      }

      // 최종 마진 계산
      const totalRevenue = updates.totalPrice ?? item.totalPrice ?? 0;
      const totalCost = updates.totalCost ?? item.totalCost ?? 0;
      const otherCosts = changedFields.otherCosts ?? item.otherCosts ?? 0;
      const shippingCost = changedFields.shippingCost ?? item.shippingCost ?? item.deliveryFee ?? 0;
      const incentiveA = changedFields.productIncentiveA ?? item.productIncentiveA ?? 0;
      const incentiveB = changedFields.productIncentiveB ?? item.productIncentiveB ?? 0;

      updates.finalMargin = totalRevenue - totalCost - otherCosts - shippingCost - incentiveA - incentiveB;

      // 마진요율 계산
      if (totalRevenue > 0) {
        updates.marginRate = (updates.finalMargin / totalRevenue) * 100;
      }

      // 한 번에 모든 업데이트 적용
      Object.entries(updates).forEach(([field, value]) => {
        if (field !== "totalPrice" && field !== "salesPrice") {
          // 중복 방지
          handleCellUpdate(itemId, field, value);
        }
      });
    },
    [salesItems, handleCellUpdate]
  );

  // 숫자 포맷팅 함수
  const formatCurrency = useCallback((value) => {
    if (value == null || isNaN(value)) return "0";
    return new Intl.NumberFormat("ko-KR").format(value);
  }, []);

  // 필터된 데이터
  const filteredData = useMemo(() => {
    return salesItems.filter((item) => {
      return Object.entries(columnFilters).every(([columnKey, filterValue]) => {
        if (!filterValue || filterValue.length === 0) return true;

        const column = columns.find((col) => col.key === columnKey);
        if (!column) return true;

        // 값 추출 로직
        let cellValue = "";
        switch (columnKey) {
          case "salesRep":
            cellValue = item.salesRep?.name || "";
            break;
          case "customer":
            cellValue = item.customer?.companyName || item.customer?.name || "";
            break;
          case "category":
            cellValue = item.category?.name || "";
            break;
          case "product":
            cellValue = item.product?.name || "";
            break;
          case "productModel":
            cellValue = item.productModel?.name || item.productModel?.modelName || "";
            break;
          default:
            cellValue = String(item[columnKey] || "");
        }

        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [salesItems, columnFilters, columns]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 테이블 */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r last:border-r-0"
                    style={{ width: column.width, minWidth: column.width }}
                  >
                    <ColumnHeaderFilter
                      column={column}
                      title={column.label}
                      currentSort={sortConfig.field === column.key ? sortConfig.direction?.toLowerCase() : null}
                      onSortChange={column.sortable ? (columnKey, direction) => onSortChange({ field: columnKey, direction: direction.toUpperCase() }) : undefined}
                      onFilterChange={
                        column.filterable
                          ? (columnKey, filterValue) => {
                              setColumnFilters((prev) => ({
                                ...prev,
                                [columnKey]: filterValue,
                              }));
                            }
                          : undefined
                      }
                      data={filteredData}
                      accessor={column.key}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.key}`} className="px-2 py-2 whitespace-nowrap text-sm border-r last:border-r-0" style={{ width: column.width, minWidth: column.width }}>
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            총 {pagination.totalCount || 0}개 항목 중 {((pagination.currentPage || 1) - 1) * (pagination.itemsPerPage || 20) + 1}-
            {Math.min((pagination.currentPage || 1) * (pagination.itemsPerPage || 20), pagination.totalCount || 0)} 표시
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={!pagination.hasPreviousPage}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange((pagination.currentPage || 1) - 1)} disabled={!pagination.hasPreviousPage}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              페이지 {pagination.currentPage || 1} / {pagination.totalPages || 1}
            </span>
            <Button variant="outline" size="sm" onClick={() => onPageChange((pagination.currentPage || 1) + 1)} disabled={!pagination.hasNextPage}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.totalPages || 1)} disabled={!pagination.hasNextPage}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 모달들 */}
      {paymentModalOpen && <PaymentHistoryModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} salesItemId={selectedSalesItemId} />}

      {incentiveModalOpen && <IncentivePayoutModal isOpen={incentiveModalOpen} onClose={() => setIncentiveModalOpen(false)} salesItemId={selectedSalesItemId} />}
    </div>
  );
}

SalesManagementTable.propTypes = {
  salesItems: PropTypes.array,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  sortConfig: PropTypes.object,
  selectedItems: PropTypes.array,
  salesReps: PropTypes.array,
  customers: PropTypes.array,
  products: PropTypes.array,
  categories: PropTypes.array,
  productModels: PropTypes.array,
  onSortChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onBulkUpdate: PropTypes.func,
  onUpdate: PropTypes.func,
};
