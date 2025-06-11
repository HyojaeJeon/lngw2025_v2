"use client";

import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import {
  selectCurrentLanguage,
  selectSupportedLanguages,
  selectCurrentLanguageInfo,
  selectIsLanguageInitialized,
  setLanguage,
  forceSetLanguage,
  initializeLanguage,
  resetLanguageState,
  getLanguageName,
  getLanguageNativeName,
  getLanguageFlag,
} from "../store/slices/languageSlice";

import koMessages from "../locales/ko.json";
import enMessages from "../locales/en.json";
import viMessages from "../locales/vi.json";

const ALL_MESSAGES = { ko: koMessages, en: enMessages, vi: viMessages };

export const useLanguage = () => {
  const dispatch = useDispatch();

  // 상태
  const currentLanguage = useSelector(selectCurrentLanguage);
  const supportedLanguages = useSelector(selectSupportedLanguages);
  const currentLanguageInfo = useSelector(selectCurrentLanguageInfo);
  const isInitialized = useSelector(selectIsLanguageInitialized);

  // 번역 메시지
  const translations = ALL_MESSAGES[currentLanguage] || {};

  // 액션 호출
  const changeLanguage = useCallback(
    (lang) => dispatch(setLanguage(lang)),
    [dispatch],
  );
  const forceChangeLanguage = useCallback(
    (lang) => dispatch(forceSetLanguage(lang)),
    [dispatch],
  );
  const initializeLanguageSettings = useCallback(
    () => dispatch(initializeLanguage()),
    [dispatch],
  );
  const resetLanguage = useCallback(
    () => dispatch(resetLanguageState()),
    [dispatch],
  );

  // 유틸
  const languageList = useMemo(
    () => Object.keys(supportedLanguages),
    [supportedLanguages],
  );
  const isLanguageSupported = useCallback(
    (code) => Boolean(supportedLanguages[code]),
    [supportedLanguages],
  );
  const getNextLanguage = useCallback(() => {
    const idx = languageList.indexOf(currentLanguage);
    return languageList[(idx + 1) % languageList.length];
  }, [languageList, currentLanguage]);
  const getPreviousLanguage = useCallback(() => {
    const idx = languageList.indexOf(currentLanguage);
    return languageList[idx === 0 ? languageList.length - 1 : idx - 1];
  }, [languageList, currentLanguage]);

  // 언어 정보 헬퍼
  const getCurrentLanguageName = useCallback(
    () => getLanguageName(currentLanguage),
    [currentLanguage],
  );
  const getCurrentLanguageNativeName = useCallback(
    () => getLanguageNativeName(currentLanguage),
    [currentLanguage],
  );
  const getCurrentLanguageFlag = useCallback(
    () => getLanguageFlag(currentLanguage),
    [currentLanguage],
  );

  // 번역 함수 - 안전한 문자열 반환 보장
  const t = useCallback(
    (key) => {
      if (!key || typeof key !== 'string') return key || '';
      
      const result = key.split(".").reduce((obj, k) => obj?.[k], translations);
      
      // 결과가 문자열이 아닌 경우 키를 반환
      if (typeof result !== 'string') {
        return key;
      }
      
      return result || key;
    },
    [translations],
  );

  return {
    currentLanguage,
    supportedLanguages,
    currentLanguageInfo,
    isInitialized,
    languageList,

    changeLanguage,
    forceChangeLanguage,
    initializeLanguageSettings,
    resetLanguage,

    isLanguageSupported,
    getNextLanguage,
    getPreviousLanguage,

    getCurrentLanguageName,
    getCurrentLanguageNativeName,
    getCurrentLanguageFlag,

    t,
  };
};

// ====================
// 번역 전용 훅
// ====================
export const useTranslation = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);

  // 번역 메시지
  const translations = ALL_MESSAGES[currentLanguage] || {};

  const t = useCallback((key) => {
    if (!key || typeof key !== 'string') return key || '';
    
    const result = key.split(".").reduce((obj, k) => obj?.[k], translations);
    
    // 결과가 문자열이 아닌 경우 키를 반환
    if (typeof result !== 'string') {
      return key;
    }
    
    return result || key;
  }, [translations]);

  return { t, currentLanguage };
};

// ====================
// 로케일 포맷 전용 훅
// ====================
export const useLocaleFormat = () => {
  const currentLanguage = useSelector(selectCurrentLanguage);

  // 통화 포맷 함수
  const formatCurrency = useCallback((amount, currency = 'KRW') => {
    if (!amount && amount !== 0) return '';
    
    const locale = currentLanguage === 'ko' ? 'ko-KR' 
                 : currentLanguage === 'vi' ? 'vi-VN' 
                 : 'en-US';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      // fallback to basic formatting
      return `${currency} ${Number(amount).toLocaleString()}`;
    }
  }, [currentLanguage]);

  // 숫자 포맷 함수
  const formatNumber = useCallback((number) => {
    if (!number && number !== 0) return '';
    
    const locale = currentLanguage === 'ko' ? 'ko-KR' 
                 : currentLanguage === 'vi' ? 'vi-VN' 
                 : 'en-US';
    
    try {
      return new Intl.NumberFormat(locale).format(number);
    } catch (error) {
      // fallback to basic formatting
      return Number(number).toLocaleString();
    }
  }, [currentLanguage]);

  // 퍼센트 포맷 함수
  const formatPercent = useCallback((number, decimals = 1) => {
    if (!number && number !== 0) return '';
    
    const locale = currentLanguage === 'ko' ? 'ko-KR' 
                 : currentLanguage === 'vi' ? 'vi-VN' 
                 : 'en-US';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(number / 100);
    } catch (error) {
      // fallback to basic formatting
      return `${number}%`;
    }
  }, [currentLanguage]);

  // 날짜 포맷 함수
  const formatDate = useCallback((date, options = {}) => {
    if (!date) return '';
    
    const locale = currentLanguage === 'ko' ? 'ko-KR' 
                 : currentLanguage === 'vi' ? 'vi-VN' 
                 : 'en-US';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    try {
      return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
    } catch (error) {
      // fallback to basic formatting
      return new Date(date).toLocaleDateString();
    }
  }, [currentLanguage]);

  return {
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
  };
};