
"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/languageContext.js";
import {
  Workflow,
  FileText,
  GitBranch,
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  RotateCcw,
  Save,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function WorkflowsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("templates");
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showWorkflowDesigner, setShowWorkflowDesigner] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const [documentTemplates, setDocumentTemplates] = useState([
    {
      id: 1,
      name: "견적서 템플릿",
      type: "quote",
      category: "sales",
      version: "1.2",
      status: "active",
      lastModified: "2024-12-07 14:30",
      usage: 156,
    },
    {
      id: 2,
      name: "계약서 템플릿",
      type: "contract",
      category: "legal",
      version: "2.0",
      status: "active",
      lastModified: "2024-12-06 16:20",
      usage: 89,
    },
    {
      id: 3,
      name: "이메일 템플릿 - 환영",
      type: "email",
      category: "marketing",
      version: "1.0",
      status: "draft",
      lastModified: "2024-12-05 10:15",
      usage: 0,
    },
  ]);

  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "고객 승인 프로세스",
      description: "신규 고객 등록 시 승인 절차",
      status: "active",
      steps: [
        { id: 1, name: "영업팀 검토", assignee: "sales_team", order: 1 },
        { id: 2, name: "관리자 승인", assignee: "admin", order: 2 },
        { id: 3, name: "최종 승인", assignee: "manager", order: 3 },
      ],
      trigger: "customer_created",
      lastRun: "2024-12-07 13:45",
      totalRuns: 234,
      successRate: 95.7,
    },
    {
      id: 2,
      name: "구매 승인 워크플로우",
      description: "구매 요청 시 금액별 승인 단계",
      status: "active",
      steps: [
        { id: 1, name: "부서장 승인", assignee: "department_head", order: 1 },
        { id: 2, name: "재무팀 검토", assignee: "finance_team", order: 2 },
        { id: 3, name: "대표 승인", assignee: "ceo", order: 3 },
      ],
      trigger: "purchase_request",
      lastRun: "2024-12-07 11:20",
      totalRuns: 78,
      successRate: 89.2,
    },
  ]);

  const [templateVersions, setTemplateVersions] = useState([
    {
      id: 1,
      templateId: 1,
      version: "1.2",
      status: "current",
      createdAt: "2024-12-07 14:30",
      createdBy: "김관리자",
      changes: "헤더 디자인 개선, 계산 로직 수정",
    },
    {
      id: 2,
      templateId: 1,
      version: "1.1",
      status: "archived",
      createdAt: "2024-11-15 09:20",
      createdBy: "박매니저",
      changes: "세금 계산 로직 추가",
    },
    {
      id: 3,
      templateId: 1,
      version: "1.0",
      status: "archived",
      createdAt: "2024-10-01 16:45",
      createdBy: "이개발자",
      changes: "초기 템플릿 생성",
    },
  ]);

  const tabs = [
    { id: "templates", name: "문서 템플릿", icon: FileText },
    { id: "workflows", name: "승인 워크플로우", icon: Workflow },
    { id: "versions", name: "버전 관리", icon: GitBranch },
  ];

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          문서 템플릿 관리
        </h3>
        <div className="flex space-x-2">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>가져오기</span>
          </button>
          <button
            onClick={() => {
              setSelectedTemplate(null);
              setShowTemplateEditor(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>새 템플릿</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {documentTemplates.map((template) => (
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
                    v{template.version}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    template.status === 'active' 
                      ? "bg-green-100 text-green-800" 
                      : template.status === 'draft'
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {template.status === 'active' ? '활성' : template.status === 'draft' ? '초안' : '비활성'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">유형:</span>
                    <div className="mt-1">{template.type}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">카테고리:</span>
                    <div className="mt-1">{template.category}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">수정일:</span>
                    <div className="mt-1">{template.lastModified}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">사용 횟수:</span>
                    <div className="mt-1">{template.usage}회</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-green-500" title="미리보기">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700" title="복사">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700" title="다운로드">
                  <Download className="w-4 h-4" />
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      defaultValue={selectedTemplate?.type || ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="quote">견적서</option>
                      <option value="contract">계약서</option>
                      <option value="invoice">청구서</option>
                      <option value="email">이메일</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      카테고리
                    </label>
                    <select
                      defaultValue={selectedTemplate?.category || ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="sales">영업</option>
                      <option value="legal">법무</option>
                      <option value="marketing">마케팅</option>
                      <option value="finance">재무</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    템플릿 내용
                  </label>
                  <textarea
                    rows="12"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    placeholder="템플릿 내용을 입력하세요. 변수는 {{variable_name}} 형식으로 사용할 수 있습니다."
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">미리보기</h4>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 min-h-[400px]">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    템플릿 미리보기가 여기에 표시됩니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
              <button
                onClick={() => setShowTemplateEditor(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                초안으로 저장
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                배포
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderWorkflowsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          승인 워크플로우 관리
        </h3>
        <button
          onClick={() => {
            setSelectedWorkflow(null);
            setShowWorkflowDesigner(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>새 워크플로우</span>
        </button>
      </div>

      <div className="grid gap-6">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {workflow.name}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    workflow.status === 'active' 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {workflow.status === 'active' ? '활성' : '비활성'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {workflow.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-green-500" title="실행">
                  <Play className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedWorkflow(workflow);
                    setShowWorkflowDesigner(true);
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

            {/* 워크플로우 단계 */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                승인 단계:
              </h5>
              <div className="flex items-center space-x-2 overflow-x-auto">
                {workflow.steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                      <div className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        {step.order}. {step.name}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {step.assignee}
                      </div>
                    </div>
                    {index < workflow.steps.length - 1 && (
                      <div className="flex-shrink-0 text-gray-400">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">트리거:</span>
                <div className="mt-1">{workflow.trigger}</div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">마지막 실행:</span>
                <div className="mt-1">{workflow.lastRun}</div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">총 실행 횟수:</span>
                <div className="mt-1">{workflow.totalRuns}회</div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">성공률:</span>
                <div className="mt-1">{workflow.successRate}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 워크플로우 디자이너 모달 */}
      {showWorkflowDesigner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedWorkflow ? "워크플로우 편집" : "새 워크플로우"}
              </h3>
              <button
                onClick={() => setShowWorkflowDesigner(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    워크플로우 이름
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedWorkflow?.name || ""}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    트리거 이벤트
                  </label>
                  <select
                    defaultValue={selectedWorkflow?.trigger || ""}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="customer_created">고객 생성</option>
                    <option value="order_created">주문 생성</option>
                    <option value="purchase_request">구매 요청</option>
                    <option value="expense_report">경비 보고</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  설명
                </label>
                <textarea
                  rows="3"
                  defaultValue={selectedWorkflow?.description || ""}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              {/* 드래그 앤 드롭 승인 단계 디자이너 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  승인 단계 설계
                </h4>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 min-h-[200px]">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Workflow className="w-12 h-12 mx-auto mb-2" />
                      <p>단계를 드래그하여 워크플로우를 설계하세요</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
              <button
                onClick={() => setShowWorkflowDesigner(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                초안으로 저장
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                활성화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVersionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          템플릿 버전 관리
        </h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>모든 템플릿</option>
            <option>견적서 템플릿</option>
            <option>계약서 템플릿</option>
            <option>이메일 템플릿</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                템플릿
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                버전
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                생성자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                생성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {templateVersions.map((version) => {
              const template = documentTemplates.find(t => t.id === version.templateId);
              return (
                <tr key={version.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {template?.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {version.changes}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      v{version.version}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      version.status === 'current'
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {version.status === 'current' ? '현재' : '아카이브'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {version.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {version.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="미리보기">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="다운로드">
                        <Download className="w-4 h-4" />
                      </button>
                      {version.status !== 'current' && (
                        <button className="text-orange-600 hover:text-orange-900" title="복원">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
          {t("workflows.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("workflows.description")}
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
        {activeTab === "templates" && renderTemplatesTab()}
        {activeTab === "workflows" && renderWorkflowsTab()}
        {activeTab === "versions" && renderVersionsTab()}
      </div>
    </div>
  );
}
