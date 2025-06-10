"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
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
import { LOGIN_MUTATION } from "@/lib/graphql/mutations.js";
import { useLanguage } from "@/contexts/languageContext.js";
import { setCredentials } from "@/store/slices/authSlice.js";
import { Globe, Sun, Moon, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/contexts/themeContext.js";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { t, language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  // 페이지 로드 시 저장된 토큰으로 자동 로그인 체크
  useEffect(() => {
    const checkAutoLogin = async () => {
      const savedRememberMe = localStorage.getItem("rememberMe");
      const savedToken = localStorage.getItem("auth_token");

      if (savedRememberMe === "true" && savedToken) {
        setRememberMe(true);
        // 토큰이 유효한지 확인하고 자동 로그인 처리는 AuthInitializer에서 담당
      } else {
        setRememberMe(false);
      }
    };

    checkAutoLogin();
  }, []);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            ...formData,
            rememberMe,
          },
        },
      });

      if (data?.login?.token) {
        // Redux에 사용자 데이터 저장
        dispatch(
          setCredentials({
            user: data.login.user,
            token: data.login.token,
            rememberMe: rememberMe,
          }),
        );

        toast({
          title: t("login.success"),
          description: t("login.success.description"),
        });

        // Use setTimeout to ensure Redux state is updated before navigation
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      }
    } catch (error) {
      toast({
        title: t("login.error"),
        description: error.message || t("login.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
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

      {/* Main Content */}
      <div
        className="flex items-center justify-center p-4 transition-all duration-500"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <Card
          className="w-full max-w-md transform transition-all duration-500 shadow-xl hover:shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        >
          <CardHeader className="text-center pb-6">
            <div
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 animate-pulse shadow-lg"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <CardTitle
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {t("login.title")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
              {t("login.description")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("login.email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("login.email")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="transition-all duration-300 focus:scale-105 focus:shadow-md border-gray-300 dark:border-gray-600 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("login.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.password")}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:scale-105 focus:shadow-md border-gray-300 dark:border-gray-600 focus:border-blue-500 pr-10"
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

              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => {
                      setRememberMe(e.target.checked);
                      localStorage.setItem('rememberMe', e.target.checked.toString());
                    }}
                    className="sr-only"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center cursor-pointer group"
                  >
                    <div
                      className={`
                        w-5 h-5 rounded-md border-2 transition-all duration-300 ease-in-out
                        flex items-center justify-center mr-3
                        ${
                          rememberMe
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent shadow-md transform scale-105'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-blue-400'
                        }
                      `}
                    >
                      {rememberMe && (
                        <svg
                          className="w-3 h-3 text-white animate-fadeIn"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {t("login.rememberMe")}
                    </span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("login.loading")}
                  </div>
                ) : (
                  t("login.submit")
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push("/register")}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 hover:underline"
                >
                  {t("login.register.link")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}