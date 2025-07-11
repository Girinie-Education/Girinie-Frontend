import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChildData } from '@/hooks/useChildData';

const GuardianSidebar: React.FC = () => {
  const { data: children, loading, error } = useChildData();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <aside className="pt-20 w-60 h-screen fixed top-0 left-0 bg-white flex items-center justify-center border-r border-gray-300">
        로딩 중…
      </aside>
    );
  }
  if (error) {
    return (
   
   <aside className="pt-20 w-60 h-screen fixed top-0 left-0 bg-white flex items-center justify-center border-r border-gray-300 text-red-500">
        {error}
      </aside>
    );
  }

  if(!Array.isArray(children)) {
    return (
      <aside className="text-red-500 p-6">
          자녀 목록을 가져올 수 없습니다.
      </aside>
    );
  }

  if(children.length === 0) {
    return (
      <aside className="text-gray-500 p-6">
        등록된 자녀가 없습니다.
      </aside>
    )
  }

  return (
    <aside className="pt-20 w-60 h-full sticky top-0 left-0 bg-white text-black flex flex-col justify-between border-r border-gray-300">
      <div className="p-7 overflow-y-auto flex-1">
        <ul className="space-y-4">
          {children.map(child => (
            <li
              key={child.id}
              onClick={() => navigate(`/child/${child.id}`)}
              className={`flex items-center space-x-3 px-4 py-2 rounded cursor-pointer transition ${
                isActive(`/child/${child.id}`)
                  ? 'bg-gray-100 font-semibold text-black'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <img
                src={child.avatarUrl ?? '/img/default-avatar.png'}
                alt={child.name}
                className="h-9 w-9 rounded-full bg-gray-200"
              />
              <span>{child.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <nav className="border-t border-gray-300">
        <div
          className={`px-8 py-4 cursor-pointer transition ${
            isActive('/report')
              ? 'font-semibold text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => navigate('/report')}
        >
          캘린더
        </div>
        <div
          className={`px-8 py-4 cursor-pointer transition ${
            isActive('/settings')
              ? 'font-semibold text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => navigate('/settings')}
        >
          설정
        </div>
      </nav>
    </aside>
  );
};

export default GuardianSidebar;
