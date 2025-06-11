// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";

// // locales 파일 import
// import koMessages from "../locales/ko.json";
// import enMessages from "../locales/en.json";
// import viMessages from "../locales/vi.json";

// const ALL_MESSAGES = { ko: koMessages, en: enMessages, vi: viMessages };

// // 지원 언어 목록
// const SUPPORTED_LANGUAGES = ["ko", "en", "vi"];
// const DEFAULT_LANGUAGE = "ko";

// // 언어 정보
// const LANGUAGE_INFO = {
//   ko: { name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
//   en: { name: "English", nativeName: "English", flag: "🇺🇸" },
//   vi: { name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
// };

// // 언어 관련 헬퍼 함수들
// const getLanguageName = (code) => LANGUAGE_INFO[code]?.name || code;
// const getLanguageNativeName = (code) => LANGUAGE_INFO[code]?.nativeName || code;
// const getLanguageFlag = (code) => LANGUAGE_INFO[code]?.flag || "🌐";

// // 중첩된 객체에서 키로 값을 가져오는 함수
// const getValueByPath = (obj, path) => {
//   return path.split(".").reduce((current, key) => current?.[key], obj);
// };

// // useLanguage 훅
// export const useLanguage = () => {
//   const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
//   const [translations, setTranslations] = useState({});

//   // 언어 초기화
//   useEffect(() => {
//     const savedLanguage = localStorage.getItem("language") || DEFAULT_LANGUAGE;
//     if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
//       setCurrentLanguage(savedLanguage);
//     }
//   }, []);

//   // 번역 데이터 로드
//   useEffect(() => {
//     setTranslations(ALL_MESSAGES[currentLanguage] || {});
//   }, [currentLanguage]);

//   // 언어 변경
//   const changeLanguage = useCallback((newLanguage) => {
//     if (SUPPORTED_LANGUAGES.includes(newLanguage)) {
//       setCurrentLanguage(newLanguage);
//       localStorage.setItem("language", newLanguage);
//     }
//   }, []);

//   // 다음 언어 가져오기
//   const getNextLanguage = useCallback(() => {
//     const currentIndex = SUPPORTED_LANGUAGES.indexOf(currentLanguage);
//     const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
//     return SUPPORTED_LANGUAGES[nextIndex];
//   }, [currentLanguage]);

//   // 현재 언어 정보
//   const getCurrentLanguageName = useCallback(
//     () => getLanguageName(currentLanguage),
//     [currentLanguage],
//   );
//   const getCurrentLanguageNativeName = useCallback(
//     () => getLanguageNativeName(currentLanguage),
//     [currentLanguage],
//   );
//   const getCurrentLanguageFlag = useCallback(
//     () => getLanguageFlag(currentLanguage),
//     [currentLanguage],
//   );

//   // useTranslation 훅
//   const useTranslation = () => {
//     const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
//     const [translations, setTranslations] = useState({});

//     // 언어 초기화
//     useEffect(() => {
//       const savedLanguage =
//         localStorage.getItem("language") || DEFAULT_LANGUAGE;
//       if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
//         setCurrentLanguage(savedLanguage);
//       }
//     }, []);

//     // 번역 데이터 로드
//     useEffect(() => {
//       setTranslations(ALL_MESSAGES[currentLanguage] || {});
//     }, [currentLanguage]);

//     // 번역 함수
//     const t = useCallback(
//       (key, fallback = key) => {
//         if (!key) return fallback;

//         const value = getValueByPath(translations, key);
//         return value || fallback;
//       },
//       [translations, currentLanguage],
//     );

//     return { t, currentLanguage };
//   };

//   return {
//     // 현재 언어 정보
//     currentLanguage,
//     getCurrentLanguageName,
//     getCurrentLanguageNativeName,
//     getCurrentLanguageFlag,

//     // 헬퍼 함수들
//     getLanguageName: useCallback((code) => getLanguageName(code), []),
//     getLanguageNativeName: useCallback(
//       (code) => getLanguageNativeName(code),
//       [],
//     ),
//     getLanguageFlag: useCallback((code) => getLanguageFlag(code), []),

//     // 번역 함수
//     useTranslation,

//     // 언어 변경
//     changeLanguage,
//     getNextLanguage,
//   };
// };

// // useLocaleFormat 훅 - 숫자와 통화 포맷팅
// export const useLocaleFormat = () => {
//   const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);

//   // 언어 초기화
//   useEffect(() => {
//     const savedLanguage = localStorage.getItem("language") || DEFAULT_LANGUAGE;
//     if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
//       setCurrentLanguage(savedLanguage);
//     }
//   }, []);

//   // 숫자 포맷팅
//   const formatNumber = useCallback(
//     (number, options = {}) => {
//       if (number === null || number === undefined || isNaN(number)) return "";

//       const locale =
//         currentLanguage === "ko"
//           ? "ko-KR"
//           : currentLanguage === "vi"
//             ? "vi-VN"
//             : "en-US";

//       return new Intl.NumberFormat(locale, options).format(number);
//     },
//     [currentLanguage],
//   );

//   // 통화 포맷팅
//   const formatCurrency = useCallback(
//     (amount, currencyCode = "VND", options = {}) => {
//       if (amount === null || amount === undefined || isNaN(amount)) return "";

//       const locale =
//         currentLanguage === "ko"
//           ? "ko-KR"
//           : currentLanguage === "vi"
//             ? "vi-VN"
//             : "en-US";

//       return new Intl.NumberFormat(locale, {
//         style: "currency",
//         currency: currencyCode,
//         ...options,
//       }).format(amount);
//     },
//     [currentLanguage],
//   );

//   // 날짜 포맷팅
//   const formatDate = useCallback(
//     (date, options = {}) => {
//       if (!date) return "";

//       const locale =
//         currentLanguage === "ko"
//           ? "ko-KR"
//           : currentLanguage === "vi"
//             ? "vi-VN"
//             : "en-US";

//       return new Intl.DateTimeFormat(locale, options).format(new Date(date));
//     },
//     [currentLanguage],
//   );

//   return {
//     formatNumber,
//     formatCurrency,
//     formatDate,
//     currentLanguage,
//   };
// };

// src/hooks/useLanguage.js (수정된 파일)

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

// 5. useLocaleFormat 훅도 Context를 사용하도록 수정
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
