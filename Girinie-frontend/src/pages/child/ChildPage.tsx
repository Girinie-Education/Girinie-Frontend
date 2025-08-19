import React from "react";
import Sidebar from "../child/components/ChildSidebar";

export default function ChildPage({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="flex h-full w-full flex-1">
        <aside className="w-60 shrink-0">
          <Sidebar />
        </aside>
        <main className="min-h-screen flex-1">{children}</main>
      </div>
    </div>
  );
}
