const models = require("../../models");
const { Op } = require("sequelize");
const { Customer } = models; // Import Customer model

const customerResolvers = {
  Query: {
    checkCompanyName: async (_, { name }) => {
      try {
        const existingCustomer = await Customer.findOne({
          where: {
            name: name.trim()
          }
        });

        return {
          exists: !!existingCustomer,
          message: existingCustomer ? "이미 등록된 회사명입니다." : "사용 가능한 회사명입니다."
        };
      } catch (error) {
        console.error("Company name check error:", error);
        throw new Error("회사명 중복 확인 중 오류가 발생했습니다.");
      }
    },
    customers: async (parent, { limit = 10, offset = 0, search }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      const whereCondition = search ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { industry: { [Op.like]: `%${search}%` } }
        ]
      } : {};

      return await models.Customer.findAll({
        where: whereCondition,
        limit,
        offset,
        include: [
          {
            model: models.User,
            as: 'assignedUser',
            attributes: ['id', 'name', 'email', 'department', 'position']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    },

    customer: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      return await models.Customer.findByPk(id, {
        include: [
          {
            model: models.User,
            as: 'assignedUser',
            attributes: ['id', 'name', 'email', 'department', 'position']
          }
        ]
      });
    }
  },

  Mutation: {
    createCustomer: async (parent, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      try {
        // Start transaction
        const transaction = await models.sequelize.transaction();

        try {
          // Create customer
          const { contacts, ...customerData } = input;
          const customer = await models.Customer.create({
            ...customerData,
            createdBy: user.id
          }, { transaction });

          // Create contacts if provided
          if (contacts && contacts.length > 0) {
            const contactsData = contacts.map(contact => ({
              ...contact,
              customerId: customer.id
            }));
            await models.ContactPerson.bulkCreate(contactsData, { transaction });
          }

          // Commit transaction
          await transaction.commit();

          // Return customer with contacts
          const createdCustomer = await models.Customer.findByPk(customer.id, {
            include: [
              {
                model: models.User,
                as: 'assignedUser',
                attributes: ['id', 'name', 'email', 'department', 'position']
              },
              {
                model: models.ContactPerson,
                as: 'contacts'
              }
            ]
          });

          return createdCustomer;
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      } catch (error) {
        console.error('Create customer error:', error);
        throw new Error('Failed to create customer: ' + error.message);
      }
    },

    updateCustomer: async (parent, { id, input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      const customer = await models.Customer.findByPk(id);
      if (!customer) {
        throw new Error('Customer not found');
      }

      await customer.update(input);
      return customer;
    },

    deleteCustomer: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      const customer = await models.Customer.findByPk(id);
      if (!customer) {
        throw new Error('Customer not found');
      }

      await customer.destroy();
      return true;
    }
  },

  Customer: {
    contacts: async (customer) => {
      return await models.ContactPerson.findAll({
        where: { customerId: customer.id },
        order: [['createdAt', 'ASC']]
      });
    }
  }
};

module.exports = customerResolvers;