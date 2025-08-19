import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/api/common';

export function useAuth() {
  const { login, logout } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 세션이 유효한지 확인하는 API 호출
    apiClient
      .get("/parent_users/me/")
      .then(() => login())
      .catch(() => logout())
      .finally(() => setInitialized(true));
  }, [login, logout]);

  return { isAuthenticated: useAuthStore.getState().isLoggedIn, initialized };
}