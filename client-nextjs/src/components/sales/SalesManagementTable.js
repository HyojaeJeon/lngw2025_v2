"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import ColumnHeaderFilter from "./cells/ColumnHeaderFilter.js";
import CustomAsyncSelectCell from "./cells/CustomAsyncSelectCell.js";
import CustomSelectCell from "./cells/CustomSelectCell.js";
import DatePickerCell from "./cells/DatePickerCell.js";
import NumberInputCell from "./cells/NumberInputCell.js";
import TextInputCell from "./cells/TextInputCell.js";
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react";

export default function SalesManagementTable({
  salesItems,
  loading,
  pagination,
  sortConfig,
  selectedItems,
  salesReps,
  customers,
  products,
  categories,
  onSortChange,
  onPageChange,
  onSelectionChange,
  onEdit,
  onDelete,
  onBulkUpdate,
  onUpdate,
}) {
  const { t } = useTranslation();
  const [editingCells, setEditingCells] = useState({});
  const [columnFilters, setColumnFilters] = useState({});

  // 컬럼 정의
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
      filterable: true,
      render: (item) => (
        <CustomAsyncSelectCell
          value={item.salesRep?.id}
          displayValue={item.salesRep?.name}
          options={salesReps}
          onSave={(value) => handleCellUpdate(item.id, "salesRepId", value)}
          isEditing={editingCells[`${item.id}-salesRep`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-salesRep`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-salesRep`]: false })}
          searchable
          placeholder="영업사원 선택"
        />
      ),
    },
    {
      key: "customer",
      label: "고객사",
      width: "200px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomAsyncSelectCell
          value={item.customer?.id}
          displayValue={item.customer?.companyName}
          options={customers}
          onSave={(value) => handleCellUpdate(item.id, "customerId", value)}
          isEditing={editingCells[`${item.id}-customer`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-customer`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-customer`]: false })}
          searchable
          placeholder="고객사 선택"
        />
      ),
    },
    {
      key: "type",
      label: "구분",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomSelectCell
          value={item.type}
          options={[
            { value: "SALE", label: "판매", color: "bg-green-100 text-green-800" },
            { value: "SAMPLE", label: "샘플", color: "bg-blue-100 text-blue-800" },
            { value: "DEFECTIVE", label: "불량", color: "bg-red-100 text-red-800" },
            { value: "EXPIRED", label: "파손", color: "bg-gray-100 text-gray-800" },
          ]}
          onSave={(value) => handleCellUpdate(item.id, "type", value)}
          isEditing={editingCells[`${item.id}-type`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-type`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-type`]: false })}
        />
      ),
    },
    {
      key: "category",
      label: "카테고리",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomSelectCell
          value={item.category?.id}
          displayValue={item.category?.name}
          options={categories}
          onSave={(value) => handleCellUpdate(item.id, "categoryId", value)}
          isEditing={editingCells[`${item.id}-category`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-category`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-category`]: false })}
        />
      ),
    },
    {
      key: "product",
      label: "제품",
      width: "150px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomSelectCell
          value={item.product?.id}
          displayValue={item.product?.name}
          options={products}
          onSave={(value) => handleCellUpdate(item.id, "productId", value)}
          isEditing={editingCells[`${item.id}-product`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-product`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-product`]: false })}
        />
      ),
    },
    {
      key: "quantity",
      label: "수량",
      width: "80px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.quantity}
          onSave={(value) => handleCellUpdate(item.id, "quantity", value)}
          isEditing={editingCells[`${item.id}-quantity`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-quantity`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-quantity`]: false })}
          min={1}
          step={1}
        />
      ),
    },
    {
      key: "unitPrice",
      label: "단가",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <NumberInputCell
          value={item.unitPrice}
          onSave={(value) => handleCellUpdate(item.id, "unitPrice", value)}
          isEditing={editingCells[`${item.id}-unitPrice`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-unitPrice`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-unitPrice`]: false })}
          min={0}
          step={100}
          format="currency"
        />
      ),
    },
    {
      key: "totalPrice",
      label: "총액",
      width: "120px",
      sortable: true,
      filterable: true,
      render: (item) => <div className="font-medium text-green-600">₩{item.totalPrice?.toLocaleString()}</div>,
    },
    {
      key: "margin",
      label: "마진",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => <div className={`font-medium ${item.margin > 0 ? "text-green-600" : "text-red-600"}`}>₩{item.margin?.toLocaleString()}</div>,
    },
    {
      key: "marginRate",
      label: "마진율",
      width: "80px",
      sortable: true,
      filterable: true,
      render: (item) => <Badge variant={item.marginRate > 20 ? "default" : item.marginRate > 10 ? "secondary" : "destructive"}>{item.marginRate?.toFixed(1)}%</Badge>,
    },
    {
      key: "paymentStatus",
      label: "결제상태",
      width: "100px",
      sortable: true,
      filterable: true,
      render: (item) => (
        <CustomSelectCell
          value={item.paymentStatus}
          options={[
            { value: "UNPAID", label: "미지급", color: "bg-red-100 text-red-800" },
            { value: "PARTIAL_PAID", label: "부분지급", color: "bg-yellow-100 text-yellow-800" },
            { value: "PAID", label: "완료", color: "bg-green-100 text-green-800" },
          ]}
          onSave={(value) => handleCellUpdate(item.id, "paymentStatus", value)}
          isEditing={editingCells[`${item.id}-paymentStatus`]}
          onEdit={() => setEditingCells({ ...editingCells, [`${item.id}-paymentStatus`]: true })}
          onCancel={() => setEditingCells({ ...editingCells, [`${item.id}-paymentStatus`]: false })}
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
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // 셀 업데이트 핸들러
  const handleCellUpdate = (itemId, field, value) => {
    onUpdate(itemId, { [field]: value });
    setEditingCells({ ...editingCells, [`${itemId}-${field}`]: false });
  };

  // 전체 선택 핸들러
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(salesItems.map((item) => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  // 정렬 핸들러
  const handleSort = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === "ASC" ? "DESC" : "ASC";
    onSortChange(field, direction);
  };

  // 페이지네이션 컴포넌트
  const renderPagination = () => {
    if (!pagination) return null;

    const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            총 {pagination.totalCount}건 중 {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, pagination.totalCount)}건
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={!hasPreviousPage}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={!hasPreviousPage}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            {currentPage} / {totalPages}
          </span>

          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={!hasNextPage}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} disabled={!hasNextPage}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: column.width }}>
                  <div className="flex items-center space-x-1">
                    {column.key === "select" ? (
                      <input
                        type="checkbox"
                        checked={selectedItems.length === salesItems.length && salesItems.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    ) : (
                      <>
                        <span>{column.label}</span>
                        {column.sortable && (
                          <button onClick={() => handleSort(column.key)} className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            {sortConfig.field === column.key ? (
                              sortConfig.direction === "ASC" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3 w-3" />
                            )}
                          </button>
                        )}{" "}
                        {column.filterable && (
                          <ColumnHeaderFilter
                            column={column}
                            title={column.label}
                            data={salesItems}
                            accessor={column.key}
                            currentSort={sortConfig.field === column.key ? sortConfig.direction.toLowerCase() : null}
                            onFilterChange={(columnKey, filters) => setColumnFilters({ ...columnFilters, [columnKey]: filters })}
                            onSortChange={(columnKey, direction) => setSortConfig({ field: columnKey, direction: direction.toUpperCase() })}
                          />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {salesItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {columns.map((column) => (
                  <td key={`${item.id}-${column.key}`} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" style={{ width: column.width }}>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
}
