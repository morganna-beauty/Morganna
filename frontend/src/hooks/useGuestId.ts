'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

const GUEST_ID_KEY = 'guestId';

export const useGuestId = () => {
  const [guestId, setGuestId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let id = localStorage.getItem(GUEST_ID_KEY);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(GUEST_ID_KEY, id);
    }

    setGuestId(id);
    setIsLoading(false);
  }, []);

  const regenerateGuestId = useCallback(() => {
    const newId = crypto.randomUUID();

    localStorage.setItem(GUEST_ID_KEY, newId);
    setGuestId(newId);

    return newId;
  }, []);

  const clearGuestId = useCallback(() => {
    localStorage.removeItem(GUEST_ID_KEY);
    setGuestId('');
  }, []);

  return useMemo(() => ({
    guestId,
    isLoading,
    regenerateGuestId,
    clearGuestId,
  }), [guestId, isLoading, regenerateGuestId, clearGuestId]);
};