
import { gql } from "@apollo/client";

// 직원 쿼리
export const GET_EMPLOYEES = gql`
  query GetEmployees($filter: EmployeeFilterInput, $limit: Int, $offset: Int) {
    employees(filter: $filter, limit: $limit, offset: $offset) {
      id
      employeeNumber
      firstName
      lastName
      fullName
      email
      phone
      mobile
      department
      position
      jobTitle
      employmentType
      employmentStatus
      hireDate
      terminationDate
      birthDate
      gender
      nationality
      address
      profileImage
      baseSalary
      salaryType
      bankAccount
      bankName
      workingHours
      supervisorId
      supervisor {
        id
        fullName
        position
      }
      notes
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      employeeNumber
      userId
      user {
        id
        email
        name
      }
      firstName
      lastName
      fullName
      firstNameEn
      lastNameEn
      fullNameEn
      email
      phone
      mobile
      department
      position
      jobTitle
      employmentType
      employmentStatus
      hireDate
      terminationDate
      birthDate
      gender
      nationality
      address
      profileImage
      baseSalary
      salaryType
      bankAccount
      bankName
      socialSecurityNumber
      healthInsuranceNumber
      workingHours
      supervisorId
      supervisor {
        id
        fullName
        position
        department
      }
      subordinates {
        id
        fullName
        position
        department
      }
      notes
      isActive
      createdAt
      updatedAt
    }
  }
`;

// 출근 쿼리
export const GET_ATTENDANCES = gql`
  query GetAttendances($filter: AttendanceFilterInput, $limit: Int, $offset: Int) {
    attendances(filter: $filter, limit: $limit, offset: $offset) {
      id
      employeeId
      employee {
        id
        fullName
        department
        position
      }
      attendanceDate
      checkInTime
      checkOutTime
      breakStartTime
      breakEndTime
      overtimeHours
      workingHours
      attendanceStatus
      lateMinutes
      earlyLeaveMinutes
      checkInLocation
      checkOutLocation
      notes
      approvedBy
      approver {
        id
        fullName
      }
      approvedAt
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ATTENDANCES_BY_EMPLOYEE = gql`
  query GetAttendancesByEmployee($employeeId: ID!, $startDate: String, $endDate: String) {
    attendancesByEmployee(employeeId: $employeeId, startDate: $startDate, endDate: $endDate) {
      id
      attendanceDate
      checkInTime
      checkOutTime
      breakStartTime
      breakEndTime
      overtimeHours
      workingHours
      attendanceStatus
      lateMinutes
      earlyLeaveMinutes
      checkInLocation
      checkOutLocation
      notes
      approvedBy
      approver {
        id
        fullName
      }
      approvedAt
      isActive
      createdAt
      updatedAt
    }
  }
