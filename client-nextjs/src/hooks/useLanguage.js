"use client";

import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  selectCurrentLanguage,
  selectSupportedLanguages,
  selectCurrentLanguageInfo,
  selectIsLanguageInitialized,
  setLanguage,
  forceSetLanguage,
  initializeLanguage,
  resetLanguageState,
  getLanguageName,
  getLanguageNativeName,
  getLanguageFlag,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from '../store/slices/languageSlice';

// ====================
// 언어 설정 메인 훅
// ====================
export const useLanguage = () => {
  const dispatch = useDispatch();
  
  // 셀렉터들
  const currentLanguage = useSelector(selectCurrentLanguage);
  const supportedLanguages = useSelector(selectSupportedLanguages);
  const currentLanguageInfo = useSelector(selectCurrentLanguageInfo);
  const isInitialized = useSelector(selectIsLanguageInitialized);

  // 액션 디스패처들
  const changeLanguage = useCallback((langCode) => {
    dispatch(setLanguage(langCode));
  }, [dispatch]);

  const forceChangeLanguage = useCallback((langCode) => {
    dispatch(forceSetLanguage(langCode));
  }, [dispatch]);

  const initializeLanguageSettings = useCallback(() => {
    dispatch(initializeLanguage());
  }, [dispatch]);

  const resetLanguage = useCallback(() => {
    dispatch(resetLanguageState());
  }, [dispatch]);

  // 계산된 값들
  const languageList = useMemo(() => 
    Object.keys(supportedLanguages), 
    [supportedLanguages]
  );

  const isLanguageSupported = useCallback((langCode) => {
    return Boolean(supportedLanguages[langCode]);
  }, [supportedLanguages]);

  const getNextLanguage = useCallback(() => {
    const currentIndex = languageList.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languageList.length;
    return languageList[nextIndex];
  }, [languageList, currentLanguage]);

  const getPreviousLanguage = useCallback(() => {
    const currentIndex = languageList.indexOf(currentLanguage);
    const prevIndex = currentIndex === 0 ? languageList.length - 1 : currentIndex - 1;
    return languageList[prevIndex];
  }, [languageList, currentLanguage]);

  // 언어 정보 헬퍼 함수들
  const getCurrentLanguageName = useCallback(() => {
    return getLanguageName(currentLanguage);
  }, [currentLanguage]);

  const getCurrentLanguageNativeName = useCallback(() => {
    return getLanguageNativeName(currentLanguage);
  }, [currentLanguage]);

  const getCurrentLanguageFlag = useCallback(() => {
    return getLanguageFlag(currentLanguage);
  }, [currentLanguage]);

  return {
    // 현재 상태
    currentLanguage,
    supportedLanguages,
    currentLanguageInfo,
    isInitialized,
    languageList,

    // 액션 함수들
    changeLanguage,
    forceChangeLanguage,
    initializeLanguageSettings,
    resetLanguage,

    // 유틸리티 함수들
    isLanguageSupported,
    getNextLanguage,
    getPreviousLanguage,
    getCurrentLanguageName,
    getCurrentLanguageNativeName,
    getCurrentLanguageFlag,

    // 헬퍼 함수들
    getLanguageName: useCallback((code) => getLanguageName(code), []),
    getLanguageNativeName: useCallback((code) => getLanguageNativeName(code), []),
    getLanguageFlag: useCallback((code) => getLanguageFlag(code), []),
  };
};

