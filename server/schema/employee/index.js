
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
    supervisor: Employee
    subordinates: [Employee!]
    notes: String
    isActive: Boolean!
    attendances: [Attendance!]
    leaves: [Leave!]
    salaries: [Salary!]
    evaluations: [Evaluation!]
    createdAt: String!
    updatedAt: String!
  }

  # 출근 타입 정의
  type Attendance {
    id: ID!
    employeeId: ID!
    employee: Employee!
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
    approver: Employee
    approvedAt: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # 휴가 타입 정의
  type Leave {
    id: ID!
    employeeId: ID!
    employee: Employee!
    leaveType: LeaveType!
    startDate: String!
    endDate: String!
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
  type Salary {
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
  type Evaluation {
    id: ID!
    employeeId: ID!
    employee: Employee!
    evaluatorId: ID!
    evaluator: Employee!
    evaluationPeriod: String!
    evaluationType: EvaluationType!
    evaluationDate: String!
    goals: JSON
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

  # Enum 타입들
  enum EmploymentType {
    정규직
    계약직
    인턴
    프리랜서
    파트타임
  }

  enum EmploymentStatus {
    재직
    휴직
    퇴직
    대기
  }

  enum Gender {
    남성
    여성
    기타
  }

  enum SalaryType {
    월급
    연봉
    시급
    일급
  }

  enum AttendanceStatus {
    정상출근
    지각
    조기퇴근
    결근
    휴가
    병가
    외근
    재택근무
  }

  enum LeaveType {
    연차
    반차
    병가
    경조사
    출산휴가
    육아휴직
    무급휴가
    공가
    기타
  }

  enum LeaveStatus {
    신청
    승인
    반려
    취소
  }

  enum PaymentStatus {
    계산중
    확정
    지급완료
    보류
  }

  enum EvaluationType {
    연간평가
    반기평가
    분기평가
    수습평가
    승진평가
  }

  enum Rating {
    S
    A
    B
    C
    D
  }

  enum PromotionRecommendation {
    적극추천
    추천
    보통
    비추천
  }

  enum EvaluationStatus {
    진행중
    완료
    승인대기
    승인완료
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
    goals: JSON
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

  # 쿼리
  type Query {
    # 직원 조회
    employees(filter: EmployeeFilterInput, limit: Int, offset: Int): [Employee!]!
    employee(id: ID!): Employee
    employeeByNumber(employeeNumber: String!): Employee

    # 출근 조회
    attendances(filter: AttendanceFilterInput, limit: Int, offset: Int): [Attendance!]!
    attendance(id: ID!): Attendance
    attendancesByEmployee(employeeId: ID!, startDate: String, endDate: String): [Attendance!]!

    # 휴가 조회
    leaves(filter: LeaveFilterInput, limit: Int, offset: Int): [Leave!]!
    leave(id: ID!): Leave
    leavesByEmployee(employeeId: ID!, year: String): [Leave!]!

    # 급여 조회
    salaries(filter: SalaryFilterInput, limit: Int, offset: Int): [Salary!]!
    salary(id: ID!): Salary
    salariesByEmployee(employeeId: ID!, year: String): [Salary!]!

    # 평가 조회
    evaluations(filter: EvaluationFilterInput, limit: Int, offset: Int): [Evaluation!]!
    evaluation(id: ID!): Evaluation
    evaluationsByEmployee(employeeId: ID!, year: String): [Evaluation!]!
  }

  # 뮤테이션
  type Mutation {
    # 직원 관리
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!

    # 출근 관리
    createAttendance(input: AttendanceInput!): Attendance!
    updateAttendance(id: ID!, input: AttendanceInput!): Attendance!
    deleteAttendance(id: ID!): Boolean!
    checkIn(employeeId: ID!, location: String, ip: String): Attendance!
    checkOut(employeeId: ID!, location: String, ip: String): Attendance!
    approveAttendance(id: ID!, approvedBy: ID!): Attendance!

    # 휴가 관리
    createLeave(input: LeaveInput!): Leave!
    updateLeave(id: ID!, input: LeaveInput!): Leave!
    deleteLeave(id: ID!): Boolean!
    approveLeave(id: ID!, approvedBy: ID!): Leave!
    rejectLeave(id: ID!, rejectionReason: String!, approvedBy: ID!): Leave!

    # 급여 관리
    createSalary(input: SalaryInput!): Salary!
    updateSalary(id: ID!, input: SalaryInput!): Salary!
    deleteSalary(id: ID!): Boolean!
    processSalary(id: ID!, processedBy: ID!): Salary!

    # 평가 관리
    createEvaluation(input: EvaluationInput!): Evaluation!
    updateEvaluation(id: ID!, input: EvaluationInput!): Evaluation!
    deleteEvaluation(id: ID!): Boolean!
    approveEvaluation(id: ID!, approvedBy: ID!): Evaluation!
  }
`;

module.exports = employeeSchema;
const { gql } = require('apollo-server-express');

const employeeTypeDefs = gql`
  type Employee {
    id: ID!
    employeeId: String!
    name: String!
    email: String!
    phone: String
    department: String!
    position: String!
    status: EmployeeStatus!
    hireDate: String!
    salary: Float
    emergencyContact: JSON
    address: String
    birthDate: String
    skills: [Skill!]
    experiences: [Experience!]
    attendanceRecords: [AttendanceRecord!]
    leaveRequests: [LeaveRequest!]
    evaluations: [PerformanceEvaluation!]
    avatar: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AttendanceRecord {
    id: ID!
    employeeId: ID!
    employee: Employee!
    date: String!
    checkIn: String
    checkOut: String
    workHours: Float
    status: AttendanceStatus!
    notes: String
    createdAt: String!
  }

  type LeaveRequest {
    id: ID!
    employeeId: ID!
    employee: Employee!
    type: LeaveType!
    startDate: String!
    endDate: String!
    days: Int!
    reason: String!
    status: LeaveStatus!
    approvedBy: ID
    approver: Employee
    approvedAt: String
    notes: String
    attachments: [String!]
    createdAt: String!
  }

  type PerformanceEvaluation {
    id: ID!
    employeeId: ID!
    employee: Employee!
    evaluatorId: ID!
    evaluator: Employee!
    period: String!
    type: EvaluationType!
    overallScore: Float!
    goals: [EvaluationGoal!]
    strengths: String
    improvements: String
    comments: String
    status: EvaluationStatus!
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

  type SalaryRecord {
    id: ID!
    employeeId: ID!
    employee: Employee!
    period: String!
    baseSalary: Float!
    overtime: Float
    bonus: Float
    deductions: Float
    totalSalary: Float!
    paymentDate: String
    status: PaymentStatus!
    notes: String
    createdAt: String!
  }

  enum EmployeeStatus {
    ACTIVE
    INACTIVE
    ON_LEAVE
    TERMINATED
  }

  enum AttendanceStatus {
    PRESENT
    LATE
    ABSENT
    HALF_DAY
    SICK_LEAVE
    VACATION
  }

  enum LeaveType {
    ANNUAL
    SICK
    MATERNITY
    PATERNITY
    PERSONAL
    BEREAVEMENT
    STUDY
    OTHER
  }

  enum LeaveStatus {
    PENDING
    APPROVED
    REJECTED
    CANCELLED
  }

  enum EvaluationType {
    ANNUAL
    QUARTERLY
    MONTHLY
    PROBATION
    PROJECT
  }

  enum EvaluationStatus {
    DRAFT
    IN_PROGRESS
    COMPLETED
    APPROVED
  }

  enum PaymentStatus {
    PENDING
    PAID
    DELAYED
    CANCELLED
  }

  input EmployeeInput {
    employeeId: String!
    name: String!
    email: String!
    phone: String
    department: String!
    position: String!
    hireDate: String!
    salary: Float
    address: String
    birthDate: String
    emergencyContact: JSON
  }

  input AttendanceInput {
    employeeId: ID!
    date: String!
    checkIn: String
    checkOut: String
    status: AttendanceStatus!
    notes: String
  }

  input LeaveRequestInput {
    employeeId: ID!
    type: LeaveType!
    startDate: String!
    endDate: String!
    reason: String!
    attachments: [String!]
  }

  input EvaluationInput {
    employeeId: ID!
    evaluatorId: ID!
    period: String!
    type: EvaluationType!
    goals: [EvaluationGoalInput!]!
    strengths: String
    improvements: String
    comments: String
  }

  input EvaluationGoalInput {
    title: String!
    description: String
    targetValue: String!
    weight: Float!
  }

  input SalaryRecordInput {
    employeeId: ID!
    period: String!
    baseSalary: Float!
    overtime: Float
    bonus: Float
    deductions: Float
    notes: String
  }

  extend type Query {
    employees(
      department: String
      status: EmployeeStatus
      search: String
      first: Int
      skip: Int
    ): [Employee!]!
    
    employee(id: ID!): Employee
    
    attendanceRecords(
      employeeId: ID
      date: String
      period: String
      status: AttendanceStatus
      first: Int
      skip: Int
    ): [AttendanceRecord!]!
    
    leaveRequests(
      employeeId: ID
      status: LeaveStatus
      type: LeaveType
      period: String
      first: Int
      skip: Int
    ): [LeaveRequest!]!
    
    evaluations(
      employeeId: ID
      evaluatorId: ID
      type: EvaluationType
      status: EvaluationStatus
      period: String
      first: Int
      skip: Int
    ): [PerformanceEvaluation!]!
    
    salaryRecords(
      employeeId: ID
      period: String
      status: PaymentStatus
      first: Int
      skip: Int
    ): [SalaryRecord!]!
    
    employeeStats: EmployeeStats!
  }

  extend type Mutation {
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): DeleteResult!
    
    createAttendance(input: AttendanceInput!): AttendanceRecord!
    updateAttendance(id: ID!, input: AttendanceInput!): AttendanceRecord!
    
    createLeaveRequest(input: LeaveRequestInput!): LeaveRequest!
    approveLeaveRequest(id: ID!, notes: String): LeaveRequest!
    rejectLeaveRequest(id: ID!, notes: String!): LeaveRequest!
    
    createEvaluation(input: EvaluationInput!): PerformanceEvaluation!
    updateEvaluation(id: ID!, input: EvaluationInput!): PerformanceEvaluation!
    submitEvaluation(id: ID!): PerformanceEvaluation!
    
    createSalaryRecord(input: SalaryRecordInput!): SalaryRecord!
    updateSalaryRecord(id: ID!, input: SalaryRecordInput!): SalaryRecord!
    processSalaryPayment(id: ID!): SalaryRecord!
  }

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
`;

module.exports = employeeTypeDefs;
