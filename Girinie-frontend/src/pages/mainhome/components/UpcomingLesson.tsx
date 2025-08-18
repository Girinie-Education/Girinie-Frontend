import React from "react";
import Card from "./Card";
import Girinie from "@/assets/icons/Girinieprofile.svg";

const UpcomingLesson: React.FC = () => (
  <Card title="회화 표현 학습하기">
    <div className="mt-3 relative p-4 md:p-6">
      {/* 텍스트: 왼쪽 정렬 */}
      <p className="text-thirdary font-body1-m text-lg md:text-xl">
        금요일에 시간 있어?
      </p>

      {/* 버튼: 가운데 정렬 */}
      <button
        type="button"
        className="mt-6 mx-auto block rounded-full px-5 md:px-6 py-2 md:py-2.5
                   font-body2-sb text-thirdary
                   bg-secondary hover:bg-secondary/90 active:bg-secondary/80
                   shadow-sm transition
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
      >
        <span className="inline-flex items-center gap-2">
          학습하기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      {/* 기린: 오른쪽 하단 고정, 더 크게 */}
      <img
        src={Girinie}
        alt=""
        className="pointer-events-none select-none
                   absolute right-4 bottom-0
                   w-27 md:w-27 lg:w-27"
        loading="lazy"
      />
    </div>
  </Card>
);

export default UpcomingLesson;
