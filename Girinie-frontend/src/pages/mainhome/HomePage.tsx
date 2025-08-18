import React from "react";
import { childrenMock, STREAK_DAYS, stickersMock } from "./mocks";
import type { Child } from "./types";
// import ArrowButton from "./components/ArrowButton";
import ProfileCard from "./components/ProfileCard";
import StickerBoard from "./components/StickerBoard";
import DailyQuote from "./components/DailyQuote";
import UpcomingLesson from "./components/UpcomingLesson";
import StreakPanel from "./components/StreakPanel";

const HomePage: React.FC = () => {
  const currentChild: Child = childrenMock[0];

  return (
    <div className="mt-20 min-h-screen bg-primary">
      <div className="mx-auto max-w-3xl lg:max-w-5xl px-4 md:px-6 py-6 md:py-8">
        <div className="mt-10 relative rounded-2xl bg-white border border-gray-200 shadow-sm p-5 md:p-7">
          {/* <ArrowButton side="left" visible={hasMultiple} />
          <ArrowButton side="right" visible={hasMultiple} /> */}

          <div className="mb-5 mt-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-7 lg:gap-8">
            {/* 좌측 콘텐츠 */}
            <div className="min-w-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] items-stretch gap-4 lg:gap-6">
                <ProfileCard className="h-full" child={currentChild} />
                <StickerBoard className="h-full min-w-0" stickers={stickersMock.slice(0, 3)} />
              </div>

              <DailyQuote />
              <UpcomingLesson />

              <div className="lg:hidden">
                <StreakPanel days={STREAK_DAYS} />
              </div>
            </div>

            <div className="hidden lg:block w-[260px] shrink-0 justify-self-center lg:justify-self-auto">
              <StreakPanel days={STREAK_DAYS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
