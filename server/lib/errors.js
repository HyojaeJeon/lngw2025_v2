const { GraphQLError } = require("graphql");

// ====================
// 에러 메시지 정의
// ====================
const errorMessages = {
  // 공통 에러
  AUTHENTICATION_REQUIRED: {
    ko: "인증이 필요합니다.",
    en: "Authentication required.",
    vi: "Yêu cầu xác thực.",
  },
  AUTHORIZATION_FAILED: {
    ko: "권한이 없습니다.",
    en: "Authorization failed.",
    vi: "Không có quyền truy cập.",
  },
  UNKNOWN_ERROR: {
    ko: "알 수 없는 오류가 발생했습니다.",
    en: "An unknown error occurred.",
    vi: "Đã xảy ra lỗi không xác định.",
  },
  NOT_FOUND: {
    ko: "요청한 데이터를 찾을 수 없습니다.",
    en: "Requested data not found.",
    vi: "Không tìm thấy dữ liệu được yêu cầu.",
  },
  VALIDATION_ERROR: {
    ko: "입력값이 올바르지 않습니다.",
    en: "Invalid input data.",
    vi: "Dữ liệu đầu vào không hợp lệ.",
  },

  // 회원가입 (Register)
  PASSWORD_MISMATCH: {
    ko: "비밀번호가 일치하지 않습니다.",
    en: "Passwords do not match.",
    vi: "Mật khẩu không khớp.",
  },
  USER_ALREADY_EXISTS: {
    ko: "이미 가입된 이메일입니다.",
    en: "This email is already registered.",
    vi: "Email này đã được đăng ký.",
  },
  REGISTRATION_FAILED: {
    ko: "회원가입에 실패했습니다.",
    en: "Registration failed.",
    vi: "Đăng ký thất bại.",
  },
  WEAK_PASSWORD: {
    ko: "비밀번호는 최소 8자 이상이어야 합니다.",
    en: "Password must be at least 8 characters long.",
    vi: "Mật khẩu phải có ít nhất 8 ký tự.",
  },
  INVALID_EMAIL: {
    ko: "올바른 이메일 주소를 입력해주세요.",
    en: "Please enter a valid email address.",
    vi: "Vui lòng nhập địa chỉ email hợp lệ.",
  },

  // 로그인 (Login)
  INVALID_CREDENTIALS: {
    ko: "이메일 또는 비밀번호가 올바르지 않습니다.",
    en: "Invalid email or password.",
    vi: "Email hoặc mật khẩu không hợp lệ.",
  },
  LOGIN_FAILED: {
    ko: "로그인에 실패했습니다.",
    en: "Login failed.",
    vi: "Đăng nhập thất bại.",
  },

  // 비밀번호 변경 (Change Password)
  INCORRECT_CURRENT_PASSWORD: {
    ko: "현재 비밀번호가 올바르지 않습니다.",
    en: "Current password is incorrect.",
    vi: "Mật khẩu hiện tại không đúng.",
  },
  PASSWORD_CHANGE_FAILED: {
    ko: "비밀번호 변경에 실패했습니다.",
    en: "Failed to change password.",
    vi: "Thay đổi mật khẩu thất bại.",
  },

  // 사용자 관련
  USER_NOT_FOUND: {
    ko: "사용자를 찾을 수 없습니다.",
    en: "User not found.",
    vi: "Không tìm thấy người dùng.",
  },
  PROFILE_UPDATE_FAILED: {
    ko: "프로필 업데이트에 실패했습니다.",
    en: "Failed to update profile.",
    vi: "Cập nhật hồ sơ thất bại.",
  },

  // 고객 관련
  CUSTOMER_NOT_FOUND: {
    ko: "고객을 찾을 수 없습니다.",
    en: "Customer not found.",
    vi: "Không tìm thấy khách hàng.",
  },
  CUSTOMER_CREATE_FAILED: {
    ko: "고객 생성에 실패했습니다.",
    en: "Failed to create customer.",
    vi: "Tạo khách hàng thất bại.",
  },
  CUSTOMER_UPDATE_FAILED: {
    ko: "고객 정보 업데이트에 실패했습니다.",
    en: "Failed to update customer information.",
    vi: "Cập nhật thông tin khách hàng thất bại.",
  },
  CUSTOMER_DELETE_FAILED: {
    ko: "고객 삭제에 실패했습니다.",
    en: "Failed to delete customer.",
    vi: "Xóa khách hàng thất bại.",
  },
  COMPANY_NAME_EXISTS: {
    ko: "이미 존재하는 회사명입니다.",
    en: "Company name already exists.",
    vi: "Tên công ty đã tồn tại.",
  },
  // 카테고리 관련
  CATEGORY_NOT_FOUND: {
    ko: "카테고리를 찾을 수 없습니다.",
    en: "Category not found.",
    vi: "Không tìm thấy danh mục.",
  },
  CATEGORIES_FETCH_FAILED: {
    ko: "카테고리 목록을 가져오는데 실패했습니다.",
    en: "Failed to fetch categories.",
    vi: "Không thể tải danh sách danh mục.",
  },
  CATEGORY_CODE_EXISTS: {
    ko: "이미 존재하는 카테고리 코드입니다.",
    en: "Category code already exists.",
    vi: "Mã danh mục đã tồn tại.",
  },
  CATEGORY_CREATE_FAILED: {
    ko: "카테고리 생성에 실패했습니다.",
    en: "Failed to create category.",
    vi: "Tạo danh mục thất bại.",
  },
  CATEGORY_UPDATE_FAILED: {
    ko: "카테고리 업데이트에 실패했습니다.",
    en: "Failed to update category.",
    vi: "Cập nhật danh mục thất bại.",
  },
  CATEGORY_DELETE_FAILED: {
    ko: "카테고리 삭제에 실패했습니다.",
    en: "Failed to delete category.",
    vi: "Xóa danh mục thất bại.",
  },

  // 컨텐츠 관련
  CONTENT_NOT_FOUND: {
    ko: "컨텐츠를 찾을 수 없습니다.",
    en: "Content not found.",
    vi: "Không tìm thấy nội dung.",
  },
  CONTENT_CREATE_FAILED: {
    ko: "컨텐츠 생성에 실패했습니다.",
    en: "Failed to create content.",
    vi: "Tạo nội dung thất bại.",
  },
  CONTENT_UPDATE_FAILED: {
    ko: "컨텐츠 업데이트에 실패했습니다.",
    en: "Failed to update content.",
    vi: "Cập nhật nội dung thất bại.",
  },
  CONTENT_DELETE_FAILED: {
    ko: "컨텐츠 삭제에 실패했습니다.",
    en: "Failed to delete content.",
    vi: "Xóa nội dung thất bại.",
  },
  CONTENT_GENERATION_FAILED: {
    ko: "AI 컨텐츠 생성에 실패했습니다.",
    en: "Failed to generate AI content.",
    vi: "Tạo nội dung AI thất bại.",
  },
  // 영업 관련
  SALES_ITEMS_FETCH_FAILED: {
    ko: "영업 항목 조회에 실패했습니다.",
    en: "Failed to fetch sales items.",
    vi: "Không thể tải danh sách bán hàng.",
  },
  SALES_ITEM_FETCH_FAILED: {
    ko: "영업 항목 조회에 실패했습니다.",
    en: "Failed to fetch sales item.",
    vi: "Không thể tải thông tin bán hàng.",
  },
  SALES_ITEM_CREATE_FAILED: {
    ko: "영업 항목 생성에 실패했습니다.",
    en: "Failed to create sales item.",
    vi: "Tạo mục bán hàng thất bại.",
  },
  SALES_ITEM_UPDATE_FAILED: {
    ko: "영업 항목 수정에 실패했습니다.",
    en: "Failed to update sales item.",
    vi: "Cập nhật mục bán hàng thất bại.",
  },
  SALES_ITEM_DELETE_FAILED: {
    ko: "영업 항목 삭제에 실패했습니다.",
    en: "Failed to delete sales item.",
    vi: "Xóa mục bán hàng thất bại.",
  },
  BULK_UPDATE_SALES_ITEMS_FAILED: {
    ko: "영업 항목 일괄 업데이트에 실패했습니다.",
    en: "Failed to bulk update sales items.",
    vi: "Cập nhật hàng loạt mục bán hàng thất bại.",
  },
  SALES_REPS_FETCH_FAILED: {
    ko: "영업사원 조회에 실패했습니다.",
    en: "Failed to fetch sales representatives.",
    vi: "Không thể tải danh sách nhân viên bán hàng.",
  },
  CUSTOMERS_FOR_SALES_FETCH_FAILED: {
    ko: "고객사 조회에 실패했습니다.",
    en: "Failed to fetch customers for sales.",
    vi: "Không thể tải danh sách khách hàng.",
  },
  PRODUCTS_FOR_SALES_FETCH_FAILED: {
    ko: "제품 조회에 실패했습니다.",
    en: "Failed to fetch products for sales.",
    vi: "Không thể tải danh sách sản phẩm.",
  },
  PRODUCT_MODELS_FOR_SALES_FETCH_FAILED: {
    ko: "제품 모델 조회에 실패했습니다.",
    en: "Failed to fetch product models for sales.",
    vi: "Không thể tải danh sách mẫu sản phẩm.",
  },
  INCENTIVE_PAYOUTS_FETCH_FAILED: {
    ko: "인센티브 지급 내역 조회에 실패했습니다.",
    en: "Failed to fetch incentive payouts.",
    vi: "Không thể tải danh sách chi trả khuyến khích.",
  },
  INCENTIVE_PAYOUT_CREATE_FAILED: {
    ko: "인센티브 지급 내역 생성에 실패했습니다.",
    en: "Failed to create incentive payout.",
    vi: "Tạo chi trả khuyến khích thất bại.",
  },
  SALES_ITEM_HISTORIES_FETCH_FAILED: {
    ko: "영업 항목 히스토리 조회에 실패했습니다.",
    en: "Failed to fetch sales item histories.",
    vi: "Không thể tải lịch sử mục bán hàng.",
  },

  // 마케팅 관련
  MARKETING_PLAN_NOT_FOUND: {
    ko: "마케팅 계획을 찾을 수 없습니다.",
    en: "Marketing plan not found.",
    vi: "Không tìm thấy kế hoạch marketing.",
  },
  MARKETING_PLAN_CREATE_FAILED: {
    ko: "마케팅 계획 생성에 실패했습니다.",
    en: "Failed to create marketing plan.",
    vi: "Tạo kế hoạch marketing thất bại.",
  },
  AB_TEST_NOT_FOUND: {
    ko: "A/B 테스트를 찾을 수 없습니다.",
    en: "A/B test not found.",
    vi: "Không tìm thấy A/B test.",
  },
  AB_TEST_CREATE_FAILED: {
    ko: "A/B 테스트 생성에 실패했습니다.",
    en: "Failed to create A/B test.",
    vi: "Tạo A/B test thất bại.",
  },

  // 파일 업로드 관련
  FILE_UPLOAD_FAILED: {
    ko: "파일 업로드에 실패했습니다.",
    en: "File upload failed.",
    vi: "Tải lên tệp thất bại.",
  },
  INVALID_FILE_TYPE: {
    ko: "지원되지 않는 파일 형식입니다.",
    en: "Unsupported file type.",
    vi: "Loại tệp không được hỗ trợ.",
  },
  FILE_TOO_LARGE: {
    ko: "파일 크기가 너무 큽니다.",
    en: "File size is too large.",
    vi: "Kích thước tệp quá lớn.",
  },

  // 데이터베이스 관련
  DATABASE_ERROR: {
    ko: "데이터베이스 오류가 발생했습니다.",
    en: "Database error occurred.",
    vi: "Đã xảy ra lỗi cơ sở dữ liệu.",
  },
  DUPLICATE_ENTRY: {
    ko: "중복된 데이터입니다.",
    en: "Duplicate entry.",
    vi: "Dữ liệu trùng lặp.",
  },
};

