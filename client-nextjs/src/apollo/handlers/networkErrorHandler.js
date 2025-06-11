
'use client';

import { showNotification } from '../../utils/notifications';

/**
 * 네트워크 에러를 중앙에서 처리하는 함수
 * @param {Error} networkError - Apollo Link에서 전달된 네트워크 에러 객체
 */
export const handleNetworkError = (networkError) => {
  console.error(`[Network error]:`, networkError);

  // AbortError 처리 - 무시하고 계속 진행
  if (networkError.name === "AbortError") {
    console.log("Request was aborted, ignoring...");
    return;
  }

  // CORS 오류 처리
  if (networkError.message && networkError.message.includes("CORS")) {
    console.error("CORS error detected");
    showNotification('서버 연결 설정에 문제가 있습니다. 관리자에게 문의해주세요.');
    return;
  }

  // 인증 오류 (401)
  if (networkError.statusCode === 401) {
    showNotification('인증이 만료되었습니다. 다시 로그인해주세요.');
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    return;
  }

  // 서버 오류 (500번대)
  if (networkError.statusCode >= 500) {
    showNotification('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    return;
  }

  // 클라이언트 오류 (400번대)
  if (networkError.statusCode >= 400 && networkError.statusCode < 500) {
    showNotification('잘못된 요청입니다. 입력값을 확인해주세요.');
    return;
  }

  // 일반적인 네트워크 연결 오류
  showNotification('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
};
