"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useLanguage, useTranslation } from "@/hooks/useLanguage.js";

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "",
  searchable = true,
  loading = false,
  disabled = false,
  error = null,
  onSearch = null,
  displayKey = "name",
  valueKey = "id",
  className = "",
  dropdownClassName = "",
  required = false,
  clearable = false,
  maxDropdownHeight = "200px",
}) => {
  // 다국어 객체인 경우 현재 언어에 맞는 값 반환
  const { t, currentLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // 선택된 옵션 찾기
  const selectedOption = options.find((option) => option[valueKey] === value);

  // 필터된 옵션들
  const filteredOptions = options.filter((option) => {
    if (!searchTerm) return true;
    const searchValue =
      typeof option[displayKey] === "object"
        ? Object.values(option[displayKey]).join(" ").toLowerCase()
        : String(option[displayKey]).toLowerCase();
    return searchValue.includes(searchTerm.toLowerCase());
  });

  // 검색 처리
  useEffect(() => {
    if (onSearch && searchTerm !== searchInputValue) {
      const timer = setTimeout(() => {
        onSearch(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, onSearch, searchInputValue]);

  // 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setSearchInputValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 드롭다운 열기/닫기
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // 옵션 선택 처리
  const handleOptionSelect = (option) => {
    onChange(option[valueKey]);
    setIsOpen(false);
    setSearchTerm("");
    setSearchInputValue("");
  };

  // 검색 입력 처리
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
    setSearchTerm(value);
  };

  // 클리어 처리
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  // 디스플레이 텍스트 가져오기
  const getDisplayText = (option) => {
    const displayValue = option[displayKey];
    if (typeof displayValue === "object") {
      return (
        displayValue[currentLanguage] ||
        displayValue.ko ||
        displayValue.en ||
        Object.values(displayValue)[0]
      );
    }
    return String(displayValue);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 메인 선택 박스 */}
      <div
        onClick={toggleDropdown}
        className={`
          relative w-full px-3 py-2 border rounded-lg cursor-pointer transition-all duration-200
          ${
            isOpen
              ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-20"
              : error
                ? "border-red-300 focus:border-red-500"
                : "border-gray-300 hover:border-gray-400"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"}
          ${isOpen ? "shadow-lg" : "shadow-sm"}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center">
            {selectedOption ? (
              <span
                className="text-gray-900 truncate"
                title={getDisplayText(selectedOption)}
              >
                {getDisplayText(selectedOption)}
              </span>
            ) : (
              <span className="text-gray-500 truncate">
                {placeholder || t("common.select")}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 ml-2">
            {clearable && selectedOption && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <span className="text-gray-400 hover:text-gray-600">×</span>
              </button>
            )}

            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            ) : (
              <ChevronDownIcon
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className={`
            absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg
            transform transition-all duration-200 origin-top
            ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            ${dropdownClassName}
          `}
          style={{ maxHeight: maxDropdownHeight }}
        >
          {/* 검색 입력 */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInputValue}
                  onChange={handleSearchChange}
                  placeholder={t("common.search")}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* 옵션 목록 */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">
                  {t("common.loading")}
                </p>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                {searchTerm ? "검색 결과가 없습니다" : "옵션이 없습니다"}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected =
                  selectedOption &&
                  selectedOption[valueKey] === option[valueKey];
                return (
                  <div
                    key={`${option[valueKey]}-${index}`}
                    onClick={() => handleOptionSelect(option)}
                    className={`
                      px-3 py-2 cursor-pointer flex items-center justify-between transition-colors duration-150
                      ${
                        isSelected
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span className="truncate" title={getDisplayText(option)}>
                      {getDisplayText(option)}
                    </span>
                    {isSelected && (
                      <CheckIcon className="h-4 w-4 text-blue-600 ml-2 flex-shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
