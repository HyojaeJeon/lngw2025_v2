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
  User,
  Plus,
  Search,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

export default function EmployeeProfilePage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 직원 프로필 데이터
  const employees = [
    {
      id: "EMP-001",
      name: "김민수",
      nameEn: "Kim Min Su",
      email: "minsu.kim@company.com",
      phone: "+84-123-456-789",
      department: "개발팀",
      position: "시니어 개발자",
      level: "Senior",
      hireDate: "2022-03-15",
      birthDate: "1990-05-20",
      nationality: "한국",
      address: "Ho Chi Minh City, District 1",
      emergencyContact: {
        name: "김영희",
        relationship: "배우자",
        phone: "+84-987-654-321",
      },
      education: [
        {
          degree: "컴퓨터공학 학사",
          university: "서울대학교",
          year: "2012",
        },
      ],
      experience: [
        {
          company: "Tech Corp",
          position: "개발자",
          period: "2018-2022",
        },
      ],
      skills: ["JavaScript", "React", "Node.js", "Python"],
      status: "active",
      avatar: null,
    },
    {
      id: "EMP-002",
      name: "Nguyen Van A",
      nameEn: "Nguyen Van A",
      email: "nguyenvana@company.com",
      phone: "+84-234-567-890",
      department: "마케팅팀",
      position: "마케팅 매니저",
      level: "Manager",
      hireDate: "2021-06-01",
      birthDate: "1988-12-10",
      nationality: "베트남",
      address: "Ho Chi Minh City, District 3",
      emergencyContact: {
        name: "Nguyen Thi B",
        relationship: "어머니",
        phone: "+84-876-543-210",
      },
      education: [
        {
          degree: "경영학 석사",
          university: "Vietnam National University",
          year: "2015",
        },
      ],
      experience: [
        {
          company: "Marketing Plus",
          position: "마케팅 전문가",
          period: "2016-2021",
        },
      ],
      skills: ["Digital Marketing", "SEO", "Analytics", "Content Strategy"],
      status: "active",
      avatar: null,
    },
    {
      id: "EMP-003",
      name: "Tran Thi C",
      nameEn: "Tran Thi C",
      email: "tranthic@company.com",
      phone: "+84-345-678-901",
      department: "인사팀",
      position: "인사 담당자",
      level: "Staff",
      hireDate: "2023-01-15",
      birthDate: "1995-08-25",
      nationality: "베트남",
      address: "Ho Chi Minh City, District 7",
      emergencyContact: {
        name: "Tran Van D",
        relationship: "아버지",
        phone: "+84-765-432-109",
      },
      education: [
        {
          degree: "인사관리학 학사",
          university: "Ho Chi Minh City University",
          year: "2017",
        },
      ],
      experience: [
        {
          company: "HR Solutions",
          position: "HR Assistant",
          period: "2018-2022",
        },
      ],
      skills: ["HR Management", "Recruitment", "Training", "Labor Law"],
      status: "active",
      avatar: null,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">재직중</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">휴직</Badge>;
      case "terminated":
        return <Badge className="bg-red-100 text-red-800">퇴사</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLevelBadge = (level) => {
    const colors = {
      Staff: "bg-blue-100 text-blue-800",
      Senior: "bg-purple-100 text-purple-800",
      Manager: "bg-orange-100 text-orange-800",
      Director: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={colors[level] || "bg-gray-100 text-gray-800"}>
        {level}
      </Badge>
    );
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("employees.profile")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            직원 프로필 및 인사정보 관리
          </p>
        </div>

        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          직원 등록
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 직원 목록 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>직원 목록</CardTitle>
              <CardDescription>총 {employees.length}명의 직원</CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="직원 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedEmployee?.id === employee.id
                        ? "bg-blue-50 dark:bg-blue-900"
                        : ""
                    }`}
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{employee.name}</h4>
                        <p className="text-xs text-gray-600">
                          {employee.department}
                        </p>
                        <p className="text-xs text-gray-500">
                          {employee.position}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(employee.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 직원 상세 정보 */}
        <div className="lg:col-span-2">
          {selectedEmployee ? (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>기본 정보</CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">
                        {selectedEmployee.name}
                      </h2>
                      <p className="text-gray-600">{selectedEmployee.nameEn}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getLevelBadge(selectedEmployee.level)}
                        {getStatusBadge(selectedEmployee.status)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">사원번호</Label>
                      <p className="text-sm">{selectedEmployee.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">부서/직책</Label>
                      <p className="text-sm">
                        {selectedEmployee.department} /{" "}
                        {selectedEmployee.position}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">입사일</Label>
                      <p className="text-sm">{selectedEmployee.hireDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">생년월일</Label>
                      <p className="text-sm">{selectedEmployee.birthDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">국적</Label>
                      <p className="text-sm">{selectedEmployee.nationality}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 연락처 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle>연락처 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium">이메일</Label>
                        <p className="text-sm">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium">전화번호</Label>
                        <p className="text-sm">{selectedEmployee.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <Label className="text-sm font-medium">주소</Label>
                      <p className="text-sm">{selectedEmployee.address}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">비상연락처</Label>
                    <div className="bg-gray-50 p-3 rounded-lg mt-1">
                      <p className="text-sm font-medium">
                        {selectedEmployee.emergencyContact.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedEmployee.emergencyContact.relationship}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedEmployee.emergencyContact.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 학력 및 경력 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5" />
                      <span>학력</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEmployee.education.map((edu, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-blue-200 pl-4 mb-4"
                      >
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-gray-600">
                          {edu.university}
                        </p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <span>경력</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEmployee.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-green-200 pl-4 mb-4"
                      >
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.period}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* 기술 및 스킬 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>보유 기술</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    직원을 선택하여 상세 정보를 확인하세요
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 직원 등록 폼 (모달) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>새 직원 등록</CardTitle>
              <CardDescription>직원의 기본 정보를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <Label className="text-base font-semibold">기본 정보</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="name">한글명</Label>
                    <Input id="name" placeholder="김민수" />
                  </div>
                  <div>
                    <Label htmlFor="nameEn">영문명</Label>
                    <Input id="nameEn" placeholder="Kim Min Su" />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">생년월일</Label>
                    <Input id="birthDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="nationality">국적</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">국적을 선택하세요</option>
                      <option value="한국">한국</option>
                      <option value="베트남">베트남</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 연락처 정보 */}
              <div>
                <Label className="text-base font-semibold">연락처 정보</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">전화번호</Label>
                    <Input id="phone" placeholder="+84-123-456-789" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    placeholder="Ho Chi Minh City, District 1"
                  />
                </div>
              </div>

              {/* 직무 정보 */}
              <div>
                <Label className="text-base font-semibold">직무 정보</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="department">부서</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">부서를 선택하세요</option>
                      <option value="개발팀">개발팀</option>
                      <option value="마케팅팀">마케팅팀</option>
                      <option value="인사팀">인사팀</option>
                      <option value="재무팀">재무팀</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="position">직책</Label>
                    <Input id="position" placeholder="시니어 개발자" />
                  </div>
                  <div>
                    <Label htmlFor="level">직급</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">직급을 선택하세요</option>
                      <option value="Staff">Staff</option>
                      <option value="Senior">Senior</option>
                      <option value="Manager">Manager</option>
                      <option value="Director">Director</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="hireDate">입사일</Label>
                    <Input id="hireDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="salary">기본급 (VND)</Label>
                    <Input id="salary" type="number" placeholder="25000000" />
                  </div>
                </div>
              </div>

              {/* 비상연락처 */}
              <div>
                <Label className="text-base font-semibold">비상연락처</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="emergencyName">이름</Label>
                    <Input id="emergencyName" placeholder="김영희" />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelation">관계</Label>
                    <Input id="emergencyRelation" placeholder="배우자" />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">전화번호</Label>
                    <Input id="emergencyPhone" placeholder="+84-987-654-321" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  취소
                </Button>
                <Button>등록하기</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
