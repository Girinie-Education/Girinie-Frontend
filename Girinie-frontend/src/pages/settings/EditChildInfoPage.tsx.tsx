import React, { useEffect, useState } from "react";
import GuardianSidebar from "@/components/common/GuardianSidebar";
import { useChildData } from "@/hooks/useChildData";
import { ChildUser } from "@/lib/childData";
import giraffeIcon from "@/assets/icons/Girinie.svg";

export default function EditChildInfoPage() {
  const { data: children = [] } = useChildData();
  const child = children[0]; // 임시 첫 아이

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(giraffeIcon);
  const [selectedColor, setSelectedColor] = useState("bg-[#F4B740]");

  const avatarOptions = [giraffeIcon, giraffeIcon, giraffeIcon, giraffeIcon];
  const colorOptions = [
    "bg-[#F4B740]",
    "bg-[#F5625D]",
    "bg-[#FCE96A]",
    "bg-[#72D57C]",
    "bg-[#4DA1FF]",
    "bg-[#7063EC]",
    "bg-[#C285F9]",
    "bg-[#F98AC4]",
  ];

  useEffect(() => {
    if (child) {
      setName(child.name);
      setAge(child.age?.toString() || "");
      setSelectedAvatar(child.avatarUrl || giraffeIcon);
      setSelectedColor(child.color || "bg-[#F4B740]");
    }
  }, [child]);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        <aside className="mr-4 hidden lg:flex lg:flex-col lg:w-64 lg:h-full overflow-hidden">
          <GuardianSidebar />
        </aside>
        <main className="mt-25 ml-50 flex-1 px-40 py-10">
          <h2 className="text-xl font-semibold mb-6">아이 정보 변경</h2>

          {/* 상단: 프로필 + 입력 */}
          <div className="flex items-center gap-6 mb-6 mt-20">
            <img
              src={selectedAvatar}
              alt="선택된 아바타"
              className="w-28 h-28 rounded-full bg-gray-200 object-cover"
            />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <label className="w-12">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded px-3 py-2 w-48 focus:outline-none focus:ring-0"
                  />
              </div>
              <div className="flex gap-2 items-center">
                <label className="w-12">나이</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="border rounded px-3 py-2 w-48 focus:outline-none focus:ring-0"
                  />
              </div>
            </div>
          </div>

          <hr className="my-15 border-gray-300" />

          {/* 아바타 선택 */}
        <div className="flex gap-8 mb-10">
        {avatarOptions.map((icon, idx) => (
            <button
            key={idx}
            onClick={() => setSelectedAvatar(icon)}
            className="relative p-1 rounded-lg"
            >
            <img
                src={icon}
                alt={`avatar-${idx}`}
                className="w-20 h-20 rounded-full object-cover"
            />
            {selectedAvatar === icon && (
                <div className="absolute top-0 left-0 w-full h-full rounded-full ring-4 ring-yellow-400 pointer-events-none" />
            )}
            </button>
        ))}
        </div>


          <hr className="my-15 border-gray-300" />

          {/* 색상 선택 */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-20">
            {colorOptions.map((color, idx) => (
              <button
                key={idx}
                className={`w-14 h-14 rounded-full ${color} relative`}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-white rounded-full shadow-md ring-2 ring-yellow-400 pointer-events-none" />
                )}
              </button>
            ))}
          </div>

          <hr className="my-6 border-gray-300" />

          {/* 저장 버튼 */}
          <div className="text-right">
            <button className="bg-tertiary text-white px-6 py-2 rounded hover:opacity-90 transition">
              변경 저장
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
