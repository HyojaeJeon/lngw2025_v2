"use client";

import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

const DatePickerCell = ({ 
  value, 
  onChange, 
  placeholder = "날짜 선택",
  disabled = false,
  dateFormat = 'YYYY-MM-DD'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const formatDisplayDate = (dateValue) => {
    if (!dateValue) return '';
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  const formatInputDate = (dateValue) => {
    if (!dateValue) return '';
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      
      // YYYY-MM-DD 형식으로 변환
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
      setTempValue(formatInputDate(value));
    }
  };

  const handleChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleSubmit = () => {
    if (tempValue) {
      try {
        const date = new Date(tempValue + 'T00:00:00.000Z');
        if (!isNaN(date.getTime())) {
          onChange(date.toISOString());
        } else {
          onChange(null);
        }
      } catch (error) {
        onChange(null);
      }
    } else {
      onChange(null);
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
        type="date"
        value={tempValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`w-full px-2 py-1 rounded cursor-pointer hover:bg-gray-50 flex items-center space-x-2 ${
        disabled 
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
          : 'bg-transparent'
      } ${value ? 'text-gray-900' : 'text-gray-400'}`}
    >
      <CalendarIcon className="h-4 w-4 text-gray-400" />
      <span>
        {value 
          ? formatDisplayDate(value)
          : placeholder
        }
      </span>
    </div>
  );
};

export default DatePickerCell; 