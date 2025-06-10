"use client";

import React, { useState, useRef, useEffect } from 'react';

const TextInputCell = ({ 
  value, 
  onChange, 
  placeholder = "입력하세요",
  maxLength,
  disabled = false,
  multiline = false,
  rows = 3
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
      setTempValue(value || '');
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    if (maxLength && inputValue.length > maxLength) {
      return;
    }
    
    setTempValue(inputValue);
  };

  const handleSubmit = () => {
    onChange(tempValue.trim());
    setIsEditing(false);
    setTempValue('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempValue('');
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
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

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={textareaRef}
          value={tempValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white resize-none"
        />
      );
    }

    return (
      <input
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
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
      title={value || placeholder}
    >
      <div className={multiline ? 'whitespace-pre-wrap' : 'truncate'}>
        {value 
          ? (multiline ? value : truncateText(value))
          : placeholder
        }
      </div>
      {maxLength && value && (
        <div className="text-xs text-gray-400 mt-1">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default TextInputCell; 