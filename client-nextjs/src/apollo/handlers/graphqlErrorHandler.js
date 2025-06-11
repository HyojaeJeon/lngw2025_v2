
'use client';

import { showNotification } from '../../utils/notifications';

/**
 * GraphQL 에러를 중앙에서 처리하는 함수
 * @param {Array} graphQLErrors - Apollo Link에서 전달된 GraphQL 에러 배열
 */
export const handleGraphQLErrors = (graphQLErrors) => {
  graphQLErrors.forEach(({ message, extensions, locations, path }) => {
    const errorCode = extensions?.code || extensions?.errorKey;
    const errorMessage = extensions?.message || message;

    console.error(`[GraphQL Error]:`, {
      code: errorCode,
      message: errorMessage,
      locations,
      path,
      extensions
    });

    switch (errorCode) {
      case 'UNAUTHENTICATED':
      case 'AUTHENTICATION_ERROR':
        showNotification('로그인이 필요합니다. 다시 로그인해주세요.');
        // 로그인 페이지로 리다이렉트
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }, 1500);
        break;

      case 'FORBIDDEN':
      case 'AUTHORIZATION_ERROR':
        showNotification('이 작업을 수행할 권한이 없습니다.');
        break;

      case 'VALIDATION_ERROR':
        const details = extensions?.details || '입력값이 올바르지 않습니다.';
        showNotification(`입력값 오류: ${details}`);
        break;
      
      // 카테고리 관련 에러
      case 'CATEGORY_NOT_FOUND':
        showNotification('카테고리를 찾을 수 없습니다.');
        break;
      
      case 'CATEGORY_CODE_EXISTS':
        showNotification('이미 존재하는 카테고리 코드입니다.');
        break;
      
      case 'CATEGORY_CREATE_FAILED':
        showNotification('카테고리 생성에 실패했습니다.');
        break;
      
      case 'CATEGORY_UPDATE_FAILED':
        showNotification('카테고리 수정에 실패했습니다.');
        break;
      
      case 'CATEGORY_DELETE_FAILED':
        showNotification('카테고리 삭제에 실패했습니다.');
        break;

      // 제품 관련 에러
      case 'PRODUCT_NOT_FOUND':
        showNotification('제품을 찾을 수 없습니다.');
        break;
      
      case 'PRODUCT_CODE_DUPLICATE':
        showNotification('이미 존재하는 제품 코드입니다.');
        break;

      // 일반적인 에러
      case 'DATABASE_ERROR':
        showNotification('데이터베이스 오류가 발생했습니다.');
        break;
      
      case 'INTERNAL_SERVER_ERROR':
        showNotification('서버 내부 오류가 발생했습니다.');
        break;

      case 'NOT_FOUND':
        showNotification('요청하신 정보를 찾을 수 없습니다.');
        break;

      default:
        showNotification(errorMessage || '알 수 없는 서버 오류가 발생했습니다.');
        break;
    }
  });
};
