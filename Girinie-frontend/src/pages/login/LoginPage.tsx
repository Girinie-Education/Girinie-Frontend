import { useState } from "react";
import { loginUser } from "@/api/auth/login";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", id, password);
    try {
      const res = await loginUser({ username: id.trim(), password });
      // Robust response log
      console.log("[login] success response:", {
        status: (res && res.status) || "n/a",
        data: (res && res.data) || res,
      });
      // Extract token from common shapes
      const data = (res && res.data) || res || {};
      const access = data.access || data.token || (res && res.access) || (res && res.token);
      if (access) {
        try {
          window.localStorage.setItem("accessToken", access);
          console.log("[login] accessToken saved to localStorage");
        } catch (e) {
          console.warn("[login] failed to store accessToken in localStorage", e);
        }
      } else {
        console.warn("[login] no access token found in response");
      }
      alert("로그인 성공!");
      console.log("[login] success");
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/calendar/parent";
      navigate(next);
    } catch (err: any) {
      console.error("[login] failed:", {
        status: err?.response?.status,
        data: err?.response?.data ?? err?.message ?? err,
      });
      const msg =
        err?.response?.status === 401
          ? "인증 실패"
          : err?.response?.data?.detail || err?.response?.data?.message || "오류 발생";
      alert("로그인 실패: " + msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF1B0]">
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-[350px] w-[500px] rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">로그인</h2>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디"
            className="mb-4 w-full rounded border border-gray-300 p-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="mb-4 w-full rounded border border-gray-300 p-2"
          />

          <div className="mb-4 flex justify-between text-sm text-black text-opacity-50">
            <a href="/find-account" className="hover:underline">
              아이디/비밀번호 찾기
            </a>
            <a href="/signup" className="hover:underline">
              회원가입
            </a>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full rounded bg-[#C1905C] py-2 text-white hover:bg-[#a87847]"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
