'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Shield,
  BarChart3,
  ArrowRight,
  Calculator,
  Zap,
  Target,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'Gercek Kar Hesaplama',
    desc: 'Komisyon, KDV, iade, reklam, kargo dahil tum giderleri hesaplayarak gercek net karinizi gorun.',
  },
  {
    icon: Shield,
    title: 'Risk Analizi',
    desc: 'Urun bazinda risk puani ve detayli risk faktorleri ile zarardan kacinmaniza yardimci olur.',
  },
  {
    icon: BarChart3,
    title: 'Hassasiyet Analizi',
    desc: 'Fiyat, komisyon ve reklam maliyetindeki degisikliklerin kariniza etkisini simule edin.',
  },
  {
    icon: Target,
    title: 'Pazaryeri Karsilastirma',
    desc: 'Ayni urunu farkli pazaryerlerinde karsilastirarak en karli platformu belirleyin.',
  },
];

const marketplaces = ['Trendyol', 'Hepsiburada', 'n11', 'Amazon TR'];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">Turkiye&apos;nin pazaryeri kar hesaplayicisi</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Pazaryerinde gercekten{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                kar ediyor musun?
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Komisyon, KDV, iade kaybi, reklam maliyeti ve kargo dahil tum giderlerini hesapla.
              Gercek net karini gor, risk seviyeni ogren, stratejik kararlar al.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href={user ? '/analysis/new' : '/auth'}>
                <Button size="lg" className="gap-2 px-8 text-base">
                  Ucretsiz Basla
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="px-8 text-base">
                  Fiyatlandirma
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {marketplaces.map((mp) => (
                <span key={mp} className="text-sm font-medium text-muted-foreground">
                  {mp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Neden Kar Kocu?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pazaryeri satisinda gizli kalan tum maliyetleri ortaya cikarir, karinizi ve riskinizi net olarak gosterir.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Nasil Calisir?
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            { step: '1', title: 'Urun Bilgilerini Gir', desc: 'Pazaryeri, fiyat, maliyet ve diger gider bilgilerini girin.' },
            { step: '2', title: 'Analiz Et', desc: 'Sistem tum maliyetleri hesaplayarak gercek karinizi ve risk seviyenizi belirler.' },
            { step: '3', title: 'Karar Ver', desc: 'Detayli rapor ve onerilere dayanarak stratejik kararlar alin.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Hesaplama neleri iceriyor?
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Pazaryeri komisyonu',
              'KDV hesaplamasi',
              'Iade kaybi tahmini',
              'Reklam maliyeti',
              'Kargo ucreti',
              'Paketleme maliyeti',
              'Diger giderler',
              'Basabas fiyati',
              'Nakit akisi tahmini',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-12 text-center sm:p-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Hemen baslayin
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ucretsiz plan ile 5 urune kadar analiz yapin. Pro ile sinirsiz erisim.
          </p>
          <div className="mt-8">
            <Link href={user ? '/analysis/new' : '/auth'}>
              <Button size="lg" className="gap-2 px-10 text-base">
                <TrendingUp className="h-5 w-5" />
                Simdi Basla
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Kar Kocu</span>
          </div>
          <p className="text-xs text-muted-foreground">
            2024 PazarYeri Kar Kocu. Tum haklar saklidir.
          </p>
        </div>
      </footer>
    </div>
  );
}
