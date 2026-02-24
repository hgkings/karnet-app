'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  User,
  Crown,
  Settings,
  Box,
  FileText,
  Upload,
  CreditCard,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Target,
  Landmark
} from 'lucide-react';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/config/navigation';
import { getSidebarStats } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { isProUser } from '@/utils/access';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [stats, setStats] = useState<{ total: number; profitable: number; risky: number; lastUpdated: string | null }>({ total: 0, profitable: 0, risky: 0, lastUpdated: null });
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    if (user?.id) {
      getSidebarStats(user.id).then(data => {
        setStats(data);
        if (data.lastUpdated) {
          setDateStr(new Date(data.lastUpdated).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }));
        } else {
          setDateStr('-');
        }
      });
    }
  }, [user?.id]);

  const isPro = isProUser(user);

  return (
    <aside className="flex h-full w-full flex-col bg-card border-r overflow-y-auto scrollbar-thin scrollbar-thumb-muted/50">
      <div className="flex h-full flex-col px-3 py-4 space-y-6">

        {/* --- 1. Mini Summary Card (Premium Look) --- */}
        {user && (
          <Link href="/analysis/new" className="block rounded-xl border border-primary/10 bg-gradient-to-br from-primary/[0.04] via-zinc-900/[0.02] to-transparent dark:from-primary/[0.08] dark:via-zinc-900/[0.2] p-3.5 shadow-sm relative overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all">
            {/* Glow Effect */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 blur-[30px] rounded-full group-hover:bg-primary/20 transition-colors" />

            {/* Row 1: Badge */}
            <div className="relative z-10 mb-3">
              <div className={cn(
                "flex w-full justify-center items-center gap-1.5 px-2 py-1 rounded-lg border shadow-sm",
                isPro
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-muted text-muted-foreground border-border/50"
              )}>
                {isPro && <Crown className="h-3.5 w-3.5 fill-current shrink-0" />}
                <span className="text-[11px] font-bold uppercase tracking-wide whitespace-nowrap leading-none">
                  {isPro ? 'Pro Aktif' : 'Ücretsiz'}
                </span>
              </div>
            </div>

            {/* Row 2: Stats Display */}
            <div className="flex flex-col gap-0.5 relative z-10 mt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-sm">{stats.total}</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Analiz</span>
              </div>

              <div className="flex items-center gap-1.5 mt-0.5">
                {stats.profitable > 0 ? (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-500 tracking-wide">{stats.profitable} Kârlı</span>
                  </>
                ) : (
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wide">Henüz kâr yok</span>
                )}
              </div>
            </div>

            {/* Subtle Action Hint */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-1 group-hover:translate-x-0">
              <PlusCircle className="h-5 w-5 text-primary/50 dark:text-primary/70" />
            </div>
          </Link>
        )}

        {/* --- Main Navigation --- */}
        <div>
          <div className="mb-2 px-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Menü
            </p>
          </div>
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const isProducts = item.href === '/products';
              const isLocked = (item as any).restricted && !isPro;

              if (isLocked) {
                return (
                  <div key={item.href} className="group relative">
                    <div className="absolute right-2 top-2.5 z-10 pointer-events-none">
                      <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 p-0.5 rounded-full">
                        <Crown className="h-3 w-3" />
                      </div>
                    </div>
                    <Link
                      href="/pricing"
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-muted-foreground/60 hover:bg-muted/50 cursor-pointer',
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0 opacity-70" />
                      <div className="flex-1 opacity-70">
                        {item.label}
                      </div>
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />

                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {isProducts && stats.total > 0 && (
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded",
                        isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {stats.total}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* --- 2. Quick Actions --- */}
        <div>
          <div className="mb-2 px-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Hızlı İşlemler
            </p>
          </div>
          <div className="grid gap-1">
            {/* PDF Report: Smart redirect to dashboard if not on analysis page */}
            <Link href={pathname.includes('/analysis/') ? '#' : '/dashboard'}
              onClick={(e) => {
                // If on analysis page, let the user click the actual button on page (passive link)
                // If not, redirect to dashboard.
                if (pathname.includes('/analysis/') && pathname !== '/analysis/new') {
                  e.preventDefault();
                  // Just a visual cue or toast could happen here, but we keep it simple.
                  // The user is already on the page where the big "PDF Indir" button exists.
                }
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all group"
            >
              <div className="p-1.5 rounded-md bg-muted group-hover:bg-background border border-transparent group-hover:border-border transition-colors">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <span>PDF Rapor</span>
              {/* Visual hint if on analysis page */}
              {pathname.includes('/analysis/') && pathname !== '/analysis/new' && (
                <ArrowRight className="h-3 w-3 ml-auto opacity-50" />
              )}
            </Link>

            <Link href="/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all group">
              <div className="p-1.5 rounded-md bg-muted group-hover:bg-background border border-transparent group-hover:border-border transition-colors">
                <Upload className="h-3.5 w-3.5" />
              </div>
              <span>CSV İçe Aktar</span>
            </Link>

            <Link href="/pricing" className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all group">
              <div className="p-1.5 rounded-md bg-muted group-hover:bg-background border border-transparent group-hover:border-border transition-colors">
                <CreditCard className="h-3.5 w-3.5" />
              </div>
              <span>Fiyatlandırma</span>
            </Link>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* --- 3. Status Footer --- */}
        <div className="px-1 py-3 border-t border-dashed">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3 opacity-70" />
              <span className="font-medium">Son Güncelleme:</span>
              <span>{dateStr || '...'}</span>
            </div>
            {stats.risky > 0 && (
              <div className="flex items-center gap-2 text-[10px] text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                <span className="font-medium">Riskli Ürün:</span>
                <span className="font-bold">{stats.risky}</span>
              </div>
            )}
            {stats.risky === 0 && (
              <div className="flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400">
                <Box className="h-3 w-3" />
                <span className="font-medium">Tüm Ürünler Güvenli</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="space-y-1">
          <div className="mb-2 px-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Hesap
            </p>
          </div>

          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isPremium = item.label === 'Premium';

            if (isPremium) {
              if (isPro) {
                return (
                  <div key={item.href} className="px-1 py-1 mb-1">
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 px-3 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm overflow-hidden">
                      <Crown className="h-4 w-4 fill-current shrink-0" />
                      <span className="truncate whitespace-nowrap">Pro Plan Aktif</span>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative block overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:shadow-premium-sm border border-primary/20 mb-1"
                >
                  <div className="flex items-center gap-3 text-primary">
                    <Crown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    <span className="font-semibold">Pro&apos;ya Katıl</span>
                  </div>
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className={cn(
                  "h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Version */}
        <div className="text-[9px] text-muted-foreground/30 font-mono text-center">
          v{process.env.NEXT_PUBLIC_BUILD_ID || '1.0.0'}
        </div>

      </div>
    </aside>
  );
}
