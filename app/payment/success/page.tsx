'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
    const { refreshUser, user } = useAuth();
    const router = useRouter();
    const [activated, setActivated] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 10;

        const poll = setInterval(async () => {
            attempts++;
            await refreshUser();

            // Check if plan was activated (context will update)
            if (attempts >= maxAttempts) {
                clearInterval(poll);
                setActivated(true);
            }
        }, 2000);

        return () => clearInterval(poll);
    }, [refreshUser]);

    // Watch for user plan change
    useEffect(() => {
        if (user?.plan === 'pro') {
            setActivated(true);
        }
    }, [user]);

    // Countdown redirect after activation
    useEffect(() => {
        if (!activated) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/dashboard');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [activated, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 max-w-md px-6">
                {activated ? (
                    <>
                        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h1 className="text-2xl font-bold">Ödeme Başarılı! 🎉</h1>
                        <p className="text-muted-foreground">
                            Hesabınız Pro plana yükseltildi. Tüm premium özelliklere erişebilirsiniz.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {countdown} saniye içinde panele yönlendirileceksiniz…
                        </p>
                    </>
                ) : (
                    <>
                        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                        <h1 className="text-2xl font-bold">Ödeme Alındı</h1>
                        <p className="text-muted-foreground">
                            Hesabınız Pro&apos;ya geçiriliyor, lütfen bekleyin…
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
