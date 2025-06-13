"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.js";
import { Input } from "@/components/ui/input.js";
import { Label } from "@/components/ui/label.js";
import { Button } from "@/components/ui/button.js";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { toast } from "react-hot-toast";
import {
  GET_USERS,
  GET_ADDRESSES,
  GET_SERVICES,
  CHECK_COMPANY_NAME,
} from "@/lib/graphql/queries.js";
import { CREATE_CUSTOMER } from "@/lib/graphql/mutations.js";
import {
  Building2,
  MapPin,
  ChevronDown,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  Plus,
  Upload,
  X,
  Search,
  UserPlus,
  Camera,
  Eye,
  ImageIcon,
  Building,
  Globe,
  Industry,
  Save,
} from "lucide-react";
import { useTranslation } from "@/hooks/useLanguage.js";
import { DashboardLayout } from "@/components/layout/dashboardLayout.js";
import { CustomSelect } from "@/components/common/CustomSelect.js";
import CustomCategorySelect from "@/components/common/CustomCategorySelect.js";
import { ImageUploader } from "@/components/common/ImageUploader.js";
import CustomCalendar from "@/components/common/CustomCalendar.js";
import { useUsers, useCreateCustomer, useCheckCompanyName } from "@/hooks/useCustomers.js";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";

// 이미지 로딩 모달 컴포넌트
const ImageLoadingModal = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-700 dark:text-gray-300">
          이미지를 처리 중입니다...
        </p>
      </div>
    </div>
  );
};

