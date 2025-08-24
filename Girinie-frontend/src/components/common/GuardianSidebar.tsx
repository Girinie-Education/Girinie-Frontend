// src/components/common/GuardianSidebar.tsx
import React, { useState } from 'react';
import GirinieIcon from '@/assets/icons/Girinie.svg';
import { useAuthStore } from '@/stores/authStore';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useChildData } from '@/hooks/useChildData';
import { ChevronRight } from 'lucide-react';

const GuardianSidebar: React.FC = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const { data: children, loading, error } = useChildData();
  const location = useLocation();
  const navigate = useNavigate();
  const { childId } = useParams<{ childId?: string }>();
  const [isChildListOpen, setIsChildListOpen] = useState(false);

  if (!isLoggedIn) return null;

  const isActive = (path: string) => location.pathname.startsWith(path);

  if (loading) {
    return (
      <aside className="fixed left-0 top-0 w-56 h-screen pt-20 bg-white flex items-center justify-center border-r border-gray-300">
        로딩 중…
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="fixed left-0 top-0 w-56 h-screen pt-20 bg-white flex items-center justify-center border-r border-gray-300 text-red-500">
        {error}
      </aside>
    );
  }

  if (!Array.isArray(children) || children.length === 0) {
    return (
      <aside className="fixed left-0 top-0 w-56 h-screen pt-20 bg-white p-6 border-r border-gray-300 text-gray-500">
        {'등록된 자녀가 없습니다.'}
      </aside>
    );
  }

  const selectedId = childId ? Number(childId) : children[0]?.id;
  const currentChild = children.find(c => c.id === selectedId) ?? children[0];
  const otherChildren = children.filter(c => c.id !== currentChild.id);

  return (
    <aside className="fixed left-0 top-0 w-56 h-screen pt-20 bg-white text-black flex flex-col justify-between border-r border-gray-300">
      <div className="overflow-y-auto flex-1">
        {/* Current Child Profile */}
        {currentChild && (
            <div className="p-7">
                <div
                onClick={() => navigate(`/calendar/parent/${currentChild.id}`)}
                className={`mt-3 flex flex-col items-center cursor-pointer rounded px-4 py-2 transition ${
                    isActive(`/calendar/parent/${currentChild.id}`)
                    ? "font-semibold text-black"
                    : "text-gray-500"
                }`}
                >
                <div className={`mb-3 h-24 w-24 rounded-full flex items-center justify-center overflow-hidden ${currentChild.color || 'bg-gray-200'}`}>
                    <img
                    src={currentChild.avatarUrl || GirinieIcon}
                    alt={currentChild.name}
                    className="mt-3 w-full h-full object-contain"
                    />
                </div>
                <span className="text-base font-semibold text-gray-800 transition hover:text-secondary">
                    {currentChild.name}
                </span>
                </div>
            </div>
        )}

        {/* Other children (collapsible) */}
        {otherChildren.length > 0 && (
          <div className="p-4 border-y border-gray-300">
            <button
              onClick={() => setIsChildListOpen(!isChildListOpen)}
              className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-semibold transition hover:bg-gray-100"
            >
              <span>다른 자녀</span>
              <ChevronRight
                size={16}
                className={`transition-transform duration-200 ${isChildListOpen ? "rotate-90" : ""}`}
              />
            </button>
            {isChildListOpen && (
              <ul className="mt-2 space-y-2">
                {otherChildren.map((child) => (
                  <li
                    key={child.id}
                    onClick={() => navigate(`/calendar/parent/${child.id}`)}
                    className={`flex cursor-pointer items-center space-x-2 rounded px-2 py-2 transition ${
                      selectedId === child.id
                        ? "bg-gray-100 font-semibold text-black"
                        : "text-gray-500 hover:text-secondary"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center overflow-hidden ${child.color || 'bg-gray-200'}`}>
                      <img
                        src={child.avatarUrl || GirinieIcon}
                        alt={child.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium">{child.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="border-t border-gray-300">
        <div
          onClick={() => navigate('/calendar/parent')}
          className={`px-8 py-4 cursor-pointer transition hover:text-secondary ${
            location.pathname === '/calendar/parent' ? 'font-semibold text-black' : 'text-gray-500'
          }`}
        >
          캘린더
        </div>
        <hr className="border-gray-200 my-1" />
        <div
          onClick={() => navigate('/settings')}
          className={`px-8 py-4 cursor-pointer transition hover:text-secondary ${
            isActive('/settings') ? 'font-semibold text-black' : 'text-gray-500'
          }`}
        >
          설정
        </div>
      </nav>
    </aside>
  );
};

export default GuardianSidebar;
