'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Özellikler' },
    { href: '#how-it-works', label: 'Nasıl Çalışır?' },
    { href: '/pricing', label: 'Fiyatlandırma' },
    { href: '/demo', label: 'Demo' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[hsl(222,47%,4%)]/80 backdrop-blur-xl border-b border-white/5 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/brand/logo.svg" alt="Kârnet" width="130" height="36" className="h-8 w-auto dark:hidden" />
          <img src="/brand/logo-dark.svg" alt="Kârnet" width="130" height="36" className="h-8 w-auto hidden dark:block" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-all duration-150 animated-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard">
              <Button
                size="sm"
                className="h-9 px-4 rounded-lg font-medium btn-shine shadow-sm"
              >
                Panele Git →
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg font-medium">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" className="h-9 px-4 rounded-lg font-medium btn-shine shadow-sm">
                  Ücretsiz Başla
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background">
              <SheetHeader className="text-left pb-2">
                <img src="/brand/logo.svg" alt="Kârnet" className="h-7 w-auto dark:hidden" />
                <img src="/brand/logo-dark.svg" alt="Kârnet" className="h-7 w-auto hidden dark:block" />
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-3 border-t border-border/50" />
                {user ? (
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-lg btn-shine">Panele Git →</Button>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/auth" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full rounded-lg">Giriş Yap</Button>
                    </Link>
                    <Link href="/auth" onClick={() => setOpen(false)}>
                      <Button className="w-full rounded-lg btn-shine">Ücretsiz Başla</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
