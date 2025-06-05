
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
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
import { GET_CUSTOMER, GET_USERS, CHECK_COMPANY_NAME } from "@/lib/graphql/queries.js";
import {
  UPDATE_CUSTOMER,
  ADD_CONTACT_PERSON,
  UPDATE_CONTACT_PERSON,
  DELETE_CONTACT_PERSON,
  ADD_CUSTOMER_IMAGE,
  DELETE_CUSTOMER_IMAGE,
} from "@/lib/graphql/mutations.js";
import {
  Building2,
  User,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  ArrowLeft,
  UserCheck,
  Camera,
  Eye,
  ImageIcon,
  Users,
  Award,
  TrendingUp,
  Clock,
  Globe,
  Star,
  Activity,
  FileText,
  CreditCard,
  Briefcase,
  ChevronDown,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const AddressSelector = ({ value, onChange, isEditing }) => {
  const { t } = useLanguage();
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
  });
  const [addressType, setAddressType] = useState({
    provinces: [],
    districts: [],
    wards: [],
    provinceOpen: false,
    districtOpen: false,
    wardOpen: false,
  });
  const [selected, setSelected] = useState({
    province: {},
    district: {},
    ward: {},
  });
  const containerRef = useRef();
  const provinceRef = useRef();
  const districtRef = useRef();
  const wardRef = useRef();

  // Parse and set existing address
  useEffect(() => {
    if (value && typeof value === "string") {
      const addressParts = value.split(" ").filter((part) => part.trim());
      if (addressParts.length >= 3) {
        const [provinceName, districtName, wardName, ...detailParts] =
          addressParts;
        
        // Set display values for read mode
        setAddress((prev) => ({
          ...prev,
          province: provinceName,
          district: districtName,
          ward: wardName,
          detailAddress: detailParts.join(" "),
        }));

        // For edit mode, try to find matching items in the dropdown lists
        if (isEditing && addressType.provinces.length > 0) {
          const matchingProvince = addressType.provinces.find(p => 
            p.full_name.includes(provinceName) || p.name === provinceName
          );
          if (matchingProvince) {
            setSelected(prev => ({ ...prev, province: matchingProvince }));
          }
        }
      }
    }
  }, [value, isEditing, addressType.provinces]);

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
      setAddressType((prev) => ({
        ...prev,
        provinceOpen: false,
        districtOpen: false,
        wardOpen: false,
      }));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    fetchAddressData(1).then((provinces) =>
      setAddressType((prev) => ({ ...prev, provinces })),
    );
  }, []);

  useEffect(() => {
    if (selected?.province?.id) {
      fetchAddressData(2, selected?.province?.id).then((districts) =>
        setAddressType((prev) => ({ ...prev, districts, wards: [] })),
      );
    }
  }, [selected?.province]);

  useEffect(() => {
    if (selected?.district?.id) {
      fetchAddressData(3, selected?.district?.id).then((wards) =>
        setAddressType((prev) => ({ ...prev, wards })),
      );
    }
  }, [selected?.district]);

  const handleSelection = (type, item) => {
    setSelected((prev) => ({ ...prev, [type]: item }));

    if (type === "province") {
      setAddressType((prev) => ({
        ...prev,
        provinceOpen: false,
        districtOpen: true,
        wardOpen: false,
      }));
      setSelected((prev) => ({ ...prev, district: {}, ward: {} }));
    }

    if (type === "district") {
      setSelected((prev) => ({ ...prev, ward: {} }));
      setAddressType((prev) => ({
        ...prev,
        provinceOpen: false,
        districtOpen: false,
        wardOpen: true,
      }));
    }

    if (type === "ward") {
      setAddressType((prev) => ({
        ...prev,
        provinceOpen: false,
        districtOpen: false,
        wardOpen: false,
      }));
    }
  };

  const renderDropdown = (type, list, placeholder, ref) => (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className={`w-full h-12 px-3 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white flex items-center justify-between
                   ${selected[type]?.name || address[type] ? "font-medium" : "text-gray-500 dark:text-gray-400"}
                   ${(type === "district" && !selected?.province?.id) || (type === "ward" && !selected?.district?.id) ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (
            (type === "district" && !selected?.province?.id) ||
            (type === "ward" && !selected?.district?.id)
          )
            return;
          setAddressType((prev) => ({
            ...prev,
            [`${type}Open`]: !prev[`${type}Open`],
          }));
        }}
        disabled={
          !isEditing ||
          (type === "district" && !selected?.province?.id) ||
          (type === "ward" && !selected?.district?.id)
        }
      >
        <span className="text-sm">
          {selected[type]?.name || address[type] || placeholder}
        </span>
        {isEditing && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${addressType[`${type}Open`] ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isEditing && addressType[`${type}Open`] && (
        <div
          className="fixed left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-[50000] max-h-60 overflow-y-auto"
          style={{
            top: `${ref.current?.getBoundingClientRect().bottom + window.scrollY + 4}px`,
            left: `${ref.current?.getBoundingClientRect().left}px`,
            width: `${ref.current?.getBoundingClientRect().width}px`,
          }}
        >
          {list.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => {
                handleSelection(type, item);
                const fullAddress =
                  `${type === "province" ? item.full_name : selected.province?.name || address.province || ""} ${
                    type === "district"
                      ? item.full_name
                      : selected.district?.name || address.district || ""
                  } ${type === "ward" ? item.full_name : selected.ward?.name || address.ward || ""} ${address.detailAddress || ""}`.trim();
                onChange(fullAddress);
              }}
            >
              {item.full_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (!isEditing) {
    const addressParts = value
      ? value.split(" ").filter((part) => part.trim())
      : [];
    const [provinceName, districtName, wardName, ...detailParts] = addressParts;

    return (
      <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
        {addressParts.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-sm">
                <span className="font-medium text-gray-500">도/시:</span>
                <div className="mt-1">{provinceName || "-"}</div>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-500">구/군:</span>
                <div className="mt-1">{districtName || "-"}</div>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-500">동/읍/면:</span>
                <div className="mt-1">{wardName || "-"}</div>
              </div>
            </div>
            {detailParts.length > 0 && (
              <div className="text-sm">
                <span className="font-medium text-gray-500">상세주소:</span>
                <div className="mt-1">{detailParts.join(" ")}</div>
              </div>
            )}
          </div>
        ) : (
          "주소 정보 없음"
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4 relative z-50">
      <div className="grid grid-cols-3 gap-4 relative">
        {renderDropdown(
          "province",
          addressType.provinces,
          t("address.selectProvince") || "도/시 선택",
          provinceRef,
        )}
        {renderDropdown(
          "district",
          addressType.districts,
          t("address.selectDistrict") || "구/군 선택",
          districtRef,
        )}
        {renderDropdown(
          "ward",
          addressType.wards,
          t("address.selectWard") || "동/읍/면 선택",
          wardRef,
        )}
      </div>
      <div>
        <Input
          type="text"
          value={address.detailAddress}
          placeholder={t("address.detailAddress") || "상세 주소를 입력하세요"}
          className="h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
          onChange={(e) => {
            const newDetailAddress = e.target.value;
            setAddress((prev) => ({ ...prev, detailAddress: newDetailAddress }));
            const fullAddress =
              `${selected.province?.name || address.province || ""} ${selected.district?.name || address.district || ""} ${selected.ward?.name || address.ward || ""} ${newDetailAddress}`.trim();
            onChange(fullAddress);
          }}
        />
      </div>
    </div>
  );
};

const ImageGallerySection = ({
  title,
  images,
  isProfile = false,
  onAddImage,
  onDeleteImage,
  canEdit = false,
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef();

  const galleryImages = Array.isArray(images)
    ? images.map((img) => ({
        original: typeof img === "string" ? img : img.imageUrl,
        thumbnail: typeof img === "string" ? img : img.imageUrl,
        description: typeof img === "object" ? img.description : "",
        id: typeof img === "object" ? img.id : null,
      }))
    : images
      ? [
          {
            original: images,
            thumbnail: images,
            description: title,
            id: null,
          },
        ]
      : [];

  const openGallery = (index = 0) => {
    setCurrentIndex(index);
    setShowGallery(true);
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.urls && result.urls.length > 0) {
          result.urls.forEach((url, index) => {
            onAddImage({
              imageUrl: url,
              imageType: isProfile ? "profile" : "facility",
              description: `${title} ${galleryImages.length + index + 1}`,
              sortOrder: galleryImages.length + index,
            });
          });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  if (galleryImages.length === 0 && !canEdit) {
    return (
      <div className="text-center py-8">
        <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          등록된 이미지가 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </Label>
        {canEdit && (
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>이미지 추가</span>
            </Button>
          </div>
        )}
      </div>

      {galleryImages.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            등록된 이미지가 없습니다
          </p>
          {canEdit && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 mx-auto"
            >
              <Upload className="w-4 h-4" />
              <span>첫 번째 이미지 추가</span>
            </Button>
          )}
        </div>
      ) : isProfile ? (
        <div className="flex justify-center">
          <div className="relative group">
            <div
              className="relative group cursor-pointer"
              onClick={() => openGallery(0)}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={galleryImages[0].original}
                  alt="프로필 이미지"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {canEdit && galleryImages[0].id && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteImage(galleryImages[0].id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative group cursor-pointer">
              <div
                className="aspect-square rounded-xl overflow-hidden"
                onClick={() => openGallery(index)}
              >
                <Image
                  src={image.original}
                  alt={`시설 이미지 ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-xl transition-all duration-200 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {canEdit && image.id && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage(image.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Gallery Modal */}
      {showGallery && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999]">
          <div className="relative w-full h-full max-w-4xl max-h-4xl p-4">
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
            <ImageGallery
              items={galleryImages}
              startIndex={currentIndex}
              showThumbnails={galleryImages.length > 1}
              showPlayButton={false}
              showFullscreenButton={true}
              autoPlay={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SearchableUserSelect = ({ value, onChange, placeholder }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const {
    data: usersData,
    loading,
    error,
  } = useQuery(GET_USERS, {
    variables: { limit: 100, offset: 0, search: searchTerm },
    onError: (error) => console.error("Users query error:", error),
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const users = usersData?.users || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedUser = users.find((user) => user.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`relative flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all duration-200
                   ${
                     isOpen
                       ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                       : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                   }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3 flex-1">
          {selectedUser ? (
            <>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedUser.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedUser.department} • {selectedUser.position}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {placeholder}
              </span>
            </div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="담당자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => {
                    onChange(user.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.department} • {user.position}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                담당자를 찾을 수 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomCalendar = ({
  value,
  onChange,
  placeholder = "날짜를 선택하세요",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null,
  );
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date(),
  );
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];

    // 이전 달의 날들
    for (let i = 0; i < startDate; i++) {
      const prevDate = new Date(year, month, -startDate + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // 현재 달의 날들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // 다음 달의 날들 (6주 표시를 위해)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange(formatDate(date));
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="relative" ref={calendarRef}>
      <div
        className={`relative flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 h-12
                   ${
                     isOpen
                       ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                       : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                   }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span
            className={`text-sm ${selectedDate ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
          >
            {selectedDate
              ? selectedDate.toLocaleDateString("ko-KR")
              : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 p-4 min-w-80">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <span className="font-medium text-gray-900 dark:text-white">
              {currentMonth.getFullYear()}년{" "}
              {monthNames[currentMonth.getMonth()]}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((day, index) => {
              const isSelected =
                selectedDate &&
                day.date.getDate() === selectedDate.getDate() &&
                day.date.getMonth() === selectedDate.getMonth() &&
                day.date.getFullYear() === selectedDate.getFullYear();

              const isToday =
                new Date().toDateString() === day.date.toDateString();

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(day.date)}
                  className={`
                    p-2 text-sm rounded-lg transition-colors
                    ${
                      day.isCurrentMonth
                        ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        : "text-gray-400 dark:text-gray-600"
                    }
                    ${
                      isSelected
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : ""
                    }
                    ${
                      isToday && !isSelected
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : ""
                    }
                  `}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ContactPersonForm = ({
  contact,
  onSave,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    department: contact?.department || "",
    position: contact?.position || "",
    phone: contact?.phone || "",
    email: contact?.email || "",
    birthDate: contact?.birthDate || "",
    facebook: contact?.facebook || "",
    tiktok: contact?.tiktok || "",
    instagram: contact?.instagram || "",
    profileImage: contact?.profileImage || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            이름 *
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="mt-1 h-12 text-sm"
            required
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            부서
          </Label>
          <Input
            value={formData.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            className="mt-1 h-12 text-sm"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            직책
          </Label>
          <Input
            value={formData.position}
            onChange={(e) => handleInputChange("position", e.target.value)}
            className="mt-1 h-12 text-sm"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            전화번호
          </Label>
          <Input
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="mt-1 h-12 text-sm"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            이메일
          </Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="mt-1 h-12 text-sm"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            생년월일
          </Label>
          <div className="mt-1">
            <CustomCalendar
              value={formData.birthDate}
              onChange={(date) => handleInputChange("birthDate", date)}
              placeholder="생년월일을 선택하세요"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Facebook
          </Label>
          <Input
            value={formData.facebook}
            onChange={(e) => handleInputChange("facebook", e.target.value)}
            className="mt-1 h-12 text-sm"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Instagram
          </Label>
          <Input
            value={formData.instagram}
            onChange={(e) => handleInputChange("instagram", e.target.value)}
            className="mt-1 h-12 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            TikTok
          </Label>
          <Input
            value={formData.tiktok}
            onChange={(e) => handleInputChange("tiktok", e.target.value)}
            className="mt-1 h-12 text-sm"
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="bg-green-500 hover:bg-green-600">
          <Save className="w-4 h-4 mr-2" />
          저장
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          취소
        </Button>
      </div>
    </form>
  );
};

const ContactPersonCard = ({
  contact,
  index,
  onEdit,
  onDelete,
  canEdit = false,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0">
            {contact.profileImage ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={contact.profileImage}
                  alt={`${contact.name} 프로필`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {contact.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* 담당자 정보 */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {contact.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contact.department} • {contact.position}
                </p>
              </div>
              {canEdit && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(contact)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(contact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contact.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.phone}
                  </span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.email}
                  </span>
                </div>
              )}
              {contact.birthDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(contact.birthDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* 소셜 미디어 링크 */}
            {(contact.facebook || contact.tiktok || contact.instagram) && (
              <div className="flex space-x-2 pt-2">
                {contact.facebook && (
                  <a
                    href={contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Facebook
                  </a>
                )}
                {contact.tiktok && (
                  <a
                    href={contact.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-gray-800"
                  >
                    TikTok
                  </a>
                )}
                {contact.instagram && (
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast, dismiss } = useToast();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [editingContact, setEditingContact] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [nameValidation, setNameValidation] = useState({ 
    status: null, 
    message: "", 
    isChecking: false 
  });

  const customerId = params.id;

  const { loading, error, data, refetch } = useQuery(GET_CUSTOMER, {
    variables: { id: customerId },
    onCompleted: (data) => {
      if (data?.customer) {
        const customer = data.customer;
        
        // Process all fields safely with proper defaults
        const processedCustomer = {
          id: customer.id,
          name: customer.name || "",
          contactName: customer.contactName || "",
          assignedUserId: customer.assignedUserId || customer.assignedUser?.id || "",
          industry: customer.industry || "",
          companyType: customer.companyType || "",
          grade: customer.grade || "",
          email: customer.email || "",
          phone: customer.phone || "",
          address: customer.address || "",
          status: customer.status || "active",
          contactDepartment: customer.contactDepartment || "",
          contactBirthDate: customer.contactBirthDate || "",
          profileImage: customer.profileImage || "",
          facebook: customer.facebook || "",
          tiktok: customer.tiktok || "",
          instagram: customer.instagram || "",
          assignedUser: customer.assignedUser || null,
          contacts: customer.contacts || [],
          facilityImages: customer.facilityImages || [],
          images: customer.images || [],
          opportunities: customer.opportunities || [],
          createdAt: customer.createdAt || null,
          updatedAt: customer.updatedAt || null,
        };
        
        setOriginalData(processedCustomer);
        setEditData(processedCustomer);
      }
    },
  });

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { limit: 100, offset: 0 },
  });

  const [checkCompanyName] = useLazyQuery(CHECK_COMPANY_NAME, {
    onCompleted: (data) => {
      setNameValidation({
        status: data.checkCompanyName.exists ? 'error' : 'success',
        message: data.checkCompanyName.exists 
          ? t('customer.name.duplicate') 
          : t('customer.name.available'),
        isChecking: false
      });
    },
    onError: () => {
      setNameValidation({
        status: 'error',
        message: t('customer.name.checkError'),
        isChecking: false
      });
    }
  });

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
  const [addContactPerson] = useMutation(ADD_CONTACT_PERSON);
  const [updateContactPerson] = useMutation(UPDATE_CONTACT_PERSON);
  const [deleteContactPerson] = useMutation(DELETE_CONTACT_PERSON);
  const [addCustomerImage] = useMutation(ADD_CUSTOMER_IMAGE);
  const [deleteCustomerImage] = useMutation(DELETE_CUSTOMER_IMAGE);

  const customer = data?.customer;
  const users = usersData?.users || [];

  const companyTypes = {
    SME: t("customer.companyType.sme") || "중소기업",
    LARGE: t("customer.companyType.large") || "대기업",
    STARTUP: t("customer.companyType.startup") || "스타트업",
    PUBLIC: t("customer.companyType.public") || "공공기관",
    NONPROFIT: t("customer.companyType.nonprofit") || "비영리단체",
  };

  const gradeLabels = {
    A: t("customer.grade.a") || "A급 (VIP)",
    B: t("customer.grade.b") || "B급 (우수)",
    C: t("customer.grade.c") || "C급 (일반)",
    D: t("customer.grade.d") || "D급 (표준)",
    E: t("customer.grade.e") || "E급 (기본)",
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Keep all current data as edit data with proper defaults
    const currentData = customer || originalData;
    setEditData({
      ...currentData,
      assignedUserId: currentData.assignedUserId || currentData.assignedUser?.id || "",
      industry: currentData.industry || "",
      companyType: currentData.companyType || "",
      grade: currentData.grade || "",
      email: currentData.email || "",
      phone: currentData.phone || "",
      address: currentData.address || "",
      name: currentData.name || "",
      contactName: currentData.contactName || "",
      status: currentData.status || "active",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...originalData });
    setNameValidation({ status: null, message: "", isChecking: false });
  };

  const handleSave = async () => {
    try {
      // Check for name validation error
      if (nameValidation.status === 'error' && editData.name !== originalData.name) {
        toast({
          title: "오류",
          description: nameValidation.message,
          variant: "destructive",
        });
        return;
      }

      // Only include changed fields
      const changedData = {};
      Object.keys(editData).forEach((key) => {
        if (
          editData[key] !== originalData[key] &&
          key !== "__typename" &&
          key !== "id" &&
          key !== "createdAt" &&
          key !== "updatedAt" &&
          key !== "contacts" &&
          key !== "facilityImages" &&
          key !== "images" &&
          key !== "opportunities" &&
          key !== "assignedUser"
        ) {
          changedData[key] = editData[key];
        }
      });

      if (Object.keys(changedData).length === 0) {
        const toastId = toast({
          title: "알림",
          description: "변경된 내용이 없습니다.",
        });
        
        // Auto dismiss the toast after 3 seconds
        setTimeout(() => {
          dismiss(toastId);
        }, 3000);
        
        setIsEditing(false);
        return;
      }

      const result = await updateCustomer({
        variables: {
          id: customerId,
          input: changedData,
        },
      });

      const toastId = toast({
        title: "성공",
        description: "고객 정보가 성공적으로 업데이트되었습니다.",
      });
      
      // Auto dismiss the toast after 3 seconds
      setTimeout(() => {
        dismiss(toastId);
      }, 3000);

      // Update local state with the returned data
      if (result.data?.updateCustomer) {
        const updatedCustomer = result.data.updateCustomer;
        setOriginalData(updatedCustomer);
        setEditData(updatedCustomer);
      }

      setIsEditing(false);
      setNameValidation({ status: null, message: "", isChecking: false });
      refetch();
    } catch (error) {
      console.error("Update error:", error);
      const toastId = toast({
        title: "오류",
        description: "고객 정보 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      
      // Auto dismiss the toast after 5 seconds
      setTimeout(() => {
        dismiss(toastId);
      }, 5000);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Check company name for duplicates only if it's different from original
    if (field === 'name' && value && value !== originalData.name && value.trim() !== '') {
      setNameValidation({ status: null, message: "", isChecking: true });
      
      // Debounce the API call
      const timeoutId = setTimeout(() => {
        checkCompanyName({ variables: { name: value } });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else if (field === 'name' && value === originalData.name) {
      // Reset validation if name is back to original
      setNameValidation({ status: null, message: "", isChecking: false });
    }
  };

  const handleAddContact = async (contactData) => {
    try {
      await addContactPerson({
        variables: {
          customerId: customerId,
          input: contactData,
        },
      });

      const toastId = toast({
        title: "성공",
        description: "담당자가 성공적으로 추가되었습니다.",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 3000);

      setShowAddContact(false);
      refetch();
    } catch (error) {
      console.error("Add contact error:", error);
      const toastId = toast({
        title: "오류",
        description: "담당자 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 5000);
    }
  };

  const handleUpdateContact = async (contactData) => {
    try {
      await updateContactPerson({
        variables: {
          id: editingContact.id,
          input: contactData,
        },
      });

      const toastId = toast({
        title: "성공",
        description: "담당자 정보가 성공적으로 업데이트되었습니다.",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 3000);

      setEditingContact(null);
      refetch();
    } catch (error) {
      console.error("Update contact error:", error);
      const toastId = toast({
        title: "오류",
        description: "담당자 정보 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 5000);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm("이 담당자를 삭제하시겠습니까?")) return;

    try {
      await deleteContactPerson({
        variables: { id: contactId },
      });

      const toastId = toast({
        title: "성공",
        description: "담당자가 성공적으로 삭제되었습니다.",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 3000);

      refetch();
    } catch (error) {
      console.error("Delete contact error:", error);
      const toastId = toast({
        title: "오류",
        description: "담당자 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 5000);
    }
  };

  const handleAddImage = async (imageData) => {
    try {
      await addCustomerImage({
        variables: {
          customerId: customerId,
          input: imageData,
        },
      });

      const toastId = toast({
        title: "성공",
        description: "이미지가 성공적으로 추가되었습니다.",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 3000);

      refetch();
    } catch (error) {
      console.error("Add image error:", error);
      const toastId = toast({
        title: "오류",
        description: "이미지 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 5000);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("이 이미지를 삭제하시겠습니까?")) return;

    try {
      await deleteCustomerImage({
        variables: { id: imageId },
      });

      const toastId = toast({
        title: "성공",
        description: "이미지가 성공적으로 삭제되었습니다.",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 3000);

      refetch();
    } catch (error) {
      console.error("Delete image error:", error);
      const toastId = toast({
        title: "오류",
        description: "이미지 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        dismiss(toastId);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="text-center py-12">
          <p className="text-red-500">고객 정보를 불러올 수 없습니다.</p>
          <Button onClick={() => router.back()} className="mt-4">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const displayData = isEditing ? editData : customer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full space-y-8">
        {/* 헤더 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
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
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {customer.name || "Unknown Company"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    고객 상세 정보 및 관리
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  className="bg-blue-500 hover:bg-blue-600"
                >
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
                  <Button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600"
                    disabled={nameValidation.status === 'error' && editData.name !== originalData.name}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 정보 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 기본 회사 정보 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  {t("customer.basicInfo") || "기본 회사 정보"}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {t("customer.basicInfoDescription") || "고객사의 기본적인 정보를 확인하고 수정할 수 있습니다"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("customer.name") || "회사명"} *
                    </Label>
                    {isEditing ? (
                      <div className="mt-1 space-y-2">
                        <div className="relative">
                          <Input
                            value={displayData.name || ""}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className={`h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl pr-10
                              ${nameValidation.status === 'error' ? 'border-red-500' : ''}
                              ${nameValidation.status === 'success' ? 'border-green-500' : ''}
                            `}
                          />
                          {nameValidation.isChecking && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            </div>
                          )}
                          {nameValidation.status === 'error' && (
                            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                          )}
                          {nameValidation.status === 'success' && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                          )}
                        </div>
                        {nameValidation.message && (
                          <p className={`text-xs ${nameValidation.status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                            {nameValidation.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-lg font-semibold text-gray-900 dark:text-white">
                        {displayData.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("customer.assignedUser") || "담당자"}
                    </Label>
                    {isEditing ? (
                      <div className="mt-1">
                        <SearchableUserSelect
                          value={displayData.assignedUserId || ""}
                          onChange={(userId) =>
                            handleInputChange("assignedUserId", userId)
                          }
                          placeholder={t("customer.selectAssignedUser") || "담당자를 선택하세요"}
                        />
                      </div>
                    ) : (
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {displayData.assignedUser?.name || t("common.unassigned") || "미배정"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("customer.industry") || "업종"}
                    </Label>
                    {isEditing ? (
                      <Input
                        value={displayData.industry || ""}
                        onChange={(e) =>
                          handleInputChange("industry", e.target.value)
                        }
                        className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {displayData.industry || t("common.noData") || "정보 없음"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("customer.companyType") || "회사 유형"}
                    </Label>
                    {isEditing ? (
                      <select
                        value={displayData.companyType || ""}
                        onChange={(e) =>
                          handleInputChange("companyType", e.target.value)
                        }
                        className="mt-1 w-full h-12 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                      >
                        <option value="">{t("common.selectOption") || "선택하세요"}</option>
                        {Object.entries(companyTypes).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {companyTypes[displayData.companyType] ||
                          displayData.companyType ||
                          t("common.noData") || "정보 없음"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("customer.grade") || "고객 등급"}
                    </Label>
                    {isEditing ? (
                      <select
                        value={displayData.grade || ""}
                        onChange={(e) =>
                          handleInputChange("grade", e.target.value)
                        }
                        className="mt-1 w-full h-12 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                      >
                        <option value="">{t("common.selectOption") || "선택하세요"}</option>
                        {Object.entries(gradeLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl h-12 flex items-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-xl text-sm font-medium ${
                            displayData.grade === "A"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : displayData.grade === "B"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {gradeLabels[displayData.grade] ||
                            displayData.grade ||
                            t("common.unclassified") || "미분류"}
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
                        onChange={(e) =>
                          handleInputChange("assignedUserId", e.target.value)
                        }
                        className="mt-1 w-full h-12 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                      >
                        <option value="">선택하세요</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.department})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {displayData.assignedUser?.name || "미배정"}
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("customer.address") || "주소"}
                    </Label>
                    <AddressSelector
                      value={displayData.address || ""}
                      onChange={(address) =>
                        handleInputChange("address", address)
                      }
                      isEditing={isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 연락처 정보 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  {t("customer.contactInfo") || "연락처 정보"}
                </CardTitle>
                <CardDescription className="text-green-100">
                  {t("customer.contactInfoDescription") || "고객사의 연락처 정보를 관리합니다"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("customer.email") || "이메일"}
                    </Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={displayData.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {displayData.email || t("common.noData") || "정보 없음"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("customer.phone") || "전화번호"}
                    </Label>
                    {isEditing ? (
                      <Input
                        value={displayData.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {displayData.phone || t("common.noData") || "정보 없음"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 이미지 정보 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  {t("customer.imageGallery") || "이미지 갤러리"}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  {t("customer.imageGalleryDescription") || "고객사의 프로필 이미지와 시설 사진을 확인하고 관리할 수 있습니다"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* 프로필 이미지 */}
                  <div>
                    <ImageGallerySection
                      title="고객사 프로필 이미지"
                      images={displayData.profileImage}
                      isProfile={true}
                      onAddImage={handleAddImage}
                      onDeleteImage={handleDeleteImage}
                      canEdit={true}
                    />
                  </div>

                  {/* 구분선 */}
                  <div className="border-t border-gray-200 dark:border-gray-600"></div>

                  {/* 시설 사진 */}
                  <div>
                    <ImageGallerySection
                      title="시설 사진"
                      images={displayData.facilityImages}
                      onAddImage={handleAddImage}
                      onDeleteImage={handleDeleteImage}
                      canEdit={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 담당자 정보 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
                <CardTitle className="text-xl font-semibold flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {t("customer.contactPersons") || "담당자 정보"}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddContact(true)}
                    className="text-white border-white hover:bg-white hover:text-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("customer.addContactPerson") || "담당자 추가"}
                  </Button>
                </CardTitle>
                <CardDescription className="text-orange-100">
                  {t("customer.contactPersonsDescription") || "고객사의 담당자들의 상세 정보를 관리합니다"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {showAddContact && (
                  <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <h4 className="text-lg font-semibold mb-4">
                      새 담당자 추가
                    </h4>
                    <ContactPersonForm
                      onSave={handleAddContact}
                      onCancel={() => setShowAddContact(false)}
                    />
                  </div>
                )}

                {editingContact && (
                  <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <h4 className="text-lg font-semibold mb-4">
                      담당자 정보 수정
                    </h4>
                    <ContactPersonForm
                      contact={editingContact}
                      onSave={handleUpdateContact}
                      onCancel={() => setEditingContact(null)}
                      isEditing={true}
                    />
                  </div>
                )}

                <div className="space-y-6">
                  {displayData.contacts && displayData.contacts.length > 0 ? (
                    displayData.contacts.map((contact, index) => (
                      <ContactPersonCard
                        key={contact.id || index}
                        contact={contact}
                        index={index}
                        onEdit={setEditingContact}
                        onDelete={handleDeleteContact}
                        canEdit={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        등록된 담당자가 없습니다
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddContact(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />첫 번째 담당자 추가
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 요약 정보 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  {t("customer.summary") || "요약 정보"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        상태
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        displayData.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : displayData.status === "inactive"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {displayData.status === "active"
                        ? "활성"
                        : displayData.status === "inactive"
                          ? "비활성"
                          : "잠재고객"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        고객 등급
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        displayData.grade === "A"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : displayData.grade === "B"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {displayData.grade}등급
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        담당자 수
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {displayData.contacts?.length || 0}명
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        시설 이미지
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {displayData.facilityImages?.length || 0}개
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-teal-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        회사 유형
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {companyTypes[displayData.companyType] || "미분류"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        담당 영업사원
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {displayData.assignedUser?.name || "미배정"}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t("customer.createdAt") || "등록일"}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {displayData.createdAt 
                          ? new Date(displayData.createdAt).toLocaleDateString("ko-KR")
                          : t("common.noData") || "정보 없음"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl mt-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t("customer.updatedAt") || "마지막 수정"}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {displayData.updatedAt 
                          ? new Date(displayData.updatedAt).toLocaleDateString("ko-KR")
                          : t("common.noData") || "정보 없음"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 빠른 액션 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-6">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  {t("customer.quickActions") || "빠른 액션"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button
                  className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/sales/opportunities?customer=${customerId}`,
                    )
                  }
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  영업 기회 관리
                </Button>
                <Button
                  className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/customers/history?customer=${customerId}`,
                    )
                  }
                >
                  <FileText className="w-4 h-4 mr-2" />
                  활동 이력 보기
                </Button>
                <Button
                  className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/revenue/record?customer=${customerId}`,
                    )
                  }
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  거래 내역
                </Button>
                <Button
                  className="w-full justify-start bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                  variant="outline"
                  onClick={() =>
                    window.open(`mailto:${displayData.email}`, "_blank")
                  }
                  disabled={!displayData.email}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  이메일 보내기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
