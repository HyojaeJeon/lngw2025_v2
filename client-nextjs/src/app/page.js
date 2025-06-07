"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/languageContext.js";
import { useTheme } from "@/contexts/themeContext.js";
import { getToken } from "@/lib/auth.js";
import { Globe, Sun, Moon } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { t, language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // useEffect(() => {
  //   // Redux store와 localStorage 모두 확인
  //   const token = getToken();
  //   setIsRedirecting(true);

  //   setTimeout(() => {
  //     if (token) {
  //       router.push('/dashboard');
  //     } else {
  //       router.push('/login');
  //     }
  //   }, 1500);
  // }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LN</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              LN Partners
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-8 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
              </select>
              <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex flex-col items-center justify-center text-center p-8"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
            <span className="text-white font-bold text-2xl">LN</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {t("app.title")}
          </h1>
          {isRedirecting && (
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t("app.redirecting")}
            </p>
          )}
        </div>

        {isRedirecting && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}
