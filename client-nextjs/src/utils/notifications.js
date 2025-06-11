
'use client';

/**
 * 사용자에게 에러 알림을 표시하는 함수
 * @param {string} message - 표시할 메시지
 * @param {string} type - 알림 종류 (error, warn, success, info)
 */
export const showNotification = (message, type = 'error') => {
  console.log(`[Notification - ${type}]:`, message);
  
  // 실제 구현에서는 toast 라이브러리나 다른 UI 알림 시스템을 사용할 수 있습니다
  // 예: toast.error(message), toast.warn(message) 등
  
  // 임시로 alert 사용 (실제 프로젝트에서는 더 나은 UI 알림으로 교체)
  alert(message);
};

/**
 * 성공 메시지 표시
 * @param {string} message - 표시할 메시지
 */
export const showSuccess = (message) => {
  showNotification(message, 'success');
};

/**
 * 경고 메시지 표시
 * @param {string} message - 표시할 메시지
 */
export const showWarning = (message) => {
  showNotification(message, 'warn');
};

/**
 * 정보 메시지 표시
 * @param {string} message - 표시할 메시지
 */
export const showInfo = (message) => {
  showNotification(message, 'info');
};
