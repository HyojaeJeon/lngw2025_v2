const models = require('../../models');
const { AuthenticationError, ForbiddenError, UserInputError } = require('apollo-server-express');

const employeeResolvers = {
  Query: {
    employees: async (parent, { filter, limit = 50, offset = 0 }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      const where = { isActive: true };

      if (filter) {
        if (filter.department) where.department = filter.department;
        if (filter.position) where.position = filter.position;
        if (filter.employmentType) where.employmentType = filter.employmentType;
        if (filter.employmentStatus) where.employmentStatus = filter.employmentStatus;
        if (filter.search) {
          where[models.Sequelize.Op.or] = [
            { firstName: { [models.Sequelize.Op.like]: `%${filter.search}%` } },
            { lastName: { [models.Sequelize.Op.like]: `%${filter.search}%` } },
            { email: { [models.Sequelize.Op.like]: `%${filter.search}%` } }
          ];
        }
      }

      return await models.Employee.findAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
    },

    employee: async (parent, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      return await models.Employee.findByPk(id);
    },

    employeeByNumber: async (parent, { employeeNumber }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      return await models.Employee.findOne({
        where: { employeeNumber, isActive: true }
      });
    },

    attendanceRecords: async (parent, { filter, limit = 50, offset = 0 }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      const where = { isActive: true };

      if (filter) {
        if (filter.employeeId) where.employeeId = filter.employeeId;
        if (filter.attendanceDate) where.attendanceDate = filter.attendanceDate;
        if (filter.attendanceStatus) where.attendanceStatus = filter.attendanceStatus;
        if (filter.startDate && filter.endDate) {
          where.attendanceDate = {
            [models.Sequelize.Op.between]: [filter.startDate, filter.endDate]
          };
        }
      }

      return await models.AttendanceRecord.findAll({
        where,
        limit,
        offset,
        include: ['employee'],
        order: [['attendanceDate', 'DESC']]
      });
    },

    employeeStats: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      const totalEmployees = await models.Employee.count({ where: { isActive: true } });
      const activeEmployees = await models.Employee.count({ 
        where: { isActive: true, employmentStatus: 'ACTIVE' } 
      });
      const onLeaveEmployees = await models.Employee.count({ 
        where: { isActive: true, employmentStatus: 'ON_LEAVE' } 
      });

      // 이번 달 신규 입사자
      const thisMonth = new Date();
      const startOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
      const newHiresThisMonth = await models.Employee.count({
        where: {
          isActive: true,
          hireDate: {
            [models.Sequelize.Op.gte]: startOfMonth
          }
        }
      });

      return {
        totalEmployees,
        activeEmployees,
        onLeaveEmployees,
        newHiresThisMonth,
        pendingLeaveRequests: 0,
        todayAttendance: 0,
        averageWorkHours: 8.0,
        departmentStats: []
      };
    }
  },

  Mutation: {
    createEmployee: async (parent, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      return await models.Employee.create({
        ...input,
        isActive: true
      });
    },

    updateEmployee: async (parent, { id, input }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      const employee = await models.Employee.findByPk(id);
      if (!employee) throw new UserInputError('Employee not found');

      await employee.update(input);
      return employee;
    },

    deleteEmployee: async (parent, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');

      const employee = await models.Employee.findByPk(id);
      if (!employee) throw new UserInputError('Employee not found');

      await employee.update({ isActive: false });

      return {
        success: true,
        message: 'Employee deleted successfully'
      };
    }
  },

  Employee: {
    fullName: (employee) => `${employee.firstName} ${employee.lastName}`,
    fullNameEn: (employee) => `${employee.firstNameEn || ''} ${employee.lastNameEn || ''}`.trim(),
    user: async (employee) => {
      if (employee.userId) {
        return await models.User.findByPk(employee.userId);
      }
      return null;
    },
    supervisor: async (employee) => {
      if (employee.supervisorId) {
        return await models.Employee.findByPk(employee.supervisorId);
      }
      return null;
    },
    subordinates: async (employee) => {
      return await models.Employee.findAll({
        where: { supervisorId: employee.id, isActive: true }
      });
    }
  }
};

module.exports = employeeResolvers;
const { Employee, AttendanceRecord, LeaveRequest, SalaryRecord, PerformanceEvaluation, EvaluationGoal, User } = require('../../models');
const { AuthenticationError, ValidationError } = require('../../lib/errors');
const { Op } = require('sequelize');

