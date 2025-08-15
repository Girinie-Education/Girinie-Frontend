// src/api/auth/login.ts
import { apiClient, ensureCsrfCookie } from "@/api/common";

interface LoginPayload {
  username: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  await ensureCsrfCookie();
  const body = {
    username: payload.username?.trim(),
    password: payload.password, // 비밀번호는 트림하지 않음
  };
  const res = await apiClient.post("/parent_users/login/", body);
  return res.data ?? res;
};
