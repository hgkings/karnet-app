'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { getCurrentUser, login as authLogin, register as authRegister, logout as authLogout, updateUserPlan } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  upgradePlan: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(() => {
    const current = getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    refreshUser();
    setLoading(false);
  }, [refreshUser]);

  const login = useCallback((email: string, password: string) => {
    const result = authLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const register = useCallback((email: string, password: string) => {
    const result = authRegister(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const upgradePlan = useCallback(() => {
    if (user) {
      updateUserPlan(user.id, 'pro');
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
