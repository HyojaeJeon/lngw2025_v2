
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { Button } from "@/components/ui/button.js";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_ADDRESSES, GET_SERVICES } from "@/lib/graphql/queries.js";
import { CREATE_ADDRESS, CREATE_SERVICE, CREATE_CUSTOMER } from "@/lib/graphql/mutations.js";
import { Building2, MapPin, ChevronDown, User, Phone, Mail, FileText, Calendar, Plus, Upload, X, Search, UserPlus, Camera, Eye, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/languageContext.js";
import Image from "next/image";

const AddressSelector = ({ value, onChange }) => {
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
    detailAddress: ""
  });
  const [addressType, setAddressType] = useState({ 
    provinces: [], 
    districts: [], 
    wards: [],
    provinceOpen: false,
    districtOpen: false,
    wardOpen: false
  });
  const [selected, setSelected] = useState({ province: {}, district: {}, ward: {} });
  const containerRef = useRef();

  const fetchAddressData = async (level, id = 0) => {
    const url = `https://esgoo.net/api-tinhthanh/${level}/${id}.htm`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.error === 0 ? data.data : [];
    } catch (error) {
      console.error("주소 데이터 가져오기 실패:", error);
      return [];
    }
  };

  const handleOutsideClick = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setAddressType(prev => ({ 
        ...prev, 
        provinceOpen: false, 
        districtOpen: false, 
        wardOpen: false 
      }));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    fetchAddressData(1).then(provinces => setAddressType(prev => ({ ...prev, provinces })));
  }, []);

  useEffect(() => {
    if (selected?.province?.id) {
      fetchAddressData(2, selected?.province?.id).then(districts => 
        setAddressType(prev => ({ ...prev, districts, wards: [] }))
      );
    }
  }, [selected?.province]);

  useEffect(() => {
    if (selected?.district?.id) {
      fetchAddressData(3, selected?.district?.id).then(wards => 
        setAddressType(prev => ({ ...prev, wards }))
      );
    }
  }, [selected?.district]);

  const handleSelection = (type, item) => {
    setSelected(prev => ({ ...prev, [type]: item }));

    if (type === "province") {
      setAddressType(prev => ({ 
        ...prev, 
        provinceOpen: false, 
        districtOpen: true, 
        wardOpen: false 
      }));
      setSelected(prev => ({ ...prev, district: {}, ward: {} }));
    }
    
    if (type === "district") {
      setSelected(prev => ({ ...prev, ward: {} }));
      setAddressType(prev => ({ 
        ...prev, 
        provinceOpen: false, 
        districtOpen: false, 
        wardOpen: true 
      }));
    }

    if (type === "ward") {
      setAddressType(prev => ({ 
        ...prev, 
        provinceOpen: false, 
        districtOpen: false, 
        wardOpen: false 
      }));
    }
  };

  const renderDropdown = (type, list, placeholder) => (
    <div className="relative w-full">
      <button
        type="button"
        className={`w-full h-12 px-3 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white flex items-center justify-between
                   ${selected[type]?.name ? 'font-medium' : 'text-gray-500 dark:text-gray-400'}`}
        onClick={(e) => {
          e.stopPropagation();
          setAddressType(prev => ({
            ...prev,
            [`${type}Open`]: !prev[`${type}Open`]
          }));
        }}
      >
        <span className="text-sm">
          {selected[type]?.name || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${addressType[`${type}Open`] ? 'rotate-180' : ''}`} />
      </button>

      {addressType[`${type}Open`] && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
          {list.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => handleSelection(type, item)}
            >
              {item.full_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {renderDropdown("province", addressType.provinces, "도/시 선택")}
        {renderDropdown("district", addressType.districts, "구/군 선택")}
        {renderDropdown("ward", addressType.wards, "동/읍/면 선택")}
      </div>
      <div>
        <Input
          type="text"
          placeholder="상세 주소를 입력하세요"
          className="h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
          onChange={(e) => {
            const fullAddress = `${selected.province?.name || ''} ${selected.district?.name || ''} ${selected.ward?.name || ''} ${e.target.value}`.trim();
            onChange(fullAddress);
          }}
        />
      </div>
    </div>
  );
};

const SearchableUserSelect = ({ value, onChange, placeholder }) => {
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
            <span className="text-sm text-gray-500 dark:text-gray-400">{placeholder}</span>
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

const ImageUploadSection = ({ title, images, onImagesChange, isMultiple = false }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const { url } = await response.json();
          if (isMultiple) {
            onImagesChange([...images, url]);
          } else {
            onImagesChange(url);
          }
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }
    }
  };

  const removeImage = (index) => {
    if (isMultiple) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } else {
      onImagesChange("");
    }
  };

  const openPreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</Label>
      
      <div className="flex flex-wrap gap-4">
        {/* 업로드 버튼 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">이미지 추가</span>
        </button>

        {/* 이미지 미리보기 */}
        {isMultiple ? (
          images.map((image, index) => (
            <div key={index} className="relative w-32 h-32 group">
              <Image
                src={image}
                alt={`이미지 ${index + 1}`}
                fill
                className="object-cover rounded-xl cursor-pointer"
                onClick={() => openPreview(image)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => openPreview(image)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          images && (
            <div className="relative w-32 h-32 group">
              <Image
                src={images}
                alt="프로필 이미지"
                fill
                className="object-cover rounded-xl cursor-pointer"
                onClick={() => openPreview(images)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => openPreview(images)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage()}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={isMultiple}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* 이미지 미리보기 모달 */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-4xl">
            <Image
              src={previewImage}
              alt="미리보기"
              width={800}
              height={600}
              className="object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
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
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
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
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">직책</Label>
          <Input
            type="text"
            value={contact.position || ""}
            onChange={(e) => updateContact(index, 'position', e.target.value)}
            placeholder="직책"
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
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
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">이메일</Label>
          <Input
            type="email"
            value={contact.email || ""}
            onChange={(e) => updateContact(index, 'email', e.target.value)}
            placeholder="이메일"
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">생년월일</Label>
          <Input
            type="date"
            value={contact.birthDate || ""}
            onChange={(e) => updateContact(index, 'birthDate', e.target.value)}
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
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
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">TikTok</Label>
          <Input
            type="url"
            value={contact.tiktok || ""}
            onChange={(e) => updateContact(index, 'tiktok', e.target.value)}
            placeholder="TikTok URL"
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Instagram</Label>
          <Input
            type="url"
            value={contact.instagram || ""}
            onChange={(e) => updateContact(index, 'instagram', e.target.value)}
            placeholder="Instagram URL"
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
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
    profileImage: "",
    facilityImages: [],
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
                <div className="lg:col-span-3">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">회사명 *</Label>
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="회사명을 입력하세요"
                    className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">업종</Label>
                  <Input
                    name="industry"
                    type="text"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="업종을 입력하세요"
                    className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">회사 유형</Label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className="mt-1 w-full h-12 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                  >
                    <option value="">회사 유형 선택</option>
                    {companyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">고객 등급</Label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="mt-1 w-full h-12 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                  >
                    <option value="">고객 등급 선택</option>
                    {grades.map(grade => (
                      <option key={grade.value} value={grade.value}>{grade.label}</option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">주소</Label>
                  <div className="mt-1">
                    <AddressSelector
                      value={formData.address}
                      onChange={(address) => setFormData(prev => ({...prev, address}))}
                    />
                  </div>
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

          {/* 이미지 업로드 */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                이미지 등록
              </CardTitle>
              <CardDescription className="text-purple-100">
                고객사의 프로필 이미지와 시설 사진을 등록해 주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ImageUploadSection
                  title="고객사 프로필 이미지"
                  images={formData.profileImage}
                  onImagesChange={(image) => setFormData(prev => ({...prev, profileImage: image}))}
                  isMultiple={false}
                />
                
                <ImageUploadSection
                  title="시설 사진"
                  images={formData.facilityImages}
                  onImagesChange={(images) => setFormData(prev => ({...prev, facilityImages: images}))}
                  isMultiple={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* 담당자 정보 */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                담당자 정보
              </CardTitle>
              <CardDescription className="text-orange-100">
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
