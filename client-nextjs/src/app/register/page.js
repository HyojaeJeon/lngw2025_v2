"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
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
import { LoadingModal } from "@/components/ui/LoadingModal.js";
import { REGISTER_MUTATION } from "@/lib/graphql/mutations.js";
import { useLanguage } from "@/hooks/useLanguage.js";
import { setCredentials } from "@/store/slices/authSlice.js";
import { Globe, Sun, Moon, Trash2, Plus, Eye, EyeOff, Phone, Calendar } from "lucide-react";
import { useTheme } from "@/contexts/themeContext.js";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    department: "",
    position: "",
    employeeId: "",
    joinDate: "",
    phoneNumber: "",
    phoneCountry: "",
    address: "",
    nationality: "",
    birthDate: "",
    visaStatus: "",
    emergencyContact: [{ name: "", relationship: "", phoneNumber: "" }],
    skills: [""],
    experiences: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    hasUppercase: false,
    hasSpecialChar: false,
    hasMinLength: false,
    isMatching: false
  });
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { t, language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const departments = [
    { value: "sales", label: t("register.department.sales") },
    { value: "inventory", label: t("register.department.inventory") },
    { value: "marketing", label: t("register.department.marketing") },
    { value: "accounting", label: t("register.department.accounting") },
    { value: "support", label: t("register.department.support") },
    { value: "other", label: t("register.department.other") },
  ];

  const nationalities = [
    { value: "vietnam", label: t("register.nationality.vietnam") },
    { value: "korea", label: t("register.nationality.korea") },
    { value: "usa", label: t("register.nationality.usa") },
    { value: "japan", label: t("register.nationality.japan") },
    { value: "china", label: t("register.nationality.china") },
    { value: "thailand", label: t("register.nationality.thailand") },
    { value: "other", label: t("register.nationality.other") },
  ];

  const phoneCountries = [
    { value: "vn", label: "+84 (Vietnam)", code: "+84", flag: "🇻🇳" },
    { value: "kr", label: "+82 (Korea)", code: "+82", flag: "🇰🇷" },
    { value: "us", label: "+1 (USA)", code: "+1", flag: "🇺🇸" },
    { value: "jp", label: "+81 (Japan)", code: "+81", flag: "🇯🇵" },
    { value: "cn", label: "+86 (China)", code: "+86", flag: "🇨🇳" },
    { value: "th", label: "+66 (Thailand)", code: "+66", flag: "🇹🇭" },
  ];

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 전화번호 유효성 검사
  const validatePhoneNumber = (phone, countryCode) => {
    if (!countryCode || !phone) return false;

    const phoneRegexMap = {
      "+84": /^[0-9]{9,10}$/, // Vietnam
      "+82": /^[0-9]{9,11}$/, // Korea
      "+1": /^[0-9]{10}$/, // USA
      "+81": /^[0-9]{10,11}$/, // Japan
      "+86": /^[0-9]{11}$/, // China
      "+66": /^[0-9]{9,10}$/, // Thailand
    };

    const regex = phoneRegexMap[countryCode];
    return regex ? regex.test(phone.replace(/\D/g, '')) : false;
  };

  // 비밀번호 강도 검증 함수
  const validatePassword = (password, confirmPassword = formData.confirmPassword) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMinLength = password.length >= 8;
    const isMatching = password === confirmPassword && password !== "";

    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasSpecialChar) score++;

    let label = "";
    if (password === "") {
      label = "";
    } else if (score <= 1) {
      label = t("register.password.strength.weak");
    } else if (score === 2) {
      label = t("register.password.strength.medium");
    } else {
      label = t("register.password.strength.strong");
    }

    return {
      score,
      label,
      hasUppercase,
      hasSpecialChar,
      hasMinLength,
      isMatching
    };
  };

  // 날짜 포맷 함수
  const formatDateForLocale = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    const localeMap = {
      ko: "ko-KR",
      vi: "vi-VN", 
      en: "en-US"
    };

    return date.toLocaleDateString(localeMap[language] || "ko-KR");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // 이메일 유효성 검사
    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError(t("register.email.invalid"));
      } else {
        setEmailError("");
      }
    }

    // 전화번호 유효성 검사
    if (name === "phoneNumber" && formData.phoneCountry) {
      const selectedCountry = phoneCountries.find(c => c.value === formData.phoneCountry);
      if (value && !validatePhoneNumber(value, selectedCountry?.code)) {
        setPhoneError(t("register.phone.invalid"));
      } else {
        setPhoneError("");
      }
    }

    // 비밀번호 필드가 변경될 때 강도 검증
    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    } else if (name === "confirmPassword") {
      setPasswordStrength(validatePassword(formData.password, value));
    }
  };

  const handlePhoneCountryChange = (e) => {
    const countryValue = e.target.value;
    setFormData({
      ...formData,
      phoneCountry: countryValue,
      phoneNumber: "" // 국가 변경 시 전화번호 초기화
    });
    setPhoneError(""); // 에러 메시지 초기화
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const newArray = [...formData[arrayName]];
    if (arrayName === "skills") {
      newArray[index] = value;
    } else {
      newArray[index] = { ...newArray[index], [field]: value };
    }
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], defaultItem],
    });
  };

  const removeArrayItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 필수 필드 검증
      const requiredFields = [
        "name",
        "email",
        "password",
        "confirmPassword",
        "department",
        "phoneNumber",
        "phoneCountry",
        "nationality",
        "joinDate",
        "birthDate",
      ];
      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].trim() === "",
      );

      if (missingFields.length > 0) {
        throw new Error("필수 입력 사항을 모두 입력해주세요.");
      }

      // 이메일 유효성 검증
      if (!validateEmail(formData.email)) {
        throw new Error(t("register.email.invalid"));
      }

      // 전화번호 유효성 검증
      const selectedCountry = phoneCountries.find(c => c.value === formData.phoneCountry);
      if (!validatePhoneNumber(formData.phoneNumber, selectedCountry?.code)) {
        throw new Error(t("register.phone.invalid"));
      }

      // 비밀번호 검증
      if (formData.password !== formData.confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      if (formData.password.length < 8) {
        throw new Error("비밀번호는 최소 8자 이상이어야 합니다.");
      }

      if (!/[A-Z]/.test(formData.password)) {
        throw new Error("비밀번호에 대문자가 1개 이상 포함되어야 합니다.");
      }

      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
        throw new Error("비밀번호에 특수문자가 1개 이상 포함되어야 합니다.");
      }

      // 빈 값들 필터링
      const cleanedData = {
        ...formData,
        phoneNumber: `${selectedCountry.code}${formData.phoneNumber}`, // 국가코드 포함
        department:
          formData.department === "other"
            ? formData.otherDepartment
            : formData.department,
        emergencyContact: formData.emergencyContact.filter(
          (contact) =>
            contact.name && contact.relationship && contact.phoneNumber,
        ),
        skills: formData.skills
          .filter((skill) => skill.trim() !== "")
          .map(skill => ({ name: skill, level: "intermediate" })),
        experiences: formData?.experiences
          ?.filter((exp) => exp.company && exp.position)
          ?.map((exp) => ({
            company: exp.company,
            position: exp.position,
            period: `${exp.startDate} - ${exp.endDate || "현재"}`,
            description: exp.description,
          })),
      };

      const { data } = await registerMutation({
        variables: {
          input: cleanedData,
        },
      });

      if (data?.register?.token) {
        localStorage.setItem("auth_token", data.register.token);

        // Redux에 사용자 데이터 저장
        dispatch(
          setCredentials({
            user: data.register.user,
            token: data.register.token,
          }),
        );

        toast({
          title: "회원가입 성공",
          description: "대시보드로 이동합니다.",
        });

        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const RequiredLabel = ({ children }) => (
    <span className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </span>
  );

  return (
    <>
      <LoadingModal
        isOpen={isLoading}
        title="회원가입 처리 중..."
        description="계정을 생성하고 있습니다. 잠시만 기다려주세요."
      />

      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isLoading ? "pointer-events-none" : ""}`}
      >
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LN</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                LN Partners
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-8 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
                <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content with padding for fixed header */}
        <div className="pt-20 pb-8 px-4 overflow-y-auto max-h-screen">
          <div className="container mx-auto flex items-center justify-center">
            <Card className="w-full max-w-4xl shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("register.title")}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("register.description")}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <RequiredLabel>
                        <Label htmlFor="name">{t("register.name")}</Label>
                      </RequiredLabel>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={t("register.name.placeholder")}
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel>
                        <Label htmlFor="email">{t("register.email")}</Label>
                      </RequiredLabel>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={emailError ? "border-red-500" : ""}
                        required
                      />
                      {emailError && (
                        <p className="text-sm text-red-500">{emailError}</p>
                      )}
                    </div>
                  </div>

                  {/* 비밀번호 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <RequiredLabel>
                        <Label htmlFor="password">비밀번호</Label>
                      </RequiredLabel>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="비밀번호를 입력하세요 (최소 8자, 대문자 1개, 특수문자 1개)"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel>
                        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                      </RequiredLabel>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="비밀번호를 다시 입력하세요"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 비밀번호 강도 및 상태 표시 */}
                  {(formData.password || formData.confirmPassword) && (
                    <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {/* 비밀번호 강도 */}
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {t("register.password.strength")}:
                            </span>
                            <span className={`text-sm font-bold ${
                              passwordStrength.label === t("register.password.strength.strong")
                                ? "text-green-600" 
                                : passwordStrength.label === t("register.password.strength.medium") 
                                ? "text-yellow-600" 
                                : passwordStrength.label === t("register.password.strength.weak")
                                ? "text-red-600"
                                : "text-gray-400"
                            }`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength.score === 3 
                                  ? "bg-green-500 w-full" 
                                  : passwordStrength.score === 2 
                                  ? "bg-yellow-500 w-2/3" 
                                  : passwordStrength.score === 1
                                  ? "bg-red-500 w-1/3"
                                  : "bg-gray-300 w-0"
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {/* 비밀번호 조건 체크리스트 */}
                      <div className="space-y-1">
                        <div className={`flex items-center text-xs ${
                          passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500 dark:text-gray-400"
                        }`}>
                          <span className="mr-2">
                            {passwordStrength.hasMinLength ? "✓" : "○"}
                          </span>
                          {t("register.password.requirement.minLength")}
                        </div>
                        <div className={`flex items-center text-xs ${
                          passwordStrength.hasUppercase ? "text-green-600" : "text-gray-500 dark:text-gray-400"
                        }`}>
                          <span className="mr-2">
                            {passwordStrength.hasUppercase ? "✓" : "○"}
                          </span>
                          {t("register.password.requirement.uppercase")}
                        </div>
                        <div className={`flex items-center text-xs ${
                          passwordStrength.hasSpecialChar ? "text-green-600" : "text-gray-500 dark:text-gray-400"
                        }`}>
                          <span className="mr-2">
                            {passwordStrength.hasSpecialChar ? "✓" : "○"}
                          </span>
                          {t("register.password.requirement.specialChar")}
                        </div>
                        {formData.confirmPassword && (
                          <div className={`flex items-center text-xs ${
                            passwordStrength.isMatching ? "text-green-600" : "text-red-500"
                          }`}>
                            <span className="mr-2">
                              {passwordStrength.isMatching ? "✓" : "✗"}
                            </span>
                            {t("register.password.requirement.match")}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 직장 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <RequiredLabel>
                        <Label htmlFor="department">
                          {t("register.department")}
                        </Label>
                      </RequiredLabel>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t("register.department")}</option>
                        {departments.map((dept) => (
                          <option key={dept.value} value={dept.value}>
                            {dept.label}
                          </option>
                        ))}
                      </select>
                      {formData.department === "other" && (
                        <Input
                          name="otherDepartment"
                          type="text"
                          placeholder={t("register.department.otherInput")}
                          value={formData.otherDepartment}
                          onChange={handleChange}
                          required
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">{t("register.position")}</Label>
                      <Input
                        id="position"
                        name="position"
                        type="text"
                        value={formData.position}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">
                        {t("register.employeeId")}
                      </Label>
                      <Input
                        id="employeeId"
                        name="employeeId"
                        type="text"
                        value={formData.employeeId}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* 전화번호 (국가 선택 포함) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <RequiredLabel>
                        <Label htmlFor="phoneCountry">
                          {t("register.phone.country")}
                        </Label>
                      </RequiredLabel>
                      <div className="relative">
                        <select
                          id="phoneCountry"
                          name="phoneCountry"
                          value={formData.phoneCountry}
                          onChange={handlePhoneCountryChange}
                          required
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">{t("register.phone.selectCountry")}</option>
                          {phoneCountries.map((country) => (
                            <option key={country.value} value={country.value}>
                              {country.flag} {country.label}
                            </option>
                          ))}
                        </select>
                        <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel>
                        <Label htmlFor="phoneNumber">
                          {t("register.phoneNumber")}
                        </Label>
                      </RequiredLabel>
                      <div className="flex">
                        {formData.phoneCountry && (
                          <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md text-sm text-gray-600 dark:text-gray-300">
                            {phoneCountries.find(c => c.value === formData.phoneCountry)?.code}
                          </div>
                        )}
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          disabled={!formData.phoneCountry}
                          placeholder={!formData.phoneCountry ? t("register.phone.selectCountry") : ""}
                          className={`${formData.phoneCountry ? 'rounded-l-none' : ''} ${phoneError ? 'border-red-500' : ''}`}
                          required
                        />
                      </div>
                      {phoneError && (
                        <p className="text-sm text-red-500">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  {/* 국적 */}
                  <div className="space-y-2">
                    <RequiredLabel>
                      <Label htmlFor="nationality">
                        {t("register.nationality")}
                      </Label>
                    </RequiredLabel>
                    <select
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t("register.nationality")}</option>
                      {nationalities.map((nat) => (
                        <option key={nat.value} value={nat.value}>
                          {nat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{t("register.address")}</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder={t("register.address.placeholder")}
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  {/* 개선된 날짜 입력 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <RequiredLabel>
                        <Label htmlFor="birthDate">
                          {t("register.birthDate")}
                        </Label>
                      </RequiredLabel>
                      <div className="relative">
                        <Input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={handleChange}
                          className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 
                                   [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert
                                   [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          required
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {formData.birthDate && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateForLocale(formData.birthDate)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel>
                        <Label htmlFor="joinDate">
                          {t("register.joinDate")}
                        </Label>
                      </RequiredLabel>
                      <div className="relative">
                        <Input
                          id="joinDate"
                          name="joinDate"
                          type="date"
                          value={formData.joinDate}
                          onChange={handleChange}
                          className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 
                                   [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert
                                   [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          required
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {formData.joinDate && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateForLocale(formData.joinDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 비자 정보 */}
                  <div className="space-y-2">
                    <Label htmlFor="visaStatus">
                      {t("register.visaStatus")}
                      <span className="text-sm text-gray-500 ml-2">
                        (선택 - 해당하는 경우만 입력)
                      </span>
                    </Label>
                    <Input
                      id="visaStatus"
                      name="visaStatus"
                      type="text"
                      value={formData.visaStatus}
                      onChange={handleChange}
                    />
                  </div>

                  {/* 비상연락처 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>{t("register.emergencyContact")}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          addArrayItem("emergencyContact", {
                            name: "",
                            relationship: "",
                            phoneNumber: "",
                          })
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t("register.addEmergencyContact")}
                      </Button>
                    </div>
                    {formData.emergencyContact.map((contact, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        <Input
                          placeholder={t("register.emergencyContact.name")}
                          value={contact.name}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "name",
                              e.target.value,
                              "emergencyContact",
                            )
                          }
                        />
                        <Input
                          placeholder={t(
                            "register.emergencyContact.relationship",
                          )}
                          value={contact.relationship}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "relationship",
                              e.target.value,
                              "emergencyContact",
                            )
                          }
                        />
                        <Input
                          placeholder={t("register.emergencyContact.phone")}
                          value={contact.phoneNumber}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "phoneNumber",
                              e.target.value,
                              "emergencyContact",
                            )
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            removeArrayItem(index, "emergencyContact")
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* 기술 (선택사항) */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>{t("register.skills")} (선택사항)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem("skills", "")}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t("register.addSkill")}
                      </Button>
                    </div>
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-4">
                        <Input
                          placeholder={t("register.skills")}
                          value={skill}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              null,
                              e.target.value,
                              "skills",
                            )
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem(index, "skills")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* 경력 (선택사항) */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>{t("register.experience")} (선택사항)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          addArrayItem("experiences", {
                            company: "",
                            position: "",
                            startDate: "",
                            endDate: "",
                            description: "",
                          })
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t("register.addExperience")}
                      </Button>
                    </div>
                    {formData.experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder={t("register.experience.company")}
                            value={exp.company}
                            onChange={(e) =>
                              handleArrayChange(
                                index,
                                "company",
                                e.target.value,
                                "experiences",
                              )
                            }
                          />
                          <Input
                            placeholder={t("register.experience.position")}
                            value={exp.position}
                            onChange={(e) =>
                              handleArrayChange(
                                index,
                                "position",
                                e.target.value,
                                "experiences",
                              )
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2 relative">
                            <Label className="text-sm">
                              {t("register.experience.startDate")}
                            </Label>
                            <Input
                              type="date"
                              value={exp.startDate}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "startDate",
                                  e.target.value,
                                  "experiences",
                                )
                              }
                              className="dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 
                                       [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert"
                            />
                          </div>
                          <div className="space-y-2 relative">
                            <Label className="text-sm">
                              {t("register.experience.endDate")}
                            </Label>
                            <Input
                              type="date"
                              value={exp.endDate}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "endDate",
                                  e.target.value,
                                  "experiences",
                                )
                              }
                              className="dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 
                                       [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Input
                            placeholder={t("register.experience.description")}
                            value={exp.description}
                            onChange={(e) =>
                              handleArrayChange(
                                index,
                                "description",
                                e.target.value,
                                "experiences",
                              )
                            }
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeArrayItem(index, "experiences")
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "처리 중..." : t("register.submit")}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => router.push("/login")}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      disabled={isLoading}
                    >
                      {t("register.login.link")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* 다크 테마에서 날짜 입력 캘린더 스타일 개선 */
        .dark input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.8;
        }

        .dark input[type="date"]::-webkit-datetime-edit {
          color: #e5e7eb;
        }

        .dark input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          color: #e5e7eb;
        }

        .dark input[type="date"]::-webkit-datetime-edit-text {
          color: #9ca3af;
        }

        .dark input[type="date"]::-webkit-datetime-edit-month-field {
          color: #e5e7eb;
        }

        .dark input[type="date"]::-webkit-datetime-edit-day-field {
          color: #e5e7eb;
        }

        .dark input[type="date"]::-webkit-datetime-edit-year-field {
          color: #e5e7eb;
        }

        /* 날짜 입력 필드 스타일 개선 */
        input[type="date"] {
          position: relative;
          background: transparent;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          border-radius: 4px;
          margin-right: 2px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
    </>
  );
}