const { gql } = require('apollo-server-express');

const employeeSchema = gql`
  type Employee {
    id: ID!
    employeeNumber: String!
    name: String!
    email: String!
    user: User
    department: String!
    position: String!
    hireDate: String!
    status: EmployeeStatus!
    phone: String
    address: String
    emergencyContact: String
    emergencyPhone: String
    salary: Float
    benefits: String
    skills: [Skill]
    experiences: [Experience]
    emergencyContacts: [EmergencyContact]
    avatar: String
    createdAt: String!
    updatedAt: String!
    attendanceRecords: [AttendanceRecord]
    leaveRequests: [LeaveRequest]
    performanceEvaluations: [PerformanceEvaluation]
    salaryRecords: [SalaryRecord]
  }

  type AttendanceRecord {
    id: ID!
    employeeId: ID!
    date: String!
    checkIn: String
    checkOut: String
    status: AttendanceStatus!
    notes: String
    employee: Employee
    createdAt: String!
    updatedAt: String!
  }

  type LeaveRequest {
    id: ID!
    employeeId: ID!
    leaveType: LeaveType!
    startDate: String!
    endDate: String!
    reason: String!
    status: LeaveRequestStatus!
    approvedBy: ID
    approvedAt: String
    employee: Employee
    approver: Employee
    createdAt: String!
    updatedAt: String!
  }

  type PerformanceEvaluation {
    id: ID!
    employeeId: ID!
    evaluatorId: ID!
    period: String!
    overallRating: Float!
    goals: [EvaluationGoal]
    feedback: String
    status: EvaluationStatus!
    employee: Employee
    evaluator: Employee
    createdAt: String!
    updatedAt: String!
  }

  type EvaluationGoal {
    id: ID!
    evaluationId: ID!
    title: String!
    description: String!
    targetValue: Float
    actualValue: Float
    weight: Float!
    rating: Float
    evaluation: PerformanceEvaluation
    createdAt: String!
    updatedAt: String!
  }

  type SalaryRecord {
    id: ID!
    employeeId: ID!
    baseSalary: Float!
    bonuses: Float
    deductions: Float
    netSalary: Float!
    payPeriod: String!
    paidAt: String!
    employee: Employee
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
    EARLY_DEPARTURE
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
    OTHER
  }

  enum LeaveRequestStatus {
    PENDING
    APPROVED
    REJECTED
    CANCELLED
  }

  enum EvaluationStatus {
    DRAFT
    IN_PROGRESS
    COMPLETED
    REVIEWED
  }

  input EmployeeInput {
    employeeNumber: String!
    name: String!
    email: String!
    department: String!
    position: String!
    hireDate: String!
    phone: String
    address: String
    emergencyContact: String
    emergencyPhone: String
    salary: Float
    benefits: String
    skills: [String]
    avatar: String
  }

  input EmployeeUpdateInput {
    name: String
    email: String
    department: String
    position: String
    phone: String
    address: String
    emergencyContact: String
    emergencyPhone: String
    salary: Float
    benefits: String
    skills: [String]
    avatar: String
    status: EmployeeStatus
  }

  input EmployeeFilterInput {
    search: String
    department: String
    position: String
    status: EmployeeStatus
  }

  input AttendanceRecordInput {
    employeeId: ID!
    date: String!
    checkIn: String
    checkOut: String
    status: AttendanceStatus!
    notes: String
  }

  input LeaveRequestInput {
    employeeId: ID!
    leaveType: LeaveType!
    startDate: String!
    endDate: String!
    reason: String!
  }

  input PerformanceEvaluationInput {
    employeeId: ID!
    evaluatorId: ID!
    period: String!
    overallRating: Float!
    feedback: String
    goals: [EvaluationGoalInput]
  }

  input EvaluationGoalInput {
    title: String!
    description: String!
    targetValue: Float
    actualValue: Float
    weight: Float!
    rating: Float
  }

  input SalaryRecordInput {
    employeeId: ID!
    baseSalary: Float!
    bonuses: Float
    deductions: Float
    payPeriod: String!
    paidAt: String!
  }

  extend type Query {
    employeeList(filter: EmployeeFilterInput, limit: Int, offset: Int): [Employee]
    employee(id: ID!): Employee
    attendanceRecords(employeeId: ID, date: String): [AttendanceRecord]
    leaveRequests(employeeId: ID, status: LeaveRequestStatus): [LeaveRequest]
    performanceEvaluations(employeeId: ID, evaluatorId: ID): [PerformanceEvaluation]
    salaryRecords(employeeId: ID, payPeriod: String): [SalaryRecord]
  }

  extend type Mutation {
    createEmployee(input: EmployeeInput!): Employee
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee
    deleteEmployee(id: ID!): DeleteResult

    createAttendanceRecord(input: AttendanceRecordInput!): AttendanceRecord
    updateAttendanceRecord(id: ID!, input: AttendanceRecordInput!): AttendanceRecord
    deleteAttendanceRecord(id: ID!): DeleteResult

    createLeaveRequest(input: LeaveRequestInput!): LeaveRequest
    approveLeaveRequest(id: ID!): LeaveRequest
    rejectLeaveRequest(id: ID!): LeaveRequest

    createPerformanceEvaluation(input: PerformanceEvaluationInput!): PerformanceEvaluation
    updatePerformanceEvaluation(id: ID!, input: PerformanceEvaluationInput!): PerformanceEvaluation
    deletePerformanceEvaluation(id: ID!): DeleteResult

    createSalaryRecord(input: SalaryRecordInput!): SalaryRecord
    updateSalaryRecord(id: ID!, input: SalaryRecordInput!): SalaryRecord
    deleteSalaryRecord(id: ID!): DeleteResult
  }
`;

module.exports = employeeSchema;