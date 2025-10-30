'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth, useI18n } from '@/hooks';
import { FaRegUser } from 'react-icons/fa6';
import { HiLogout } from 'react-icons/hi';

export const UserMenu = () => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
        aria-label="User menu"
      >
        <FaRegUser size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>

              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <HiLogout size={16} />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
