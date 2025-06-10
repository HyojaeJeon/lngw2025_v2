"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const CustomSelectCell = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "선택하세요",
  displayKey = 'label',
  valueKey = 'value',
  disabled = false,
  renderOption,
  renderSelected
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => 
    option[valueKey] === value || 
    (typeof option === 'string' && option === value)
  ) || null;

  const getDisplayValue = (option) => {
    if (!option) return placeholder;
    
    if (renderSelected) {
      return renderSelected(option);
    }
    
    if (typeof option === 'string') {
      return option;
    }
    
    return option[displayKey] || option.label || option.name || option.value;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full min-w-[150px] px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          disabled 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
            : 'hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`block truncate ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
            {getDisplayValue(selectedOption)}
          </span>
          {!disabled && (
            <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[100] max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              옵션이 없습니다.
            </div>
          ) : (
            options.map((option, index) => (
              <div
                key={option.value || index}
                onClick={() => handleSelect(option.value)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                  value === option.value ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelectCell; 