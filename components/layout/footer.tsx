'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, User, ShieldCheck } from 'lucide-react';

const PRODUCT_LINKS = [
  { href: '/pricing', label: 'Fiyatlandırma' },
  { href: '/demo', label: 'Demo' },
  { href: '/auth', label: 'Giriş Yap' },
  { href: '/support', label: 'Destek' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
];

const LEGAL_LINKS = [
  { href: '/gizlilik-politikasi', label: 'Gizlilik Politikası' },
  { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
  { href: '/mesafeli-satis-sozlesmesi', label: 'Mesafeli Satış' },
  { href: '/iade-politikasi', label: 'İade Politikası' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <img src="/brand/logo.svg" alt="Kârnet" className="h-8 w-auto dark:hidden mb-3" />
              <img src="/brand/logo-dark.svg" alt="Kârnet" className="h-8 w-auto hidden dark:block mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pazaryeri satıcılarının gerçek kârını görmesini sağlayan analiz platformu.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>PayTR güvencesiyle ödeme</span>
            </div>
          </div>

          {/* Ürün */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Ürün</h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors animated-underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Yasal</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors animated-underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary/70" />
                <a href="mailto:karnet.destek@gmail.com" className="hover:text-foreground transition-colors">
                  karnet.destek@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary/70" />
                <span>+90 543 382 45 21</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary/70 mt-0.5" />
                <span className="leading-relaxed">
                  Konya Seydişehir, Türkiye
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <User className="h-4 w-4 shrink-0 text-primary/70" />
                <span>Süleyman Hilmi İşbilir</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kârnet · PayTR güvencesiyle · Veriler satılmaz
          </p>
          <p className="text-xs text-muted-foreground">
            Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
