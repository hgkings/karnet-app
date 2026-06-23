'use client';

import Link from 'next/link';
import { Mail, MapPin, User, ShieldCheck } from 'lucide-react';
import { KarnetLogo } from '@/components/shared/KarnetLogo';

const PRODUCT_LINKS = [
  { href: '/demo', label: 'Demo' },
  { href: '/auth', label: 'Ücretsiz Başla' },
  { href: '/support', label: 'Destek' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
];

const GEO_LINKS = [
  { href: '/nedir', label: 'Kârnet Nedir?' },
  { href: '/sss', label: 'SSS' },
  { href: '/trendyol-kar-hesaplama', label: 'Trendyol Kâr Hesaplama' },
  { href: '/hepsiburada-kar-hesaplama', label: 'Hepsiburada Kâr Hesaplama' },
  { href: '/n11-kar-hesaplama', label: 'N11 Kâr Hesaplama' },
  { href: '/amazon-turkiye-kar-hesaplama', label: 'Amazon TR Kâr Hesaplama' },
  { href: '/pazaryeri-kar-karsilastirma', label: 'Pazaryeri Karşılaştırma' },
  { href: '/karnet-vs-excel', label: 'Kârnet vs Excel' },
  { href: '/blog', label: 'Blog' },
];

const LEGAL_LINKS = [
  { href: '/gizlilik-politikasi', label: 'Gizlilik Politikası' },
  { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
  { href: '/mesafeli-satis-sozlesmesi', label: 'Mesafeli Satış' },
  { href: '/iade-politikasi', label: 'İade Politikası' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <KarnetLogo size={32} className="mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pazaryeri satıcılarının gerçek kârını görmesini sağlayan analiz platformu.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Tamamen ücretsiz · Kart bilgisi istemez</span>
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
                <Mail className="h-4 w-4 shrink-0 text-amber-500/70" />
                <a href="mailto:karnet.destek@gmail.com" className="hover:text-foreground transition-colors">
                  karnet.destek@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-amber-500/70 mt-0.5" />
                <span className="leading-relaxed">
                  Konya, Türkiye
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <User className="h-4 w-4 shrink-0 text-amber-500/70" />
                <span>Süleyman Hilmi İşbilir</span>
              </li>
            </ul>
          </div>
        </div>

        {/* GEO / Kaynaklar */}
        <div className="mt-10 pt-8 border-t border-border/30">
          <h4 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-4">Kaynaklar</h4>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {GEO_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Kârnet · Tamamen ücretsiz · Veriler satılmaz
          </p>
          <p className="text-xs text-muted-foreground/60">
            Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
