"use client";

import { ApolloProvider } from "@apollo/client";
import { ReduxProvider } from "../providers/reduxProvider";
import { LanguageProvider } from "../hooks/useLanguage";
import apolloClient from "../lib/apolloClient";
import { Toaster } from "../components/ui/toaster";
import { usePathname } from "next/navigation";

// ErrorBoundary 컴포넌트 임시 생성
function ErrorBoundaryHandler({ children }) {
  return children;
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // 로그인/회원가입 페이지에서는 기본 레이아웃 사용
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <ReduxProvider>
      <LanguageProvider>
        <ApolloProvider client={apolloClient}>
          <ErrorBoundaryHandler>
            {children}
            <Toaster />
          </ErrorBoundaryHandler>
        </ApolloProvider>
      </LanguageProvider>
    </ReduxProvider>
  );
}