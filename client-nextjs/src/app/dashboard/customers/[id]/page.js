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
          !isEditing ||
          (type === "district" && !selected?.province?.id) ||
          (type === "ward" && !selected?.district?.id)
        }
      >
        <span className="text-sm">{selected[type]?.name || placeholder}</span>
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
                  `${type === "province" ? item.full_name : selected.province?.name || ""} ${
                    type === "district"
                      ? item.full_name
                      : selected.district?.name || ""
                  } ${type === "ward" ? item.full_name : selected.ward?.name || ""}`.trim();
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
    return (
      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
        {value || "주소 정보 없음"}
      </p>
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
          placeholder={t("address.detailAddress") || "상세 주소를 입력하세요"}
          className="h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
          onChange={(e) => {
            const fullAddress =
              `${selected.province?.name || ""} ${selected.district?.name || ""} ${selected.ward?.name || ""} ${e.target.value}`.trim();
            onChange(fullAddress);
          }}
        />
      </div>
    </div>
  );
};

const ImageGallerySection = ({ title, images, isProfile = false }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = Array.isArray(images)
    ? images.map((img) => ({
        original: typeof img === "string" ? img : img.imageUrl,
        thumbnail: typeof img === "string" ? img : img.imageUrl,
        description: typeof img === "object" ? img.description : "",
      }))
    : images
      ? [
          {
            original: images,
            thumbnail: images,
            description: title,
          },
        ]
      : [];

  const openGallery = (index = 0) => {
    setCurrentIndex(index);
    setShowGallery(true);
  };

  if (galleryImages.length === 0) {
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
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </Label>

      {isProfile ? (
        <div className="flex justify-center">
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
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => openGallery(index)}
            >
              <div className="aspect-square rounded-xl overflow-hidden">
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
            </div>
          ))}
        </div>
      )}

      {/* Image Gallery Modal */}
      {showGallery && (
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

const ContactPersonCard = ({ contact, index }) => {
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
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {contact.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {contact.department} • {contact.position}
              </p>
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
      const changedData = {};
      Object.keys(editData).forEach((key) => {
        if (
          editData[key] !== originalData[key] &&
          key !== "__typename" &&
          key !== "id" &&
          key !== "createdAt" &&
          key !== "updatedAt"
        ) {
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
      <div className="container mx-auto max-w-6xl space-y-8">
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
                  기본 회사 정보
                </CardTitle>
                <CardDescription className="text-blue-100">
                  고객사의 기본적인 정보를 확인하고 수정할 수 있습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      회사명 *
                    </Label>
                    {isEditing ? (
                      <Input
                        value={displayData.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-lg font-semibold text-gray-900 dark:text-white">
                        {displayData.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      담당자명
                    </Label>
                    {isEditing ? (
                      <Input
                        value={displayData.contactName || ""}
                        onChange={(e) =>
                          handleInputChange("contactName", e.target.value)
                        }
                        className="mt-1 h-12 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 rounded-xl"
                      />
                    ) : (
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {displayData.contactName || "정보 없음"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      업종
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
                        {displayData.industry || "정보 없음"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      회사 유형
                    </Label>
                    {isEditing ? (
                      <select
                        value={displayData.companyType || ""}
                        onChange={(e) =>
                          handleInputChange("companyType", e.target.value)
                        }
                        className="mt-1 w-full h-12 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
                      >
                        <option value="">선택하세요</option>
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
                          "정보 없음"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      고객 등급
                    </Label>
                    {isEditing ? (
                      <select
                        value={displayData.grade || ""}
                        onChange={(e) =>
                          handleInputChange("grade", e.target.value)
                        }
                        className="mt-1 w-full h-12 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:text-white"
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
                        <span
                          className={`inline-block px-3 py-2 rounded-xl text-sm font-medium ${
                            displayData.grade === "A"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : displayData.grade === "B"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {gradeLabels[displayData.grade] ||
                            displayData.grade ||
                            "미분류"}
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
                      주소
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
                  연락처 정보
                </CardTitle>
                <CardDescription className="text-green-100">
                  고객사의 연락처 정보를 관리합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      이메일
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
                        {displayData.email || "정보 없음"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      전화번호
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
                        {displayData.phone || "정보 없음"}
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
                  이미지 갤러리
                </CardTitle>
                <CardDescription className="text-purple-100">
                  고객사의 프로필 이미지와 시설 사진을 확인할 수 있습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* 프로필 이미지 */}
                  {displayData.profileImage && (
                    <div>
                      <ImageGallerySection
                        title="고객사 프로필 이미지"
                        images={displayData.profileImage}
                        isProfile={true}
                      />
                    </div>
                  )}

                  {/* 구분선 */}
                  {displayData.profileImage &&
                    displayData.images?.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-600"></div>
                    )}

                  {/* 시설 사진 */}
                  <div>
                    <ImageGallerySection
                      title="시설 사진"
                      images={displayData.facilityImages}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 담당자 정보 */}
            {displayData.contacts && displayData.contacts.length > 0 && (
              <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    담당자 정보
                  </CardTitle>
                  <CardDescription className="text-orange-100">
                    고객사의 담당자들의 상세 정보입니다
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {displayData.contacts.map((contact, index) => (
                      <ContactPersonCard
                        key={contact.id || index}
                        contact={contact}
                        index={index}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 요약 정보 */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  요약 정보
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
                          등록일
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(displayData.createdAt).toLocaleDateString(
                          "ko-KR",
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl mt-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          마지막 수정
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(displayData.updatedAt).toLocaleDateString(
                          "ko-KR",
                        )}
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
                  빠른 액션
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