// ====================
// 에러 코드 상수
// ====================
const ErrorCodes = {
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  DUPLICATE_ERROR: "DUPLICATE_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  BAD_USER_INPUT: "BAD_USER_INPUT",
};

// ====================
// 에러 생성 헬퍼 함수
// ====================
const createError = (errorKey, lang = "en", extensions = {}) => {
  const message = errorMessages[errorKey];
  if (!message) {
    console.error(`Unknown error key: ${errorKey}`);
    return new GraphQLError(errorMessages.UNKNOWN_ERROR[lang] || errorMessages.UNKNOWN_ERROR.en, {
      extensions: {
        code: ErrorCodes.INTERNAL_ERROR,
        errorKey: "UNKNOWN_ERROR",
        ...extensions,
      },
    });
  }

  return new GraphQLError(message[lang] || message.en, {
    extensions: {
      code: getErrorCode(errorKey),
      errorKey,
      ...extensions,
    },
  });
};

// ====================
// 에러 키에 따른 GraphQL 에러 코드 매핑
// ====================
const getErrorCode = (errorKey) => {
  const authErrors = ["AUTHENTICATION_REQUIRED", "AUTHORIZATION_FAILED", "INVALID_CREDENTIALS", "LOGIN_FAILED", "INCORRECT_CURRENT_PASSWORD"];

  const validationErrors = ["PASSWORD_MISMATCH", "WEAK_PASSWORD", "INVALID_EMAIL", "VALIDATION_ERROR"];

  const notFoundErrors = ["NOT_FOUND", "USER_NOT_FOUND", "CUSTOMER_NOT_FOUND", "CATEGORY_NOT_FOUND", "CONTENT_NOT_FOUND", "MARKETING_PLAN_NOT_FOUND", "AB_TEST_NOT_FOUND"];

  const duplicateErrors = ["USER_ALREADY_EXISTS", "COMPANY_NAME_EXISTS", "CATEGORY_CODE_EXISTS", "DUPLICATE_ENTRY"];

  if (authErrors.includes(errorKey)) {
    return ErrorCodes.AUTHENTICATION_ERROR;
  }
  if (validationErrors.includes(errorKey)) {
    return ErrorCodes.VALIDATION_ERROR;
  }
  if (notFoundErrors.includes(errorKey)) {
    return ErrorCodes.NOT_FOUND_ERROR;
  }
  if (duplicateErrors.includes(errorKey)) {
    return ErrorCodes.DUPLICATE_ERROR;
  }

  return ErrorCodes.INTERNAL_ERROR;
};

