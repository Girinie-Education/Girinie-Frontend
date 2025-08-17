// src/api/auth/signup.ts
import { apiClient } from "@/api/common";

export interface SignupPayload {
  username: string;
  password: string;
  email: string;
}

export const signupUser = async (payload: SignupPayload) => {
  try {
    const body = {
      username: payload.username?.trim(),
      password: payload.password, // 비밀번호는 트림하지 않음
      email: payload.email?.trim(),
    };
    // apiClient 설정에 따른 기본 withCredentials 사용
    const res = await apiClient.post("/parent_users/", body);
    return res.data;
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    console.error("[signup] failed:", status ?? "no-status", data ?? err?.message ?? err);
    if (data && (data.message || data.errors)) {
      console.error("[signup] server detail:", { message: data.message, errors: data.errors });
    }
    throw err;
  }
};
