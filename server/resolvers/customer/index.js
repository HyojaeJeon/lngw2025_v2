const models = require("../../models");
const { Op } = require("sequelize");
const { Customer, User, ContactPerson, CustomerImage } = require("../../models");

const customerResolvers = {
  Query: {
    users: async (parent, { limit = 10, offset = 0, search }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const whereCondition = search
        ? {
            [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }, { department: { [Op.like]: `%${search}%` } }, { position: { [Op.like]: `%${search}%` } }],
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
        return [];
      }
    },

    checkCompanyName: async (_, { name }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }
      try {
        const existingCustomer = await Customer.findOne({
          where: { name },
        });

        return {
          exists: !!existingCustomer,
          message: existingCustomer ? "Company name already exists" : "Company name is available",
        };
      } catch (error) {
        console.error("Error checking company name:", error);
        throw new Error("Failed to check company name");
      }
    },
    customers: async (parent, { limit = 10, offset = 0, search }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const whereCondition = search
        ? {
            [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }, { industry: { [Op.like]: `%${search}%` } }],
          }
        : {};

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
        throw new Error("Failed to fetch customers");
      }
    },

    customer: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

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
          throw new Error("Customer not found");
        }

        return customer;
      } catch (error) {
        console.error("Error fetching customer:", error);
        throw new Error("Failed to fetch customer");
      }
    },
  },

  Mutation: {
    createCustomer: async (parent, { input }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      // 1) 트랜잭션 시작
      const transaction = await models.sequelize.transaction();

      try {
        // 2) customer 생성 (주소 매핑 처리)
        const { contacts, facilityImages, city, district, province, detailAddress, ...customerData } = input;

        // 주소 정보를 address 필드로 통합
        let fullAddress = "";
        if (city || district || province || detailAddress) {
          fullAddress = [city, district, province, detailAddress].filter(Boolean).join(" ");
        }

        const customer = await models.Customer.create(
          {
            ...customerData,
            address: fullAddress || customerData.address,
            createdBy: user.id,
          },
          { transaction }
        );

        // 3) contacts가 있으면 bulkInsert
        if (Array.isArray(contacts) && contacts.length > 0) {
          const contactsData = contacts.map((contact) => {
            // contact.birthDate: "2025-06-25" (문자열) 혹은 이미 Date 객체일 수 있음
            let parsedBirthDate = null;
            if (contact.birthDate) {
              parsedBirthDate = contact.birthDate instanceof Date ? contact.birthDate : new Date(contact.birthDate);
            }
            return {
              ...contact,
              birthDate: parsedBirthDate, // ← 키 이름은 반드시 모델 컬럼명(birthDate)과 동일
              customerId: customer.id,
            };
          });

          await models.ContactPerson.bulkCreate(contactsData, {
            transaction,
          });
        }

        // 4) facilityImages가 있으면 bulkInsert
        if (facilityImages && facilityImages.length > 0) {
          // (참고) facilityImages 배열이 실제로 image 객체인지, 문자열(URL)인지 확인 필요
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

        // 5) 생성 작업 모두 성공 시 커밋
        await transaction.commit();

        // 6) (트랜잭션 외부) 생성된 Customer를 연관 모델과 함께 조회
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
              as: "images",
              // 정렬을 include 옵션 안에서 지정하려면 include 안의 order 속성에 넣어야 합니다.
              // 예: { model: models.CustomerImage, as: "images", order: [["sortOrder", "ASC"]] }
            },
          ],
          order: [[{ model: models.CustomerImage, as: "images" }, "sortOrder", "ASC"]],
        });

        return createdCustomer;
      } catch (error) {
        // 7) 생성 단계에서 문제가 발생한 경우에만 트랜잭션 롤백
        console.error("Create customer error:", error);
        try {
          await transaction.rollback();
        } catch (rollbackError) {
          console.error("Rollback error:", rollbackError);
        }
        throw new Error("Failed to create customer: " + error.message);
      }
    },

    updateCustomer: async (parent, { id, input }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      try {
        // Get current customer data
        const currentCustomer = await Customer.findByPk(id);
        if (!currentCustomer) {
          throw new Error("Customer not found");
        }

        // Filter out unchanged fields
        const changedFields = {};
        Object.keys(input).forEach((key) => {
          if (input[key] !== currentCustomer[key]) {
            changedFields[key] = input[key];
          }
        });

        // If no fields changed, return current customer
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
                as: "images",
              },
              {
                model: models.CustomerImage,
                as: "facilityImages",
                where: { imageType: "facility" },
                required: false,
              },
              {
                model: models.SalesOpportunity,
                as: "opportunities",
                include: [
                  {
                    model: models.User,
                    as: "assignedUser",
                    attributes: ["id", "name", "email"],
                  },
                ],
              },
            ],
          });
          return customer;
        }

        const [updatedRowsCount] = await Customer.update(changedFields, {
          where: { id },
        });

        if (updatedRowsCount === 0) {
          throw new Error("Customer not found or no changes made");
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
              as: "images",
            },
            {
              model: models.CustomerImage,
              as: "facilityImages",
              where: { imageType: "facility" },
              required: false,
            },
            {
              model: models.SalesOpportunity,
              as: "opportunities",
              include: [
                {
                  model: models.User,
                  as: "assignedUser",
                  attributes: ["id", "name", "email"],
                },
              ],
            },
          ],
        });

        return updatedCustomer;
      } catch (error) {
        console.error("Error updating customer:", error);
        throw new Error("Failed to update customer");
      }
    },

    deleteCustomer: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const customer = await models.Customer.findByPk(id);
      if (!customer) {
        throw new Error("Customer not found");
      }

      await customer.destroy();
      return { success: true, message: "Customer deleted successfully" };
    },

    addContactPerson: async (parent, { customerId, input }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const customer = await models.Customer.findByPk(customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const contactPerson = await models.ContactPerson.create({
        ...input,
        customerId: customerId,
      });

      return contactPerson;
    },

    updateContactPerson: async (parent, { id, input }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const contactPerson = await models.ContactPerson.findByPk(id);
      if (!contactPerson) {
        throw new Error("Contact person not found");
      }

      await contactPerson.update(input);
      return contactPerson;
    },

    deleteContactPerson: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const contactPerson = await models.ContactPerson.findByPk(id);
      if (!contactPerson) {
        throw new Error("Contact person not found");
      }

      await contactPerson.destroy();
      return { success: true, message: "Contact person deleted successfully" };
    },

    addCustomerImage: async (parent, { customerId, input }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const customer = await models.Customer.findByPk(customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const customerImage = await models.CustomerImage.create({
        ...input,
        customerId: customerId,
      });

      return customerImage;
    },

    deleteCustomerImage: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const customerImage = await models.CustomerImage.findByPk(id);
      if (!customerImage) {
        throw new Error("Customer image not found");
      }

      await customerImage.destroy();
      return { success: true, message: "Customer image deleted successfully" };
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
    images: async (customer) => {
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
