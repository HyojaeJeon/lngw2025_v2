"use client";

import SalesManagementPage from '@/components/sales/SalesManagementPage';

export default function SalesPage() {
  return <SalesManagementPage />;
}

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useTranslation } from "@/hooks/useLanguage.js";
import { useToast } from "@/hooks/useToast.js";
import { 
  GET_SALES_ITEMS, 
  GET_SALES_REPS, 
  GET_CUSTOMERS_FOR_SALES,
  GET_PRODUCTS_FOR_SALES,
  GET_SALES_CATEGORIES,
  CREATE_SALES_ITEM,
  UPDATE_SALES_ITEM,
  DELETE_SALES_ITEM,
  BULK_UPDATE_SALES_ITEMS
} from "@/lib/graphql/salesOperations.js";
import SalesManagementTable from "@/components/sales/SalesManagementTable.js";
import SalesAddModal from "@/components/sales/SalesAddModal.js";
import SalesFilterModal from "@/components/sales/SalesFilterModal.js";
import { 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw,
  TrendingUp,
  DollarSign,
  FileText,
  Users
} from "lucide-react";

export default function SalesManagementPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // 상태 관리
  const [filters, setFilters] = useState({
    search: "",
    salesRepId: null,
    customerId: null,
    categoryId: null,
    productId: null,
    type: null,
    paymentStatus: null,
    dateFrom: null,
    dateTo: null
  });
  
  const [sortConfig, setSortConfig] = useState({
    field: "salesDate",
    direction: "DESC"
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // GraphQL 쿼리
  const { data: salesData, loading: salesLoading, refetch: refetchSales } = useQuery(GET_SALES_ITEMS, {
    variables: {
      filter: filters,
      sort: sortConfig,
      page: currentPage,
      limit: pageSize
    },
    fetchPolicy: "cache-and-network"
  });

  const { data: salesRepsData } = useQuery(GET_SALES_REPS, {
    variables: { limit: 100 }
  });

  const { data: customersData } = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { limit: 100 }
  });

  const { data: productsData } = useQuery(GET_PRODUCTS_FOR_SALES, {
    variables: { limit: 100 }
  });

  const { data: categoriesData } = useQuery(GET_SALES_CATEGORIES, {
    variables: { limit: 100 }
  });

  // 뮤테이션
  const [createSalesItem] = useMutation(CREATE_SALES_ITEM, {
    onCompleted: (data) => {
      if (data.createSalesItem.success) {
        toast.success(data.createSalesItem.message);
        setShowAddModal(false);
        refetchSales();
      } else {
        toast.error(data.createSalesItem.message);
      }
    },
    onError: (error) => {
      toast.error("매출 생성 중 오류가 발생했습니다.");
    }
  });

  const [updateSalesItem] = useMutation(UPDATE_SALES_ITEM, {
    onCompleted: (data) => {
      if (data.updateSalesItem.success) {
        toast.success(data.updateSalesItem.message);
        setEditingItem(null);
        refetchSales();
      } else {
        toast.error(data.updateSalesItem.message);
      }
    },
    onError: (error) => {
      toast.error("매출 수정 중 오류가 발생했습니다.");
    }
  });

  const [deleteSalesItem] = useMutation(DELETE_SALES_ITEM, {
    onCompleted: (data) => {
      if (data.deleteSalesItem.success) {
        toast.success(data.deleteSalesItem.message);
        refetchSales();
      } else {
        toast.error(data.deleteSalesItem.message);
      }
    },
    onError: (error) => {
      toast.error("매출 삭제 중 오류가 발생했습니다.");
    }
  });

  const [bulkUpdateSalesItems] = useMutation(BULK_UPDATE_SALES_ITEMS, {
    onCompleted: (data) => {
      if (data.bulkUpdateSalesItems.success) {
        toast.success("대량 수정이 완료되었습니다.");
        refetchSales();
      } else {
        toast.error(data.bulkUpdateSalesItems.message);
      }
    },
    onError: (error) => {
      toast.error("대량 수정 중 오류가 발생했습니다.");
    }
  });

  // 데이터 처리
  const salesItems = salesData?.salesItems?.salesItems || [];
  const pagination = salesData?.salesItems?.pagination;
  const salesReps = salesRepsData?.salesReps || [];
  const customers = customersData?.customers || [];
  const products = productsData?.productsForSales || [];
  const categories = categoriesData?.salesCategories?.salesCategories || [];

  // 통계 계산
  const stats = useMemo(() => {
    if (!salesItems.length) return {
      totalSales: 0,
      totalMargin: 0,
      averageMarginRate: 0,
      itemCount: 0
    };

    const totalSales = salesItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const totalMargin = salesItems.reduce((sum, item) => sum + (item.finalMargin || 0), 0);
    const averageMarginRate = salesItems.length > 0 ? 
      salesItems.reduce((sum, item) => sum + (item.marginRate || 0), 0) / salesItems.length : 0;

    return {
      totalSales,
      totalMargin,
      averageMarginRate,
      itemCount: salesItems.length
    };
  }, [salesItems]);

  // 핸들러 함수들
  const handleAddSalesItem = (formData) => {
    createSalesItem({
      variables: {
        input: {
          ...formData,
          salesDate: formData.salesDate.toISOString().split('T')[0]
        }
      }
    });
  };

  const handleUpdateSalesItem = (id, formData) => {
    updateSalesItem({
      variables: {
        id: parseInt(id),
        input: formData
      }
    });
  };

  const handleDeleteSalesItem = (id) => {
    if (confirm("정말로 이 매출 항목을 삭제하시겠습니까?")) {
      deleteSalesItem({
        variables: {
          id: parseInt(id)
        }
      });
    }
  };

  const handleBulkUpdate = (updates) => {
    bulkUpdateSalesItems({
      variables: {
        updates: updates.map(update => ({
          id: parseInt(update.id),
          input: update.input
        }))
      }
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (field, direction) => {
    setSortConfig({ field, direction });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetchSales();
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("sales.title", "매출 관리")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            매출 데이터를 관리하고 분석하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button variant="outline" onClick={() => setShowFilterModal(true)}>
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            매출 추가
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출액</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{stats.totalSales.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 마진</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{stats.totalMargin.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 마진율</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageMarginRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">매출 건수</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.itemCount.toLocaleString()}건
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 매출 관리 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>매출 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesManagementTable
            salesItems={salesItems}
            loading={salesLoading}
            pagination={pagination}
            sortConfig={sortConfig}
            selectedItems={selectedItems}
            salesReps={salesReps}
            customers={customers}
            products={products}
            categories={categories}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
            onSelectionChange={setSelectedItems}
            onEdit={setEditingItem}
            onDelete={handleDeleteSalesItem}
            onBulkUpdate={handleBulkUpdate}
            onUpdate={handleUpdateSalesItem}
          />
        </CardContent>
      </Card>

      {/* 매출 추가 모달 */}
      {showAddModal && (
        <SalesAddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSalesItem}
          salesReps={salesReps}
          customers={customers}
          products={products}
          categories={categories}
        />
      )}

      {/* 필터 모달 */}
      {showFilterModal && (
        <SalesFilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onApplyFilters={handleFilterChange}
          salesReps={salesReps}
          customers={customers}
          products={products}
          categories={categories}
        />
      )}
    </div>
  );
}