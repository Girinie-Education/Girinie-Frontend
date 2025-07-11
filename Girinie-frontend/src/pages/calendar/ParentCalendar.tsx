// import React from "react";
import Calendar from "@/components/calendar/Calendar";
import GuardianSidebar from "@/components/common/GuardianSidebar";

export default function ParentCalendarPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
\        <aside className="mr-6 hidden lg:block lg:w-64">{ <GuardianSidebar/> }</aside>

        <main className="flex min-h-screen flex-1 items-center justify-center">
          <div className="mt-10 w-full max-w-4xl">
            <Calendar mode="child" />
          </div>
        </main>
      </div>
    </div>
  );
}
