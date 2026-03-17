'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  Crown, FileText, Upload, CreditCard, ArrowRight, Shield, Store,
} from 'lucide-react';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/config/navigation';
import { isProUser } from '@/utils/access';
import { ProStatusCard } from '@/components/ProStatusCard';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isPro = isProUser(user);

  return (
    <aside className="flex h-full w-full flex-col bg-card border-r border-border/50 overflow-y-auto scrollbar-thin">
      <div className="flex h-full flex-col px-3 py-5 gap-6">

        {/* Pro Status */}
        <div className="w-full">
          <ProStatusCard />
        </div>

        {/* Main Nav */}
        <div>
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Menü
          </p>
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const isLocked = (item as any).restricted && !isPro;

              if (isLocked) {
                return (
                  <div key={item.href} className="group relative">
                    <div className="absolute right-2.5 top-2.5 z-10 pointer-events-none">
                      <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 p-0.5 rounded-full">
                        <Crown className="h-2.5 w-2.5" />
                      </div>
                    </div>
                    <Link
                      href="/pricing"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/50 hover:bg-muted/40 transition-all duration-150"
                    >
                      <item.icon className="h-4 w-4 shrink-0 opacity-50" />
                      <span className="opacity-60">{item.label}</span>
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary pl-[10px]'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-2 border-transparent pl-[10px]'
                  )}
                >
                  <item.icon className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-150',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Hızlı İşlemler
          </p>
          <div className="flex flex-col gap-0.5">
            {[
              { href: '/dashboard', icon: FileText, label: 'PDF Rapor' },
              { href: '/products', icon: Upload, label: 'CSV İçe Aktar' },
              { href: '/settings/commission-rates', icon: Store, label: 'Komisyon Oranları' },
              { href: '/pricing', icon: CreditCard, label: 'Fiyatlandırma' },
            ].map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-150 pl-[10px]"
              >
                <div className="p-1 rounded-md bg-muted/60 group-hover:bg-background border border-transparent group-hover:border-border/50 transition-all">
                  <action.icon className="h-3 w-3" />
                </div>
                <span>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Nav */}
        <div>
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Hesap
          </p>
          <div className="flex flex-col gap-0.5">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const isPremium = item.label === 'Premium';

              if (isPremium) {
                if (isPro) return null;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative block overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-blue-500/5 px-3 py-2.5 text-sm font-semibold text-primary hover:from-primary/15 hover:to-blue-500/10 transition-all duration-200 border border-primary/20 mb-1 pl-[10px]"
                  >
                    <div className="flex items-center gap-3">
                      <Crown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                      <span>Pro&apos;ya Katıl</span>
                      <ArrowRight className="h-3 w-3 ml-auto opacity-60" />
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary pl-[10px]'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-2 border-transparent pl-[10px]'
                  )}
                >
                  <item.icon className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-150',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Admin */}
        {user?.plan === 'admin' && (
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all pl-[10px] border-l-2 border-transparent"
          >
            <Shield className="h-4 w-4" />
            Admin Panel
          </Link>
        )}

        {/* Version */}
        <div className="text-[9px] text-muted-foreground/25 font-mono text-center pb-1">
          v{process.env.NEXT_PUBLIC_BUILD_ID || '1.0.0'}
        </div>

      </div>
    </aside>
  );
}
