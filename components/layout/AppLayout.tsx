import React from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  activeMenu?: string;
}

export function AppLayout({ children, activeMenu = "dashboard" }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink md:flex-row">
      <Sidebar active={activeMenu} />
      <main className="flex min-h-[calc(100dvh-4rem)] min-w-0 flex-1 flex-col md:min-h-screen">
        <div className="page-enter flex-1 px-4 py-5 pb-24 sm:px-6 sm:py-7 sm:pb-28 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
