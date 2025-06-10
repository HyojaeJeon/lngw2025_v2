"use client";

import React, { useState, useRef, useEffect } from 'react';

const NumberInputCell = ({ 
  value, 
  onChange, 
  placeholder = "0",
  min = 0,
  max,
  step = 1,
  isPercentage = false,
  isCurrency = false,
  precision = 0,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const formatDisplayValue = (val) => {
    if (val === null || val === undefined || val === '') return '';
    
    const numValue = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(numValue)) return '';

    if (isCurrency) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
      }).format(numValue);
    }

    if (isPercentage) {
      return `${numValue.toFixed(precision)}%`;
    }

    return numValue.toLocaleString('ko-KR', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    });
  };

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
      setTempValue(value?.toString() || '');
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // 숫자, 소수점, 음수 부호만 허용
    if (inputValue === '' || /^-?\d*\.?\d*$/.test(inputValue)) {
      setTempValue(inputValue);
    }
  };

  const handleSubmit = () => {
    const numValue = parseFloat(tempValue);
    
    if (isNaN(numValue)) {
      onChange(null);
    } else {
      // min, max 범위 검증
      let finalValue = numValue;
      if (min !== undefined && numValue < min) finalValue = min;
      if (max !== undefined && numValue > max) finalValue = max;
      
      onChange(finalValue);
    }
    
    setIsEditing(false);
    setTempValue('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Tab') {
      handleSubmit();
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`w-full px-2 py-1 rounded cursor-pointer hover:bg-gray-50 ${
        disabled 
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
          : 'bg-transparent'
      } ${value ? 'text-gray-900' : 'text-gray-400'}`}
    >
      {value !== null && value !== undefined && value !== '' 
        ? formatDisplayValue(value)
        : placeholder
      }
    </div>
  );
};

export default NumberInputCell; 