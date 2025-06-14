"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useLanguage.js";
import { ChevronDown, ChevronRight, Menu, X, GripVertical } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";


const sidebarItems = [
  {
    name: "dashboard",
    href: "/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5l4-4 4 4"
        />
      </svg>
    ),
  },
  {
    name: "profile",
    href: "/dashboard/profile",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    name: "customers",
    href: "/dashboard/customers",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
    submenu: [
      { name: "customers.list", href: "/dashboard/customers" },
      { name: "customers.add", href: "/dashboard/customers/add" },
      { name: "customers.voc", href: "/dashboard/customers/voc" },
      { name: "customers.history", href: "/dashboard/customers/history" },
      { name: "customers.grades", href: "/dashboard/customers/grades" },
    ],
  },
  {
    name: "products",
    href: "/dashboard/products",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    submenu: [
      { name: "products.list", href: "/dashboard/products" },
      { name: "products.add", href: "/dashboard/products/add" },
      { name: "products.categories", href: "/dashboard/products/categories" },
      { name: "products.models", href: "/dashboard/products/models" },
      { name: "products.competitors", href: "/dashboard/products/competitors" },
      { name: "products.inventory", href: "/dashboard/products/inventory" },
    ],
  },
  {
    name: "sales",
    href: "/dashboard/sales",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    submenu: [
      { name: "sales.dashboard", href: "/dashboard/sales" },
      { name: "sales.opportunities", href: "/dashboard/sales/opportunities" },
      { name: "sales.pipeline", href: "/dashboard/sales/pipeline" },
      { name: "sales.quotes", href: "/dashboard/sales/quotes" },
      { name: "sales.activities", href: "/dashboard/sales/activities" },
      { name: "sales.kpi", href: "/dashboard/sales/kpi" },
    ],
  },
  {
    name: "revenue",
    href: "/dashboard/revenue",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
    submenu: [
      { name: "revenue.dashboard", href: "/dashboard/revenue" },
      { name: "revenue.record", href: "/dashboard/revenue/record" },
      { name: "revenue.quotes", href: "/dashboard/revenue/quotes" },
      { name: "revenue.orders", href: "/dashboard/revenue/orders" },
      { name: "revenue.payment", href: "/dashboard/revenue/payment" },
      { name: "revenue.statistics", href: "/dashboard/revenue/statistics" },
      { name: "revenue.goals", href: "/dashboard/revenue/goals" },
    ],
  },
  {
    name: "marketing",
    href: "/dashboard/marketing",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
    submenu: [
      // Phase 1: 대시보드 및 전략 수립 (Overview & Strategy)
      { name: "marketing.dashboard", href: "/dashboard/marketing" },
      {
        name: "marketing.brandStrategy",
        href: "/dashboard/marketing/brand-strategy",
      },
      {
        name: "marketing.marketAnalysis",
        href: "/dashboard/marketing/market-analysis",
      },
      {
        name: "marketing.planningProcess",
        href: "/dashboard/marketing/planning-process",
      },
      { name: "marketing.trends", href: "/dashboard/marketing/trends" },

      // Phase 2: 기획 및 준비 (Planning & Preparation)
      {
        name: "marketing.campaignCalendar",
        href: "/dashboard/marketing/campaign-calendar",
      },
      {
        name: "marketing.budgetExpense",
        href: "/dashboard/marketing/budget-expense",
      },
      {
        name: "marketing.influencerManagement",
        href: "/dashboard/marketing/influencer-management",
      },
      {
        name: "marketing.contentLibrary",
        href: "/dashboard/marketing/content-library",
      },

      // Phase 3: 실행 및 발행 (Execution & Publishing)
      { name: "marketing.content", href: "/dashboard/marketing/content" },
      { name: "marketing.abtest", href: "/dashboard/marketing/abtest" },

      // Phase 4: 성과 분석 및 소통 (Analysis & Engagement)
      { name: "marketing.monitoring", href: "/dashboard/marketing/monitoring" },
      { name: "marketing.engagement", href: "/dashboard/marketing/engagement" },
      { name: "marketing.insights", href: "/dashboard/marketing/insights" },

      // Phase 5: 시스템 관리 (System)
      { name: "marketing.settings", href: "/dashboard/marketing/settings" },
    ],
  },
  {
    name: "accounting",
    href: "/dashboard/accounting",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    submenu: [
      { name: "accounting.dashboard", href: "/dashboard/accounting" },
      { name: "accounting.voucher", href: "/dashboard/accounting/voucher" },
      { name: "accounting.ledger", href: "/dashboard/accounting/ledger" },
      {
        name: "accounting.statements",
        href: "/dashboard/accounting/statements",
      },
      { name: "accounting.assets", href: "/dashboard/accounting/assets" },
      { name: "accounting.tax", href: "/dashboard/accounting/tax" },
      { name: "accounting.budget", href: "/dashboard/accounting/budget" },
      { name: "accounting.reports", href: "/dashboard/accounting/reports" },
    ],
  },
  {
    name: "employees",
    href: "/dashboard/employees",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    submenu: [
      { name: "employees.dashboard", href: "/dashboard/employees" },
      { name: "employees.leave", href: "/dashboard/employees/leave" },
      { name: "employees.salary", href: "/dashboard/employees/salary" },
      { name: "employees.profile", href: "/dashboard/employees/profile" },
      { name: "employees.attendance", href: "/dashboard/employees/attendance" },
      { name: "employees.evaluation", href: "/dashboard/employees/evaluation" },
      {
        name: "employees.communication",
        href: "/dashboard/employees/communication",
      },
    ],
  },
  {
    name: "settings",
    href: "/dashboard/settings",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    submenu: [
      { name: "settings.dashboard", href: "/dashboard/settings" },
      { name: "settings.accessControl", href: "/dashboard/settings/access-control" },
      { name: "settings.general", href: "/dashboard/settings/general" },
      { name: "settings.profile", href: "/dashboard/settings/profile" },
      { name: "settings.notifications", href: "/dashboard/settings/notifications" },
      { name: "settings.integrations", href: "/dashboard/settings/integrations" },
      { name: "settings.workflows", href: "/dashboard/settings/workflows" },
      { name: "settings.dataManagement", href: "/dashboard/settings/data-management" },
      { name: "settings.auditLogs", href: "/dashboard/settings/audit-logs" },
      { name: "settings.billing", href: "/dashboard/settings/billing" },
    ],
  },
];

