import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, updateCurrentUser, UpdateUserPayload } from "@/api/parent";

export default function ProfileSettings() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateCurrentUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setIsEditing(false);
      alert("프로필이 성공적으로 업데이트되었습니다.");
    },
    onError: (error: any) => {
      console.error("프로필 업데이트 실패:", error);
      const msg = error?.message || "프로필 업데이트 중 오류가 발생했습니다.";
      alert(msg);
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const payload: UpdateUserPayload = {};
    if (formData.username !== user?.username) {
      payload.username = formData.username;
    }
    if (formData.email !== user?.email) {
      payload.email = formData.email;
    }

    if (Object.keys(payload).length === 0) {
      alert("변경사항이 없습니다.");
      setIsEditing(false);
      return;
    }

    updateMutation.mutate(payload);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="mb-6 rounded-lg border bg-white p-4">
        <div className="text-sm text-gray-500">프로필 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 rounded-lg border bg-white p-4">
        <div className="text-sm text-red-500">프로필 정보를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg border bg-white p-4">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">사용자명</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="사용자명을 입력하세요"
            />
          ) : (
            <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {user?.username || "사용자명이 설정되지 않았습니다"}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">이메일</label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="이메일을 입력하세요"
            />
          ) : (
            <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {user?.email || "이메일이 설정되지 않았습니다"}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {updateMutation.isPending ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={handleCancel}
                disabled={updateMutation.isPending}
                className="rounded bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600 disabled:opacity-50"
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
            >
              수정
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
