const models = require("../../models");
const moment = require("moment");
const { Op } = require("sequelize");

const dashboardResolvers = {
  Query: {
    marketingStats: async () => {
      const today = moment().startOf("day").toDate();
      const weekAgo = moment().subtract(7, "days").startOf("day").toDate();
      const monthAgo = moment().subtract(30, "days").startOf("day").toDate();

      const [
        todayPosts,
        weekPosts,
        monthPosts,
        pendingApproval,
        errors,
        activeABTests,
        completedABTests,
        trendingKeywords,
      ] = await Promise.all([
        models.Content.count({ where: { createdAt: { [Op.gte]: today } } }),
        models.Content.count({ where: { createdAt: { [Op.gte]: weekAgo } } }),
        models.Content.count({ where: { createdAt: { [Op.gte]: monthAgo } } }),
        models.Content.count({ where: { status: "pending" } }),
        models.PostingLog.count({
          where: { level: "error", createdAt: { [Op.gte]: today } },
        }),
        models.ABTestGroup.count({ where: { status: "active" } }),
        models.ABTestGroup.count({ where: { status: "completed" } }),
        models.TrendingKeyword.count(),
      ]);

      return {
        totalPosts: {
          today: todayPosts,
          week: weekPosts,
          month: monthPosts,
        },
        pendingApproval,
        errors,
        abTestGroups: {
          active: activeABTests,
          completed: completedABTests,
        },
        trendingKeywords,
      };
    },
    marketingOverview: async (parent, args, { user }) => {
      // 사용자 인증 확인
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        // 마케팅 대시보드 데이터 조회
        const overview = {
          totalCampaigns: 12,
          activeCampaigns: 8,
          completedCampaigns: 3,
          draftCampaigns: 1,
          totalBudget: 50000000,
          spentBudget: 32000000,
          remainingBudget: 18000000,
          conversionRate: 3.2,
          avgEngagementRate: 4.8,
          totalImpressions: 1250000,
          totalClicks: 45600,
          totalConversions: 1460
        };

        return overview;
      } catch (error) {
        console.error('마케팅 개요 조회 오류:', error);
        throw new Error('마케팅 개요를 불러오는데 실패했습니다.');
      }
    },

    users: async (parent, { offset = 0, limit = 10 }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const { User } = require('../../models');
        const users = await User.findAll({
          offset,
          limit,
          attributes: ['id', 'name', 'email', 'position', 'avatar'],
          order: [['name', 'ASC']]
        });

        return users;
      } catch (error) {
        console.error('사용자 목록 조회 오류:', error);
        throw new Error('사용자 목록을 불러오는데 실패했습니다.');
      }
    },

    usersCount: async (parent, args, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const { User } = require('../../models');
        return await User.count();
      } catch (error) {
        console.error('사용자 수 조회 오류:', error);
        throw new Error('사용자 수를 불러오는데 실패했습니다.');
      }
    }
  },

  Mutation: {
    updateMarketingPlan: async (parent, { id, input }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        // 실제 환경에서는 MarketingPlan 모델을 사용
        // const { MarketingPlan } = require('../../models');
        // const plan = await MarketingPlan.findByPk(id);

        // if (!plan) {
        //   throw new Error('마케팅 계획을 찾을 수 없습니다.');
        // }

        // await plan.update(input);
        // return plan;

        // 현재는 더미 데이터 반환
        const updatedPlan = {
          id,
          ...input,
          updatedAt: new Date().toISOString()
        };

        console.log('마케팅 계획 업데이트:', updatedPlan);
        return updatedPlan;
      } catch (error) {
        console.error('마케팅 계획 업데이트 오류:', error);
        throw new Error('마케팅 계획 업데이트에 실패했습니다.');
      }
    }
  }
};

module.exports = dashboardResolvers;