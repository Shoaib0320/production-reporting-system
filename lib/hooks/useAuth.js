'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/lib/api';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load user from localStorage on mount
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.auth.login({ email, password });
      
      // Save to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      toast.success('لاگ ان کامیاب');
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (response.user.role === 'operator') {
        router.push('/dashboard/operator');
      } else {
        router.push('/dashboard');
      }
      
      return response;
    } catch (error) {
      const message = error.response?.data?.error || 'لاگ ان ناکام ہو گیا';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    toast.success('لاگ آؤٹ کامیاب');
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.auth.register(userData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      toast.success('رجسٹریشن کامیاب');
      
      return response;
    } catch (error) {
      const message = error.response?.data?.error || 'رجسٹریشن ناکام ہو گئی';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOperator: user?.role === 'operator',
    isSupervisor: user?.role === 'supervisor',
  };
}
