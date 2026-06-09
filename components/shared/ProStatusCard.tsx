'use client';

import { Sparkles, Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

/**
 * Kârnet tamamen ücretsiz olduğu için bu kart artık plan/abonelik
 * göstermez. Tüm kullanıcılara "tüm özellikler ücretsiz ve sınırsız"
 * mesajını verir.
 */
export function ProStatusCard() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="relative w-full rounded-2xl border border-emerald-600/30 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-500/20 ring-2 ring-emerald-200 dark:ring-emerald-500/20 shadow-inner">
                        <Sparkles className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 leading-none">
                            Tüm Özellikler Ücretsiz
                        </span>
                        <div className="flex items-center gap-1 mt-1.5">
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">
                                Sınırsız
                            </span>
                        </div>
                    </div>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <button className="text-emerald-500/60 dark:text-emerald-400/50 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors focus:outline-none">
                            <Info className="w-4 h-4" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-3 text-xs" align="end" side="right" sideOffset={8}>
                        <p className="font-semibold mb-1">Ücretsiz Erişim</p>
                        <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                            <li>Sınırsız ürün analizi</li>
                            <li>Pazaryeri entegrasyonları</li>
                            <li>Toplu CSV / PDF işlemleri</li>
                            <li>Tüm gelişmiş analizler</li>
                        </ul>
                    </PopoverContent>
                </Popover>
            </div>

            <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                Kârnet&apos;in tüm özellikleri ücretsiz ve sınırsızdır. Ödeme veya kart bilgisi gerekmez.
            </p>
        </div>
    );
}
