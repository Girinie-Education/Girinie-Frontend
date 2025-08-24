import React, { useState, useEffect } from "react";
import GuardianSidebar from "@/components/common/GuardianSidebar";
import { useChildData } from "@/hooks/useChildData";
import ChildCard from "./components/ChildCard";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { ChildUser } from "@/lib/childData";
import { apiClient, ensureCsrfCookie } from "@/api/common";
import { useNavigate } from "react-router-dom";
import AddChildModal from "@/components/modal/AddChildModal";
import ProfileSettings from "@/components/settings/ProfileSettings";

const getCardsPerPage = (): number =>
  typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2;

export default function SettingPage() {
  const { data: children = [], loading, error, refetch } = useChildData();
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const newPerPage = getCardsPerPage();
      const totalItems = children.length + 1;
      const newTotalPages = Math.ceil(totalItems / newPerPage);
      setCardsPerPage(newPerPage);
      setPage((prev) => Math.min(prev, newTotalPages - 1));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [children.length]);

  const handleAddChild = () => {
    setIsAddModalOpen(true);
  };

  const handleAddChildSuccess = () => {
    if (refetch) {
      refetch();
    } else {
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    try {
      if (!window.confirm("정말 로그아웃 하시겠습니까?")) return;
      await ensureCsrfCookie().catch(() => {});
      const res = await apiClient.post("/parent_users/logout/");
      console.log("[auth] logout:", res.data);
      alert("로그아웃 되었습니다.");
      navigate("/login");
      window.location.reload();
    } catch (err: any) {
      const data = err?.response?.data;
      console.error("[auth] logout failed:", data || err?.message || err);
      const msg = data?.message || "로그아웃 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!window.confirm("정말 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
      if (
        !window.confirm("확인: 계정을 삭제하면 모든 데이터가 제거될 수 있습니다. 계속하시겠습니까?")
      )
        return;
      await ensureCsrfCookie().catch(() => {});
      const res = await apiClient.delete("/parent_users/me/");
      console.log("[auth] delete me:", res.data);
      alert("계정이 삭제되었습니다.");
      navigate("/login");
      window.location.reload();
    } catch (err: any) {
      const data = err?.response?.data;
      console.error("[auth] delete failed:", data || err?.message || err);
      const msg = data?.message || "회원 탈퇴 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

  if (loading) return <div className="p-10">로딩 중…</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  const totalItems = children.length + 1;
  const totalPages = Math.ceil(totalItems / cardsPerPage);
  const items: (ChildUser | "ADD")[] = [...children, "ADD"];
  const start = page * cardsPerPage;
  const visibleItems = items.slice(start, start + cardsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        {/* 사이드바 고정 */}
        <aside className="mr-4 hidden overflow-hidden lg:flex lg:h-full lg:w-64 lg:flex-col">
          <GuardianSidebar />
        </aside>

        {/* 메인: 오직 이 부분만 스크롤 */}
        <main className="mx-auto mt-20 flex max-w-7xl flex-1 items-start justify-center overflow-y-auto p-10">
          <div className="w-full">
            <h3 className="mb-4 text-xl font-semibold">아이 설정</h3>

            {!children.length && (
              <div className="mb-4 rounded bg-yellow-100 p-6 text-gray-600">
                등록된 자녀가 없습니다. 아이 추가 버튼으로 자녀를 등록해 보세요!
              </div>
            )}

            {/* 노란 박스 패딩 조정 */}
            <div className="relative mx-auto w-full max-w-5xl overflow-visible rounded-lg bg-yellow-100 px-6 py-8 shadow-md">
              <div className="flex items-center justify-center gap-6">
                {visibleItems.map((item, idx) =>
                  item === "ADD" ? (
                    <button
                      key={"add-card-" + idx}
                      className="flex h-[350px] w-full max-w-[300px] flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md transition hover:bg-gray-100 sm:max-w-[340px] md:max-w-[360px]"
                      onClick={handleAddChild}
                    >
                      <Plus size={48} className="mb-2 text-gray-400" />
                      <span className="text-lg font-medium text-gray-600">아이 추가</span>
                    </button>
                  ) : (
                    <ChildCard key={(item as ChildUser).id} child={item as ChildUser} />
                  )
                )}
              </div>

              {page > 0 && (
                <button
                  onClick={() => setPage((p) => p - 1)}
                  className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
                >
                  <ChevronLeft />
                </button>
              )}
              {page < totalPages - 1 && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white shadow-md"
                >
                  <ChevronRight />
                </button>
              )}
            </div>

            {/* 계정 설정 */}
            <div className="mt-10 text-gray-800">
              <div className="mb-4 text-xl font-semibold">계정 설정</div>
              
              {/* 프로필 설정 */}
              <ProfileSettings />
              
              {/* 로그아웃 및 탈퇴 */}
              <div className="flex flex-col items-start gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block cursor-pointer text-left hover:underline"
                >
                  로그아웃
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="block cursor-pointer text-left text-red-500 hover:underline"
                >
                  회원 탈퇴
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddChildSuccess}
      />
    </div>
  );
}
