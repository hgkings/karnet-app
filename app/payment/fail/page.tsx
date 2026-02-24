'use client';

import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 max-w-md px-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold">Ödeme Başarısız</h1>
                <p className="text-muted-foreground">
                    Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
                </p>
                <div className="flex flex-col gap-3">
                    <Button asChild className="w-full rounded-xl h-12">
                        <Link href="/pricing">Tekrar Dene</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full rounded-xl h-12">
                        <Link href="/dashboard">Panele Dön</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
