// Enum 값 한글 변환 유틸리티

export const SALES_TYPE_LABELS = {
  'SALE': '판매',
  'SAMPLE': '샘플',
  'DEFECTIVE': '불량',
  'EXPIRED': '유통기한만료'
};

export const PAYMENT_STATUS_LABELS = {
  'UNPAID': '미결제',
  'PARTIAL_PAID': '부분결제',
  'PAID': '결제완료'
};

export const PAYMENT_METHOD_LABELS = {
  'CASH': '현금',
  'CARD': '카드',
  'BANK_TRANSFER': '계좌이체',
  'OTHER': '기타'
};

export const getSalesTypeLabel = (value) => SALES_TYPE_LABELS[value] || value;
export const getPaymentStatusLabel = (value) => PAYMENT_STATUS_LABELS[value] || value;
export const getPaymentMethodLabel = (value) => PAYMENT_METHOD_LABELS[value] || value;

export const getSalesTypeOptions = () => [
  { value: 'SALE', label: '판매' },
  { value: 'SAMPLE', label: '샘플' },
  { value: 'DEFECTIVE', label: '불량' },
  { value: 'EXPIRED', label: '유통기한만료' }
];

export const getPaymentStatusOptions = () => [
  { value: 'UNPAID', label: '미결제' },
  { value: 'PARTIAL_PAID', label: '부분결제' },
  { value: 'PAID', label: '결제완료' }
];

export const getPaymentMethodOptions = () => [
  { value: 'CASH', label: '현금' },
  { value: 'CARD', label: '카드' },
  { value: 'BANK_TRANSFER', label: '계좌이체' },
  { value: 'OTHER', label: '기타' }
]; 