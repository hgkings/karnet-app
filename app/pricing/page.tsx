'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import {
  Check, X, Crown, Sparkles, Loader2, RefreshCw,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLAN_LIMITS } from '@/config/plans';
import { PRICING } from '@/config/pricing';
import { isProUser } from '@/utils/access';
import { toast } from 'sonner';

// ─── types ───────────────────────────────────────────────────────────────────
type BillingCycle = 'monthly' | 'yearly';

// ─── constants ───────────────────────────────────────────────────────────────
const FREE_LIMIT = PLAN_LIMITS.free.maxProducts;
const MONTHLY_PRICE = PRICING.proMonthly;          // 229
const YEARLY_PRICE  = PRICING.proYearly;           // 2290
const YEARLY_MONTHLY_EQUIV = Math.round(YEARLY_PRICE / 12); // ~191
const SAVINGS = MONTHLY_PRICE * 12 - YEARLY_PRICE; // 458

const COMPARISON_ROWS: { label: string; free: string | boolean; pro: string | boolean }[] = [
  { label: 'Ürün analizi',                      free: `${FREE_LIMIT} ürün`,  pro: 'Sınırsız' },
  { label: 'Temel kâr hesaplama',               free: true,    pro: true    },
  { label: 'PRO Muhasebe Modu (KDV ayrıştırma)', free: false,  pro: true    },
  { label: 'Hassasiyet analizi',                free: false,   pro: true    },
  { label: 'Pazaryeri karşılaştırması',         free: false,   pro: true    },
  { label: 'Nakit akışı tahmini',               free: false,   pro: true    },
  { label: 'CSV içe aktarma',                   free: false,   pro: true    },
  { label: 'CSV & rapor dışa aktarma',          free: false,   pro: true    },
  { label: 'Trendyol API entegrasyonu',         free: false,   pro: true    },
  { label: 'Hepsiburada API entegrasyonu',      free: false,   pro: true    },
  { label: 'PDF rapor',                         free: '1/ay',  pro: 'Sınırsız' },
  { label: 'Öncelikli e-posta desteği',         free: false,   pro: true    },
  { label: 'Yeni özellikler erken erişim',      free: false,   pro: true    },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Ücretsiz plandan Pro\'ya geçince verilerim kalır mı?',
    a: 'Evet, tüm analizleriniz ve verileriniz eksiksiz korunur. Plan yükseltmesi mevcut verilerinizi hiçbir şekilde etkilemez.',
  },
  {
    q: 'İptal etmek için ne yapmalıyım?',
    a: 'İstediğiniz zaman ayarlar sayfasından aboneliğinizi iptal edebilirsiniz. İptal sonrası dönem sonuna kadar Pro özelliklerini kullanmaya devam edersiniz.',
  },
  {
    q: 'Ödeme güvenli mi?',
    a: 'Ödemeler PayTR güvencesiyle gerçekleştirilir. Kart bilgileriniz Kârnet sunucularında saklanmaz; doğrudan PayTR\'ın PCI-DSS sertifikalı altyapısında işlenir.',
  },
  {
    q: 'Yıllık planı aylığa çevirebilir miyim?',
    a: 'Evet, mevcut dönem sonunda plan tipinizi değiştirebilirsiniz. Ayarlar sayfasından plan yönetimine ulaşabilirsiniz.',
  },
  {
    q: '7 gün iade garantisi nasıl çalışır?',
    a: 'Satın alma tarihinden itibaren 7 gün içinde, herhangi bir gerekçe göstermeksizin destek ekibimizden tam iade talep edebilirsiniz.',
  },
];

// ─── sub-components ───────────────────────────────────────────────────────────

function FeatureRow({ text, included, highlight = false }: { text: string; included: boolean; highlight?: boolean }) {
  return (
    <div className={cn('flex items-start gap-3', !included && 'opacity-40')}>
      <div className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5',
        included
          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
          : 'bg-muted text-muted-foreground',
      )}>
        {included ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      </div>
      <span className={cn(
        'text-sm leading-6',
        included && highlight ? 'font-medium text-foreground' : 'text-muted-foreground',
      )}>
        {text}
      </span>
    </div>
  );
}

function CellValue({ val }: { val: string | boolean }) {
  if (val === true)  return <Check className="h-5 w-5 text-emerald-500 mx-auto" />;
  if (val === false) return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  return <span className="text-sm font-medium">{val}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-primary transition-colors"
      >
        <span className="font-medium text-sm sm:text-base">{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
      )}
    </div>
  );
}

