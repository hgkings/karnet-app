import { User } from '@/types';
import { supabase } from './supabase';

export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: 'E-posta veya şifre hatalı.' };
    }

    if (!data.user) {
      return { success: false, error: 'Giriş başarısız.' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      plan: profile?.plan || 'free',
    };

    return { success: true, user };
  } catch (err) {
    return { success: false, error: 'Bir hata oluştu.' };
  }
}

export async function register(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  if (password.length < 6) {
    return { success: false, error: 'Şifre en az 6 karakter olmalıdır.' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'Bu e-posta zaten kayıtlı.' };
      }
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Kayıt başarısız.' };
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      plan: 'free',
    };

    return { success: true, user };
  } catch (err) {
    return { success: false, error: 'Bir hata oluştu.' };
  }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return {
      id: user.id,
      email: user.email!,
      plan: profile?.plan || 'free',
    };
  } catch {
    return null;
  }
}

export async function updateUserPlan(userId: string, plan: 'free' | 'pro'): Promise<void> {
  await supabase
    .from('profiles')
    .update({ plan })
    .eq('id', userId);
}
