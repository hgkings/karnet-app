'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('E-posta ve sifre gereklidir.');
      setLoading(false);
      return;
    }

    const result = mode === 'login'
      ? login(trimmedEmail, password)
      : register(trimmedEmail, password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Bir hata olustu.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-primary/20 via-primary/10 to-background lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold">PazarYeri Kar Kocu</h2>
          <p className="mt-4 text-muted-foreground">
            Pazaryerinde gercekten kar ediyor musun? Tum giderlerini hesapla, gercek net karini gor.
          </p>
          <div className="mt-8 rounded-2xl border bg-card/50 p-6 text-left backdrop-blur">
            <p className="text-sm font-medium">Demo Hesap</p>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>E-posta: demo@demo.com</p>
              <p>Sifre: 123456</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Kar Kocu</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold">
            {mode === 'login' ? 'Giris Yap' : 'Kayit Ol'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Hesabiniza giris yaparak devam edin.'
              : 'Yeni bir hesap olusturun.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Sifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Yukleniyor...' : mode === 'login' ? 'Giris Yap' : 'Kayit Ol'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <p className="text-muted-foreground">
                Hesabiniz yok mu?{' '}
                <button
                  className="font-medium text-primary hover:underline"
                  onClick={() => { setMode('register'); setError(''); }}
                >
                  Kayit Ol
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Zaten hesabiniz var mi?{' '}
                <button
                  className="font-medium text-primary hover:underline"
                  onClick={() => { setMode('login'); setError(''); }}
                >
                  Giris Yap
                </button>
              </p>
            )}
          </div>

          <div className="mt-6 rounded-xl border bg-muted/50 p-4 text-center lg:hidden">
            <p className="text-xs font-medium text-muted-foreground">Demo Hesap</p>
            <p className="mt-1 text-xs text-muted-foreground">demo@demo.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