const AddressSelector = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [address, setAddress] = useState({
    city: "",
    district: "",
    province: "",
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

    setAddress((prev) => ({
      ...prev,
      city: selected.province?.name || "",
      district: selected.district?.name || "",
      province: selected.ward?.name || "",
    }));
  };

  const renderDropdown = (type, list, placeholder, ref) => (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className={`w-full h-12 px-3 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white flex items-center justify-between
                   ${selected[type]?.name ? "font-medium" : "text-gray-500 dark:text-gray-400"}
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
          (type === "district" && !selected?.province?.id) ||
          (type === "ward" && !selected?.district?.id)
        }
      >
        <span className="text-sm">{selected[type]?.name || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${addressType[`${type}Open`] ? "rotate-180" : ""}`}
        />
      </button>

      {addressType[`${type}Open`] && (
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
          placeholder={t("address.detailAddress") || "상세 주소를 입력하세요"}
          className="h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
          onChange={(e) => {
            setAddress((prev) => ({
              ...prev,
              detailAddress: e.target.value,
            }));
            onChange({
              city: selected.province?.name || "",
              district: selected.district?.name || "",
              province: selected.ward?.name || "",
              detailAddress: e.target.value,
            });
          }}
        />
      </div>
    </div>
  );
};

const SearchableUserSelect = ({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  const {
    data: usersData,
    loading,
    fetchMore,
    error,
  } = useQuery(GET_USERS, {
    variables: { limit: 10, offset: 0, search: searchTerm },
    onError: (error) => console.error("Users query error:", error),
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const users = usersData?.users || [];

  // 에러가 있을 때 로그 출력
  if (error) {
    console.error("GraphQL Users Error:", error);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
      try {
        await fetchMore({
          variables: {
            offset: users.length,
            limit: 5,
            search: searchTerm,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              users: [...prev.users, ...fetchMoreResult.users],
            };
          },
        });
      } catch (error) {
        console.error("Error loading more users:", error);
      }
    }
  };

  const selectedUser = users.find((user) => user.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`relative flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all duration-200
                   ${
                     isOpen
                       ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                       : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                   } bg-white dark:bg-gray-700`}
        onClick={() => setIsOpen(!isOpen)}
        ref={containerRef}
      >
        <div className="flex items-center space-x-3">
          {selectedUser ? (
            <>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
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
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div
          className="fixed left-0 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-xl shadow-2xl z-[50000] max-h-80 overflow-hidden"
          style={{
            top: `${containerRef.current?.getBoundingClientRect().bottom + window.scrollY + 8}px`,
            left: `${containerRef.current?.getBoundingClientRect().left}px`,
            width: `${containerRef.current?.getBoundingClientRect().width}px`,
          }}
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t("search.salesPerson") || "담당자 검색..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto" onScroll={handleScroll}>
            {error && (
              <div className="p-3 text-center text-red-500">
                <p className="text-sm">사용자 목록을 불러올 수 없습니다.</p>
              </div>
            )}
            {!error && users.length === 0 && !loading && (
              <div className="p-3 text-center text-gray-500">
                <p className="text-sm">등록된 사용자가 없습니다.</p>
              </div>
            )}
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
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.department} • {user.position}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="p-3 text-center text-gray-500">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("loading") || "로딩 중..."}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ImageUploadSection = ({
  title,
  images,
  onImagesChange,
  isMultiple = false,
  setImageLoading,
}) => {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 다중 이미지의 경우 최대 5개 제한
    if (isMultiple && images.length + files.length > 5) {
      alert(t("image.maxLimit") || "최대 5개까지 업로드 가능합니다.");
      return;
    }

    setImageLoading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        // 이미지 압축 옵션
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append("file", compressedFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const { url } = await response.json();
          uploadedUrls.push(url);
        }
      }

      // 업로드 완료 후 한 번에 상태 업데이트
      if (isMultiple) {
        onImagesChange([...images, ...uploadedUrls]);
      } else {
        onImagesChange(uploadedUrls[0] || "");
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert(t("image.uploadError") || "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setImageLoading(false);
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
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </Label>

      <div className="flex flex-wrap gap-4">
        {/* 업로드 버튼 */}
        {(!isMultiple || (isMultiple && images.length < 5)) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              {t("image.add") || "이미지 추가"}
            </span>
            {isMultiple && (
              <span className="text-xs text-gray-400 mt-1">
                {images.length}/5
              </span>
            )}
          </button>
        )}

        {/* 이미지 미리보기 */}
        {isMultiple
          ? images.map((image, index) => (
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
          : images && (
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
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]"
          onClick={() => setPreviewImage(null)}
        >
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

const ContactPersonForm = ({
  contact,
  index,
  updateContact,
  removeContact,
  setImageLoading,
}) => {
  const { t } = useTranslation();
  const [profileImagePreview, setProfileImagePreview] = useState(
    contact.profileImage || null,
  );
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true);
      try {
        // 이미지 압축
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append("file", compressedFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const { url } = await response.json();
          setProfileImagePreview(url);
          updateContact(index, "profileImage", url);
        }
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      } finally {
        setImageLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          {t("contact.person") || "담당자"} {index + 1}
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
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            {t("contact.profileImage") || "프로필 이미지"}
          </Label>
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
                  {contact.name?.charAt(0).toUpperCase() || "?"}
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
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("contact.name") || "이름"} *
          </Label>
          <Input
            type="text"
            value={contact.name || ""}
            onChange={(e) => updateContact(index, "name", e.target.value)}
            placeholder={t("contact.namePlaceholder") || "담당자 이름"}
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("contact.department") || "부서"}
          </Label>
          <Input
            type="text"
            value={contact.department || ""}
            onChange={(e) => updateContact(index, "department", e.target.value)}
            placeholder={t("contact.departmentPlaceholder") || "부서명"}
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("contact.position") || "직책"}
          </Label>
          <Input
            type="text"
            value={contact.position || ""}
            onChange={(e) => updateContact(index, "position", e.target.value)}
            placeholder={t("contact.positionPlaceholder") || "직책"}
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        {/* 연락처 정보 */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("contact.phone") || "전화번호"}
          </Label>
          <Input
            type="tel"
            value={contact.phone || ""}
            onChange={(e) => updateContact(index, "phone", e.target.value)}
            placeholder={t("contact.phonePlaceholder") || "전화번호"}
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("contact.email") || "이메일"}
          </Label>
          <Input
            type="email"
            value={contact.email || ""}
            onChange={(e) => updateContact(index, "email", e.target.value)}
            placeholder={t("contact.emailPlaceholder") || "이메일"}
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("contact.birthDate") || "생년월일"}
          </Label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            <select
              value={
                contact.birthDate
                  ? new Date(contact.birthDate).getFullYear()
                  : ""
              }
              onChange={(e) => {
                const year = e.target.value;
                const month = contact.birthDate
                                    ? new Date(contact.birthDate).getMonth() + 1
                  : 1;
                const day = contact.birthDate
                  ? new Date(contact.birthDate).getDate()
                  : 1;
                if (year) {
                  const newDate = new Date(year, month - 1, day)
                    .toISOString()
                    .split("T")[0];
                  updateContact(index, "birthDate", newDate);
                }
              }}
              className="mt-1 h-12 w-full px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
            >
              <option value="">{t("year") || "년"}</option>
              {Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i,
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={
                contact.birthDate
                  ? new Date(contact.birthDate).getMonth() + 1
                  : ""
              }
              onChange={(e) => {
                const month = e.target.value;
                const year = contact.birthDate
                  ? new Date(contact.birthDate).getFullYear()
                  : new Date().getFullYear();
                const day = contact.birthDate
                  ? new Date(contact.birthDate).getDate()
                  : 1;
                if (month) {
                  const newDate = new Date(year, month - 1, day)
                    .toISOString()
                    .split("T")[0];
                  updateContact(index, "birthDate", newDate);
                }
              }}
              className="mt-1 h-12 w-full px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
            >
              <option value="">{t("month") || "월"}</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={
                contact.birthDate ? new Date(contact.birthDate).getDate() : ""
              }
              onChange={(e) => {
                const day = e.target.value;
                const year = contact.birthDate
                  ? new Date(contact.birthDate).getFullYear()
                  : new Date().getFullYear();
                const month = contact.birthDate
                  ? new Date(contact.birthDate).getMonth() + 1
                  : 1;
                if (day) {
                  const newDate = new Date(year, month - 1, day)
                    .toISOString()
                    .split("T")[0];
                  updateContact(index, "birthDate", newDate);
                }
              }}
              className="mt-1 h-12 w-full px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
            >
              <option value="">{t("day") || "일"}</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 소셜 미디어 */}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Facebook
          </Label>
          <Input
            type="url"
            value={contact.facebook || ""}
            onChange={(e) => updateContact(index, "facebook", e.target.value)}
            placeholder="Facebook URL"
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            TikTok
          </Label>
          <Input
            type="url"
            value={contact.tiktok || ""}
            onChange={(e) => updateContact(index, "tiktok", e.target.value)}
            placeholder="TikTok URL"
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Instagram
          </Label>
          <Input
            type="url"
            value={contact.instagram || ""}
            onChange={(e) => updateContact(index, "instagram", e.target.value)}
            placeholder="Instagram URL"
            className="mt-1 h-12 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>
      </div>
    </div>
  );
};

export default function AddCustomerPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyNameCheck, setCompanyNameCheck] = useState({
    checking: false,
    exists: false,
    message: "",
  });
  const { checkName } = useCheckCompanyName();
  const { createCustomer, loading: createLoading } = useCreateCustomer();

  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    industry: "",
    companyType: "",
    grade: "",
    address: "",
    assignedUserId: "",
    profileImage: "",
    facilityImages: [],
    contacts: [],
  });

  // Debounced company name validation
  const debouncedCheckCompanyName = useCallback(
    debounce(async (name) => {
      if (name.trim().length < 2) {
        setCompanyNameCheck({ checking: false, exists: false, message: "" });
        return;
      }

      setCompanyNameCheck((prev) => ({ ...prev, checking: true }));

      try {
        const result = await checkName(name.trim());

        setCompanyNameCheck({
          checking: false,
          exists: result.exists,
          message: result.message,
        });
      } catch (error) {
        console.error("Company name check error:", error);
        setCompanyNameCheck({
          checking: false,
          exists: false,
          message: "중복 확인 중 오류가 발생했습니다.",
        });
      }
    }, 500),
    [checkName],
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 회사명 입력 시 중복 검사
    if (name === "name") {
      debouncedCheckCompanyName(value);
    }
  };

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const addContactPerson = () => {
    setFormData((prev) => ({
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
          profileImage: "",
        },
      ],
    }));
  };

  const updateContactPerson = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact,
      ),
    }));
  };

  const removeContactPerson = (index) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    const errors = [];
    if (!formData.name.trim()) errors.push("회사명은 필수입니다.");
    if (!formData.industry.trim()) errors.push("업종은 필수입니다.");
    if (!formData.companyType.trim()) errors.push("회사유형은 필수입니다.");
    if (!formData.grade.trim()) errors.push("고객등급은 필수입니다.");
    if (!formData.address || (typeof formData.address === 'object' && !formData.address.detailAddress)) {
      errors.push("주소는 필수입니다.");
    }
    if (formData.contacts.length === 0)
      errors.push("담당자는 최소 1명 필요합니다.");

    // 회사명 중복 확인
    if (companyNameCheck.exists) {
      errors.push("이미 등록된 회사명입니다. 다른 회사명을 입력해주세요.");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    setIsSubmitting(true);

    try {
      // 주소 데이터 처리
      let processedFormData = { ...formData };
      
      if (typeof formData.address === 'object' && formData.address) {
        // 주소 객체를 문자열로 변환
        const addressParts = [
          formData.address.city,
          formData.address.district,
          formData.address.province,
          formData.address.detailAddress
        ].filter(part => part && part.trim() !== '');
        
        processedFormData.address = addressParts.join(' ').trim();
        
        // 개별 주소 필드도 함께 전송 (백엔드에서 지원하는 경우)
        processedFormData.city = formData.address.city || '';
        processedFormData.district = formData.address.district || '';
        processedFormData.province = formData.address.province || '';
        processedFormData.detailAddress = formData.address.detailAddress || '';
      }

      const result = await createCustomer({
        variables: {
          input: {
            ...processedFormData,
            contacts: formData.contacts.map(contact => ({
              ...contact,
              birthDate: contact.birthDate ? new Date(contact.birthDate).toISOString() : null
            }))
          },
        },
      });

      if (result.success) {
        console.log("Customer created:", result.data);
        alert(result.message);
        router.push("/dashboard/customers");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Customer creation error:", error);
      alert(error.message || "고객사 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const companyTypes = [
    { value: "SME", label: t("company.type.small") || "중소기업" },
    { value: "LARGE", label: t("company.type.large") || "대기업" },
    { value: "STARTUP", label: t("company.type.startup") || "스타트업" },
    { value: "PUBLIC", label: t("company.type.public") || "공공기관" },
    { value: "NONPROFIT", label: t("company.type.nonprofit") || "비영리단체" },
    { value: "CUSTOM", label: t("company.type.custom") || "직접입력" },
  ];

  const grades = [
    { value: "A", label: t("customer.grade.vip") || "A급 (VIP)" },
    { value: "B", label: t("customer.grade.excellent") || "B급 (우수)" },
    { value: "C", label: t("customer.grade.normal") || "C급 (일반)" },
    { value: "D", label: t("customer.grade.standard") || "D급 (표준)" },
    { value: "E", label: t("customer.grade.basic") || "E급 (기본)" },
    { value: "CUSTOM", label: t("customer.grade.custom") || "직접입력" },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4"
      style={{ overflow: "visible" }}
    >
      <ImageLoadingModal isVisible={imageLoading} />

      <div className="container mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t("customer.add.title") || "새로운 고객사 추가"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {t("customer.add.description") ||
                    "고객사 정보와 담당자 정보를 입력해 주세요"}
                </p>
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
                {t("company.info.basic") || "기본 회사 정보"}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {t("company.info.description") ||
                  "고객사의 기본적인 정보를 입력해 주세요"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("company.name") || "회사명"} *
                  </Label>
                  <div className="relative">
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={
                        t("company.namePlaceholder") || "회사명을 입력하세요"
                      }
                      className={`mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl
                                 ${companyNameCheck.exists ? "border-red-500" : companyNameCheck.message && !companyNameCheck.exists ? "border-green-500" : ""}`}
                      required
                    />
                    {companyNameCheck.checking && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {companyNameCheck.message && (
                    <p
                      className={`text-xs mt-1 ${companyNameCheck.exists ? "text-red-600" : "text-green-600"}`}
                    >
                      {companyNameCheck.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("customer.phone") || "전화번호"}
                  </Label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t("customer.phonePlaceholder") || "전화번호를 입력하세요"}
                    className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("customer.email") || "이메일"}
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("customer.emailPlaceholder") || "이메일을 입력하세요"}
                    className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("customer.industry") || "업종"}
                  </Label>
                  <Input
                    name="industry"
                    type="text"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder={
                      t("customer.industryPlaceholder") || "업종을 입력하세요"
                    }
                    className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("customer.companyType") || "회사 유형"}
                  </Label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className="mt-1 w-full h-12 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                  >
                    <option value="">
                      {t("customer.selectCompanyType") || "회사 유형 선택"}
                    </option>
                    {companyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {formData.companyType === "CUSTOM" && (
                    <Input
                      name="companyType"
                      type="text"
                      value={formData.companyType}
                      onChange={handleInputChange}
                      placeholder={
                        t("customer.companyTypeCustomPlaceholder") ||
                        "회사 유형을 입력하세요"
                      }
                      className="mt-2 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                    />
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("customer.customerGrade") || "고객 등급"}
                  </Label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="mt-1 w-full h-12 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                  >
                    <option value="">
                      {t("customer.gradeSelect") || "고객 등급 선택"}
                    </option>
                    {grades.map((grade) => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </select>
                  {formData.grade === "CUSTOM" && (
                    <Input
                      name="grade"
                      type="text"
                      value={formData.grade}
                      onChange={handleInputChange}
                      placeholder={
                        t("customer.gradeCustomPlaceholder") ||
                        "고객 등급을 입력하세요"
                      }
                      className="mt-2 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                    />
                  )}
                </div>

                <div className="lg:col-span-3">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("customer.address") || "주소"}
                  </Label>
                  <div className="mt-1">
                    <AddressSelector
                      value={formData.address}
                      onChange={(address) =>
                        setFormData((prev) => ({ ...prev, address }))
                      }
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
                {t("customer.assignedUser") || "담당 영업사원"}
              </CardTitle>
              <CardDescription className="text-green-100">
                {t("customer.assignedUserDescription") ||
                  "이 고객사를 담당할 영업사원을 선택해 주세요"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <SearchableUserSelect
                value={formData.assignedUserId}
                onChange={(userId) =>
                  setFormData((prev) => ({ ...prev, assignedUserId: userId }))
                }
                placeholder={
                  t("sales.person.placeholder") ||
                  "담당 영업사원을 검색하여 선택하세요"
                }
              />
            </CardContent>
          </Card>

          {/* 이미지 업로드 */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                {t("customers.imageUploadHint") || "이미지 등록"}
              </CardTitle>
              <CardDescription className="text-purple-100">
                {t("customers.imageUploadDescription") ||
                  "고객사의 프로필 이미지와 시설 사진을 등록해 주세요"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {/* 프로필 이미지 - 상단 */}
                <div>
                  <ImageUploadSection
                    title={t("customers.profileImage") || "고객사 프로필 이미지"}
                    images={formData.profileImage}
                    onImagesChange={(image) =>
                      setFormData((prev) => ({ ...prev, profileImage: image }))
                    }
                    isMultiple={false}
                    setImageLoading={setImageLoading}
                  />
                </div>

                {/* 구분선 */}
                <div className="border-t border-gray-200 dark:border-gray-600"></div>

                {/* 시설 사진 - 하단 */}
                <div>
                  <ImageUploadSection
                    title={t("customers.facilityImages") || "시설 사진"}
                    images={formData.facilityImages}
                    onImagesChange={(images) =>
                      setFormData((prev) => ({
                        ...prev,
                        facilityImages: images,
                      }))
                    }
                    isMultiple={true}
                    setImageLoading={setImageLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 담당자 정보 */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
              <CardTitle className="text-xl font-semibold flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                {t("customers.contactPerson") || "담당자 정보"}
              </CardTitle>
              <CardDescription className="text-orange-100">
                {t("customers.contactPersonDescription") ||
                  "고객사의 담당자들을 추가해 주세요"}
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
                    setImageLoading={setImageLoading}
                  />
                ))}

                <Button
                  type="button"
                  onClick={addContactPerson}
                  variant="outline"
                  className="w-full h-16 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 hover:text-blue-600 rounded-xl transition-all duration-200"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {t("customers.addContactPerson") || "담당자 추가"}
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
              onClick={() => router.back()}
            >
              {t("common.cancel") || "취소"}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createLoading}
              className="px-8 py-3 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg disabled:opacity-50"
            >
              {(isSubmitting || createLoading)
                ? t("common.saving") || "등록 중..."
                : t("customers.addCustomer") || "고객사 등록"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}