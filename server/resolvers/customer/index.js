const models = require("../../models");
const { Op } = require("sequelize");
const { Customer } = models; // Import Customer model

const customerResolvers = {
  Query: {
    users: async (parent, { limit = 10, offset = 0, search }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const whereCondition = search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
              { department: { [Op.like]: `%${search}%` } },
              { position: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      try {
        const users = await models.User.findAll({
          where: whereCondition,
          limit,
          offset,
          attributes: [
            "id",
            "name",
            "email",
            "phoneNumber",
            "department",
            "position",
          ],
          order: [["name", "ASC"]],
        });

        return users || [];
      } catch (error) {
        console.error("Users query error:", error);
        return [];
      }
    },

    checkCompanyName: async (_, { name }) => {
      try {
        const existingCustomer = await Customer.findOne({
          where: {
            name: name.trim(),
          },
        });

        return {
          exists: !!existingCustomer,
          message: existingCustomer
            ? "이미 등록된 회사명입니다."
            : "사용 가능한 회사명입니다.",
        };
      } catch (error) {
        console.error("Company name check error:", error);
        throw new Error("회사명 중복 확인 중 오류가 발생했습니다.");
      }
    },
    customers: async (parent, { limit = 10, offset = 0, search }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const whereCondition = search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
              { industry: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      return await models.Customer.findAll({
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
            as: "images",
            order: [["sortOrder", "ASC"]],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    },

    customer: async (parent, { id }, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      return await models.Customer.findByPk(id, {
        include: [
          {
            model: models.User,
            as: "assignedUser",
            attributes: ["id", "name", "email", "department", "position"],
          },
          {
            model: models.CustomerImage,
            as: "images",
            order: [["sortOrder", "ASC"]],
          },
        ],
      });
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
        // 2) customer 생성
        const { contacts, facilityImages, ...customerData } = input;
        const customer = await models.Customer.create(
          {
            ...customerData,
            createdBy: user.id,
          },
          { transaction },
        );

        // 3) contacts가 있으면 bulkInsert
        if (contacts && contacts.length > 0) {
          const contactsData = contacts.map((contact) => ({
            ...contact,
            customerId: customer.id,
          }));
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
          order: [
            [{ model: models.CustomerImage, as: "images" }, "sortOrder", "ASC"],
          ],
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

      const customer = await models.Customer.findByPk(id);
      if (!customer) {
        throw new Error("Customer not found");
      }

      await customer.update(input);
      return customer;
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
      return true;
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
