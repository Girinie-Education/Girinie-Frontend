import React from "react";
import { ChildUser } from "@/lib/childData";  
import { useNavigate } from "react-router-dom";
import GirinieIcon from '@/assets/icons/Girinie.svg';

interface ChildCardProps {
  child: ChildUser;
}

const ChildCard: React.FC<ChildCardProps> = ({ child }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-[300px] sm:max-w-[340px] md:max-w-[360px] h-[350px] flex flex-col items-center flex-shrink-0">
      <img
        src={child.avatarUrl ?? GirinieIcon}
        alt={child.name}
        className={`w-25 h-25 mb-6 rounded-full flex items-center justify-center overflow-hidden ${child.color || 'bg-gray-200'}`}
      />
      <div className="w-full text-sm text-gray-700 space-y-2">
        <hr className="border-gray-300" />
        <div>이름: {child.name}</div>
        <hr className="border-gray-300" />
        <div>나이: {child.age}</div>
        <hr className="border-gray-300" />
        <div>평균 난이도: {child.average_level}</div>
        <hr className="border-gray-300" />
      </div>
      <button
        onClick={() => navigate(`/settings/child/${child.id}/edit`)}
        className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded"
      >
        정보 수정
      </button>
    </div>
  );
};

export default ChildCard;