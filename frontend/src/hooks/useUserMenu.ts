import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAuth, useI18n } from '@/hooks';

export const useUserMenu = () => {
  const { t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsOpen(false);
  }, [logout]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeMenu]);

  const shouldRender = useMemo(
    () => isAuthenticated && user,
    [isAuthenticated, user]
  );

  const userInfo = useMemo(() => ({
    username: user?.username || '',
    email: user?.email || '',
  }), [user]);

  const translations = useMemo(() => ({
    logout: t('auth.logout'),
  }), [t]);

  return {
    isOpen,
    menuRef,
    shouldRender,
    userInfo,
    translations,
    toggleMenu,
    handleLogout,
    closeMenu,
  };
};