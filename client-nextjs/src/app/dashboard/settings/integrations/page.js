"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useLanguage.js";
import {
  Link,
  Key,
  Cloud,
  Webhook,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  TestTube,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("api");
  const [showApiModal, setShowApiModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showSecrets, setShowSecrets] = useState({});

  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "OpenAI GPT-4",
      service: "OpenAI",
      key: "sk-proj-****************************",
      status: "active",
      lastUsed: "2024-12-07 14:30",
      usage: "1,234 / 10,000",
    },
    {
      id: 2,
      name: "Google Gemini",
      service: "Google",
      key: "AIza****************************",
      status: "active",
      lastUsed: "2024-12-07 12:15",
      usage: "567 / 5,000",
    },
    {
      id: 3,
      name: "Slack Bot Token",
      service: "Slack",
      key: "xoxb-****************************",
      status: "inactive",
      lastUsed: "2024-12-05 09:20",
      usage: "0 / ∞",
    },
  ]);

  const [aiModels, setAiModels] = useState([
    {
      id: 1,
      provider: "OpenAI",
      model: "gpt-4",
      enabled: true,
      endpoint: "https://api.openai.com/v1/chat/completions",
      maxTokens: 4096,
      temperature: 0.7,
    },
    {
      id: 2,
      provider: "Google",
      model: "gemini-pro",
      enabled: true,
      endpoint:
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro",
      maxTokens: 2048,
      temperature: 0.9,
    },
    {
      id: 3,
      provider: "Anthropic",
      model: "claude-3",
      enabled: false,
      endpoint: "https://api.anthropic.com/v1/messages",
      maxTokens: 4096,
      temperature: 0.8,
    },
  ]);

  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: "고객 생성 알림",
      url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
      events: ["customer.created", "customer.updated"],
      status: "active",
      lastTriggered: "2024-12-07 13:45",
      success: 98.5,
    },
    {
      id: 2,
      name: "주문 완료 처리",
      url: "https://api.example.com/webhooks/order-completed",
      events: ["order.completed", "payment.received"],
      status: "active",
      lastTriggered: "2024-12-07 14:20",
      success: 99.2,
    },
  ]);

  const [oauthClients, setOauthClients] = useState([
    {
      id: 1,
      name: "Google OAuth",
      clientId: "123456789-abcdefghijklmnop.apps.googleusercontent.com",
      service: "Google",
      scopes: ["profile", "email"],
      status: "active",
    },
    {
      id: 2,
      name: "Microsoft OAuth",
      clientId: "12345678-1234-1234-1234-123456789012",
      service: "Microsoft",
      scopes: ["User.Read", "Mail.Read"],
      status: "inactive",
    },
  ]);

  const tabs = [
    { id: "api", name: "API 키 관리", icon: Key },
    { id: "ai", name: "AI 모델 연동", icon: Cloud },
    { id: "oauth", name: "OAuth 설정", icon: Link },
    { id: "webhooks", name: "Webhook 관리", icon: Webhook },
  ];

  const toggleSecretVisibility = (id) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderApiKeysTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          API 키 관리
        </h3>
        <button
          onClick={() => setShowApiModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>API 키 추가</span>
        </button>
      </div>

      <div className="grid gap-4">
        {apiKeys.map((api) => (
          <div
            key={api.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {api.name}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      api.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {api.status === "active" ? "활성" : "비활성"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      API 키:
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {showSecrets[api.id]
                          ? api.key.replace(/\*/g, "X")
                          : api.key}
                      </code>
                      <button
                        onClick={() => toggleSecretVisibility(api.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets[api.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      마지막 사용:
                    </span>
                    <div className="mt-1">{api.lastUsed}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      사용량:
                    </span>
                    <div className="mt-1">{api.usage}</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-gray-500 hover:text-green-500"
                  title="테스트"
                >
                  <TestTube className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-blue-500"
                  title="편집"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API 키 추가 모달 */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                API 키 추가
              </h3>
              <button
                onClick={() => setShowApiModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  서비스
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>OpenAI</option>
                  <option>Google</option>
                  <option>Anthropic</option>
                  <option>Slack</option>
                  <option>기타</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  placeholder="API 키 이름"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API 키
                </label>
                <input
                  type="password"
                  placeholder="API 키를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAiModelsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI 모델 연동 관리
        </h3>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>설정 저장</span>
        </button>
      </div>

      <div className="grid gap-6">
        {aiModels.map((model) => (
          <div
            key={model.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {model.provider} - {model.model}
                </h4>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    model.enabled ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      model.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <button
                className="p-2 text-gray-500 hover:text-green-500"
                title="연결 테스트"
              >
                <TestTube className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  엔드포인트
                </label>
                <input
                  type="text"
                  defaultValue={model.endpoint}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  최대 토큰
                </label>
                <input
                  type="number"
                  defaultValue={model.maxTokens}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Temperature
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  defaultValue={model.temperature}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOAuthTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          OAuth 클라이언트 설정
        </h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>OAuth 클라이언트 추가</span>
        </button>
      </div>

      <div className="grid gap-4">
        {oauthClients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {client.name}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      client.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {client.status === "active" ? "활성" : "비활성"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      클라이언트 ID:
                    </span>
                    <div className="mt-1">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs break-all">
                        {client.clientId}
                      </code>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      권한 범위:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {client.scopes.map((scope, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-gray-500 hover:text-blue-500"
                  title="편집"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWebhooksTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Webhook 관리
        </h3>
        <button
          onClick={() => setShowWebhookModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Webhook 추가</span>
        </button>
      </div>

      <div className="grid gap-4">
        {webhooks.map((webhook) => (
          <div
            key={webhook.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {webhook.name}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      webhook.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {webhook.status === "active" ? "활성" : "비활성"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      URL:
                    </span>
                    <div className="mt-1">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs break-all">
                        {webhook.url}
                      </code>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      이벤트:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {webhook.events.map((event, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      성공률:
                    </span>
                    <div className="mt-1">{webhook.success}%</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-gray-500 hover:text-green-500"
                  title="테스트"
                >
                  <TestTube className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-blue-500"
                  title="편집"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook 추가 모달 */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Webhook 추가
              </h3>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  placeholder="Webhook 이름"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  콜백 URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/webhook"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이벤트 선택
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {[
                    "customer.created",
                    "customer.updated",
                    "customer.deleted",
                    "order.created",
                    "order.completed",
                    "payment.received",
                    "user.login",
                    "user.logout",
                    "system.error",
                  ].map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
              <button
                onClick={() => setShowWebhookModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("integrations.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("integrations.description")}
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
        {activeTab === "api" && renderApiKeysTab()}
        {activeTab === "ai" && renderAiModelsTab()}
        {activeTab === "oauth" && renderOAuthTab()}
        {activeTab === "webhooks" && renderWebhooksTab()}
      </div>
    </div>
  );
}
