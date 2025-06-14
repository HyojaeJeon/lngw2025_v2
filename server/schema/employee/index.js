const { gql } = require("apollo-server-express");

const employeeSchema = gql`
  # 직원 타입 정의
  type Employee {
    id: ID!
    employeeNumber: String!
    userId: ID
    user: User
    firstName: String!
    lastName: String!
    firstNameEn: String
    lastNameEn: String
    fullName: String
    fullNameEn: String
    email: String!
    phone: String
    mobile: String
    department: String!
    position: String!
    jobTitle: String
    employmentType: EmploymentType!
    employmentStatus: EmploymentStatus!
    hireDate: Date!
    terminationDate: Date
    birthDate: Date
    gender: Gender
    nationality: String
    address: String
    profileImage: String
    baseSalary: Float
    salaryType: SalaryType
    bankAccount: String
    bankName: String
    socialSecurityNumber: String
    healthInsuranceNumber: String
    workingHours: JSON
    supervisorId: ID
    supervisor: Employee
    subordinates: [Employee!]
    notes: String
    isActive: Boolean!
    attendances: [AttendanceRecord!]
    leaves: [LeaveRequest!]
    salaries: [SalaryRecord!]
    evaluations: [PerformanceEvaluation!]
    createdAt: String!
    updatedAt: String!
  }

  # 출근 타입 정의
  type AttendanceRecord {
    id: ID!
    employeeId: ID!
    employee: Employee!
    attendanceDate: Date!
    checkInTime: Date
    checkOutTime: Date
    breakStartTime: Date
    breakEndTime: Date
    overtimeHours: Float
    workingHours: Float
    attendanceStatus: AttendanceStatus!
    lateMinutes: Int
    earlyLeaveMinutes: Int
    checkInLocation: String
    checkOutLocation: String
    checkInIp: String
    checkOutIp: String
    notes: String
    approvedBy: ID
    approver: Employee
    approvedAt: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # 휴가 타입 정의
  type LeaveRequest {
    id: ID!
    employeeId: ID!
    employee: Employee!
    leaveType: LeaveType!
    startDate: Date!
    endDate: Date!
    totalDays: Float!
    reason: String!
    leaveStatus: LeaveStatus!
    appliedAt: Date!
    approvedBy: ID
    approver: Employee
    approvedAt: Date
    rejectionReason: String
    attachments: JSON
    emergencyContact: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # 급여 타입 정의
  type SalaryRecord {
    id: ID!
    employeeId: ID!
    employee: Employee!
    payrollMonth: Date!
    baseSalary: Float!
    allowances: JSON
    totalAllowances: Float
    overtimePay: Float
    bonuses: JSON
    totalBonuses: Float
    grossSalary: Float!
    deductions: JSON
    totalDeductions: Float
    netSalary: Float!
    workingDays: Int
    attendanceDays: Int
    absenceDays: Int
    overtimeHours: Float
    paymentDate: Date
    paymentStatus: PaymentStatus!
    bankAccount: String
    bankName: String
    notes: String
    processedBy: ID
    processor: Employee
    processedAt: Date
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # 평가 타입 정의
  type PerformanceEvaluation {
    id: ID!
    employeeId: ID!
    employee: Employee!
    evaluatorId: ID!
    evaluator: Employee!
    evaluationPeriod: Date!
    evaluationType: EvaluationType!
    evaluationDate: Date!
    goals: [EvaluationGoal!]
    achievements: JSON
    competencies: JSON
    overallRating: Rating!
    overallScore: Float
    strengths: String
    areasForImprovement: String
    developmentPlan: String
    evaluatorComments: String
    employeeComments: String
    promotionRecommendation: PromotionRecommendation
    salaryAdjustmentRecommendation: Float
    evaluationStatus: EvaluationStatus!
    approvedBy: ID
    approver: Employee
    approvedAt: Date
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type EvaluationGoal {
    id: ID!
    evaluationId: ID!
    title: String!
    description: String
    targetValue: String
    actualValue: String
    weight: Float!
    score: Float
    isAchieved: Boolean!
  }

  # Enum 타입들
  enum EmploymentType {
    FULL_TIME
    CONTRACT
    INTERN
    FREELANCER
    PART_TIME
  }

  enum EmploymentStatus {
    ACTIVE
    ON_LEAVE
    TERMINATED
    PENDING
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  enum SalaryType {
    MONTHLY
    YEARLY
    HOURLY
    DAILY
  }

  enum AttendanceStatus {
    PRESENT
    LATE
    EARLY_LEAVE
    ABSENT
    VACATION
    SICK_LEAVE
    BUSINESS_TRIP
    WORK_FROM_HOME
  }

  enum LeaveType {
    ANNUAL
    HALF_DAY
    SICK
    BEREAVEMENT
    MATERNITY
    PATERNITY
    UNPAID
    PUBLIC_HOLIDAY
    OTHER
  }

  enum LeaveStatus {
    PENDING
    APPROVED
    REJECTED
    CANCELLED
  }

  enum PaymentStatus {
    CALCULATING
    CONFIRMED
    PAID
    ON_HOLD
  }

  enum EvaluationType {
    ANNUAL
    SEMI_ANNUAL
    QUARTERLY
    PROBATION
    PROMOTION
  }

  enum Rating {
    S
    A
    B
    C
    D
  }

  enum PromotionRecommendation {
    HIGHLY_RECOMMEND
    RECOMMEND
    NEUTRAL
    NOT_RECOMMEND
  }

  enum EvaluationStatus {
    IN_PROGRESS
    COMPLETED
    PENDING_APPROVAL
    APPROVED
  }

  # 입력 타입들
  input EmployeeInput {
    employeeNumber: String!
    userId: ID
    firstName: String!
    lastName: String!
    firstNameEn: String
    lastNameEn: String
    email: String!
    phone: String
    mobile: String
    department: String!
    position: String!
    jobTitle: String
    employmentType: EmploymentType!
    employmentStatus: EmploymentStatus!
    hireDate: String!
    terminationDate: String
    birthDate: String
    gender: Gender
    nationality: String
    address: String
    profileImage: String
    baseSalary: Float
    salaryType: SalaryType
    bankAccount: String
    bankName: String
    socialSecurityNumber: String
    healthInsuranceNumber: String
    workingHours: JSON
    supervisorId: ID
    notes: String
    isActive: Boolean
  }

  input AttendanceInput {
    employeeId: ID!
    attendanceDate: String!
    checkInTime: String
    checkOutTime: String
    breakStartTime: String
    breakEndTime: String
    overtimeHours: Float
    workingHours: Float
    attendanceStatus: AttendanceStatus!
    lateMinutes: Int
    earlyLeaveMinutes: Int
    checkInLocation: String
    checkOutLocation: String
    checkInIp: String
    checkOutIp: String
    notes: String
    approvedBy: ID
  }

  input LeaveInput {
    employeeId: ID!
    leaveType: LeaveType!
    startDate: String!
    endDate: String!
    totalDays: Float!
    reason: String!
    emergencyContact: String
    attachments: JSON
  }

  input SalaryInput {
    employeeId: ID!
    payrollMonth: String!
    baseSalary: Float!
    allowances: JSON
    totalAllowances: Float
    overtimePay: Float
    bonuses: JSON
    totalBonuses: Float
    grossSalary: Float!
    deductions: JSON
    totalDeductions: Float
    netSalary: Float!
    workingDays: Int
    attendanceDays: Int
    absenceDays: Int
    overtimeHours: Float
    paymentDate: String
    paymentStatus: PaymentStatus!
    bankAccount: String
    bankName: String
    notes: String
  }

  input EvaluationInput {
    employeeId: ID!
    evaluatorId: ID!
    evaluationPeriod: String!
    evaluationType: EvaluationType!
    evaluationDate: String!
    goals: [EvaluationGoalInput!]
    achievements: JSON
    competencies: JSON
    overallRating: Rating!
    overallScore: Float
    strengths: String
    areasForImprovement: String
    developmentPlan: String
    evaluatorComments: String
    employeeComments: String
    promotionRecommendation: PromotionRecommendation
    salaryAdjustmentRecommendation: Float
    evaluationStatus: EvaluationStatus
  }

  input EvaluationGoalInput {
    title: String!
    description: String
    targetValue: String!
    weight: Float!
  }

  # 필터 입력 타입들
  input EmployeeFilterInput {
    department: String
    position: String
    employmentType: EmploymentType
    employmentStatus: EmploymentStatus
    isActive: Boolean
    search: String
  }

  input AttendanceFilterInput {
    employeeId: ID
    attendanceDate: String
    attendanceStatus: AttendanceStatus
    startDate: String
    endDate: String
  }

  input LeaveFilterInput {
    employeeId: ID
    leaveType: LeaveType
    leaveStatus: LeaveStatus
    startDate: String
    endDate: String
  }

  input SalaryFilterInput {
    employeeId: ID
    payrollMonth: String
    paymentStatus: PaymentStatus
    startMonth: String
    endMonth: String
  }

  input EvaluationFilterInput {
    employeeId: ID
    evaluatorId: ID
    evaluationPeriod: String
    evaluationType: EvaluationType
    overallRating: Rating
    evaluationStatus: EvaluationStatus
  }

  # 통계 타입
  type EmployeeStats {
    totalEmployees: Int!
    activeEmployees: Int!
    onLeaveEmployees: Int!
    newHiresThisMonth: Int!
    pendingLeaveRequests: Int!
    todayAttendance: Int!
    averageWorkHours: Float!
    departmentStats: [DepartmentStats!]!
  }

  type DepartmentStats {
    department: String!
    employeeCount: Int!
    averageSalary: Float!
    attendanceRate: Float!
  }

  # 쿼리
  extend type Query {
    # 직원 조회
    employees(filter: EmployeeFilterInput, limit: Int, offset: Int): [Employee!]!
    employee(id: ID!): Employee
    employeeByNumber(employeeNumber: String!): Employee

    # 출근 조회
    attendanceRecords(filter: AttendanceFilterInput, limit: Int, offset: Int): [AttendanceRecord!]!
    attendanceRecord(id: ID!): AttendanceRecord
    attendancesByEmployee(employeeId: ID!, startDate: String, endDate: String): [AttendanceRecord!]!

    # 휴가 조회
    leaveRequests(filter: LeaveFilterInput, limit: Int, offset: Int): [LeaveRequest!]!
    leaveRequest(id: ID!): LeaveRequest
    leavesByEmployee(employeeId: ID!, year: String): [LeaveRequest!]!

    # 급여 조회
    salaryRecords(filter: SalaryFilterInput, limit: Int, offset: Int): [SalaryRecord!]!
    salaryRecord(id: ID!): SalaryRecord
    salariesByEmployee(employeeId: ID!, year: String): [SalaryRecord!]!

    # 평가 조회
    evaluations(filter: EvaluationFilterInput, limit: Int, offset: Int): [PerformanceEvaluation!]!
    evaluation(id: ID!): PerformanceEvaluation
    evaluationsByEmployee(employeeId: ID!, year: String): [PerformanceEvaluation!]!

    # 통계
    employeeStats: EmployeeStats!
  }

  # 뮤테이션
  extend type Mutation {
    # 직원 관리
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): DeleteResult!

    # 출근 관리
    createAttendance(input: AttendanceInput!): AttendanceRecord!
    updateAttendance(id: ID!, input: AttendanceInput!): AttendanceRecord!
    deleteAttendance(id: ID!): DeleteResult!
    checkIn(employeeId: ID!, location: String, ip: String): AttendanceRecord!
    checkOut(employeeId: ID!, location: String, ip: String): AttendanceRecord!
    approveAttendance(id: ID!, approvedBy: ID!): AttendanceRecord!

    # 휴가 관리
    createLeaveRequest(input: LeaveInput!): LeaveRequest!
    updateLeaveRequest(id: ID!, input: LeaveInput!): LeaveRequest!
    deleteLeaveRequest(id: ID!): DeleteResult!
    approveLeaveRequest(id: ID!, approvedBy: ID!): LeaveRequest!
    rejectLeaveRequest(id: ID!, rejectionReason: String!, approvedBy: ID!): LeaveRequest!

    # 급여 관리
    createSalaryRecord(input: SalaryInput!): SalaryRecord!
    updateSalaryRecord(id: ID!, input: SalaryInput!): SalaryRecord!
    deleteSalaryRecord(id: ID!): DeleteResult!
    processSalary(id: ID!, processedBy: ID!): SalaryRecord!

    # 평가 관리
    createEvaluation(input: EvaluationInput!): PerformanceEvaluation!
    updateEvaluation(id: ID!, input: EvaluationInput!): PerformanceEvaluation!
    deleteEvaluation(id: ID!): DeleteResult!
    submitEvaluation(id: ID!): PerformanceEvaluation!
    approveEvaluation(id: ID!, approvedBy: ID!): PerformanceEvaluation!
  }
`;

