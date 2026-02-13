import { User } from '@/types';
import { getStoredUser, setStoredUser, generateId } from './storage';

const USERS_DB_KEY = 'pkk_users_db';

interface StoredUserRecord {
  id: string;
  email: string;
  password: string;
  plan: 'free' | 'pro';
}

function getUsersDB(): StoredUserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      const demo: StoredUserRecord = {
        id: 'demo-user-001',
        email: 'demo@demo.com',
        password: '123456',
        plan: 'pro',
      };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify([demo]));
      return [demo];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsersDB(users: StoredUserRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const db = getUsersDB();
  const record = db.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!record) {
    return { success: false, error: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.' };
  }

  if (record.password !== password) {
    return { success: false, error: 'Şifre hatalı.' };
  }

  const user: User = { id: record.id, email: record.email, plan: record.plan };
  setStoredUser(user);
  return { success: true, user };
}

export function register(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (password.length < 6) {
    return { success: false, error: 'Şifre en az 6 karakter olmalıdır.' };
  }

  const db = getUsersDB();
  const existing = db.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return { success: false, error: 'Bu e-posta zaten kayıtlı.' };
  }

  const newRecord: StoredUserRecord = {
    id: generateId(),
    email: email.toLowerCase(),
    password,
    plan: 'free',
  };

  db.push(newRecord);
  saveUsersDB(db);

  const user: User = { id: newRecord.id, email: newRecord.email, plan: newRecord.plan };
  setStoredUser(user);
  return { success: true, user };
}

export function logout(): void {
  setStoredUser(null);
}

export function getCurrentUser(): User | null {
  return getStoredUser();
}

export function updateUserPlan(userId: string, plan: 'free' | 'pro'): void {
  const db = getUsersDB();
  const idx = db.findIndex((u) => u.id === userId);
  if (idx >= 0) {
    db[idx].plan = plan;
    saveUsersDB(db);
  }
  const current = getStoredUser();
  if (current && current.id === userId) {
    setStoredUser({ ...current, plan });
  }
}
