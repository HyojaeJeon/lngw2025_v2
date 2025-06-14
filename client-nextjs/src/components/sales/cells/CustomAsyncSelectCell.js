"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const CustomAsyncSelectCell = ({ value, onChange = () => {}, options = [], loading = false, placeholder = "선택하세요", displayKey = "name", onSearch = () => {}, renderOption, renderSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (onSearch && searchTerm) {
      const debounceTimer = setTimeout(() => {
        onSearch(searchTerm);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, onSearch]);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedOption = options.find((option) => option.id === value) || null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-w-[200px] px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50"
      >
        <div className="flex items-center justify-between">
          <span className="block truncate">{selectedOption ? (renderSelected ? renderSelected(selectedOption) : selectedOption[displayKey]) : placeholder}</span>
          <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[100] max-h-60 flex flex-col">
          {/* Search input */}
          <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Options container */}
          <div className="flex-1 overflow-auto">
            {/* Loading state */}
            {loading && (
              <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                로딩 중...
              </div>
            )}

            {/* No results */}
            {!loading && options.length === 0 && <div className="px-3 py-2 text-sm text-gray-500">{searchTerm ? "검색 결과가 없습니다." : "옵션이 없습니다."}</div>}

            {/* Options */}
            {!loading &&
              options.map((option, index) => (
                <div
                  key={option.id || index}
                  onClick={() => handleSelect(option.id)}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${value === option.id ? "bg-blue-50 text-blue-900" : "text-gray-900"}`}
                >
                  {renderOption ? (
                    renderOption(option)
                  ) : (
                    <div>
                      <div className="font-medium">{option[displayKey] || option.name || option.label}</div>
                      {option.subtitle && <div className="text-xs text-gray-500">{option.subtitle}</div>}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAsyncSelectCell;
