'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

export const useProtectedActions = () => {
  const { isAuthenticated, user } = useAuth();

  const withAuth = useCallback(
    <T extends (...args: any[]) => any>(action: T): T => {
      return ((...args: Parameters<T>) => {
        if (!isAuthenticated) {
          return Promise.reject(new Error('Authentication required'));
        }

        return action(...args);
      }) as T;
    },
    [isAuthenticated]
  );

  const withAdminAuth = useCallback(
    <T extends (...args: any[]) => any>(action: T): T => {
      return ((...args: Parameters<T>) => {
        if (!isAuthenticated) {
          return Promise.reject(new Error('Authentication required'));
        }

        if (user?.role !== 'admin') {
          return Promise.reject(new Error('Admin role required'));
        }

        return action(...args);
      }) as T;
    },
    [isAuthenticated, user?.role]
  );

  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  return useMemo(
    () => ({
      isAuthenticated,
      isAdmin,
      withAuth,
      withAdminAuth,
    }),
    [isAuthenticated, isAdmin, withAuth, withAdminAuth]
  );
};
