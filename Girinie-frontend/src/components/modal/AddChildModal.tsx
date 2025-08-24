import React, { useState } from "react";
import { X } from "lucide-react";
import giraffeGreenIcon from "@/assets/icons/scarf/green.svg";
import giraffeRedIcon from "@/assets/icons/scarf/red.svg";
import giraffeBlueIcon from "@/assets/icons/scarf/blue.svg";
import giraffeBrownIcon from "@/assets/icons/scarf/brown.svg";
import { apiClient, ensureCsrfCookie } from "@/api/common";

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddChildModal({ isOpen, onClose, onSuccess }: AddChildModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState("");
  const [selectedAvatarScarf, setSelectedAvatarScarf] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // 초기값 설정
  React.useEffect(() => {
    if (isOpen) {
      setSelectedAvatarUrl(avatarOptions[0].url);
      setSelectedAvatarScarf(avatarOptions[0].scarf);
      setSelectedColor(colorOptions[0]);
    }
  }, [isOpen]);

  const handleClose = () => {
    setName("");
    setAge("");
    setSelectedAvatarUrl("");
    setSelectedAvatarScarf("");
    setSelectedColor("");
    onClose();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0) {
      alert("유효한 나이를 입력해주세요.");
      return;
    }
    if (!selectedColor) {
      alert("색상을 선택해주세요.");
      return;
    }
    if (!selectedAvatarUrl) {
      alert("스카프 기린을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await ensureCsrfCookie().catch(() => {});

      const body = {
        name: name.trim(),
        age: ageNum,
        color: selectedColor,
        avatarUrl: selectedAvatarUrl,
      };
      const res = await apiClient.post("/child_users/", body);
      console.log("[child] created:", res.data);

      alert("자녀가 추가되었습니다.");
      handleClose();
      onSuccess();
    } catch (err: any) {
      const data = err?.response?.data;
      console.error("[child] create failed:", data || err?.message || err);
      const msg = data?.message || "자녀 추가 중 오류가 발생했습니다.";
      const errs = data?.errors;
      let detail = "";
      if (errs && typeof errs === "object") {
        detail = Object.entries(errs)
          .map(([k, v]) => {
            if (Array.isArray(v)) return `${k}: ${v.join(", ")}`;
            if (v && typeof v === "object") return `${k}: ${JSON.stringify(v)}`;
            return `${k}: ${String(v)}`;
          })
          .join("\n");
      }
      alert(detail ? `${msg}\n\n${detail}` : msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[80vh] w-[40vw] min-w-[400px] overflow-y-auto rounded-lg bg-white p-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">아이 추가</h2>
          <button onClick={handleClose} className="rounded p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* 상단: 프로필 + 입력 */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className={`flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ${selectedColor || "bg-gray-200"} border border-gray-200`}
          >
            {selectedAvatarUrl && (
              <img
                src={selectedAvatarUrl}
                alt="선택된 아바타"
                className="h-full w-full object-contain"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="w-12 text-sm">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-0"
                placeholder="아이 이름"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-12 text-sm">나이</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-0"
                placeholder="아이 나이"
              />
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* 아바타 선택 */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium">기린 선택</h3>
          <div className="flex justify-center gap-3">
            {avatarOptions.map((avatar, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedAvatarUrl(avatar.url);
                  setSelectedAvatarScarf(avatar.scarf);
                }}
                className="relative rounded-lg p-1"
              >
                <img
                  src={avatar.url}
                  alt={`avatar-${avatar.scarf}`}
                  className="w-23 h-25 rounded-lg object-cover"
                />
                {selectedAvatarUrl === avatar.url && (
                  <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-lg ring-2 ring-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* 색상 선택 */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium">색상 선택</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {colorOptions.map((color, idx) => (
              <button
                key={idx}
                className={`h-10 w-10 rounded-full ${color} relative`}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-full border-2 border-white shadow-md ring-2 ring-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="rounded border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-50"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="rounded bg-yellow-400 px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "추가 중..." : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
}
