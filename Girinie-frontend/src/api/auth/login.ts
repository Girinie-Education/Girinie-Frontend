// src/api/auth/login.ts
import { apiClient } from "@/api/common";

interface LoginPayload {
  username: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const res = await apiClient.post("/parent_users/login/", payload);
  return res.data;
};
