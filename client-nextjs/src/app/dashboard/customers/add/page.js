

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

// 이미지 로딩 모달 컴포넌트
const ImageLoadingModal = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-700 dark:text-gray-300">이미지를 처리 중입니다...</p>
      </div>
    </div>
  );
};

// 이미지 업로더 컴포넌트
const ImageUploader = ({ images, onImagesChange, isMultiple = false, maxImages = 5 }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (isMultiple && images.length + files.length > maxImages) {
      alert(`최대 ${maxImages}개까지만 업로드 가능합니다.`);
      return;
    }
    
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
        
        const formData = new FormData();
        formData.append('file', compressedFile);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const { url } = await response.json();
          uploadedImages.push(url);
        }
      }
      
      if (isMultiple) {
        onImagesChange([...images, ...uploadedImages]);
      } else {
        onImagesChange(uploadedImages[0] || '');
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = (index) => {
    if (isMultiple) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } else {
      onImagesChange('');
    }
  };

  return (
    <>
      <ImageLoadingModal isVisible={imageLoading} />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isMultiple ? `시설사진 (최대 ${maxImages}개)` : '프로필 이미지'}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageLoading || (isMultiple && images.length >= maxImages)}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>업로드</span>
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={isMultiple}
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* 이미지 미리보기 */}
        <div className={`grid gap-4 ${isMultiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
          {isMultiple ? (
            images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={image}
                    alt={`시설사진 ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            images && (
              <div className="relative group w-32 h-32">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={images}
                    alt="프로필 이미지"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(0)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

// 사용자 선택 드롭다운
const UserSelectDropdown = ({ selectedUser, onUserSelect, placeholder = "담당 영업사원 선택" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between hover:border-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className={selectedUser ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
          {selectedUser ? `${selectedUser.name} (${selectedUser.department})` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="사용자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto" onScroll={handleScroll}>
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onUserSelect(user);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.department} · {user.position}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                {loading ? "로딩 중..." : "검색 결과가 없습니다"}
              </div>
            )}
            
            {loading && users.length > 0 && (
              <div className="px-4 py-2 text-center">
                <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// 주소 선택 드롭다운
const AddressSelectDropdown = ({ selectedAddress, onAddressChange }) => {
  const [addressData, setAddressData] = useState({ provinces: [], districts: [], wards: [] });
  const [selected, setSelected] = useState({ province: {}, district: {}, ward: {} });
  const [dropdownStates, setDropdownStates] = useState({ 
    provinceOpen: false, 
    districtOpen: false, 
    wardOpen: false 
  });
  const dropdownRefs = useRef({});

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          setDropdownStates(prev => ({ ...prev, [`${key}Open`]: false }));
        }
      });
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    fetchAddressData(1).then(provinces => setAddressData(prev => ({ ...prev, provinces })));
  }, []);

  useEffect(() => {
    if (selected?.province?.code) {
      fetchAddressData(2, selected.province.code).then(districts => 
        setAddressData(prev => ({ ...prev, districts, wards: [] }))
      );
    }
  }, [selected?.province]);

  useEffect(() => {
    if (selected?.district?.code) {
      fetchAddressData(3, selected.district.code).then(wards => 
        setAddressData(prev => ({ ...prev, wards }))
      );
    }
  }, [selected?.district]);

  const handleSelection = (type, item) => {
    setSelected(prev => ({ ...prev, [type]: item }));

    if (type === "province") {
      setDropdownStates({ provinceOpen: false, districtOpen: false, wardOpen: false });
      setSelected(prev => ({ ...prev, district: {}, ward: {} }));
    } else if (type === "district") {
      setSelected(prev => ({ ...prev, ward: {} }));
      setDropdownStates(prev => ({ ...prev, districtOpen: false, wardOpen: false }));
    } else if (type === "ward") {
      setDropdownStates(prev => ({ ...prev, wardOpen: false }));
      const fullAddress = `${selected.province.name} ${selected.district.name} ${item.name}`;
      onAddressChange(fullAddress);
    }
  };

  const DropdownComponent = ({ type, data, placeholder, isDisabled }) => (
    <div className="relative" ref={el => dropdownRefs.current[type] = el}>
      <div
        onClick={() => !isDisabled && setDropdownStates(prev => ({ 
          ...prev, 
          [`${type}Open`]: !prev[`${type}Open`] 
        }))}
        className={`w-full px-3 py-2 border rounded-md cursor-pointer flex items-center justify-between transition-colors ${
          isDisabled 
            ? 'bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 cursor-not-allowed text-gray-400' 
            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-500 text-gray-900 dark:text-white'
        }`}
      >
        <span className={selected[type]?.name ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
          {selected[type]?.name || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
          dropdownStates[`${type}Open`] ? 'rotate-180' : ''
        }`} />
      </div>

      {dropdownStates[`${type}Open`] && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {data.map((item) => (
            <div
              key={item.code}
              onClick={() => handleSelection(type, item)}
              className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white transition-colors"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <DropdownComponent 
        type="province"
        data={addressData.provinces}
        placeholder="도/시 선택"
        isDisabled={false}
      />
      <DropdownComponent 
        type="district"
        data={addressData.districts}
        placeholder="구/군 선택"
        isDisabled={!selected.province?.code}
      />
      <DropdownComponent 
        type="ward"
        data={addressData.wards}
        placeholder="동/읍/면 선택"
        isDisabled={!selected.district?.code}
      />
    </div>
  );
};

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

  // GraphQL hooks
  const [checkCompanyName] = useLazyQuery(CHECK_COMPANY_NAME);
  const [createCustomer, { loading: createLoading }] = useMutation(CREATE_CUSTOMER);

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

  // 담당자 추가
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

  // 담당자 제거
  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  // 담당자 정보 업데이트
  const updateContact = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
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

    // 담당자 유효성 검사
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('customers.add')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            새로운 고객사 정보를 등록합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Building2 className="w-6 h-6 mr-3 text-blue-500" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    회사명 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleCompanyNameChange}
                      className={`${errors.name ? 'border-red-500' : ''}`}
                      placeholder="회사명을 입력하세요"
                    />
                    {isCheckingName && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {(errors.name || companyNameError) && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name || companyNameError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    대표자명
                  </Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="대표자명을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    전화번호
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="전화번호를 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    업종 <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.industry ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.industry}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    회사유형 <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="companyType"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.companyType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.companyType}
                    </p>
                  )}
                </div>

                {formData.companyType === "기타" && (
                  <div className="space-y-2">
                    <Label htmlFor="customCompanyType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      기타 회사유형
                    </Label>
                    <Input
                      id="customCompanyType"
                      name="customCompanyType"
                      value={formData.customCompanyType}
                      onChange={handleInputChange}
                      placeholder="회사유형을 입력하세요"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    고객등급 <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.grade ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">고객등급 선택</option>
                    <option value="A급 (VIP)">A급 (VIP)</option>
                    <option value="B급 (우수)">B급 (우수)</option>
                    <option value="C급 (일반)">C급 (일반)</option>
                    <option value="기타">기타</option>
                  </select>
                  {errors.grade && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.grade}
                    </p>
                  )}
                </div>

                {formData.grade === "기타" && (
                  <div className="space-y-2">
                    <Label htmlFor="customGrade" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      기타 고객등급
                    </Label>
                    <Input
                      id="customGrade"
                      name="customGrade"
                      value={formData.customGrade}
                      onChange={handleInputChange}
                      placeholder="고객등급을 입력하세요"
                    />
                  </div>
                )}
              </div>

              {/* 주소 선택 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  주소 <span className="text-red-500">*</span>
                </Label>
                <AddressSelectDropdown
                  selectedAddress={formData.address}
                  onAddressChange={(address) => setFormData(prev => ({ ...prev, address }))}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* 담당 영업사원 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  담당 영업사원
                </Label>
                <UserSelectDropdown
                  selectedUser={selectedUser}
                  onUserSelect={setSelectedUser}
                />
              </div>
            </CardContent>
          </Card>

          {/* 이미지 업로드 */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Camera className="w-6 h-6 mr-3 text-blue-500" />
                이미지 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploader
                  images={formData.profileImage}
                  onImagesChange={(image) => setFormData(prev => ({ ...prev, profileImage: image }))}
                  isMultiple={false}
                />
                <ImageUploader
                  images={formData.facilityImages}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, facilityImages: images }))}
                  isMultiple={true}
                  maxImages={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* 담당자 정보 */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <User className="w-6 h-6 mr-3 text-blue-500" />
                  담당자 정보 <span className="text-red-500">*</span>
                </CardTitle>
                <Button
                  type="button"
                  onClick={addContact}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>담당자 추가</span>
                </Button>
              </div>
              {errors.contacts && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.contacts}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.contacts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  담당자를 추가해주세요. (최소 1명 이상 필수)
                </div>
              ) : (
                formData.contacts.map((contact, index) => (
                  <div key={index} className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        담당자 {index + 1}
                      </h3>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          이름 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={contact.name}
                          onChange={(e) => updateContact(index, 'name', e.target.value)}
                          placeholder="담당자 이름"
                          className={errors[`contact_${index}_name`] ? 'border-red-500' : ''}
                        />
                        {errors[`contact_${index}_name`] && (
                          <p className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors[`contact_${index}_name`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          부서
                        </Label>
                        <Input
                          value={contact.department}
                          onChange={(e) => updateContact(index, 'department', e.target.value)}
                          placeholder="부서명"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          직책
                        </Label>
                        <Input
                          value={contact.position}
                          onChange={(e) => updateContact(index, 'position', e.target.value)}
                          placeholder="직책"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          전화번호
                        </Label>
                        <Input
                          value={contact.phone}
                          onChange={(e) => updateContact(index, 'phone', e.target.value)}
                          placeholder="전화번호"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          이메일
                        </Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateContact(index, 'email', e.target.value)}
                          placeholder="이메일"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          생년월일
                        </Label>
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

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Facebook
                        </Label>
                        <Input
                          value={contact.facebook}
                          onChange={(e) => updateContact(index, 'facebook', e.target.value)}
                          placeholder="Facebook URL"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          TikTok
                        </Label>
                        <Input
                          value={contact.tiktok}
                          onChange={(e) => updateContact(index, 'tiktok', e.target.value)}
                          placeholder="TikTok URL"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Instagram
                        </Label>
                        <Input
                          value={contact.instagram}
                          onChange={(e) => updateContact(index, 'instagram', e.target.value)}
                          placeholder="Instagram URL"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        프로필 이미지
                      </Label>
                      <ImageUploader
                        images={contact.profileImage}
                        onImagesChange={(image) => updateContact(index, 'profileImage', image)}
                        isMultiple={false}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* SNS 정보 */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <FileText className="w-6 h-6 mr-3 text-blue-500" />
                SNS 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="Facebook URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    TikTok
                  </Label>
                  <Input
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleInputChange}
                    placeholder="TikTok URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram URL"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 등록 버튼 */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-8 py-2"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={createLoading || isCheckingName || !!companyNameError}
              className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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

        {/* 캘린더 모달 */}
        {showCalendar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">생년월일 선택</h3>
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
    </div>
  );
}
