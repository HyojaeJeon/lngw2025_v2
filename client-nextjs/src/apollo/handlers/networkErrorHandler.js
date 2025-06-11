import { notifyError } from '../../utils/notifications.js';

export const handleNetworkError = (networkError, lang = 'ko') => {
  if (!networkError) {
    return;
  }

  console.error('Network error:', networkError);

  // WebSocket 관련 에러는 조용히 처리 (개발 환경에서만 로그)
  if (networkError.message && (
    networkError.message.includes('WebSocket') ||
    networkError.message.includes('__nextjs_original-stack-frames') ||
    networkError.message.includes('403') && networkError.message.includes('Forbidden')
  )) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Development environment network issue (non-critical):', networkError.message);
    }
    return; // 사용자에게 알림을 표시하지 않음
  }

  // 네트워크 에러 타입에 따른 처리
  if (networkError.statusCode) {
    switch (networkError.statusCode) {
      case 401:
        notifyError('인증이 만료되었습니다. 다시 로그인해주세요.');
        break;
      case 403:
        notifyError('접근 권한이 없습니다.');
        break;
      case 404:
        notifyError('요청한 리소스를 찾을 수 없습니다.');
        break;
      case 500:
        notifyError('서버 내부 오류가 발생했습니다.');
        break;
      default:
        notifyError(`네트워크 오류가 발생했습니다 (${networkError.statusCode})`);
    }
  } else if (networkError.message) {
    // 연결 오류 등
    if (networkError.message.includes('fetch')) {
      notifyError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else if (networkError.message.includes('timeout')) {
      notifyError('요청 시간이 초과되었습니다. 다시 시도해주세요.');
    } else {
      notifyError('네트워크 오류가 발생했습니다.');
    }
  } else {
    notifyError('알 수 없는 네트워크 오류가 발생했습니다.');
  }
};