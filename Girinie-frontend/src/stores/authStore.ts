// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isLoggedIn: false,
      login: (token) => {
        // 로컬스토리지에도 보관(백엔드 인터셉터에서 사용한다면)
        try { localStorage.setItem("accessToken", token); } catch {}
        set({ accessToken: token, isLoggedIn: true });
      },
      logout: () => {
        try { localStorage.removeItem("accessToken"); } catch {}
        set({ accessToken: null, isLoggedIn: false });
      },
    }),
    { name: "auth" }
  )
);
