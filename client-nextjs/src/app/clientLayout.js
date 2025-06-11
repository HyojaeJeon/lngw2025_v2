"use client";

import { ReduxProvider } from "@/providers/reduxProvider";
import { ApolloProviderWrapper } from "@/providers/apolloProvider";
import { ThemeProvider } from "@/contexts/themeContext";
import { LanguageProvider } from "@/hooks/useLanguage";
import { Toaster } from "@/components/ui/toaster.js";
import AuthInitializer from "@/components/ui/AuthInitializer";

export default function ClientLayout({ children }) {
  return (
    <ReduxProvider>
      <ApolloProviderWrapper>
        <ThemeProvider>
          <LanguageProvider>
            <AuthInitializer>
              {children}
              <Toaster />
            </AuthInitializer>
          </LanguageProvider>
        </ThemeProvider>
      </ApolloProviderWrapper>
    </ReduxProvider>
  );
}
