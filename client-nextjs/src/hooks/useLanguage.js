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

  // 번역 함수
  const t = useCallback(
    (key) => key.split(".").reduce((obj, k) => obj?.[k], translations) || key,
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
    return key.split(".").reduce((obj, k) => obj?.[k], translations) || key;
  }, [translations]);

  return { t, currentLanguage };
};