// ====================
// 권한 확인 헬퍼
// ====================
const requireAuth = (context) => {
  // 개발 환경에서는 인증 우회 (임시)
  if (process.env.NODE_ENV === 'development' || process.env.REPLIT) {
    if (!context.user) {
      // 기본 사용자 반환
      return {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN'
      };
    }
  }

  if (!context.user) {
    throw createError('AUTHENTICATION_REQUIRED', 'Authentication required.');
  }
  return context.user;
};

const requireRole = (user, requiredRoles, lang = "en") => {
  requireAuth(user, lang);

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  if (!roles.includes(user.role)) {
    throw createError("AUTHORIZATION_FAILED", lang);
  }

  return user;
};

// ====================
// 데이터베이스 에러 핸들러
// ====================
const handleDatabaseError = (error, lang = "en", defaultErrorKey = "DATABASE_ERROR") => {
  console.error("Database Error:", error);

  // Sequelize 유니크 제약조건 에러 처리
  if (error.name === "SequelizeUniqueConstraintError") {
    throw createError("DUPLICATE_ENTRY", lang);
  }

  // Sequelize 유효성 검사 에러 처리
  if (error.name === "SequelizeValidationError") {
    throw createError("VALIDATION_ERROR", lang);
  }

  // 기본 에러 처리
  throw createError(defaultErrorKey, lang);
};

module.exports = {
  errorMessages,
  ErrorCodes,
  createError,
  requireAuth,
  requireRole,
  handleDatabaseError,
};