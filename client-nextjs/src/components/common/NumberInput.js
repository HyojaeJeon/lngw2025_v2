"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocaleFormat } from "@/hooks/useLanguage.js";

const NumberInput = ({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  error = null,
  className = "",
  min = null,
  max = null,
  step = 1,
  decimals = 0,
  currency = false,
  currencyCode = "VND",
  allowNegative = false,
  required = false,
  ...props
}) => {
  const { formatNumber, formatCurrency } = useLocaleFormat();
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // 숫자를 표시용 문자열로 변환
  const formatDisplayValue = (num) => {
    if (num === null || num === undefined || num === "") return "";

    const numValue = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(numValue)) return "";

    if (currency) {
      return formatCurrency(numValue, currencyCode);
    } else {
      return formatNumber(numValue, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
  };

  // 표시용 문자열을 숫자로 변환
  const parseDisplayValue = (str) => {
    if (!str) return null;

    // 숫자가 아닌 문자들 제거 (소수점과 음수 기호는 유지)
    let cleanStr = str.replace(/[^\d.-]/g, "");

    // 음수 처리
    if (!allowNegative) {
      cleanStr = cleanStr.replace(/-/g, "");
    }

    const num = parseFloat(cleanStr);
    return isNaN(num) ? null : num;
  };

  // value prop이 변경될 때 displayValue 업데이트
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatDisplayValue(value));
    }
  }, [value, isFocused, currency, currencyCode, decimals]);

  // 컴포넌트 마운트 시 초기값 설정
  useEffect(() => {
    setDisplayValue(formatDisplayValue(value));
  }, []);

  // 입력 처리
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // 실시간으로 숫자 값 파싱하여 상위 컴포넌트에 전달
    const numericValue = parseDisplayValue(inputValue);

    // 범위 검증
    if (numericValue !== null) {
      if (min !== null && numericValue < min) return;
      if (max !== null && numericValue > max) return;
    }

    onChange(numericValue);
  };

  // 포커스 처리
  const handleFocus = (e) => {
    setIsFocused(true);
    // 포커스 시 순수 숫자 형태로 변경
    if (value !== null && value !== undefined) {
      setDisplayValue(String(value));
    }

    // 전체 텍스트 선택
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
      }
    }, 0);
  };

  // 블러 처리
  const handleBlur = (e) => {
    setIsFocused(false);

    // 블러 시 포맷된 형태로 변경
    if (value !== null && value !== undefined) {
      setDisplayValue(formatDisplayValue(value));
    } else {
      setDisplayValue("");
    }
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e) => {
    // 허용되는 키들
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "Home",
      "End",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];

    // 복사/붙여넣기 단축키
    if (
      (e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())
    ) {
      return;
    }

    // 허용되는 키가 아니고 숫자도 아닌 경우
    if (!allowedKeys.includes(e.key) && !/[0-9]/.test(e.key)) {
      // 소수점 허용 (decimals > 0인 경우)
      if (decimals > 0 && (e.key === "." || e.key === ",")) {
        // 이미 소수점이 있는지 확인
        if (displayValue.includes(".") || displayValue.includes(",")) {
          e.preventDefault();
        }
        return;
      }

      // 음수 허용 (allowNegative가 true인 경우)
      if (allowNegative && e.key === "-") {
        // 커서가 맨 앞에 있을 때만 허용
        if (e.target.selectionStart !== 0) {
          e.preventDefault();
        }
        return;
      }

      e.preventDefault();
    }

    // 위/아래 화살표로 값 증가/감소
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentValue = value || 0;
      const newValue =
        e.key === "ArrowUp" ? currentValue + step : currentValue - step;

      // 범위 검증
      if (min !== null && newValue < min) return;
      if (max !== null && newValue > max) return;

      onChange(newValue);
    }
  };

  // 붙여넣기 처리
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const numericValue = parseDisplayValue(pastedText);

    if (numericValue !== null) {
      // 범위 검증
      if (min !== null && numericValue < min) return;
      if (max !== null && numericValue > max) return;

      onChange(numericValue);
      setDisplayValue(String(numericValue));
    }
  };

  return (
    <div className={`${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
          ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"}
          ${currency ? "text-right" : "text-left"}
        `}
        {...props}
      />

      {/* 에러 메시지 */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* 도움말 텍스트 */}
      {(min !== null || max !== null) && !error && (
        <p className="mt-1 text-xs text-gray-500">
          {min !== null && max !== null
            ? `${formatNumber(min)} - ${formatNumber(max)} 사이의 값을 입력하세요`
            : min !== null
              ? `최소값: ${formatNumber(min)}`
              : `최대값: ${formatNumber(max)}`}
        </p>
      )}
    </div>
  );
};

export default NumberInput;
