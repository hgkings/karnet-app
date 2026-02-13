import { Analysis, User } from '@/types';

const ANALYSES_KEY = 'pkk_analyses';
const USER_KEY = 'pkk_user';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getStoredAnalyses(userId: string): Analysis[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(ANALYSES_KEY);
    if (!raw) return [];
    const all: Analysis[] = JSON.parse(raw);
    return all.filter((a) => a.userId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export function getAnalysisById(id: string): Analysis | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(ANALYSES_KEY);
    if (!raw) return null;
    const all: Analysis[] = JSON.parse(raw);
    return all.find((a) => a.id === id) || null;
  } catch {
    return null;
  }
}

export function saveAnalysis(analysis: Analysis): void {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem(ANALYSES_KEY);
    const all: Analysis[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex((a) => a.id === analysis.id);
    if (idx >= 0) {
      all[idx] = analysis;
    } else {
      all.push(analysis);
    }
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(all));
  } catch {
    // silent fail
  }
}

export function deleteAnalysis(id: string): void {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem(ANALYSES_KEY);
    if (!raw) return;
    const all: Analysis[] = JSON.parse(raw);
    const filtered = all.filter((a) => a.id !== id);
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(filtered));
  } catch {
    // silent fail
  }
}

export function getStoredUser(): User | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (!isBrowser()) return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getUserAnalysisCount(userId: string): number {
  return getStoredAnalyses(userId).length;
}

export function generateId(): string {
  if (isBrowser() && crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
