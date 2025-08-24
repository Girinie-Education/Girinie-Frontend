// src/pages/CalendarPage/ParentCalendar.tsx
import { useEffect, useMemo, useState } from "react";
import Calendar from "@/components/calendar/Calendar";
import ProgressModal from "@/components/modal/ProgressModal";
import StickerStamp from "@/components/calendar/StickerStamp";
import { fetchMonthlyRewards, type RewardCalendar } from "@/api/parent";
import { useNavigate, useParams } from "react-router-dom";
import { useChildData } from "@/hooks/useChildData";

export default function ParentCalendarPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [stamps, setStamps] = useState<Record<string, RewardCalendar[]>>({});

  // mount log (debug)
  useEffect(() => {
    console.log("[ParentCalendar] mounted");
  }, []);

  const navigate = useNavigate();
  const { childId } = useParams();
  const { data: children, loading: childLoading, error: childError } = useChildData();

  // 우선순위: URL 파라미터 > 첫 번째 자녀
  const effectiveChildId = useMemo(() => {
    if (childId) return childId;
    const first = children?.[0]?.id;
    return first ? String(first) : undefined;
  }, [childId, children]);

  // 첫번째 자녀로 리다이렉트 (URL 파라미터가 없고 자녀가 있을 때)
  useEffect(() => {
    if (!childId && children && children.length > 0) {
      const firstChildId = children[0].id;
      navigate(`/calendar/parent/${firstChildId}`, { replace: true });
    }
  }, [childId, children, navigate]);

  useEffect(() => {
    const today = new Date();
    const yyyy = String(today.getFullYear());
    const mm = String(today.getMonth() + 1).padStart(2, "0");

    if (!effectiveChildId) {
      console.warn("[ParentCalendar] skip fetch: no childId resolved");
      setStamps({});
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        console.log("[ParentCalendar] fetchMonthlyRewards params:", {
          childId: effectiveChildId,
          yyyy,
          mm,
        });
        const list = await fetchMonthlyRewards(effectiveChildId, yyyy, mm);
        const map: Record<string, RewardCalendar[]> = {};
        list.forEach((item) => {
          const key = item.date; // YYYY-MM-DD
          if (!key) return;
          (map[key] = map[key] || []).push(item);
        });
        if (!cancelled) setStamps(map);
      } catch (e) {
        console.error("[ParentCalendar] fetchMonthlyRewards failed:", e);
        if (!cancelled) setStamps({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [effectiveChildId]);

  // 로컬 날짜를 YYYY-MM-DD 형식으로 변환 (시간대 문제 해결)
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const renderStamp = (date: Date) => {
    const key = formatLocalDate(date);
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

  // Notice banner (render calendar regardless)
  let notice: string | null = null;
  if (childLoading && !effectiveChildId) {
    notice = "자녀 정보를 불러오는 중…";
  } else if (childError && !effectiveChildId) {
    notice = "자녀 정보를 불러오지 못했습니다.";
  } else if (!effectiveChildId) {
    notice = "자녀가 없습니다. 먼저 자녀를 등록하세요.";
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex py-20">
        <main className="flex flex-1 justify-center">
          <div className="w-full max-w-4xl">
            {notice && (
              <div className="mb-3 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                {notice}
              </div>
            )}
            <Calendar mode="parent" onDayClick={handleDayClick} renderStamp={renderStamp} />
            
            {/* Progress Modal */}
            <ProgressModal 
              childId={effectiveChildId ? Number(effectiveChildId) : undefined}
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              initialDate={selectedDate ? formatLocalDate(selectedDate) : undefined}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
