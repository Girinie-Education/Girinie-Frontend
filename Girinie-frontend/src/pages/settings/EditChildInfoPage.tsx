import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import GuardianSidebar from "@/components/common/GuardianSidebar";
import { useChildData } from "@/hooks/useChildData";
import { putChildUser } from "@/lib/childData";
import giraffeGreenIcon from "@/assets/icons/scarf/green.svg";
import giraffeRedIcon from "@/assets/icons/scarf/red.svg";
import giraffeBlueIcon from "@/assets/icons/scarf/blue.svg";
import giraffeBrownIcon from "@/assets/icons/scarf/brown.svg";
import axios from "axios"; 

export default function EditChildInfoPage() {
  const { childId } = useParams<{ childId: string }>();
  const { data: children = [], loading, error, refetch } = useChildData();

  const child = useMemo(() => {
    if (childId && children.length > 0) {
      return children.find((c) => c.id === Number(childId));
    }
    return null;
  }, [childId, children]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState("");
  const [selectedAvatarScarf, setSelectedAvatarScarf] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const avatarOptions = [
    { url: giraffeGreenIcon, scarf: "green" },
    { url: giraffeRedIcon, scarf: "red" },
    { url: giraffeBlueIcon, scarf: "blue" },
    { url: giraffeBrownIcon, scarf: "brown" },
  ];

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
      const initialAvatar = avatarOptions.find(
        (opt) => opt.url === child.avatarUrl
      ) || avatarOptions[0];
      setSelectedAvatarUrl(initialAvatar.url);
      setSelectedAvatarScarf(initialAvatar.scarf);
      setSelectedColor(child.color || colorOptions[0]);
    }
  }, [child]);

  const handleSave = async () => {
    if (!child) {
      alert("저장할 자녀 정보가 없습니다.");
      return;
    }

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0) {
      alert("유효한 나이를 입력해주세요.");
      return;
    }

    const updateData = {
      name: name,
      age: ageNum,
      color: selectedColor,
      avatarUrl: selectedAvatarUrl,
    };

    try {
      await putChildUser(child.id, updateData);
      alert("아이 정보가 성공적으로 변경되었습니다.");
      refetch();
    } catch (error) {
      console.error("아이 정보 변경 실패:", error);
      let errorMessage = "아이 정보 변경 중 알 수 없는 오류가 발생했습니다.";
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        if (typeof serverError === 'object' && serverError !== null) {
          errorMessage = (serverError as any).message || (serverError as any).detail || "서버 오류가 발생했습니다.";
        } else if (typeof serverError === 'string') {
          errorMessage = serverError;
        } else {
          errorMessage = "서버로부터 알 수 없는 오류 응답을 받았습니다.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-red-500">
        <div>자녀 정보를 찾을 수 없거나 불러오는 데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        <aside className="mr-4 hidden overflow-hidden lg:flex lg:h-full lg:w-64 lg:flex-col">
          <GuardianSidebar />
        </aside>
        <main className="ml-50 mt-20 flex-1 px-10 py-10">
          <h2 className="mb-6 text-xl font-semibold">아이 정보 변경</h2>

          {/* 상단: 프로필 + 입력 */}
          <div className="flex items-center gap-6 mb-6 mt-20">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden ${child?.color || 'bg-gray-200'} border border-bg-gray`}
            >
              <img
                src={selectedAvatarUrl}
                alt="선택된 아바타"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <label className="w-12">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded px-3 py-2 w-48 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex items-center gap-2">
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

          <hr className="my-10 border-gray-300" />

          {/* 아바타 선택 */}
          <div className="flex gap-8 mb-10">
            {avatarOptions.map((avatar, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedAvatarUrl(avatar.url);
                  setSelectedAvatarScarf(avatar.scarf);
                }}
                className="relative p-1 rounded-lg"
              >
                <img
                  src={avatar.url}
                  alt={`avatar-${avatar.scarf}`}
                  className="w-23 h-25 rounded-lg object-cover"
                />
                {selectedAvatarUrl === avatar.url && (
                  <div className="absolute top-0 left-0 w-full h-full rounded-lg ring-4 ring-yellow-400 pointer-events-none" />
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
                className={`mt-9 w-14 h-14 rounded-full ${color} relative`}
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
            <button
              onClick={handleSave}
              className="bg-yellow-400 text-white px-6 py-2 rounded hover:opacity-90 transition"
            >
              변경 저장
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}