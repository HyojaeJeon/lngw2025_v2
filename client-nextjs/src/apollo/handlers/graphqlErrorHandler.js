'use client';

import { notifyError, notifyWarning } from '../../utils/notifications.js';

export const handleGraphQLError = (graphQLErrors, lang = 'ko') => {
  if (!graphQLErrors || !Array.isArray(graphQLErrors)) {
    return;
  }

  graphQLErrors.forEach(err => {
    console.error('GraphQL error:', err);

    // 안전한 메시지 추출
    let message = '알 수 없는 오류가 발생했습니다';
    let errorCode = 'UNKNOWN_ERROR';

    try {
      message = err?.message || message;
      errorCode = err?.extensions?.errorKey || errorCode;
    } catch (extractError) {
      console.warn('Error extracting GraphQL error details:', extractError);
    }

    // 개발 환경에서 추가 디버깅 정보
    if (process.env.NODE_ENV === 'development') {
      console.group('GraphQL Error Details');
      console.log('Message:', message);
      console.log('Error Code:', errorCode);
      console.log('Path:', err?.path);
      console.log('Locations:', err?.locations);
      console.log('Extensions:', err?.extensions);
      console.groupEnd();
    }

    // 특정 에러 코드에 따른 처리
    switch (errorCode) {
      case 'UNAUTHENTICATED':
        notifyError('인증이 필요합니다. 다시 로그인해주세요.');
        // 로그인 페이지로 리디렉션 등의 처리
        break;
      case 'FORBIDDEN':
        notifyError('접근 권한이 없습니다.');
        break;
      case 'VALIDATION_ERROR':
        notifyWarning(message);
        break;
      case 'NOT_FOUND':
      case 'CATEGORY_NOT_FOUND':
        notifyWarning('요청한 데이터를 찾을 수 없습니다.');
        break;
      case 'CATEGORY_CODE_EXISTS':
        notifyWarning('이미 존재하는 카테고리 코드입니다.');
        break;
      case 'DATABASE_ERROR':
        notifyError('데이터베이스 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        break;
      default:
        // destructuring 에러나 기타 JavaScript 에러 처리
        if (message.includes('destructure') || message.includes('undefined')) {
          notifyError('데이터 처리 중 오류가 발생했습니다. 페이지를 새로고침하거나 관리자에게 문의하세요.');
        } else {
          notifyError(message);
        }
    }
  });
};
export { handleGraphQLErrors };