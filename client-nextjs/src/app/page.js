"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage.js";

export default function HomePage() {
  const router = useRouter();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // 홈페이지 접근 시 자동으로 대시보드로 리디렉션
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          대시보드로 이동 중...
        </p>
      </div>
    </div>
  );
}
