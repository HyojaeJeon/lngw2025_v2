import { gql } from '@apollo/client';

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
      baseSalary
      isActive
      createdAt
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
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
      notes
      isActive
      supervisor {
        id
        fullName
      }
      subordinates {
        id
        fullName
        position
      }
      createdAt
      updatedAt
    }
  }
`;

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
      department
      position
      employmentType
      employmentStatus
      hireDate
      baseSalary
      isActive
      createdAt
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
      department
      position
      employmentType
      employmentStatus
      hireDate
      baseSalary
      isActive
      updatedAt
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      success
      message
    }
  }
`;

export const GET_EMPLOYEE_STATS = gql`
  query GetEmployeeStats {
    employeeStats {
      totalEmployees
      activeEmployees
      onLeaveEmployees
      newHiresThisMonth
      pendingLeaveRequests
      todayAttendance
      averageWorkHours
      departmentStats {
        department
        employeeCount
        averageSalary
        attendanceRate
      }
    }
  }
`;

export const GET_ATTENDANCE_RECORDS = gql`
  query GetAttendanceRecords($filter: AttendanceFilterInput, $limit: Int, $offset: Int) {
    attendanceRecords(filter: $filter, limit: $limit, offset: $offset) {
      id
      employeeId
      attendanceDate
      checkInTime
      checkOutTime
      workingHours
      attendanceStatus
      lateMinutes
      overtimeHours
      notes
      employee {
        id
        fullName
        department
        position
      }
      createdAt
    }
  }
`;