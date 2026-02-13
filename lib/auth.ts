import { User, PlanType } from '@/types';
import { supabase } from './supabaseClient';

async function ensureProfile(userId: string, email: string): Promise<PlanType> {
  const { data } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .maybeSingle();

  if (data) return (data.plan as PlanType) || 'free';

  await supabase.from('profiles').insert({ id: userId, email, plan: 'free' });
  return 'free';
}

export async function fetchProfile(userId: string, email: string): Promise<User> {
  const plan = await ensureProfile(userId, email);
  return { id: userId, email, plan };
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: `Giris hatasi: ${error.message}` };
  }
  if (!data.user) {
    return { success: false, error: 'Oturum acilamadi.' };
  }

  const user = await fetchProfile(data.user.id, data.user.email!);
  return { success: true, user };
}

export async function register(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (password.length < 6) {
    return { success: false, error: 'Sifre en az 6 karakter olmalidir.' };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { success: false, error: `Kayit hatasi: ${error.message}` };
  }
  if (!data.user) {
    return { success: false, error: 'Kullanici olusturulamadi.' };
  }

  const user = await fetchProfile(data.user.id, data.user.email!);
  return { success: true, user };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function updateUserPlan(userId: string, plan: PlanType): Promise<void> {
  await supabase.from('profiles').update({ plan }).eq('id', userId);
}
