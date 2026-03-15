'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';

function BasariContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('paymentId');
    const [status, setStatus] = useState<'checking' | 'active' | 'pending'>('checking');
    const [pollCount, setPollCount] = useState(0);

    const verify = async (): Promise<boolean> => {
        if (!paymentId) return false;
        try {
            const res = await fetch(`/api/verify-payment?paymentId=${paymentId}`);
            if (!res.ok) return false;
            const data = await res.json();
            return data.success === true;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        let attempt = 0;
        const maxAttempts = 60;
        let timeoutId: NodeJS.Timeout;

        const poll = async () => {
            attempt++;
            setPollCount(attempt);

            const success = await verify();
            if (success) {
                setStatus('active');
                return;
            }

            if (attempt < maxAttempts) {
                timeoutId = setTimeout(poll, 5000);
            } else {
                setStatus('pending');
            }
        };

        timeoutId = setTimeout(poll, 3000);
        return () => clearTimeout(timeoutId);
    }, [paymentId]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="mx-auto max-w-lg px-4 py-24 text-center space-y-6">

                {status === 'checking' && (
                    <>
                        <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                        <h1 className="text-2xl font-bold">Ödemeniz Doğrulanıyor...</h1>
                        <p className="text-muted-foreground">
                            Ödeme sayfasında işleminizi tamamladıysanız lütfen bekleyin.<br /><br />
                            Ödemeniz onaylandığında bu sayfa <b>otomatik</b> olarak güncellenecektir.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Kontrol ediliyor... ({pollCount})
                        </p>
                    </>
                )}

                {status === 'active' && (
                    <>
                        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                        <h1 className="text-2xl font-bold text-emerald-600">🎉 Pro Planınız Aktif!</h1>
                        <p className="text-muted-foreground">
                            Pro planınız başarıyla aktif edildi. Tüm özelliklere erişebilirsiniz.
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            Dashboard&apos;a Git
                        </Button>
                    </>
                )}

                {status === 'pending' && (
                    <>
                        <Loader2 className="h-16 w-16 text-amber-500 mx-auto" />
                        <h1 className="text-2xl font-bold text-amber-600">Ödeme Bekleniyor ⏳</h1>
                        <p className="text-muted-foreground">
                            Ödeme işleminiz henüz onaylanmadı. Ödemeyi tamamladıysanız biraz bekleyip tekrar kontrol edebilirsiniz.
                        </p>
                        <div className="flex gap-3 justify-center mt-4">
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    setStatus('checking');
                                    setPollCount(0);
                                    const success = await verify();
                                    setStatus(success ? 'active' : 'pending');
                                }}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Tekrar Kontrol Et
                            </Button>
                            <Button onClick={() => window.location.href = '/dashboard'}>
                                Dashboard&apos;a Git
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function BasariPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <BasariContent />
        </Suspense>
    );
}
