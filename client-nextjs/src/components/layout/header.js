"use client";

import { useTheme } from "../../contexts/themeContext.js";
import { Button } from "../ui/button.js";
import { Globe, Moon, Sun, Menu, User, LogOut, Settings } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import { useState } from "react";
import Link from "next/link";
import LanguageSelector from "../ui/LanguageSelector.js";
import { useLanguage, useTranslation } from "../../hooks/useLanguage.js";

export default function Header({ onMenuToggle }) {
  const { currentLanguage, getNextLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const cycleLanguage = () => {
    const nextLang = getNextLanguage();
    changeLanguage(nextLang);
  };

  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <header
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 
                     transition-colors duration-300 sticky top-0 z-30 flex-shrink-0"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {t("navigation.dashboard")}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Selector - 리덕스 기반 컴포넌트로 교체 */}
          <LanguageSelector variant="compact" className="dark:bg-gray-800" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* User Profile */}
          {isAuthenticated && user && (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.department} {user.position && `• ${user.position}`}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {user.department}{" "}
                          {user.position && `• ${user.position}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      프로필 관리
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      {t("navigation.settings")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}