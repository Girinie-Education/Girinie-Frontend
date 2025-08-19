import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "@/components/common/Header";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuthStore } from "@/stores/authStore";

// 로그인 전 페이지
import LandingHomePage from "@/pages/home/HomePage"; 
import LoginPage from "@/pages/login/LoginPage";
import SignupPage from "@/pages/signup/SignupPage";
import FindAccountPage from "@/pages/account/FindAccountPage";

// 로그인 후 페이지 (공통)
import MainHomePage from "@/pages/mainhome/HomePage";
// import GuardianPage from "@/pages/gardian/GuardianPage";
import ChildPage from "@/pages/child/ChildPage";
import SettingsPage from "@/pages/settings/SettingPage";
import ReportPage from "@/pages/report/ReportPage";
import EditChildInfoPage from "@/pages/settings/EditChildInfoPage";

// 챗봇, 학습속도, 캘린더
import ChatbotPage from "@/pages/chatbot/ChatBotPage";
import LearningRatePage from "@/pages/learningrate/LearningRatePage";
import CalendarRouterPage from "@/pages/calendar/CalendarRouter";
import ParentCalendarPage from "@/pages/calendar/ParentCalendar";

/** 비로그인 전용 라우트: 로그인 상태면 /home 으로 내보냄 */
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  if (isLoggedIn) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

/** 404 페이지 (간단 버전) */
function NotFound() {
  return <div className="mt-24 text-center text-gray-600">페이지를 찾을 수 없습니다.</div>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/** ---------- 비로그인 전용 ---------- */}
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <LandingHomePage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/find-account"
          element={
            <PublicOnlyRoute>
              <FindAccountPage />
            </PublicOnlyRoute>
          }
        />

        {/** ---------- 로그인 필요 ---------- */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent"
          element={
            <ProtectedRoute>
              <ParentCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child"
          element={
            <ProtectedRoute>
              <ChildPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/child/:childId/edit"
          element={
            <ProtectedRoute>
              <EditChildInfoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ChatbotPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning-rate"
          element={
            <ProtectedRoute>
              <LearningRatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar/:role"
          element={
            <ProtectedRoute>
              <CalendarRouterPage />
            </ProtectedRoute>
          }
        />

        {/** ---------- 404 ---------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