module.exports = employeeSchema;
```

```
const { gql } = require("apollo-server-express");

const employeeSchema = gql`
  # 직원 타입 정의
  type Employee {
    id: ID!
    employeeNumber: String!
    userId: ID
    user: User
    firstName: String!
    lastName: String!
    firstNameEn: String
    lastNameEn: String
    fullName: String
    fullNameEn: String
    email: String!
    phone: String
    mobile: String
    department: String!
    position: String!
    jobTitle: String
    employmentType: EmploymentType!
    employmentStatus: EmploymentStatus!
    hireDate: Date!
    terminationDate: Date
    birthDate: Date
    gender: Gender
    nationality: String
    address: String
    profileImage: String
    baseSalary: Float
    salaryType: SalaryType
    bankAccount: String
    bankName: String
    socialSecurityNumber: String
    healthInsuranceNumber: String
    workingHours: JSON
    supervisorId: ID
    supervisor: Employee
    subordinates: [Employee!]
    notes: String
    isActive: Boolean!
    attendances: [AttendanceRecord!]
    leaves: [LeaveRequest!]
    salaries: [SalaryRecord!]
    evaluations: [PerformanceEvaluation!]
    createdAt: String!
    updatedAt: String!
  }

  # 출근 타입 정의
  type AttendanceRecord {
    id: ID!
    employeeId: ID!
    employee: Employee!
    attendanceDate: Date!
    checkInTime: Date
    checkOutTime: Date
    breakStartTime: Date
    breakEndTime: Date
    overtimeHours: Float
    workingHours: Float
    attendanceStatus: AttendanceStatus!
    lateMinutes: Int
    earlyLeaveMinutes: Int
    checkInLocation: String
    checkOutLocation: String
    checkInIp: String
    checkOutIp: String
    notes: String
    approvedBy: ID
    approver: Employee
    approvedAt: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # 휴가 타입 정의
  type LeaveRequest {
    id: ID!
    employeeId: ID!
    employee: Employee!
    leaveType: LeaveType!
    startDate: Date!
    endDate: Date!
    totalDays: Float!
    reason: String!
    leaveStatus: LeaveStatus!
    appliedAt: String!
    approvedBy: ID
    approver: Employee
    approvedAt: String
    rejectionReason: String
    attachments: JSON
    emergencyContact: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # 급여 타입 정의
  type SalaryRecord {
    id: ID!
    employeeId: ID!
    employee: Employee!
    payrollMonth: String!
    baseSalary: Float!
    allowances: JSON
    totalAllowances: Float
    overtimePay: Float
    bonuses: JSON
    totalBonuses: Float
    grossSalary: Float!
    deductions: JSON
    totalDeductions: Float
    netSalary: Float!
    workingDays: Int
    attendanceDays: Int
    absenceDays: Int
    overtimeHours: Float
    paymentDate: String
    paymentStatus: PaymentStatus!
    bankAccount: String
    bankName: String
    notes: String
    processedBy: ID
    processor: Employee
    processedAt: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # 평가 타입 정의
  type PerformanceEvaluation {
    id: ID!
    employeeId: ID!
    employee: Employee!
    evaluatorId: ID!
    evaluator: Employee!
    evaluationPeriod: String!
    evaluationType: EvaluationType!
    evaluationDate: String!
    goals: [EvaluationGoal!]
    achievements: JSON
    competencies: JSON
    overallRating: Rating!
    overallScore: Float
    strengths: String
    areasForImprovement: String
    developmentPlan: String
    evaluatorComments: String
    employeeComments: String
    promotionRecommendation: PromotionRecommendation
    salaryAdjustmentRecommendation: Float
    evaluationStatus: EvaluationStatus!
    approvedBy: ID
    approver: Employee
    approvedAt: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type EvaluationGoal {
    id: ID!
    evaluationId: ID!
    title: String!
    description: String
    targetValue: String
    actualValue: String
    weight: Float!
    score: Float
    isAchieved: Boolean!
  }

  # Enum 타입들
  enum EmploymentType {
    FULL_TIME
    CONTRACT
    INTERN
    FREELANCER
    PART_TIME
  }

  enum EmploymentStatus {
    ACTIVE
    ON_LEAVE
    TERMINATED
    PENDING
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  enum SalaryType {
    MONTHLY
    YEARLY
    HOURLY
    DAILY
  }

  enum AttendanceStatus {
    PRESENT
    LATE
    EARLY_LEAVE
    ABSENT
    VACATION
    SICK_LEAVE
    BUSINESS_TRIP
    WORK_FROM_HOME
  }

  enum LeaveType {
    ANNUAL
    HALF_DAY
    SICK
    BEREAVEMENT
    MATERNITY
    PATERNITY
    UNPAID
    PUBLIC_HOLIDAY
    OTHER
  }

  enum LeaveStatus {
    PENDING
    APPROVED
    REJECTED
    CANCELLED
  }

  enum PaymentStatus {
    CALCULATING
    CONFIRMED
    PAID
    ON_HOLD
  }

  enum EvaluationType {
    ANNUAL
    SEMI_ANNUAL
    QUARTERLY
    PROBATION
    PROMOTION
  }

  enum Rating {
    S
    A
    B
    C
    D
  }

  enum PromotionRecommendation {
    HIGHLY_RECOMMEND
    RECOMMEND
    NEUTRAL
    NOT_RECOMMEND
  }

  enum EvaluationStatus {
    IN_PROGRESS
    COMPLETED
    PENDING_APPROVAL
    APPROVED
  }

  # 입력 타입들
  input EmployeeInput {
    employeeNumber: String!
    userId: ID
    firstName: String!
    lastName: String!
    firstNameEn: String
    lastNameEn: String
    email: String!
    phone: String
    mobile: String
    department: String!
    position: String!
    jobTitle: String
    employmentType: EmploymentType!
    employmentStatus: EmploymentStatus!
    hireDate: String!
    terminationDate: String
    birthDate: String
    gender: Gender
    nationality: String
    address: String
    profileImage: String
    baseSalary: Float
    salaryType: SalaryType
    bankAccount: String
    bankName: String
    socialSecurityNumber: String
    healthInsuranceNumber: String
    workingHours: JSON
    supervisorId: ID
    notes: String
    isActive: Boolean
  }

  input AttendanceInput {
    employeeId: ID!
    attendanceDate: String!
    checkInTime: String
    checkOutTime: String
    breakStartTime: String
    breakEndTime: String
    overtimeHours: Float
    workingHours: Float
    attendanceStatus: AttendanceStatus!
    lateMinutes: Int
    earlyLeaveMinutes: Int
    checkInLocation: String
    checkOutLocation: String
    checkInIp: String
    checkOutIp: String
    notes: String
    approvedBy: ID
  }

  input LeaveInput {
    employeeId: ID!
    leaveType: LeaveType!
    startDate: String!
    endDate: String!
    totalDays: Float!
    reason: String!
    emergencyContact: String
    attachments: JSON
  }

  input SalaryInput {
    employeeId: ID!
    payrollMonth: String!
    baseSalary: Float!
    allowances: JSON
    totalAllowances: Float
    overtimePay: Float
    bonuses: JSON
    totalBonuses: Float
    grossSalary: Float!
    deductions: JSON
    totalDeductions: Float
    netSalary: Float!
    workingDays: Int
    attendanceDays: Int
    absenceDays: Int
    overtimeHours: Float
    paymentDate: String
    paymentStatus: PaymentStatus!
    bankAccount: String
    bankName: String
    notes: String
  }

  input EvaluationInput {
    employeeId: ID!
    evaluatorId: ID!
    evaluationPeriod: String!
    evaluationType: EvaluationType!
    evaluationDate: String!
    goals: [EvaluationGoalInput!]
    achievements: JSON
    competencies: JSON
    overallRating: Rating!
    overallScore: Float
    strengths: String
    areasForImprovement: String
    developmentPlan: String
    evaluatorComments: String
    employeeComments: String
    promotionRecommendation: PromotionRecommendation
    salaryAdjustmentRecommendation: Float
    evaluationStatus: EvaluationStatus
  }

  input EvaluationGoalInput {
    title: String!
    description: String
    targetValue: String!
    weight: Float!
  }

  # 필터 입력 타입들
  input EmployeeFilterInput {
    department: String
    position: String
    employmentType: EmploymentType
    employmentStatus: EmploymentStatus
    isActive: Boolean
    search: String
  }

  input AttendanceFilterInput {
    employeeId: ID
    attendanceDate: String
    attendanceStatus: AttendanceStatus
    startDate: String
    endDate: String
  }

  input LeaveFilterInput {
    employeeId: ID
    leaveType: LeaveType
    leaveStatus: LeaveStatus
    startDate: String
    endDate: String
  }

  input SalaryFilterInput {
    employeeId: ID
    payrollMonth: String
    paymentStatus: PaymentStatus
    startMonth: String
    endMonth: String
  }

  input EvaluationFilterInput {
    employeeId: ID
    evaluatorId: ID
    evaluationPeriod: String
    evaluationType: EvaluationType
    overallRating: Rating
    evaluationStatus: EvaluationStatus
  }

  # 통계 타입
  type EmployeeStats {
    totalEmployees: Int!
    activeEmployees: Int!
    onLeaveEmployees: Int!
    newHiresThisMonth: Int!
    pendingLeaveRequests: Int!
    todayAttendance: Int!
    averageWorkHours: Float!
    departmentStats: [DepartmentStats!]!
  }

  type DepartmentStats {
    department: String!
    employeeCount: Int!
    averageSalary: Float!
    attendanceRate: Float!
  }

  # 쿼리
  extend type Query {
    # 직원 조회
    employees(filter: EmployeeFilterInput, limit: Int, offset: Int): [Employee!]!
    employee(id: ID!): Employee
    employeeByNumber(employeeNumber: String!): Employee

    # 출근 조회
    attendanceRecords(filter: AttendanceFilterInput, limit: Int, offset: Int): [AttendanceRecord!]!
    attendanceRecord(id: ID!): AttendanceRecord
    attendancesByEmployee(employeeId: ID!, startDate: String, endDate: String): [AttendanceRecord!]!

    # 휴가 조회
    leaveRequests(filter: LeaveFilterInput, limit: Int, offset: Int): [LeaveRequest!]!
    leaveRequest(id: ID!): LeaveRequest
    leavesByEmployee(employeeId: ID!, year: String): [LeaveRequest!]!

    # 급여 조회
    salaryRecords(filter: SalaryFilterInput, limit: Int, offset: Int): [SalaryRecord!]!
    salaryRecord(id: ID!): SalaryRecord
    salariesByEmployee(employeeId: ID!, year: String): [SalaryRecord!]!

    # 평가 조회
    evaluations(filter: EvaluationFilterInput, limit: Int, offset: Int): [PerformanceEvaluation!]!
    evaluation(id: ID!): PerformanceEvaluation
    evaluationsByEmployee(employeeId: ID!, year: String): [PerformanceEvaluation!]!

    # 통계
    employeeStats: EmployeeStats!
  }

  # 뮤테이션
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): DeleteResult!

    # 출근 관리
    createAttendance(input: AttendanceInput!): AttendanceRecord!
    updateAttendance(id: ID!, input: AttendanceInput!): AttendanceRecord!
    deleteAttendance(id: ID!): DeleteResult!
    checkIn(employeeId: ID!, location: String, ip: String): AttendanceRecord!
    checkOut(employeeId: ID!, location: String, ip: String): AttendanceRecord!
    approveAttendance(id: ID!, approvedBy: ID!): AttendanceRecord!

    # 휴가 관리
    createLeaveRequest(input: LeaveInput!): LeaveRequest!
    updateLeaveRequest(id: ID!, input: LeaveInput!): LeaveRequest!
    deleteLeaveRequest(id: ID!): DeleteResult!
    approveLeaveRequest(id: ID!, approvedBy: ID!): LeaveRequest!
    rejectLeaveRequest(id: ID!, rejectionReason: String!, approvedBy: ID!): LeaveRequest!

    # 급여 관리
    createSalaryRecord(input: SalaryInput!): SalaryRecord!
    updateSalaryRecord(id: ID!, input: SalaryInput!): SalaryRecord!
    deleteSalaryRecord(id: ID!): DeleteResult!
    processSalary(id: ID!, processedBy: ID!): SalaryRecord!

    # 평가 관리
    createEvaluation(input: EvaluationInput!): PerformanceEvaluation!
    updateEvaluation(id: ID!, input: EvaluationInput!): PerformanceEvaluation!
    deleteEvaluation(id: ID!): DeleteResult!
    submitEvaluation(id: ID!): PerformanceEvaluation!
    approveEvaluation(id: ID!, approvedBy: ID!): PerformanceEvaluation!
  }
`;

module.exports = employeeSchema;
```