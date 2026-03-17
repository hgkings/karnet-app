'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LiveAnalysisShowcase } from '@/components/auth/live-analysis-showcase';
import { Label } from '@/components/ui/label';
import {
  Eye, EyeOff, HelpCircle, BarChart3, ShieldAlert, Layers,
  Star, BadgeCheck, Zap, CreditCard, Lock as LockIcon, Users, ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, register, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('E-posta ve şifre gereklidir.');
      setLoading(false);
      return;
    }
    const result = mode === 'login'
      ? await login(trimmedEmail, password)
      : await register(trimmedEmail, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Bir hata oluştu.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">

      {/* ── LEFT PANEL (desktop only) — dark gradient with product context ── */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-center px-10 xl:px-14 py-12 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700 to-blue-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative z-10 max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div>
            <img src="/brand/logo-dark.svg" alt="Kârnet" className="h-9 w-auto" />
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white leading-tight font-geist">
              Pazaryerinde gerçekten<br />
              <span className="text-orange-300">kâr ediyor musun?</span>
            </h1>
            <p className="text-white/70 leading-relaxed">
              Komisyon, kargo, reklam, iade, KDV dahil — net kâr ve risk puanı.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-3">
            {[
              { icon: BarChart3, text: 'Net kâr & kâr marjı', color: 'text-blue-300' },
              { icon: ShieldAlert, text: 'Zarar/risk uyarısı', color: 'text-amber-300' },
              { icon: Layers, text: 'Ürün bazlı maliyet dökümü', color: 'text-emerald-300' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-white/90">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Live Analysis Showcase */}
          <LiveAnalysisShowcase />

          {/* Compact Testimonials */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Yorumlar</span>
            <div className="grid gap-3">
              {[
                { quote: 'Zarar ettiğimi fark etmem 2 dakika sürdü.', name: 'Emre K.', role: 'Trendyol Satıcısı' },
                { quote: 'Excel\'den kurtuldum, her şey tek panelde.', name: 'Seda A.', role: 'E-ticaret Danışmanı' },
              ].map((t) => (
                <div key={t.name} className="rounded-xl bg-white/8 border border-white/10 p-3.5 space-y-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-white/80">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-white/90">{t.name}</span>
                    <span className="text-[10px] text-white/40">· {t.role}</span>
                    <BadgeCheck className="h-3 w-3 text-emerald-400 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust */}
          <div className="space-y-2">
            {[
              { icon: CreditCard, text: 'Kredi kartı gerekmez' },
              { icon: Users, text: '500+ satıcı kullanıyor' },
              { icon: Star, text: 'Ücretsiz plan sonsuza kadar' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-[11px] text-white/50">
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Auth form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-12">

        {/* Mobile logo */}
        <div className="lg:hidden w-full max-w-[420px] mb-8 text-center space-y-3">
          <div className="flex justify-center">
            <img src="/brand/logo.svg" alt="Kârnet" className="h-9 w-auto dark:hidden" />
            <img src="/brand/logo-dark.svg" alt="Kârnet" className="h-9 w-auto hidden dark:block" />
          </div>
          <p className="text-sm text-muted-foreground">Net kârını gör. Komisyon, kargo, iade dahil.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] space-y-5"
        >
          {/* Auth card */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-premium-lg p-7 sm:p-8 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight font-geist">
                  {mode === 'login' ? 'Hoş Geldiniz' : 'Hesap Oluştur'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === 'login'
                    ? 'Devam etmek için bilgilerinizi girin.'
                    : 'Kârnet ile kârlılığınızı artırmaya başlayın.'}
                </p>
              </div>

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 text-sm font-medium rounded-xl gap-3 border-border hover:bg-muted/60 transition-all mb-1"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Google ile devam et
              </Button>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">veya e-posta ile devam et</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@sirket.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-lg"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Şifre</Label>
                    {mode === 'login' && (
                      <Link href="#" className="text-xs text-primary hover:underline">Şifremi unuttum</Link>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 rounded-lg pr-10"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2 dark:bg-red-950/50 dark:border-red-900 dark:text-red-400">
                    <HelpCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-semibold rounded-xl btn-shine shadow-sm transition-all gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? 'Giriş Yap' : 'Hemen Başla'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Toggle */}
              <div className="mt-6 pt-5 border-t border-border/50 text-center text-sm">
                {mode === 'login' ? (
                  <p className="text-muted-foreground">
                    Hesabınız yok mu?{' '}
                    <button onClick={() => setMode('register')} className="font-semibold text-primary hover:underline">
                      Ücretsiz Kayıt Ol
                    </button>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Zaten üye misiniz?{' '}
                    <button onClick={() => setMode('login')} className="font-semibold text-primary hover:underline">
                      Giriş Yap
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Demo link */}
          <div className="text-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              <Zap className="h-4 w-4" />
              Hesap oluşturmadan demo&apos;yu dene →
            </Link>
          </div>

          {/* Mobile context */}
          <div className="lg:hidden w-full space-y-4">
            <LiveAnalysisShowcase />
            <div className="rounded-lg border bg-card/60 p-3.5 space-y-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-foreground/90">&ldquo;Zarar ettiğimi fark etmem 2 dakika sürdü.&rdquo;</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold">Emre K.</span>
                <span className="text-[10px] text-muted-foreground">· Trendyol Satıcısı</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> Kredi kartı gerekmez</span>
              <span>·</span>
              <span className="flex items-center gap-1"><LockIcon className="h-3 w-3" /> Veriler satılmaz</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 500+ satıcı</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