// ─── inner page (uses useSearchParams — wrapped in Suspense below) ────────────

function PricingContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState<BillingCycle>(
    searchParams.get('billing') === 'yearly' ? 'yearly' : 'monthly',
  );
  const [loading, setLoading] = useState(false);

  const isAnnual = billing === 'yearly';
  const paymentStatus = searchParams.get('payment'); // 'success' | 'fail' | null
  const [pollState, setPollState] = useState<'idle' | 'polling' | 'active' | 'pending'>('idle');
  const [pollCount, setPollCount] = useState(0);

  const refreshProfile = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/user/profile', { credentials: 'same-origin', cache: 'no-store' });
      if (!res.ok) return false;
      const data = await res.json();
      const plan = data?.plan || data?.profile?.plan || '';
      return plan === 'pro' || plan.startsWith('pro_');
    } catch {
      return false;
    }
  }, []);

  // Poll for Pro activation after successful payment
  useEffect(() => {
    if (paymentStatus !== 'success' || !user) return;
    if (pollState !== 'idle') return;
    if (isProUser(user)) { setPollState('active'); toast.success('Pro planınız zaten aktif!'); return; }

    setPollState('polling');
    toast.success('Ödeme başarılı ✅ Planınız kontrol ediliyor...');
    let attempt = 0;
    const poll = async () => {
      attempt++;
      setPollCount(attempt);
      const isPro = await refreshProfile();
      if (isPro) {
        setPollState('active');
        toast.success('Pro planınız aktif edildi!');
        setTimeout(() => window.location.href = '/pricing', 1500);
        return;
      }
      if (attempt < 6) setTimeout(poll, 5000);
      else setPollState('pending');
    };
    setTimeout(poll, 3000);
  }, [paymentStatus, user, pollState, refreshProfile]);

  useEffect(() => {
    if (paymentStatus === 'fail') toast.error('Ödeme başarısız ❌ Tekrar deneyebilirsiniz.');
  }, [paymentStatus]);

  const handleUpgrade = async () => {
    if (!user) { window.location.href = '/auth'; return; }
    setLoading(true);
    try {
      const selectedPlan = isAnnual ? 'pro_yearly' : 'pro_monthly';
      const res = await fetch('/api/paytr/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        const params = new URLSearchParams({ paymentId: data.paymentId });
        if (data.token) params.set('token', data.token);
        window.location.href = `/basari?${params.toString()}`;
      } else {
        toast.error(data.error || 'Ödeme başlatılamadı.');
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 space-y-24">

        {/* ─ Payment Return Banners ─────────────────────────────────────────── */}
        {paymentStatus === 'success' && (
          <div className={cn(
            'mx-auto max-w-2xl rounded-xl border p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4',
            pollState === 'active'
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
              : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
          )}>
            {pollState === 'active' ? (
              <><CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <div><p className="font-semibold text-emerald-700 dark:text-emerald-400">Plan Aktif ✅</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500">Pro planınız başarıyla aktif edildi!</p></div></>
            ) : pollState === 'pending' ? (
              <><Loader2 className="h-6 w-6 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-700 dark:text-amber-400">Ödeme Alındı ⏳</p>
                  <p className="text-sm text-amber-600 dark:text-amber-500">30 saniye içinde otomatik aktif olur.</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0" onClick={async () => {
                  setPollState('polling'); setPollCount(0);
                  const isPro = await refreshProfile();
                  if (isPro) { setPollState('active'); toast.success('Plan aktif ✅'); setTimeout(() => window.location.href = '/pricing', 1500); }
                  else { setPollState('pending'); toast.info('Henüz aktif değil, biraz daha bekleyin.'); }
                }}>
                  <RefreshCw className="h-4 w-4 mr-1" />Yenile
                </Button></>
            ) : (
              <><Loader2 className="h-6 w-6 text-blue-500 animate-spin shrink-0" />
                <div><p className="font-semibold text-blue-700 dark:text-blue-400">Ödeme Başarılı ✅</p>
                  <p className="text-sm text-blue-600 dark:text-blue-500">Planınız kontrol ediliyor… ({pollCount}/6)</p></div></>
            )}
          </div>
        )}
        {paymentStatus === 'fail' && (
          <div className="mx-auto max-w-2xl rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <XCircle className="h-6 w-6 text-red-500 shrink-0" />
            <div><p className="font-semibold text-red-700 dark:text-red-400">Ödeme Başarısız ❌</p>
              <p className="text-sm text-red-600 dark:text-red-500">Ödeme tamamlanamadı. Tekrar deneyebilirsiniz.</p></div>
          </div>
        )}

        {/* ─ Header ────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-5">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Sade ve Şeffaf Fiyatlandırma
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Gizli ücret yok. İstediğin zaman iptal et.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-6">
            <div className="relative flex items-center bg-muted p-1 rounded-xl border">
              <button
                onClick={() => setBilling('monthly')}
                className={cn(
                  'px-6 py-2.5 text-sm font-medium rounded-[10px] transition-all duration-200',
                  billing === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Aylık
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={cn(
                  'px-6 py-2.5 text-sm font-medium rounded-[10px] transition-all duration-200 relative',
                  billing === 'yearly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Yıllık
                <span className="absolute -top-2.5 -right-3 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm border border-white/20 font-semibold tracking-wide rotate-3 transform">
                  %17
                </span>
              </button>
            </div>
          </div>
          {isAnnual && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in">
              🎉 Yıllık planda <strong>{SAVINGS.toLocaleString('tr-TR')}₺</strong> tasarruf edersiniz — 2 ay bedava!
            </p>
          )}
        </div>

        {/* ─ Plan Cards ─────────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">

          {/* FREE */}
          <div className="relative rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold">Başlangıç</h3>
              <p className="text-sm text-muted-foreground mt-2">Yeni başlayanlar ve denemek isteyenler için ideal.</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold">0₺</span>
              <span className="text-muted-foreground ml-1">/ sonsuza kadar</span>
            </div>
            <div className="space-y-3.5 flex-1">
              <FeatureRow text={`${FREE_LIMIT} ürüne kadar analiz kaydetme`} included />
              <FeatureRow text="Temel kâr hesaplama" included />
              <FeatureRow text="4 pazaryeri desteği" included />
              <FeatureRow text="PDF rapor (1 adet/ay)" included />
              <FeatureRow text="Sınırsız ürün analizi" included={false} />
              <FeatureRow text="CSV içe aktarma" included={false} />
              <FeatureRow text="CSV & rapor dışa aktarma" included={false} />
              <FeatureRow text="Hassasiyet analizi" included={false} />
              <FeatureRow text="Pazaryeri karşılaştırması" included={false} />
              <FeatureRow text="Nakit akışı tahmini" included={false} />
              <FeatureRow text="PRO Muhasebe Modu (KDV ayrıştırma)" included={false} />
              <FeatureRow text="Öncelikli destek" included={false} />
            </div>
            <div className="mt-8 pt-6 border-t">
              {user && user.plan === 'free' ? (
                <Button variant="outline" className="w-full h-12 rounded-xl text-base font-medium" disabled>
                  Mevcut Plan
                </Button>
              ) : (
                <Button variant="outline" className="w-full h-12 rounded-xl text-base font-medium hover:bg-muted/50" asChild>
                  <a href={user ? '/dashboard' : '/auth'}>
                    {user ? 'Panele Git' : 'Ücretsiz Başla'}
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* PRO */}
          <div className="relative rounded-2xl border-2 border-primary/30 bg-gradient-to-b from-primary/[0.03] to-card p-8 shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground px-5 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              EN ÇOK TERCİH EDİLEN
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                Pro <Crown className="h-5 w-5 text-primary fill-current" />
              </h3>
              <p className="text-sm text-muted-foreground mt-2">Ciddi satıcılar ve büyümek isteyenler için tüm özellikler.</p>
            </div>

            <div className="mb-8 space-y-2">
              {/* Crossed out old price */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Normal Fiyat</span>
                <span className="text-lg text-muted-foreground/80 font-bold line-through decoration-red-400 decoration-2">
                  {isAnnual ? `${PRICING.oldMonthly * 10}₺` : `${PRICING.oldMonthly}₺`}
                </span>
              </div>
              {/* Current price */}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight">
                  {isAnnual ? YEARLY_PRICE.toLocaleString('tr-TR') : MONTHLY_PRICE}₺
                </span>
                <span className="text-base font-medium text-muted-foreground">
                  {isAnnual ? '/ yıl' : '/ ay'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  %50 İndirim
                </span>
              </div>
              {isAnnual && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">≈ {YEARLY_MONTHLY_EQUIV}₺/ay olarak faturalandırılır</p>
                  <span className="inline-block text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                    🎉 2 Ay Bedava!
                  </span>
                </div>
              )}
              {/* Founder badge */}
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200/60 dark:border-amber-800/30">
                <Sparkles className="h-4 w-4 text-amber-500 fill-current shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-amber-600/90 uppercase tracking-wider leading-none mb-0.5">Kurucu Üye Fırsatı</p>
                  <p className="text-xs text-foreground/80 font-medium leading-tight">Erken erişim süresince sabitlenen özel fiyat</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 flex-1">
              <FeatureRow text="Sınırsız ürün analizi" included highlight />
              <FeatureRow text="PRO Muhasebe Modu (KDV ayrıştırma)" included highlight />
              <FeatureRow text="Hassasiyet analizi" included highlight />
              <FeatureRow text="Pazaryeri karşılaştırması" included highlight />
              <FeatureRow text="Nakit akışı tahmini" included highlight />
              <FeatureRow text="CSV içe aktarma" included highlight />
              <FeatureRow text="CSV & rapor dışa aktarma" included highlight />
              <FeatureRow text="Trendyol API entegrasyonu" included highlight />
              <FeatureRow text="Hepsiburada API entegrasyonu" included highlight />
              <FeatureRow text="Sınırsız PDF rapor" included highlight />
              <FeatureRow text="Öncelikli e-posta desteği" included highlight />
              <FeatureRow text="Yeni özellikler erken erişim" included highlight />
            </div>

            <div className="mt-8 pt-6 border-t space-y-3">
              {user && isProUser(user) ? (
                <div className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 font-medium">
                  <Check className="h-5 w-5" /> Pro Plan Aktif
                </div>
              ) : (
                <>
                  <Button
                    className="w-full h-14 rounded-xl text-lg font-bold shadow-md hover:scale-[1.01] transition-all duration-300 active:scale-95"
                    disabled={loading}
                    onClick={handleUpgrade}
                  >
                    {loading
                      ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />Yönlendiriliyor…</>
                      : user ? "Pro'ya Geç" : "Pro ile Başla"}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground">
                    7 gün içinde koşulsuz para iade garantisi
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ─ Comparison Table ───────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Özellik Karşılaştırması</h2>
          <div className="rounded-2xl border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-muted/50 border-b">
              <div className="p-4 text-sm font-semibold text-muted-foreground">Özellik</div>
              <div className="p-4 text-sm font-semibold text-center border-l">Ücretsiz</div>
              <div className="p-4 text-sm font-semibold text-center border-l text-primary">Pro</div>
            </div>
            {/* Rows */}
            {COMPARISON_ROWS.map((row, i) => (
              <div key={row.label} className={cn('grid grid-cols-3', i % 2 === 0 ? 'bg-card' : 'bg-muted/20')}>
                <div className="p-3.5 text-sm text-foreground/80">{row.label}</div>
                <div className="p-3.5 text-center border-l flex items-center justify-center">
                  <CellValue val={row.free} />
                </div>
                <div className="p-3.5 text-center border-l flex items-center justify-center">
                  <CellValue val={row.pro} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─ Trust Bar ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span>PayTR güvencesi</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-500" />
            <span>Kart bilginiz saklanmaz</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-500" />
            <span>7 gün iade garantisi</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-500" />
            <span>İstediğiniz zaman iptal</span>
          </div>
        </div>

        {/* ─ FAQ ────────────────────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Sıkça Sorulan Sorular</h2>
          <div className="rounded-2xl border bg-card p-6 divide-y">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* ─ Bottom CTA ─────────────────────────────────────────────────────── */}
        <div className="text-center space-y-5 py-8">
          <h2 className="text-2xl font-bold">Hâlâ kararsız mısın?</h2>
          <p className="text-muted-foreground">
            Ücretsiz planla başla, istediğinde yükselt.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" size="lg" className="rounded-xl h-12 px-8" asChild>
              <a href={user ? '/dashboard' : '/auth'}>
                Ücretsiz Başla
              </a>
            </Button>
            {!(user && isProUser(user)) && (
              <Button
                size="lg"
                className="rounded-xl h-12 px-8"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Yönlendiriliyor…</>
                  : "Pro'ya Geç →"}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Güvenli ödeme · PayTR altyapısı · Kart bilgisi saklanmaz
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── page export with Suspense (fixes useSearchParams blank render) ────────────

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
