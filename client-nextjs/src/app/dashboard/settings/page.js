"use client";

import React from "react";
import { useTranslation } from "@/hooks/useLanguage.js";
import {
  Shield,
  Settings,
  User,
  Bell,
  Workflow,
  Database,
  FileText,
  CreditCard,
  Users,
  Key,
  Globe,
  Smartphone,
  Mail,
  Cloud,
  Archive,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function SettingsCenter() {
  const { t } = useTranslation();

  const settingsModules = [
    {
      name: "accessControl",
      title: t("accessControl.title"),
      description: t("accessControl.description"),
      href: "/dashboard/settings/access-control",
      icon: Shield,
      color: "bg-red-500",
      features: ["RBAC 설정", "권한 매트릭스", "역할 할당", "변경 이력"],
      requiredRole: "admin",
    },
    {
      name: "general",
      title: t("general.title"),
      description: t("general.description"),
      href: "/dashboard/settings/general",
      icon: Settings,
      color: "bg-blue-500",
      features: ["앱 이름/로고", "테마 설정", "타임존", "언어 설정"],
      requiredRole: "admin",
    },
    {
      name: "profile",
      title: t("profileSettings.title"),
      description: t("profileSettings.description"),
      href: "/dashboard/settings/profile",
      icon: User,
      color: "bg-green-500",
      features: ["비밀번호 변경", "2단계 인증", "개인정보", "보안 설정"],
      requiredRole: "editor",
    },
    {
      name: "notifications",
      title: t("notifications.title"),
      description: t("notifications.description"),
      href: "/dashboard/settings/notifications",
      icon: Bell,
      color: "bg-yellow-500",
      features: ["이메일/SMS", "푸시 알림", "템플릿 관리", "이벤트 설정"],
      requiredRole: "manager",
    },
    {
      name: "integrations",
      title: t("integrations.title"),
      description: t("integrations.description"),
      href: "/dashboard/settings/integrations",
      icon: Bell,
      color: "bg-purple-500",
      features: ["API 키 관리", "AI 모델 연동", "OAuth 설정", "Webhook"],
      requiredRole: "admin",
    },
    {
      name: "workflows",
      title: t("workflows.title"),
      description: t("workflows.description"),
      href: "/dashboard/settings/workflows",
      icon: Workflow,
      color: "bg-indigo-500",
      features: ["문서 템플릿", "승인 라인", "버전 관리", "배포"],
      requiredRole: "manager",
    },
    {
      name: "dataManagement",
      title: t("dataManagement.title"),
      description: t("dataManagement.description"),
      href: "/dashboard/settings/data-management",
      icon: Database,
      color: "bg-teal-500",
      features: ["대량 업로드", "데이터 검증", "백업 관리", "스케줄러"],
      requiredRole: "admin",
    },
    {
      name: "auditLogs",
      title: t("auditLogs.title"),
      description: t("auditLogs.description"),
      href: "/dashboard/settings/audit-logs",
      icon: FileText,
      color: "bg-gray-500",
      features: ["로그인 이력", "권한 변경", "CRUD 이력", "로그 내보내기"],
      requiredRole: "superAdmin",
    },
    {
      name: "billing",
      title: t("billing.title"),
      description: t("billing.description"),
      href: "/dashboard/settings/billing",
      icon: CreditCard,
      color: "bg-orange-500",
      features: ["과금 플랜", "사용량 관리", "라이선스", "만료 알림"],
      requiredRole: "admin",
    },
  ];

  const quickActions = [
    {
      name: "사용자 관리",
      description: "새 사용자 추가 및 역할 할당",
      icon: Users,
      action: "새 사용자 추가",
      href: "/dashboard/settings/access-control",
    },
    {
      name: "API 키 생성",
      description: "외부 연동을 위한 API 키 발급",
      icon: Key,
      action: "API 키 생성",
      href: "/dashboard/settings/integrations",
    },
    {
      name: "백업 실행",
      description: "즉시 데이터 백업 실행",
      icon: Archive,
      action: "백업 시작",
      href: "/dashboard/settings/data-management",
    },
    {
      name: "시스템 상태",
      description: "시스템 상태 및 성능 모니터링",
      icon: Activity,
      action: "상태 확인",
      href: "/dashboard/settings/audit-logs",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("settings.dashboard")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          시스템의 모든 설정을 한 곳에서 관리하세요
        </p>
      </div>

      {/* 빠른 작업 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <action.icon className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  {action.action} →
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 설정 모듈 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsModules.map((module) => (
          <Link
            key={module.name}
            href={module.href}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group"
          >
            <div className="p-6">
              {/* 아이콘과 제목 */}
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`p-3 rounded-lg ${module.color} text-white group-hover:scale-110 transition-transform`}
                >
                  <module.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {module.title}
                  </h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                    {module.requiredRole === "superAdmin"
                      ? "슈퍼어드민만"
                      : module.requiredRole === "admin"
                        ? "어드민 이상"
                        : module.requiredRole === "manager"
                          ? "매니저 이상"
                          : "모든 사용자"}
                  </span>
                </div>
              </div>

              {/* 설명 */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {module.description}
              </p>

              {/* 주요 기능 */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  주요 기능:
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {module.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 화살표 */}
              <div className="mt-4 flex justify-end">
                <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 시스템 정보 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          시스템 정보
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">1.2.0</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              시스템 버전
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">정상</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              시스템 상태
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">2024-12-07</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              마지막 백업
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
