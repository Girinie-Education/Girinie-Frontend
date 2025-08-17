import React from "react";
import Sidebar from "./components/GuardianSidebar";

type Props = {
  children?: React.ReactNode;
};

// Guardian 레이아웃: 좌측 사이드바 + 우측 콘텐츠 영역
export default function GuardianPage({ children }: Props) {
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
