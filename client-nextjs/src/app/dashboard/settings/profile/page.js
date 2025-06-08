
"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { useLanguage } from "@/contexts/languageContext.js";
import { UPDATE_USER_PROFILE } from "@/lib/graphql/mutations.js";
import { GET_ME } from "@/lib/graphql/queries.js";
import { setUser } from "@/store/slices/authSlice.js";
import { useToast } from "@/hooks/useToast.js";
import {
  User,
  Lock,
  Shield,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  QrCode,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import imageCompression from "browser-image-compression";

export default function ProfileSettingsPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({});
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [skills, setSkills] = useState([]);

  const {
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_ME, {
    onCompleted: (data) => {
      if (data?.me) {
        const userData = data.me;
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          address: userData.address || "",
          nationality: userData.nationality || "",
          department: userData.department || "",
          position: userData.position || "",
          employeeId: userData.employeeId || "",
          joinDate: userData.joinDate
            ? new Date(userData.joinDate).toISOString().split("T")[0]
            : "",
          birthDate: userData.birthDate
            ? new Date(userData.birthDate).toISOString().split("T")[0]
            : "",
          visaStatus: userData.visaStatus || "",
          avatar: userData.avatar || null,
        });
        setEmergencyContacts(userData.emergencyContact || []);
        setSkills(userData.skills?.map((skill) => skill.name) || []);
        dispatch(setUser(userData));
      }
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
      toast({
        title: "오류",
        description: "사용자 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    loginNotifications: true,
    passwordChangeNotifications: true,
    loginAttemptNotifications: true,
    sessionTimeout: 30,
    allowMultipleSessions: false,
  });

  const tabs = [
    { id: "profile", name: "기본 정보", icon: User },
    { id: "password", name: "비밀번호 변경", icon: Lock },
    { id: "security", name: "보안 설정", icon: Shield },
    { id: "2fa", name: "2단계 인증", icon: Smartphone },
  ];

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e) => {
    if (!isEditing) {
      toast({
        title: "알림",
        description: "편집 모드에서만 사진을 변경할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        // 이미지 압축
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // 서버에 업로드
        const formData = new FormData();
        formData.append("file", compressedFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setProfileData(prev => ({ ...prev, avatar: result.url }));
          toast({
            title: "성공",
            description: "프로필 사진이 업로드되었습니다.",
          });
        } else {
          throw new Error("업로드 실패");
        }
      } catch (error) {
        console.error("이미지 업로드 오류:", error);
        toast({
          title: "오류",
          description: "이미지 업로드에 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { name: "", relationship: "", phoneNumber: "" },
    ]);
  };

  const removeEmergencyContact = (index) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // 기존 유저 정보와 비교
      const changedFields = {};
      Object.keys(profileData).forEach((key) => {
        if (key === "email") return; // email만 제외
        if (profileData[key] !== user[key]) {
          changedFields[key] = profileData[key];
        }
      });

      // emergencyContact, skills도 비교해서 변경된 경우만 추가
      if (JSON.stringify(emergencyContacts) !== JSON.stringify(user.emergencyContact)) {
        changedFields.emergencyContact = emergencyContacts.filter(
          (contact) => contact.name && contact.relationship && contact.phoneNumber,
        );
      }
      if (JSON.stringify(skills.map((s) => s.trim()).filter(Boolean)) !== JSON.stringify((user.skills || []).map((s) => s.name))) {
        changedFields.skills = skills
          .filter((skill) => skill.trim() !== "")
          .map((skill) => ({ name: skill }));
      }

      if (Object.keys(changedFields).length === 0) {
        toast({
          title: "정보",
          description: "변경된 내용이 없습니다.",
        });
        setIsEditing(false);
        setIsLoading(false);
        return;
      }

      const { data } = await updateUserProfile({
        variables: { input: changedFields },
      });

      if (data?.updateUserProfile) {
        dispatch(setUser(data.updateUserProfile));
        setIsEditing(false);
        toast({
          title: "성공",
          description: "프로필이 성공적으로 업데이트되었습니다.",
        });
        refetch();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "오류",
        description: "프로필 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 옵션 데이터
  const nationalityOptions = [
    { value: "vietnam", label: { ko: "베트남", en: "Vietnam", vi: "Việt Nam" } },
    { value: "korea", label: { ko: "한국", en: "South Korea", vi: "Hàn Quốc" } },
    { value: "usa", label: { ko: "미국", en: "United States", vi: "Hoa Kỳ" } },
    { value: "japan", label: { ko: "일본", en: "Japan", vi: "Nhật Bản" } },
    { value: "china", label: { ko: "중국", en: "China", vi: "Trung Quốc" } },
    { value: "thailand", label: { ko: "태국", en: "Thailand", vi: "Thái Lan" } },
    { value: "other", label: { ko: "기타", en: "Other", vi: "Khác" } },
  ];

  const departmentOptions = [
    { value: "sales", label: { ko: "영업", en: "Sales", vi: "Bán hàng" } },
    { value: "inventory", label: { ko: "재고/배송", en: "Inventory/Shipping", vi: "Kho/Vận chuyển" } },
    { value: "marketing", label: { ko: "마케팅", en: "Marketing", vi: "Marketing" } },
    { value: "accounting", label: { ko: "회계", en: "Accounting", vi: "Kế toán" } },
    { value: "support", label: { ko: "고객지원", en: "Customer Support", vi: "Hỗ trợ khách hàng" } },
    { value: "other", label: { ko: "기타", en: "Other", vi: "Khác" } },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* 프로필 사진 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          프로필 사진
        </h3>
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profileData.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={!isEditing}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className={`px-4 py-2 rounded-lg ${
                isEditing 
                  ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              사진 변경
            </label>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG 파일만 가능 (최대 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* 개인 정보 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          개인 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.name || ""}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={profileData.email || ""}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              disabled={true}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={profileData.phoneNumber || ""}
              onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              생년월일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={profileData.birthDate || ""}
              onChange={(e) => handleProfileChange("birthDate", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              국적 <span className="text-red-500">*</span>
            </label>
            <select
              value={profileData.nationality || ""}
              onChange={(e) => handleProfileChange("nationality", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            >
              <option value="">선택하세요</option>
              {nationalityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[language] || option.label.ko}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              비자 상태
            </label>
            <input
              type="text"
              value={profileData.visaStatus || ""}
              onChange={(e) => handleProfileChange("visaStatus", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              주소
            </label>
            <input
              type="text"
              value={profileData.address || ""}
              onChange={(e) => handleProfileChange("address", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* 직장 정보 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          직장 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              부서 <span className="text-red-500">*</span>
            </label>
            <select
              value={profileData.department || ""}
              onChange={(e) => handleProfileChange("department", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            >
              <option value="">선택하세요</option>
              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[language] || option.label.ko}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              직책
            </label>
            <input
              type="text"
              value={profileData.position || ""}
              onChange={(e) => handleProfileChange("position", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              사원번호
            </label>
            <input
              type="text"
              value={profileData.employeeId || ""}
              onChange={(e) => handleProfileChange("employeeId", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              입사일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={profileData.joinDate || ""}
              onChange={(e) => handleProfileChange("joinDate", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* 스킬 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            스킬
          </h3>
          {isEditing && (
            <button
              onClick={addSkill}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm flex items-center space-x-1"
            >
              <span>+</span>
              <span>추가</span>
            </button>
          )}
        </div>
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                disabled={!isEditing}
                placeholder="스킬을 입력하세요"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
              {isEditing && (
                <button
                  onClick={() => removeSkill(index)}
                  className="bg-red-500 text-white px-2 py-2 rounded-lg hover:bg-red-600 text-sm"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-gray-500 text-sm">등록된 스킬이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 비상 연락처 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            비상 연락처
          </h3>
          {isEditing && (
            <button
              onClick={addEmergencyContact}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm flex items-center space-x-1"
            >
              <span>+</span>
              <span>추가</span>
            </button>
          )}
        </div>
        <div className="space-y-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  비상 연락처 {index + 1}
                </h4>
                {isEditing && (
                  <button
                    onClick={() => removeEmergencyContact(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 text-sm"
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="이름"
                  value={contact.name || ""}
                  onChange={(e) => handleEmergencyContactChange(index, "name", e.target.value)}
                  disabled={!isEditing}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
                <input
                  type="text"
                  placeholder="관계"
                  value={contact.relationship || ""}
                  onChange={(e) => handleEmergencyContactChange(index, "relationship", e.target.value)}
                  disabled={!isEditing}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
                <input
                  type="tel"
                  placeholder="전화번호"
                  value={contact.phoneNumber || ""}
                  onChange={(e) => handleEmergencyContactChange(index, "phoneNumber", e.target.value)}
                  disabled={!isEditing}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>
            </div>
          ))}
          {emergencyContacts.length === 0 && (
            <p className="text-gray-500 text-sm">등록된 비상 연락처가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          비밀번호 변경
        </h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              현재 비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              새 비밀번호
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">비밀번호 요구사항:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>최소 8자 이상</li>
                  <li>대문자, 소문자, 숫자, 특수문자 포함</li>
                  <li>이전 비밀번호와 다른 비밀번호</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          보안 알림
        </h3>
        <div className="space-y-4">
          {[
            { key: "loginNotifications", label: "로그인 알림", desc: "새로운 기기에서 로그인할 때 알림" },
            { key: "passwordChangeNotifications", label: "비밀번호 변경 알림", desc: "비밀번호가 변경될 때 알림" },
            { key: "loginAttemptNotifications", label: "로그인 시도 알림", desc: "실패한 로그인 시도에 대한 알림" },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {setting.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {setting.desc}
                </div>
              </div>
              <button
                onClick={() => handleSecurityChange(setting.key, !securitySettings[setting.key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securitySettings[setting.key] ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    securitySettings[setting.key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          세션 설정
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              세션 타임아웃 (분)
            </label>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecurityChange("sessionTimeout", parseInt(e.target.value))}
              className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={15}>15분</option>
              <option value={30}>30분</option>
              <option value={60}>1시간</option>
              <option value={120}>2시간</option>
              <option value={0}>타임아웃 없음</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                다중 세션 허용
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                여러 기기에서 동시 로그인 허용
              </div>
            </div>
            <button
              onClick={() => handleSecurityChange("allowMultipleSessions", !securitySettings.allowMultipleSessions)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.allowMultipleSessions ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.allowMultipleSessions ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const render2FATab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            2단계 인증 (2FA)
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm ${
            twoFactorEnabled 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}>
            {twoFactorEnabled ? "활성화됨" : "비활성화됨"}
          </div>
        </div>
        
        {!twoFactorEnabled ? (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              2단계 인증을 활성화하여 계정 보안을 강화하세요.
            </p>
            <button
              onClick={() => setShowQRCode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>2단계 인증 설정</span>
            </button>
          </div>
        ) : (
          <div>
            <p className="text-green-600 dark:text-green-400 mb-4">
              2단계 인증이 활성화되어 있습니다.
            </p>
            <div className="space-y-2">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2">
                백업 코드 생성
              </button>
              <button
                onClick={() => setTwoFactorEnabled(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                2단계 인증 비활성화
              </button>
            </div>
          </div>
        )}

        {showQRCode && !twoFactorEnabled && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              1. 인증 앱에서 QR 코드 스캔
            </h4>
            <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Google Authenticator, Authy 등의 앱을 사용하세요.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                2. 인증 코드 입력
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="6자리 코드"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => {
                    setTwoFactorEnabled(true);
                    setShowQRCode(false);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (queryLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              프로필 설정
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              개인정보, 보안 설정 및 계정 관리
            </p>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>편집</span>
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>취소</span>
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? "저장중..." : "저장"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "password" && renderPasswordTab()}
        {activeTab === "security" && renderSecurityTab()}
        {activeTab === "2fa" && render2FATab()}
      </div>
    </div>
  );
}
