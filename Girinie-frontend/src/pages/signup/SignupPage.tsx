import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupUser } from "@/api/auth/signup";

export default function SignupPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [customEmailDomain, setCustomEmailDomain] = useState("");
  const [isCustomDomain, setIsCustomDomain] = useState(false);

  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError("");
    const username = id.trim();
    const local = emailLocal.trim();
    const domain = (isCustomDomain ? customEmailDomain : emailDomain).trim();
    const emailNorm = `${local}@${domain}`.toLowerCase();

    // Basic validations
    if (!username) {
      alert("아이디를 입력하세요.");
      return;
    }
    if (!local || !domain) {
      alert("이메일을 정확히 입력하세요.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!password || password.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      const result = await signupUser({
        username,
        password,
        email: emailNorm,
      });
      console.log("보내는 값", { username, password, email: emailNorm });

      console.log("회원가입 성공:", result);
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (err: any) {
      const data = err?.response?.data;
      console.error("회원가입 실패:", data || err?.message || err);
      // 서버가 { message, errors } 형태로 내려줄 때 사용자에게 보여줄 메시지 구성
      const msg = data?.message || "회원가입 중 오류가 발생했습니다.";
      const errs = data?.errors;
      let detail = "";
      if (errs && typeof errs === "object") {
        detail = Object.entries(errs)
          .map(([k, v]) => {
            if (Array.isArray(v)) return `${k}: ${v.join(", ")}`;
            if (v && typeof v === "object") return `${k}: ${JSON.stringify(v)}`;
            return `${k}: ${String(v)}`;
          })
          .join("\n");
      }
      const full = detail ? `${msg}\n\n${detail}` : msg;
      setFormError(full);
      alert(full);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF1B0]">
      <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleSubmit} className="w-[500px] rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">회원가입</h2>

          {formError && (
            <div className="mb-4 whitespace-pre-line rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="mb-4 w-full rounded border border-gray-300 p-2"
          />
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="이메일"
              value={emailLocal}
              onChange={(e) => setEmailLocal(e.target.value)}
              className="flex-1 rounded border border-gray-300 p-2"
            />
            <span>@</span>
            {!isCustomDomain ? (
              <select
                value={emailDomain}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setIsCustomDomain(true);
                    setEmailDomain("");
                  } else {
                    setIsCustomDomain(false);
                    setEmailDomain(e.target.value);
                  }
                }}
                className={`flex-1 rounded border border-gray-300 p-2 ${
                  emailDomain === "" ? "text-black text-opacity-50" : "text-black"
                }`}
              >
                <option value="" disabled>
                  선택...
                </option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.com">daum.com</option>
                <option value="hanmail.net">hanmail.net</option>
                <option value="nate.com">nate.com</option>
                <option value="custom">직접입력</option>
              </select>
            ) : (
              <input
                type="text"
                placeholder="도메인 입력"
                value={customEmailDomain}
                onChange={(e) => setCustomEmailDomain(e.target.value)}
                className="flex-1 rounded border border-gray-300 p-2 text-black"
                style={{ minHeight: "40px", width: "100%" }}
              />
            )}
          </div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded border border-gray-300 p-2"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="mb-4 w-full rounded border border-gray-300 p-2"
          />

          <button
            type="submit"
            className="w-full rounded bg-[#C1905C] py-2 text-white hover:bg-[#a87847]"
          >
            회원가입
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-black text-opacity-50 hover:underline"
            >
              뒤로가기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
