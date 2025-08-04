// src/pages/CalendarPage/CalendarRouter.tsx
import { useParams } from "react-router-dom";
import KidCalendarPage from "./KidCalendar";
import ParentCalendarPage from "./ParentCalendar";

export default function CalendarRouterPage() {
  const { role } = useParams<{ role: string }>();
  if (role === "kid") return <KidCalendarPage />;
  if (role === "parent") return <ParentCalendarPage />;
  return <div>잘못된 접근입니다.</div>;
}
