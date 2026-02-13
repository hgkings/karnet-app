'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  CreditCard,
  User,
  Crown,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/analysis/new', label: 'Yeni Analiz', icon: PlusCircle },
  { href: '/products', label: 'Urunler', icon: Package },
  { href: '/pricing', label: 'Fiyatlandirma', icon: CreditCard },
  { href: '/account', label: 'Hesap', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="mb-4 px-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {user?.plan === 'free' && (
          <div className="mt-auto rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Crown className="h-4 w-4 text-primary" />
              Pro&apos;ya Yukselt
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Sinirsiz urun, gelismis analitik ve daha fazlasi.
            </p>
            <Link
              href="/pricing"
              className="mt-3 block rounded-lg bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Planlari Gor
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
