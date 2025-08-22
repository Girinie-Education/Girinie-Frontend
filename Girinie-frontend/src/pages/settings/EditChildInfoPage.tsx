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
        <aside className="mr-4 hidden overflow-hidden lg:flex lg:h-full lg:w-64 lg:flex-col">
          <GuardianSidebar />
        </aside>
        <main className="ml-50 mt-20 flex-1 px-10 py-10">
          <h2 className="mb-6 text-xl font-semibold">아이 정보 변경</h2>

          {/* 상단: 프로필 + 입력 */}
          <div className="mb-6 mt-20 flex items-center gap-6">
            <img
              src={selectedAvatar}
              alt="선택된 아바타"
              className="h-28 w-28 rounded-full bg-gray-200 object-cover"
            />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <label className="w-12">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-48 rounded border px-3 py-2 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-12">나이</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-48 rounded border px-3 py-2 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          <hr className="my-10 border-gray-300" />

          {/* 아바타 선택 */}
          <div className="mb-10 flex gap-8">
            {avatarOptions.map((icon, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAvatar(icon)}
                className="relative rounded-lg p-1"
              >
                <img
                  src={icon}
                  alt={`avatar-${idx}`}
                  className="h-20 w-20 rounded-full object-cover"
                />
                {selectedAvatar === icon && (
                  <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-full ring-4 ring-yellow-400" />
                )}
              </button>
            ))}
          </div>

          <hr className="my-6 border-gray-300" />

          {/* 색상 선택 */}
          <div className="mb-20 flex flex-wrap gap-x-8 gap-y-4">
            {colorOptions.map((color, idx) => (
              <button
                key={idx}
                className={`h-14 w-14 rounded-full ${color} relative`}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-full border-4 border-white shadow-md ring-2 ring-yellow-400" />
                )}
              </button>
            ))}
          </div>

          <hr className="my-6 border-gray-300" />

          {/* 저장 버튼 */}
          <div className="text-right">
            <button className="rounded bg-tertiary px-6 py-2 text-white transition hover:opacity-90">
              변경 저장
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
