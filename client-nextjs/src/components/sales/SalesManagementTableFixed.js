"use client";

import { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
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

  // 셀 업데이트 핸들러
  const handleCellUpdate = useCallback(
    (id, field, value) => {
      onUpdate(id, { [field]: value });
    },
    [onUpdate]
  );

  // 제품 기본값 자동 입력
  const autoFillProductDefaults = useCallback(
    (salesItemId, productId, productModelId) => {
      const product = products.find((p) => p.id === productId);
      const productModel = productModels.find((pm) => pm.id === productModelId);

      if (product || productModel) {
        const updates = {};

        // 기본 인센티브 설정
        if (productModel) {
          updates.productIncentiveA = productModel.incentiveA || product?.incentiveA || 0;
          updates.productIncentiveB = productModel.incentiveB || product?.incentiveB || 0;
          updates.originalUnitCost = productModel.cost || product?.cost || 0;
          updates.consumerPrice = productModel.consumerPrice || product?.consumerPrice || 0;
        } else if (product) {
          updates.productIncentiveA = product.incentiveA || 0;
          updates.productIncentiveB = product.incentiveB || 0;
          updates.originalUnitCost = product.cost || 0;
          updates.consumerPrice = product.consumerPrice || 0;
        }

        Object.entries(updates).forEach(([field, value]) => {
          handleCellUpdate(salesItemId, field, value);
        });
      }
    },
    [products, productModels, handleCellUpdate]
  );

  // 숫자 포맷팅
  const formatNumber = useCallback((value) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("ko-KR").format(value);
  }, []);

  // salesList.md 요구사항에 따른 컬럼 정의
  const columns = [
    // 기본 정보 컬럼들
    {
      key: "select",
      label: "",
      width: "40px",
      render: (item) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={(e) => {
            const newSelection = e.target.checked ? [...selectedItems, item.id] : selectedItems.filter((id) => id !== item.id);
            onSelectionChange(newSelection);
          }}
          className="border-gray-300 rounded"
        />
      ),
    },
    {
      key: "salesRep",
      label: "영업사원",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => (
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
      label: "매출/견적",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomSelectCell
          value={item.type}
          options={[
            { value: "SALES", label: "매출" },
            { value: "QUOTE", label: "견적" },
          ]}
          onChange={(value) => handleCellUpdate(item.id, "type", value)}
        />
      ),
    },
    {
      key: "salesDate",
      label: "매출일",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => <DatePickerCell value={item.salesDate} onChange={(value) => handleCellUpdate(item.id, "salesDate", value)} />,
    },
    {
      key: "customer",
      label: "고객사",
      width: "150px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomAsyncSelectCell
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
      render: (item) => (
        <CustomAsyncSelectCell
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
          onChange={(value) => {
            handleCellUpdate(item.id, "productModelId", value);
            // 모델 변경 시 기본값 설정
            autoFillProductDefaults(item.id, item.productId, value);
          }}
          searchable
          placeholder="모델명 선택"
          disabled={!item.productId}
        />
      ),
    },
    {
      key: "productName",
      label: "제품명(직접입력)",
      width: "200px",
      render: (item) => <TextInputCell value={item.productName} onChange={(value) => handleCellUpdate(item.id, "productName", value)} placeholder="제품명 입력" />,
    },
    {
      key: "salesItemCode",
      label: "코드",
      width: "120px",
      render: (item) => <TextInputCell value={item.salesItemCode} onChange={(value) => handleCellUpdate(item.id, "salesItemCode", value)} placeholder="코드 입력" />,
    },
    {
      key: "quantity",
      label: "수량",
      width: "80px",
      render: (item) => <NumberInputCell value={item.quantity} onChange={(value) => handleCellUpdate(item.id, "quantity", value)} min={0} placeholder="수량" />,
    },
    {
      key: "unitPrice",
      label: "단가",
      width: "120px",
      render: (item) => <NumberInputCell value={item.unitPrice} onChange={(value) => handleCellUpdate(item.id, "unitPrice", value)} min={0} placeholder="단가" format="currency" />,
    },
    {
      key: "totalPrice",
      label: "총액",
      width: "120px",
      render: (item) => <div className="font-medium text-right">₩{formatNumber(item.totalPrice || item.quantity * item.unitPrice)}</div>,
    },
    {
      key: "originalUnitCost",
      label: "원가",
      width: "120px",
      render: (item) => <NumberInputCell value={item.originalUnitCost} onChange={(value) => handleCellUpdate(item.id, "originalUnitCost", value)} min={0} placeholder="원가" format="currency" />,
    },
    {
      key: "adjustedUnitCost",
      label: "조정원가",
      width: "120px",
      render: (item) => <NumberInputCell value={item.adjustedUnitCost} onChange={(value) => handleCellUpdate(item.id, "adjustedUnitCost", value)} min={0} placeholder="조정원가" format="currency" />,
    },
    {
      key: "shippingCost",
      label: "배송비",
      width: "100px",
      render: (item) => <NumberInputCell value={item.shippingCost} onChange={(value) => handleCellUpdate(item.id, "shippingCost", value)} min={0} placeholder="배송비" format="currency" />,
    },
    {
      key: "otherCosts",
      label: "기타비용",
      width: "100px",
      render: (item) => <NumberInputCell value={item.otherCosts} onChange={(value) => handleCellUpdate(item.id, "otherCosts", value)} min={0} placeholder="기타비용" format="currency" />,
    },
    {
      key: "finalMargin",
      label: "최종마진",
      width: "120px",
      render: (item) => {
        const totalCost = (item.adjustedUnitCost || item.originalUnitCost || 0) + (item.shippingCost || 0) + (item.otherCosts || 0);
        const margin = (item.unitPrice || 0) - totalCost;
        return <div className={`text-right font-medium ${margin >= 0 ? "text-green-600" : "text-red-600"}`}>₩{formatNumber(margin)}</div>;
      },
    },
    {
      key: "marginRate",
      label: "마진율",
      width: "80px",
      render: (item) => {
        const totalCost = (item.adjustedUnitCost || item.originalUnitCost || 0) + (item.shippingCost || 0) + (item.otherCosts || 0);
        const margin = (item.unitPrice || 0) - totalCost;
        const marginRate = item.unitPrice ? (margin / item.unitPrice) * 100 : 0;
        return <div className={`text-right font-medium ${marginRate >= 0 ? "text-green-600" : "text-red-600"}`}>{marginRate.toFixed(1)}%</div>;
      },
    },
    {
      key: "discountRate",
      label: "할인율",
      width: "80px",
      render: (item) => <NumberInputCell value={item.discountRate} onChange={(value) => handleCellUpdate(item.id, "discountRate", value)} min={0} max={100} placeholder="할인율" suffix="%" />,
    },
    {
      key: "consumerPrice",
      label: "소비자가",
      width: "120px",
      render: (item) => <NumberInputCell value={item.consumerPrice} onChange={(value) => handleCellUpdate(item.id, "consumerPrice", value)} min={0} placeholder="소비자가" format="currency" />,
    },
    {
      key: "paymentStatus",
      label: "결제상태",
      width: "100px",
      filterable: true,
      render: (item) => {
        const badge = getPaymentStatusBadge(item.paymentStatus);
        return (
          <Badge
            variant={badge.variant}
            className="cursor-pointer"
            onClick={() => {
              setSelectedSalesItemId(item.id);
              setPaymentModalOpen(true);
            }}
          >
            {badge.text}
          </Badge>
        );
      },
    },
    {
      key: "productIncentiveA",
      label: "인센티브A",
      width: "100px",
      render: (item) => (
        <NumberInputCell value={item.productIncentiveA} onChange={(value) => handleCellUpdate(item.id, "productIncentiveA", value)} min={0} placeholder="인센티브A" format="currency" />
      ),
    },
    {
      key: "productIncentiveB",
      label: "인센티브B",
      width: "100px",
      render: (item) => (
        <NumberInputCell value={item.productIncentiveB} onChange={(value) => handleCellUpdate(item.id, "productIncentiveB", value)} min={0} placeholder="인센티브B" format="currency" />
      ),
    },
    {
      key: "incentivePayout",
      label: "인센티브 지급",
      width: "120px",
      render: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedSalesItemId(item.id);
            setIncentiveModalOpen(true);
          }}
          className="flex items-center gap-1"
        >
          <Award className="w-3 h-3" />
          지급관리
        </Button>
      ),
    },
    {
      key: "actions",
      label: "작업",
      width: "100px",
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="w-6 h-6 p-0 text-red-600 hover:text-red-700">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  // 필터링 로직
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
          case "type":
            cellValue = item.type === "SALES" ? "매출" : "견적";
            break;
          case "paymentStatus":
            cellValue = getPaymentStatusBadge(item.paymentStatus).text;
            break;
          default:
            cellValue = String(item[columnKey] || "");
        }

        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [salesItems, columnFilters, columns]);

  // 정렬 로직
  const sortedData = useMemo(() => {
    if (!sortConfig.field) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      // 특별한 정렬 로직
      if (sortConfig.field === "salesRep") {
        aValue = a.salesRep?.name || "";
        bValue = b.salesRep?.name || "";
      } else if (sortConfig.field === "customer") {
        aValue = a.customer?.companyName || a.customer?.name || "";
        bValue = b.customer?.companyName || b.customer?.name || "";
      }

      if (aValue < bValue) return sortConfig.direction === "ASC" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ASC" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 헤더 클릭 핸들러
  const handleHeaderClick = (columnKey) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    const newDirection = sortConfig.field === columnKey && sortConfig.direction === "ASC" ? "DESC" : "ASC";

    onSortChange(columnKey, newDirection);
  };

  // 전체 선택 핸들러
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(sortedData.map((item) => item.id));
    } else {
      onSelectionChange([]);
    }
  };
  return (
    <div className="flex flex-col h-full">
      {/* 테이블 컨테이너 - 2. X 스크롤 및 3. 높이 전체 차지 */}
      <div className="flex-1 overflow-hidden border rounded-lg">
        <div className="h-full overflow-x-auto overflow-y-auto">
          <table className="w-full border-collapse min-w-max">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th className="w-10 p-2 border-b">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === sortedData.length && sortedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="border-gray-300 rounded"
                  />
                </th>
                {columns.slice(1).map((column) => (
                  <th key={column.key} className="sticky top-0 p-2 text-left border-b bg-gray-50" style={{ minWidth: column.width }}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-medium text-sm ${column.sortable ? "cursor-pointer hover:text-blue-600" : ""}`} onClick={() => handleHeaderClick(column.key)}>
                        {column.label}
                        {sortConfig.field === column.key && <span className="ml-1">{sortConfig.direction === "ASC" ? "↑" : "↓"}</span>}
                      </span>
                      {column.filterable && (
                        <ColumnHeaderFilter
                          value={columnFilters[column.key] || ""}
                          onChange={(value) => setColumnFilters((prev) => ({ ...prev, [column.key]: value }))}
                          placeholder={`${column.label} 필터`}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                      <span className="ml-2">로딩 중...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}>
                    {columns.map((column) => (
                      <td key={column.key} className="p-2 border-b" style={{ minWidth: column.width }}>
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white border-t">
          <div className="text-sm text-gray-600">
            총 {pagination.totalItems}개 항목 중 {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}개 표시
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={pagination.currentPage === 1}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 text-sm">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.totalPages)} disabled={pagination.currentPage === pagination.totalPages}>
              <ChevronsRight className="w-4 h-4" />
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
  onDelete: PropTypes.func,
  onBulkUpdate: PropTypes.func,
  onUpdate: PropTypes.func,
};
