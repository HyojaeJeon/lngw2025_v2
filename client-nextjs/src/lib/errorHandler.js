"use client";

import { useCallback } from 'react';
import { useTranslation } from '@/hooks/useLanguage';

// ====================
// 에러 타입 상수
// ====================
export const ERROR_TYPES = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR', 
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE: 'DUPLICATE_ERROR',
  DATABASE: 'DATABASE_ERROR',
  NETWORK: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// ====================
// 에러 코드별 메시지 맵핑
// ====================
const ERROR_MESSAGES = {
  ko: {
    [ERROR_TYPES.VALIDATION]: '입력 정보를 확인해주세요.',
    [ERROR_TYPES.AUTHENTICATION]: '로그인이 필요합니다.',
    [ERROR_TYPES.AUTHORIZATION]: '권한이 없습니다.',
    [ERROR_TYPES.NOT_FOUND]: '요청하신 정보를 찾을 수 없습니다.',
    [ERROR_TYPES.DUPLICATE]: '이미 존재하는 정보입니다.',
    [ERROR_TYPES.DATABASE]: '데이터베이스 오류가 발생했습니다.',
    [ERROR_TYPES.NETWORK]: '네트워크 연결을 확인해주세요.',
    [ERROR_TYPES.UNKNOWN]: '알 수 없는 오류가 발생했습니다.',
    
    // 상품 관련 에러
    'PRODUCT_NOT_FOUND': '상품을 찾을 수 없습니다.',
    'PRODUCT_CODE_DUPLICATE': '이미 존재하는 상품 코드입니다.',
    'CATEGORY_NOT_FOUND': '카테고리를 찾을 수 없습니다.',
    'CATEGORY_CODE_DUPLICATE': '이미 존재하는 카테고리 코드입니다.',
    'INVALID_PRICE': '올바른 가격을 입력해주세요.',
    'INVALID_STOCK': '올바른 재고 수량을 입력해주세요.',
    
    // 일반적인 에러
    'REQUIRED_FIELD': '필수 입력 항목입니다.',
    'INVALID_FORMAT': '올바른 형식으로 입력해주세요.',
    'SERVER_ERROR': '서버 오류가 발생했습니다.',
    'SAVE_FAILED': '저장에 실패했습니다.',
    'DELETE_FAILED': '삭제에 실패했습니다.',
    'UPDATE_FAILED': '수정에 실패했습니다.',
  },
  en: {
    [ERROR_TYPES.VALIDATION]: 'Please check your input information.',
    [ERROR_TYPES.AUTHENTICATION]: 'Login required.',
    [ERROR_TYPES.AUTHORIZATION]: 'Permission denied.',
    [ERROR_TYPES.NOT_FOUND]: 'The requested information could not be found.',
    [ERROR_TYPES.DUPLICATE]: 'This information already exists.',
    [ERROR_TYPES.DATABASE]: 'A database error occurred.',
    [ERROR_TYPES.NETWORK]: 'Please check your network connection.',
    [ERROR_TYPES.UNKNOWN]: 'An unknown error occurred.',
    
    // Product related errors
    'PRODUCT_NOT_FOUND': 'Product not found.',
    'PRODUCT_CODE_DUPLICATE': 'Product code already exists.',
    'CATEGORY_NOT_FOUND': 'Category not found.',
    'CATEGORY_CODE_DUPLICATE': 'Category code already exists.',
    'INVALID_PRICE': 'Please enter a valid price.',
    'INVALID_STOCK': 'Please enter a valid stock quantity.',
    
    // General errors
    'REQUIRED_FIELD': 'This field is required.',
    'INVALID_FORMAT': 'Please enter in the correct format.',
    'SERVER_ERROR': 'Server error occurred.',
    'SAVE_FAILED': 'Failed to save.',
    'DELETE_FAILED': 'Failed to delete.',
    'UPDATE_FAILED': 'Failed to update.',
  },
  vi: {
    [ERROR_TYPES.VALIDATION]: 'Vui lòng kiểm tra thông tin đầu vào.',
    [ERROR_TYPES.AUTHENTICATION]: 'Yêu cầu đăng nhập.',
    [ERROR_TYPES.AUTHORIZATION]: 'Không có quyền truy cập.',
    [ERROR_TYPES.NOT_FOUND]: 'Không tìm thấy thông tin được yêu cầu.',
    [ERROR_TYPES.DUPLICATE]: 'Thông tin này đã tồn tại.',
    [ERROR_TYPES.DATABASE]: 'Lỗi cơ sở dữ liệu.',
    [ERROR_TYPES.NETWORK]: 'Vui lòng kiểm tra kết nối mạng.',
    [ERROR_TYPES.UNKNOWN]: 'Đã xảy ra lỗi không xác định.',
    
    // Product related errors
    'PRODUCT_NOT_FOUND': 'Không tìm thấy sản phẩm.',
    'PRODUCT_CODE_DUPLICATE': 'Mã sản phẩm đã tồn tại.',
    'CATEGORY_NOT_FOUND': 'Không tìm thấy danh mục.',
    'CATEGORY_CODE_DUPLICATE': 'Mã danh mục đã tồn tại.',
    'INVALID_PRICE': 'Vui lòng nhập giá hợp lệ.',
    'INVALID_STOCK': 'Vui lòng nhập số lượng tồn kho hợp lệ.',
    
    // General errors
    'REQUIRED_FIELD': 'Trường này là bắt buộc.',
    'INVALID_FORMAT': 'Vui lòng nhập đúng định dạng.',
    'SERVER_ERROR': 'Lỗi máy chủ.',
    'SAVE_FAILED': 'Lưu thất bại.',
    'DELETE_FAILED': 'Xóa thất bại.',
    'UPDATE_FAILED': 'Cập nhật thất bại.',
  }
};

