"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { Button } from "@/components/ui/button.js";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_ADDRESSES, GET_SERVICES } from "@/lib/graphql/queries.js";
import { CREATE_ADDRESS, CREATE_SERVICE, CREATE_CUSTOMER } from "@/lib/graphql/mutations.js";
import { Building2, MapPin, ChevronDown, User, Phone, Mail, FileText, Calendar, Plus, Upload, X } from "lucide-react";
import { useLanguage } from "@/contexts/languageContext.js";
import Image from "next/image";

export default function AddCustomerPage() {
  const { t } = useLanguage();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [companyTypeOther, setCompanyTypeOther] = useState("");
  const [gradeOther, setGradeOther] = useState("");
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const dropdownRefs = useRef({});

  // Pagination states
  const [usersPagination, setUsersPagination] = useState({ limit: 10, offset: 0, hasMore: true });
  const [servicesPagination, setServicesPagination] = useState({ limit: 10, offset: 0, hasMore: true });

  const { data: usersData, loading: usersLoading, fetchMore: fetchMoreUsers } = useQuery(GET_USERS, {
    variables: { limit: usersPagination.limit, offset: usersPagination.offset },
    onCompleted: (data) => {
      setUsers(data?.users || []);
    },
    onError: (error) => {
      console.error("Users query error:", error);
      setUsers([]);
    }
  });

  const { data: servicesData, loading: servicesLoading, fetchMore: fetchMoreServices } = useQuery(GET_SERVICES, {
    variables: { limit: servicesPagination.limit, offset: servicesPagination.offset },
    onCompleted: (data) => {
      setServices(data?.services || []);
    },
    onError: (error) => {
      console.error("Services query error:", error);
      setServices([]);
    }
  });

  const { data: addressesData, loading: addressesLoading } = useQuery(GET_ADDRESSES, {
    onCompleted: (data) => {
      setAddresses(data?.addresses || []);
    },
    onError: (error) => {
      console.error("Addresses query error:", error);
      setAddresses([]);
    }
  });

  const [createAddress] = useMutation(CREATE_ADDRESS, {
    refetchQueries: [{ query: GET_ADDRESSES }]
  });
  const [createService] = useMutation(CREATE_SERVICE, {
    refetchQueries: [{ query: GET_SERVICES }]
  });
  const [createCustomer] = useMutation(CREATE_CUSTOMER);

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
    contactDepartment: "",
    contactBirthDate: "",
    facebook: "",
    tiktok: "",
    instagram: "",
  });

  const [addressForm, setAddressForm] = useState({
    name: "",
    country: "Vietnam",
    state: "",
    city: "",
    district: "",
    street: "",
    buildingNumber: "",
    zipCode: "",
    fullAddress: "",
    isDefault: false,
  });

  const [serviceForm, setServiceForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    status: "active",
  });

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && dropdownRefs.current[activeDropdown]) {
        if (!dropdownRefs.current[activeDropdown].contains(event.target)) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createAddress({
        variables: {
          input: {
            ...addressForm
          }
        }
      });

      setAddresses(prev => [data.createAddress, ...prev]);
      setAddressForm({
        name: "",
        country: "Vietnam",
        state: "",
        city: "",
        district: "",
        street: "",
        buildingNumber: "",
        zipCode: "",
        fullAddress: "",
        isDefault: false,
      });
      setShowAddressModal(false);
    } catch (error) {
      console.error("Address creation error:", error);
      alert(t('common.error'));
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createService({
        variables: {
          input: {
            ...serviceForm,
            price: parseFloat(serviceForm.price) || 0
          }
        }
      });

      setServices(prev => [data.createService, ...prev]);
      setServiceForm({
        name: "",
        price: "",
        description: "",
        category: "",
        status: "active",
      });
      setShowServiceModal(false);
    } catch (error) {
      console.error("Service creation error:", error);
      alert(t('common.error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto mt-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <CardHeader className="mb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">고객사 추가</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">새로운 고객사 정보를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={() => { }} className="space-y-6">
              {/* 기본 정보 */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">기본 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">고객사명 *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={() => { }}
                      placeholder="고객사명을 입력하세요"
                      required
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* 회사 유형 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('customers.add.companyType')}
                    </Label>
                    <div className="relative" ref={el => dropdownRefs.current['companyType'] = el}>
                      <button
                        type="button"
                        onClick={() => toggleDropdown('companyType')}
                        className="w-full px-3 py-2 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <span className="block truncate text-gray-900 dark:text-white">
                          {formData.companyType === 'other' ? t('common.directInput') : 
                           formData.companyType || t('customers.add.companyType.placeholder')}
                        </span>
                        <ChevronDown className="absolute inset-y-0 right-0 flex items-center pr-2 h-5 w-5 text-gray-400" />
                      </button>

                      {activeDropdown === 'companyType' && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                          {[t('customers.companyType.small'), t('customers.companyType.large'), t('customers.companyType.startup'), t('customers.companyType.public'), t('customers.companyType.nonprofit'), t('common.directInput')].map((type, idx) => {
                            const values = ['중소기업', '대기업', '스타트업', '공공기관', '비영리단체', 'other'];
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, companyType: values[idx] }));
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {formData.companyType === 'other' && (
                      <Input
                        type="text"
                        value={companyTypeOther}
                        onChange={(e) => setCompanyTypeOther(e.target.value)}
                        placeholder={t('customers.add.companyType.customPlaceholder')}
                        className="mt-2"
                      />
                    )}
                  </div>

                  {/* 등급 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('customers.add.grade')}
                    </Label>
                    <div className="relative" ref={el => dropdownRefs.current['grade'] = el}>
                      <button
                        type="button"
                        onClick={() => toggleDropdown('grade')}
                        className="w-full px-3 py-2 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <span className="block truncate text-gray-900 dark:text-white">
                          {formData.grade === 'other' ? t('common.directInput') :
                           formData.grade || t('customers.add.grade.placeholder')}
                        </span>
                        <ChevronDown className="absolute inset-y-0 right-0 flex items-center pr-2 h-5 w-5 text-gray-400" />
                      </button>

                      {activeDropdown === 'grade' && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                          {[t('customers.grade.A'), t('customers.grade.B'), t('customers.grade.C'), t('common.directInput')].map((grade, idx) => {
                            const values = ['A급 (VIP)', 'B급 (우수)', 'C급 (일반)', 'other'];
                            return (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, grade: values[idx] }));
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                              >
                                {grade}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {formData.grade === 'other' && (
                      <Input
                        type="text"
                        value={gradeOther}
                        onChange={(e) => setGradeOther(e.target.value)}
                        placeholder={t('customers.add.grade.customPlaceholder')}
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contactName" className="text-sm font-medium text-gray-700 dark:text-gray-300">담당자 이름</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      type="text"
                      value={formData.contactName}
                      onChange={() => { }}
                      placeholder="담당자 이름을 입력하세요"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </section>

              {/* 연락처 정보 */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">연락처 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">이메일</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={() => { }}
                      placeholder="이메일을 입력하세요"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">전화번호</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={() => { }}
                      placeholder="전화번호를 입력하세요"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </section>

              {/* 상세 정보 */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">상세 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry" className="text-sm font-medium text-gray-700 dark:text-gray-300">업종</Label>
                    <Input
                      id="industry"
                      name="industry"
                      type="text"
                      value={formData.industry}
                      onChange={() => { }}
                      placeholder="업종을 입력하세요"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">주소</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={() => { }}
                      placeholder="주소를 입력하세요"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </section>

              {/* 추가 정보 */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">추가 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactDepartment" className="text-sm font-medium text-gray-700 dark:text-gray-300">담당 부서</Label>
                    <Input
                      id="contactDepartment"
                      name="contactDepartment"
                      type="text"
                      value={formData.contactDepartment}
                      onChange={() => { }}
                      placeholder="담당 부서를 입력하세요"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactBirthDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">담당자 생년월일</Label>
                    <Input
                      id="contactBirthDate"
                      name="contactBirthDate"
                      type="date"
                      value={formData.contactBirthDate}
                      onChange={() => { }}
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </section>

              {/* 소셜 미디어 정보 */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">소셜 미디어 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="facebook" className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</Label>
                    <Input
                      id="facebook"
                      name="facebook"
                      type="url"
                      value={formData.facebook}
                      onChange={() => { }}
                      placeholder="Facebook URL"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tiktok" className="text-sm font-medium text-gray-700 dark:text-gray-300">TikTok</Label>
                    <Input
                      id="tiktok"
                      name="tiktok"
                      type="url"
                      value={formData.tiktok}
                      onChange={() => { }}
                      placeholder="TikTok URL"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram" className="text-sm font-medium text-gray-700 dark:text-gray-300">Instagram</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      type="url"
                      value={formData.instagram}
                      onChange={() => { }}
                      placeholder="Instagram URL"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </section>

              {/* 제출 버튼 */}
              <div className="flex justify-end">
                <Button type="submit">저장</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">주소 추가</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="addressName" className="text-sm font-medium text-gray-700 dark:text-gray-300">주소명 *</Label>
                    <Input
                      id="addressName"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressChange}
                      placeholder="예: 본사, 지점 등"
                      required
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300">국가 *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        required
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700 dark:text-gray-300">주/도</Label>
                      <Input
                        id="state"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        placeholder="예: 호치민시"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300">시/군/구 *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        placeholder="예: 1군"
                        required
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district" className="text-sm font-medium text-gray-700 dark:text-gray-300">구/군</Label>
                      <Input
                        id="district"
                        name="district"
                        value={addressForm.district}
                        onChange={handleAddressChange}
                        placeholder="예: 벤응에 와드"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="street" className="text-sm font-medium text-gray-700 dark:text-gray-300">도로명</Label>
                    <Input
                      id="street"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      placeholder="예: 응우옌 후에 거리"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buildingNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">건물번호</Label>
                      <Input
                        id="buildingNumber"
                        name="buildingNumber"
                        value={addressForm.buildingNumber}
                        onChange={handleAddressChange}
                        placeholder="예: 123"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">우편번호</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={addressForm.zipCode}
                        onChange={handleAddressChange}
                        placeholder="예: 700000"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fullAddress" className="text-sm font-medium text-gray-700 dark:text-gray-300">전체 주소 *</Label>
                    <Input
                      id="fullAddress"
                      name="fullAddress"
                      value={addressForm.fullAddress}
                      onChange={handleAddressChange}
                      placeholder="전체 주소를 입력하세요"
                      required
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="rounded"
                    />
                    <Label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300">기본 주소로 설정</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="submit" size="sm">추가</Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddressModal(false)}>취소</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Service Modal */}
        {showServiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">서비스 추가</h3>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="serviceName" className="text-sm font-medium text-gray-700 dark:text-gray-300">서비스명 *</Label>
                    <Input
                      id="serviceName"
                      name="name"
                      value={serviceForm.name}
                      onChange={handleServiceChange}
                      placeholder="서비스명을 입력하세요"
                      required
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="servicePrice" className="text-sm font-medium text-gray-700 dark:text-gray-300">가격</Label>
                    <Input
                      id="servicePrice"
                      name="price"
                      type="number"
                      value={serviceForm.price}
                      onChange={handleServiceChange}
                      placeholder="가격을 입력하세요"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">설명</Label>
                    <Input
                      id="serviceDescription"
                      name="description"
                      value={serviceForm.description}
                      onChange={handleServiceChange}
                      placeholder="설명을 입력하세요"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceCategory" className="text-sm font-medium text-gray-700 dark:text-gray-300">카테고리</Label>
                    <Input
                      id="serviceCategory"
                      name="category"
                      value={serviceForm.category}
                      onChange={handleServiceChange}
                      placeholder="카테고리를 입력하세요"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="submit" size="sm">추가</Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setShowServiceModal(false)}>취소</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}