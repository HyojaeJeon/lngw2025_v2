
const models = require("../../models");
const { 
  createError, 
  requireAuth, 
  requireRole, 
  handleDatabaseError 
} = require("../../lib/errors");

const roleResolvers = {
  Role: {
    userCount: async (parent) => {
      return await models.User.count({
        where: { roleId: parent.id }
      });
    },
    permissions: async (parent) => {
      return await models.RolePermission.findAll({
        where: { roleId: parent.id },
        order: [["module", "ASC"]],
      });
    },
  },

  RolePermission: {
    role: async (parent) => {
      return await models.Role.findByPk(parent.roleId);
    },
  },

  Query: {
    roles: async (_, __, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const roles = await models.Role.findAll({
          where: { isActive: true },
          include: [
            {
              model: models.RolePermission,
              as: "permissions",
            },
          ],
          order: [["id", "ASC"]],
        });

        return roles;
      } catch (error) {
        handleDatabaseError(error, lang, "ROLES_FETCH_FAILED");
      }
    },

    role: async (_, { id }, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const role = await models.Role.findByPk(id, {
          include: [
            {
              model: models.RolePermission,
              as: "permissions",
            },
          ],
        });

        if (!role) {
          throw createError("ROLE_NOT_FOUND", lang);
        }

        return role;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "ROLE_FETCH_FAILED");
      }
    },

    permissionMatrix: async (_, __, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const modules = [
          "customers",
          "products", 
          "employees",
          "sales",
          "marketing",
          "revenue",
          "accounting",
          "settings"
        ];

        const roles = await models.Role.findAll({
          where: { isActive: true },
          include: [
            {
              model: models.RolePermission,
              as: "permissions",
            },
          ],
          order: [["id", "ASC"]],
        });

        const matrix = modules.map(module => {
          const permissions = roles.map(role => {
            const permission = role.permissions.find(p => p.module === module) || {
              canRead: false,
              canWrite: false,
              canDelete: false,
              canApprove: false,
              canSystemConfig: false,
            };

            return {
              roleId: role.id,
              roleName: role.name,
              canRead: permission.canRead,
              canWrite: permission.canWrite,
              canDelete: permission.canDelete,
              canApprove: permission.canApprove,
              canSystemConfig: permission.canSystemConfig,
            };
          });

          return {
            module,
            permissions,
          };
        });

        return matrix;
      } catch (error) {
        handleDatabaseError(error, lang, "PERMISSION_MATRIX_FETCH_FAILED");
      }
    },

    usersWithRoles: async (_, __, { user, lang }) => {
      requireAuth(user, lang);

      try {
        const users = await models.User.findAll({
          include: [
            {
              model: models.Role,
              as: "role",
            },
          ],
          order: [["name", "ASC"]],
        });

        return users;
      } catch (error) {
        handleDatabaseError(error, lang, "USERS_WITH_ROLES_FETCH_FAILED");
      }
    },
  },

  Mutation: {
    createRole: async (_, { input }, { user, lang }) => {
      requireAuth(user, lang);
      requireRole(user, ["admin"], lang);

      try {
        const { permissions, ...roleData } = input;

        const role = await models.Role.create({
          ...roleData,
          isSystem: false,
        });

        if (permissions && permissions.length > 0) {
          const permissionData = permissions.map(p => ({
            ...p,
            roleId: role.id,
          }));

          await models.RolePermission.bulkCreate(permissionData);
        }

        return await models.Role.findByPk(role.id, {
          include: [
            {
              model: models.RolePermission,
              as: "permissions",
            },
          ],
        });
      } catch (error) {
        handleDatabaseError(error, lang, "ROLE_CREATE_FAILED");
      }
    },

    updateRole: async (_, { id, input }, { user, lang }) => {
      requireAuth(user, lang);
      requireRole(user, ["admin"], lang);

      try {
        const role = await models.Role.findByPk(id);
        if (!role) {
          throw createError("ROLE_NOT_FOUND", lang);
        }

        const { permissions, ...roleData } = input;

        await models.Role.update(roleData, {
          where: { id },
        });

        if (permissions) {
          await models.RolePermission.destroy({
            where: { roleId: id },
          });

          if (permissions.length > 0) {
            const permissionData = permissions.map(p => ({
              ...p,
              roleId: id,
            }));

            await models.RolePermission.bulkCreate(permissionData);
          }
        }

        return await models.Role.findByPk(id, {
          include: [
            {
              model: models.RolePermission,
              as: "permissions",
            },
          ],
        });
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "ROLE_UPDATE_FAILED");
      }
    },

    deleteRole: async (_, { id }, { user, lang }) => {
      requireAuth(user, lang);
      requireRole(user, ["admin"], lang);

      try {
        const role = await models.Role.findByPk(id);
        if (!role) {
          throw createError("ROLE_NOT_FOUND", lang);
        }

        if (role.isSystem) {
          throw createError("CANNOT_DELETE_SYSTEM_ROLE", lang);
        }

        const userCount = await models.User.count({
          where: { roleId: id },
        });

        if (userCount > 0) {
          throw createError("CANNOT_DELETE_ROLE_WITH_USERS", lang);
        }

        await models.RolePermission.destroy({
          where: { roleId: id },
        });

        await models.Role.destroy({
          where: { id },
        });

        return true;
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "ROLE_DELETE_FAILED");
      }
    },

    updateUserRole: async (_, { input }, { user, lang }) => {
      requireAuth(user, lang);
      requireRole(user, ["admin"], lang);

      try {
        const { userId, roleId } = input;

        const targetUser = await models.User.findByPk(userId);
        if (!targetUser) {
          throw createError("USER_NOT_FOUND", lang);
        }

        const role = await models.Role.findByPk(roleId);
        if (!role) {
          throw createError("ROLE_NOT_FOUND", lang);
        }

        await models.User.update(
          { roleId },
          { where: { id: userId } }
        );

        return await models.User.findByPk(userId, {
          include: [
            {
              model: models.Role,
              as: "role",
            },
          ],
        });
      } catch (error) {
        if (error.extensions?.errorKey) {
          throw error;
        }
        handleDatabaseError(error, lang, "USER_ROLE_UPDATE_FAILED");
      }
    },

    updatePermissionMatrix: async (_, { input }, { user, lang }) => {
      requireAuth(user, lang);
      requireRole(user, ["admin"], lang);

      try {
        for (const moduleData of input) {
          const { module, permissions } = moduleData;

          for (const permission of permissions) {
            const { roleId, ...permissionData } = permission;

            await models.RolePermission.upsert({
              roleId,
              module,
              ...permissionData,
            });
          }
        }

        return true;
      } catch (error) {
        handleDatabaseError(error, lang, "PERMISSION_MATRIX_UPDATE_FAILED");
      }
    },
  },
};

module.exports = roleResolvers;