// ====================
// 번역 메시지 훅 (향후 i18n 확장을 위한 기반)
// ====================
export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  // 기본 메시지들 (임시)
  const messages = useMemo(() => ({
    ko: {
      common: {
        loading: '로딩 중...',
        error: '오류가 발생했습니다',
        save: '저장',
        cancel: '취소',
        delete: '삭제',
        edit: '편집',
        confirm: '확인',
        search: '검색',
        add: '추가',
        view: '보기',
        filter: '필터',
        export: '내보내기',
        import: '가져오기',
        refresh: '새로고침',
        back: '뒤로',
        next: '다음',
        previous: '이전',
        all: '전체',
        none: '없음',
        select: '선택',
        clear: '지우기',
        close: '닫기',
        open: '열기',
        submit: '제출',
        reset: '재설정',
        total: '총',
        count: '개',
        required: '필수 항목',
        optional: '선택사항',
        success: '성공',
        failed: '실패',
      },
      navigation: {
        dashboard: '대시보드',
        customers: '고객 관리',
        products: '상품 관리',
        marketing: '마케팅',
        settings: '설정',
        sales: '영업',
        revenue: '수익',
        accounting: '회계',
        employees: '직원',
        profile: '프로필',
      },
      sidebar: {
        companyName: 'CRM 시스템',
        subTitle: '고객 관계 관리',
      },
      // Main navigation items
      dashboard: '대시보드',
      profile: '프로필',
      customers: '고객',
      products: '상품',
      sales: '영업',
      revenue: '수익',
      marketing: '마케팅',
      accounting: '회계',
      employees: '직원',
      settings: '설정',
      
      // Customer submenu
      'customers.list': '고객 목록',
      'customers.add': '고객 추가',
      'customers.voc': '고객의 소리',
      'customers.history': '고객 이력',
      'customers.grades': '고객 등급',
      
      // Products submenu
      'products.list': '상품 목록',
      'products.add': '상품 추가',
      'products.categories': '카테고리',
      'products.models': '모델',
      'products.competitors': '경쟁사',
      'products.inventory': '재고',
      
      // Sales submenu
      'sales.dashboard': '영업 대시보드',
      'sales.opportunities': '영업 기회',
      'sales.pipeline': '영업 파이프라인',
      'sales.quotes': '견적',
      'sales.activities': '영업 활동',
      'sales.kpi': '영업 KPI',
      
      // Revenue submenu
      'revenue.dashboard': '수익 대시보드',
      'revenue.record': '수익 기록',
      'revenue.quotes': '견적서',
      'revenue.orders': '주문',
      'revenue.payment': '결제',
      'revenue.statistics': '통계',
      'revenue.goals': '목표',
      
      // Marketing submenu
      'marketing.dashboard': '마케팅 대시보드',
      'marketing.brandStrategy': '브랜드 전략',
      'marketing.marketAnalysis': '시장 분석',
      'marketing.planningProcess': '기획 프로세스',
      'marketing.trends': '트렌드',
      'marketing.campaignCalendar': '캠페인 캘린더',
      'marketing.budgetExpense': '예산 관리',
      'marketing.influencerManagement': '인플루언서 관리',
      'marketing.contentLibrary': '콘텐츠 라이브러리',
      'marketing.content': '콘텐츠',
      'marketing.abtest': 'A/B 테스트',
      'marketing.monitoring': '모니터링',
      'marketing.engagement': '참여도',
      'marketing.insights': '인사이트',
      'marketing.settings': '마케팅 설정',
      
      // Accounting submenu
      'accounting.dashboard': '회계 대시보드',
      'accounting.voucher': '전표',
      'accounting.ledger': '원장',
      'accounting.statements': '재무제표',
      'accounting.assets': '자산',
      'accounting.tax': '세무',
      'accounting.budget': '예산',
      'accounting.reports': '보고서',
      
      // Employees submenu
      'employees.dashboard': '직원 대시보드',
      'employees.leave': '휴가',
      'employees.salary': '급여',
      'employees.profile': '직원 프로필',
      'employees.attendance': '근태',
      'employees.evaluation': '평가',
      'employees.communication': '소통',
      
      // Settings submenu
      'settings.dashboard': '설정 대시보드',
      'settings.accessControl': '접근 제어',
      'settings.general': '일반 설정',
      'settings.profile': '프로필 설정',
      'settings.notifications': '알림 설정',
      'settings.integrations': '연동 설정',
      'settings.workflows': '워크플로우',
      'settings.dataManagement': '데이터 관리',
      'settings.auditLogs': '감사 로그',
      'settings.billing': '결제',
      
      // Products page specific
      products: {
        title: '상품 관리',
        subtitle: '회사의 상품과 서비스를 관리합니다',
        list: '상품 목록',
        addNew: '새 상품 추가',
        searchPlaceholder: '상품명, 카테고리, SKU로 검색...',
        noProducts: '등록된 상품이 없습니다',
        name: '상품명',
        category: '카테고리',
        price: '가격',
        stock: '재고',
        status: '상태',
        actions: '작업',
        active: '활성',
        inactive: '비활성',
        sku: 'SKU',
        description: '설명',
        createdAt: '등록일',
        updatedAt: '수정일',
        filterByCategory: '카테고리별 필터',
        filterByStatus: '상태별 필터',
        sortBy: '정렬',
        sortByName: '이름순',
        sortByPrice: '가격순',
        sortByStock: '재고순',
        sortByDate: '날짜순',
        ascending: '오름차순',
        descending: '내림차순',
        confirmDelete: '정말로 이 제품을 삭제하시겠습니까?',
        consumerPrice: '소비자가',
        sold: '판매',
        soldQuantity: '판매량',
        models: '모델 수',
        discontinued: '단종',
        // Categories specific
        categories: {
          title: '카테고리 관리',
          subtitle: '제품 카테고리를 등록하고 관리합니다',
          add: '카테고리 추가',
          edit: '카테고리 수정',
          code: '카테고리 코드',
          codeRequired: '카테고리 코드는 필수입니다',
          nameKo: '한국어 이름',
          nameVi: '베트남어 이름',
          nameEn: '영어 이름',
          nameKoRequired: '한국어 이름은 필수입니다',
          nameViRequired: '베트남어 이름은 필수입니다',
          nameEnOptional: '영어 이름 (선택사항)',
          descriptionKo: '한국어 설명',
          descriptionVi: '베트남어 설명',
          descriptionEn: '영어 설명',
          descriptionsOptional: '카테고리 설명 (선택사항)',
          categoryNames: '카테고리 이름',
          isActive: '활성 상태',
          searchPlaceholder: '카테고리 코드, 이름으로 검색...',
          searchFilter: '검색 및 필터',
          confirmDelete: '정말로 이 카테고리를 삭제하시겠습니까?',
          checkingCode: '코드 중복 검사 중...',
          codeCheckError: '코드 중복 검사 중 오류가 발생했습니다',
          saving: '카테고리를 저장하고 있습니다...',
          saveError: '카테고리 저장 중 오류가 발생했습니다',
          deleteError: '카테고리 삭제 중 오류가 발생했습니다',
        },
      },
    },
    en: {
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        confirm: 'Confirm',
        search: 'Search',
        add: 'Add',
        view: 'View',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        refresh: 'Refresh',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        all: 'All',
        none: 'None',
        select: 'Select',
        clear: 'Clear',
        close: 'Close',
        open: 'Open',
        submit: 'Submit',
        reset: 'Reset',
        total: 'Total',
        count: 'items',
        required: 'Required',
        optional: 'Optional',
        success: 'Success',
        failed: 'Failed',
      },
      navigation: {
        dashboard: 'Dashboard',
        customers: 'Customers',
        products: 'Products',
        marketing: 'Marketing',
        settings: 'Settings',
        sales: 'Sales',
        revenue: 'Revenue',
        accounting: 'Accounting',
        employees: 'Employees',
        profile: 'Profile',
      },
      sidebar: {
        companyName: 'CRM System',
        subTitle: 'Customer Relationship Management',
      },
      // Main navigation items
      dashboard: 'Dashboard',
      profile: 'Profile',
      customers: 'Customers',
      products: 'Products',
      sales: 'Sales',
      revenue: 'Revenue',
      marketing: 'Marketing',
      accounting: 'Accounting',
      employees: 'Employees',
      settings: 'Settings',
      
      // Customer submenu
      'customers.list': 'Customer List',
      'customers.add': 'Add Customer',
      'customers.voc': 'Voice of Customer',
      'customers.history': 'Customer History',
      'customers.grades': 'Customer Grades',
      
      // Products submenu
      'products.list': 'Product List',
      'products.add': 'Add Product',
      'products.categories': 'Categories',
      'products.models': 'Models',
      'products.competitors': 'Competitors',
      'products.inventory': 'Inventory',
      
      // Sales submenu
      'sales.dashboard': 'Sales Dashboard',
      'sales.opportunities': 'Opportunities',
      'sales.pipeline': 'Pipeline',
      'sales.quotes': 'Quotes',
      'sales.activities': 'Activities',
      'sales.kpi': 'KPI',
      
      // Revenue submenu
      'revenue.dashboard': 'Revenue Dashboard',
      'revenue.record': 'Records',
      'revenue.quotes': 'Quotes',
      'revenue.orders': 'Orders',
      'revenue.payment': 'Payment',
      'revenue.statistics': 'Statistics',
      'revenue.goals': 'Goals',
      
      // Marketing submenu
      'marketing.dashboard': 'Marketing Dashboard',
      'marketing.brandStrategy': 'Brand Strategy',
      'marketing.marketAnalysis': 'Market Analysis',
      'marketing.planningProcess': 'Planning Process',
      'marketing.trends': 'Trends',
      'marketing.campaignCalendar': 'Campaign Calendar',
      'marketing.budgetExpense': 'Budget Management',
      'marketing.influencerManagement': 'Influencer Management',
      'marketing.contentLibrary': 'Content Library',
      'marketing.content': 'Content',
      'marketing.abtest': 'A/B Test',
      'marketing.monitoring': 'Monitoring',
      'marketing.engagement': 'Engagement',
      'marketing.insights': 'Insights',
      'marketing.settings': 'Marketing Settings',
      
      // Accounting submenu
      'accounting.dashboard': 'Accounting Dashboard',
      'accounting.voucher': 'Voucher',
      'accounting.ledger': 'Ledger',
      'accounting.statements': 'Financial Statements',
      'accounting.assets': 'Assets',
      'accounting.tax': 'Tax',
      'accounting.budget': 'Budget',
      'accounting.reports': 'Reports',
      
      // Employees submenu
      'employees.dashboard': 'Employee Dashboard',
      'employees.leave': 'Leave',
      'employees.salary': 'Salary',
      'employees.profile': 'Employee Profile',
      'employees.attendance': 'Attendance',
      'employees.evaluation': 'Evaluation',
      'employees.communication': 'Communication',
      
      // Settings submenu
      'settings.dashboard': 'Settings Dashboard',
      'settings.accessControl': 'Access Control',
      'settings.general': 'General Settings',
      'settings.profile': 'Profile Settings',
      'settings.notifications': 'Notifications',
      'settings.integrations': 'Integrations',
      'settings.workflows': 'Workflows',
      'settings.dataManagement': 'Data Management',
      'settings.auditLogs': 'Audit Logs',
      'settings.billing': 'Billing',
      
      // Products page specific
      products: {
        title: 'Product Management',
        subtitle: 'Manage your company products and services',
        list: 'Product List',
        addNew: 'Add New Product',
        searchPlaceholder: 'Search by name, category, or SKU...',
        noProducts: 'No products registered',
        name: 'Product Name',
        category: 'Category',
        price: 'Price',
        stock: 'Stock',
        status: 'Status',
        actions: 'Actions',
        active: 'Active',
        inactive: 'Inactive',
        sku: 'SKU',
        description: 'Description',
        createdAt: 'Created At',
        updatedAt: 'Updated At',
        filterByCategory: 'Filter by Category',
        filterByStatus: 'Filter by Status',
        sortBy: 'Sort By',
        sortByName: 'Name',
        sortByPrice: 'Price',
        sortByStock: 'Stock',
        sortByDate: 'Date',
        ascending: 'Ascending',
        descending: 'Descending',
        confirmDelete: 'Are you sure you want to delete this product?',
        consumerPrice: 'Consumer Price',
        sold: 'Sold',
        soldQuantity: 'Sold Quantity',
        models: 'Model Count',
        discontinued: 'Discontinued',
        // Categories specific
        categories: {
          title: 'Category Management',
          subtitle: 'Register and manage product categories',
          add: 'Add Category',
          edit: 'Edit Category',
          code: 'Category Code',
          codeRequired: 'Category code is required',
          nameKo: 'Korean Name',
          nameVi: 'Vietnamese Name',
          nameEn: 'English Name',
          nameKoRequired: 'Korean name is required',
          nameViRequired: 'Vietnamese name is required',
          nameEnOptional: 'English Name (Optional)',
          descriptionKo: 'Korean Description',
          descriptionVi: 'Vietnamese Description',
          descriptionEn: 'English Description',
          descriptionsOptional: 'Category Description (Optional)',
          categoryNames: 'Category Names',
          isActive: 'Active Status',
          searchPlaceholder: 'Search by category code or name...',
          searchFilter: 'Search and Filter',
          confirmDelete: 'Are you sure you want to delete this category?',
          checkingCode: 'Checking for duplicate code...',
          codeCheckError: 'Error checking for duplicate code',
          saving: 'Saving category...',
          saveError: 'Error saving category',
          deleteError: 'Error deleting category',
        },
      },
    },
    vi: {
      common: {
        loading: 'Đang tải...',
        error: 'Đã xảy ra lỗi',
        save: 'Lưu',
        cancel: 'Hủy',
        delete: 'Xóa',
        edit: 'Chỉnh sửa',
        confirm: 'Xác nhận',
        search: 'Tìm kiếm',
        add: 'Thêm',
        view: 'Xem',
        filter: 'Lọc',
        export: 'Xuất',
        import: 'Nhập',
        refresh: 'Làm mới',
        back: 'Quay lại',
        next: 'Tiếp theo',
        previous: 'Trước',
        all: 'Tất cả',
        none: 'Không có',
        select: 'Chọn',
        clear: 'Xóa',
        close: 'Đóng',
        open: 'Mở',
        submit: 'Gửi',
        reset: 'Đặt lại',
        total: 'Tổng',
        count: 'mục',
        required: 'Bắt buộc',
        optional: 'Tùy chọn',
        success: 'Thành công',
        failed: 'Thất bại',
      },
      navigation: {
        dashboard: 'Bảng điều khiển',
        customers: 'Khách hàng',
        products: 'Sản phẩm',
        marketing: 'Marketing',
        settings: 'Cài đặt',
        sales: 'Bán hàng',
        revenue: 'Doanh thu',
        accounting: 'Kế toán',
        employees: 'Nhân viên',
        profile: 'Hồ sơ',
      },
      sidebar: {
        companyName: 'Hệ thống CRM',
        subTitle: 'Quản lý quan hệ khách hàng',
      },
      // Main navigation items
      dashboard: 'Bảng điều khiển',
      profile: 'Hồ sơ',
      customers: 'Khách hàng',
      products: 'Sản phẩm',
      sales: 'Bán hàng',
      revenue: 'Doanh thu',
      marketing: 'Marketing',
      accounting: 'Kế toán',
      employees: 'Nhân viên',
      settings: 'Cài đặt',
      
      // Customer submenu
      'customers.list': 'Danh sách khách hàng',
      'customers.add': 'Thêm khách hàng',
      'customers.voc': 'Tiếng nói khách hàng',
      'customers.history': 'Lịch sử khách hàng',
      'customers.grades': 'Cấp độ khách hàng',
      
      // Products submenu
      'products.list': 'Danh sách sản phẩm',
      'products.add': 'Thêm sản phẩm',
      'products.categories': 'Danh mục',
      'products.models': 'Mô hình',
      'products.competitors': 'Đối thủ',
      'products.inventory': 'Kho hàng',
      
      // Sales submenu
      'sales.dashboard': 'Bảng điều khiển bán hàng',
      'sales.opportunities': 'Cơ hội bán hàng',
      'sales.pipeline': 'Quy trình bán hàng',
      'sales.quotes': 'Báo giá',
      'sales.activities': 'Hoạt động bán hàng',
      'sales.kpi': 'KPI bán hàng',
      
      // Revenue submenu
      'revenue.dashboard': 'Bảng điều khiển doanh thu',
      'revenue.record': 'Bản ghi',
      'revenue.quotes': 'Báo giá',
      'revenue.orders': 'Đơn hàng',
      'revenue.payment': 'Thanh toán',
      'revenue.statistics': 'Thống kê',
      'revenue.goals': 'Mục tiêu',
      
      // Marketing submenu
      'marketing.dashboard': 'Bảng điều khiển marketing',
      'marketing.brandStrategy': 'Chiến lược thương hiệu',
      'marketing.marketAnalysis': 'Phân tích thị trường',
      'marketing.planningProcess': 'Quy trình lập kế hoạch',
      'marketing.trends': 'Xu hướng',
      'marketing.campaignCalendar': 'Lịch chiến dịch',
      'marketing.budgetExpense': 'Quản lý ngân sách',
      'marketing.influencerManagement': 'Quản lý influencer',
      'marketing.contentLibrary': 'Thư viện nội dung',
      'marketing.content': 'Nội dung',
      'marketing.abtest': 'Kiểm thử A/B',
      'marketing.monitoring': 'Giám sát',
      'marketing.engagement': 'Tương tác',
      'marketing.insights': 'Thông tin chi tiết',
      'marketing.settings': 'Cài đặt marketing',
      
      // Accounting submenu
      'accounting.dashboard': 'Bảng điều khiển kế toán',
      'accounting.voucher': 'Chứng từ',
      'accounting.ledger': 'Sổ cái',
      'accounting.statements': 'Báo cáo tài chính',
      'accounting.assets': 'Tài sản',
      'accounting.tax': 'Thuế',
      'accounting.budget': 'Ngân sách',
      'accounting.reports': 'Báo cáo',
      
      // Employees submenu
      'employees.dashboard': 'Bảng điều khiển nhân viên',
      'employees.leave': 'Nghỉ phép',
      'employees.salary': 'Lương',
      'employees.profile': 'Hồ sơ nhân viên',
      'employees.attendance': 'Chấm công',
      'employees.evaluation': 'Đánh giá',
      'employees.communication': 'Giao tiếp',
      
      // Settings submenu
      'settings.dashboard': 'Bảng điều khiển cài đặt',
      'settings.accessControl': 'Kiểm soát truy cập',
      'settings.general': 'Cài đặt chung',
      'settings.profile': 'Cài đặt hồ sơ',
      'settings.notifications': 'Thông báo',
      'settings.integrations': 'Tích hợp',
      'settings.workflows': 'Quy trình làm việc',
      'settings.dataManagement': 'Quản lý dữ liệu',
      'settings.auditLogs': 'Nhật ký kiểm toán',
      'settings.billing': 'Thanh toán',
      
      // Products page specific
      products: {
        title: 'Quản lý sản phẩm',
        subtitle: 'Quản lý sản phẩm và dịch vụ của công ty',
        list: 'Danh sách sản phẩm',
        addNew: 'Thêm sản phẩm mới',
        searchPlaceholder: 'Tìm kiếm theo tên, danh mục, hoặc SKU...',
        noProducts: 'Chưa có sản phẩm nào được đăng ký',
        name: 'Tên sản phẩm',
        category: 'Danh mục',
        price: 'Giá',
        stock: 'Tồn kho',
        status: 'Trạng thái',
        actions: 'Thao tác',
        active: 'Hoạt động',
        inactive: 'Không hoạt động',
        sku: 'SKU',
        description: 'Mô tả',
        createdAt: 'Ngày tạo',
        updatedAt: 'Ngày cập nhật',
        filterByCategory: 'Lọc theo danh mục',
        filterByStatus: 'Lọc theo trạng thái',
        sortBy: 'Sắp xếp theo',
        sortByName: 'Tên',
        sortByPrice: 'Giá',
        sortByStock: 'Tồn kho',
        sortByDate: 'Ngày',
        ascending: 'Tăng dần',
        descending: 'Giảm dần',
        confirmDelete: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
        consumerPrice: 'Giá tiêu dùng',
        sold: 'Đã bán',
        soldQuantity: 'Số lượng đã bán',
        models: 'Số lượng mô hình',
        discontinued: 'Ngừng sản xuất',
        // Categories specific
        categories: {
          title: 'Quản lý danh mục',
          subtitle: 'Đăng ký và quản lý danh mục sản phẩm',
          add: 'Thêm danh mục',
          edit: 'Chỉnh sửa danh mục',
          code: 'Mã danh mục',
          codeRequired: 'Mã danh mục là bắt buộc',
          nameKo: 'Tên tiếng Hàn',
          nameVi: 'Tên tiếng Việt',
          nameEn: 'Tên tiếng Anh',
          nameKoRequired: 'Tên tiếng Hàn là bắt buộc',
          nameViRequired: 'Tên tiếng Việt là bắt buộc',
          nameEnOptional: 'Tên tiếng Anh (Tùy chọn)',
          descriptionKo: 'Mô tả tiếng Hàn',
          descriptionVi: 'Mô tả tiếng Việt',
          descriptionEn: 'Mô tả tiếng Anh',
          descriptionsOptional: 'Mô tả danh mục (Tùy chọn)',
          categoryNames: 'Tên danh mục',
          isActive: 'Trạng thái hoạt động',
          searchPlaceholder: 'Tìm kiếm theo mã danh mục hoặc tên...',
          searchFilter: 'Tìm kiếm và lọc',
          confirmDelete: 'Bạn có chắc chắn muốn xóa danh mục này không?',
          checkingCode: 'Đang kiểm tra mã trùng lặp...',
          codeCheckError: 'Lỗi kiểm tra mã trùng lặp',
          saving: 'Đang lưu danh mục...',
          saveError: 'Lỗi lưu danh mục',
          deleteError: 'Lỗi xóa danh mục',
        },
      },
    },
  }), []);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = messages[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }, [currentLanguage, messages]);

  return { t, currentLanguage };
};

// ====================
// 언어별 날짜/시간 포맷팅 훅
// ====================
export const useLocaleFormat = () => {
  const { currentLanguage } = useLanguage();

  const formatDate = useCallback((date, options = {}) => {
    const localeMap = {
      ko: 'ko-KR',
      en: 'en-US',
      vi: 'vi-VN',
    };

    const locale = localeMap[currentLanguage] || 'ko-KR';
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    }).format(new Date(date));
  }, [currentLanguage]);

  const formatCurrency = useCallback((amount, currency = 'KRW') => {
    const localeMap = {
      ko: 'ko-KR',
      en: 'en-US',
      vi: 'vi-VN',
    };

    const locale = localeMap[currentLanguage] || 'ko-KR';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  }, [currentLanguage]);

  const formatNumber = useCallback((number, options = {}) => {
    const localeMap = {
      ko: 'ko-KR',
      en: 'en-US',
      vi: 'vi-VN',
    };

    const locale = localeMap[currentLanguage] || 'ko-KR';
    
    return new Intl.NumberFormat(locale, options).format(number);
  }, [currentLanguage]);

  return {
    formatDate,
    formatCurrency,
    formatNumber,
    currentLanguage,
  };
};

export default useLanguage; 