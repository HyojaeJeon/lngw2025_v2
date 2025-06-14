const models = require("../../models");
const moment = require("moment");
const { Op } = require("sequelize");
const { 
  createError, 
  requireAuth, 
  requireRole, 
  handleDatabaseError 
} = require("../../lib/errors");

const dashboardResolvers = {
  Query: {
    marketingStats: async (parent, args, { lang }) => {
      try {
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
      } catch (error) {
        console.error('Error fetching marketing stats:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    marketingOverview: async (parent, args, { user, lang }) => {
      requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    usersCount: async (parent, args, { user, lang }) => {
      requireAuth(user, lang);

      try {
        return await models.User.count();
      } catch (error) {
        console.error('사용자 수 조회 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    marketingPlans: async (parent, { userId, status, limit = 10, offset = 0 }, { user, lang }) => {
      requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    marketingPlan: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

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
          throw createError('MARKETING_PLAN_NOT_FOUND', lang);
        }

        return plan;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('마케팅 계획 조회 오류:', error);
        handleDatabaseError(error, lang, "MARKETING_PLAN_NOT_FOUND");
      }
    },

    marketingPlanObjectives: async (parent, { planId }, { user, lang }) => {
      requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    }
  },

  Mutation: {
    createMarketingPlan: async (parent, { input }, { user, lang }) => {
      requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "MARKETING_PLAN_CREATE_FAILED");
      }
    },

    updateMarketingPlan: async (parent, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const plan = await models.MarketingPlan.findByPk(id);

        if (!plan) {
          throw createError('MARKETING_PLAN_NOT_FOUND', lang);
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
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('마케팅 계획 업데이트 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    deleteMarketingPlan: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const plan = await models.MarketingPlan.findByPk(id);

        if (!plan) {
          throw createError('MARKETING_PLAN_NOT_FOUND', lang);
        }

        await plan.destroy();
        return true;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('마케팅 계획 삭제 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    toggleChecklistItem: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const item = await models.ChecklistItem.findByPk(id);

        if (!item) {
          throw createError('NOT_FOUND', lang);
        }

        const completed = !item.completed;
        await item.update({
          completed,
          completedAt: completed ? new Date() : null
        });

        return item;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('체크리스트 토글 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    createMarketingObjective: async (parent, { planId, input }, { user, lang }) => {
      requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    updateMarketingObjective: async (parent, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const objective = await models.MarketingObjective.findByPk(id);

        if (!objective) {
          throw createError('NOT_FOUND', lang);
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
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('마케팅 목표 업데이트 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    deleteMarketingObjective: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const objective = await models.MarketingObjective.findByPk(id);

        if (!objective) {
          throw createError('NOT_FOUND', lang);
        }

        await objective.destroy();
        return true;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('마케팅 목표 삭제 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    createKeyResult: async (parent, { objectiveId, input }, { user, lang }) => {
      requireAuth(user, lang);

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
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    updateKeyResult: async (parent, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const keyResult = await models.KeyResult.findByPk(id);

        if (!keyResult) {
          throw createError('NOT_FOUND', lang);
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
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('핵심 결과 업데이트 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    deleteKeyResult: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const keyResult = await models.KeyResult.findByPk(id);

        if (!keyResult) {
          throw createError('NOT_FOUND', lang);
        }

        await keyResult.destroy();
        return true;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('핵심 결과 삭제 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    createChecklistItem: async (parent, { keyResultId, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const item = await models.ChecklistItem.create({
          ...input,
          keyResultId
        });

        return item;
      } catch (error) {
        console.error('체크리스트 생성 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    updateChecklistItem: async (parent, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const item = await models.ChecklistItem.findByPk(id);

        if (!item) {
          throw createError('NOT_FOUND', lang);
        }

        await item.update(input);
        return item;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('체크리스트 업데이트 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    deleteChecklistItem: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const item = await models.ChecklistItem.findByPk(id);

        if (!item) {
          throw createError('NOT_FOUND', lang);
        }

        await item.destroy();
        return true;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error('체크리스트 삭제 오류:', error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    }
  }
};

module.exports = dashboardResolvers;