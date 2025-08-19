import React from 'react';
import GirinieIcon from '@/assets/icons/Girinie.svg';
import { useAuthStore } from '@/stores/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChildData } from '@/hooks/useChildData';

const BASE =
  'fixed left-0 top-0 z-40 h-screen w-56 pt-20 bg-white border-r border-gray-300';

const GuardianSidebar: React.FC = () => {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const { data: children, loading, error } = useChildData();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isLoggedIn) return null;

  const isActive = (path: string) => location.pathname.startsWith(path);

  if (loading) {
    return (
      <aside className={`${BASE} flex items-center justify-center`}>
        로딩 중…
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={`${BASE} flex items-center justify-center text-red-500`}>
        {error}
      </aside>
    );
  }

  if (!Array.isArray(children) || children.length === 0) {
    return (
      <aside className={`${BASE} p-6 text-gray-500`}>
        {Array.isArray(children) ? '등록된 자녀가 없습니다.' : '자녀 목록을 가져올 수 없습니다.'}
      </aside>
    );
  }

  return (
    <aside className={BASE}>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <ul className="space-y-3">
            {children.map(child => (
              <li
                key={child.id}
                onClick={() => navigate(`/child/${child.id}`)}
                className={`flex cursor-pointer items-center rounded px-3 py-2 transition
                ${isActive(`/child/${child.id}`) ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-secondary'}`}
              >
                <img
                  src={GirinieIcon /* child.avatarUrl ?? GirinieIcon */}
                  alt={child.name}
                  className="mr-3 size-10 rounded-full bg-gray-200"
                />
                <span className="truncate text-base">{child.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <nav className="border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/parentCalendar')}
            className={`block w-full px-6 py-3 text-left transition hover:text-secondary
            ${isActive('/parentCalendar') ? 'font-semibold text-gray-900' : 'text-gray-600'}`}
          >
            캘린더
          </button>
          <hr className="border-gray-100" />
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className={`block w-full px-6 py-3 text-left transition hover:text-secondary
            ${isActive('/settings') ? 'font-semibold text-gray-900' : 'text-gray-600'}`}
          >
            설정
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default GuardianSidebar;
