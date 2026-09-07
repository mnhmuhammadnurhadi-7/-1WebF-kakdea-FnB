import React from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  activeMenu?: string;
}

export function AppLayout({ children, activeMenu = "dashboard" }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-ink">
      <Sidebar active={activeMenu} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
