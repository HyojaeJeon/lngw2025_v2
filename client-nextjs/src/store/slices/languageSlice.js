import { createSlice } from '@reduxjs/toolkit';

// ====================
// 언어 관련 상수
// ====================
export const SUPPORTED_LANGUAGES = {
  ko: { code: 'ko', name: '한국어', nativeName: '한국어', flag: '🇰🇷' },
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  vi: { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
};

export const DEFAULT_LANGUAGE = 'ko';

// ====================
// 브라우저 언어 감지 함수
// ====================
const detectBrowserLanguage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  // 1. 로컬 스토리지에서 저장된 언어 확인
  const savedLanguage = localStorage.getItem('preferred_language');
  if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
    return savedLanguage;
  }

  // 2. 브라우저 언어 감지
  const browserLanguage = navigator.language || navigator.languages?.[0];
  if (browserLanguage) {
    const langCode = browserLanguage.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES[langCode]) {
      return langCode;
    }
  }

  // 3. 기본 언어 반환
  return DEFAULT_LANGUAGE;
};

// ====================
// 초기 상태
// ====================
const initialState = {
  currentLanguage: DEFAULT_LANGUAGE,
  supportedLanguages: SUPPORTED_LANGUAGES,
  isInitialized: false,
};

// ====================
// 언어 Slice
// ====================
const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    // 언어 초기화 (브라우저 언어 감지)
    initializeLanguage: (state) => {
      if (!state.isInitialized) {
        const detectedLanguage = detectBrowserLanguage();
        state.currentLanguage = detectedLanguage;
        state.isInitialized = true;

        // 로컬 스토리지에 저장
        if (typeof window !== 'undefined') {
          localStorage.setItem('preferred_language', detectedLanguage);
        }
      }
    },

    // 언어 변경
    setLanguage: (state, action) => {
      const newLanguage = action.payload;
      
      // 지원되는 언어인지 확인
      if (SUPPORTED_LANGUAGES[newLanguage]) {
        state.currentLanguage = newLanguage;

        // 로컬 스토리지에 저장
        if (typeof window !== 'undefined') {
          localStorage.setItem('preferred_language', newLanguage);
          
          // HTML lang 속성 업데이트
          document.documentElement.lang = newLanguage;
        }
      }
    },

    // 언어 강제 설정 (초기화 상태 무시)
    forceSetLanguage: (state, action) => {
      const newLanguage = action.payload;
      
      if (SUPPORTED_LANGUAGES[newLanguage]) {
        state.currentLanguage = newLanguage;
        state.isInitialized = true;

        if (typeof window !== 'undefined') {
          localStorage.setItem('preferred_language', newLanguage);
          document.documentElement.lang = newLanguage;
        }
      }
    },

    // 언어 초기화 상태 리셋
    resetLanguageState: (state) => {
      state.isInitialized = false;
      state.currentLanguage = DEFAULT_LANGUAGE;
    },
  },
});

// ====================
// 셀렉터 함수들
// ====================
export const selectCurrentLanguage = (state) => state.language.currentLanguage;
export const selectSupportedLanguages = (state) => state.language.supportedLanguages;
export const selectCurrentLanguageInfo = (state) => 
  state.language.supportedLanguages[state.language.currentLanguage];
export const selectIsLanguageInitialized = (state) => state.language.isInitialized;

// ====================
// 헬퍼 함수들
// ====================
export const getLanguageName = (langCode) => {
  return SUPPORTED_LANGUAGES[langCode]?.name || langCode;
};

export const getLanguageNativeName = (langCode) => {
  return SUPPORTED_LANGUAGES[langCode]?.nativeName || langCode;
};

export const getLanguageFlag = (langCode) => {
  return SUPPORTED_LANGUAGES[langCode]?.flag || '🌐';
};

// ====================
// 액션과 리듀서 내보내기
// ====================
export const { 
  initializeLanguage, 
  setLanguage, 
  forceSetLanguage, 
  resetLanguageState 
} = languageSlice.actions;

export default languageSlice.reducer; 