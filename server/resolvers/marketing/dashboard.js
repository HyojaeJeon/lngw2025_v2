
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
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const totalPlans = await models.MarketingPlan.count();
        const activePlans = await models.MarketingPlan.count({ where: { status: '진행중' } });
        const completedPlans = await models.MarketingPlan.count({ where: { status: '완료' } });
        const draftPlans = await models.MarketingPlan.count({ where: { status: '계획됨' } });

        const overview = {
          totalCampaigns: totalPlans,
          activeCampaigns: activePlans,
          completedCampaigns: completedPlans,
          draftCampaigns: draftPlans,
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
        const users = await models.User.findAll({
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
        return await models.User.count();
      } catch (error) {
        console.error('사용자 수 조회 오류:', error);
        throw new Error('사용자 수를 불러오는데 실패했습니다.');
      }
    },

    marketingPlans: async (parent, { userId, status, limit = 10, offset = 0 }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const where = {};
        if (userId) where.userId = userId;
        if (status) where.status = status;

        const plans = await models.MarketingPlan.findAll({
          where,
          limit,
          offset,
          include: [
            {
              model: models.User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            },
            {
              model: models.MarketingObjective,
              as: 'objectives',
              include: [
                {
                  model: models.KeyResult,
                  as: 'keyResults',
                  include: [
                    {
                      model: models.ChecklistItem,
                      as: 'checklist'
                    }
                  ]
                }
              ]
            }
          ],
          order: [['updatedAt', 'DESC']]
        });

        return plans;
      } catch (error) {
        console.error('마케팅 계획 목록 조회 오류:', error);
        throw new Error('마케팅 계획 목록을 불러오는데 실패했습니다.');
      }
    },

    marketingPlan: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const plan = await models.MarketingPlan.findByPk(id, {
          include: [
            {
              model: models.User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            },
            {
              model: models.MarketingObjective,
              as: 'objectives',
              include: [
                {
                  model: models.KeyResult,
                  as: 'keyResults',
                  include: [
                    {
                      model: models.ChecklistItem,
                      as: 'checklist',
                      order: [['sortOrder', 'ASC']]
                    }
                  ]
                }
              ]
            }
          ]
        });

        if (!plan) {
          throw new Error('마케팅 계획을 찾을 수 없습니다.');
        }

        return plan;
      } catch (error) {
        console.error('마케팅 계획 조회 오류:', error);
        throw new Error('마케팅 계획을 불러오는데 실패했습니다.');
      }
    },

    marketingPlanObjectives: async (parent, { planId }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const objectives = await models.MarketingObjective.findAll({
          where: { planId },
          include: [
            {
              model: models.KeyResult,
              as: 'keyResults',
              include: [
                {
                  model: models.ChecklistItem,
                  as: 'checklist',
                  order: [['sortOrder', 'ASC']]
                }
              ]
            }
          ],
          order: [['createdAt', 'ASC']]
        });

        return objectives;
      } catch (error) {
        console.error('마케팅 목표 조회 오류:', error);
        throw new Error('마케팅 목표를 불러오는데 실패했습니다.');
      }
    }
  },

  Mutation: {
    createMarketingPlan: async (parent, { input }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const plan = await models.MarketingPlan.create({
          ...input,
          userId: user.userId
        });

        return await models.MarketingPlan.findByPk(plan.id, {
          include: [
            {
              model: models.User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        });
      } catch (error) {
        console.error('마케팅 계획 생성 오류:', error);
        throw new Error('마케팅 계획 생성에 실패했습니다.');
      }
    },

    updateMarketingPlan: async (parent, { id, input }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const plan = await models.MarketingPlan.findByPk(id);

        if (!plan) {
          throw new Error('마케팅 계획을 찾을 수 없습니다.');
        }

        await plan.update(input);

        return await models.MarketingPlan.findByPk(id, {
          include: [
            {
              model: models.User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            },
            {
              model: models.MarketingObjective,
              as: 'objectives',
              include: [
                {
                  model: models.KeyResult,
                  as: 'keyResults',
                  include: [
                    {
                      model: models.ChecklistItem,
                      as: 'checklist'
                    }
                  ]
                }
              ]
            }
          ]
        });
      } catch (error) {
        console.error('마케팅 계획 업데이트 오류:', error);
        throw new Error('마케팅 계획 업데이트에 실패했습니다.');
      }
    },

    deleteMarketingPlan: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const plan = await models.MarketingPlan.findByPk(id);

        if (!plan) {
          throw new Error('마케팅 계획을 찾을 수 없습니다.');
        }

        await plan.destroy();
        return true;
      } catch (error) {
        console.error('마케팅 계획 삭제 오류:', error);
        throw new Error('마케팅 계획 삭제에 실패했습니다.');
      }
    },

    toggleChecklistItem: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const item = await models.ChecklistItem.findByPk(id);

        if (!item) {
          throw new Error('체크리스트 항목을 찾을 수 없습니다.');
        }

        const completed = !item.completed;
        await item.update({
          completed,
          completedAt: completed ? new Date() : null
        });

        return item;
      } catch (error) {
        console.error('체크리스트 토글 오류:', error);
        throw new Error('체크리스트 토글에 실패했습니다.');
      }
    },

    createMarketingObjective: async (parent, { planId, input }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const objective = await models.MarketingObjective.create({
          ...input,
          planId
        });

        return await models.MarketingObjective.findByPk(objective.id, {
          include: [
            {
              model: models.KeyResult,
              as: 'keyResults',
              include: [
                {
                  model: models.ChecklistItem,
                  as: 'checklist'
                }
              ]
            }
          ]
        });
      } catch (error) {
        console.error('마케팅 목표 생성 오류:', error);
        throw new Error('마케팅 목표 생성에 실패했습니다.');
      }
    },

    updateMarketingObjective: async (parent, { id, input }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const objective = await models.MarketingObjective.findByPk(id);

        if (!objective) {
          throw new Error('마케팅 목표를 찾을 수 없습니다.');
        }

        await objective.update(input);

        return await models.MarketingObjective.findByPk(id, {
          include: [
            {
              model: models.KeyResult,
              as: 'keyResults',
              include: [
                {
                  model: models.ChecklistItem,
                  as: 'checklist'
                }
              ]
            }
          ]
        });
      } catch (error) {
        console.error('마케팅 목표 업데이트 오류:', error);
        throw new Error('마케팅 목표 업데이트에 실패했습니다.');
      }
    },

    deleteMarketingObjective: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const objective = await models.MarketingObjective.findByPk(id);

        if (!objective) {
          throw new Error('마케팅 목표를 찾을 수 없습니다.');
        }

        await objective.destroy();
        return true;
      } catch (error) {
        console.error('마케팅 목표 삭제 오류:', error);
        throw new Error('마케팅 목표 삭제에 실패했습니다.');
      }
    },

    createKeyResult: async (parent, { objectiveId, input }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const keyResult = await models.KeyResult.create({
          ...input,
          objectiveId
        });

        return await models.KeyResult.findByPk(keyResult.id, {
          include: [
            {
              model: models.ChecklistItem,
              as: 'checklist'
            }
          ]
        });
      } catch (error) {
        console.error('핵심 결과 생성 오류:', error);
        throw new Error('핵심 결과 생성에 실패했습니다.');
      }
    },

    updateKeyResult: async (parent, { id, input }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const keyResult = await models.KeyResult.findByPk(id);

        if (!keyResult) {
          throw new Error('핵심 결과를 찾을 수 없습니다.');
        }

        await keyResult.update(input);

        return await models.KeyResult.findByPk(id, {
          include: [
            {
              model: models.ChecklistItem,
              as: 'checklist'
            }
          ]
        });
      } catch (error) {
        console.error('핵심 결과 업데이트 오류:', error);
        throw new Error('핵심 결과 업데이트에 실패했습니다.');
      }
    },

    deleteKeyResult: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const keyResult = await models.KeyResult.findByPk(id);

        if (!keyResult) {
          throw new Error('핵심 결과를 찾을 수 없습니다.');
        }

        await keyResult.destroy();
        return true;
      } catch (error) {
        console.error('핵심 결과 삭제 오류:', error);
        throw new Error('핵심 결과 삭제에 실패했습니다.');
      }
    },

    createChecklistItem: async (parent, { keyResultId, input }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const item = await models.ChecklistItem.create({
          ...input,
          keyResultId
        });

        return item;
      } catch (error) {
        console.error('체크리스트 항목 생성 오류:', error);
        throw new Error('체크리스트 항목 생성에 실패했습니다.');
      }
    },

    updateChecklistItem: async (parent, { id, input }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const item = await models.ChecklistItem.findByPk(id);

        if (!item) {
          throw new Error('체크리스트 항목을 찾을 수 없습니다.');
        }

        await item.update(input);
        return item;
      } catch (error) {
        console.error('체크리스트 항목 업데이트 오류:', error);
        throw new Error('체크리스트 항목 업데이트에 실패했습니다.');
      }
    },

    deleteChecklistItem: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('인증이 필요합니다.');
      }

      try {
        const item = await models.ChecklistItem.findByPk(id);

        if (!item) {
          throw new Error('체크리스트 항목을 찾을 수 없습니다.');
        }

        await item.destroy();
        return true;
      } catch (error) {
        console.error('체크리스트 항목 삭제 오류:', error);
        throw new Error('체크리스트 항목 삭제에 실패했습니다.');
      }
    }
  }
};

module.exports = dashboardResolvers;
