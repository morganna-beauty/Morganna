'use client';

import { useContext, useMemo } from 'react';
import { AuthContext } from '@/contexts';

export const useAuth = () => {
  const context = useContext(AuthContext);

  return useMemo(() => {
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
  }, [context]);
};
