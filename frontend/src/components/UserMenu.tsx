'use client';

import { useUserMenu } from '@/hooks';
import { FaRegUser } from 'react-icons/fa6';
import { HiLogout } from 'react-icons/hi';

export const UserMenu = () => {
  const {
    isOpen,
    menuRef,
    shouldRender,
    userInfo,
    translations,
    toggleMenu,
    handleLogout,
  } = useUserMenu();

  if (!shouldRender) {
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
              <p className="text-sm font-medium text-gray-900">{userInfo.username}</p>

              <p className="text-sm text-gray-500">{userInfo.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <HiLogout size={16} />
              {translations.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
