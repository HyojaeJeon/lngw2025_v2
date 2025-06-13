"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useLanguage.js";
import { useTheme } from "@/contexts/themeContext.js";
import {
  Settings,
  Upload,
  Save,
  RotateCcw,
  Palette,
  Globe,
  Clock,
  Type,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";

export default function GeneralSettingsPage() {
  const { t, language, changeLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    appName: "LN Partners CRM",
    companyName: "LN Partners",
    description: "통합 비즈니스 관리 시스템",
    logo: null,
    favicon: null,
    theme: theme,
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    font: "Inter",
    language: language,
    timezone: "Asia/Seoul",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24h",
    currency: "KRW",
    currencySymbol: "₩",
  });

  const [previewSettings, setPreviewSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const colorPresets = [
    { name: "기본 블루", primary: "#3B82F6", secondary: "#10B981" },
    { name: "보라색", primary: "#8B5CF6", secondary: "#EC4899" },
    { name: "초록색", primary: "#10B981", secondary: "#F59E0B" },
    { name: "빨간색", primary: "#EF4444", secondary: "#8B5CF6" },
    { name: "회색", primary: "#6B7280", secondary: "#374151" },
  ];

  const fonts = [
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Noto Sans KR", value: "Noto Sans KR" },
    { name: "Pretendard", value: "Pretendard" },
    { name: "Arial", value: "Arial" },
  ];

  const timezones = [
    { name: "서울 (UTC+9)", value: "Asia/Seoul" },
    { name: "도쿄 (UTC+9)", value: "Asia/Tokyo" },
    { name: "베이징 (UTC+8)", value: "Asia/Shanghai" },
    { name: "싱가포르 (UTC+8)", value: "Asia/Singapore" },
    { name: "UTC", value: "UTC" },
  ];

  const languages = [
    { name: "한국어", value: "ko", flag: "🇰🇷" },
    { name: "English", value: "en", flag: "🇺🇸" },
    { name: "Tiếng Việt", value: "vi", flag: "🇻🇳" },
  ];

  const handleSettingChange = (key, value) => {
    const newSettings = { ...previewSettings, [key]: value };
    setPreviewSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    setSettings(previewSettings);
    setHasChanges(false);
    // 실제 저장 로직 구현
    if (previewSettings.language !== language) {
      changeLanguage(previewSettings.language);
    }
  };

  const handleReset = () => {
    setPreviewSettings(settings);
    setHasChanges(false);
  };

  const handleFileUpload = (type, file) => {
    // 파일 업로드 로직
    const reader = new FileReader();
    reader.onload = (e) => {
      handleSettingChange(type, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("general.title")}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t("general.description")}
            </p>
          </div>
          <div className="flex space-x-2">
            {hasChanges && (
              <button
                onClick={handleReset}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>초기화</span>
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                hasChanges
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Save className="w-4 h-4" />
              <span>저장</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 설정 폼 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              기본 정보
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("general.appName")}
                </label>
                <input
                  type="text"
                  value={previewSettings.appName}
                  onChange={(e) =>
                    handleSettingChange("appName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  회사명
                </label>
                <input
                  type="text"
                  value={previewSettings.companyName}
                  onChange={(e) =>
                    handleSettingChange("companyName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  설명
                </label>
                <textarea
                  value={previewSettings.description}
                  onChange={(e) =>
                    handleSettingChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* 브랜딩 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              브랜딩
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("general.logo")}
                </label>
                <div className="flex items-center space-x-4">
                  {previewSettings.logo && (
                    <img
                      src={previewSettings.logo}
                      alt="Logo"
                      className="w-16 h-16 object-contain border border-gray-300 rounded"
                    />
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("logo", e.target.files[0])
                      }
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>로고 업로드</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      권장 크기: 200x60px, PNG/JPG
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  파비콘
                </label>
                <div className="flex items-center space-x-4">
                  {previewSettings.favicon && (
                    <img
                      src={previewSettings.favicon}
                      alt="Favicon"
                      className="w-8 h-8 object-contain border border-gray-300 rounded"
                    />
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("favicon", e.target.files[0])
                      }
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label
                      htmlFor="favicon-upload"
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>파비콘 업로드</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      권장 크기: 32x32px, ICO/PNG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 테마 설정 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>{t("general.theme")}</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  테마 모드
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: "light", icon: Sun, label: "라이트" },
                    { value: "dark", icon: Moon, label: "다크" },
                    { value: "system", icon: Monitor, label: "시스템" },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => handleSettingChange("theme", mode.value)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                        previewSettings.theme === mode.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <mode.icon className="w-4 h-4" />
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("general.themeColor")}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        handleSettingChange("primaryColor", preset.primary);
                        handleSettingChange("secondaryColor", preset.secondary);
                      }}
                      className={`p-3 rounded-lg border-2 ${
                        previewSettings.primaryColor === preset.primary
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                      title={preset.name}
                    >
                      <div className="flex space-x-1">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.primary }}
                        ></div>
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.secondary }}
                        ></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    주 색상
                  </label>
                  <input
                    type="color"
                    value={previewSettings.primaryColor}
                    onChange={(e) =>
                      handleSettingChange("primaryColor", e.target.value)
                    }
                    className="w-full h-10 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    보조 색상
                  </label>
                  <input
                    type="color"
                    value={previewSettings.secondaryColor}
                    onChange={(e) =>
                      handleSettingChange("secondaryColor", e.target.value)
                    }
                    className="w-full h-10 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("general.font")}
                </label>
                <select
                  value={previewSettings.font}
                  onChange={(e) => handleSettingChange("font", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {fonts.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 지역 설정 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>지역 및 언어 설정</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("general.locale")}
                </label>
                <select
                  value={previewSettings.language}
                  onChange={(e) =>
                    handleSettingChange("language", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("general.timezone")}
                </label>
                <select
                  value={previewSettings.timezone}
                  onChange={(e) =>
                    handleSettingChange("timezone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("general.dateFormat")}
                  </label>
                  <select
                    value={previewSettings.dateFormat}
                    onChange={(e) =>
                      handleSettingChange("dateFormat", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="YYYY-MM-DD">2024-12-07</option>
                    <option value="DD/MM/YYYY">07/12/2024</option>
                    <option value="MM/DD/YYYY">12/07/2024</option>
                    <option value="DD-MM-YYYY">07-12-2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    시간 형식
                  </label>
                  <select
                    value={previewSettings.timeFormat}
                    onChange={(e) =>
                      handleSettingChange("timeFormat", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="24h">24시간 (14:30)</option>
                    <option value="12h">12시간 (2:30 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    통화
                  </label>
                  <select
                    value={previewSettings.currency}
                    onChange={(e) =>
                      handleSettingChange("currency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="KRW">KRW (원)</option>
                    <option value="USD">USD (달러)</option>
                    <option value="VND">VND (동)</option>
                    <option value="EUR">EUR (유로)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    통화 기호
                  </label>
                  <input
                    type="text"
                    value={previewSettings.currencySymbol}
                    onChange={(e) =>
                      handleSettingChange("currencySymbol", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              미리보기
            </h3>
            <div
              className="border border-gray-300 rounded-lg p-4 space-y-3"
              style={{
                fontFamily: previewSettings.font,
                color: previewSettings.theme === "dark" ? "#fff" : "#000",
                backgroundColor:
                  previewSettings.theme === "dark" ? "#1f2937" : "#fff",
              }}
            >
              <div className="flex items-center space-x-2">
                {previewSettings.logo && (
                  <img
                    src={previewSettings.logo}
                    alt="Logo Preview"
                    className="h-8 object-contain"
                  />
                )}
                <h4 className="font-bold">{previewSettings.appName}</h4>
              </div>
              <p className="text-sm opacity-75">
                {previewSettings.description}
              </p>
              <div className="flex space-x-2">
                <button
                  style={{ backgroundColor: previewSettings.primaryColor }}
                  className="text-white px-3 py-1 rounded text-sm"
                >
                  주 버튼
                </button>
                <button
                  style={{ backgroundColor: previewSettings.secondaryColor }}
                  className="text-white px-3 py-1 rounded text-sm"
                >
                  보조 버튼
                </button>
              </div>
              <div className="text-sm space-y-1">
                <div>
                  언어:{" "}
                  {
                    languages.find((l) => l.value === previewSettings.language)
                      ?.name
                  }
                </div>
                <div>
                  시간대:{" "}
                  {
                    timezones.find((t) => t.value === previewSettings.timezone)
                      ?.name
                  }
                </div>
                <div>
                  날짜:{" "}
                  {new Date().toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
                <div>통화: {previewSettings.currencySymbol}1,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
