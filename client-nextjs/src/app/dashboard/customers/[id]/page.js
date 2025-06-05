
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { useToast } from "@/hooks/useToast.js";
import { useLanguage } from "@/contexts/languageContext.js";
import { GET_CUSTOMER, GET_USERS } from "@/lib/graphql/queries.js";
import { UPDATE_CUSTOMER } from "@/lib/graphql/mutations.js";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import Image from "next/image";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [originalData, setOriginalData] = useState({});

  const customerId = params.id;

  const { loading, error, data, refetch } = useQuery(GET_CUSTOMER, {
    variables: { id: customerId },
    onCompleted: (data) => {
      if (data?.customer) {
        setOriginalData(data.customer);
        setEditData(data.customer);
      }
    },
  });

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { limit: 100, offset: 0 },
  });

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

  const customer = data?.customer;
  const users = usersData?.users || [];

  const companyTypes = {
    SME: t("company.type.small") || "중소기업",
    LARGE: t("company.type.large") || "대기업",
    STARTUP: t("company.type.startup") || "스타트업",
    PUBLIC: t("company.type.public") || "공공기관",
    NONPROFIT: t("company.type.nonprofit") || "비영리단체",
  };

  const gradeLabels = {
    A: t("customer.grade.vip") || "A급 (VIP)",
    B: t("customer.grade.excellent") || "B급 (우수)",
    C: t("customer.grade.normal") || "C급 (일반)",
    D: t("customer.grade.standard") || "D급 (표준)",
    E: t("customer.grade.basic") || "E급 (기본)",
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...originalData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...originalData });
  };

  const handleSave = async () => {
    try {
      // 변경된 데이터만 추출
      const changedData = {};
      Object.keys(editData).forEach((key) => {
        if (editData[key] !== originalData[key] && key !== '__typename' && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
          changedData[key] = editData[key];
        }
      });

      if (Object.keys(changedData).length === 0) {
        toast({
          title: "알림",
          description: "변경된 내용이 없습니다.",
        });
        setIsEditing(false);
        return;
      }

      await updateCustomer({
        variables: {
          id: customerId,
          input: changedData,
        },
      });

      toast({
        title: "성공",
        description: "고객 정보가 성공적으로 업데이트되었습니다.",
      });

      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "오류",
        description: "고객 정보 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">고객 정보를 불러올 수 없습니다.</p>
        <Button onClick={() => router.back()} className="mt-4">
          돌아가기
        </Button>
      </div>
    );
  }

  const displayData = isEditing ? editData : customer;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {customer.name || "Unknown Company"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                고객 상세 정보
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600">
                <Edit3 className="w-4 h-4 mr-2" />
                수정
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
                <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    회사명
                  </Label>
                  {isEditing ? (
                    <Input
                      value={displayData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold">{displayData.name}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    담당자명
                  </Label>
                  {isEditing ? (
                    <Input
                      value={displayData.contactName || ""}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{displayData.contactName}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    업종
                  </Label>
                  {isEditing ? (
                    <Input
                      value={displayData.industry || ""}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{displayData.industry}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    회사 유형
                  </Label>
                  {isEditing ? (
                    <select
                      value={displayData.companyType || ""}
                      onChange={(e) => handleInputChange("companyType", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">선택하세요</option>
                      {Object.entries(companyTypes).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1">{companyTypes[displayData.companyType] || displayData.companyType}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    고객 등급
                  </Label>
                  {isEditing ? (
                    <select
                      value={displayData.grade || ""}
                      onChange={(e) => handleInputChange("grade", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">선택하세요</option>
                      {Object.entries(gradeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        displayData.grade === "A" ? "bg-red-100 text-red-800" :
                        displayData.grade === "B" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {gradeLabels[displayData.grade] || displayData.grade}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    담당 영업사원
                  </Label>
                  {isEditing ? (
                    <select
                      value={displayData.assignedUserId || ""}
                      onChange={(e) => handleInputChange("assignedUserId", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">선택하세요</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.department})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1">{displayData.assignedUser?.name || "미배정"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                연락처 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    이메일
                  </Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={displayData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{displayData.email}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    전화번호
                  </Label>
                  {isEditing ? (
                    <Input
                      value={displayData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{displayData.phone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    주소
                  </Label>
                  {isEditing ? (
                    <Input
                      value={displayData.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{displayData.address}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Image */}
          {displayData.profileImage && (
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>프로필 이미지</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={displayData.profileImage}
                    alt="고객사 프로필"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Info */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>요약 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">상태</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  displayData.status === "active" ? "bg-green-100 text-green-800" :
                  displayData.status === "inactive" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {displayData.status === "active" ? "활성" :
                   displayData.status === "inactive" ? "비활성" : "잠재고객"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">등록일</span>
                <span className="text-sm">
                  {new Date(displayData.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">마지막 수정</span>
                <span className="text-sm">
                  {new Date(displayData.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
