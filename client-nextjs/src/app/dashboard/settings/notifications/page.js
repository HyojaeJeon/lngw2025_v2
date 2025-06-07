
"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/languageContext.js";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  Send,
  Eye,
} from "lucide-react";

export default function NotificationSettingsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("channels");
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [channels, setChannels] = useState([
    {
      id: 1,
      type: "email",
      name: "이메일",
      endpoint: "admin@company.com",
      enabled: true,
      verified: true,
    },
    {
      id: 2,
      type: "sms",
      name: "SMS",
      endpoint: "010-1234-5678",
      enabled: true,
      verified: true,
    },
    {
      id: 3,
      type: "slack",
      name: "Slack",
      endpoint: "#admin-alerts",
      enabled: false,
      verified: false,
    },
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "로그인 알림",
      subject: "[{{app_name}}] 새로운 로그인 감지",
      content: "안녕하세요 {{user_name}}님,\n\n새로운 기기에서 로그인이 감지되었습니다.\n\n시간: {{login_time}}\nIP: {{ip_address}}\n기기: {{device_info}}",
      type: "email",
      category: "security",
    },
    {
      id: 2,
      name: "결재 요청",
      subject: "[{{app_name}}] 결재 요청이 있습니다",
      content: "{{requester_name}}님이 {{document_type}} 결재를 요청했습니다.\n\n제목: {{document_title}}\n금액: {{amount}}\n요청일: {{request_date}}",
      type: "email",
      category: "approval",
    },
  ]);

  const [eventSettings, setEventSettings] = useState([
    {
      event: "로그인",
      description: "새 기기에서 로그인할 때",
      channels: { email: true, sms: false, slack: false },
      immediate: true,
      schedule: null,
    },
    {
      event: "결재 요청",
      description: "새로운 결재 요청이 있을 때",
      channels: { email: true, sms: true, slack: true },
      immediate: false,
      schedule: "instant",
    },
    {
      event: "시스템 오류",
      description: "시스템 오류 발생 시",
      channels: { email: true, sms: true, slack: true },
      immediate: true,
      schedule: null,
    },
    {
      event: "데이터 백업",
      description: "데이터 백업 완료/실패 시",
      channels: { email: true, sms: false, slack: true },
      immediate: false,
      schedule: "daily",
    },
  ]);

  const tabs = [
    { id: "channels", name: "알림 채널", icon: MessageSquare },
    { id: "templates", name: "템플릿 관리", icon: Settings },
    { id: "events", name: "이벤트 설정", icon: Bell },
  ];

  const channelIcons = {
    email: Mail,
    sms: Smartphone,
    slack: MessageSquare,
    webhook: Settings,
  };

  const renderChannelsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          알림 채널 관리
        </h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>채널 추가</span>
        </button>
      </div>

      <div className="grid gap-4">
        {channels.map((channel) => {
          const IconComponent = channelIcons[channel.type];
          return (
            <div
              key={channel.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    channel.enabled ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {channel.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {channel.endpoint}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        channel.enabled 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {channel.enabled ? "활성" : "비활성"}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        channel.verified 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {channel.verified ? "인증됨" : "인증 필요"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!channel.verified && (
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                      인증
                    </button>
                  )}
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    테스트
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-500">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 새 채널 추가 폼 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          새 채널 추가
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              채널 유형
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>이메일</option>
              <option>SMS</option>
              <option>Slack</option>
              <option>Webhook</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              이름
            </label>
            <input
              type="text"
              placeholder="채널 이름"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              엔드포인트
            </label>
            <input
              type="text"
              placeholder="이메일 주소, 전화번호 등"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            추가
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          알림 템플릿 관리
        </h3>
        <button
          onClick={() => {
            setSelectedTemplate(null);
            setShowTemplateEditor(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>템플릿 추가</span>
        </button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {template.type}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  제목: {template.subject}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {template.content}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-green-500" title="미리보기">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-yellow-500" title="테스트 발송">
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplateEditor(true);
                  }}
                  className="p-2 text-gray-500 hover:text-blue-500"
                  title="편집"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-500" title="삭제">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 템플릿 에디터 모달 */}
      {showTemplateEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedTemplate ? "템플릿 편집" : "새 템플릿"}
              </h3>
              <button
                onClick={() => setShowTemplateEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  템플릿 이름
                </label>
                <input
                  type="text"
                  defaultValue={selectedTemplate?.name || ""}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    유형
                  </label>
                  <select
                    defaultValue={selectedTemplate?.type || "email"}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="email">이메일</option>
                    <option value="sms">SMS</option>
                    <option value="slack">Slack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    카테고리
                  </label>
                  <select
                    defaultValue={selectedTemplate?.category || "general"}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="security">보안</option>
                    <option value="approval">결재</option>
                    <option value="system">시스템</option>
                    <option value="general">일반</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  defaultValue={selectedTemplate?.subject || ""}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  내용
                </label>
                <textarea
                  rows="8"
                  defaultValue={selectedTemplate?.content || ""}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  사용 가능한 변수
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-200">
                  <div>{{`{{user_name}}`}} - 사용자 이름</div>
                  <div>{{`{{app_name}}`}} - 앱 이름</div>
                  <div>{{`{{date}}`}} - 현재 날짜</div>
                  <div>{{`{{time}}`}} - 현재 시간</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                onClick={() => setShowTemplateEditor(false)}
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
      )}
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          이벤트별 알림 설정
        </h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>설정 저장</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                이벤트
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                SMS
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Slack
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                발송 시점
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                설정
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {eventSettings.map((event, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.event}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {event.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={event.channels.email}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={event.channels.sms}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={event.channels.slack}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="instant">즉시</option>
                    <option value="hourly">매시간</option>
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    상세설정
                  </button>
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
          {t("notifications.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("notifications.description")}
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
        {activeTab === "channels" && renderChannelsTab()}
        {activeTab === "templates" && renderTemplatesTab()}
        {activeTab === "events" && renderEventsTab()}
      </div>
    </div>
  );
}
