'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const RESEND_COOLDOWN = 60;

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setResendLoading(true);
    setResendError('');
    setResendSuccess(false);

    const { error } = await supabase.auth.resend({ type: 'signup', email });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('rate limit') || msg.includes('too many')) {
        setResendError('Çok fazla istek. Lütfen birkaç dakika bekleyin.');
      } else {
        setResendError('E-posta gönderilemedi. Lütfen tekrar deneyin.');
      }
    } else {
      setResendSuccess(true);
      setCountdown(RESEND_COOLDOWN);
    }

    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(221 83% 53% / 0.06), transparent 60%), hsl(0 0% 99%)',
      }}
    >
      <div className="w-full max-w-[420px] space-y-6">
        {/* Logo */}
        <div className="text-center">
          <img src="/brand/logo.svg" alt="Kârnet" className="h-8 w-auto mx-auto dark:hidden" />
          <img src="/brand/logo-dark.svg" alt="Kârnet" className="h-8 w-auto mx-auto hidden dark:block" />
        </div>

        <div
          className="rounded-2xl bg-card p-8 space-y-6 text-center"
          style={{
            boxShadow: '0 20px 60px hsl(221 83% 53% / 0.08)',
            border: '1px solid hsl(221 83% 53% / 0.1)',
          }}
        >
          {/* Zarf ikonu */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Başlık & açıklama */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight font-geist">E-postanızı Doğrulayın</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {email ? (
                <>
                  <span className="font-medium text-foreground">{email}</span> adresine doğrulama
                  linki gönderdik. Linke tıklayarak hesabınızı aktifleştirin.
                </>
              ) : (
                'Kayıt sırasında verdiğiniz e-posta adresine doğrulama linki gönderdik.'
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Gelen kutunuzda göremiyorsanız spam klasörünü kontrol edin.
            </p>
          </div>

          {/* Tekrar gönder */}
          <div className="space-y-3">
            {resendSuccess && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Doğrulama e-postası tekrar gönderildi.
              </p>
            )}
            {resendError && (
              <p className="text-sm text-red-600 dark:text-red-400">{resendError}</p>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl gap-2"
              onClick={handleResend}
              disabled={resendLoading || countdown > 0}
            >
              {resendLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Gönderiliyor...
                </>
              ) : countdown > 0 ? (
                `Tekrar gönder (${countdown}s)`
              ) : (
                'Tekrar Gönder'
              )}
            </Button>
          </div>

          {/* Alt linkler */}
          <div className="pt-2 border-t border-border/50 space-y-2">
            <Link
              href="/auth"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Farklı e-posta ile kayıt ol
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
