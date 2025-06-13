"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useLanguage.js";
import { useQuery, useMutation } from "@apollo/client";
import {
  Shield,
  Users,
  Settings,
  History,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  AlertCircle,
} from "lucide-react";
import {
  GET_ROLES,
  GET_PERMISSION_MATRIX,
  GET_USERS_WITH_ROLES,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  UPDATE_USER_ROLE,
  UPDATE_PERMISSION_MATRIX,
} from "@/lib/graphql/roleOperations.js";

export default function AccessControlPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("roles");
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissionChanges, setPermissionChanges] = useState({});

  // GraphQL queries
  const { data: rolesData, loading: rolesLoading, refetch: refetchRoles } = useQuery(GET_ROLES);
  const { data: matrixData, loading: matrixLoading, refetch: refetchMatrix } = useQuery(GET_PERMISSION_MATRIX);
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_USERS_WITH_ROLES);

  // GraphQL mutations
  const [createRole] = useMutation(CREATE_ROLE);
  const [updateRole] = useMutation(UPDATE_ROLE);
  const [deleteRole] = useMutation(DELETE_ROLE);
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE);
  const [updatePermissionMatrix] = useMutation(UPDATE_PERMISSION_MATRIX);

  const modules = [
    { key: "customers", name: t("accessControl.modules.customers") },
    { key: "products", name: t("accessControl.modules.products") },
    { key: "employees", name: t("accessControl.modules.employees") },
    { key: "sales", name: t("accessControl.modules.sales") },
    { key: "marketing", name: t("accessControl.modules.marketing") },
    { key: "revenue", name: t("accessControl.modules.revenue") },
    { key: "accounting", name: t("accessControl.modules.accounting") },
    { key: "settings", name: t("accessControl.modules.settings") },
  ];

  const colorOptions = [
    { value: "bg-red-500", name: "빨간색" },
    { value: "bg-orange-500", name: "주황색" },
    { value: "bg-yellow-500", name: "노란색" },
    { value: "bg-green-500", name: "초록색" },
    { value: "bg-blue-500", name: "파란색" },
    { value: "bg-indigo-500", name: "남색" },
    { value: "bg-purple-500", name: "보라색" },
    { value: "bg-gray-500", name: "회색" },
  ];

  const tabs = [
    { id: "roles", name: t("accessControl.roleManagement"), icon: Shield },
    { id: "matrix", name: t("accessControl.permissionMatrix"), icon: Settings },
    { id: "users", name: t("accessControl.userAssignment"), icon: Users },
    { id: "history", name: t("accessControl.changeHistory"), icon: History },
  ];

  // 새 역할 추가
  const handleCreateRole = async (roleData) => {
    try {
      await createRole({
        variables: { input: roleData }
      });
      await refetchRoles();
      setShowAddRoleModal(false);
    } catch (error) {
      console.error("Error creating role:", error);
      alert("역할 생성에 실패했습니다.");
    }
  };

  // 역할 수정
  const handleUpdateRole = async (id, roleData) => {
    try {
      await updateRole({
        variables: { id, input: roleData }
      });
      await refetchRoles();
      setShowEditRoleModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("역할 수정에 실패했습니다.");
    }
  };

  // 역할 삭제
  const handleDeleteRole = async (id) => {
    if (!confirm("정말로 이 역할을 삭제하시겠습니까?")) return;

    try {
      await deleteRole({
        variables: { id }
      });
      await refetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("역할 삭제에 실패했습니다.");
    }
  };

  // 사용자 역할 변경
  const handleUpdateUserRole = async (userId, roleId) => {
    try {
      await updateUserRole({
        variables: { 
          input: { userId, roleId } 
        }
      });
      await refetchUsers();
      setShowEditUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("사용자 역할 변경에 실패했습니다.");
    }
  };

  // 권한 매트릭스 저장
  const handleSavePermissionMatrix = async () => {
    try {
      const input = Object.keys(permissionChanges).map(module => ({
        module,
        permissions: Object.keys(permissionChanges[module]).map(roleId => ({
          roleId: parseInt(roleId),
          canRead: permissionChanges[module][roleId].canRead || false,
          canWrite: permissionChanges[module][roleId].canWrite || false,
          canDelete: permissionChanges[module][roleId].canDelete || false,
          canApprove: permissionChanges[module][roleId].canApprove || false,
          canSystemConfig: permissionChanges[module][roleId].canSystemConfig || false,
        }))
      }));

      await updatePermissionMatrix({
        variables: { input }
      });

      await refetchMatrix();
      setPermissionChanges({});
      alert("권한 매트릭스가 저장되었습니다.");
    } catch (error) {
      console.error("Error updating permission matrix:", error);
      alert("권한 매트릭스 저장에 실패했습니다.");
    }
  };

  // 권한 변경 처리
  const handlePermissionChange = (module, roleId, permission, value) => {
    setPermissionChanges(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [roleId]: {
          ...prev[module]?.[roleId],
          roleId,
          [permission]: value
        }
      }
    }));
  };

  // 역할 관리 렌더링
  const renderRoleManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("accessControl.roleManagement")}
        </h3>
        <button 
          onClick={() => setShowAddRoleModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t("accessControl.addNewRole")}</span>
        </button>
      </div>

      {rolesLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {rolesData?.roles?.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded ${role.color}`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {role.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {role.description} • {role.userCount}명
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedRole(role);
                      setShowEditRoleModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-blue-500"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {!role.isSystem && (
                    <button 
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-4">
                {["canRead", "canWrite", "canDelete", "canApprove", "canSystemConfig"].map((perm) => (
                  <div key={perm} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {perm === "canRead" ? t("accessControl.read")
                        : perm === "canWrite" ? t("accessControl.write")
                        : perm === "canDelete" ? t("accessControl.delete")
                        : perm === "canApprove" ? t("accessControl.approve")
                        : t("accessControl.systemConfig")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 권한 매트릭스 렌더링
  const renderPermissionMatrix = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("accessControl.permissionMatrix")}
        </h3>
        {Object.keys(permissionChanges).length > 0 && (
          <button 
            onClick={handleSavePermissionMatrix}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{t("accessControl.saveChanges")}</span>
          </button>
        )}
      </div>

      {matrixLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    모듈
                  </th>
                  {rolesData?.roles?.map((role) => (
                    <th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex flex-col items-center space-y-2">
                        <span className={`px-2 py-1 rounded text-white text-xs ${role.color}`}>
                          {role.name}
                        </span>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded" title={t("accessControl.read")}></div>
                          <div className="w-3 h-3 bg-blue-500 rounded" title={t("accessControl.write")}></div>
                          <div className="w-3 h-3 bg-red-500 rounded" title={t("accessControl.delete")}></div>
                          <div className="w-3 h-3 bg-purple-500 rounded" title={t("accessControl.approve")}></div>
                          <div className="w-3 h-3 bg-orange-500 rounded" title={t("accessControl.systemConfig")}></div>
</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {matrixData?.permissionMatrix?.map((moduleMatrix) => (
                  <tr key={moduleMatrix.module}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {modules.find(m => m.key === moduleMatrix.module)?.name || moduleMatrix.module}
                    </td>
                    {moduleMatrix.permissions.map((permission) => (
                      <td key={permission.roleId} className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-1">
                          {["canRead", "canWrite", "canDelete"].map((perm) => {
                            const currentValue = permissionChanges[moduleMatrix.module]?.[permission.roleId]?.[perm] 
                              ?? permission[perm];

                            return (
                              <button
                                key={perm}
                                onClick={() => handlePermissionChange(
                                  moduleMatrix.module, 
                                  permission.roleId, 
                                  perm, 
                                  !currentValue
                                )}
                                className={`w-3 h-3 rounded transition-colors ${
                                  currentValue
                                    ? perm === "canRead" ? "bg-green-500" 
                                      : perm === "canWrite" ? "bg-blue-500" 
                                      : "bg-red-500"
                                    : "bg-gray-300"
                                }`}
                                title={
                                  perm === "canRead" ? t("accessControl.read")
                                    : perm === "canWrite" ? t("accessControl.write")
                                    : t("accessControl.delete")
                                }
                              />
                            );
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>{t("accessControl.read")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>{t("accessControl.write")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>{t("accessControl.delete")}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // 사용자 할당 렌더링
  const renderUserAssignment = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("accessControl.userAssignment")}
        </h3>
      </div>

      {usersLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  현재 역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  부서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {usersData?.usersWithRoles?.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.roleInfo ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${user.roleInfo.color}`}>
                        {user.roleInfo.name}
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        미할당
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditUserModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // 변경 이력 렌더링 (기존 코드 유지)
  const renderChangeHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          권한 변경 이력
        </h3>
        <div className="flex space-x-2">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>필터</span>
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>내보내기</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          변경 이력 기능은 추후 구현 예정입니다.
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("accessControl.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("accessControl.description")}
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === "roles" && renderRoleManagement()}
        {activeTab === "matrix" && renderPermissionMatrix()}
        {activeTab === "users" && renderUserAssignment()}
        {activeTab === "history" && renderChangeHistory()}
      </div>

      {/* 역할 추가 모달 */}
      {showAddRoleModal && (
        <RoleModal
          title={t("accessControl.addNewRole")}
          onClose={() => setShowAddRoleModal(false)}
          onSave={handleCreateRole}
          modules={modules}
          colorOptions={colorOptions}
          t={t}
        />
      )}

      {/* 역할 편집 모달 */}
      {showEditRoleModal && selectedRole && (
        <RoleModal
          title={t("accessControl.editRole")}
          role={selectedRole}
          onClose={() => {
            setShowEditRoleModal(false);
            setSelectedRole(null);
          }}
          onSave={(data) => handleUpdateRole(selectedRole.id, data)}
          modules={modules}
          colorOptions={colorOptions}
          t={t}
        />
      )}

      {/* 사용자 역할 편집 모달 */}
      {showEditUserModal && selectedUser && (
        <UserRoleModal
          user={selectedUser}
          roles={rolesData?.roles || []}
          onClose={() => {
            setShowEditUserModal(false);
            setSelectedUser(null);
          }}
          onSave={(roleId) => handleUpdateUserRole(selectedUser.id, roleId)}
          t={t}
        />
      )}
    </div>
  );
}

