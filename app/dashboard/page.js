'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardIndex() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user?.role === 'admin') router.push('/dashboard/admin');
      else if (user?.role === 'supervisor') router.push('/dashboard/supervisor');
      else if (user?.role === 'operator') router.push('/dashboard/operator');
      else router.push('/login');
    }
  }, [loading, user, router]);

  return null;
}
