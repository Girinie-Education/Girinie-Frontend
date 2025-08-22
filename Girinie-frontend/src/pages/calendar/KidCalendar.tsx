import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchKidStamps } from "@/api/kid";
import Calendar from "@/components/calendar/Calendar";

export default function KidCalendarPage() {
  const [stamps, setStamps] = useState<Record<string, any[]>>({});
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
        console.log("[KidCalendar] fetchKidStamps params:", { childId, yyyy, mm });
        const data = await fetchKidStamps(childId, yyyy, mm);
        console.log("[KidCalendar] fetchKidStamps ok:", Array.isArray(data) ? data.length : data);

        const map: Record<string, any[]> = {};
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.results)
            ? (data as any).results
            : [];
        list.forEach((item: any) => {
          const date = item?.date;
          const stampsArr = Array.isArray(item?.stamps) ? item.stamps : [];
          if (!date) return;
          map[date] = stampsArr;
        });
        if (!cancelled) setStamps(map);
      } catch (e) {
        console.error("[KidCalendar] fetchKidStamps failed:", e);
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
    const arr = stamps[key] || [];
    if (arr.length === 0) return null;

    // 간단한 배지로 개수만 보여줍니다. (필요시 아이콘으로 교체)
    return (
      <span className="inline-flex min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold">
        {arr.length}
      </span>
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
