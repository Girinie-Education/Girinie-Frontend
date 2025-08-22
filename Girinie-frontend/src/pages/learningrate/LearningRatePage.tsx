import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ChildSidebar from "@/components/common/ChildSidebar";
import LearningRateCharts from "@/components/common/LearningRateCharts";
import CategoryProgressBars from "@/components/common/CategoryProgressBars";
import {
  fetchAllLevelUpLogs,
  transformLogsToChartData,
  transformChildUserToChartData,
  fetchChildUser,
  LevelUpLog,
  ChildUser,
} from "@/api/levelup";

const CATEGORY_LABELS: Record<
  keyof Pick<
    ChildUser,
    | "order_level"
    | "manners_level"
    | "selfcare_level"
    | "clean_level"
    | "saving_level"
    | "eating_level"
    | "calm_level"
    | "kindness_level"
  >,
  string
> = {
  order_level: "질서",
  manners_level: "예절",
  selfcare_level: "자존",
  clean_level: "청결",
  saving_level: "절약",
  eating_level: "식습관",
  calm_level: "감정조절",
  kindness_level: "존중",
};

export default function LearningRatePage() {
  const { id } = useParams<{ id: string }>();
  const childId = Number(id);

  // 주차 상태 관리
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0); // 0 = 현재 주

  // 현재 날짜 기반 주간 계산
  const today = new Date();

  // 선택된 주 계산 (현재 주 + offset)
  const selectedWeekStart = useMemo(() => {
    const startOfWeek = new Date(today);
    const dayOfWeek = (today.getDay() + 6) % 7; // 월요일 = 0
    startOfWeek.setDate(today.getDate() - dayOfWeek + selectedWeekOffset * 7);
    return startOfWeek;
  }, [today, selectedWeekOffset]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(selectedWeekStart);
      day.setDate(selectedWeekStart.getDate() + i);
      return day;
    });
  }, [selectedWeekStart]);

  // 표시할 년/월/주차 계산
  const displayYear = selectedWeekStart.getFullYear();
  const displayMonth = selectedWeekStart.getMonth() + 1;

  // 해당 월의 몇 번째 주인지 계산
  const firstDayOfMonth = new Date(displayYear, selectedWeekStart.getMonth(), 1);
  const firstMonday = new Date(firstDayOfMonth);
  const daysToMonday = (firstDayOfMonth.getDay() + 6) % 7;
  firstMonday.setDate(1 - daysToMonday);

  const weekNumber =
    Math.floor((selectedWeekStart.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) +
    1;

  // 주차 이동 함수
  const goToPreviousWeek = () => {
    setSelectedWeekOffset((prev) => prev - 1);
  };

  const goToNextWeek = () => {
    setSelectedWeekOffset((prev) => prev + 1);
  };

  // Logs for timeline & "최근 학습"
  const {
    data: logs = [],
    isLoading: isLogsLoading,
    error: logsError,
  } = useQuery({
    queryKey: ["levelupLogs", childId],
    queryFn: fetchAllLevelUpLogs,
  });

  // Child detail for current levels (radar & bars)
  const {
    data: child,
    isLoading: isChildLoading,
    error: childError,
  } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => fetchChildUser(childId),
    enabled: Number.isFinite(childId),
  });

  const chartData = useMemo(() => {
    return child ? transformChildUserToChartData(child) : transformLogsToChartData(logs);
  }, [child, logs]);
  const latestLog = logs[0];

  if (isLogsLoading || isChildLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <ChildSidebar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">학습률 데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (logsError || childError) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <ChildSidebar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF6BF]">
      <ChildSidebar />
      <div className="ml-64 space-y-10 p-8 pt-24">
        <div className="mx-auto max-w-6xl px-20">
          {/* 상단: 좌측 카드 2개 + 우측 레이더 차트 */}
          <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-5">
            {/* 좌측 카드 영역 (40%) */}
            <div className="flex flex-col space-y-4 xl:col-span-2">
              {/* 최근 학습 */}
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="rounded-t-xl bg-[#F9DF63] px-4 py-3 font-semibold">최근 학습</div>
                <div className="px-4 py-4">
                  {latestLog ? (
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {latestLog.category_display} 레벨업!
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-800">
                          {latestLog.category_display} Lv.{latestLog.level}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(latestLog.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">아직 학습 기록이 없습니다.</div>
                  )}
                </div>
              </div>

              {/* 주간 학습 (UI 골격) */}
              <div className="flex-1 rounded-xl border bg-white shadow-sm">
                <div className="rounded-t-xl bg-[#F9DF63] px-4 py-3 font-semibold">주간 학습</div>
                <div className="flex h-full flex-col px-4 py-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-gray-700">
                    <button
                      className="cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
                      onClick={goToPreviousWeek}
                    >
                      ◁
                    </button>
                    <span>
                      {displayYear % 100}년 {displayMonth}월 {weekNumber}주차
                    </span>
                    <button
                      className="cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
                      onClick={goToNextWeek}
                    >
                      ▷
                    </button>
                  </div>
                  <div className="flex flex-1 items-end items-center justify-between gap-2 pb-4">
                    {["월", "화", "수", "목", "금", "토", "일"].map((d, i) => {
                      const dayDate = weekDays[i];
                      const isToday = dayDate.toDateString() === today.toDateString();
                      const isCurrentMonth = dayDate.getMonth() === today.getMonth();

                      return (
                        <div key={d} className="flex flex-col items-center text-xs text-gray-500">
                          <span className="mb-1">{d}</span>
                          <div className="mb-1 text-xs text-gray-400">{dayDate.getDate()}</div>
                          <div
                            className={`h-8 w-8 rounded-full border ${
                              isToday
                                ? "border-[#F9DF63] bg-[#F9DF63]"
                                : isCurrentMonth
                                  ? "border-gray-300 bg-gray-100"
                                  : "border-gray-200 bg-gray-50"
                            }`}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 레이더 차트 (60%) */}
            <div className="rounded-xl border bg-white p-2 shadow-sm xl:col-span-3">
              <LearningRateCharts data={chartData} className="mb-2" />
            </div>
          </div>

          {/* 하단: 카테고리별 진행 바 */}
          <CategoryProgressBars data={chartData.barData} />
        </div>
      </div>
    </div>
  );
}
