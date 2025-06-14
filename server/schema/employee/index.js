const { gql } = require("apollo-server-express");

const employeeSchema = gql`
  type Employee {
    id: ID!
    userId: ID!
    user: User
    employeeId: String!
    firstName: String!
    lastName: String!
    name: String!
    email: String!
    phone: String
    position: String!
    department: String!
    hireDate: String!
    status: EmployeeStatus!
    salary: Float
    avatar: String
    emergencyContacts: [EmergencyContact]
    addresses: [Address]
    skills: [Skill]
    experiences: [Experience]
    attendanceRecords: [AttendanceRecord]
    leaveRequests: [LeaveRequest]
    performanceEvaluations: [PerformanceEvaluation]
    salaryRecords: [SalaryRecord]
    createdAt: String!
    updatedAt: String!
  }

  type AttendanceRecord {
    id: ID!
    employeeId: ID!
    employee: Employee
    date: String!
    checkIn: String
    checkOut: String
    workHours: Float
    status: AttendanceStatus!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type LeaveRequest {
    id: ID!
    employeeId: ID!
    employee: Employee
    type: LeaveType!
    startDate: String!
    endDate: String!
    days: Int!
    reason: String
    status: LeaveStatus!
    approvedBy: ID
    approver: User
    approvedAt: String
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type PerformanceEvaluation {
    id: ID!
    employeeId: ID!
    employee: Employee
    evaluatorId: ID!
    evaluator: User
    period: String!
    score: Float!
    goals: [EvaluationGoal]
    feedback: String
    status: EvaluationStatus!
    createdAt: String!
    updatedAt: String!
  }

  type EvaluationGoal {
    id: ID!
    evaluationId: ID!
    evaluation: PerformanceEvaluation
    title: String!
    description: String
    target: String!
    achievement: String
    score: Float
    weight: Float
    createdAt: String!
    updatedAt: String!
  }

  type SalaryRecord {
    id: ID!
    employeeId: ID!
    employee: Employee
    baseSalary: Float!
    allowances: Float
    deductions: Float
    bonus: Float
    totalSalary: Float!
    payPeriod: String!
    payDate: String!
    status: PaymentStatus!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type EmergencyContact {
    id: ID!
    employeeId: ID!
    employee: Employee
    name: String!
    relationship: String!
    phone: String!
    email: String
    address: String
    isPrimary: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Skill {
    id: ID!
    employeeId: ID!
    employee: Employee
    name: String!
    category: String
    level: SkillLevel!
    yearsOfExperience: Int
    certified: Boolean!
    certificationDate: String
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type Experience {
    id: ID!
    employeeId: ID!
    employee: Employee
    company: String!
    position: String!
    startDate: String!
    endDate: String
    isCurrent: Boolean!
    description: String
    achievements: String
    skills: String
    createdAt: String!
    updatedAt: String!
  }

  enum EmployeeStatus {
    ACTIVE
    INACTIVE
    TERMINATED
    ON_LEAVE
  }

  enum AttendanceStatus {
    PRESENT
    ABSENT
    LATE
    HALF_DAY
    HOLIDAY
    SICK_LEAVE
  }

  enum LeaveType {
    ANNUAL
    SICK
    PERSONAL
    MATERNITY
    PATERNITY
    BEREAVEMENT
    UNPAID
  }

  enum LeaveStatus {
    PENDING
    APPROVED
    REJECTED
    CANCELLED
  }

  enum EvaluationStatus {
    DRAFT
    IN_PROGRESS
    COMPLETED
    APPROVED
  }

  enum SkillLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    EXPERT
  }

  input CreateEmployeeInput {
    userId: ID
    employeeId: String!
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    position: String!
    department: String!
    hireDate: String!
    salary: Float
    avatar: String
  }

  input UpdateEmployeeInput {
    employeeId: String
    firstName: String
    lastName: String
    email: String
    phone: String
    position: String
    department: String
    hireDate: String
    status: EmployeeStatus
    salary: Float
    avatar: String
  }

  input CreateAttendanceInput {
    employeeId: ID!
    date: String!
    checkIn: String
    checkOut: String
    status: AttendanceStatus!
    notes: String
  }

  input CreateLeaveRequestInput {
    employeeId: ID!
    type: LeaveType!
    startDate: String!
    endDate: String!
    reason: String
  }

  input ApproveLeaveRequestInput {
    id: ID!
    status: LeaveStatus!
    notes: String
  }

  input CreatePerformanceEvaluationInput {
    employeeId: ID!
    period: String!
    score: Float!
    feedback: String
    goals: [CreateEvaluationGoalInput]
  }

  input CreateEvaluationGoalInput {
    title: String!
    description: String
    target: String!
    weight: Float
  }

  input CreateSalaryRecordInput {
    employeeId: ID!
    baseSalary: Float!
    allowances: Float
    deductions: Float
    bonus: Float
    payPeriod: String!
    payDate: String!
    notes: String
  }

  input EmployeeFilter {
    search: String
    department: String
    position: String
    status: EmployeeStatus
  }

  extend type Query {
    employees(filter: EmployeeFilter): [Employee]
    employee(id: ID!): Employee
    attendanceRecords(employeeId: ID, dateFrom: String, dateTo: String): [AttendanceRecord]
    leaveRequests(employeeId: ID, status: LeaveStatus): [LeaveRequest]
    performanceEvaluations(employeeId: ID): [PerformanceEvaluation]
    salaryRecords(employeeId: ID): [SalaryRecord]
  }

  extend type Mutation {
    createEmployee(input: CreateEmployeeInput!): MutationResponse
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): MutationResponse
    deleteEmployee(id: ID!): DeleteResult

    recordAttendance(input: CreateAttendanceInput!): MutationResponse
    updateAttendance(id: ID!, input: CreateAttendanceInput!): MutationResponse

    createLeaveRequest(input: CreateLeaveRequestInput!): MutationResponse
    approveLeaveRequest(input: ApproveLeaveRequestInput!): MutationResponse

    createPerformanceEvaluation(input: CreatePerformanceEvaluationInput!): MutationResponse
    updatePerformanceEvaluation(id: ID!, input: CreatePerformanceEvaluationInput!): MutationResponse

    createSalaryRecord(input: CreateSalaryRecordInput!): MutationResponse
    updateSalaryRecord(id: ID!, input: CreateSalaryRecordInput!): MutationResponse
  }
`;

module.exports = employeeSchema;