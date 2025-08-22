// src/pages/calendar/CalendarRouter.tsx
import { useParams } from "react-router-dom";
import KidCalendarPage from "./KidCalendar";
import ParentCalendarPage from "./ParentCalendar";
import ChildPage from "../child/ChildPage";
import GuardianPage from "../gardian/GuardianPage";

export default function CalendarRouterPage() {
  const { role, childId } = useParams<{ role?: string; childId?: string }>();

  if (role === "kid" || role === "child") {
    return (
      <ChildPage>
        <KidCalendarPage />
      </ChildPage>
    );
  }

  if (role === "parent") {
    return (
      <GuardianPage>
        <ParentCalendarPage />
      </GuardianPage>
    );
  }

  return <div>잘못된 접근입니다.</div>;
}
