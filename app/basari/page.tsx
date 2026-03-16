'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function BasariContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const paymentId = searchParams.get('paymentId'); // legacy fallback
    const [status, setStatus] = useState<'checking' | 'active' | 'pending' | 'expired' | 'error'>('checking');
    const [pollCount, setPollCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    const verify = async (): Promise<{ success: boolean; expired?: boolean; error?: string }> => {
        try {
            let url = '/api/verify-payment';
            if (token) {
                url += `?token=${encodeURIComponent(token)}`;
            } else if (paymentId) {
                url += `?paymentId=${paymentId}`;
            } else {
                return { success: false, error: 'Ödeme bilgisi bulunamadı' };
            }

            const res = await fetch(url);
            const data = await res.json();

            if (res.status === 410) return { success: false, expired: true, error: data.error };
            if (!res.ok) return { success: false, error: data.error };
            return { success: data.success === true };
        } catch {
            return { success: false };
        }
    };

    useEffect(() => {
        let attempt = 0;
        const maxAttempts = 36; // 3 minutes max (36 × 5s)
        let timeoutId: NodeJS.Timeout;

        const poll = async () => {
            attempt++;
            setPollCount(attempt);

            const result = await verify();

            if (result.success) {
                setStatus('active');
                return;
            }

            if (result.expired) {
                setStatus('expired');
                setErrorMsg(result.error || 'Oturum süresi doldu');
                return;
            }

            if (attempt < maxAttempts) {
                timeoutId = setTimeout(poll, 5000);
            } else {
                setStatus('pending');
            }
        };

        timeoutId = setTimeout(poll, 2000);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, paymentId]);

    const handleRetry = async () => {
        setStatus('checking');
        setPollCount(0);
        const result = await verify();
        if (result.success) {
            setStatus('active');
        } else if (result.expired) {
            setStatus('expired');
            setErrorMsg(result.error || 'Oturum süresi doldu');
        } else {
            setStatus('pending');
        }
    };

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

                {status === 'expired' && (
                    <>
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                        <h1 className="text-2xl font-bold text-red-600">Oturum Süresi Doldu</h1>
                        <p className="text-muted-foreground">
                            {errorMsg || 'Ödeme oturumu 15 dakikadan uzun süre açık kaldı.'}<br /><br />
                            Ödemenizi tamamladıysanız admin ekibimizle iletişime geçin. Aksi hâlde yeniden ödeme başlatabilirsiniz.
                        </p>
                        <div className="flex gap-3 justify-center mt-4">
                            <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                                Tekrar Dene
                            </Button>
                            <Button onClick={() => window.location.href = '/dashboard'}>
                                Dashboard
                            </Button>
                        </div>
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
                            <Button variant="outline" onClick={handleRetry}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Tekrar Kontrol Et
                            </Button>
                            <Button onClick={() => window.location.href = '/dashboard'}>
                                Dashboard&apos;a Git
                            </Button>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                        <h1 className="text-2xl font-bold text-red-600">Bir Hata Oluştu</h1>
                        <p className="text-muted-foreground">{errorMsg}</p>
                        <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                            Geri Dön
                        </Button>
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
