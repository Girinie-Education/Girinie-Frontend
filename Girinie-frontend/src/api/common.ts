// src/api/common.ts
import axios from "axios";
import Cookies from "js-cookie";

// 개발(프록시 사용) 기준: /api/v1 로 호출 → Vite가 ngrok으로 프록시
export const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // 세션/쿠키 전송
  headers: { "Content-Type": "application/json" },
  xsrfCookieName: "csrftoken", // Django 기본
  xsrfHeaderName: "X-CSRFToken", // Django 기본
});

// 요청 인터셉터: CSRF + ngrok 경고 스킵 헤더
apiClient.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};
  const csrftoken = Cookies.get("csrftoken");
  if (csrftoken) config.headers["X-CSRFToken"] = csrftoken;
  // ngrok 배너 우회
  config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});

// 응답 인터셉터: 인증 에러 로깅(선택)
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      console.warn("[api] auth error", status, error?.response?.data);
    }
    return Promise.reject(error);
  }
);

// 세션 기반: 최초 1회 CSRF 쿠키 확보용(서버에 @ensure_csrf_cookie 엔드포인트 필요)
export async function ensureCsrfCookie() {
  try {
    // 예: /api/v1/home/ (common의 baseURL이 /api/v1 이므로 /home/만 적으면 됨)
    await apiClient.get("/home/");
  } catch (e) {
    console.warn("[api] ensureCsrfCookie failed (ignored):", e);
  }
}
