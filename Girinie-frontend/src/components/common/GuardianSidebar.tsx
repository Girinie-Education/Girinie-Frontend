// src/components/common/GuardianSidebar.tsx
import React, { useEffect, useState } from "react";
import GirinieIcon from "@/assets/icons/Girinie.svg";
import { useAuthStore } from "@/stores/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useChildData } from "@/hooks/useChildData";

const GuardianSidebar: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: childList, loading, error } = useChildData();
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (Array.isArray(childList) && childList.length > 0) {
      setSelectedChildId(String(childList[0].id));
    }
  }, [childList]);

  if (!isLoggedIn) return null;

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <aside className="fixed left-0 top-0 flex h-screen w-56 items-center justify-center border-r border-gray-300 bg-white pt-20">
        로딩 중…
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="fixed left-0 top-0 flex h-screen w-56 items-center justify-center border-r border-gray-300 bg-white pt-20 text-red-500">
        {error}
      </aside>
    );
  }

  if (!Array.isArray(childList) || childList.length === 0) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-56 border-r border-gray-300 bg-white p-6 pt-20 text-gray-500">
        {Array.isArray(childList) ? "등록된 자녀가 없습니다." : "자녀 목록을 가져올 수 없습니다."}
      </aside>
    );
  }

  return (
    <aside className="sticky left-0 top-0 flex h-full w-56 flex-col justify-between border-r border-gray-300 bg-white pt-20 text-black">
      <div className="flex-1 overflow-y-auto p-7">
        <ul className="space-y-4">
          {childList.map((child) => (
            <li
              key={child.id}
              onClick={() => navigate(`/child/${child.id}`)}
              className={`flex cursor-pointer items-center space-x-2 rounded px-4 py-2 transition ${
                isActive(`/child/${child.id}`)
                  ? "bg-gray-100 font-semibold text-black"
                  : "text-gray-500"
              }`}
            >
              <img
                src={GirinieIcon}
                alt={child.name}
                className="mr-3 h-15 w-15 rounded-full bg-gray-200"
              />
              <span className="text-base font-semibold text-gray-800 transition hover:text-secondary">
                {child.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <nav className="border-t border-gray-300">
        <div
          onClick={() => selectedChildId && navigate(`/parentCalendar/${selectedChildId}`)}
          className={`cursor-pointer px-8 py-4 transition hover:text-secondary ${
            isActive("/parentCalendar") ? "font-semibold text-black" : "text-gray-500"
          }`}
        >
          캘린더
        </div>
        <hr className="my-1 border-gray-200" />
        <div
          onClick={() => navigate("/settings")}
          className={`cursor-pointer px-8 py-4 transition hover:text-secondary ${
            isActive("/settings") ? "font-semibold text-black" : "text-gray-500"
          }`}
        >
          설정
        </div>
      </nav>
    </aside>
  );
};

export default GuardianSidebar;
