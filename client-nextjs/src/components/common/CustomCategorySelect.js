
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@/hooks/useLanguage.js";
import { GET_CATEGORIES } from "@/lib/graphql/categoryQueries.js";

const CustomCategorySelect = ({ value, onChange, placeholder = "선택하세요" }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const observerRef = useRef(null);

  const { data, loading, error, fetchMore } = useQuery(GET_CATEGORIES, {
    variables: { 
      limit: 10, 
      offset: 0,
      isActive: true 
    },
    notifyOnNetworkStatusChange: true,
  });

  const categories = data?.categories || [];

  // 무한 스크롤을 위한 IntersectionObserver 설정
  useEffect(() => {
    if (!isOpen || !listRef.current) return;

    const options = {
      root: listRef.current,
      rootMargin: '0px',
      threshold: 1.0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry.isIntersecting && !loading && categories.length >= 10) {
        fetchMore({
          variables: {
            offset: categories.length,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.categories.length === 0) {
              return prev;
            }
            return {
              ...prev,
              categories: [...prev.categories, ...fetchMoreResult.categories],
            };
          },
        });
      }
    }, options);

    // 마지막 항목을 감시
    const lastItem = listRef.current.querySelector('.category-item:last-child');
    if (lastItem) {
      observerRef.current.observe(lastItem);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isOpen, categories.length, loading, fetchMore]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 선택된 카테고리 초기화
  useEffect(() => {
    if (value && categories.length > 0) {
      const selected = categories.find(cat => cat.id === parseInt(value));
      setSelectedCategory(selected);
    } else {
      setSelectedCategory(null);
    }
  }, [value, categories]);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    onChange(category.id.toString());
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedCategory(null);
    onChange("");
    setIsOpen(false);
  };

  const getDisplayName = (category) => {
    if (!category) return "";
    return category.names?.ko || category.name || `카테고리 ${category.id}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
      >
        <span className="block truncate">
          {selectedCategory ? getDisplayName(selectedCategory) : placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* 전체 옵션 */}
          <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
            <div onClick={handleClear} className="flex items-center justify-between">
              <span className="text-gray-700">{t('products.filterByCategory')}</span>
              {!selectedCategory && (
                <CheckIcon className="h-5 w-5 text-blue-500" />
              )}
            </div>
          </div>

          {/* 카테고리 리스트 */}
          <div ref={listRef} className="max-h-48 overflow-y-auto">
            {loading && categories.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-center">
                {t('common.loading')}...
              </div>
            ) : error ? (
              <div className="px-3 py-2 text-red-500 text-center">
                {t('common.error')}
              </div>
            ) : categories.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-center">
                {t('products.categories.noCategories')}
              </div>
            ) : (
              <>
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className={`category-item px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between ${
                      selectedCategory?.id === category.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleSelect(category)}
                  >
                    <span className="text-gray-700 truncate">
                      {getDisplayName(category)}
                    </span>
                    {selectedCategory?.id === category.id && (
                      <CheckIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
                {loading && categories.length > 0 && (
                  <div className="px-3 py-2 text-gray-500 text-center">
                    {t('common.loading')}...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCategorySelect;