// 역할 모달 컴포넌트
function RoleModal({ title, role, onClose, onSave, modules, colorOptions, t }) {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    englishName: role?.englishName || "",
    description: role?.description || "",
    color: role?.color || "bg-gray-500",
    permissions: role?.permissions?.reduce((acc, perm) => {
      acc[perm.module] = {
        canRead: perm.canRead,
        canWrite: perm.canWrite,
        canDelete: perm.canDelete,
        canApprove: perm.canApprove,
        canSystemConfig: perm.canSystemConfig,
      };
      return acc;
    }, {}) || {}
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const permissions = modules.map(module => ({
      module: module.key,
      canRead: formData.permissions[module.key]?.canRead || false,
      canWrite: formData.permissions[module.key]?.canWrite || false,
      canDelete: formData.permissions[module.key]?.canDelete || false,
      canApprove: formData.permissions[module.key]?.canApprove || false,
      canSystemConfig: formData.permissions[module.key]?.canSystemConfig || false,
    }));

    onSave({
      name: formData.name,
      englishName: formData.englishName,
      description: formData.description,
      color: formData.color,
      permissions
    });
  };

  const handlePermissionChange = (moduleKey, permission, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleKey]: {
          ...prev.permissions[moduleKey],
          [permission]: value
        }
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("accessControl.roleName")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("accessControl.englishName")}
              </label>
              <input
                type="text"
                value={formData.englishName}
                onChange={(e) => setFormData(prev => ({ ...prev, englishName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("accessControl.description")}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("accessControl.color")}
            </label>
            <div className="flex space-x-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded ${color.value} ${
                    formData.color === color.value ? "ring-2 ring-gray-400" : ""
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t("accessControl.permissions")}
            </label>
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {module.name}
                  </h4>
                  <div className="grid grid-cols-5 gap-4">
                    {["canRead", "canWrite", "canDelete", "canApprove", "canSystemConfig"].map((perm) => (
                      <label key={perm} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.permissions[module.key]?.[perm] || false}
                          onChange={(e) => handlePermissionChange(module.key, perm, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {perm === "canRead" ? t("accessControl.read")
                            : perm === "canWrite" ? t("accessControl.write")
                            : perm === "canDelete" ? t("accessControl.delete")
                            : perm === "canApprove" ? t("accessControl.approve")
                            : t("accessControl.systemConfig")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 사용자 역할 모달 컴포넌트
function UserRoleModal({ user, roles, onClose, onSave, t }) {
  const [selectedRoleId, setSelectedRoleId] = useState(user.roleInfo?.id || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRoleId) {
      onSave(selectedRoleId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("accessControl.editUser")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
```text
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              사용자
            </label>
            <div className="text-sm text-gray-900 dark:text-white">
              {user.name} ({user.email})
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              역할 선택
            </label>
            <select 
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700text-gray-900 dark:text-white"
              required
            >
              <option value="">역할을 선택하세요</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}