// AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/common/Header";
import HomePage from "@/pages/home/HomePage.tsx";
import LoginPage from "@/pages/login/LoginPage";
import SignupPage from "@/pages/signup/SignupPage";
import SettingsPage from "@/pages/settings/SettingPage";
import ChatbotPage from "@/pages/chatbot/ChatBotPage";
import LearningRagePage from "@/pages/learningrate/LearningRatePage";
import ParentCalendarPage from "@/pages/calendar/ParentCalendar";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/report" element={<ReportPage />} /> */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/learning-rate" element={<LearningRagePage />} />
        <Route path="/parentCalendar" element={<ParentCalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}
