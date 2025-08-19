import { useState } from "react";
import { loginUser } from "@/api/auth/login";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // loginUser는 200 OK만 반환하면 됩니다.
      await loginUser({ username: id.trim(), password });

      // 로그인 성공 시 스토어 상태를 true로 설정
      login();
      
      alert("로그인 성공!");
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/home";
      navigate(next, { replace: true });

    } catch (err: any) {
      const msg = err?.response?.status === 401 ? "인증 실패" : "오류 발생";
      alert("로그인 실패: " + msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF1B0]">
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-[350px] w-[500px] rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">로그인</h2>
          <form onSubmit={handleSubmit}>
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
              type="submit"
              className="w-full rounded bg-[#C1905C] py-2 text-white hover:bg-[#a87847]"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}