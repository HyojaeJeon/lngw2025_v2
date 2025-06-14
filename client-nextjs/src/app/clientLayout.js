"use client";

import { ApolloProvider } from "@apollo/client";
import { ReduxProvider } from "../providers/reduxProvider";
import { LanguageProvider } from "../hooks/useLanguage";
import apolloClient from "../lib/apolloClient";
import DashboardLayout from "../components/layout/dashboardLayout";
import { Toaster } from "../components/ui/toaster";
import { usePathname } from "next/navigation";
import { ErrorBoundaryHandler } from "../apollo/errorLink";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // 로그인/회원가입 페이지에서는 DashboardLayout을 사용하지 않음
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <ReduxProvider>
      <LanguageProvider>
        <ApolloProvider client={apolloClient}>
          <ErrorBoundaryHandler>
            {isAuthPage ? (
              <>
                {children}
                <Toaster />
              </>
            ) : (
              <DashboardLayout>
                {children}
                <Toaster />
              </DashboardLayout>
            )}
          </ErrorBoundaryHandler>
        </ApolloProvider>
      </LanguageProvider>
    </ReduxProvider>
  );
}