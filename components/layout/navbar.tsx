'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { TrendingUp, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Kar Kocu
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Panel</Button>
              </Link>
              <Link href="/analysis/new">
                <Button variant="ghost" size="sm">Yeni Analiz</Button>
              </Link>
              <Link href="/products">
                <Button variant="ghost" size="sm">Urunler</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">Fiyatlandirma</Button>
              </Link>
              <Link href="/account">
                <Button variant="ghost" size="sm">Hesap</Button>
              </Link>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={logout}>
                Cikis
              </Button>
            </>
          ) : (
            <>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">Fiyatlandirma</Button>
              </Link>
              <ThemeToggle />
              <Link href="/auth">
                <Button size="sm">Giris Yap</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Panel</Button>
                </Link>
                <Link href="/analysis/new" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Yeni Analiz</Button>
                </Link>
                <Link href="/products" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Urunler</Button>
                </Link>
                <Link href="/pricing" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Fiyatlandirma</Button>
                </Link>
                <Link href="/account" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Hesap</Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={() => { logout(); setMobileOpen(false); }}>
                  Cikis
                </Button>
              </>
            ) : (
              <>
                <Link href="/pricing" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Fiyatlandirma</Button>
                </Link>
                <Link href="/auth" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Giris Yap</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
