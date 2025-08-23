import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "./Card";
import Girinie from "@/assets/icons/Girinieprofile.svg";
import { useHomeData } from "@/hooks/useHomeData";

const UpcomingLesson: React.FC = () => {
  const navigate = useNavigate();
  const { childId: childIdFromUrl } = useParams<{ childId: string }>();
  const { data: children, loading, error } = useHomeData();

  const currentChild = React.useMemo(() => {
    if (!children) return null;
    const id = childIdFromUrl ? Number(childIdFromUrl) : children[0]?.id;
    return children.find(c => c.id === id) || children[0];
  }, [children, childIdFromUrl]);

  if (loading) {
    return (
      <Card title="회화 표현 학습하기" className="blur-sm">
        <div className="mt-3 relative p-4 md:p-6 text-center text-gray-500">
          데이터 로딩 중...
        </div>
      </Card>
    );
  }

  if (error || !currentChild) {
    return (
      <Card title="회화 표현 학습하기" className="blur-sm">
        <div className="mt-3 relative p-4 md:p-6 text-center text-gray-500">
          데이터 없음
        </div>
      </Card>
    );
  }

  const handleLessonClick = () => {
    if (!currentChild.id) {
      // id가 없을 경우를 대비한 방어 로직
      alert("유효한 자녀 정보가 없습니다.");
      return;
    }
    navigate(`/chatbot/${currentChild.id}`);
  };

  return (
    <Card title="회화 표현 학습하기" className="">
      <div className="mt-3 relative p-4 md:p-6">
        <p className="text-thirdary font-body1-m text-lg md:text-xl">
          {currentChild.conversation}
        </p>
        <button
          type="button"
          onClick={handleLessonClick}
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
};

export default UpcomingLesson;