// 메뉴 데이터 (번역 키 기반)
const getMenuItems = (t) => [
  {
    name: t("navigation.dashboard"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5l4-4 4 4"
        />
      </svg>
    ),
    href: "/dashboard",
  },
  {
    name: t("navigation.customers"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
    href: "/dashboard/customers",
    submenu: [
      { name: t("customers.customerList"), href: "/dashboard/customers" },
      { name: t("customers.customerGrades"), href: "/dashboard/customers/grades" },
      { name: t("customers.customerHistory"), href: "/dashboard/customers/history" },
      { name: t("customers.customerVoc"), href: "/dashboard/customers/voc" },
    ],
  },
  {
    name: t("navigation.sales"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    href: "/dashboard/sales",
    submenu: [
      { name: t("sales.overview"), href: "/dashboard/sales" },
      { name: t("sales.opportunities"), href: "/dashboard/sales/opportunities" },
      { name: t("sales.pipeline"), href: "/dashboard/sales/pipeline" },
      { name: t("sales.quotes"), href: "/dashboard/sales/quotes" },
      { name: t("sales.activities"), href: "/dashboard/sales/activities" },
      { name: t("sales.kpi"), href: "/dashboard/sales/kpi" },
    ],
  },
  {
    name: t("navigation.marketing"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
    href: "/dashboard/marketing",
    submenu: [
      { name: t("marketing.overview"), href: "/dashboard/marketing" },
      { name: t("marketing.content"), href: "/dashboard/marketing/content" },
      { name: t("marketing.contentLibrary"), href: "/dashboard/marketing/content-library" },
      { name: t("marketing.planningProcess"), href: "/dashboard/marketing/planning-process" },
      { name: t("marketing.brandStrategy"), href: "/dashboard/marketing/brand-strategy" },
      { name: t("marketing.marketAnalysis"), href: "/dashboard/marketing/market-analysis" },
      { name: t("marketing.campaignCalendar"), href: "/dashboard/marketing/campaign-calendar" },
      { name: t("marketing.budgetExpense"), href: "/dashboard/marketing/budget-expense" },
      { name: t("marketing.trends"), href: "/dashboard/marketing/trends" },
      { name: t("marketing.insights"), href: "/dashboard/marketing/insights" },
      { name: t("marketing.abtest"), href: "/dashboard/marketing/abtest" },
      { name: t("marketing.engagement"), href: "/dashboard/marketing/engagement" },
      { name: t("marketing.influencerManagement"), href: "/dashboard/marketing/influencer-management" },
      { name: t("marketing.monitoring"), href: "/dashboard/marketing/monitoring" },
      { name: t("marketing.settings"), href: "/dashboard/marketing/settings" },
    ],
  },
  {
    name: t("navigation.products"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    href: "/dashboard/products",
    submenu: [
      { name: t("products.list"), href: "/dashboard/products" },
      { name: t("products.categories.title"), href: "/dashboard/products/categories" },
    ],
  },
  {
    name: t("navigation.employees"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    href: "/dashboard/employees",
    submenu: [
      { name: t("employees.overview"), href: "/dashboard/employees" },
      { name: t("employees.profile"), href: "/dashboard/employees/profile" },
      { name: t("employees.attendance"), href: "/dashboard/employees/attendance" },
      { name: t("employees.leave"), href: "/dashboard/employees/leave" },
      { name: t("employees.evaluation"), href: "/dashboard/employees/evaluation" },
      { name: t("employees.salary"), href: "/dashboard/employees/salary" },
      { name: t("employees.communication"), href: "/dashboard/employees/communication" },
    ],
  },
  {
    name: t("navigation.accounting"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    href: "/dashboard/accounting",
    submenu: [
      { name: t("accounting.overview"), href: "/dashboard/accounting" },
      { name: t("accounting.ledger"), href: "/dashboard/accounting/ledger" },
      { name: t("accounting.voucher"), href: "/dashboard/accounting/voucher" },
      { name: t("accounting.budget"), href: "/dashboard/accounting/budget" },
      { name: t("accounting.statements"), href: "/dashboard/accounting/statements" },
      { name: t("accounting.reports"), href: "/dashboard/accounting/reports" },
      { name: t("accounting.tax"), href: "/dashboard/accounting/tax" },
      { name: t("accounting.assets"), href: "/dashboard/accounting/assets" },
      { name: t("accounting.setup"), href: "/dashboard/accounting/setup" },
    ],
  },
  {
    name: t("navigation.revenue"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
    href: "/dashboard/revenue",
    submenu: [
      { name: t("revenue.overview"), href: "/dashboard/revenue" },
      { name: t("revenue.record"), href: "/dashboard/revenue/record" },
      { name: t("revenue.payment"), href: "/dashboard/revenue/payment" },
    ],
  },
  {
    name: t("navigation.settings"),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    href: "/dashboard/settings",
    submenu: [
      { name: t("settings.general.title"), href: "/dashboard/settings/general" },
      { name: t("settings.profileSettings.title"), href: "/dashboard/settings/profile" },
      { name: t("settings.accessControl.title"), href: "/dashboard/settings/access-control" },
      { name: t("settings.notifications.title"), href: "/dashboard/settings/notifications" },
      { name: t("settings.integrations.title"), href: "/dashboard/settings/integrations" },
      { name: t("settings.workflows.title"), href: "/dashboard/settings/workflows" },
      { name: t("settings.dataManagement.title"), href: "/dashboard/settings/data-management" },
      { name: t("settings.auditLogs.title"), href: "/dashboard/settings/audit-logs" },
      { name: t("settings.billing.title"), href: "/dashboard/settings/billing" },
    ],
  },
];

// 간단한 리사이즈 가능한 사이드바
export function ResizableSidebar({ children }) {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const pathname = usePathname();
  const { t, currentLanguage } = useTranslation();
  const activeMenuRef = useRef(null);
  const menuItems = getMenuItems(t); // t 함수를 사용하여 메뉴 항목 생성

  // 안전한 번역 함수
  const safeTranslate = useCallback((key) => {
    try {
      const result = t(key);
      return typeof result === 'string' ? result : key;
    } catch (error) {
      console.warn('Translation error for key:', key, error);
      return key;
    }
  }, [t]);

  const toggleSubmenu = (itemName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isActive = (href) => pathname === href;
  const hasActiveSubmenu = (submenu) =>
    submenu?.some((sub) => pathname === sub.href);

  const startResizing = (mouseDownEvent) => {
    setIsResizing(true);

    const startX = mouseDownEvent.clientX;
    const startWidth = sidebarWidth;

    const doDrag = (mouseMoveEvent) => {
      const newWidth = startWidth + mouseMoveEvent.clientX - startX;
      setSidebarWidth(Math.max(200, Math.min(500, newWidth)));
    };

    const stopDrag = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };


  // 활성 메뉴로 스크롤
  useEffect(() => {
    if (activeMenuRef.current) {
      activeMenuRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [pathname]);

  // 번역이 로드되지 않은 경우 로딩 상태 표시
  if (!currentLanguage) {
    return (
      <div className="flex min-h-screen w-full">
        <aside
          className="bg-white dark:bg-gray-800 shadow-lg relative h-screen flex flex-col"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Loading...
              </h1>
            </div>
          </div>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* 사이드바 */}
      <aside
        className="bg-white dark:bg-gray-800 shadow-lg relative h-screen flex flex-col"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          {/* 회사 로고 */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {safeTranslate("sidebar.companyName")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {safeTranslate("sidebar.subTitle")}
            </p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, categoryIndex) => {
              const itemIsActive = isActive(item.href);
              const submenuIsActive = hasActiveSubmenu(item.submenu);
              const isExpanded = expandedMenus[item.name] || submenuIsActive;

              return (
                <div key={`category-${categoryIndex}`}>
                  {/* Main Menu Item */}
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      ref={
                        itemIsActive || submenuIsActive ? activeMenuRef : null
                      }
                      className={`
                        flex items-center flex-1 px-4 py-3 text-sm font-medium rounded-lg
                        transition-all duration-300 ease-in-out group
                        transform hover:scale-105 hover:shadow-md
                        ${
                          itemIsActive || submenuIsActive
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      <span
                        className={`
                        mr-3 transition-transform duration-300 group-hover:rotate-12
                        ${itemIsActive || submenuIsActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}
                      `}
                      >
                        {item.icon}
                      </span>
                      <span className="transition-all duration-300 group-hover:translate-x-1">
                        {item.name}
                      </span>
                      {(itemIsActive || submenuIsActive) && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                      )}
                    </Link>

                    {/* Submenu Toggle */}
                    {item.submenu && (
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`
                          ml-2 p-2 rounded-md transition-all duration-300
                          ${
                            itemIsActive || submenuIsActive
                              ? "text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                              : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }
                        `}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                        ) : (
                          <ChevronRight className="w-4 h-4 transition-transform duration-300" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Submenu */}
                  {item.submenu && (
                    <div
                      className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
                    `}
                    >
                      <div className="ml-6 mt-2 space-y-1">
                        {item.submenu.map((subItem) => {
                          const subIsActive = isActive(subItem.href);
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`
                                block px-4 py-2 text-sm rounded-md transition-all duration-300
                                transform hover:scale-105 hover:translate-x-1
                                ${
                                  subIsActive
                                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }
                              `}
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>


      </div>
    </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// 모바일용 사이드바
export function Sidebar({ isOpen, onToggle }) {
  const [expandedMenus, setExpandedMenus] = useState({});
  const pathname = usePathname();
  const { t, currentLanguage } = useTranslation();
  const menuItems = getMenuItems(t); // t 함수를 사용하여 메뉴 항목 생성

  // 안전한 번역 함수
  const safeTranslate = useCallback((key) => {
    try {
      const result = t(key);
      return typeof result === 'string' ? result : key;
    } catch (error) {
      console.warn('Translation error for key:', key, error);
      return key;
    }
  }, [t]);

  const toggleSubmenu = (itemName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isActive = (href) => pathname === href;
  const hasActiveSubmenu = (submenu) =>
    submenu?.some((sub) => pathname === sub.href);

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg z-50
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 h-full flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {safeTranslate("sidebar.companyName")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {safeTranslate("sidebar.subTitle")}
              </p>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 네비게이션 */}
          <nav className="space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item, categoryIndex) => {
              const itemIsActive = isActive(item.href);
              const submenuIsActive = hasActiveSubmenu(item.submenu);
              const isExpanded = expandedMenus[item.name] || submenuIsActive;

              return (

                <div key={`category-${categoryIndex}`}>
                  {/* Main Menu Item */}
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={onToggle}
                      className={`
                        flex items-center flex-1 px-4 py-3 text-sm font-medium rounded-lg
                        transition-all duration-300 ease-in-out group
                        ${
                          itemIsActive || submenuIsActive
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      <span
                        className={`
                        mr-3 transition-transform duration-300
                        ${itemIsActive || submenuIsActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}
                      `}
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                      {(itemIsActive || submenuIsActive) && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      )}
                    </Link>

                    {/* Submenu Toggle */}
                    {item.submenu && (
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`
                          ml-2 p-2 rounded-md transition-all duration-300
                          ${
                            itemIsActive || submenuIsActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        `}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Submenu */}
                  {item.submenu && (
                    <div
                      className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
                    `}
                    >
                      <div className="ml-6 mt-2 space-y-1">
                        {item.submenu.map((subItem) => {
                          const subIsActive = isActive(subItem.href);
                          return (

                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={onToggle}
                              className={`
                                block px-4 py-2 text-sm rounded-md transition-all duration-300
                                ${
                                  subIsActive
                                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }
                              `}
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}