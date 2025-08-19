import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GirinieIcon from "@/assets/icons/Girinie.svg";
import { useAuthStore } from "@/stores/authStore";
import { useChildData } from "@/hooks/useChildData";

const ChildSidebar: React.FC = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: children, loading, error } = useChildData();

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

  if (!Array.isArray(children) || children.length === 0) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-56 border-r border-gray-300 bg-white p-6 pt-20 text-gray-500">
        {Array.isArray(children) ? "등록된 자녀가 없습니다." : "자녀 목록을 가져올 수 없습니다."}
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-56 flex-col border-r border-gray-300 bg-white pt-20 text-black">
      {/* 프로필 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-7">
          <ul className="space-y-4">
            {children.map((child) => (
              <li
                key={child.id}
                onClick={() => navigate(`/child/${child.id}`)}
                className={`flex cursor-pointer flex-col items-center space-y-2 rounded px-4 py-2 transition ${
                  isActive(`/child/${child.id}`)
                    ? "bg-gray-100 font-semibold text-black"
                    : "text-gray-500"
                }`}
              >
                <img
                  src={child.avatarUrl ?? GirinieIcon}
                  alt={child.name}
                  className="mb-3 h-30 w-30 rounded-full bg-gray-200"
                />
                <span className="text-base font-semibold text-gray-800 transition hover:text-secondary">
                  {child.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <nav className="m-0 border-y border-gray-300 p-0">
          <div
            onClick={() => navigate("/chatbot")}
            className={`cursor-pointer px-8 py-4 transition hover:text-secondary ${
              isActive("/chatbot") ? "font-semibold text-black" : "text-gray-500"
            }`}
          >
            챗봇
          </div>
          <hr className="my-1 border-gray-200" />
          <div
            onClick={() => navigate("/learningrate")}
            className={`cursor-pointer px-8 py-4 transition hover:text-secondary ${
              isActive("/learningrate") ? "font-semibold text-black" : "text-gray-500"
            }`}
          >
            학습률
          </div>
          <hr className="my-1 border-gray-200" />
          <div
            onClick={() => navigate("/calendar/child")}
            className={`cursor-pointer px-8 py-4 transition hover:text-secondary ${
              isActive("/calendar/child") ? "font-semibold text-black" : "text-gray-500"
            }`}
          >
            캘린더
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default ChildSidebar;