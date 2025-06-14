
'use client'

import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import { useTranslation } from '@/hooks/useLanguage'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function UserProfile() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setIsOpen(false)
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 사용자 프로필 버튼 - 헤더용으로 간소화 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
      >
        {/* 아바타 */}
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            user.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>

        {/* 화살표 아이콘 */}
        <ChevronDown 
          className={`w-4 h-4 ml-1 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* 사용자 정보 헤더 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {user.name || t('common.unknown') || '알 수 없음'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {user.email}
                </div>
                {(user.department || user.position) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.department && user.position 
                      ? `${user.department} • ${user.position}`
                      : user.department || user.position || t('common.noPosition') || '직책 없음'
                    }
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 메뉴 아이템들 */}
          <div className="py-2">
            {/* 프로필 설정 */}
            <Link
              href="/dashboard/settings/profile"
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-3 text-gray-500" />
              {t('profile.settings') || '프로필 설정'}
            </Link>

            {/* 계정 설정 */}
            <Link
              href="/dashboard/settings/general"
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3 text-gray-500" />
              {t('settings.general') || '계정 설정'}
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {t('auth.logout') || '로그아웃'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import { useTranslation } from "../../hooks/useLanguage.js";

export default function UserProfile() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
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
      </button>

      {showDropdown && (
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
              </div>
            </div>
          </div>

          <div className="py-2">
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <User className="w-4 h-4 mr-3" />
              프로필 관리
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(false)}
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
  );
}
