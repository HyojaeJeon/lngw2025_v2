"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FunnelIcon, ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ColumnHeaderFilter = ({ 
    column, 
    title, 
    data = [], 
    accessor,
    onFilterChange,
    onSortChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedValues, setSelectedValues] = useState(new Set());
    const [tempSelectedValues, setTempSelectedValues] = useState(new Set());
    const [selectAll, setSelectAll] = useState(true);
    const dropdownRef = useRef(null);

    // Extract unique values from the data for this column
    const uniqueValues = useMemo(() => {
        const values = data.map(row => {
            const value = accessor ? row[accessor] : row;
            
            // Handle nested objects (like salesRep.name)
            if (typeof value === 'object' && value !== null) {
                if (value.name) return value.name;
                if (value.firstName && value.lastName) return `${value.firstName} ${value.lastName}`;
                if (value.label) return value.label;
                return JSON.stringify(value);
            }
            
            return value || '';
        });
        
        return [...new Set(values)].sort();
    }, [data, accessor]);

    // Filter values based on search term
    const filteredValues = useMemo(() => {
        if (!searchTerm) return uniqueValues;
        return uniqueValues.filter(value => 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [uniqueValues, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                // Reset temp selection if canceled
                setTempSelectedValues(new Set(selectedValues));
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedValues]);

    // Initialize with all values selected
    useEffect(() => {
        if (uniqueValues.length > 0 && selectedValues.size === 0) {
            const allValues = new Set(uniqueValues);
            setSelectedValues(allValues);
            setTempSelectedValues(allValues);
        }
    }, [uniqueValues, selectedValues.size]);

    const handleSort = (direction) => {
        onSortChange?.(column.id, direction);
    };

    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        if (checked) {
            setTempSelectedValues(new Set(filteredValues));
        } else {
            setTempSelectedValues(new Set());
        }
    };

    const handleValueToggle = (value) => {
        const newSelection = new Set(tempSelectedValues);
        if (newSelection.has(value)) {
            newSelection.delete(value);
        } else {
            newSelection.add(value);
        }
        setTempSelectedValues(newSelection);
        
        // Update select all state
        setSelectAll(newSelection.size === filteredValues.length);
    };

    const handleApplyFilter = () => {
        setSelectedValues(new Set(tempSelectedValues));
        onFilterChange?.(column.id, Array.from(tempSelectedValues));
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClearFilter = () => {
        const allValues = new Set(uniqueValues);
        setSelectedValues(allValues);
        setTempSelectedValues(allValues);
        setSelectAll(true);
        onFilterChange?.(column.id, Array.from(allValues));
        setIsOpen(false);
        setSearchTerm('');
    };

    const hasActiveFilter = selectedValues.size < uniqueValues.length;
    const currentSort = column.getIsSorted();

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <div className="flex items-center space-x-1">
                <span className="whitespace-nowrap">{title}</span>
                
                {/* Sort buttons */}
                <div className="flex flex-col">
                    <button
                        onClick={() => handleSort('asc')}
                        className={`p-0.5 hover:bg-gray-200 rounded ${currentSort === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
                        title="오름차순 정렬"
                    >
                        <ChevronUpIcon className="h-3 w-3" />
                    </button>
                    <button
                        onClick={() => handleSort('desc')}
                        className={`p-0.5 hover:bg-gray-200 rounded ${currentSort === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
                        title="내림차순 정렬"
                    >
                        <ChevronDownIcon className="h-3 w-3" />
                    </button>
                </div>

                {/* Filter button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-1 hover:bg-gray-200 rounded ${hasActiveFilter ? 'text-blue-600' : 'text-gray-400'}`}
                    title="필터"
                >
                    <FunnelIcon className="h-4 w-4" />
                </button>
            </div>

            {/* Filter dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 flex flex-col">
                    {/* Search */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Select All */}
                    <div className="p-3 border-b border-gray-200">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">전체 선택</span>
                        </label>
                    </div>

                    {/* Values list */}
                    <div className="flex-1 overflow-y-auto max-h-48">
                        {filteredValues.length === 0 ? (
                            <div className="p-3 text-sm text-gray-500 text-center">
                                검색 결과가 없습니다.
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {filteredValues.map((value, index) => (
                                    <label 
                                        key={`${value}-${index}`} 
                                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedValues.has(value)}
                                            onChange={() => handleValueToggle(value)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700 truncate">
                                            {value || '(빈 값)'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="p-3 border-t border-gray-200 flex justify-between space-x-2">
                        <button
                            onClick={handleClearFilter}
                            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            초기화
                        </button>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleApplyFilter}
                                className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColumnHeaderFilter; 