// ====================
// 에러 파싱 유틸리티
// ====================
export const parseGraphQLError = (error) => {
  // GraphQL errors 배열에서 첫 번째 에러 추출
  if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphqlError = error.graphQLErrors[0];
    
    return {
      type: graphqlError.extensions?.code || ERROR_TYPES.UNKNOWN,
      message: graphqlError.message,
      extensions: graphqlError.extensions || {},
      path: graphqlError.path || null
    };
  }
  
  // Network error 처리
  if (error?.networkError) {
    return {
      type: ERROR_TYPES.NETWORK,
      message: error.networkError.message,
      extensions: {},
      path: null
    };
  }
  
  // 일반적인 에러
  return {
    type: ERROR_TYPES.UNKNOWN,
    message: error?.message || 'Unknown error',
    extensions: {},
    path: null
  };
};

// ====================
// 에러 메시지 획득 함수
// ====================
export const getErrorMessage = (error, language = 'ko') => {
  const parsedError = parseGraphQLError(error);
  const errorKey = parsedError.extensions?.errorKey || parsedError.type;
  
  // 특정 에러 키가 있는 경우 해당 메시지 반환
  if (ERROR_MESSAGES[language] && ERROR_MESSAGES[language][errorKey]) {
    return ERROR_MESSAGES[language][errorKey];
  }
  
  // 기본 타입별 메시지 반환
  if (ERROR_MESSAGES[language] && ERROR_MESSAGES[language][parsedError.type]) {
    return ERROR_MESSAGES[language][parsedError.type];
  }
  
  // 서버에서 온 원본 메시지 반환 (fallback)
  return parsedError.message;
};

// ====================
// 에러 핸들링 커스텀 훅
// ====================
export const useErrorHandler = () => {
  const { currentLanguage } = useTranslation();
  
  const handleError = useCallback((error, options = {}) => {
    const {
      showAlert = true,
      showConsole = true,
      customMessage = null,
      onError = null
    } = options;
    
    const parsedError = parseGraphQLError(error);
    const errorMessage = customMessage || getErrorMessage(error, currentLanguage);
    
    // 콘솔에 에러 로깅
    if (showConsole) {
      console.error('Error Details:', {
        type: parsedError.type,
        message: parsedError.message,
        extensions: parsedError.extensions,
        path: parsedError.path,
        originalError: error
      });
    }
    
    // 알림 표시
    if (showAlert) {
      alert(errorMessage);
    }
    
    // 커스텀 에러 핸들러 실행
    if (onError && typeof onError === 'function') {
      onError(parsedError, errorMessage);
    }
    
    return {
      parsedError,
      errorMessage,
      type: parsedError.type
    };
  }, [currentLanguage]);
  
  // 특정 타입별 에러 핸들러
  const handleValidationError = useCallback((error, fieldErrors = {}) => {
    const result = handleError(error, { showAlert: false });
    
    // 필드별 에러 메시지 추출
    if (result.parsedError.extensions?.fieldErrors) {
      Object.assign(fieldErrors, result.parsedError.extensions.fieldErrors);
    }
    
    return result;
  }, [handleError]);
  
  const handleAuthError = useCallback((error) => {
    const result = handleError(error);
    
    // 인증 에러인 경우 로그인 페이지로 리다이렉트
    if (result.type === ERROR_TYPES.AUTHENTICATION) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
    
    return result;
  }, [handleError]);
  
  return {
    handleError,
    handleValidationError,
    handleAuthError,
    getErrorMessage: (error) => getErrorMessage(error, currentLanguage),
    parseError: parseGraphQLError
  };
};

// ====================
// 에러 바운더리 컴포넌트용 유틸리티
// ====================
export const createErrorInfo = (error, errorInfo) => {
  return {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    errorInfo: {
      componentStack: errorInfo.componentStack
    },
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
    url: typeof window !== 'undefined' ? window.location.href : 'SSR'
  };
};

// ====================
// 폼 유효성 검사 유틸리티
// ====================
export const validateForm = (data, rules, language = 'ko') => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const rule = rules[field];
    
    // Required 검사
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = ERROR_MESSAGES[language]['REQUIRED_FIELD'];
      return;
    }
    
    // 타입별 검사
    if (value && rule.type) {
      switch (rule.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors[field] = ERROR_MESSAGES[language]['INVALID_FORMAT'];
          }
          break;
        case 'number':
          if (isNaN(value) || value < 0) {
            errors[field] = ERROR_MESSAGES[language]['INVALID_FORMAT'];
          }
          break;
        case 'price':
          if (isNaN(value) || value <= 0) {
            errors[field] = ERROR_MESSAGES[language]['INVALID_PRICE'];
          }
          break;
        case 'stock':
          if (isNaN(value) || value < 0 || !Number.isInteger(Number(value))) {
            errors[field] = ERROR_MESSAGES[language]['INVALID_STOCK'];
          }
          break;
      }
    }
    
    // 최소/최대 길이 검사
    if (value && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `최소 ${rule.minLength}자 이상 입력해주세요.`;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `최대 ${rule.maxLength}자까지 입력 가능합니다.`;
      }
    }
  });
  
  return errors;
};

export default useErrorHandler; 