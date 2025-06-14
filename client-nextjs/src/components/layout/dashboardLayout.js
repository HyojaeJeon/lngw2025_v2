"use client";

import React, { useState } from "react";
import Header from "./header.js";
import { ResizableSidebar, Sidebar } from "./sidebar.js";
import { useIsMobile } from "../../hooks/useIsMobile.js";

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 모바일일 때는 토글 가능한 사이드바, 데스크톱일 때는 리사이즈 가능한 사이드바 사용 //
  if (isMobile) {
    return (
      <div className="flex flex-col w-screen h-screen overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <div className="flex flex-col w-full h-full">
          {/* 고정 헤더 */}
          <Header onMenuToggle={toggleSidebar} />
          {/* 스크롤 가능한 메인 컨텐츠 */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto animate-fadeIn">
            <div className="w-full max-w-none">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <ResizableSidebar>
        <div className="flex flex-col w-full h-full">
          {/* 고정 헤더 */}
          <Header onMenuToggle={toggleSidebar} />
          {/* 스크롤 가능한 메인 컨텐츠 */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto animate-fadeIn">
            <div className="w-full max-w-none">{children}</div>
          </main>
        </div>
      </ResizableSidebar>
    </div>
  );
}
"use client";

import { ResizableSidebar } from "./sidebar";
import Header from "./header";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <ResizableSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
