"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useLanguage.js";
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
} from "lucide-react";

export default function AccessControlPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("roles");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 권한 레벨 정의 (첨부 이미지 기준)
  const roles = [
    {
      id: 1,
      name: "슈퍼어드민",
      englishName: "Super Admin",
      description: "모든 기능 허용",
      userCount: 2,
      permissions: {
        read: true,
        write: true,
        delete: true,
        approve: true,
        systemConfig: true,
      },
      color: "bg-red-500",
    },
    {
      id: 2,
      name: "어드민",
      englishName: "Admin",
      description: "대부분 기능 허용",
      userCount: 5,
      permissions: {
        read: true,
        write: true,
        delete: true,
        approve: true,
        systemConfig: false,
      },
      color: "bg-orange-500",
    },
    {
      id: 3,
      name: "매니저",
      englishName: "Manager",
      description: "팀 단위 기능",
      userCount: 12,
      permissions: {
        read: true,
        write: true,
        delete: false,
        approve: false,
        systemConfig: false,
      },
      color: "bg-blue-500",
    },
    {
      id: 4,
      name: "에디터",
      englishName: "Editor",
      description: "CRUD (비즈니스 데이터)",
      userCount: 25,
      permissions: {
        read: true,
        write: true,
        delete: false,
        approve: false,
        systemConfig: false,
      },
      color: "bg-green-500",
    },
    {
      id: 5,
      name: "게스트",
      englishName: "Guest",
      description: "조회 전용 (비민감)",
      userCount: 8,
      permissions: {
        read: true,
        write: false,
        delete: false,
        approve: false,
        systemConfig: false,
      },
      color: "bg-gray-500",
    },
  ];

  // 모듈별 권한 매트릭스
  const modules = [
    "고객 관리",
    "제품 관리",
    "영업 관리",
    "매출 관리",
    "마케팅 관리",
    "회계 관리",
    "직원 관리",
    "시스템 설정",
  ];

  const permissionMatrix = {
    "고객 관리": {
      슈퍼어드민: { read: true, write: true, delete: true },
      어드민: { read: true, write: true, delete: true },
      매니저: { read: true, write: true, delete: false },
      에디터: { read: true, write: true, delete: false },
      게스트: { read: true, write: false, delete: false },
    },
    "제품 관리": {
      슈퍼어드민: { read: true, write: true, delete: true },
      어드민: { read: true, write: true, delete: true },
      매니저: { read: true, write: true, delete: false },
      에디터: { read: true, write: true, delete: false },
      게스트: { read: true, write: false, delete: false },
    },
    "시스템 설정": {
      슈퍼어드민: { read: true, write: true, delete: true },
      어드민: { read: true, write: true, delete: false },
      매니저: { read: false, write: false, delete: false },
      에디터: { read: false, write: false, delete: false },
      게스트: { read: false, write: false, delete: false },
    },
  };

  // 사용자 목록
  const users = [
    {
      id: 1,
      name: "김관리자",
      email: "admin@company.com",
      role: "슈퍼어드민",
      department: "IT팀",
      lastLogin: "2024-12-07 14:30",
      status: "active",
    },
    {
      id: 2,
      name: "박매니저",
      email: "manager@company.com",
      role: "매니저",
      department: "영업팀",
      lastLogin: "2024-12-07 13:45",
      status: "active",
    },
    {
      id: 3,
      name: "이에디터",
      email: "editor@company.com",
      role: "에디터",
      department: "마케팅팀",
      lastLogin: "2024-12-06 16:20",
      status: "inactive",
    },
  ];

  // 권한 변경 이력
  const changeHistory = [
    {
      id: 1,
      user: "김관리자",
      action: "권한 변경",
      details: "박매니저 역할을 매니저에서 어드민으로 변경",
      timestamp: "2024-12-07 10:30:00",
      ipAddress: "192.168.1.100",
    },
    {
      id: 2,
      user: "시스템",
      action: "자동 권한 해제",
      details: "이에디터 90일 미접속으로 권한 일시정지",
      timestamp: "2024-12-06 09:00:00",
      ipAddress: "System",
    },
  ];

  const tabs = [
    { id: "roles", name: "역할 관리", icon: Shield },
    { id: "matrix", name: "권한 매트릭스", icon: Settings },
    { id: "users", name: "사용자 할당", icon: Users },
    { id: "history", name: "변경 이력", icon: History },
  ];

  const renderRoleManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          역할별 권한 설정
        </h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>새 역할 추가</span>
        </button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
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
                <button className="p-2 text-gray-500 hover:text-blue-500">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-4">
              {Object.entries(role.permissions).map(([perm, allowed]) => (
                <div key={perm} className="flex items-center space-x-2">
                  {allowed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {perm === "read"
                      ? "읽기"
                      : perm === "write"
                        ? "쓰기"
                        : perm === "delete"
                          ? "삭제"
                          : perm === "approve"
                            ? "승인"
                            : "시스템설정"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPermissionMatrix = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          모듈별 권한 매트릭스
        </h3>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>변경사항 저장</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  모듈
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <div className={`w-2 h-2 rounded ${role.color}`}></div>
                      <span>{role.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(permissionMatrix).map(([module, permissions]) => (
                <tr key={module}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {module}
                  </td>
                  {roles.map((role) => (
                    <td key={role.id} className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-1">
                        {permissions[role.name] ? (
                          <>
                            <div
                              className={`w-3 h-3 rounded ${
                                permissions[role.name].read
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                              title="읽기"
                            ></div>
                            <div
                              className={`w-3 h-3 rounded ${
                                permissions[role.name].write
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                              title="쓰기"
                            ></div>
                            <div
                              className={`w-3 h-3 rounded ${
                                permissions[role.name].delete
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                              }`}
                              title="삭제"
                            ></div>
                          </>
                        ) : (
                          <div className="text-gray-400">-</div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>읽기</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>쓰기</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>삭제</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserAssignment = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          사용자별 역할 할당
        </h3>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>사용자 추가</span>
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>내보내기</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="사용자 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option>모든 역할</option>
          {roles.map((role) => (
            <option key={role.id}>{role.name}</option>
          ))}
        </select>
      </div>

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
                마지막 로그인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
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
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "슈퍼어드민"
                        ? "bg-red-100 text-red-800"
                        : user.role === "어드민"
                          ? "bg-orange-100 text-orange-800"
                          : user.role === "매니저"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "에디터"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? "활성" : "비활성"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                실행자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                작업
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                상세 내용
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                IP 주소
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {changeHistory.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {log.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {log.details}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* 사용자 편집 모달 */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                사용자 역할 편집
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  사용자
                </label>
                <div className="text-sm text-gray-900 dark:text-white">
                  {selectedUser.name} ({selectedUser.email})
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  현재 역할
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {roles.map((role) => (
                    <option
                      key={role.id}
                      selected={role.name === selectedUser.role}
                    >
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
