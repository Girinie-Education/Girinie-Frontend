import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChildData } from '@/hooks/useChildData';
import GirinieIcon from '@/assets/icons/Girinie.svg';
import { useAuthStore } from '@/stores/authStore';

const ChildSidebar: React.FC = () => {
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
    <aside className="pt-20 w-56 h-screen fixed top-0 left-0 bg-white text-black flex flex-col border-r border-gray-300">
      {/* 프로필 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-7">
          <ul className="space-y-4">
            {children.map(child => (
              <li
                key={child.id}
                onClick={() => navigate(`/child/${child.id}`)}
                className={`flex flex-col items-center space-y-2 px-4 py-2 rounded cursor-pointer transition ${
                  isActive(`/child/${child.id}`)
                    ? 'bg-gray-100 font-semibold text-black'
                    : 'text-gray-500'
                }`}
              >
                <img
                  src={child.avatarUrl ?? GirinieIcon}
                  alt={child.name}
                  className="w-30 h-30 rounded-full bg-gray-200 mb-3"
                />
                <span className="text-base font-semibold text-gray-800 hover:text-secondary transition">
                  {child.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <nav className="border-y border-gray-300 m-0 p-0">
          <div
            onClick={() => navigate('/chatbot')}
            className={`px-8 py-4 cursor-pointer transition hover:text-secondary ${
              isActive('/parentCalendar')
                ? 'font-semibold text-black'
                : 'text-gray-500'
            }`}
          >
            챗봇
          </div>
          <hr className="border-gray-200 my-1" />
          <div
            onClick={() => navigate('/learningrate')}
            className={`px-8 py-4 cursor-pointer transition hover:text-secondary ${
              isActive('/settings')
                ? 'font-semibold text-black'
                : 'text-gray-500'
            }`}
          >
            학습률
          </div>
          <hr className="border-gray-200 my-1" />
          <div
            onClick={() => navigate('/chileCalendar')}
            className={`px-8 py-4 cursor-pointer transition hover:text-secondary ${
              isActive('/settings')
                ? 'font-semibold text-black'
                : 'text-gray-500'
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