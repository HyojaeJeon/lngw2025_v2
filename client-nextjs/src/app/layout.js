import "./globals.css";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/contexts/languageContext.js";
import { ThemeProvider } from "@/contexts/themeContext.js";
import { ApolloProviderWrapper } from "@/providers/apolloProvider.js";
import { ReduxProvider } from "@/providers/reduxProvider.js";
import { Toaster } from "@/components/ui/toaster.js";
import AuthInitializer from "@/components/ui/AuthInitializer";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CRM System",
  description: "Customer Relationship Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
