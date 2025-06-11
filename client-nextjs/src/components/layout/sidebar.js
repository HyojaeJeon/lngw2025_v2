"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  BarChart3,
  Users,
  TrendingUp,
  Megaphone,
  Package,
  UserCheck,
  Calculator,
  DollarSign,
  Settings,
  Home,
} from "lucide-react";
import { useTranslation } from "../../hooks/useLanguage.js";

const menuItems = [
  {
    key: "dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    key: "customers",
    children: [
      { key: "customerList", path: "/dashboard/customers" },
      { key: "customerGrades", path: "/dashboard/customers/grades" },
      { key: "customerHistory", path: "/dashboard/customers/history" },
      { key: "customerVoc", path: "/dashboard/customers/voc" },
    ],
    icon: Users,
  },
  {
    key: "sales",
    children: [
      { key: "overview", path: "/dashboard/sales" },
      { key: "opportunities", path: "/dashboard/sales/opportunities" },
      { key: "pipeline", path: "/dashboard/sales/pipeline" },
      { key: "quotes", path: "/dashboard/sales/quotes" },
      { key: "activities", path: "/dashboard/sales/activities" },
      { key: "kpi", path: "/dashboard/sales/kpi" },
    ],
    icon: TrendingUp,
  },
  {
    key: "marketing",
    children: [
      { key: "overview", path: "/dashboard/marketing" },
      { key: "content", path: "/dashboard/marketing/content" },
      { key: "contentLibrary", path: "/dashboard/marketing/content-library" },
      {
        key: "planningProcess",
        path: "/dashboard/marketing/planning-process",
      },
      { key: "brandStrategy", path: "/dashboard/marketing/brand-strategy" },
      { key: "marketAnalysis", path: "/dashboard/marketing/market-analysis" },
      {
        key: "campaignCalendar",
        path: "/dashboard/marketing/campaign-calendar",
      },
      { key: "budgetExpense", path: "/dashboard/marketing/budget-expense" },
      { key: "trends", path: "/dashboard/marketing/trends" },
      { key: "insights", path: "/dashboard/marketing/insights" },
      { key: "abtest", path: "/dashboard/marketing/abtest" },
      { key: "engagement", path: "/dashboard/marketing/engagement" },
      {
        key: "influencerManagement",
        path: "/dashboard/marketing/influencer-management",
      },
      { key: "monitoring", path: "/dashboard/marketing/monitoring" },
      { key: "settings", path: "/dashboard/marketing/settings" },
    ],
    icon: Megaphone,
  },
  {
    key: "products",
    children: [
      { key: "list", path: "/dashboard/products" },
      { key: "categories", path: "/dashboard/products/categories" },
    ],
    icon: Package,
  },
  {
    key: "employees",
    children: [
      { key: "overview", path: "/dashboard/employees" },
      { key: "profile", path: "/dashboard/employees/profile" },
      { key: "attendance", path: "/dashboard/employees/attendance" },
      { key: "leave", path: "/dashboard/employees/leave" },
      { key: "evaluation", path: "/dashboard/employees/evaluation" },
      { key: "salary", path: "/dashboard/employees/salary" },
      { key: "communication", path: "/dashboard/employees/communication" },
    ],
    icon: UserCheck,
  },
  {
    key: "accounting",
    children: [
      { key: "overview", path: "/dashboard/accounting" },
      { key: "ledger", path: "/dashboard/accounting/ledger" },
      { key: "voucher", path: "/dashboard/accounting/voucher" },
      { key: "budget", path: "/dashboard/accounting/budget" },
      { key: "statements", path: "/dashboard/accounting/statements" },
      { key: "reports", path: "/dashboard/accounting/reports" },
      { key: "tax", path: "/dashboard/accounting/tax" },
      { key: "assets", path: "/dashboard/accounting/assets" },
      { key: "setup", path: "/dashboard/accounting/setup" },
    ],
    icon: Calculator,
  },
  {
    key: "revenue",
    children: [
      { key: "overview", path: "/dashboard/revenue" },
      { key: "record", path: "/dashboard/revenue/record" },
      { key: "payment", path: "/dashboard/revenue/payment" },
    ],
    icon: DollarSign,
  },
  {
    key: "settings",
    children: [
      { key: "general", path: "/dashboard/settings/general" },
      {
        key: "profileSettings",
        path: "/dashboard/settings/profile",
      },
      {
        key: "accessControl",
        path: "/dashboard/settings/access-control",
      },
      {
        key: "notifications",
        path: "/dashboard/settings/notifications",
      },
      {
        key: "integrations",
        path: "/dashboard/settings/integrations",
      },
      { key: "workflows", path: "/dashboard/settings/workflows" },
      {
        key: "dataManagement",
        path: "/dashboard/settings/data-management",
      },
      { key: "auditLogs", path: "/dashboard/settings/audit-logs" },
      { key: "billing", path: "/dashboard/settings/billing" },
    ],
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const newOpenMenus = {};
    menuItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) =>
          pathname.startsWith(child.path),
        );
        if (isChildActive) {
          newOpenMenus[item.key] = true;
        }
      }
    });
    setOpenMenus(newOpenMenus);
  }, [pathname]);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActiveItem = (item) => {
    if (item.path) {
      return pathname === item.path;
    }
    return false;
  };

  const isActiveParent = (item) => {
    if (item.children) {
      return item.children.some((child) => pathname.startsWith(child.path));
    }
    return false;
  };

  const getMenuItemText = (item) => {
    // 먼저 navigation 네임스페이스에서 찾기
    const navText = t(`navigation.${item.key}`);
    if (navText && navText !== `navigation.${item.key}`) {
      return navText;
    }

    // 각 모듈별 네임스페이스에서 찾기
    const moduleText = t(`${item.key}.title`);
    if (moduleText && moduleText !== `${item.key}.title`) {
      return moduleText;
    }

    // 직접 키로 찾기
    const directText = t(item.key);
    if (directText && directText !== item.key) {
      return directText;
    }

    return item.key;
  };

  const getChildMenuText = (parentKey, childKey) => {
    // navigation.childKey 형태로 먼저 찾기
    const navText = t(`navigation.${childKey}`);
    if (navText && navText !== `navigation.${childKey}`) {
      return navText;
    }

    // parentKey.childKey 형태로 찾기
    const parentText = t(`${parentKey}.${childKey}`);
    if (parentText && parentText !== `${parentKey}.${childKey}`) {
      return parentText;
    }

    // settings의 경우 특별 처리
    if (parentKey === 'settings') {
      const settingsText = t(`settings.${childKey}.title`);
      if (settingsText && settingsText !== `settings.${childKey}.title`) {
        return settingsText;
      }
    }

    // 직접 키로 찾기
    const directText = t(childKey);
    if (directText && directText !== childKey) {
      return directText;
    }

    return childKey;
  };

  const renderMenuItem = (item, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.key];
    const isActive = isActiveItem(item);
    const isParentActive = isActiveParent(item);

    return (
      <div key={item.key} className="mb-1">
        {hasChildren ? (
          <button
            onClick={() => toggleMenu(item.key)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 ${
              isParentActive
                ? "bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            <div className="flex items-center space-x-3">
              {Icon && <Icon className="w-4 h-4" />}
              <span className="font-medium">
                {getMenuItemText(item)}
              </span>
            </div>
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <Link
            href={item.path}
            onClick={onClose}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 ${
              isActive
                ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span className="font-medium">
              {getMenuItemText(item)}
            </span>
          </Link>
        )}

        {hasChildren && isOpen && (
          <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-600 pl-3">
            {item.children.map((child) => (
              <Link
                key={child.key}
                href={child.path}
                onClick={onClose}
                className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 ${
                  pathname.startsWith(child.path)
                    ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {getChildMenuText(item.key, child.key)}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 
                  transform transition-transform duration-300 ease-in-out overflow-hidden
                  ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                  lg:translate-x-0 lg:static lg:inset-0`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">
              {t("sidebar.companyName", "LN Partners 그룹웨어")}
            </h1>
            <p className="text-blue-100 text-xs">
              {t("sidebar.subTitle", "기업 관리 솔루션")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-blue-100 hover:text-white hover:bg-blue-800 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>
    </aside>
  );
}