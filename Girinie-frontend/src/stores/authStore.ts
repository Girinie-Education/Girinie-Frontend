// src/stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: "auth-storage",                             // localStorage 키
      storage: createJSONStorage(() => localStorage),   // 명시적으로 JSON 직렬화
    }
  )
);
