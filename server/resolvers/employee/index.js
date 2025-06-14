const { Op } = require('sequelize');
const { requireAuth, createError, handleDatabaseError } = require('../../lib/errors');
const models = require('../../models');

const employeeResolvers = {
  Query: {
    employees: async (_, { department, status, search, first = 50, skip = 0 }, context) => {
      requireAuth(context);

      try {
        const whereClause = {};

        if (department) whereClause.department = department;
        if (status) whereClause.status = status;
        if (search) {
          whereClause[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { employeeId: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ];
        }

        const employees = await models.Employee.findAll({
          where: whereClause,
          include: [
            { model: models.Skill, as: 'skills' },
            { model: models.Experience, as: 'experiences' }
          ],
          limit: first,
          offset: skip,
          order: [['createdAt', 'DESC']]
        });

        return employees;
      } catch (error) {
        handleDatabaseError(error, context.lang);
      }
    },

    employee: async (_, { id }, context) => {
      requireAuth(context);

      try {
        const employee = await models.Employee.findByPk(id, {
          include: [
            { model: models.Skill, as: 'skills' },
            { model: models.Experience, as: 'experiences' },
            { model: models.AttendanceRecord, as: 'attendanceRecords' },
            { model: models.LeaveRequest, as: 'leaveRequests' },
            { model: models.PerformanceEvaluation, as: 'evaluations' }
          ]
        });

        if (!employee) {
          throw createError('USER_NOT_FOUND', context.lang);
        }

        return employee;
      } catch (error) {
        handleDatabaseError(error, context.lang);
      }
    },

    attendanceRecords: async (_, { employeeId, date, period, status, first = 50, skip = 0 }, context) => {
      requireAuth(context);

      try {
        const whereClause = {};

        if (employeeId) whereClause.employeeId = employeeId;
        if (date) whereClause.date = date;
        if (status) whereClause.status = status;
        if (period) {
          const [year, month] = period.split('-');
          whereClause.date = {
            [Op.gte]: `${year}-${month}-01`,
            [Op.lt]: `${year}-${month}-32`
          };
        }

        const records = await models.AttendanceRecord.findAll({
          where: whereClause,
          include: [{ model: models.Employee, as: 'employee' }],
          limit: first,
          offset: skip,
          order: [['date', 'DESC']]
        });

        return records;
      } catch (error) {
        handleDatabaseError(error, context.lang);
      }
    },

    leaveRequests: async (_, { employeeId, status, type, period, first = 50, skip = 0 }, context) => {
      requireAuth(context);

      try {
        const whereClause = {};

        if (employeeId) whereClause.employeeId = employeeId;
        if (status) whereClause.status = status;
        if (type) whereClause.type = type;
        if (period) {
          const [year] = period.split('-');
          whereClause.startDate = {
            [Op.gte]: `${year}-01-01`,
            [Op.lt]: `${parseInt(year) + 1}-01-01`
          };
        }

        const requests = await models.LeaveRequest.findAll({
          where: whereClause,
          include: [
            { model: models.Employee, as: 'employee' },
            { model: models.Employee, as: 'approver' }
          ],
          limit: first,
          offset: skip,
          order: [['createdAt', 'DESC']]
        });

        return requests;
      } catch (error) {
        handleDatabaseError(error, context.lang);
      }
    },

    evaluations: async (_, { employeeId, evaluatorId, type, status, period, first = 50, skip = 0 }, context) => {
      requireAuth(context);

      try {
        const whereClause = {};

        if (employeeId) whereClause.employeeId = employeeId;
        if (evaluatorId) whereClause.evaluatorId = evaluatorId;
        if (type) whereClause.type = type;
        if (status) whereClause.status = status;
        if (period) whereClause.period = period;

        const evaluations = await models.PerformanceEvaluation.findAll({
          where: whereClause,
          include: [
            { model: models.Employee, as: 'employee' },
            { model: models.Employee, as: 'evaluator' },
            { model: models.EvaluationGoal, as: 'goals' }
          ],
          limit: first,
          offset: skip,
          order: [['createdAt', 'DESC']]
        });

        return evaluations;
      } catch (error) {
        handleDatabaseError(error, context.lang);
      }
    },

    salaryRecords: async (_, { employeeId, period, status, first = 50, skip = 0 }, context) => {
      requireAuth(context);

      try {
        const whereClause = {};

        if (employeeId) whereClause.employeeId = employeeId;
        if (period) whereClause.period = period;
        if (status) whereClause.status = status;

        const records = await models.SalaryRecord.findAll({
          where: whereClause,
          include: [{ model: models.Employee, as: 'employee' }],
          limit: first,
          offset: skip,
          order: [['period', 'DESC']]
        });

        return records;
      } catch (error) {
        handleDatabaseError(error, context.lang);
      }
    },

    employeeStats: async (_, __, context) => {
      requireAuth(context);

      try {
        const totalEmployees = await models.Employee.count();
        const activeEmployees = await models.Employee.count({ where: { status: 'ACTIVE' } });
        const onLeaveEmployees = await models.Employee.count({ where: { status: 'ON_LEAVE' } });

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const newHiresThisMonth = await models.Employee.count({
          where: {
            hireDate: {
              [Op.gte]: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`,
              [Op.lt]: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`
            }
          }
        });

        const pendingLeaveRequests = await models.LeaveRequest.count({
          where: { status: 'PENDING' }
        });

        const today = currentDate.toISOString().split('T')[0];
        const todayAttendance = await models.AttendanceRecord.count({
          where: { 
            date: today,
            status: { [Op.in]: ['PRESENT', 'LATE'] }
          }
        });

        // 부서별 통계
        const departmentStats = await models.Employee.findAll({
          attributes: [
            'department',
            [models.sequelize.fn('COUNT', '*'), 'employeeCount'],
            [models.sequelize.fn('AVG', models.sequelize.col('salary')), 'averageSalary']
          ],
          where: { status: 'ACTIVE' },
          group: ['department'],
          raw: true
        });

        return {
          totalEmployees,
          activeEmployees,
          onLeaveEmployees,
          newHiresThisMonth,
          pendingLeaveRequests,
          todayAttendance,
          averageWorkHours: 8.0, // 임시값
          departmentStats: departmentStats.map(dept => ({
            department: dept.department,
            employeeCount: parseInt(dept.employeeCount),
            averageSalary: parseFloat(dept.averageSalary) || 0,
            attendanceRate: 95.0 // 임시값
          }))
        };
      } catch (error) {
        handleDatabaseError(error, context.lang);
      }
    }
  },

  Mutation: {
    createEmployee: async (_, { input }, context) => {
      requireAuth(context);

      try {
        const employee = await models.Employee.create({
          ...input,
          status: 'ACTIVE',
          isActive: true
        });

        return employee;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'EMPLOYEE_CREATE_FAILED');
      }
    },

    updateEmployee: async (_, { id, input }, context) => {
      requireAuth(context);

      try {
        const employee = await models.Employee.findByPk(id);
        if (!employee) {
          throw createError('USER_NOT_FOUND', context.lang);
        }

        await employee.update(input);
        return employee;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'EMPLOYEE_UPDATE_FAILED');
      }
    },

    deleteEmployee: async (_, { id }, context) => {
      requireAuth(context);

      try {
        const employee = await models.Employee.findByPk(id);
        if (!employee) {
          throw createError('USER_NOT_FOUND', context.lang);
        }

        await employee.update({ status: 'TERMINATED', isActive: false });

        return {
          success: true,
          message: '직원이 성공적으로 삭제되었습니다.'
        };
      } catch (error) {
        handleDatabaseError(error, context.lang, 'EMPLOYEE_DELETE_FAILED');
      }
    },

    createAttendance: async (_, { input }, context) => {
      requireAuth(context);

      try {
        // 근무 시간 계산
        let workHours = 0;
        if (input.checkIn && input.checkOut) {
          const checkIn = new Date(`${input.date}T${input.checkIn}`);
          const checkOut = new Date(`${input.date}T${input.checkOut}`);
          workHours = (checkOut - checkIn) / (1000 * 60 * 60);
        }

        const attendance = await models.AttendanceRecord.create({
          ...input,
          workHours
        });

        return attendance;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'ATTENDANCE_CREATE_FAILED');
      }
    },

    updateAttendance: async (_, { id, input }, context) => {
      requireAuth(context);

      try {
        const attendance = await models.AttendanceRecord.findByPk(id);
        if (!attendance) {
          throw createError('NOT_FOUND', context.lang);
        }

        // 근무 시간 재계산
        let workHours = attendance.workHours;
        if (input.checkIn && input.checkOut) {
          const checkIn = new Date(`${input.date || attendance.date}T${input.checkIn}`);
          const checkOut = new Date(`${input.date || attendance.date}T${input.checkOut}`);
          workHours = (checkOut - checkIn) / (1000 * 60 * 60);
        }

        await attendance.update({
          ...input,
          workHours
        });

        return attendance;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'ATTENDANCE_UPDATE_FAILED');
      }
    },

    createLeaveRequest: async (_, { input }, context) => {
      requireAuth(context);

      try {
        // 날짜 차이 계산
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        const leaveRequest = await models.LeaveRequest.create({
          ...input,
          days,
          status: 'PENDING'
        });

        return leaveRequest;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'LEAVE_REQUEST_CREATE_FAILED');
      }
    },

    approveLeaveRequest: async (_, { id, notes }, context) => {
      const user = requireAuth(context);

      try {
        const leaveRequest = await models.LeaveRequest.findByPk(id);
        if (!leaveRequest) {
          throw createError('NOT_FOUND', context.lang);
        }

        await leaveRequest.update({
          status: 'APPROVED',
          approvedBy: user.id,
          approvedAt: new Date().toISOString(),
          notes
        });

        return leaveRequest;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'LEAVE_REQUEST_UPDATE_FAILED');
      }
    },

    rejectLeaveRequest: async (_, { id, notes }, context) => {
      const user = requireAuth(context);

      try {
        const leaveRequest = await models.LeaveRequest.findByPk(id);
        if (!leaveRequest) {
          throw createError('NOT_FOUND', context.lang);
        }

        await leaveRequest.update({
          status: 'REJECTED',
          approvedBy: user.id,
          approvedAt: new Date().toISOString(),
          notes
        });

        return leaveRequest;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'LEAVE_REQUEST_UPDATE_FAILED');
      }
    },

    createSalaryRecord: async (_, { input }, context) => {
      requireAuth(context);

      try {
        const totalSalary = (input.baseSalary || 0) + (input.overtime || 0) + (input.bonus || 0) - (input.deductions || 0);

        const salaryRecord = await models.SalaryRecord.create({
          ...input,
          totalSalary,
          status: 'PENDING'
        });

        return salaryRecord;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'SALARY_RECORD_CREATE_FAILED');
      }
    },

    updateSalaryRecord: async (_, { id, input }, context) => {
      requireAuth(context);

      try {
        const salaryRecord = await models.SalaryRecord.findByPk(id);
        if (!salaryRecord) {
          throw createError('NOT_FOUND', context.lang);
        }

        const totalSalary = (input.baseSalary || salaryRecord.baseSalary) + 
                           (input.overtime || salaryRecord.overtime || 0) + 
                           (input.bonus || salaryRecord.bonus || 0) - 
                           (input.deductions || salaryRecord.deductions || 0);

        await salaryRecord.update({
          ...input,
          totalSalary
        });

        return salaryRecord;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'SALARY_RECORD_UPDATE_FAILED');
      }
    },

    processSalaryPayment: async (_, { id }, context) => {
      requireAuth(context);

      try {
        const salaryRecord = await models.SalaryRecord.findByPk(id);
        if (!salaryRecord) {
          throw createError('NOT_FOUND', context.lang);
        }

        await salaryRecord.update({
          status: 'PAID',
          paymentDate: new Date().toISOString()
        });

        return salaryRecord;
      } catch (error) {
        handleDatabaseError(error, context.lang, 'SALARY_PAYMENT_FAILED');
      }
    }
  }
};

module.exports = employeeResolvers;