const employeeResolvers = {
  Query: {
    // 직원 조회
    employees: async (parent, { filter, limit = 20, offset = 0 }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      const whereClause = { isActive: true };
      
      if (filter) {
        if (filter.department) whereClause.department = filter.department;
        if (filter.position) whereClause.position = filter.position;
        if (filter.employmentType) whereClause.employmentType = filter.employmentType;
        if (filter.employmentStatus) whereClause.employmentStatus = filter.employmentStatus;
        if (filter.isActive !== undefined) whereClause.isActive = filter.isActive;
        if (filter.search) {
          whereClause[Op.or] = [
            { firstName: { [Op.like]: `%${filter.search}%` } },
            { lastName: { [Op.like]: `%${filter.search}%` } },
            { email: { [Op.like]: `%${filter.search}%` } },
            { employeeNumber: { [Op.like]: `%${filter.search}%` } }
          ];
        }
      }

      return await Employee.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'user' },
          { model: Employee, as: 'supervisor' },
          { model: Employee, as: 'subordinates' }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
    },

    employee: async (parent, { id }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      return await Employee.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Employee, as: 'supervisor' },
          { model: Employee, as: 'subordinates' },
          { model: AttendanceRecord, as: 'attendances' },
          { model: LeaveRequest, as: 'leaves' },
          { model: SalaryRecord, as: 'salaries' },
          { model: PerformanceEvaluation, as: 'evaluations' }
        ]
      });
    },

    employeeByNumber: async (parent, { employeeNumber }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      return await Employee.findOne({
        where: { employeeNumber, isActive: true },
        include: [
          { model: User, as: 'user' },
          { model: Employee, as: 'supervisor' }
        ]
      });
    },

    // 출근 기록 조회
    attendanceRecords: async (parent, { filter, limit = 20, offset = 0 }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      const whereClause = {};
      
      if (filter) {
        if (filter.employeeId) whereClause.employeeId = filter.employeeId;
        if (filter.attendanceDate) whereClause.attendanceDate = filter.attendanceDate;
        if (filter.attendanceStatus) whereClause.attendanceStatus = filter.attendanceStatus;
        if (filter.startDate && filter.endDate) {
          whereClause.attendanceDate = {
            [Op.between]: [filter.startDate, filter.endDate]
          };
        }
      }

      return await AttendanceRecord.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'employee' },
          { model: Employee, as: 'approver' }
        ],
        limit,
        offset,
        order: [['attendanceDate', 'DESC']]
      });
    },

    // 휴가 신청 조회
    leaveRequests: async (parent, { filter, limit = 20, offset = 0 }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      const whereClause = {};
      
      if (filter) {
        if (filter.employeeId) whereClause.employeeId = filter.employeeId;
        if (filter.leaveType) whereClause.leaveType = filter.leaveType;
        if (filter.leaveStatus) whereClause.leaveStatus = filter.leaveStatus;
        if (filter.startDate && filter.endDate) {
          whereClause.startDate = {
            [Op.between]: [filter.startDate, filter.endDate]
          };
        }
      }

      return await LeaveRequest.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'employee' },
          { model: Employee, as: 'approver' }
        ],
        limit,
        offset,
        order: [['appliedAt', 'DESC']]
      });
    },

    // 급여 기록 조회
    salaryRecords: async (parent, { filter, limit = 20, offset = 0 }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      const whereClause = {};
      
      if (filter) {
        if (filter.employeeId) whereClause.employeeId = filter.employeeId;
        if (filter.payrollMonth) whereClause.payrollMonth = filter.payrollMonth;
        if (filter.paymentStatus) whereClause.paymentStatus = filter.paymentStatus;
      }

      return await SalaryRecord.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'employee' },
          { model: Employee, as: 'processor' }
        ],
        limit,
        offset,
        order: [['payrollMonth', 'DESC']]
      });
    },

    // 통계
    employeeStats: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      const totalEmployees = await Employee.count({ where: { isActive: true } });
      const activeEmployees = await Employee.count({ 
        where: { isActive: true, employmentStatus: 'ACTIVE' } 
      });
      const onLeaveEmployees = await Employee.count({ 
        where: { isActive: true, employmentStatus: 'ON_LEAVE' } 
      });

      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const newHiresThisMonth = await Employee.count({
        where: {
          isActive: true,
          hireDate: { [Op.gte]: startOfMonth }
        }
      });

      const pendingLeaveRequests = await LeaveRequest.count({
        where: { leaveStatus: 'PENDING' }
      });

      const todayStr = today.toISOString().split('T')[0];
      const todayAttendance = await AttendanceRecord.count({
        where: {
          attendanceDate: todayStr,
          attendanceStatus: { [Op.in]: ['PRESENT', 'LATE', 'EARLY_LEAVE'] }
        }
      });

      return {
        totalEmployees,
        activeEmployees,
        onLeaveEmployees,
        newHiresThisMonth,
        pendingLeaveRequests,
        todayAttendance,
        averageWorkHours: 8.0,
        departmentStats: []
      };
    }
  },

  Mutation: {
    // 직원 생성
    createEmployee: async (parent, { input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      const existingEmployee = await Employee.findOne({
        where: { employeeNumber: input.employeeNumber }
      });

      if (existingEmployee) {
        throw new ValidationError('이미 존재하는 사원번호입니다');
      }

      return await Employee.create({
        ...input,
        fullName: `${input.lastName} ${input.firstName}`,
        fullNameEn: input.lastNameEn && input.firstNameEn ? 
          `${input.firstNameEn} ${input.lastNameEn}` : null,
        isActive: input.isActive !== undefined ? input.isActive : true
      });
    },

    // 직원 수정
    updateEmployee: async (parent, { id, input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      const employee = await Employee.findByPk(id);
      if (!employee) throw new ValidationError('직원을 찾을 수 없습니다');

      if (input.employeeNumber && input.employeeNumber !== employee.employeeNumber) {
        const existingEmployee = await Employee.findOne({
          where: { employeeNumber: input.employeeNumber, id: { [Op.ne]: id } }
        });
        if (existingEmployee) {
          throw new ValidationError('이미 존재하는 사원번호입니다');
        }
      }

      const updateData = { ...input };
      if (input.firstName || input.lastName) {
        updateData.fullName = `${input.lastName || employee.lastName} ${input.firstName || employee.firstName}`;
      }
      if (input.firstNameEn || input.lastNameEn) {
        updateData.fullNameEn = `${input.firstNameEn || employee.firstNameEn} ${input.lastNameEn || employee.lastNameEn}`;
      }

      await employee.update(updateData);
      return employee;
    },

    // 출근 체크인
    checkIn: async (parent, { employeeId, location, ip }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      const today = new Date().toISOString().split('T')[0];
      const existingRecord = await AttendanceRecord.findOne({
        where: { employeeId, attendanceDate: today }
      });

      if (existingRecord && existingRecord.checkInTime) {
        throw new ValidationError('이미 출근 처리되었습니다');
      }

      const checkInTime = new Date();
      const standardStartTime = new Date();
      standardStartTime.setHours(9, 0, 0, 0);

      const lateMinutes = checkInTime > standardStartTime ? 
        Math.floor((checkInTime - standardStartTime) / (1000 * 60)) : 0;

      if (existingRecord) {
        await existingRecord.update({
          checkInTime,
          checkInLocation: location,
          checkInIp: ip,
          lateMinutes,
          attendanceStatus: lateMinutes > 0 ? 'LATE' : 'PRESENT'
        });
        return existingRecord;
      } else {
        return await AttendanceRecord.create({
          employeeId,
          attendanceDate: today,
          checkInTime,
          checkInLocation: location,
          checkInIp: ip,
          lateMinutes,
          attendanceStatus: lateMinutes > 0 ? 'LATE' : 'PRESENT',
          isActive: true
        });
      }
    },

    // 휴가 신청
    createLeaveRequest: async (parent, { input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');

      return await LeaveRequest.create({
        ...input,
        appliedAt: new Date(),
        leaveStatus: 'PENDING',
        isActive: true
      });
    }
  },

  // 타입 리졸버
  Employee: {
    user: async (employee) => {
      if (employee.userId) {
        return await User.findByPk(employee.userId);
      }
      return null;
    },
    supervisor: async (employee) => {
      if (employee.supervisorId) {
        return await Employee.findByPk(employee.supervisorId);
      }
      return null;
    },
    subordinates: async (employee) => {
      return await Employee.findAll({
        where: { supervisorId: employee.id, isActive: true }
      });
    }
  },

  AttendanceRecord: {
    employee: async (attendance) => {
      return await Employee.findByPk(attendance.employeeId);
    },
    approver: async (attendance) => {
      if (attendance.approvedBy) {
        return await Employee.findByPk(attendance.approvedBy);
      }
      return null;
    }
  },

  LeaveRequest: {
    employee: async (leave) => {
      return await Employee.findByPk(leave.employeeId);
    },
    approver: async (leave) => {
      if (leave.approvedBy) {
        return await Employee.findByPk(leave.approvedBy);
      }
      return null;
    }
  }
};

module.exports = employeeResolvers;
