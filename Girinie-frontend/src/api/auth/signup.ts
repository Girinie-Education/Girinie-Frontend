// src/api/auth/signup.ts
import axios from "@/lib/axios";

interface SignupPayload {
  username: string;
  password: string;
  email: string;
}

export const signupUser = async (payload: SignupPayload) => {
  const res = await axios.put("/parent_users/", payload);
  return res.data;
};
