import { useState, useEffect } from "react";
import { fetchKidStamps } from "@/api/kid";
import StampIcon from "@/components/StampIcon"; // 스탬프 아이콘 컴포넌트
import Calendar from "@/components/calendar/Calendar";

export default function KidCalendarPage() {
  const [stamps, setStamps] = useState<Record<string, any[]>>({});
  const [childId, setChildId] = useState("default-id"); // 필요시 외부에서 받아올 수도 있음

  // 오늘 날짜
  const today = new Date();

  useEffect(() => {
    const yyyy = today.getFullYear().toString();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    fetchKidStamps(childId, yyyy, mm).then((data) => {
      const map: Record<string, any[]> = {};
      data.forEach(({ date, stamps }) => {
        map[date] = stamps;
      });
      setStamps(map);
    });
  }, [childId]);

  const handleDayClick = (date: Date) => {
    // 아무 동작 없음
  };

  const renderStamp = (date: Date) => {
    const key = date.toISOString().slice(0, 10);
    return stamps[key]?.map((s, idx) => <StampIcon key={idx} {...s} />) || null;
  };

  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return (
    <div className="min-h-screen bg-[#F7E0AF] p-6">
      <div className="flex py-20">
        {/* Sidebar placeholder */}
        <aside className="mr-6 hidden lg:block lg:w-64">{/* Sidebar will be added here */}</aside>

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
