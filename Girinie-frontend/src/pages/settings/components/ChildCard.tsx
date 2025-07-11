import React from "react";
import { ChildUser } from "@/lib/childData";  

interface ChildCardProps {
  child: ChildUser;
}

const ChildCard: React.FC<ChildCardProps> = ({ child }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-[300px] sm:max-w-[340px] md:max-w-[360px] h-[350px] flex flex-col items-center flex-shrink-0">
      <img
        src={child.avatarUrl ?? "/img/default-avatar.png"}
        alt={child.name}
        className="w-24 h-24 rounded-full bg-gray-200 mb-7 mt-2"
      />
      <div className="w-full text-sm text-gray-700 space-y-2">
        <hr className="border-gray-300" />
        <div>이름: {child.name}</div>
        <hr className="border-gray-300" />
        <div>나이: {child.age}</div>
        <hr className="border-gray-300" />
        <div>평균 난이도: {child.average_level}</div> {/* level → average_level */}
        <hr className="border-gray-300" />
      </div>
      <button
        onClick={() => {
          /* 수정 페이지로 이동하려면 navigate 호출 */
        }}
        className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded"
      >
        정보 수정
      </button>
    </div>
  );
};

export default ChildCard;
