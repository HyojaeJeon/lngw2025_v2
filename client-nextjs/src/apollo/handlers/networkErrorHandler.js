export const handleNetworkError = (networkError, operation, forward) => {
  if (!networkError) return;

  console.log('Network error:', networkError);

  // 연결 거부 에러 처리
  if (networkError.code === 'ECONNREFUSED' || networkError.message?.includes('Failed to fetch')) {
    console.warn('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    return;
  }

  // 401 Unauthorized 에러 처리
  if (networkError.statusCode === 401) {
    console.log('Unauthorized - clearing auth and redirecting');

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('persist:auth');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return;
  }

  // 기타 네트워크 에러 로깅
  console.error(`[Network error]: ${networkError.message}`, networkError);
};