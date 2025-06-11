
"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import ClientLayout from "./clientLayout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <title>LN Partners 그룹웨어</title>
        <meta name="description" content="Customer Relationship Management System" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
