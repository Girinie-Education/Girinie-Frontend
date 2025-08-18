import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/common/Header";

// 로그인 전 홈 (기존 home 폴더)
import LandingHomePage from "@/pages/home/HomePage";

// 로그인/회원가입
import LoginPage from "@/pages/login/LoginPage";
import SignupPage from "@/pages/signup/SignupPage";

// 설정/아동정보
import SettingsPage from "@/pages/settings/SettingPage";
import EditChildInfoPage from "@/pages/settings/EditChildInfoPage.tsx"; 

// 챗봇, 학습속도, 캘린더
import ChatbotPage from "@/pages/chatbot/ChatBotPage";
import LearningRatePage from "@/pages/learningrate/LearningRatePage";
import ParentCalendarPage from "@/pages/calendar/ParentCalendar";

// 로그인 후 공통 홈 (새 폴더: mainhome)
import MainHomePage from "@/pages/mainhome/HomePage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* 로그인 후 공통 홈 */}
        <Route path="/" element={<MainHomePage />} />

        {/* 로그인 전 홈(랜딩) — 필요 없으면 이 라우트 제거 가능 */}
        <Route path="/landing" element={<LandingHomePage />} />

        {/* 인증 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 설정 */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/child/:childId/edit" element={<EditChildInfoPage />} />

        {/* 기능 페이지 */}
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/learning-rate" element={<LearningRatePage />} />
        <Route path="/parentCalendar" element={<ParentCalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}
