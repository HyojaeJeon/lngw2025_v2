
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// locales 파일 import
import koMessages from "../locales/ko.json";
import enMessages from "../locales/en.json";
import viMessages from "../locales/vi.json";

const ALL_MESSAGES = { ko: koMessages, en: enMessages, vi: viMessages };
const SUPPORTED_LANGUAGES = ["ko", "en", "vi"];
const DEFAULT_LANGUAGE = "ko";
const LANGUAGE_INFO = {
  ko: { name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  en: { name: "English", nativeName: "English", flag: "🇺🇸" },
  vi: { name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
};

// 1. Context 생성
const LanguageContext = createContext(null);

// 2. Provider 컴포넌트 생성
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || DEFAULT_LANGUAGE;
    if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    setTranslations(ALL_MESSAGES[currentLanguage] || {});
  }, [currentLanguage]);

  const changeLanguage = useCallback((newLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(newLanguage)) {
      setCurrentLanguage(newLanguage);
      localStorage.setItem("language", newLanguage);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentLanguage,
      translations,
      changeLanguage,
    }),
    [currentLanguage, translations, changeLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. useLanguage 훅 (언어 정보 및 변경)
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  const { currentLanguage, changeLanguage } = context;

  const getNextLanguage = useCallback(() => {
    const currentIndex = SUPPORTED_LANGUAGES.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
    return SUPPORTED_LANGUAGES[nextIndex];
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    getNextLanguage,
    getLanguageName: (code) => LANGUAGE_INFO[code]?.name || code,
    getLanguageNativeName: (code) => LANGUAGE_INFO[code]?.nativeName || code,
    getLanguageFlag: (code) => LANGUAGE_INFO[code]?.flag || "🌐",
  };
};

// 4. useTranslation 훅 (번역 기능 전용)
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }

  const { translations, currentLanguage } = context;

  const t = useCallback(
    (key, fallback = key) => {
      if (!key) return fallback;
      const getValueByPath = (obj, path) =>
        path.split(".").reduce((current, k) => current?.[k], obj);
      const value = getValueByPath(translations, key);
      return value || fallback;
    },
    [translations],
  );

  return { t, currentLanguage };
};

// 5. useLocaleFormat 훅
export const useLocaleFormat = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLocaleFormat must be used within a LanguageProvider");
  }
  const { currentLanguage } = context;

  const getLocale = (lang) => {
    if (lang === "ko") return "ko-KR";
    if (lang === "vi") return "vi-VN";
    return "en-US";
  };

  const formatNumber = useCallback(
    (number, options = {}) => {
      if (number === null || number === undefined || isNaN(number)) return "";
      return new Intl.NumberFormat(getLocale(currentLanguage), options).format(
        number,
      );
    },
    [currentLanguage],
  );

  const formatCurrency = useCallback(
    (amount, currencyCode = "VND", options = {}) => {
      if (amount === null || amount === undefined || isNaN(amount)) return "";
      return new Intl.NumberFormat(getLocale(currentLanguage), {
        style: "currency",
        currency: currencyCode,
        ...options,
      }).format(amount);
    },
    [currentLanguage],
  );

  const formatDate = useCallback(
    (date, options = {}) => {
      if (!date) return "";
      return new Intl.DateTimeFormat(
        getLocale(currentLanguage),
        options,
      ).format(new Date(date));
    },
    [currentLanguage],
  );

  return { formatNumber, formatCurrency, formatDate, currentLanguage };
};
