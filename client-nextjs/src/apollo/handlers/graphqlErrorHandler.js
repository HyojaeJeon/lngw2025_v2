'use client';

import { notifyError, notifyWarning } from '../../utils/notifications.js';

export const handleGraphQLErrors = (graphQLErrors, operation, forward) => {
  if (!graphQLErrors || graphQLErrors.length === 0) return;

  graphQLErrors.forEach(({ message, locations, path, extensions }) => {
    console.log('GraphQL error:', { message, locations, path, extensions });

    // 인증 에러 처리
    if (extensions?.code === 'AUTHENTICATION_ERROR' || extensions?.errorKey === 'AUTHENTICATION_REQUIRED') {
      console.log('Authentication required - redirecting to login');

      // 토큰 제거
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('persist:auth');

        // 로그인 페이지로 리다이렉트 (현재 페이지가 로그인 페이지가 아닌 경우에만)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return;
    }

    // 기타 GraphQL 에러 로깅
    console.error(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      extensions
    );
  });
};