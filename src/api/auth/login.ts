import axios from "@/lib/axios";

interface LoginPayload {
  username: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const res = await axios.post("/parent_users/login/", payload, {
    withCredentials: true, // 세션 기반 인증일 경우 필요
  });
  return res.data;
};
