
const { Op } = require("sequelize");
const { 
  Employee, 
  Attendance, 
  Leave, 
  Salary, 
  Evaluation, 
  User 
} = require("../../models");

const employeeResolvers = {
  Query: {
    // 직원 조회
    employees: async (parent, { filter = {}, limit = 50, offset = 0 }) => {
      const whereClause = {};

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
          { employeeNumber: { [Op.like]: `%${filter.search}%` } },
        ];
      }

      return await Employee.findAll({
        where: whereClause,
        include: [
          { model: User, as: "user" },
          { model: Employee, as: "supervisor" },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
    },

    employee: async (parent, { id }) => {
      return await Employee.findByPk(id, {
        include: [
          { model: User, as: "user" },
          { model: Employee, as: "supervisor" },
          { model: Employee, as: "subordinates" },
        ],
      });
    },

    employeeByNumber: async (parent, { employeeNumber }) => {
      return await Employee.findOne({
        where: { employeeNumber },
        include: [
          { model: User, as: "user" },
          { model: Employee, as: "supervisor" },
          { model: Employee, as: "subordinates" },
        ],
      });
    },

    // 출근 조회
    attendances: async (parent, { filter = {}, limit = 50, offset = 0 }) => {
      const whereClause = {};

      if (filter.employeeId) whereClause.employeeId = filter.employeeId;
      if (filter.attendanceDate) whereClause.attendanceDate = filter.attendanceDate;
      if (filter.attendanceStatus) whereClause.attendanceStatus = filter.attendanceStatus;

      if (filter.startDate && filter.endDate) {
        whereClause.attendanceDate = {
          [Op.between]: [filter.startDate, filter.endDate],
        };
      }

      return await Attendance.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "approver" },
        ],
        limit,
        offset,
        order: [["attendanceDate", "DESC"]],
      });
    },

    attendance: async (parent, { id }) => {
      return await Attendance.findByPk(id, {
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "approver" },
        ],
      });
    },

    attendancesByEmployee: async (parent, { employeeId, startDate, endDate }) => {
      const whereClause = { employeeId };

      if (startDate && endDate) {
        whereClause.attendanceDate = {
          [Op.between]: [startDate, endDate],
        };
      }

      return await Attendance.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "approver" },
        ],
        order: [["attendanceDate", "DESC"]],
      });
    },

    // 휴가 조회
    leaves: async (parent, { filter = {}, limit = 50, offset = 0 }) => {
      const whereClause = {};

      if (filter.employeeId) whereClause.employeeId = filter.employeeId;
      if (filter.leaveType) whereClause.leaveType = filter.leaveType;
      if (filter.leaveStatus) whereClause.leaveStatus = filter.leaveStatus;

      if (filter.startDate && filter.endDate) {
        whereClause[Op.or] = [
          {
            startDate: {
              [Op.between]: [filter.startDate, filter.endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [filter.startDate, filter.endDate],
            },
          },
        ];
      }

      return await Leave.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "approver" },
        ],
        limit,
        offset,
        order: [["appliedAt", "DESC"]],
      });
    },

    leave: async (parent, { id }) => {
      return await Leave.findByPk(id, {
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "approver" },
        ],
      });
    },

    leavesByEmployee: async (parent, { employeeId, year }) => {
      const whereClause = { employeeId };

      if (year) {
        whereClause.startDate = {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`],
        };
      }

      return await Leave.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "approver" },
        ],
        order: [["startDate", "DESC"]],
      });
    },

    // 급여 조회
    salaries: async (parent, { filter = {}, limit = 50, offset = 0 }) => {
      const whereClause = {};

      if (filter.employeeId) whereClause.employeeId = filter.employeeId;
      if (filter.payrollMonth) whereClause.payrollMonth = filter.payrollMonth;
      if (filter.paymentStatus) whereClause.paymentStatus = filter.paymentStatus;

      if (filter.startMonth && filter.endMonth) {
        whereClause.payrollMonth = {
          [Op.between]: [filter.startMonth, filter.endMonth],
        };
      }

      return await Salary.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "processor" },
        ],
        limit,
        offset,
        order: [["payrollMonth", "DESC"]],
      });
    },

    salary: async (parent, { id }) => {
      return await Salary.findByPk(id, {
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "processor" },
        ],
      });
    },

    salariesByEmployee: async (parent, { employeeId, year }) => {
      const whereClause = { employeeId };

      if (year) {
        whereClause.payrollMonth = {
          [Op.like]: `${year}-%`,
        };
      }

      return await Salary.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "processor" },
        ],
        order: [["payrollMonth", "DESC"]],
      });
    },

    // 평가 조회
    evaluations: async (parent, { filter = {}, limit = 50, offset = 0 }) => {
      const whereClause = {};

      if (filter.employeeId) whereClause.employeeId = filter.employeeId;
      if (filter.evaluatorId) whereClause.evaluatorId = filter.evaluatorId;
      if (filter.evaluationPeriod) whereClause.evaluationPeriod = filter.evaluationPeriod;
      if (filter.evaluationType) whereClause.evaluationType = filter.evaluationType;
      if (filter.overallRating) whereClause.overallRating = filter.overallRating;
      if (filter.evaluationStatus) whereClause.evaluationStatus = filter.evaluationStatus;

      return await Evaluation.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "evaluator" },
          { model: Employee, as: "approver" },
        ],
        limit,
        offset,
        order: [["evaluationDate", "DESC"]],
      });
    },

    evaluation: async (parent, { id }) => {
      return await Evaluation.findByPk(id, {
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "evaluator" },
          { model: Employee, as: "approver" },
        ],
      });
    },

    evaluationsByEmployee: async (parent, { employeeId, year }) => {
      const whereClause = { employeeId };

      if (year) {
        whereClause.evaluationDate = {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`],
        };
      }

      return await Evaluation.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: "employee" },
          { model: Employee, as: "evaluator" },
          { model: Employee, as: "approver" },
        ],
        order: [["evaluationDate", "DESC"]],
      });
    },
  },

  Mutation: {
    // 직원 관리
    createEmployee: async (parent, { input }) => {
      return await Employee.create(input);
    },

    updateEmployee: async (parent, { id, input }) => {
      const employee = await Employee.findByPk(id);
      if (!employee) {
        throw new Error("직원을 찾을 수 없습니다.");
      }
      return await employee.update(input);
    },

    deleteEmployee: async (parent, { id }) => {
      const employee = await Employee.findByPk(id);
      if (!employee) {
        throw new Error("직원을 찾을 수 없습니다.");
      }
      await employee.update({ isActive: false });
      return true;
    },

    // 출근 관리
    createAttendance: async (parent, { input }) => {
      return await Attendance.create(input);
    },

    updateAttendance: async (parent, { id, input }) => {
      const attendance = await Attendance.findByPk(id);
      if (!attendance) {
        throw new Error("출근 기록을 찾을 수 없습니다.");
      }
      return await attendance.update(input);
    },

    deleteAttendance: async (parent, { id }) => {
      const attendance = await Attendance.findByPk(id);
      if (!attendance) {
        throw new Error("출근 기록을 찾을 수 없습니다.");
      }
      await attendance.update({ isActive: false });
      return true;
    },

    checkIn: async (parent, { employeeId, location, ip }) => {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toTimeString().split(' ')[0];

      // 오늘 출근 기록이 있는지 확인
      let attendance = await Attendance.findOne({
        where: {
          employeeId,
          attendanceDate: today,
        },
      });

      if (attendance) {
        // 이미 출근 기록이 있으면 업데이트
        return await attendance.update({
          checkInTime: now,
          checkInLocation: location,
          checkInIp: ip,
          attendanceStatus: "정상출근",
        });
      } else {
        // 새로운 출근 기록 생성
        return await Attendance.create({
          employeeId,
          attendanceDate: today,
          checkInTime: now,
          checkInLocation: location,
          checkInIp: ip,
          attendanceStatus: "정상출근",
        });
      }
    },

    checkOut: async (parent, { employeeId, location, ip }) => {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toTimeString().split(' ')[0];

      const attendance = await Attendance.findOne({
        where: {
          employeeId,
          attendanceDate: today,
        },
      });

      if (!attendance) {
        throw new Error("출근 기록을 찾을 수 없습니다.");
      }

      return await attendance.update({
        checkOutTime: now,
        checkOutLocation: location,
        checkOutIp: ip,
      });
    },

    approveAttendance: async (parent, { id, approvedBy }) => {
      const attendance = await Attendance.findByPk(id);
      if (!attendance) {
        throw new Error("출근 기록을 찾을 수 없습니다.");
      }

      return await attendance.update({
        approvedBy,
        approvedAt: new Date(),
      });
    },

    // 휴가 관리
    createLeave: async (parent, { input }) => {
      return await Leave.create(input);
    },

    updateLeave: async (parent, { id, input }) => {
      const leave = await Leave.findByPk(id);
      if (!leave) {
        throw new Error("휴가 신청을 찾을 수 없습니다.");
      }
      return await leave.update(input);
    },

    deleteLeave: async (parent, { id }) => {
      const leave = await Leave.findByPk(id);
      if (!leave) {
        throw new Error("휴가 신청을 찾을 수 없습니다.");
      }
      await leave.update({ isActive: false });
      return true;
    },

    approveLeave: async (parent, { id, approvedBy }) => {
      const leave = await Leave.findByPk(id);
      if (!leave) {
        throw new Error("휴가 신청을 찾을 수 없습니다.");
      }

      return await leave.update({
        leaveStatus: "승인",
        approvedBy,
        approvedAt: new Date(),
      });
    },

    rejectLeave: async (parent, { id, rejectionReason, approvedBy }) => {
      const leave = await Leave.findByPk(id);
      if (!leave) {
        throw new Error("휴가 신청을 찾을 수 없습니다.");
      }

      return await leave.update({
        leaveStatus: "반려",
        rejectionReason,
        approvedBy,
        approvedAt: new Date(),
      });
    },

    // 급여 관리
    createSalary: async (parent, { input }) => {
      return await Salary.create(input);
    },

    updateSalary: async (parent, { id, input }) => {
      const salary = await Salary.findByPk(id);
      if (!salary) {
        throw new Error("급여 기록을 찾을 수 없습니다.");
      }
      return await salary.update(input);
    },

    deleteSalary: async (parent, { id }) => {
      const salary = await Salary.findByPk(id);
      if (!salary) {
        throw new Error("급여 기록을 찾을 수 없습니다.");
      }
      await salary.update({ isActive: false });
      return true;
    },

    processSalary: async (parent, { id, processedBy }) => {
      const salary = await Salary.findByPk(id);
      if (!salary) {
        throw new Error("급여 기록을 찾을 수 없습니다.");
      }

      return await salary.update({
        paymentStatus: "지급완료",
        processedBy,
        processedAt: new Date(),
      });
    },

    // 평가 관리
    createEvaluation: async (parent, { input }) => {
      return await Evaluation.create(input);
    },

    updateEvaluation: async (parent, { id, input }) => {
      const evaluation = await Evaluation.findByPk(id);
      if (!evaluation) {
        throw new Error("평가를 찾을 수 없습니다.");
      }
      return await evaluation.update(input);
    },

    deleteEvaluation: async (parent, { id }) => {
      const evaluation = await Evaluation.findByPk(id);
      if (!evaluation) {
        throw new Error("평가를 찾을 수 없습니다.");
      }
      await evaluation.update({ isActive: false });
      return true;
    },

    approveEvaluation: async (parent, { id, approvedBy }) => {
      const evaluation = await Evaluation.findByPk(id);
      if (!evaluation) {
        throw new Error("평가를 찾을 수 없습니다.");
      }

      return await evaluation.update({
        evaluationStatus: "승인완료",
        approvedBy,
        approvedAt: new Date(),
      });
    },
  },

  // 필드 리졸버
  Employee: {
    fullName: (parent) => `${parent.lastName}${parent.firstName}`,
    fullNameEn: (parent) => {
      if (parent.firstNameEn && parent.lastNameEn) {
        return `${parent.firstNameEn} ${parent.lastNameEn}`;
      }
      return null;
    },
    user: async (parent) => {
      if (parent.userId) {
        return await User.findByPk(parent.userId);
      }
      return null;
    },
    supervisor: async (parent) => {
      if (parent.supervisorId) {
        return await Employee.findByPk(parent.supervisorId);
      }
      return null;
    },
    subordinates: async (parent) => {
      return await Employee.findAll({
        where: { supervisorId: parent.id },
      });
    },
    attendances: async (parent) => {
      return await Attendance.findAll({
        where: { employeeId: parent.id },
        order: [["attendanceDate", "DESC"]],
      });
    },
    leaves: async (parent) => {
      return await Leave.findAll({
        where: { employeeId: parent.id },
        order: [["appliedAt", "DESC"]],
      });
    },
    salaries: async (parent) => {
      return await Salary.findAll({
        where: { employeeId: parent.id },
        order: [["payrollMonth", "DESC"]],
      });
    },
    evaluations: async (parent) => {
      return await Evaluation.findAll({
        where: { employeeId: parent.id },
        order: [["evaluationDate", "DESC"]],
      });
    },
  },
};

module.exports = employeeResolvers;
