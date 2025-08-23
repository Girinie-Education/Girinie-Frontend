import React, { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import StickerBoard from "./components/StickerBoard";
import DailyQuote from "./components/DailyQuote";
import UpcomingLesson from "./components/UpcomingLesson";
import StreakPanel from "./components/StreakPanel";
import ArrowButton from "./components/ArrowButton";
import { useHomeData } from "@/hooks/useHomeData";

const HomePage: React.FC = () => {
  const { data, loading, error } = useHomeData();
  const [childIndex, setChildIndex] = useState(0);

  const handleNextChild = () => {
    if (data && data.length > 0) {
      setChildIndex((prevIndex) => (prevIndex + 1) % data.length);
    }
  };

  const handlePrevChild = () => {
    if (data && data.length > 0) {
      setChildIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    }
  };

  if (loading) {
    return (
      <div className="mt-20 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 min-h-screen flex items-center justify-center text-red-500">
        <div>{error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-20 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">자녀 데이터가 없습니다.</div>
      </div>
    );
  }

  const currentChild = data[childIndex];
  const isBlurred = !currentChild;

  // 순환 기능 적용으로 버튼은 항상 활성화
  const showButton = data.length > 1;

  return (
    <div className="mt-20 min-h-screen bg-primary relative">
      <div className="mx-auto max-w-3xl lg:max-w-5xl px-4 md:px-6 py-6 md:py-8">
        {showButton && (
          <>
            <ArrowButton
              side="left"
              visible={true}
              onClick={handlePrevChild}
            />
            <ArrowButton
              side="right"
              visible={true}
              onClick={handleNextChild}
            />
          </>
        )}
        <div className="mt-10 rounded-2xl bg-white border border-gray-200 shadow-sm p-5 md:p-7">
          <div className="mb-5 mt-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-7 lg:gap-8">
            <div className="min-w-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] items-stretch gap-4 lg:gap-6">
                <ProfileCard className="h-full" child={currentChild} isBlurred={isBlurred} />
                <StickerBoard className="h-full min-w-0" stickers={currentChild?.top_3_stickers} isBlurred={isBlurred} />
              </div>

              <DailyQuote quote={currentChild?.quote} isBlurred={isBlurred} />
              <UpcomingLesson />

              <div className="lg:hidden">
                <StreakPanel days={currentChild?.streak} childName={currentChild?.name} isBlurred={isBlurred} />
              </div>
            </div>

            <div className="hidden lg:block w-[260px] shrink-0 justify-self-center lg:justify-self-auto">
              <StreakPanel days={currentChild?.streak} childName={currentChild?.name} isBlurred={isBlurred} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;