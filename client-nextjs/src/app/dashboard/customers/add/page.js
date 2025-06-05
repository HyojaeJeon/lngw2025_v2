
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { Button } from "@/components/ui/button.js";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GET_USERS, GET_ADDRESSES, GET_SERVICES, CHECK_COMPANY_NAME } from "@/lib/graphql/queries.js";
import { CREATE_ADDRESS, CREATE_SERVICE, CREATE_CUSTOMER } from "@/lib/graphql/mutations.js";
import { Building2, MapPin, ChevronDown, User, Phone, Mail, FileText, Calendar, Plus, Upload, X, Search, UserPlus, Camera, Eye, ImageIcon, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/languageContext.js";
import Image from "next/image";
import imageCompression from 'browser-image-compression';
import { useRouter } from "next/navigation";
import { CustomCalendar } from "@/components/common/CustomCalendar.js";

export default function AddCustomerPage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    companyType: "",
    customCompanyType: "",
    grade: "",
    customGrade: "",
    address: "",
    assignedUserId: "",
    profileImage: "",
    facilityImages: [],
    facebook: "",
    tiktok: "",
    instagram: "",
    contacts: []
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [companyNameError, setCompanyNameError] = useState("");
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeContactIndex, setActiveContactIndex] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  // Address selection state
  const [addressData, setAddressData] = useState({ provinces: [], districts: [], wards: [] });
  const [selectedAddress, setSelectedAddress] = useState({ province: {}, district: {}, ward: {} });
  const [addressDropdownStates, setAddressDropdownStates] = useState({ 
    provinceOpen: false, 
    districtOpen: false, 
    wardOpen: false 
  });

  const dropdownRef = useRef(null);
  const addressDropdownRefs = useRef({});

  // GraphQL hooks
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: { limit: 20, offset: 0, search: userSearchTerm },
    onError: (error) => console.error("Users query error:", error)
  });
  const [checkCompanyName] = useLazyQuery(CHECK_COMPANY_NAME);
  const [createCustomer, { loading: createLoading }] = useMutation(CREATE_CUSTOMER);

  const users = usersData?.users || [];

  // Address API functions
  const fetchAddressData = async (level, parentId = null) => {
    const endpoints = {
      1: 'https://provinces.open-api.vn/api/p/',
      2: `https://provinces.open-api.vn/api/p/${parentId}?depth=2`,
      3: `https://provinces.open-api.vn/api/d/${parentId}?depth=2`
    };

    try {
      const response = await fetch(endpoints[level]);
      const data = await response.json();
      return level === 1 ? data : (level === 2 ? data.districts : data.wards);
    } catch (error) {
      console.error('주소 데이터 로드 실패:', error);
      return [];
    }
  };

  // Event handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      Object.keys(addressDropdownRefs.current).forEach(key => {
        if (addressDropdownRefs.current[key] && !addressDropdownRefs.current[key].contains(event.target)) {
          setAddressDropdownStates(prev => ({ ...prev, [`${key}Open`]: false }));
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAddressData(1).then(provinces => setAddressData(prev => ({ ...prev, provinces })));
  }, []);

  useEffect(() => {
    if (selectedAddress?.province?.code) {
      fetchAddressData(2, selectedAddress.province.code).then(districts => 
        setAddressData(prev => ({ ...prev, districts, wards: [] }))
      );
    }
  }, [selectedAddress?.province]);

  useEffect(() => {
    if (selectedAddress?.district?.code) {
      fetchAddressData(3, selectedAddress.district.code).then(wards => 
        setAddressData(prev => ({ ...prev, wards }))
      );
    }
  }, [selectedAddress?.district]);

  // 회사명 중복 검사
  const handleCompanyNameChange = async (e) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
    setCompanyNameError("");

    if (name.trim().length >= 2) {
      setIsCheckingName(true);
      try {
        const { data } = await checkCompanyName({ variables: { name: name.trim() } });
        if (!data.checkCompanyName) {
          setCompanyNameError("이미 등록된 회사명입니다.");
        }
      } catch (error) {
        console.error("회사명 검사 오류:", error);
      } finally {
        setIsCheckingName(false);
      }
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // 담당자 추가/제거
  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
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
        }
      ]
    }));
  };

  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const updateContact = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  // 이미지 업로드
  const handleImageUpload = async (e, isMultiple = false, contactIndex = null) => {
    const files = Array.from(e.target.files);
    setImageLoading(true);
    
    try {
      const uploadedImages = [];
      
      for (const file of files) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        
        const formDataUpload = new FormData();
        formDataUpload.append('file', compressedFile);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        });
        
        if (response.ok) {
          const { url } = await response.json();
          uploadedImages.push(url);
        }
      }
      
      if (contactIndex !== null) {
        updateContact(contactIndex, 'profileImage', uploadedImages[0] || '');
      } else if (isMultiple) {
        const currentImages = formData.facilityImages || [];
        if (currentImages.length + uploadedImages.length <= 5) {
          setFormData(prev => ({ ...prev, facilityImages: [...currentImages, ...uploadedImages] }));
        } else {
          alert('최대 5개까지만 업로드 가능합니다.');
        }
      } else {
        setFormData(prev => ({ ...prev, profileImage: uploadedImages[0] || '' }));
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    } finally {
      setImageLoading(false);
    }
  };

  // 주소 선택 핸들러
  const handleAddressSelection = (type, item) => {
    setSelectedAddress(prev => ({ ...prev, [type]: item }));

    if (type === "province") {
      setAddressDropdownStates({ provinceOpen: false, districtOpen: false, wardOpen: false });
      setSelectedAddress(prev => ({ ...prev, district: {}, ward: {} }));
    } else if (type === "district") {
      setSelectedAddress(prev => ({ ...prev, ward: {} }));
      setAddressDropdownStates(prev => ({ ...prev, districtOpen: false, wardOpen: false }));
    } else if (type === "ward") {
      setAddressDropdownStates(prev => ({ ...prev, wardOpen: false }));
      const fullAddress = `${selectedAddress.province.name} ${selectedAddress.district.name} ${item.name}`;
      setFormData(prev => ({ ...prev, address: fullAddress }));
    }
  };

  // 생년월일 선택 핸들러
  const handleBirthDateSelect = (date, contactIndex) => {
    updateContact(contactIndex, 'birthDate', date);
    setShowCalendar(false);
    setActiveContactIndex(null);
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "회사명은 필수입니다.";
    if (companyNameError) newErrors.name = companyNameError;
    if (!formData.industry) newErrors.industry = "업종은 필수입니다.";
    if (!formData.companyType) newErrors.companyType = "회사유형은 필수입니다.";
    if (!formData.grade) newErrors.grade = "고객등급은 필수입니다.";
    if (!formData.address.trim()) newErrors.address = "주소는 필수입니다.";
    if (formData.contacts.length === 0) newErrors.contacts = "담당자는 최소 1명 이상 등록해야 합니다.";

    formData.contacts.forEach((contact, index) => {
      if (!contact.name.trim()) {
        newErrors[`contact_${index}_name`] = "담당자 이름은 필수입니다.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    try {
      const submitData = {
        ...formData,
        assignedUserId: selectedUser?.id || "",
        grade: formData.grade.includes("기타") ? formData.customGrade : formData.grade,
        companyType: formData.companyType === "기타" ? formData.customCompanyType : formData.companyType
      };

      await createCustomer({ variables: { input: submitData } });
      alert("고객사가 성공적으로 등록되었습니다.");
      router.push('/dashboard/customers');
    } catch (error) {
      console.error("고객사 등록 실패:", error);
      alert("고객사 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 이미지 로딩 모달 */}
      {imageLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 dark:text-gray-300">이미지를 처리 중입니다...</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-6 h-6 mr-2" />
            새 고객사 등록
          </CardTitle>
          <CardDescription>
            새로운 고객사 정보를 등록합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">회사명 *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleCompanyNameChange}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {isCheckingName && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {(errors.name || companyNameError) && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name || companyNameError}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contactName">대표자명</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="industry">업종 *</Label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.industry ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">업종 선택</option>
                  <option value="제조업">제조업</option>
                  <option value="서비스업">서비스업</option>
                  <option value="IT">IT</option>
                  <option value="금융">금융</option>
                  <option value="유통">유통</option>
                  <option value="건설">건설</option>
                  <option value="뷰티">뷰티</option>
                  <option value="기타">기타</option>
                </select>
                {errors.industry && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.industry}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="companyType">회사유형 *</Label>
                <select
                  id="companyType"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.companyType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">회사유형 선택</option>
                  <option value="대기업">대기업</option>
                  <option value="중견기업">중견기업</option>
                  <option value="중소기업">중소기업</option>
                  <option value="스타트업">스타트업</option>
                  <option value="기타">기타</option>
                </select>
                {errors.companyType && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.companyType}
                  </p>
                )}
              </div>

              {formData.companyType === "기타" && (
                <div>
                  <Label htmlFor="customCompanyType">기타 회사유형</Label>
                  <Input
                    id="customCompanyType"
                    name="customCompanyType"
                    value={formData.customCompanyType}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="grade">고객등급 *</Label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.grade ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">고객등급 선택</option>
                  <option value="A급 (VIP)">A급 (VIP)</option>
                  <option value="B급 (우수)">B급 (우수)</option>
                  <option value="C급 (일반)">C급 (일반)</option>
                  <option value="기타">기타</option>
                </select>
                {errors.grade && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.grade}
                  </p>
                )}
              </div>

              {formData.grade === "기타" && (
                <div>
                  <Label htmlFor="customGrade">기타 고객등급</Label>
                  <Input
                    id="customGrade"
                    name="customGrade"
                    value={formData.customGrade}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>

            {/* 주소 선택 */}
            <div>
              <Label>주소 *</Label>
              <div className="grid grid-cols-3 gap-4">
                {/* 시/도 선택 */}
                <div className="relative" ref={el => addressDropdownRefs.current.province = el}>
                  <div
                    onClick={() => setAddressDropdownStates(prev => ({ 
                      ...prev, 
                      provinceOpen: !prev.provinceOpen 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center justify-between bg-white hover:border-blue-500"
                  >
                    <span className={selectedAddress.province?.name ? "text-gray-900" : "text-gray-500"}>
                      {selectedAddress.province?.name || "시/도 선택"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      addressDropdownStates.provinceOpen ? 'rotate-180' : ''
                    }`} />
                  </div>
                  {addressDropdownStates.provinceOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {addressData.provinces.map((item) => (
                        <div
                          key={item.code}
                          onClick={() => handleAddressSelection('province', item)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 구/군 선택 */}
                <div className="relative" ref={el => addressDropdownRefs.current.district = el}>
                  <div
                    onClick={() => selectedAddress.province?.code && setAddressDropdownStates(prev => ({ 
                      ...prev, 
                      districtOpen: !prev.districtOpen 
                    }))}
                    className={`w-full px-3 py-2 border rounded-md cursor-pointer flex items-center justify-between ${
                      selectedAddress.province?.code 
                        ? 'bg-white border-gray-300 hover:border-blue-500' 
                        : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <span className={selectedAddress.district?.name ? "text-gray-900" : "text-gray-500"}>
                      {selectedAddress.district?.name || "구/군 선택"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      addressDropdownStates.districtOpen ? 'rotate-180' : ''
                    }`} />
                  </div>
                  {addressDropdownStates.districtOpen && selectedAddress.province?.code && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {addressData.districts.map((item) => (
                        <div
                          key={item.code}
                          onClick={() => handleAddressSelection('district', item)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 동/읍/면 선택 */}
                <div className="relative" ref={el => addressDropdownRefs.current.ward = el}>
                  <div
                    onClick={() => selectedAddress.district?.code && setAddressDropdownStates(prev => ({ 
                      ...prev, 
                      wardOpen: !prev.wardOpen 
                    }))}
                    className={`w-full px-3 py-2 border rounded-md cursor-pointer flex items-center justify-between ${
                      selectedAddress.district?.code 
                        ? 'bg-white border-gray-300 hover:border-blue-500' 
                        : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <span className={selectedAddress.ward?.name ? "text-gray-900" : "text-gray-500"}>
                      {selectedAddress.ward?.name || "동/읍/면 선택"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      addressDropdownStates.wardOpen ? 'rotate-180' : ''
                    }`} />
                  </div>
                  {addressDropdownStates.wardOpen && selectedAddress.district?.code && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {addressData.wards.map((item) => (
                        <div
                          key={item.code}
                          onClick={() => handleAddressSelection('ward', item)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {errors.address && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.address}
                </p>
              )}
            </div>

            {/* 담당 영업사원 선택 */}
            <div>
              <Label>담당 영업사원</Label>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center justify-between bg-white hover:border-blue-500"
                >
                  <span className={selectedUser ? "text-gray-900" : "text-gray-500"}>
                    {selectedUser ? `${selectedUser.name} (${selectedUser.department})` : "담당 영업사원 선택"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isUserDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </div>

                {isUserDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-64 overflow-hidden">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="사용자 검색..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto">
                      {users.length > 0 ? (
                        users.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => {
                              setSelectedUser(user);
                              setIsUserDropdownOpen(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {user.department} · {user.position}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          {usersLoading ? "로딩 중..." : "검색 결과가 없습니다"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 프로필 이미지 */}
              <div>
                <Label>프로필 이미지</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                    id="profileImage"
                  />
                  <label htmlFor="profileImage" className="cursor-pointer block">
                    <div className="text-center">
                      {formData.profileImage ? (
                        <div className="relative">
                          <Image
                            src={formData.profileImage}
                            alt="프로필"
                            width={128}
                            height={128}
                            className="mx-auto rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, profileImage: '' }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">클릭하여 이미지 업로드</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* 시설 이미지 */}
              <div>
                <Label>시설 이미지 (최대 5개)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                    id="facilityImages"
                  />
                  <label htmlFor="facilityImages" className="cursor-pointer block">
                    <div className="text-center">
                      {formData.facilityImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {formData.facilityImages.map((image, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={image}
                                alt={`시설 ${index + 1}`}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setFormData(prev => ({
                                    ...prev,
                                    facilityImages: prev.facilityImages.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          {formData.facilityImages.length < 5 && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                              <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-8">
                          <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">클릭하여 이미지 업로드</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 담당자 정보 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>담당자 정보 *</Label>
                <Button
                  type="button"
                  onClick={addContact}
                  variant="outline"
                  size="sm"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  담당자 추가
                </Button>
              </div>
              {errors.contacts && (
                <p className="text-sm text-red-500 flex items-center mb-4">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.contacts}
                </p>
              )}

              {formData.contacts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  담당자를 추가해주세요. (최소 1명 이상 필수)
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.contacts.map((contact, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">담당자 {index + 1}</CardTitle>
                          {formData.contacts.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeContact(index)}
                              variant="outline"
                              size="sm"
                              className="text-red-500 border-red-500 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>이름 *</Label>
                            <Input
                              value={contact.name}
                              onChange={(e) => updateContact(index, 'name', e.target.value)}
                              placeholder="담당자 이름"
                              className={errors[`contact_${index}_name`] ? 'border-red-500' : ''}
                            />
                            {errors[`contact_${index}_name`] && (
                              <p className="text-sm text-red-500 flex items-center mt-1">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors[`contact_${index}_name`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label>부서</Label>
                            <Input
                              value={contact.department}
                              onChange={(e) => updateContact(index, 'department', e.target.value)}
                              placeholder="부서명"
                            />
                          </div>

                          <div>
                            <Label>직책</Label>
                            <Input
                              value={contact.position}
                              onChange={(e) => updateContact(index, 'position', e.target.value)}
                              placeholder="직책"
                            />
                          </div>

                          <div>
                            <Label>전화번호</Label>
                            <Input
                              value={contact.phone}
                              onChange={(e) => updateContact(index, 'phone', e.target.value)}
                              placeholder="전화번호"
                            />
                          </div>

                          <div>
                            <Label>이메일</Label>
                            <Input
                              type="email"
                              value={contact.email}
                              onChange={(e) => updateContact(index, 'email', e.target.value)}
                              placeholder="이메일"
                            />
                          </div>

                          <div>
                            <Label>생년월일</Label>
                            <div className="relative">
                              <Input
                                value={contact.birthDate}
                                onClick={() => {
                                  setActiveContactIndex(index);
                                  setShowCalendar(true);
                                }}
                                placeholder="생년월일 선택"
                                readOnly
                                className="cursor-pointer"
                              />
                              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </div>

                          <div>
                            <Label>Facebook</Label>
                            <Input
                              value={contact.facebook}
                              onChange={(e) => updateContact(index, 'facebook', e.target.value)}
                              placeholder="Facebook URL"
                            />
                          </div>

                          <div>
                            <Label>TikTok</Label>
                            <Input
                              value={contact.tiktok}
                              onChange={(e) => updateContact(index, 'tiktok', e.target.value)}
                              placeholder="TikTok URL"
                            />
                          </div>

                          <div>
                            <Label>Instagram</Label>
                            <Input
                              value={contact.instagram}
                              onChange={(e) => updateContact(index, 'instagram', e.target.value)}
                              placeholder="Instagram URL"
                            />
                          </div>
                        </div>

                        {/* 담당자 프로필 이미지 */}
                        <div className="mt-4">
                          <Label>프로필 이미지</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, false, index)}
                              className="hidden"
                              id={`contactImage_${index}`}
                            />
                            <label htmlFor={`contactImage_${index}`} className="cursor-pointer block">
                              <div className="text-center">
                                {contact.profileImage ? (
                                  <div className="relative inline-block">
                                    <Image
                                      src={contact.profileImage}
                                      alt={`담당자 ${index + 1} 프로필`}
                                      width={80}
                                      height={80}
                                      className="rounded-lg object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateContact(index, 'profileImage', '');
                                      }}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="py-4">
                                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                                    <p className="text-sm text-gray-500 mt-1">클릭하여 이미지 업로드</p>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* SNS 정보 */}
            <div>
              <Label>SNS 정보</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="Facebook URL"
                  />
                </div>

                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleInputChange}
                    placeholder="TikTok URL"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram URL"
                  />
                </div>
              </div>
            </div>

            {/* 등록 버튼 */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={createLoading || isCheckingName || !!companyNameError}
              >
                {createLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    등록 중...
                  </>
                ) : (
                  "고객사 등록"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 캘린더 모달 */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">생년월일 선택</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCalendar(false);
                  setActiveContactIndex(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CustomCalendar
              onDateSelect={(date) => handleBirthDateSelect(date, activeContactIndex)}
              selectedDate={activeContactIndex !== null ? formData.contacts[activeContactIndex]?.birthDate : null}
            />
          </div>
        </div>
      )}
    </div>
  );
}
