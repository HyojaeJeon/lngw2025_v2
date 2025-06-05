"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { Button } from "@/components/ui/button.js";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_ADDRESSES, GET_SERVICES } from "@/lib/graphql/queries.js";
import { CREATE_ADDRESS, CREATE_SERVICE, CREATE_CUSTOMER } from "@/lib/graphql/mutations.js";
import { Building2, MapPin, ChevronDown, User, Phone, Mail, FileText, Calendar, Plus, Upload, X, Search, UserPlus, Camera } from "lucide-react";
import { useLanguage } from "@/contexts/languageContext.js";
import Image from "next/image";

const SearchableUserSelect = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedCount, setLoadedCount] = useState(10);
  const dropdownRef = useRef(null);

  const { data: usersData, loading, fetchMore } = useQuery(GET_USERS, {
    variables: { limit: 10, offset: 0, search: searchTerm },
    onError: (error) => console.error("Users query error:", error)
  });

  const users = usersData?.users || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
      try {
        await fetchMore({
          variables: {
            offset: users.length,
            limit: 5,
            search: searchTerm
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              users: [...prev.users, ...fetchMoreResult.users]
            };
          }
        });
      } catch (error) {
        console.error("Error loading more users:", error);
      }
    }
  };

  const selectedUser = users.find(user => user.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`relative flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all duration-200
                   ${isOpen 
                     ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                     : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                   } bg-white dark:bg-gray-700`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          {selectedUser ? (
            <>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedUser.department} • {selectedUser.position}</p>
              </div>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-xl shadow-2xl">
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="담당자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200"
                autoFocus
              />
            </div>
          </div>

          <div 
            className="max-h-64 overflow-y-auto"
            onScroll={handleScroll}
          >
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                onClick={() => {
                  onChange(user.id);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-400">{user.department} • {user.position}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="p-3 text-center text-gray-500">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>로딩 중...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ContactPersonForm = ({ contact, index, updateContact, removeContact }) => {
  const [profileImagePreview, setProfileImagePreview] = useState(contact.profileImage || null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        setProfileImagePreview(result);
        updateContact(index, 'profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          담당자 {index + 1}
        </h4>
        <Button
          type="button"
          onClick={() => removeContact(index)}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 프로필 이미지 */}
        <div className="col-span-full">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">프로필 이미지</Label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {profileImagePreview ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={profileImagePreview}
                    alt="프로필"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {contact.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* 기본 정보 */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">이름 *</Label>
          <Input
            type="text"
            value={contact.name || ""}
            onChange={(e) => updateContact(index, 'name', e.target.value)}
            placeholder="담당자 이름"
            className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">부서</Label>
          <Input
            type="text"
            value={contact.department || ""}
            onChange={(e) => updateContact(index, 'department', e.target.value)}
            placeholder="부서명"
            className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">직책</Label>
          <Input
            type="text"
            value={contact.position || ""}
            onChange={(e) => updateContact(index, 'position', e.target.value)}
            placeholder="직책"
            className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        {/* 연락처 정보 */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">전화번호</Label>
          <Input
            type="tel"
            value={contact.phone || ""}
            onChange={(e) => updateContact(index, 'phone', e.target.value)}
            placeholder="전화번호"
            className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">이메일</Label>
          <Input
            type="email"
            value={contact.email || ""}
            onChange={(e) => updateContact(index, 'email', e.target.value)}
            placeholder="이메일"
            className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">생년월일</Label>
          <Input
            type="date"
            value={contact.birthDate || ""}
            onChange={(e) => updateContact(index, 'birthDate', e.target.value)}
            className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        {/* 소셜 미디어 */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</Label>
          <Input
            type="url"
            value={contact.facebook || ""}
            onChange={(e) => updateContact(index, 'facebook', e.target.value)}
            placeholder="Facebook URL"
            className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">TikTok</Label>
          <Input
            type="url"
            value={contact.tiktok || ""}
            onChange={(e) => updateContact(index, 'tiktok', e.target.value)}
            placeholder="TikTok URL"
            className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Instagram</Label>
          <Input
            type="url"
            value={contact.instagram || ""}
            onChange={(e) => updateContact(index, 'instagram', e.target.value)}
            placeholder="Instagram URL"
            className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>
      </div>
    </div>
  );
};

export default function AddCustomerPage() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    companyType: "",
    grade: "",
    address: "",
    assignedUserId: "",
    contacts: []
  });

  const [createCustomer] = useMutation(CREATE_CUSTOMER);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addContactPerson = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, {
        name: "",
        department: "",
        position: "",
        phone: "",
        email: "",
        birthDate: "",
        facebook: "",
        tiktok: "",
        instagram: "",
        profileImage: ""
      }]
    }));
  };

  const updateContactPerson = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeContactPerson = (index) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createCustomer({
        variables: {
          input: formData
        }
      });
      console.log("Customer created:", data);
      // 성공 처리 로직
    } catch (error) {
      console.error("Customer creation error:", error);
      // 에러 처리 로직
    }
  };

  const companyTypes = [
    { value: "중소기업", label: "중소기업" },
    { value: "대기업", label: "대기업" },
    { value: "스타트업", label: "스타트업" },
    { value: "공공기관", label: "공공기관" },
    { value: "비영리단체", label: "비영리단체" }
  ];

  const grades = [
    { value: "A급 (VIP)", label: "A급 (VIP)" },
    { value: "B급 (우수)", label: "B급 (우수)" },
    { value: "C급 (일반)", label: "C급 (일반)" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">새로운 고객사 추가</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">고객사 정보와 담당자 정보를 입력해 주세요</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 회사 정보 */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                기본 회사 정보
              </CardTitle>
              <CardDescription className="text-blue-100">
                고객사의 기본적인 정보를 입력해 주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">회사명 *</Label>
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="회사명을 입력하세요"
                    className="mt-1 h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">회사 유형</Label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className="mt-1 w-full h-12 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                  >
                    <option value="">회사 유형 선택</option>
                    {companyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">업종</Label>
                  <Input
                    name="industry"
                    type="text"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="업종을 입력하세요"
                    className="mt-1 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">고객 등급</Label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="mt-1 w-full h-12 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                  >
                    <option value="">고객 등급 선택</option>
                    {grades.map(grade => (
                      <option key={grade.value} value={grade.value}>{grade.label}</option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">주소</Label>
                  <Input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="회사 주소를 입력하세요"
                    className="mt-1 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 담당 영업사원 */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                담당 영업사원
              </CardTitle>
              <CardDescription className="text-green-100">
                이 고객사를 담당할 영업사원을 선택해 주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <SearchableUserSelect
                value={formData.assignedUserId}
                onChange={(userId) => setFormData(prev => ({...prev, assignedUserId: userId}))}
                placeholder="담당 영업사원을 검색하여 선택하세요"
              />
            </CardContent>
          </Card>

          {/* 담당자 정보 */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                담당자 정보
              </CardTitle>
              <CardDescription className="text-purple-100">
                고객사의 담당자들을 추가해 주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {formData.contacts.map((contact, index) => (
                  <ContactPersonForm
                    key={index}
                    contact={contact}
                    index={index}
                    updateContact={updateContactPerson}
                    removeContact={removeContactPerson}
                  />
                ))}

                <Button
                  type="button"
                  onClick={addContactPerson}
                  variant="outline"
                  className="w-full h-16 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 hover:text-blue-600 rounded-xl transition-all duration-200"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  담당자 추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              className="px-8 py-3 h-12 rounded-xl border-2"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="px-8 py-3 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg"
            >
              고객사 등록
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}