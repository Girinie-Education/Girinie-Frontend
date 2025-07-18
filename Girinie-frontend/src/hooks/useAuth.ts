// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { isLoggedIn, login, logout } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);

  return { isAuthenticated: isLoggedIn, initialized };
}
