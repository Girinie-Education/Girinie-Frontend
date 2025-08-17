import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/api/common';

export function useAuth() {
  const { isLoggedIn, login, logout } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
      apiClient
        .get("/parent_users/me/")
        .then(() => login())
        .catch(() => logout())
        .finally(() => setInitialized(true));
    }, [login, logout]);

  return { isAuthenticated: isLoggedIn, initialized };
}
