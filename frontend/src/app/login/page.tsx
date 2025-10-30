'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    router.push('/admin');
  };

  if (isAuthenticated) {
    return null;
  }

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
