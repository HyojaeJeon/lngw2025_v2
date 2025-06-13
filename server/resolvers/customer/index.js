const models = require("../../models");
const { Op } = require("sequelize");
const { Customer, User, ContactPerson, CustomerImage } = require("../../models");
const { 
  createError, 
  requireAuth, 
  requireRole, 
  handleDatabaseError 
} = require("../../lib/errors");

const customerResolvers = {
  Query: {
    users: async (parent, { limit = 10, offset = 0, search }, { user, lang }) => {
      requireAuth(user, lang);

      const whereCondition = search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } }, 
              { email: { [Op.like]: `%${search}%` } }, 
              { department: { [Op.like]: `%${search}%` } }, 
              { position: { [Op.like]: `%${search}%` } }
            ],
          }
        : {};

      try {
        const users = await models.User.findAll({
          where: whereCondition,
          limit,
          offset,
          attributes: ["id", "name", "email", "phoneNumber", "department", "position"],
          order: [["name", "ASC"]],
        });

        return users || [];
      } catch (error) {
        console.error("Users query error:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    checkCompanyName: async (_, { name }, { user, lang }) => {
      requireAuth(user, lang);
      
      try {
        const existingCustomer = await Customer.findOne({
          where: { name },
        });

        const exists = !!existingCustomer;
        return {
          exists,
          message: exists ? "Company name already exists" : "Company name is available",
        };
      } catch (error) {
        console.error("Error checking company name:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    customers: async (parent, { limit = 10, offset = 0, search, filter }, { user, lang }) => {
      requireAuth(user, lang);

      const whereCondition = {};
      
      // search와 filter.search 모두 처리
      const searchTerm = search || filter?.search;
      if (searchTerm) {
        whereCondition[Op.or] = [
          { name: { [Op.like]: `%${searchTerm}%` } }, 
          { email: { [Op.like]: `%${searchTerm}%` } }, 
          { industry: { [Op.like]: `%${searchTerm}%` } }
        ];
      }

      // 추가 필터 조건들
      if (filter?.status) {
        whereCondition.status = filter.status;
      }

      if (filter?.grade) {
        whereCondition.grade = filter.grade;
      }

      if (filter?.assignedUserId) {
        whereCondition.assignedUserId = filter.assignedUserId;
      }

      try {
        const customers = await Customer.findAll({
          where: whereCondition,
          limit,
          offset,
          include: [
            {
              model: models.User,
              as: "assignedUser",
              attributes: ["id", "name", "email", "department", "position"],
            },
            {
              model: models.CustomerImage,
              as: "facilityImages",
              order: [["sortOrder", "ASC"]],
            },
          ],
          order: [["createdAt", "DESC"]],
        });

        return customers;
      } catch (error) {
        console.error("Error fetching customers:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    customer: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const customer = await Customer.findByPk(id, {
          include: [
            {
              model: models.User,
              as: "assignedUser",
              attributes: ["id", "name", "email", "department", "position"],
            },
            {
              model: models.ContactPerson,
              as: "contacts",
            },
            {
              model: models.CustomerImage,
              as: "facilityImages",
              order: [["sortOrder", "ASC"]],
              attributes: ["id", "imageUrl", "description", "sortOrder"],
            },
          ],
        });

        if (!customer) {
          throw createError("CUSTOMER_NOT_FOUND", lang);
        }

        return customer;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error fetching customer:", error);
        handleDatabaseError(error, lang, "CUSTOMER_NOT_FOUND");
      }
    },

    addresses: async (parent, { limit = 10, offset = 0 }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const addresses = await models.Address.findAll({
          limit,
          offset,
          order: [["createdAt", "DESC"]],
        });

        return addresses;
      } catch (error) {
        console.error("Error fetching addresses:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    services: async (parent, { limit = 10, offset = 0 }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const services = await models.Service.findAll({
          limit,
          offset,
          order: [["createdAt", "DESC"]],
        });

        return services;
      } catch (error) {
        console.error("Error fetching services:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },
  },

  Mutation: {
    createCustomer: async (parent, { input }, { user, lang }) => {
      requireAuth(user, lang);

      // 트랜잭션 시작
      const transaction = await models.sequelize.transaction();

      try {
        const { contacts, facilityImages, city, district, province, detailAddress, ...customerData } = input;

        // 회사명 중복 확인
        const existingCustomer = await Customer.findOne({
          where: { name: customerData.name },
        }, { transaction });

        if (existingCustomer) {
          throw createError("COMPANY_NAME_EXISTS", lang);
        }

        // 주소 정보 처리 - 이미 클라이언트에서 문자열로 변환됨
        const fullAddress = customerData.address || "";

        const customer = await models.Customer.create(
          {
            ...customerData,
            address: fullAddress,
            createdBy: user.id,
          },
          { transaction }
        );

        // contacts가 있으면 bulkInsert
        if (Array.isArray(contacts) && contacts.length > 0) {
          const contactsData = contacts.map((contact) => {
            let parsedBirthDate = null;
            if (contact.birthDate) {
              parsedBirthDate = contact.birthDate instanceof Date ? contact.birthDate : new Date(contact.birthDate);
            }
            return {
              ...contact,
              birthDate: parsedBirthDate,
              customerId: customer.id,
            };
          });

          await models.ContactPerson.bulkCreate(contactsData, {
            transaction,
          });
        }

        // facilityImages가 있으면 bulkInsert
        if (facilityImages && facilityImages.length > 0) {
          const imagesData = facilityImages.map((img, index) => ({
            imageUrl: typeof img === "string" ? img : img.url,
            customerId: customer.id,
            sortOrder: img.sortOrder ?? index,
            imageType: img.imageType ?? "facility",
          }));
          await models.CustomerImage.bulkCreate(imagesData, {
            transaction,
          });
        }

        // 생성 작업 모두 성공 시 커밋
        await transaction.commit();

        // 생성된 Customer를 연관 모델과 함께 조회
        const createdCustomer = await models.Customer.findByPk(customer.id, {
          include: [
            {
              model: models.User,
              as: "assignedUser",
              attributes: ["id", "name", "email", "position"],
            },
            {
              model: models.ContactPerson,
              as: "contacts",
            },
            {
              model: models.CustomerImage,
              as: "facilityImages",
              order: [["sortOrder", "ASC"]],
            },
          ],
        });

        return createdCustomer;
      } catch (error) {
        // 생성 단계에서 문제가 발생한 경우에만 트랜잭션 롤백
        console.error("Create customer error:", error);
        try {
          await transaction.rollback();
        } catch (rollbackError) {
          console.error("Rollback error:", rollbackError);
        }
        
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "CUSTOMER_CREATE_FAILED");
      }
    },

    updateCustomer: async (parent, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        // 현재 고객 데이터 확인
        const currentCustomer = await Customer.findByPk(id);
        if (!currentCustomer) {
          throw createError("CUSTOMER_NOT_FOUND", lang);
        }

        // 회사명 중복 확인 (다른 고객과 중복되는지)
        if (input.name && input.name !== currentCustomer.name) {
          const existingCustomer = await Customer.findOne({
            where: { 
              name: input.name,
              id: { [Op.ne]: id }
            },
          });

          if (existingCustomer) {
            throw createError("COMPANY_NAME_EXISTS", lang);
          }
        }

        // 변경된 필드 확인
        const changedFields = {};
        Object.keys(input).forEach((key) => {
          if (input[key] !== currentCustomer[key]) {
            changedFields[key] = input[key];
          }
        });

        // 변경된 필드가 없으면 현재 고객 반환
        if (Object.keys(changedFields).length === 0) {
          const customer = await Customer.findByPk(id, {
            include: [
              {
                model: models.User,
                as: "assignedUser",
                attributes: ["id", "name", "email", "department", "position"],
              },
              {
                model: models.ContactPerson,
                as: "contacts",
              },
              {
                model: models.CustomerImage,
                as: "facilityImages",
                order: [["sortOrder", "ASC"]],
              },
            ],
          });
          return customer;
        }

        const [updatedRowsCount] = await Customer.update(changedFields, {
          where: { id },
        });

        if (updatedRowsCount === 0) {
          throw createError("CUSTOMER_NOT_FOUND", lang);
        }

        const updatedCustomer = await Customer.findByPk(id, {
          include: [
            {
              model: models.User,
              as: "assignedUser",
              attributes: ["id", "name", "email", "department", "position"],
            },
            {
              model: models.ContactPerson,
              as: "contacts",
            },
            {
              model: models.CustomerImage,
              as: "facilityImages",
              order: [["sortOrder", "ASC"]],
            },
          ],
        });

        return updatedCustomer;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error updating customer:", error);
        handleDatabaseError(error, lang, "CUSTOMER_UPDATE_FAILED");
      }
    },

    deleteCustomer: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const customer = await models.Customer.findByPk(id);
        if (!customer) {
          throw createError("CUSTOMER_NOT_FOUND", lang);
        }

        await customer.destroy();
        return { success: true, message: "Customer deleted successfully" };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error deleting customer:", error);
        handleDatabaseError(error, lang, "CUSTOMER_DELETE_FAILED");
      }
    },

    addContactPerson: async (parent, { customerId, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const customer = await models.Customer.findByPk(customerId);
        if (!customer) {
          throw createError("CUSTOMER_NOT_FOUND", lang);
        }

        const contactPerson = await models.ContactPerson.create({
          ...input,
          customerId: customerId,
        });

        return contactPerson;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error adding contact person:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    updateContactPerson: async (parent, { id, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const contactPerson = await models.ContactPerson.findByPk(id);
        if (!contactPerson) {
          throw createError("NOT_FOUND", lang);
        }

        await contactPerson.update(input);
        return contactPerson;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error updating contact person:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    deleteContactPerson: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const contactPerson = await models.ContactPerson.findByPk(id);
        if (!contactPerson) {
          throw createError("NOT_FOUND", lang);
        }

        await contactPerson.destroy();
        return { success: true, message: "Contact person deleted successfully" };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error deleting contact person:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    addCustomerImage: async (parent, { customerId, input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const customer = await models.Customer.findByPk(customerId);
        if (!customer) {
          throw createError("CUSTOMER_NOT_FOUND", lang);
        }

        const customerImage = await models.CustomerImage.create({
          ...input,
          customerId: customerId,
        });

        return customerImage;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error adding customer image:", error);
        handleDatabaseError(error, lang, "FILE_UPLOAD_FAILED");
      }
    },

    deleteCustomerImage: async (parent, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const customerImage = await models.CustomerImage.findByPk(id);
        if (!customerImage) {
          throw createError("NOT_FOUND", lang);
        }

        await customerImage.destroy();
        return { success: true, message: "Customer image deleted successfully" };
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        console.error("Error deleting customer image:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    createAddress: async (parent, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const address = await models.Address.create(input);
        return address;
      } catch (error) {
        console.error("Error creating address:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },

    createService: async (parent, { input }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const service = await models.Service.create(input);
        return service;
      } catch (error) {
        console.error("Error creating service:", error);
        handleDatabaseError(error, lang, "DATABASE_ERROR");
      }
    },
  },

  ContactPerson: {
    birthDate(contact) {
      if (!contact.birthDate) {
        return null;
      }
      // 이미 JS Date이면 그대로, 문자열이면 new Date()로 변환
      return contact.birthDate instanceof Date ? contact.birthDate : new Date(contact.birthDate);
    },
  },

  Customer: {
    contacts: async (customer) => {
      return await models.ContactPerson.findAll({
        where: { customerId: customer.id },
        order: [["createdAt", "ASC"]],
      });
    },
    facilityImages: async (customer) => {
      return await models.CustomerImage.findAll({
        where: { customerId: customer.id },
        order: [
          ["sortOrder", "ASC"],
          ["createdAt", "ASC"],
        ],
      });
    },
  },
};

module.exports = customerResolvers;
