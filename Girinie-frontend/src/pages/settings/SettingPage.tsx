import React, { useState, useEffect } from "react";
import GuardianSidebar from "@/components/common/GuardianSidebar";
import { useChildData } from "@/hooks/useChildData";
import ChildCard from "./components/ChildCard";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { ChildUser } from "@/lib/childData";

const getCardsPerPage = (): number =>
  typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2;

export default function SettingPage() {
  const { data: children = [], loading, error } = useChildData();
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());

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
        <aside className="mr-4 hidden lg:flex lg:flex-col lg:w-64 lg:h-full overflow-hidden">
          <GuardianSidebar />
        </aside>

        {/* 메인: 오직 이 부분만 스크롤 */}
        <main className="mt-20 flex flex-1 items-start justify-center p-10 max-w-7xl mx-auto overflow-y-auto">
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4">아이 설정</h3>

            {!children.length && (
              <div className="p-6 mb-4 text-gray-600 bg-yellow-100 rounded">
                등록된 자녀가 없습니다. 아이 추가 버튼으로 자녀를 등록해 보세요!
              </div>
            )}

            {/* 노란 박스 패딩 조정 */}
            <div className="relative w-full max-w-5xl mx-auto bg-yellow-100 rounded-lg shadow-md px-6 py-8 overflow-visible">
              {/* justify-center + gap-6 */}
              <div className="flex gap-6 justify-center items-center">
                {visibleItems.map((item, idx) =>
                  item === "ADD" ? (
                    <button
                      key={"add-card-" + idx}
                      className="
                        bg-white hover:bg-gray-100 cursor-pointer transition
                        rounded-lg shadow-md p-6 w-full
                        max-w-[300px] sm:max-w-[340px] md:max-w-[360px]
                        h-[350px] flex flex-col items-center justify-center
                        flex-shrink-0
                      "
                      onClick={() => {
                        /* TODO: 자녀 추가 로직 */
                      }}
                    >
                      <Plus size={48} className="text-gray-400 mb-2" />
                      <span className="text-lg font-medium text-gray-600">
                        아이 추가
                      </span>
                    </button>
                  ) : (
                    <ChildCard key={(item as ChildUser).id} child={item as ChildUser} />
                  )
                )}
              </div>

              {page > 0 && (
                <button
                  onClick={() => setPage((p) => p - 1)}
                  className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
                >
                  <ChevronLeft />
                </button>
              )}
              {page < totalPages - 1 && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
                >
                  <ChevronRight />
                </button>
              )}
            </div>

            {/* 계정 설정 */}
            <div className="mt-10 space-y-2 text-gray-800">
              <div className="text-xl font-semibold mb-4">계정 설정</div>
              <div className="cursor-pointer hover:underline">로그아웃</div>
              <div className="text-red-500 cursor-pointer hover:underline">
                회원 탈퇴
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
