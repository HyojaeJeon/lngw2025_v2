"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentLanguage,
  selectSupportedLanguages,
  selectCurrentLanguageInfo,
  setLanguage,
  initializeLanguage,
  getLanguageFlag,
  getLanguageNativeName,
} from '../../store/slices/languageSlice';

// ====================
// 언어 선택 드롭다운 컴포넌트
// ====================
const LanguageSelector = ({ 
  className = "",
  showFlag = true,
  showNativeName = true,
  variant = "default" // "default", "compact", "minimal"
}) => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const supportedLanguages = useSelector(selectSupportedLanguages);
  const currentLanguageInfo = useSelector(selectCurrentLanguageInfo);
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 컴포넌트 마운트 시 언어 초기화
  useEffect(() => {
    dispatch(initializeLanguage());
  }, [dispatch]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 언어 변경 핸들러
  const handleLanguageChange = (langCode) => {
    dispatch(setLanguage(langCode));
    setIsOpen(false);
  };

  // 키보드 네비게이션
  const handleKeyDown = (event, langCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange(langCode);
    }
  };

  // 스타일 변형에 따른 클래스
  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return "text-sm py-1 px-2";
      case "minimal":
        return "text-xs py-0.5 px-1";
      default:
        return "text-sm py-2 px-3";
    }
  };

  return (
    <div 
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      {/* 언어 선택 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-between gap-2 
          ${getVariantClasses()}
          bg-white border border-gray-300 rounded-md shadow-sm 
          hover:bg-gray-50 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="언어 선택"
      >
        <div className="flex items-center gap-2">
          {showFlag && (
            <span className="text-lg">
              {getLanguageFlag(currentLanguage)}
            </span>
          )}
          {showNativeName && (
            <span className="font-medium">
              {getLanguageNativeName(currentLanguage)}
            </span>
          )}
        </div>
        
        {/* 드롭다운 화살표 */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="
          absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 
          ring-black ring-opacity-5 focus:outline-none z-50
        ">
          <div className="py-1">
            {Object.entries(supportedLanguages).map(([langCode, langInfo]) => (
              <button
                key={langCode}
                onClick={() => handleLanguageChange(langCode)}
                onKeyDown={(e) => handleKeyDown(e, langCode)}
                className={`
                  w-full text-left px-4 py-2 text-sm flex items-center gap-3
                  transition-colors duration-150
                  ${currentLanguage === langCode 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                role="menuitem"
                tabIndex={0}
              >
                <span className="text-lg">{langInfo.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{langInfo.nativeName}</span>
                  <span className="text-xs text-gray-500">{langInfo.name}</span>
                </div>
                {currentLanguage === langCode && (
                  <svg 
                    className="w-4 h-4 ml-auto text-blue-600" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ====================
// 간단한 언어 스위처 (토글 형태)
// ====================
export const LanguageToggle = ({ className = "" }) => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const supportedLanguages = useSelector(selectSupportedLanguages);

  const languageList = Object.keys(supportedLanguages);
  
  const handleToggle = () => {
    const currentIndex = languageList.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languageList.length;
    const nextLanguage = languageList[nextIndex];
    dispatch(setLanguage(nextLanguage));
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        inline-flex items-center gap-1 px-2 py-1 text-sm
        bg-gray-100 hover:bg-gray-200 rounded-md
        transition-colors duration-200
        ${className}
      `}
      title="언어 변경"
    >
      <span>{getLanguageFlag(currentLanguage)}</span>
      <span className="text-xs font-medium">
        {currentLanguage.toUpperCase()}
      </span>
    </button>
  );
};

// ====================
// 언어 초기화 컴포넌트 (앱 시작 시 사용)
// ====================
export const LanguageInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeLanguage());
  }, [dispatch]);

  return children;
};

export default LanguageSelector; 