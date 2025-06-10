"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import CustomAsyncSelectCell from "./cells/CustomAsyncSelectCell";
import CustomSelectCell from "./cells/CustomSelectCell";
import DatePickerCell from "./cells/DatePickerCell";
import NumberInputCell from "./cells/NumberInputCell";
import TextInputCell from "./cells/TextInputCell";
import { getSalesTypeLabel, getPaymentStatusLabel } from "../../utils/enumTranslations";

// Toast notification component
const Toast = ({ message, type = "success", onClose }) => (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
    }`}>
        <div className="flex items-center justify-between">
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
                ×
            </button>
        </div>
    </div>
);

// GraphQL queries
const GET_SALES_REPS = gql`
  query GetSalesReps($search: String) {
    employees(filter: { search: $search, role: "SALES" }) {
      id
      name
      email
      department
      position
      avatar
    }
  }
`;

const GET_CUSTOMERS = gql`
  query GetCustomers($search: String) {
    customers(filter: { search: $search }) {
      id
      name
      contactName
      grade
      profileImage
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts($search: String) {
    products(filter: { search: $search }) {
      id
      name
      code
      images
      productModels {
        id
        modelName
        modelCode
        images
      }
    }
  }
`;

const CREATE_SALES_ITEM = gql`
  mutation CreateSalesItem($input: CreateSalesItemInput!) {
    createSalesItem(input: $input) {
      success
      salesItem {
        id
        salesRep { id name }
        customer { id name }
        type
        salesDate
        product { id name }
        productModel { id modelName }
        quantity
        unitPrice
        salesPrice
        totalPrice
        discountRate
        cost
        paymentStatus
        notes
      }
      message
    }
  }
`;

const UPDATE_SALES_ITEM = gql`
  mutation UpdateSalesItem($id: ID!, $input: UpdateSalesItemInput!) {
    updateSalesItem(id: $id, input: $input) {
      success
      message
    }
  }
`;

const DELETE_SALES_ITEM = gql`
  mutation DeleteSalesItem($id: ID!) {
    deleteSalesItem(id: $id) {
      success
      message
    }
  }
`;

const SalesManagementPage = () => {
    // State management
    const [data, setData] = useState([]);
    const [toast, setToast] = useState(null);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    // Toast function
    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Validation function
    const validateSalesItem = useCallback((item) => {
        const errors = [];
        if (!item.salesRepId) errors.push("영업사원을 선택해주세요.");
        if (!item.customerId) errors.push("고객사를 선택해주세요.");
        if (!item.productId) errors.push("제품을 선택해주세요.");
        if (!item.quantity || item.quantity <= 0) errors.push("수량을 입력해주세요.");
        if (!item.unitPrice || item.unitPrice <= 0) errors.push("단가를 입력해주세요.");
        return errors;
    }, []);

    // GraphQL hooks
    const [getSalesReps, { data: salesRepsData, loading: salesRepsLoading }] = useLazyQuery(GET_SALES_REPS);
    const [getCustomers, { data: customersData, loading: customersLoading }] = useLazyQuery(GET_CUSTOMERS);
    const [getProducts, { data: productsData, loading: productsLoading }] = useLazyQuery(GET_PRODUCTS);
    const [createSalesItem] = useMutation(CREATE_SALES_ITEM);
    const [updateSalesItem] = useMutation(UPDATE_SALES_ITEM);
    const [deleteSalesItem] = useMutation(DELETE_SALES_ITEM);

    // Options for selects
    const salesTypeOptions = [
        { label: getSalesTypeLabel("SALE"), value: "SALE" },
        { label: getSalesTypeLabel("SAMPLE"), value: "SAMPLE" },
        { label: getSalesTypeLabel("DEFECTIVE"), value: "DEFECTIVE" },
        { label: getSalesTypeLabel("EXPIRED"), value: "EXPIRED" },
    ];

    const paymentStatusOptions = [
        { label: getPaymentStatusLabel("UNPAID"), value: "UNPAID" },
        { label: getPaymentStatusLabel("PARTIAL_PAID"), value: "PARTIAL_PAID" },
        { label: getPaymentStatusLabel("PAID"), value: "PAID" },
    ];

    // Handler functions
    const handleCellUpdate = useCallback(async (rowIndex, columnId, value) => {
        const updatedData = [...data];
        const row = updatedData[rowIndex];
        
        if (!row) {
            console.error("Row not found");
            return;
        }
        
        // Create a copy of the row with the updated field
        const updatedRow = { ...row, [columnId]: value };
        
        // Auto-calculate dependent fields
        if (["quantity", "unitPrice", "discountRate", "cost"].includes(columnId)) {
            const quantity = updatedRow.quantity || 0;
            const unitPrice = updatedRow.unitPrice || 0;
            const discountRate = updatedRow.discountRate || 0;
            const cost = updatedRow.cost || 0;
            
            updatedRow.salesPrice = unitPrice * (1 - discountRate / 100);
            updatedRow.totalPrice = quantity * updatedRow.salesPrice;
            updatedRow.totalCost = quantity * cost;
            updatedRow.margin = updatedRow.salesPrice - cost;
            updatedRow.totalMargin = updatedRow.totalPrice - updatedRow.totalCost;
            updatedRow.finalMargin = updatedRow.totalMargin - (updatedRow.deliveryFee || 0);
            updatedRow.marginRate = updatedRow.totalPrice > 0 ? (updatedRow.finalMargin / updatedRow.totalPrice) * 100 : 0;
        }

        updatedData[rowIndex] = updatedRow;
        setData(updatedData);

        // Auto-save if it's a new row and has required fields
        if (updatedRow.isNew) {
            const errors = validateSalesItem(updatedRow);
            if (errors.length === 0) {
                try {
                    const result = await createSalesItem({
                        variables: {
                            input: {
                                salesRepId: parseInt(updatedRow.salesRepId),
                                customerId: parseInt(updatedRow.customerId),
                                type: updatedRow.type,
                                salesDate: updatedRow.salesDate,
                                productId: parseInt(updatedRow.productId),
                                productModelId: updatedRow.productModelId ? parseInt(updatedRow.productModelId) : null,
                                quantity: updatedRow.quantity,
                                unitPrice: updatedRow.unitPrice,
                                salesPrice: updatedRow.salesPrice,
                                totalPrice: updatedRow.totalPrice,
                                discountRate: updatedRow.discountRate,
                                cost: updatedRow.cost,
                                paymentStatus: updatedRow.paymentStatus,
                                notes: updatedRow.notes
                            }
                        }
                    });

                    if (result.data.createSalesItem.success) {
                        updatedData[rowIndex] = {
                            ...result.data.createSalesItem.salesItem,
                            isNew: false
                        };
                        setData([...updatedData]);
                        showToast("매출 데이터가 성공적으로 저장되었습니다.", "success");
                    }
                } catch (error) {
                    console.error("Error creating sales item:", error);
                    showToast("저장 중 오류가 발생했습니다.", "error");
                }
            }
        } else if (row.id && !row.isNew) {
            try {
                await updateSalesItem({
                    variables: {
                        id: row.id,
                        input: { [columnId]: value }
                    }
                });
            } catch (error) {
                console.error("Error updating sales item:", error);
                setData(data);
                showToast("업데이트 중 오류가 발생했습니다.", "error");
            }
        }
    }, [data, createSalesItem, updateSalesItem, validateSalesItem, showToast]);

    const addNewRow = useCallback(() => {
        const newRow = {
            id: `temp_${Date.now()}`,
            isNew: true,
            salesRepId: null,
            customerId: null,
            type: "SALE",
            salesDate: new Date().toISOString().split("T")[0],
            productId: null,
            productModelId: null,
            quantity: 1,
            unitPrice: 0,
            salesPrice: 0,
            totalPrice: 0,
            discountRate: 0,
            cost: 0,
            paymentStatus: "UNPAID",
            notes: "",
        };
        setData(prev => [newRow, ...prev]);
    }, []);

    const deleteRow = useCallback(async (rowIndex) => {
        const row = data[rowIndex];
        
        if (row.isNew) {
            const updatedData = data.filter((_, index) => index !== rowIndex);
            setData(updatedData);
        } else {
            try {
                await deleteSalesItem({ variables: { id: row.id } });
                const updatedData = data.filter((_, index) => index !== rowIndex);
                setData(updatedData);
                showToast("매출 데이터가 성공적으로 삭제되었습니다.", "success");
            } catch (error) {
                console.error("Error deleting sales item:", error);
                showToast("삭제 중 오류가 발생했습니다.", "error");
            }
        }
    }, [data, deleteSalesItem, showToast]);

    // Table columns definition
    const columns = useMemo(() => [
        {
            id: "salesRep",
            accessorKey: "salesRepId",
            header: "영업사원",
            size: 200,
            cell: ({ getValue, row, column }) => (
                <CustomAsyncSelectCell
                    value={getValue()}
                    onChange={(value) => handleCellUpdate(row.index, column.id, value)}
                    options={salesRepsData?.employees || []}
                    loading={salesRepsLoading}
                    placeholder="영업사원 선택"
                    displayKey="name"
                    onSearch={(searchTerm) => getSalesReps({ variables: { search: searchTerm } })}
                />
            ),
        },
        {
            id: "customer",
            accessorKey: "customerId",
            header: "고객사",
            size: 200,
            cell: ({ getValue, row, column }) => (
                <CustomAsyncSelectCell
                    value={getValue()}
                    onChange={(value) => handleCellUpdate(row.index, column.id, value)}
                    options={customersData?.customers || []}
                    loading={customersLoading}
                    placeholder="고객사 선택"
                    displayKey="name"
                    onSearch={(searchTerm) => getCustomers({ variables: { search: searchTerm } })}
                />
            ),
        },
        {
            id: "product",
            accessorKey: "productId",
            header: "제품명",
            size: 200,
            cell: ({ getValue, row, column }) => (
                <CustomAsyncSelectCell
                    value={getValue()}
                    onChange={(value) => {
                        handleCellUpdate(row.index, column.id, value);
                        handleCellUpdate(row.index, "productModelId", null);
                    }}
                    options={productsData?.products || []}
                    loading={productsLoading}
                    placeholder="제품 선택"
                    displayKey="name"
                    onSearch={(searchTerm) => getProducts({ variables: { search: searchTerm } })}
                />
            ),
        },
        {
            id: "productModel",
            accessorKey: "productModelId",
            header: "모델명",
            size: 180,
            cell: ({ getValue, row, column }) => {
                const productId = row.original.productId;
                const product = productsData?.products?.find(p => p.id === productId);
                const models = product?.productModels || [];
                
                return (
                    <CustomSelectCell
                        value={getValue()}
                        onChange={(value) => handleCellUpdate(row.index, column.id, value)}
                        options={models.map(model => ({
                            label: `${model.modelName} (${model.modelCode})`,
                            value: model.id
                        }))}
                        placeholder="모델 선택"
                        disabled={!productId}
                    />
                );
            },
        },
        {
            id: "quantity",
            accessorKey: "quantity",
            header: "수량",
            size: 100,
            cell: ({ getValue, row, column }) => (
                <NumberInputCell
                    value={getValue()}
                    onChange={(value) => handleCellUpdate(row.index, column.id, value)}
                    placeholder="0"
                    min={1}
                />
            ),
        },
        {
            id: "unitPrice",
            accessorKey: "unitPrice",
            header: "단가",
            size: 120,
            cell: ({ getValue, row, column }) => (
                <NumberInputCell
                    value={getValue()}
                    onChange={(value) => handleCellUpdate(row.index, column.id, value)}
                    placeholder="0"
                    isCurrency={true}
                />
            ),
        },
        {
            id: "totalPrice",
            accessorKey: "totalPrice",
            header: "총 판매가",
            size: 140,
            cell: ({ getValue }) => (
                <div className="px-2 py-1 bg-gray-50 text-gray-700 rounded font-medium">
                    {getValue() ? `₩${new Intl.NumberFormat("ko-KR").format(getValue())}` : "-"}
                </div>
            ),
        },
        {
            id: "actions",
            header: "작업",
            size: 80,
            cell: ({ row }) => (
                <button
                    onClick={() => deleteRow(row.index)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="삭제"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            ),
        },
    ], [handleCellUpdate, deleteRow, salesRepsData, customersData, productsData, salesRepsLoading, customersLoading, productsLoading, getSalesReps, getCustomers, getProducts]);

    // Table instance
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        enableRowSelection: true,
    });

    // Load initial data
    useEffect(() => {
        getSalesReps({ variables: { search: "" } });
        getCustomers({ variables: { search: "" } });
        getProducts({ variables: { search: "" } });
    }, [getSalesReps, getCustomers, getProducts]);

    return (
        <div className="h-screen flex flex-col p-6">
            {/* Toast notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">매출 관리</h1>
                    <p className="text-gray-600">인터랙티브 매출 데이터 관리 시스템</p>
                </div>
                <button 
                    onClick={addNewRow}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>새 매출 추가</span>
                </button>
            </div>

            {/* Table Container */}
            <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-20">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                                            style={{ width: header.getSize() }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className={row.original.isNew ? "bg-blue-50" : "hover:bg-gray-50"}>
                                    {row.getVisibleCells().map(cell => (
                                        <td 
                                            key={cell.id} 
                                            className="px-3 py-2 whitespace-nowrap text-sm border-r border-gray-100"
                                            style={{ width: cell.column.getSize() }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesManagementPage; 