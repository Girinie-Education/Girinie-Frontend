import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import StampIcon from "@/components/StampIcon";
import Calendar from "@/components/calendar/Calendar";
import { fetchMonthlyRewards } from "@/api/parent";
import { useNavigate, useParams } from "react-router-dom";

export default function ParentCalendarPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [stamps, setStamps] = useState<Record<string, any[]>>({});

  const today = new Date();
  const { childId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const yyyy = today.getFullYear().toString();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    fetchMonthlyRewards(childId, yyyy, mm).then((data) => {
      const map: Record<string, any[]> = {};
      data.forEach(({ date, ...rest }) => {
        map[date] = map[date] || [];
        map[date].push(rest);
      });
      setStamps(map);
    });
  }, []);

  const handleDayClick = (date: Date) => {
    const formattedDate = date.toISOString().slice(0, 10);
    navigate(`/calendar/parent/detail/${formattedDate}`);
  };

  const renderStamp = (date: Date) => {
    const key = date.toISOString().slice(0, 10);
    return stamps[key]?.map((s, idx) => <StampIcon key={idx} {...s} />) || null;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex py-20">
        {/* Sidebar placeholder */}
        <aside className="mr-6 hidden lg:block lg:w-64">{/* Sidebar will be added here */}</aside>

        {/* Main content */}
        <main className="flex flex-1 justify-center">
          <div className="w-full max-w-4xl">
            <Calendar mode="parent" onDayClick={handleDayClick} renderStamp={renderStamp} />
            {modalOpen && (
              <Modal onClose={() => setModalOpen(false)}>
                <h2>오늘의 도장 목록</h2>
                {selectedDate && (
                  <ul>
                    {(stamps[selectedDate.toISOString().slice(0, 10)] || []).map((s, idx) => (
                      <li key={idx}>{/* s 내용 렌더링 */}</li>
                    ))}
                  </ul>
                )}
              </Modal>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
