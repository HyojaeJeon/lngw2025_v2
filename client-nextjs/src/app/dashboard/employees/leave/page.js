"use client";

import { useState } from "react";
import { useTranslation } from "../../../../hooks/useLanguage.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card.js";
import { Badge } from "../../../../components/ui/badge.js";
import { Button } from "../../../../components/ui/button.js";
import { Input } from "../../../../components/ui/input.js";
import { Label } from "../../../../components/ui/label.js";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Clock,
  User,
  FileText,
} from "lucide-react";

export default function LeaveManagementPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRequestForm, setShowRequestForm] = useState(false);

  // 휴가 신청 데이터 (베트남 노동법 기준)
  const leaveRequests = [
    {
      id: "LV-2024-001",
      employee: "김민수",
      department: "개발팀",
      type: "annual",
      startDate: "2024-02-15",
      endDate: "2024-02-16",
      days: 2,
      reason: "개인 사정",
      status: "pending",
      requestDate: "2024-02-10",
      approver: "이팀장",
    },
    {
      id: "LV-2024-002",
      employee: "Nguyen Van A",
      department: "마케팅팀",
      type: "sick",
      startDate: "2024-02-12",
      endDate: "2024-02-12",
      days: 1,
      reason: "몸살감기",
      status: "approved",
      requestDate: "2024-02-12",
      approver: "박부장",
    },
    {
      id: "LV-2024-003",
      employee: "Tran Thi B",
      department: "인사팀",
      type: "maternity",
      startDate: "2024-03-01",
      endDate: "2024-06-30",
      days: 120,
      reason: "출산휴가",
      status: "approved",
      requestDate: "2024-01-15",
      approver: "최이사",
    },
    {
      id: "LV-2024-004",
      employee: "정영희",
      department: "재무팀",
      type: "family",
      startDate: "2024-02-20",
      endDate: "2024-02-21",
      days: 2,
      reason: "가족 경조사",
      status: "rejected",
      requestDate: "2024-02-18",
      approver: "김부장",
    },
  ];

  // 베트남 노동법 기준 휴가 정책
  const vietnamLeavePolicy = {
    annual: {
      name: "연차휴가",
      maxDays: 12,
      description: "근속 1년 이상 직원",
    },
    sick: { name: "병가", maxDays: 30, description: "의사 진단서 필요" },
    maternity: {
      name: "출산휴가",
      maxDays: 180,
      description: "여성 직원 180일",
    },
    paternity: { name: "육아휴가", maxDays: 5, description: "남성 직원 5일" },
    family: { name: "경조사휴가", maxDays: 3, description: "가족 경조사" },
    marriage: { name: "결혼휴가", maxDays: 3, description: "본인 결혼" },
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">승인대기</Badge>
        );
      case "approved":
        return <Badge className="bg-green-100 text-green-800">승인완료</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">반려</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLeaveTypeName = (type) => {
    return vietnamLeavePolicy[type]?.name || type;
  };

  const handleApprove = (id) => {
    console.log("Approving leave request:", id);
  };

  const handleReject = (id) => {
    console.log("Rejecting leave request:", id);
  };

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("employees.leave")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            베트남 노동법 기준 휴가 관리 시스템
          </p>
        </div>

        <Button onClick={() => setShowRequestForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          휴가 신청
        </Button>
      </div>

      {/* 베트남 휴가 정책 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            베트남 노동법 기준 휴가 정책
          </CardTitle>
          <CardDescription>
            현지 법규에 따른 휴가 종류별 기준일수
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(vietnamLeavePolicy).map(([key, policy]) => (
              <div key={key} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm">{policy.name}</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {policy.maxDays}일
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {policy.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="직원명 또는 신청번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">상태 필터</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="pending">승인대기</option>
                <option value="approved">승인완료</option>
                <option value="rejected">반려</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 휴가 신청 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>휴가 신청 목록</CardTitle>
          <CardDescription>
            총 {filteredRequests.length}개의 휴가 신청
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">
                    신청번호
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">직원명</th>
                  <th className="text-left py-3 px-4 font-semibold">부서</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    휴가종류
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">기간</th>
                  <th className="text-center py-3 px-4 font-semibold">일수</th>
                  <th className="text-center py-3 px-4 font-semibold">상태</th>
                  <th className="text-center py-3 px-4 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4 font-mono text-sm">
                      {request.id}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {request.employee}
                    </td>
                    <td className="py-3 px-4">{request.department}</td>
                    <td className="py-3 px-4">
                      {getLeaveTypeName(request.type)}
                    </td>
                    <td className="py-3 px-4">
                      {request.startDate} ~ {request.endDate}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold">
                      {request.days}일
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApprove(request.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleReject(request.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 휴가 신청 폼 (모달) */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>새 휴가 신청</CardTitle>
              <CardDescription>
                베트남 노동법 기준에 따른 휴가를 신청하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employee">직원명</Label>
                  <Input id="employee" placeholder="직원명을 입력하세요" />
                </div>
                <div>
                  <Label htmlFor="department">부서</Label>
                  <Input id="department" placeholder="부서명을 입력하세요" />
                </div>
              </div>

              <div>
                <Label htmlFor="leaveType">휴가 종류</Label>
                <select
                  id="leaveType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">휴가 종류를 선택하세요</option>
                  {Object.entries(vietnamLeavePolicy).map(([key, policy]) => (
                    <option key={key} value={key}>
                      {policy.name} (최대 {policy.maxDays}일)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">시작일</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">종료일</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">사유</Label>
                <textarea
                  id="reason"
                  placeholder="휴가 사유를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-blue-800 mb-2">
                  베트남 노동법 안내
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 연차휴가: 근속 1년 이상 직원에게 12일 제공</li>
                  <li>• 병가: 의사 진단서 필요, 최대 30일</li>
                  <li>• 출산휴가: 여성 직원 180일 (유급)</li>
                  <li>• 육아휴가: 남성 직원 5일</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRequestForm(false)}
                >
                  취소
                </Button>
                <Button>신청하기</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
