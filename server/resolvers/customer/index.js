
const models = require("../../models");
const { Op } = require("sequelize");

const customerResolvers = {
  Query: {
    customers: async (_, { limit = 10, offset = 0, search }) => {
      const whereClause = search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { contactName: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      return await models.Customer.findAll({
        where: whereClause,
        limit,
        offset,
        include: [
          {
            model: models.User,
            as: "assignedUser",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    },

    customer: async (_, { id }) => {
      return await models.Customer.findByPk(id, {
        include: [
          {
            model: models.User,
            as: "assignedUser",
            attributes: ["id", "name", "email"],
          },
          {
            model: models.SalesOpportunity,
            as: "opportunities",
          },
        ],
      });
    },

    addresses: async (_, { limit = 10, offset = 0 }) => {
      return await models.Address.findAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
    },

    services: async (_, { limit = 10, offset = 0 }) => {
      return await models.Service.findAll({
        where: { status: "active" },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
    },

    users: async (_, { limit = 10, offset = 0 }) => {
      return await models.User.findAll({
        attributes: ["id", "name", "email", "department", "position"],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
    },
  },

  Mutation: {
    createCustomer: async (_, { input }) => {
      try {
        const customer = await models.Customer.create(input);
        return await models.Customer.findByPk(customer.id, {
          include: [
            {
              model: models.User,
              as: "assignedUser",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`Failed to create customer: ${error.message}`);
      }
    },

    updateCustomer: async (_, { id, input }) => {
      try {
        await models.Customer.update(input, { where: { id } });
        return await models.Customer.findByPk(id, {
          include: [
            {
              model: models.User,
              as: "assignedUser",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`Failed to update customer: ${error.message}`);
      }
    },

    deleteCustomer: async (_, { id }) => {
      try {
        const deleted = await models.Customer.destroy({ where: { id } });
        return {
          success: deleted > 0,
          message: deleted > 0 ? "Customer deleted successfully" : "Customer not found",
        };
      } catch (error) {
        throw new Error(`Failed to delete customer: ${error.message}`);
      }
    },

    createAddress: async (_, { input }) => {
      try {
        return await models.Address.create(input);
      } catch (error) {
        throw new Error(`Failed to create address: ${error.message}`);
      }
    },

    createService: async (_, { input }) => {
      try {
        return await models.Service.create(input);
      } catch (error) {
        throw new Error(`Failed to create service: ${error.message}`);
      }
    },
  },

  Customer: {
    assignedUser: async (parent) => {
      if (parent.assignedUserId) {
        return await models.User.findByPk(parent.assignedUserId, {
          attributes: ["id", "name", "email", "department", "position"],
        });
      }
      return null;
    },
    opportunities: async (parent) => {
      return await models.SalesOpportunity.findAll({
        where: { customerId: parent.id },
        order: [["createdAt", "DESC"]],
      });
    },
  },

  SalesOpportunity: {
    assignedUser: async (parent) => {
      if (parent.assignedUserId) {
        return await models.User.findByPk(parent.assignedUserId, {
          attributes: ["id", "name", "email", "department", "position"],
        });
      }
      return null;
    },
  },
};

module.exports = customerResolvers;
