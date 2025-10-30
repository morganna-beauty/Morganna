'use client';

import { useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { AuthContext, AuthContextType, User } from '@/contexts';
import { authApi } from '@/lib';

interface AuthProviderProps {
  children: ReactNode;
}

const getStoredAuth = (): { user: User | null; token: string | null } => {
  if (typeof window === 'undefined') return { user: null, token: null };

  try {
    const storedUser = localStorage.getItem('morganna_auth');
    const storedToken = localStorage.getItem('morganna_token');

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken,
    };
  } catch (error) {
    console.warn('Failed to read auth data:', error);

    return { user: null, token: null };
  }
};

const setStoredAuth = (user: User | null, token: string | null): void => {
  if (typeof window === 'undefined') return;

  try {
    if (user && token) {
      localStorage.setItem('morganna_auth', JSON.stringify(user));
      localStorage.setItem('morganna_token', token);
    } else {
      localStorage.removeItem('morganna_auth');
      localStorage.removeItem('morganna_token');
    }
  } catch (error) {
    console.warn('Failed to save auth data:', error);
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const { user: savedUser, token: savedToken } = getStoredAuth();

      if (savedUser && savedToken) {
        try {
          const profile = await authApi.getProfile();

          setUser(profile);
          setToken(savedToken);
        } catch (error) {
          setStoredAuth(null, null);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const authResponse = await authApi.login({ username, password });

      setUser(authResponse.user);
      setToken(authResponse.access_token);
      setStoredAuth(authResponse.user, authResponse.access_token);

      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
    } finally {
      setUser(null);
      setToken(null);
      setStoredAuth(null, null);
    }
  }, []);

  const contextValue: AuthContextType = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
