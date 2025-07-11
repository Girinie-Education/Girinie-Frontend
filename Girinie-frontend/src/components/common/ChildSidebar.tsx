import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChildData } from '@/hooks/useChildData';

const ChildSidebar = () => {
  const { data: children, loading, error } = useChildData();
  const [selectedId, setSelectedId]     = useState<number>();
  const location = useLocation();
  const navigate = useNavigate();

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
  const selectedChild = children.find(c => c.id === selectedId) ?? children[0];

  return (
    <aside className="…">
      <div className="p-10 place-items-center">
        <img
          src={selectedChild.avatarUrl ?? '/img/default.png'}
          className="w-28 h-28 rounded-full"
          alt={selectedChild.name}
        />
        <p className="text-center mt-5 text-black font-semibold">
          {selectedChild.name}
        </p>
      </div>
      <nav className="…">
        {/* … */}
      </nav>
    </aside>
  );
};

export default ChildSidebar;
