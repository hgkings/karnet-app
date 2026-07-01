'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KarnetLogo } from '@/components/shared/KarnetLogo';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { MFAVerifyForm } from '@/components/auth/mfa-verify-form';
import {
  Eye, EyeOff, HelpCircle, ArrowRight, Check, Mail,
  TrendingUp, TestTube2, Plug, ShieldCheck, Sparkles,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

// ── Hata mesajları: Supabase error → Türkçe ──
function translateError(err: string): string {
  const e = err.toLowerCase();
  if (e.includes('invalid login credentials') || e.includes('invalid credentials') || e.includes('giris hatasi')) {
    return 'E-posta veya şifre hatalı.';
  }
  if (e.includes('email not confirmed') || e.includes('email_not_confirmed')) {
    return 'E-postanızı doğrulamanız gerekiyor. Gelen kutunuzu kontrol edin.';
  }
  if (e.includes('too many requests') || e.includes('rate limit') || e.includes('over_email_send_rate_limit')) {
    return 'Çok fazla deneme yaptınız. Lütfen bekleyin.';
  }
  if (e.includes('user already registered') || e.includes('already registered')) {
    return 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.';
  }
  if (e.includes('password') && (e.includes('characters') || e.includes('karakter'))) {
    return 'Şifre en az 8 karakter olmalıdır.';
  }
  if (e.includes('email address not authorized') || e.includes('not authorized')) {
    return 'Bu e-posta adresi ile kayıt yapılamıyor.';
  }
  if (e.includes('smtp') || e.includes('email') && e.includes('send')) {
    return 'Doğrulama e-postası gönderilemedi. SMTP ayarlarını kontrol edin.';
  }
  // "Kayit hatasi: [gerçek mesaj]" — asıl hatayı göster
  if (e.includes('kayit hatasi')) {
    const actualError = err.replace(/^kayit hatasi:\s*/i, '');
    return `Kayıt başarısız: ${actualError}`;
  }
  return `Hata: ${err}`;
}

// ── Şifre güç hesaplayıcı ──
function getPasswordStrength(pwd: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (pwd.length === 0) return { level: 0, label: '' };
  if (pwd.length < 8) return { level: 1, label: 'Zayıf' };
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  if (pwd.length >= 12 && hasUpper && hasLower && hasNumber) return { level: 3, label: 'Güçlü' };
  return { level: 2, label: 'Orta' };
}

// ── Cam yüzey (landing ile aynı dil) ──
const GLASS = 'border border-white/60 bg-white/60 backdrop-blur-xl ring-1 ring-slate-900/[0.04] shadow-[0_18px_50px_-24px_rgba(15,23,42,0.30)]';

// ── Input ortak sınıflar (cam dostu) ──
const inputClasses =
  'auth-input h-11 w-full rounded-xl bg-white/80 border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 transition-all disabled:opacity-50';

// autofill stili CSS ile yönetiliyor (globals.css — auth-input-autofill)

function AuthPageContent() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // Kayıt sonrası e-posta doğrulamasına yönlendirildiğinde user redirect'ini engelle
  const [awaitingEmailVerification, setAwaitingEmailVerification] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const reduce = useReducedMotion();

  const { login, register, user, completeMFA } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = (() => {
    const next = searchParams.get('next') ?? '/dashboard';
    return (next.startsWith('/') && !next.startsWith('//') && !next.includes('://')) ? next : '/dashboard';
  })();

  // Oturum açık kullanıcıyı yönlendir — render sırasında değil, effect içinde
  useEffect(() => {
    if (user && !awaitingEmailVerification) {
      router.replace(returnUrl);
    }
  }, [user, awaitingEmailVerification, router, returnUrl]);

  const handleCapsLockCheck = useCallback((e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  }, []);

  const switchMode = useCallback((m: 'login' | 'register') => {
    setMode(m);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setAcceptTerms(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();

    if (!trimmedEmail || !password) {
      setError('E-posta ve şifre gereklidir.');
      return;
    }

    if (mode === 'register') {
      if (!trimmedName) {
        setError('Ad Soyad alanı zorunludur.');
        return;
      }
      if (password.length < 8) {
        setError('Şifre en az 8 karakter olmalıdır.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Şifreler eşleşmiyor.');
        return;
      }
      if (!acceptTerms) {
        setError('Devam etmek için kullanım şartlarını kabul etmeniz gerekiyor.');
        return;
      }
    }

    setLoading(true);

    if (mode === 'login') {
      const result = await login(trimmedEmail, password);
      if (result.success && result.mfaRequired) {
        setShowMFA(true);
        setLoading(false);
        return;
      }
      if (result.success) {
        router.push(returnUrl);
      } else {
        setError(translateError(result.error || ''));
      }
    } else {
      const result = await register(trimmedEmail, password);
      if (result.success) {
        // Profili full_name ile güncelle
        if (trimmedName) {
          try {
            const profileRes = await fetch('/api/user/profile', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ full_name: trimmedName }),
            });
            if (!profileRes.ok) {
              toast.error('İsim kaydedilemedi. Ayarlardan güncelleyebilirsiniz.');
            }
          } catch {
            toast.error('İsim kaydedilemedi. Ayarlardan güncelleyebilirsiniz.');
          }
        }

        // Kayıt başarılı — email doğrulama ekranı göster
        setAwaitingEmailVerification(true);
        toast.success('Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
      } else {
        setError(translateError(result.error || ''));
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnUrl)}` },
    });
    if (error) {
      console.error('[Google OAuth]', error.message);
      setError('Google ile giriş başarısız. Lütfen tekrar deneyin.');
      setGoogleLoading(false);
    }
  };

  const pwdStrength = mode === 'register' ? getPasswordStrength(password) : null;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const strengthColors: Record<1 | 2 | 3, string> = {
    1: 'bg-red-500',
    2: 'bg-amber-500',
    3: 'bg-emerald-500',
  };
  const strengthTextColors: Record<1 | 2 | 3, string> = {
    1: 'text-red-400',
    2: 'text-amber-700',
    3: 'text-emerald-700',
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f4f6fb] text-slate-900 antialiased selection:bg-amber-200/60">

      {/* ── Aurora katmanı ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-amber-400/15 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-orange-400/12 blur-[120px]" />
        <div className="absolute bottom-[-12%] left-[18%] h-[28rem] w-[28rem] rounded-full bg-amber-300/10 blur-[120px]" />
      </div>

      {/* ── SOL PANEL — Auth formu ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-10 sm:px-10">

        {/* Logo */}
        <div className="mb-6 flex w-full max-w-[420px] justify-center md:justify-start">
          <KarnetLogo size={44} />
        </div>

        {/* MFA Verification Screen */}
        {showMFA && (
          <div className={`w-full max-w-[420px] rounded-3xl p-6 sm:p-8 ${GLASS}`}>
            <MFAVerifyForm
              onSuccess={async () => {
                await completeMFA();
                router.push(returnUrl);
              }}
              onCancel={() => {
                setShowMFA(false);
                // Oturumu kapat — MFA'siz devam edemez
                const supabase = createClient();
                supabase.auth.signOut();
              }}
            />
          </div>
        )}

        {/* Email Verification Pending Screen */}
        {awaitingEmailVerification && !showMFA && (
          <div className={`w-full max-w-[420px] space-y-6 rounded-3xl p-7 text-center sm:p-8 ${GLASS}`}>
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                <Mail className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl text-slate-900">E-postanızı Doğrulayın</h2>
              <p className="text-sm leading-relaxed text-slate-500">
                <span className="font-medium text-slate-700">{email}</span> adresine bir doğrulama bağlantısı gönderdik.
                Gelen kutunuzu kontrol edin ve bağlantıya tıklayın.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white/70 p-4 text-left">
              <p className="text-xs text-slate-400">E-posta gelmedi mi?</p>
              <ul className="space-y-1 text-xs text-slate-500">
                <li>Spam/gereksiz klasörünü kontrol edin</li>
                <li>E-posta adresinin doğru olduğundan emin olun</li>
                <li>Birkaç dakika bekleyin ve tekrar deneyin</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                setAwaitingEmailVerification(false);
                switchMode('login');
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 text-sm font-medium text-slate-700 transition-all hover:bg-white"
            >
              Giriş Sayfasına Dön
            </button>
          </div>
        )}

        {showMFA || awaitingEmailVerification ? null : (<>

        {/* Form kartı */}
        <div className={`w-full max-w-[420px] rounded-3xl p-6 sm:p-8 ${GLASS}`}>

          {/* Başlık */}
          <div className="mb-6 text-center">
            <h1 className="font-display text-[26px] leading-tight tracking-tight text-slate-900">
              {mode === 'login' ? 'Tekrar hoş geldin' : 'Ücretsiz hesabını oluştur'}
            </h1>
            <p className="mt-1.5 text-[13.5px] text-slate-500">
              {mode === 'login' ? 'Mağazanın gerçek kârına devam et.' : 'Kredi kartı yok, tamamen ücretsiz.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="mb-6">
            <div className="flex rounded-xl bg-white/60 p-1 ring-1 ring-slate-900/[0.05]">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Kayıt Ol
              </button>
            </div>
          </div>

          {/* Form Content */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white/80 text-sm font-medium text-slate-700 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {googleLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Google ile devam et
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/0 px-3 text-slate-400 backdrop-blur-sm">veya</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Ad Soyad — sadece kayıt modunda */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-slate-700">Ad Soyad</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className={inputClasses}
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
              )}

              {/* E-posta */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">E-posta</label>
                <input
                  id="email"
                  type="email"
                  placeholder="ornek@sirket.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClasses}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              {/* Şifre */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">Şifre</label>
                  {mode === 'login' && (
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-amber-600 transition-colors hover:text-amber-700"
                    >
                      Şifremi unuttum
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleCapsLockCheck}
                    onKeyUp={handleCapsLockCheck}
                    required
                    minLength={mode === 'register' ? 8 : 1}
                    className={`${inputClasses} pr-10`}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Caps Lock uyarısı */}
                {capsLockOn && (
                  <p className="flex items-center gap-1 text-xs text-amber-700">
                    ⚠️ Caps Lock açık
                  </p>
                )}

                {/* Şifre güç göstergesi — sadece kayıt modunda */}
                {mode === 'register' && pwdStrength && pwdStrength.level > 0 && (
                  <div className="space-y-1 pt-0.5">
                    <div className="flex gap-1">
                      {([1, 2, 3] as const).map((n) => (
                        <div
                          key={n}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            n <= pwdStrength.level
                              ? strengthColors[pwdStrength.level as 1 | 2 | 3]
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strengthTextColors[pwdStrength.level as 1 | 2 | 3]}`}>
                      {pwdStrength.label}
                      {pwdStrength.level === 1 && ' — 8+ karakter kullanın'}
                      {pwdStrength.level === 2 && ' — büyük/küçük harf ve rakam ekleyin'}
                    </p>
                  </div>
                )}
              </div>

              {/* Şifre tekrar — sadece kayıt modunda */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Şifre Tekrar</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`${inputClasses} pr-10 ${
                        passwordsMismatch ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
                      } ${
                        passwordsMatch ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10' : ''
                      }`}
                      autoComplete="new-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      onClick={() => setShowConfirm(!showConfirm)}
                      tabIndex={-1}
                    >
                      {passwordsMatch ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <p className="text-xs text-red-500">Şifreler eşleşmiyor.</p>
                  )}
                </div>
              )}

              {/* Kullanım şartları — sadece kayıt modunda */}
              {mode === 'register' && (
                <div className="flex items-start gap-2">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-amber-600"
                  />
                  <label htmlFor="acceptTerms" className="cursor-pointer select-none text-sm leading-relaxed text-slate-500">
                    <Link href="/kullanim-sartlari" className="text-amber-600 hover:text-amber-700" target="_blank">Kullanım Şartları</Link>
                    {' '}ve{' '}
                    <Link href="/gizlilik-politikasi" className="text-amber-600 hover:text-amber-700" target="_blank">Gizlilik Politikası</Link>
                    &apos;nı okudum, kabul ediyorum.
                  </label>
                </div>
              )}

              {/* Hata mesajı */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600">
                  <HelpCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || (mode === 'register' && !acceptTerms)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {mode === 'login' ? 'Giriş Yapılıyor...' : 'Hesap Oluşturuluyor...'}
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Toggle */}
            <div className="pt-1 text-center text-sm">
              {mode === 'login' ? (
                <p className="text-slate-500">
                  Hesabın yok mu?{' '}
                  <button onClick={() => switchMode('register')} className="font-semibold text-amber-600 transition-colors hover:text-amber-700">
                    Ücretsiz Başla
                  </button>
                </p>
              ) : (
                <p className="text-slate-500">
                  Zaten üye misiniz?{' '}
                  <button onClick={() => switchMode('login')} className="font-semibold text-amber-600 transition-colors hover:text-amber-700">
                    Giriş Yap
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Mobile — dürüst ücretsiz vurgusu (sahte metrik yok) */}
        <div className="mt-6 w-full max-w-[420px] space-y-3 text-center md:hidden">
          <p className="text-sm text-slate-500">Her satışında gerçek kârını bil.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="font-medium text-emerald-600">Tamamen ücretsiz</span>
            <span className="text-slate-300">·</span>
            <span>Kredi kartı yok</span>
            <span className="text-slate-300">·</span>
            <span>AES-256</span>
          </div>
        </div>
        </>)}
      </div>

      {/* ── SAĞ PANEL — Tanıtım (masaüstü, cam) ── */}
      <div className="relative hidden w-[45%] flex-col justify-center overflow-hidden px-10 lg:flex lg:w-[50%] lg:px-16 xl:px-20">

        {/* Glow Orb */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(245,158,11,0) 70%)' }}
          animate={reduce ? undefined : { y: [0, -20, 0] }}
          transition={reduce ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 mx-auto max-w-lg space-y-9">

          {/* Ücretsiz rozeti */}
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 text-[12.5px] font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" /> %100 ücretsiz · kredi kartı yok
          </span>

          {/* Headline */}
          <div>
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.02] tracking-tight text-slate-900">
              Kârını{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">kontrol altına al</span>
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-slate-600">
              Komisyon, kargo, iade — tüm gizli maliyetleri tek ekranda gör. Veriye dayalı kararlar al.
            </p>
          </div>

          {/* Feature Cards (cam) */}
          <div className="grid gap-3.5">
            {[
              { icon: TrendingUp, title: 'Anlık Kâr Analizi', desc: 'Ürün bazlı net kâr, saniyeler içinde.' },
              { icon: TestTube2, title: 'Kampanya Simülatörü', desc: 'İndirimi uygulamadan önce test et.' },
              { icon: Plug, title: 'Pazaryeri Entegrasyonu', desc: 'Trendyol, Hepsiburada, n11, Amazon.' },
            ].map((card) => (
              <div key={card.title} className={`flex items-start gap-4 rounded-2xl p-4 ${GLASS}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dürüst değerler (sahte metrik yerine) */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '₺0', label: 'Aylık ücret' },
              { value: 'Sınırsız', label: 'Analiz' },
              { value: 'AES-256', label: 'Şifreleme' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-[22px] leading-none tracking-tight text-slate-900">{stat.value}</div>
                <div className="mt-1.5 text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Güven satırı */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Verilerin şifreli saklanır · yalnızca sen görürsün</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
