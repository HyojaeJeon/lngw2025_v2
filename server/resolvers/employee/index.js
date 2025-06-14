
const { 
  Employee, 
  User, 
  AttendanceRecord, 
  LeaveRequest, 
  PerformanceEvaluation, 
  EvaluationGoal,
  SalaryRecord,
  EmergencyContact,
  Skill,
  Experience 
} = require('../../models');
const { AuthenticationError, ValidationError } = require('../../lib/errors');
const { Op } = require('sequelize');

const employeeResolvers = {
  Query: {
    employees: async (_, { filter }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      const where = {};
      
      if (filter?.search) {
        where[Op.or] = [
          { firstName: { [Op.like]: `%${filter.search}%` } },
          { lastName: { [Op.like]: `%${filter.search}%` } },
          { email: { [Op.like]: `%${filter.search}%` } },
          { employeeId: { [Op.like]: `%${filter.search}%` } }
        ];
      }
      
      if (filter?.department) {
        where.department = filter.department;
      }
      
      if (filter?.position) {
        where.position = filter.position;
      }
      
      if (filter?.status) {
        where.status = filter.status;
      }
      
      return await Employee.findAll({
        where,
        include: [
          { model: User, as: 'user' },
          { model: EmergencyContact, as: 'emergencyContacts' },
          { model: Skill, as: 'skills' },
          { model: Experience, as: 'experiences' }
        ],
        order: [['createdAt', 'DESC']]
      });
    },

    employee: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      const employee = await Employee.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: EmergencyContact, as: 'emergencyContacts' },
          { model: Skill, as: 'skills' },
          { model: Experience, as: 'experiences' },
          { model: AttendanceRecord, as: 'attendanceRecords' },
          { model: LeaveRequest, as: 'leaveRequests' },
          { model: PerformanceEvaluation, as: 'performanceEvaluations' },
          { model: SalaryRecord, as: 'salaryRecords' }
        ]
      });
      
      if (!employee) {
        throw new ValidationError('직원을 찾을 수 없습니다');
      }
      
      return employee;
    },

    attendanceRecords: async (_, { employeeId, dateFrom, dateTo }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      const where = {};
      
      if (employeeId) {
        where.employeeId = employeeId;
      }
      
      if (dateFrom && dateTo) {
        where.date = {
          [Op.between]: [dateFrom, dateTo]
        };
      } else if (dateFrom) {
        where.date = {
          [Op.gte]: dateFrom
        };
      } else if (dateTo) {
        where.date = {
          [Op.lte]: dateTo
        };
      }
      
      return await AttendanceRecord.findAll({
        where,
        include: [{ model: Employee, as: 'employee' }],
        order: [['date', 'DESC']]
      });
    },

    leaveRequests: async (_, { employeeId, status }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      const where = {};
      
      if (employeeId) {
        where.employeeId = employeeId;
      }
      
      if (status) {
        where.status = status;
      }
      
      return await LeaveRequest.findAll({
        where,
        include: [
          { model: Employee, as: 'employee' },
          { model: User, as: 'approver' }
        ],
        order: [['createdAt', 'DESC']]
      });
    },

    performanceEvaluations: async (_, { employeeId }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      const where = {};
      
      if (employeeId) {
        where.employeeId = employeeId;
      }
      
      return await PerformanceEvaluation.findAll({
        where,
        include: [
          { model: Employee, as: 'employee' },
          { model: User, as: 'evaluator' },
          { model: EvaluationGoal, as: 'goals' }
        ],
        order: [['createdAt', 'DESC']]
      });
    },

    salaryRecords: async (_, { employeeId }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      const where = {};
      
      if (employeeId) {
        where.employeeId = employeeId;
      }
      
      return await SalaryRecord.findAll({
        where,
        include: [{ model: Employee, as: 'employee' }],
        order: [['payDate', 'DESC']]
      });
    }
  },

  Mutation: {
    createEmployee: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      try {
        // 이름 조합
        const name = `${input.firstName} ${input.lastName}`;
        
        const employee = await Employee.create({
          ...input,
          name,
          status: 'ACTIVE'
        });
        
        return {
          success: true,
          message: '직원이 성공적으로 등록되었습니다',
          employee
        };
      } catch (error) {
        console.error('직원 생성 오류:', error);
        throw new ValidationError('직원 생성 중 오류가 발생했습니다');
      }
    },

    updateEmployee: async (_, { id, input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      try {
        const employee = await Employee.findByPk(id);
        
        if (!employee) {
          throw new ValidationError('직원을 찾을 수 없습니다');
        }
        
        // 이름 업데이트
        if (input.firstName || input.lastName) {
          input.name = `${input.firstName || employee.firstName} ${input.lastName || employee.lastName}`;
        }
        
        await employee.update(input);
        
        return {
          success: true,
          message: '직원 정보가 성공적으로 업데이트되었습니다',
          employee
        };
      } catch (error) {
        console.error('직원 업데이트 오류:', error);
        throw new ValidationError('직원 정보 업데이트 중 오류가 발생했습니다');
      }
    },

    deleteEmployee: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      try {
        const employee = await Employee.findByPk(id);
        
        if (!employee) {
          throw new ValidationError('직원을 찾을 수 없습니다');
        }
        
        // 소프트 삭제 (상태를 TERMINATED로 변경)
        await employee.update({ status: 'TERMINATED' });
        
        return {
          success: true,
          message: '직원이 성공적으로 삭제되었습니다'
        };
      } catch (error) {
        console.error('직원 삭제 오류:', error);
        throw new ValidationError('직원 삭제 중 오류가 발생했습니다');
      }
    },

    recordAttendance: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      try {
        // 근무 시간 계산
        let workHours = 0;
        if (input.checkIn && input.checkOut) {
          const checkIn = new Date(`${input.date} ${input.checkIn}`);
          const checkOut = new Date(`${input.date} ${input.checkOut}`);
          workHours = (checkOut - checkIn) / (1000 * 60 * 60); // 시간 단위
        }
        
        const attendance = await AttendanceRecord.create({
          ...input,
          workHours
        });
        
        return {
          success: true,
          message: '출근 기록이 성공적으로 등록되었습니다',
          attendance
        };
      } catch (error) {
        console.error('출근 기록 오류:', error);
        throw new ValidationError('출근 기록 중 오류가 발생했습니다');
      }
    },

    createLeaveRequest: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      try {
        // 휴가 일수 계산
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        const leaveRequest = await LeaveRequest.create({
          ...input,
          days,
          status: 'PENDING'
        });
        
        return {
          success: true,
          message: '휴가 신청이 성공적으로 등록되었습니다',
          leaveRequest
        };
      } catch (error) {
        console.error('휴가 신청 오류:', error);
        throw new ValidationError('휴가 신청 중 오류가 발생했습니다');
      }
    },

    approveLeaveRequest: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      try {
        const leaveRequest = await LeaveRequest.findByPk(input.id);
        
        if (!leaveRequest) {
          throw new ValidationError('휴가 신청을 찾을 수 없습니다');
        }
        
        await leaveRequest.update({
          status: input.status,
          approvedBy: user.id,
          approvedAt: new Date(),
          notes: input.notes
        });
        
        return {
          success: true,
          message: '휴가 신청이 성공적으로 처리되었습니다',
          leaveRequest
        };
      } catch (error) {
        console.error('휴가 승인 오류:', error);
        throw new ValidationError('휴가 승인 중 오류가 발생했습니다');
      }
    },

    createPerformanceEvaluation: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      try {
        const evaluation = await PerformanceEvaluation.create({
          ...input,
          evaluatorId: user.id,
          status: 'DRAFT'
        });
        
        // 목표 생성
        if (input.goals && input.goals.length > 0) {
          const goals = input.goals.map(goal => ({
            ...goal,
            evaluationId: evaluation.id
          }));
          
          await EvaluationGoal.bulkCreate(goals);
        }
        
        return {
          success: true,
          message: '성과 평가가 성공적으로 생성되었습니다',
          evaluation
        };
      } catch (error) {
        console.error('성과 평가 생성 오류:', error);
        throw new ValidationError('성과 평가 생성 중 오류가 발생했습니다');
      }
    },

    createSalaryRecord: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('인증이 필요합니다');
      
      try {
        // 총 급여 계산
        const totalSalary = (input.baseSalary || 0) + (input.allowances || 0) + (input.bonus || 0) - (input.deductions || 0);
        
        const salaryRecord = await SalaryRecord.create({
          ...input,
          totalSalary,
          status: 'PENDING'
        });
        
        return {
          success: true,
          message: '급여 기록이 성공적으로 생성되었습니다',
          salaryRecord
        };
      } catch (error) {
        console.error('급여 기록 생성 오류:', error);
        throw new ValidationError('급여 기록 생성 중 오류가 발생했습니다');
      }
    }
  },

  Employee: {
    user: async (employee) => {
      if (employee.userId) {
        return await User.findByPk(employee.userId);
      }
      return null;
    },
    
    emergencyContacts: async (employee) => {
      return await EmergencyContact.findAll({
        where: { employeeId: employee.id }
      });
    },
    
    skills: async (employee) => {
      return await Skill.findAll({
        where: { employeeId: employee.id }
      });
    },
    
    experiences: async (employee) => {
      return await Experience.findAll({
        where: { employeeId: employee.id },
        order: [['startDate', 'DESC']]
      });
    },
    
    attendanceRecords: async (employee) => {
      return await AttendanceRecord.findAll({
        where: { employeeId: employee.id },
        order: [['date', 'DESC']],
        limit: 30 // 최근 30일
      });
    },
    
    leaveRequests: async (employee) => {
      return await LeaveRequest.findAll({
        where: { employeeId: employee.id },
        order: [['createdAt', 'DESC']]
      });
    },
    
    performanceEvaluations: async (employee) => {
      return await PerformanceEvaluation.findAll({
        where: { employeeId: employee.id },
        include: [{ model: EvaluationGoal, as: 'goals' }],
        order: [['createdAt', 'DESC']]
      });
    },
    
    salaryRecords: async (employee) => {
      return await SalaryRecord.findAll({
        where: { employeeId: employee.id },
        order: [['payDate', 'DESC']]
      });
    }
  },

  AttendanceRecord: {
    employee: async (attendance) => {
      return await Employee.findByPk(attendance.employeeId);
    }
  },

  LeaveRequest: {
    employee: async (leave) => {
      return await Employee.findByPk(leave.employeeId);
    },
    
    approver: async (leave) => {
      if (leave.approvedBy) {
        return await User.findByPk(leave.approvedBy);
      }
      return null;
    }
  },

  PerformanceEvaluation: {
    employee: async (evaluation) => {
      return await Employee.findByPk(evaluation.employeeId);
    },
    
    evaluator: async (evaluation) => {
      return await User.findByPk(evaluation.evaluatorId);
    },
    
    goals: async (evaluation) => {
      return await EvaluationGoal.findAll({
        where: { evaluationId: evaluation.id }
      });
    }
  },

  SalaryRecord: {
    employee: async (salary) => {
      return await Employee.findByPk(salary.employeeId);
    }
  }
};

module.exports = employeeResolvers;
