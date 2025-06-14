const { Customer, CustomerActivity, User } = require('../../models');
const { requireAuth } = require('../../lib/errors');
const { Op } = require('sequelize');

const customerActivityResolvers = {
  Query: {
    customerActivities: async (parent, { filter = {}, limit = 20, offset = 0 }, { user }) => {
      requireAuth(user);

      const where = {};

      if (filter.customerId) where.customerId = filter.customerId;
      if (filter.type) where.type = filter.type;
      if (filter.createdBy) where.createdBy = filter.createdBy;

      if (filter.dateFrom || filter.dateTo) {
        where.activityDate = {};
        if (filter.dateFrom) where.activityDate[Op.gte] = filter.dateFrom;
        if (filter.dateTo) where.activityDate[Op.lte] = filter.dateTo;
      }

      return await CustomerActivity.findAll({
        where,
        limit,
        offset,
        order: [['activityDate', 'DESC']],
        include: [
          { model: Customer, as: 'customer' },
          { model: User, as: 'creator' }
        ]
      });
    },

    customerActivity: async (parent, { id }, { user }) => {
      requireAuth(user);

      return await CustomerActivity.findByPk(id, {
        include: [
          { model: Customer, as: 'customer' },
          { model: User, as: 'creator' }
        ]
      });
    },

    customerActivityTypes: async (parent, args, { user }) => {
      requireAuth(user);

      return [
        'meeting',
        'call',
        'email',
        'visit',
        'demo',
        'presentation',
        'negotiation',
        'followup',
        'support',
        'consultation'
      ];
    }
  },

  Mutation: {
    createCustomerActivity: async (parent, { input }, { user }) => {
      requireAuth(user);

      const activity = await CustomerActivity.create({
        ...input,
        participants: Array.isArray(input.participants) ? input.participants : [],
        attachments: Array.isArray(input.attachments) ? input.attachments : [],
        createdBy: user.id
      });

      return await CustomerActivity.findByPk(activity.id, {
        include: [
          { model: Customer, as: 'customer' },
          { model: User, as: 'creator' }
        ]
      });
    },

    updateCustomerActivity: async (parent, { id, input }, { user }) => {
      requireAuth(user);

      const activity = await CustomerActivity.findByPk(id);
      if (!activity) {
        throw new Error('활동 이력을 찾을 수 없습니다.');
      }

      // 작성자 본인이거나 관리자만 수정 가능
      if (activity.createdBy !== user.id && user.role !== 'admin') {
        throw new Error('수정 권한이 없습니다.');
      }

      const updateData = { ...input };
      if (input.participants) {
        updateData.participants = Array.isArray(input.participants) ? input.participants : [];
      }
      if (input.attachments) {
        updateData.attachments = Array.isArray(input.attachments) ? input.attachments : [];
      }

      await activity.update(updateData);

      return await CustomerActivity.findByPk(id, {
        include: [
          { model: Customer, as: 'customer' },
          { model: User, as: 'creator' }
        ]
      });
    },

    deleteCustomerActivity: async (parent, { id }, { user }) => {
      requireAuth(user);

      const activity = await CustomerActivity.findByPk(id);
      if (!activity) {
        throw new Error('활동 이력을 찾을 수 없습니다.');
      }

      // 작성자 본인이거나 관리자만 삭제 가능
      if (activity.createdBy !== user.id && user.role !== 'admin') {
        throw new Error('삭제 권한이 없습니다.');
      }

      await activity.destroy();

      return { success: true, message: '활동 이력이 삭제되었습니다.' };
    }
  }
};

module.exports = customerActivityResolvers;