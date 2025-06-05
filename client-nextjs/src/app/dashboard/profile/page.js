"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { useLanguage } from "../../../contexts/languageContext.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card.js";
import { Button } from "../../../components/ui/button.js";
import { Input, Select } from "../../../components/ui/input.js";
import { Label } from "../../../components/ui/label.js";
import LoadingModal from "../../../components/ui/LoadingModal.js";
import { UPDATE_USER_PROFILE } from "../../../lib/graphql/mutations.js";
import { GET_ME } from "../../../lib/graphql/queries.js";
import { setUser } from "../../../store/slices/authSlice.js";
import { useToast } from "../../../hooks/useToast.js";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Globe,
  Save,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import CustomCalendar from "../../../components/common/CustomCalendar.js";

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
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
        setFormData({
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
        });
        setEmergencyContacts(userData.emergencyContact || []);
        setSkills(userData.skills?.map((skill) => skill.name) || []);
        dispatch(setUser(userData));
      }
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
      toast({
        title: t("common.error"),
        description: t("profile.fetchError"),
        variant: "destructive",
      });
    },
  });

  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      Object.keys(formData).forEach((key) => {
        if (key === "email") return; // email은 제외
        if (formData[key] !== user[key]) {
          changedFields[key] = formData[key];
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
          title: t("common.info"),
          description: t("profile.noChange"),
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
          title: t("common.success"),
          description: t("profile.updateSuccess"),
        });
        refetch();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: t("common.error"),
        description: t("profile.updateError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nationalityOptions = [
    {
      value: "vietnam",
      label: { ko: "베트남", en: "Vietnam", vi: "Việt Nam" },
    },
    {
      value: "korea",
      label: { ko: "한국", en: "South Korea", vi: "Hàn Quốc" },
    },
    { value: "usa", label: { ko: "미국", en: "United States", vi: "Hoa Kỳ" } },
    { value: "japan", label: { ko: "일본", en: "Japan", vi: "Nhật Bản" } },
    { value: "china", label: { ko: "중국", en: "China", vi: "Trung Quốc" } },
    {
      value: "thailand",
      label: { ko: "태국", en: "Thailand", vi: "Thái Lan" },
    },
    { value: "other", label: { ko: "기타", en: "Other", vi: "Khác" } },
  ];

  const departmentOptions = [
    { value: "sales", label: { ko: "영업", en: "Sales", vi: "Bán hàng" } },
    {
      value: "inventory",
      label: {
        ko: "재고/배송",
        en: "Inventory/Shipping",
        vi: "Kho/Vận chuyển",
      },
    },
    {
      value: "marketing",
      label: { ko: "마케팅", en: "Marketing", vi: "Marketing" },
    },
    {
      value: "accounting",
      label: { ko: "회계", en: "Accounting", vi: "Kế toán" },
    },
    {
      value: "support",
      label: {
        ko: "고객지원",
        en: "Customer Support",
        vi: "Hỗ trợ khách hàng",
      },
    },
    { value: "other", label: { ko: "기타", en: "Other", vi: "Khác" } },
  ];

  if (queryLoading) {
    return <LoadingModal isOpen={true} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 animate-fadeIn">
        <LoadingModal isOpen={isLoading} />

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("profile.title")}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                {t("profile.description")}
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className="w-full sm:w-auto"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? t("common.cancel") : t("common.edit")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <User className="w-5 h-5 mr-2" />
                  {t("profile.basicInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-semibold">
                      {user?.name}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      {user?.email}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {user?.department &&
                        t(`register.department.${user.department}`)}
                      {user?.position && ` • ${user?.position}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center text-xs sm:text-sm">
                    <Building className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {user?.department
                        ? t(`register.department.${user.department}`)
                        : t("common.notSet")}
                    </span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {user?.phoneNumber || t("common.notSet")}
                    </span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    <Globe className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {user?.nationality
                        ? nationalityOptions.find(
                            (opt) => opt.value === user.nationality,
                          )?.label[language] || user.nationality
                        : t("common.notSet")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Profile Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  {t("profile.personalInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm">
                      {t("register.name")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={t("register.name.placeholder")}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm">
                      {t("register.email")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm">
                      {t("register.phoneNumber")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="text-sm">
                      {t("register.birthDate")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <CustomCalendar
                      value={formData.birthDate || ""}
                      language={language}
                      t={t}
                      onChange={(value) => handleInputChange({ target: { name: "birthDate", value } })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality" className="text-sm">
                      {t("register.nationality")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      id="nationality"
                      name="nationality"
                      value={formData.nationality || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">{t("common.select")}</option>
                      {nationalityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label[language] || option.label.en}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="visaStatus" className="text-sm">
                      {t("register.visaStatus")} ({t("register.optional")})
                    </Label>
                    <Input
                      id="visaStatus"
                      name="visaStatus"
                      value={formData.visaStatus || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm">
                    {t("register.address")}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={t("register.address.placeholder")}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  {t("profile.workInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department" className="text-sm">
                      {t("register.department")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      id="department"
                      name="department"
                      value={formData.department || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="">{t("common.select")}</option>
                      {departmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label[language] || option.label.en}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position" className="text-sm">
                      {t("register.position")}
                    </Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeId" className="text-sm">
                      {t("register.employeeId")}
                    </Label>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      value={formData.employeeId || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="joinDate" className="text-sm">
                      {t("register.joinDate")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <CustomCalendar
                      value={formData.joinDate || ""}
                      language={language}
                      t={t}
                      onChange={(value) => handleInputChange({ target: { name: "joinDate", value } })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  {t("register.skills")}
                  {isEditing && (
                    <Button onClick={addSkill} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      {t("common.add")}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      disabled={!isEditing}
                      placeholder={t("register.skills.placeholder")}
                      className="text-sm"
                    />
                    {isEditing && (
                      <Button
                        onClick={() => removeSkill(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {t("register.skills.placeholder")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  {t("register.emergencyContact")}
                  {isEditing && (
                    <Button
                      onClick={addEmergencyContact}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t("common.add")}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm sm:text-base">
                        {t("register.emergencyContact")} {index + 1}
                      </h4>
                      {isEditing && (
                        <Button
                          onClick={() => removeEmergencyContact(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        placeholder={t("register.emergencyContact.name")}
                        value={contact.name || ""}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        disabled={!isEditing}
                        className="text-sm"
                      />
                      <Input
                        placeholder={t(
                          "register.emergencyContact.relationship",
                        )}
                        value={contact.relationship || ""}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "relationship",
                            e.target.value,
                          )
                        }
                        disabled={!isEditing}
                        className="text-sm"
                      />
                      <Input
                        placeholder={t("register.emergencyContact.phone")}
                        value={contact.phoneNumber || ""}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "phoneNumber",
                            e.target.value,
                          )
                        }
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
                {emergencyContacts.length === 0 && (
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {t("common.noData")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t("common.save")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
