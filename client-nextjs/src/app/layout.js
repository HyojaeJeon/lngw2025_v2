import './globals.css'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/contexts/languageContext.js'
import { ThemeProvider } from '@/contexts/themeContext.js'
import { ApolloProviderWrapper } from '@/providers/apolloProvider.js'
import { ReduxProvider } from '@/providers/reduxProvider.js'
import { Toaster } from '@/components/ui/toaster.js'
import AuthInitializer from '@/components/ui/AuthInitializer';
import { useLanguage } from "../hooks/useLanguage.js";
import { useEffect } from 'react';

// 언어 초기화 컴포넌트
function LanguageInitializer({ children }) {
  const { initializeLanguageSettings, isInitialized } = useLanguage();

  useEffect(() => {
    if (!isInitialized) {
      initializeLanguageSettings();
    }
  }, [initializeLanguageSettings, isInitialized]);

  return children;
}

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CRM System',
  description: 'Customer Relationship Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ReduxProvider>
          <ApolloProviderWrapper>
            <ThemeProvider>
              <LanguageInitializer>
                <AuthInitializer>
                  {children}
                  <Toaster />
                </AuthInitializer>
              </LanguageInitializer>
            </ThemeProvider>
          </ApolloProviderWrapper>
        </ReduxProvider>
      </body>
    </html>
  )
}