import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

apiClient.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  
  const csrftoken = Cookies.get("csrftoken");
  if (csrftoken) {
    config.headers["X-CSRFToken"] = csrftoken;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  config.headers["ngrok-skip-browser-warning"] = "true";
  
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      console.warn("[api] auth error", status, error?.response?.data);
      // 세션 기반에서는 401/403 에러 발생 시 로그아웃을 처리해야 합니다.
    }
    return Promise.reject(error);
  }
);

export async function ensureCsrfCookie() {
  try {
    await apiClient.get("/home/");
  } catch (e) {
    console.warn("[api] ensureCsrfCookie failed (ignored):", e);
  }
}