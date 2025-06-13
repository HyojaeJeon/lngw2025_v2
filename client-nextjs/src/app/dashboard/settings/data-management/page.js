"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useLanguage.js";
import {
  Database,
  Upload,
  Download,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Settings,
  Calendar,
  Shield,
  Copy,
  Play,
  Pause,
  Eye,
} from "lucide-react";

export default function DataManagementPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("backup");
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [backupHistory, setBackupHistory] = useState([
    {
      id: 1,
      date: "2024-12-07 02:00:00",
      type: "scheduled",
      status: "completed",
      size: "2.3GB",
      duration: "15분 32초",
      description: "일일 자동 백업",
    },
    {
      id: 2,
      date: "2024-12-06 02:00:00",
      type: "scheduled",
      status: "completed",
      size: "2.2GB",
      duration: "14분 45초",
      description: "일일 자동 백업",
    },
    {
      id: 3,
      date: "2024-12-05 14:30:00",
      type: "manual",
      status: "completed",
      size: "2.1GB",
      duration: "12분 18초",
      description: "시스템 업데이트 전 수동 백업",
    },
    {
      id: 4,
      date: "2024-12-05 02:00:00",
      type: "scheduled",
      status: "failed",
      size: "-",
      duration: "-",
      description: "디스크 공간 부족으로 실패",
    },
  ]);

  const [importJobs, setImportJobs] = useState([
    {
      id: 1,
      filename: "customers_2024.csv",
      type: "customers",
      status: "completed",
      startTime: "2024-12-07 10:30:00",
      endTime: "2024-12-07 10:45:00",
      totalRows: 1250,
      successRows: 1247,
      errorRows: 3,
      errorLog: "3건의 중복 데이터 발견",
    },
    {
      id: 2,
      filename: "products_batch1.xlsx",
      type: "products",
      status: "processing",
      startTime: "2024-12-07 15:20:00",
      endTime: null,
      totalRows: 500,
      successRows: 350,
      errorRows: 0,
      errorLog: null,
    },
    {
      id: 3,
      filename: "users_migration.csv",
      type: "users",
      status: "failed",
      startTime: "2024-12-06 16:00:00",
      endTime: "2024-12-06 16:05:00",
      totalRows: 200,
      successRows: 0,
      errorRows: 200,
      errorLog: "잘못된 파일 형식",
    },
  ]);

  const [exportJobs, setExportJobs] = useState([
    {
      id: 1,
      name: "고객 데이터 전체",
      type: "customers",
      format: "csv",
      status: "completed",
      createdAt: "2024-12-07 14:15:00",
      expiresAt: "2024-12-14 14:15:00",
      fileSize: "5.2MB",
      downloadUrl: "/exports/customers_20241207.csv",
    },
    {
      id: 2,
      name: "영업 기회 리포트",
      type: "sales",
      format: "xlsx",
      status: "processing",
      createdAt: "2024-12-07 15:30:00",
      expiresAt: null,
      fileSize: null,
      downloadUrl: null,
    },
  ]);

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupTime: "02:00",
    retentionDays: 30,
    compression: true,
    includeFiles: true,
    includeDatabase: true,
    cloudBackup: false,
    cloudProvider: "aws",
  });

  const tabs = [
    { id: "backup", name: "백업 관리", icon: Database },
    { id: "import", name: "데이터 가져오기", icon: Upload },
    { id: "export", name: "데이터 내보내기", icon: Download },
    { id: "cleanup", name: "데이터 정리", icon: Trash2 },
    { id: "settings", name: "설정", icon: Settings },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "완료";
      case "failed":
        return "실패";
      case "processing":
        return "진행중";
      default:
        return "대기중";
    }
  };

  const handleManualBackup = () => {
    setIsBackupRunning(true);
    // 실제 백업 로직
    setTimeout(() => {
      setIsBackupRunning(false);
      // 백업 히스토리에 새 항목 추가
    }, 5000);
  };

  const renderBackupTab = () => (
    <div className="space-y-6">
      {/* 백업 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                마지막 백업
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                2024-12-07 02:00
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                백업 크기
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                2.3GB
              </p>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                다음 백업
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                2024-12-08 02:00
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* 백업 액션 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            백업 작업
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleManualBackup}
              disabled={isBackupRunning}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                isBackupRunning
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isBackupRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isBackupRunning ? "백업 진행중..." : "즉시 백업"}</span>
            </button>
          </div>
        </div>

        {isBackupRunning && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-blue-800 dark:text-blue-200">
                백업이 진행중입니다. 잠시만 기다려주세요...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 백업 히스토리 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          백업 히스토리
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  크기
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  소요시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {backupHistory.map((backup) => (
                <tr key={backup.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {backup.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        backup.type === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {backup.type === "scheduled" ? "자동" : "수동"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(backup.status)}
                      <span className="text-sm text-gray-900 dark:text-white">
                        {getStatusText(backup.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {backup.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {backup.status === "completed" && (
                        <>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="다운로드"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="복원"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderImportTab = () => (
    <div className="space-y-6">
      {/* 파일 업로드 영역 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            데이터 가져오기
          </h3>
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            파일 업로드
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            CSV, Excel 파일을 드래그하여 업로드하거나 클릭하여 선택하세요
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            지원 형식: .csv, .xlsx, .xls (최대 50MB)
          </p>
        </div>
      </div>

      {/* 가져오기 작업 목록 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          가져오기 작업 현황
        </h3>
        <div className="space-y-4">
          {importJobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {job.filename}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.type} • {job.startTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(job.status)}
                  <span className="text-sm text-gray-900 dark:text-white">
                    {getStatusText(job.status)}
                  </span>
                </div>
              </div>

              {job.status === "processing" && (
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      진행률
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {job.successRows} / {job.totalRows}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(job.successRows / job.totalRows) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    전체 행:
                  </span>
                  <span className="ml-1 text-gray-900 dark:text-white">
                    {job.totalRows}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    성공:
                  </span>
                  <span className="ml-1 text-green-600">{job.successRows}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    오류:
                  </span>
                  <span className="ml-1 text-red-600">{job.errorRows}</span>
                </div>
              </div>

              {job.errorLog && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
                  {job.errorLog}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 파일 업로드 모달 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                데이터 가져오기
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  데이터 유형
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="customers">고객 데이터</option>
                  <option value="products">제품 데이터</option>
                  <option value="users">사용자 데이터</option>
                  <option value="sales">영업 데이터</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  파일 선택
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  첫 번째 행을 헤더로 사용
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  중복 데이터 건너뛰기
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                업로드 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderExportTab = () => (
    <div className="space-y-6">
      {/* 내보내기 작업 생성 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          새 내보내기 작업
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              데이터 유형
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="customers">고객 데이터</option>
              <option value="products">제품 데이터</option>
              <option value="sales">영업 데이터</option>
              <option value="users">사용자 데이터</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              파일 형식
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="csv">CSV</option>
              <option value="xlsx">Excel</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              날짜 범위
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="all">전체</option>
              <option value="today">오늘</option>
              <option value="week">지난 7일</option>
              <option value="month">지난 30일</option>
              <option value="custom">사용자 정의</option>
            </select>
          </div>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          내보내기 시작
        </button>
      </div>

      {/* 내보내기 작업 목록 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          내보내기 작업 현황
        </h3>
        <div className="space-y-4">
          {exportJobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {job.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.format.toUpperCase()} • {job.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(job.status)}
                    <span className="text-sm text-gray-900 dark:text-white">
                      {getStatusText(job.status)}
                    </span>
                  </div>
                  {job.status === "completed" && (
                    <div className="flex space-x-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                        다운로드
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {job.status === "completed" && (
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      파일 크기:
                    </span>
                    <span className="ml-1 text-gray-900 dark:text-white">
                      {job.fileSize}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      만료일:
                    </span>
                    <span className="ml-1 text-gray-900 dark:text-white">
                      {job.expiresAt}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCleanupTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800 dark:text-yellow-200">
            데이터 정리 작업은 되돌릴 수 없습니다. 실행 전에 백업을 권장합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "임시 파일 정리",
            description: "시스템에서 생성된 임시 파일들을 삭제합니다",
            size: "1.2GB",
            count: "2,340개 파일",
            action: "정리하기",
            color: "blue",
          },
          {
            title: "오래된 로그 삭제",
            description: "90일 이상 된 로그 파일들을 삭제합니다",
            size: "850MB",
            count: "156개 파일",
            action: "삭제하기",
            color: "orange",
          },
          {
            title: "중복 데이터 제거",
            description: "데이터베이스의 중복된 레코드를 찾아 제거합니다",
            size: "추정 300MB",
            count: "약 45개 레코드",
            action: "분석하기",
            color: "green",
          },
          {
            title: "삭제된 항목 완전 삭제",
            description: "휴지통의 항목들을 영구적으로 삭제합니다",
            size: "2.1GB",
            count: "1,890개 항목",
            action: "영구삭제",
            color: "red",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {item.description}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  예상 용량:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {item.size}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">대상:</span>
                <span className="text-gray-900 dark:text-white">
                  {item.count}
                </span>
              </div>
            </div>
            <button
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                item.color === "blue"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : item.color === "orange"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : item.color === "green"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
              } text-white`}
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          백업 설정
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                자동 백업 활성화
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                매일 지정된 시간에 자동으로 백업을 실행합니다
              </div>
            </div>
            <button
              onClick={() =>
                setBackupSettings((prev) => ({
                  ...prev,
                  autoBackup: !prev.autoBackup,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                backupSettings.autoBackup ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  backupSettings.autoBackup ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {backupSettings.autoBackup && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  백업 시간
                </label>
                <input
                  type="time"
                  value={backupSettings.backupTime}
                  onChange={(e) =>
                    setBackupSettings((prev) => ({
                      ...prev,
                      backupTime: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  보존 기간 (일)
                </label>
                <input
                  type="number"
                  value={backupSettings.retentionDays}
                  onChange={(e) =>
                    setBackupSettings((prev) => ({
                      ...prev,
                      retentionDays: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            {[
              {
                key: "compression",
                label: "백업 압축",
                desc: "백업 파일을 압축하여 저장 공간을 절약합니다",
              },
              {
                key: "includeFiles",
                label: "파일 포함",
                desc: "업로드된 파일들도 백업에 포함합니다",
              },
              {
                key: "includeDatabase",
                label: "데이터베이스 포함",
                desc: "데이터베이스를 백업에 포함합니다",
              },
              {
                key: "cloudBackup",
                label: "클라우드 백업",
                desc: "백업을 클라우드 스토리지에도 저장합니다",
              },
            ].map((setting) => (
              <div
                key={setting.key}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {setting.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {setting.desc}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setBackupSettings((prev) => ({
                      ...prev,
                      [setting.key]: !prev[setting.key],
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    backupSettings[setting.key] ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      backupSettings[setting.key]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {backupSettings.cloudBackup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                클라우드 제공업체
              </label>
              <select
                value={backupSettings.cloudProvider}
                onChange={(e) =>
                  setBackupSettings((prev) => ({
                    ...prev,
                    cloudProvider: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="aws">Amazon S3</option>
                <option value="gcp">Google Cloud Storage</option>
                <option value="azure">Azure Blob Storage</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("dataManagement.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("dataManagement.description")}
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
        {activeTab === "backup" && renderBackupTab()}
        {activeTab === "import" && renderImportTab()}
        {activeTab === "export" && renderExportTab()}
        {activeTab === "cleanup" && renderCleanupTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </div>
    </div>
  );
}
