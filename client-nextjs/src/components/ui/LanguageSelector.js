
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
export const LanguageSelector = ({ 
  variant = "default", 
  className = "",
  showFlag = true,
  showNativeName = true,
  size = "md"
}) => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const supportedLanguages = useSelector(selectSupportedLanguages);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languageList = Object.keys(supportedLanguages);

  // 외부 클릭 감지로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    dispatch(setLanguage(langCode));
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-3"
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (variant === "compact") {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            inline-flex items-center gap-2 ${currentSizeClass}
            bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
            rounded-md transition-colors duration-200 border-0
          `}
          title="언어 변경"
        >
          {showFlag && <span>{getLanguageFlag(currentLanguage)}</span>}
          <span className="font-medium">
            {showNativeName 
              ? getLanguageNativeName(currentLanguage)
              : currentLanguage.toUpperCase()
            }
          </span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="py-1">
              {languageList.map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => handleLanguageChange(langCode)}
                  className={`
                    w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                    flex items-center gap-3 transition-colors duration-200
                    ${currentLanguage === langCode 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <span>{getLanguageFlag(langCode)}</span>
                  <span>{getLanguageNativeName(langCode)}</span>
                  {currentLanguage === langCode && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
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
  }

  // 기본 변형
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 w-full ${currentSizeClass}
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
          rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
      >
        {showFlag && <span className="text-lg">{getLanguageFlag(currentLanguage)}</span>}
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-900 dark:text-white">
            {getLanguageNativeName(currentLanguage)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {currentLanguage.toUpperCase()}
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-2">
            {languageList.map((langCode) => (
              <button
                key={langCode}
                onClick={() => handleLanguageChange(langCode)}
                className={`
                  w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700
                  flex items-center gap-3 transition-colors duration-200
                  ${currentLanguage === langCode 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <span className="text-lg">{getLanguageFlag(langCode)}</span>
                <div className="flex-1">
                  <div className="font-medium">{getLanguageNativeName(langCode)}</div>
                  <div className="text-xs opacity-70">{langCode.toUpperCase()}</div>
                </div>
                {currentLanguage === langCode && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
  const isInitialized = useSelector((state) => state.language?.isInitialized || false);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeLanguage());
    }
  }, [dispatch, isInitialized]);

  return children;
};

export default LanguageSelector;
