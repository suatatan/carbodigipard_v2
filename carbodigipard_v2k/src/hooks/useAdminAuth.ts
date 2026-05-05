import { useState, useEffect, useCallback, useMemo } from "react";
import { trpc } from "@/providers/trpc";

interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

const ADMIN_TOKEN_KEY = "admin_token";

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  });

  const utils = trpc.useUtils();

  const { data: user, isLoading } = trpc.adminAuth.me.useQuery(undefined, {
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const loginMutation = trpc.adminAuth.login.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      utils.adminAuth.me.invalidate();
    },
  });

  const login = useCallback(
    async (username: string, password: string) => {
      return loginMutation.mutateAsync({ username, password });
    },
    [loginMutation]
  );

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    utils.adminAuth.me.invalidate();
    window.location.reload();
  }, [utils]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
  }, [token]);

  return useMemo(
    () => ({
      user: user as AdminUser | null,
      isAuthenticated: !!user,
      isLoading: isLoading || loginMutation.isPending,
      login,
      logout,
      token,
    }),
    [user, isLoading, loginMutation.isPending, login, logout, token]
  );
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}
