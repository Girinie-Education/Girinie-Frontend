// src/components/common/GuardianSidebar.tsx
import React from 'react';
import GirinieIcon from '@/assets/icons/Girinie.svg';
import { useAuthStore } from '@/stores/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChildData } from '@/hooks/useChildData';

const GuardianSidebar: React.FC = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const { data: children, loading, error } = useChildData();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isLoggedIn) return null;

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <aside className="pt-20 w-56 h-screen fixed top-0 left-0 bg-white flex items-center justify-center border-r border-gray-300">
        로딩 중…
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="pt-20 w-56 h-screen fixed top-0 left-0 bg-white flex items-center justify-center border-r border-gray-300 text-red-500">
        {error}
      </aside>
    );
  }

  if (!Array.isArray(children) || children.length === 0) {
    return (
      <aside className="pt-20 w-56 h-screen fixed top-0 left-0 bg-white p-6 border-r border-gray-300 text-gray-500">
        {Array.isArray(children)
          ? '등록된 자녀가 없습니다.'
          : '자녀 목록을 가져올 수 없습니다.'}
      </aside>
    );
  }

  return (
    <aside className="pt-20 w-56 h-full sticky top-0 left-0 bg-white text-black flex flex-col justify-between border-r border-gray-300">
      <div className="p-7 overflow-y-auto flex-1">
        <ul className="space-y-4">
          {children.map(child => (
            <li
              key={child.id}
              onClick={() => navigate(`/child/${child.id}`)}
              className={`flex items-center space-x-2 px-4 py-2 rounded cursor-pointer transition ${
                isActive(`/child/${child.id}`)
                  ? 'bg-gray-100 font-semibold text-black'
                  : 'text-gray-500'
              }`}
            >
              <img
                src={GirinieIcon}
                alt={child.name}
                className="w-15 h-15 rounded-full bg-gray-200 mr-3"
              />
              <span className="text-base font-semibold text-gray-800 hover:text-secondary transition">
                {child.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <nav className="border-t border-gray-300">
        <div
          onClick={() => navigate('/parentCalendar')}
          className={`px-8 py-4 cursor-pointer transition hover:text-secondary ${
            isActive('/parentCalendar')
              ? 'font-semibold text-black'
              : 'text-gray-500'
          }`}
        >
          캘린더
        </div>
        <hr className="border-gray-200 my-1" />
        <div
          onClick={() => navigate('/settings')}
          className={`px-8 py-4 cursor-pointer transition hover:text-secondary ${
            isActive('/settings')
              ? 'font-semibold text-black'
              : 'text-gray-500'
          }`}
        >
          설정
        </div>
      </nav>
    </aside>
  );
};

export default GuardianSidebar;