`;

// 휴가 쿼리
export const GET_LEAVES = gql`
  query GetLeaves($filter: LeaveFilterInput, $limit: Int, $offset: Int) {
    leaves(filter: $filter, limit: $limit, offset: $offset) {
      id
      employeeId
      employee {
        id
        fullName
        department
        position
      }
      leaveType
      startDate
      endDate
      totalDays
      reason
      leaveStatus
      appliedAt
      approvedBy
      approver {
        id
        fullName
      }
      approvedAt
      rejectionReason
      emergencyContact
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_LEAVES_BY_EMPLOYEE = gql`
  query GetLeavesByEmployee($employeeId: ID!, $year: String) {
    leavesByEmployee(employeeId: $employeeId, year: $year) {
      id
      leaveType
      startDate
      endDate
      totalDays
      reason
      leaveStatus
      appliedAt
      approvedBy
      approver {
        id
        fullName
      }
      approvedAt
      rejectionReason
      emergencyContact
      isActive
      createdAt
      updatedAt
    }
  }
`;

// 급여 쿼리
export const GET_SALARIES = gql`
  query GetSalaries($filter: SalaryFilterInput, $limit: Int, $offset: Int) {
    salaries(filter: $filter, limit: $limit, offset: $offset) {
      id
      employeeId
      employee {
        id
        fullName
        department
        position
      }
      payrollMonth
      baseSalary
      allowances
      totalAllowances
      overtimePay
      bonuses
      totalBonuses
      grossSalary
      deductions
      totalDeductions
      netSalary
      workingDays
      attendanceDays
      absenceDays
      overtimeHours
      paymentDate
      paymentStatus
      bankAccount
      bankName
      notes
      processedBy
      processor {
        id
        fullName
      }
      processedAt
      isActive
      createdAt
      updatedAt
    }
  }
`;

// 평가 쿼리
export const GET_EVALUATIONS = gql`
  query GetEvaluations($filter: EvaluationFilterInput, $limit: Int, $offset: Int) {
    evaluations(filter: $filter, limit: $limit, offset: $offset) {
      id
      employeeId
      employee {
        id
        fullName
        department
        position
      }
      evaluatorId
      evaluator {
        id
        fullName
        position
      }
      evaluationPeriod
      evaluationType
      evaluationDate
      goals
      achievements
      competencies
      overallRating
      overallScore
      strengths
      areasForImprovement
      developmentPlan
      evaluatorComments
      employeeComments
      promotionRecommendation
      salaryAdjustmentRecommendation
      evaluationStatus
      approvedBy
      approver {
        id
        fullName
      }
      approvedAt
      isActive
      createdAt
      updatedAt
    }
  }
`;

// 직원 뮤테이션
export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      id
      employeeNumber
      firstName
      lastName
      fullName
      email
      phone
      mobile
      department
      position
      jobTitle
      employmentType
      employmentStatus
      hireDate
      baseSalary
      salaryType
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      employeeNumber
      firstName
      lastName
      fullName
      email
      phone
      mobile
      department
      position
      jobTitle
      employmentType
      employmentStatus
      hireDate
      terminationDate
      baseSalary
      salaryType
      supervisorId
      supervisor {
        id
        fullName
        position
      }
      isActive
      updatedAt
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

// 출근 뮤테이션
export const CREATE_ATTENDANCE = gql`
  mutation CreateAttendance($input: AttendanceInput!) {
    createAttendance(input: $input) {
      id
      employeeId
      attendanceDate
      checkInTime
      checkOutTime
      attendanceStatus
      workingHours
      overtimeHours
      notes
      createdAt
      updatedAt
    }
  }
`;

export const CHECK_IN = gql`
  mutation CheckIn($employeeId: ID!, $location: String, $ip: String) {
    checkIn(employeeId: $employeeId, location: $location, ip: $ip) {
      id
      employeeId
      attendanceDate
      checkInTime
      checkInLocation
      checkInIp
      attendanceStatus
      createdAt
      updatedAt
    }
  }
`;

export const CHECK_OUT = gql`
  mutation CheckOut($employeeId: ID!, $location: String, $ip: String) {
    checkOut(employeeId: $employeeId, location: $location, ip: $ip) {
      id
      employeeId
      attendanceDate
      checkInTime
      checkOutTime
      checkOutLocation
      checkOutIp
      workingHours
      overtimeHours
      attendanceStatus
      updatedAt
    }
  }
`;

export const APPROVE_ATTENDANCE = gql`
  mutation ApproveAttendance($id: ID!, $approvedBy: ID!) {
    approveAttendance(id: $id, approvedBy: $approvedBy) {
      id
      approvedBy
      approvedAt
      updatedAt
    }
  }
`;

// 휴가 뮤테이션
export const CREATE_LEAVE = gql`
  mutation CreateLeave($input: LeaveInput!) {
    createLeave(input: $input) {
      id
      employeeId
      leaveType
      startDate
      endDate
      totalDays
      reason
      leaveStatus
      appliedAt
      emergencyContact
      createdAt
      updatedAt
    }
  }
`;

export const APPROVE_LEAVE = gql`
  mutation ApproveLeave($id: ID!, $approvedBy: ID!) {
    approveLeave(id: $id, approvedBy: $approvedBy) {
      id
      leaveStatus
      approvedBy
      approvedAt
      updatedAt
    }
  }
`;

export const REJECT_LEAVE = gql`
  mutation RejectLeave($id: ID!, $rejectionReason: String!, $approvedBy: ID!) {
    rejectLeave(id: $id, rejectionReason: $rejectionReason, approvedBy: $approvedBy) {
      id
      leaveStatus
      rejectionReason
      approvedBy
      approvedAt
      updatedAt
    }
  }
`;

// 급여 뮤테이션
export const CREATE_SALARY = gql`
  mutation CreateSalary($input: SalaryInput!) {
    createSalary(input: $input) {
      id
      employeeId
      payrollMonth
      baseSalary
      grossSalary
      netSalary
      paymentStatus
      createdAt
      updatedAt
    }
  }
`;

export const PROCESS_SALARY = gql`
  mutation ProcessSalary($id: ID!, $processedBy: ID!) {
    processSalary(id: $id, processedBy: $processedBy) {
      id
      paymentStatus
      processedBy
      processedAt
      updatedAt
    }
  }
`;

// 평가 뮤테이션
export const CREATE_EVALUATION = gql`
  mutation CreateEvaluation($input: EvaluationInput!) {
    createEvaluation(input: $input) {
      id
      employeeId
      evaluatorId
      evaluationPeriod
      evaluationType
      evaluationDate
      overallRating
      overallScore
      evaluationStatus
      createdAt
      updatedAt
    }
  }
`;

export const APPROVE_EVALUATION = gql`
  mutation ApproveEvaluation($id: ID!, $approvedBy: ID!) {
    approveEvaluation(id: $id, approvedBy: $approvedBy) {
      id
      evaluationStatus
      approvedBy
      approvedAt
      updatedAt
    }
  }
`;
