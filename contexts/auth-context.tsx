'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { getCurrentUser, login as authLogin, register as authRegister, logout as authLogout, updateUserPlan } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  upgradePlan: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const current = await getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    refreshUser();
    setLoading(false);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      (async () => {
        await refreshUser();
      })();
    });

    return () => subscription.unsubscribe();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const result = await authRegister(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  const upgradePlan = useCallback(async () => {
    if (user) {
      await updateUserPlan(user.id, 'pro');
      setUser({ ...user, plan: 'pro' });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, upgradePlan, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
