import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMonthlyRewards, type RewardCalendar } from "@/api/parent";
import Calendar from "@/components/calendar/Calendar";
import StickerStamp from "@/components/calendar/StickerStamp";

export default function KidCalendarPage() {
  const [stamps, setStamps] = useState<Record<string, RewardCalendar[]>>({});
  const { childId } = useParams<{ childId: string }>();

  // 오늘 날짜
  const today = new Date();

  useEffect(() => {
    if (!childId) return;

    const yyyy = today.getFullYear().toString();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    let cancelled = false;

    (async () => {
      try {
        console.log("[KidCalendar] fetchMonthlyRewards params:", { childId, yyyy, mm });
        const list = await fetchMonthlyRewards(childId, yyyy, mm);
        const map: Record<string, RewardCalendar[]> = {};
        list.forEach((item) => {
          const key = item.date; // YYYY-MM-DD
          if (!key) return;
          (map[key] = map[key] || []).push(item);
        });
        if (!cancelled) setStamps(map);
      } catch (e) {
        console.error("[KidCalendar] fetchMonthlyRewards failed:", e);
        if (!cancelled) setStamps({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [childId]);

  const handleDayClick = (date: Date) => {
    // 아무 동작 없음
  };

  const renderStamp = (date: Date) => {
    const key = date.toISOString().slice(0, 10);
    const items = stamps[key] || [];
    if (items.length === 0) return null;
    
    // 해당 날짜의 스티커 표시
    const item = items[0];
    return (
      <StickerStamp 
        stickerType={item.sticker_type} 
        size="sm"
      />
    );
  };

  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  if (!childId) {
    return (
      <div className="min-h-screen bg-[#F7E0AF] p-6">
        <div className="flex py-20 items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">자녀를 선택해주세요</h2>
            <p className="text-gray-500">사이드바에서 자녀를 선택하면 해당 자녀의 캘린더를 볼 수 있습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7E0AF] p-6">
      <div className="flex py-20">
        {/* Main content */}
        <main className="flex flex-1 justify-center">
          <div className="w-full max-w-4xl">
            <Calendar
              mode="child"
              onDayClick={handleDayClick}
              renderStamp={renderStamp}
              highlightToday={(date: Date) => isToday(date)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
