'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useInView, useScroll, useTransform, animate, type MotionValue } from 'framer-motion';
import { KarnetLogo } from '@/components/shared/KarnetLogo';
import {
  Wallet, BarChart3, ShoppingCart, Target, TrendingUp,
  ShieldCheck, Lock, KeyRound, ArrowRight, ChevronDown, Check,
  CheckCircle2, DollarSign, Percent, Package, ArrowUpRight,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

/* Cam yüzey — translucent beyaz + backdrop blur + ince kenar (skill: glass 15-30% opacity, blur 10-20px) */
const GLASS = 'border border-white/60 bg-white/55 backdrop-blur-xl ring-1 ring-slate-900/[0.04] shadow-[0_18px_50px_-24px_rgba(15,23,42,0.30)]';

/* ── Hareket yardımcıları (prefers-reduced-motion'a saygılı) ── */
function Reveal({ children, delay = 0, y = 24, className = '' }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerParent = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } };
function Stagger({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className={className}>
      {children}
    </motion.div>
  );
}
const itemV = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };
function Item({ children, className = '', lift = false }: { children: React.ReactNode; className?: string; lift?: boolean }) {
  return (
    <motion.div variants={itemV} whileHover={lift ? { y: -6 } : undefined} transition={lift ? { type: 'spring', stiffness: 320, damping: 22 } : undefined} className={className}>
      {children}
    </motion.div>
  );
}

/* Sayı sayacı — görünürken 0'dan hedefe (reduced-motion'da anında) */
function CountUp({ to, decimals = 0, prefix = '', suffix = '', className = '' }: { to: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(to); return; }
    const controls = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: (v) => setVal(v) });
    return () => controls.stop();
  }, [inView, to, reduce]);
  const fmt = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref} className={className}>{prefix}{fmt.format(val)}{suffix}</span>;
}

/* ── İçerik verileri ── */
const NAV = [
  { t: 'Özellikler', href: '#ozellikler' },
  { t: 'Güvenlik', href: '#guvenlik' },
  { t: 'SSS', href: '#sss' },
];

const HERO_STATS = [
  { icon: DollarSign, label: 'Aylık Net Kâr', to: 1002.25, decimals: 2, prefix: '₺', suffix: '', sub: 'Toplam net kâr', color: 'from-amber-500 to-orange-600' },
  { icon: Percent, label: 'Ortalama Marj', to: 12.1, decimals: 1, prefix: '%', suffix: '', sub: '294 aktif ürün', color: 'from-emerald-500 to-teal-600' },
  { icon: ShoppingCart, label: 'Bu Ay Satış', to: 4, decimals: 0, prefix: '', suffix: '', sub: 'Bu ay satılan ürün', color: 'from-blue-500 to-indigo-600' },
  { icon: Package, label: 'Toplam Ürün', to: 294, decimals: 0, prefix: '', suffix: '', sub: 'Aktif ürün analizi', color: 'from-violet-500 to-purple-600' },
];
const HERO_TOP = [
  { n: 1, name: 'Kablosuz Bluetooth Kulaklık', value: '₺1.674,17', pct: 68 },
  { n: 2, name: 'Unisex Oversize Tişört', value: '₺1.210,40', pct: 52 },
  { n: 3, name: 'Çelik Termos 750 ml', value: '₺880,00', pct: 45 },
];
const HERO_DAYS = ['Per', 'Cum', 'Cmt', 'Paz', 'Pzt', 'Sal', 'Çar'];

type Fact = { to?: number; decimals?: number; prefix?: string; suffix?: string; static?: string; label: string; sub: string };
const FACTS: Fact[] = [
  { to: 0, prefix: '₺', label: 'Aylık ücret', sub: 'Tüm özellikler ücretsiz' },
  { to: 5, label: 'Kesinti kalemi', sub: 'Komisyon, kargo, reklam, iade, KDV' },
  { static: '2dk', label: 'Kurulum süresi', sub: 'Üye ol, bağla, gör' },
  { static: 'AES-256', label: 'Şifreleme', sub: 'API anahtarların güvende' },
];

const OVERVIEW = [
  { icon: BarChart3, t: 'Kâr analizi', d: 'Komisyon, kargo, reklam, iade ve KDV dahil net kârı kuruşu kuruşuna gör.', color: 'from-amber-500 to-orange-600' },
  { icon: Wallet, t: 'Hakediş & tahsilat', d: 'Trendyol hakedişini canlı izle, ne zaman ne alacağını önceden bil.', color: 'from-emerald-500 to-teal-600' },
  { icon: ShoppingCart, t: 'Sipariş & iade', d: 'Bekleyen sipariş ve iade taleplerini tek ekrandan yönet, aksiyon al.', color: 'from-blue-500 to-indigo-600' },
  { icon: Target, t: 'Başabaş & nakit', d: 'Kara geçiş noktanı ve aylık nakit akışını planla, riski önceden gör.', color: 'from-violet-500 to-purple-600' },
];

const TRUST = [
  { icon: Lock, t: 'AES-256 şifreleme', d: 'API anahtarların ve hassas verilerin uçtan uca şifreli saklanır.' },
  { icon: KeyRound, t: 'Resmi Trendyol API', d: 'Yalnızca okuma izniyle, doğrudan Trendyol entegrasyonu üzerinden.' },
  { icon: ShieldCheck, t: 'Verilerin sana ait', d: 'Satır bazlı güvenlik. Dilediğin an hesabını ve tüm verini silebilirsin.' },
];

const FAQ = [
  { q: 'Kârnet gerçekten ücretsiz mi?', a: 'Evet. Tüm özellikler — analiz, hakediş takibi, sipariş yönetimi, başabaş, nakit planı — herhangi bir ücret veya kısıtlama olmadan tamamen ücretsiz. Kredi kartı istemiyoruz.' },
  { q: 'Trendyol mağazamı bağlamak güvenli mi?', a: 'Mağazanı Trendyol Entegrasyon API anahtarlarınla bağlarsın. Anahtarların AES-256-GCM ile şifrelenerek saklanır, asla üçüncü taraflarla paylaşılmaz ve yalnızca okuma amaçlı kullanılır.' },
  { q: 'Verilerim güvende mi?', a: 'Tüm veriler şifrelenir ve satır bazlı güvenlik (RLS) ile korunur — verilerine yalnızca sen erişebilirsin. Dilediğin an hesabını ve tüm verilerini kalıcı olarak silebilirsin.' },
  { q: 'Kurulum ne kadar sürer?', a: 'Ortalama 2 dakika. Üye ol, Trendyol API bilgilerini gir, mağazan otomatik senkronize olsun.' },
  { q: 'Hangi pazaryerlerini destekliyor?', a: 'Şu an Trendyol tam entegre. Hepsiburada ve diğer pazaryerleri için altyapı hazır, yakında ekleniyor.' },
];

const FOOTER_COLS = [
  { h: 'Ürün', links: [{ t: 'Özellikler', href: '#ozellikler' }, { t: 'Güvenlik', href: '#guvenlik' }, { t: 'SSS', href: '#sss' }] },
  { h: 'Kârnet', links: [{ t: 'Hakkımızda', href: '/hakkimizda' }, { t: 'İletişim', href: '/iletisim' }, { t: 'Blog', href: '/blog' }, { t: 'Destek', href: '/support' }] },
  { h: 'Başla', links: [{ t: 'Ücretsiz Başla', href: '/auth' }, { t: 'Giriş Yap', href: '/auth' }, { t: 'Demo', href: '/demo' }] },
  { h: 'Yasal', links: [{ t: 'Gizlilik Politikası', href: '/gizlilik-politikasi' }, { t: 'Kullanım Şartları', href: '/kullanim-sartlari' }, { t: 'Çerez Politikası', href: '/cerez-politikasi' }, { t: 'İade Politikası', href: '/iade-politikasi' }] },
];

/* ── Temsilî ürün mockup'ları ── */
function ProfitMockup() {
  const rows = [
    { l: 'Komisyon (%18)', v: '−₺62,98' },
    { l: 'Kargo', v: '−₺44,90' },
    { l: 'Reklam payı', v: '−₺18,00' },
    { l: 'İade payı', v: '−₺9,10' },
    { l: 'KDV', v: '−₺23,40' },
  ];
  return (
    <div className="w-full max-w-sm rounded-2xl bg-white/90 p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.4)] ring-1 ring-slate-900/[0.06] backdrop-blur">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] text-slate-400">Kablosuz Kulaklık · TR-4821</p>
          <p className="mt-0.5 text-[13px] font-medium text-slate-500">Satış fiyatı</p>
        </div>
        <p className="text-[18px] font-bold tracking-tight text-slate-900">₺349,90</p>
      </div>
      <div className="mt-4 space-y-2.5">
        {rows.map((r) => (
          <div key={r.l} className="flex items-center justify-between text-[13px]">
            <span className="text-slate-500">{r.l}</span>
            <span className="font-medium text-rose-500">{r.v}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12px] text-slate-400">Net kâr</p>
            <p className="font-display text-[30px] leading-none text-emerald-600">₺191,52</p>
          </div>
          <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-600 ring-1 ring-emerald-100">
            <TrendingUp className="h-3.5 w-3.5" /> %54,7 marj
          </span>
        </div>
      </div>
    </div>
  );
}

function PayoutMockup() {
  const items = [
    { d: '18', m: 'Haz', s: 'Hakediş', v: '₺2.430', done: true },
    { d: '25', m: 'Haz', s: 'Hakediş', v: '₺3.180', done: false },
    { d: '02', m: 'Tem', s: 'Hakediş', v: '₺1.940', done: false },
  ];
  return (
    <div className="w-full max-w-sm rounded-2xl bg-white/90 p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.4)] ring-1 ring-slate-900/[0.06] backdrop-blur">
      <p className="text-[12px] text-slate-400">Bekleyen hakediş</p>
      <p className="mt-1 font-display text-[32px] leading-none text-slate-900">₺7.550</p>
      <div className="mt-5 space-y-3">
        {items.map((it) => (
          <div key={`${it.d}-${it.m}`} className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold leading-none ${it.done ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'}`}>
              {it.d}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-slate-700">{it.s}</p>
              <p className="text-[11px] text-slate-400">{it.d} {it.m} · {it.done ? 'Ödendi' : 'Bekliyor'}</p>
            </div>
            <p className="text-[14px] font-bold text-slate-900">{it.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type Showcase = { eyebrow: string; title: string; desc: string; bullets: string[]; cta: string; Mockup: () => React.ReactElement; reverse: boolean };
const SHOWCASE: Showcase[] = [
  {
    eyebrow: 'Kâr analizi',
    title: 'Gerçek kârını kuruşu kuruşuna gör',
    desc: 'Komisyon, kargo, reklam, iade ve KDV düşünce elinde ne kalıyor? Kârnet her ürünün arkasındaki matematiği senin için çözer.',
    bullets: ['Tüm kesintiler tek hesapta birleşir', 'Ürün bazında net kâr ve marj', 'Zarar eden ürünleri anında yakala'],
    cta: 'Kâr analizini gör', Mockup: ProfitMockup, reverse: false,
  },
  {
    eyebrow: 'Hakediş & tahsilat',
    title: 'Ne zaman, ne kadar alacağını bil',
    desc: 'Trendyol hakediş, komisyon ve iade kesintilerini canlı izle; tahsilat takvimiyle nakit girişini önceden planla.',
    bullets: ['Canlı hakediş takibi', 'Gelecek ödeme takvimi', 'Komisyon ve iade kesintileri şeffaf'],
    cta: 'Hakedişi incele', Mockup: PayoutMockup, reverse: true,
  },
];

/* ── Hero (scroll-parallax + animasyonlu önizleme) ── */
function Hero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const previewY = reduce ? (0 as unknown as MotionValue<number>) : yRaw;
  const previewScale = reduce ? (1 as unknown as MotionValue<number>) : scaleRaw;

  return (
    <section ref={heroRef} className="relative w-full px-4 pb-12 pt-12 sm:pt-16 md:px-6 md:pb-20 md:pt-20">
      <Stagger className="mx-auto max-w-4xl text-center">
        <Item>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 text-[12.5px] font-semibold text-emerald-700">
            <Check className="h-3.5 w-3.5" /> %100 ücretsiz · kredi kartı yok · gizli ücret yok
          </span>
        </Item>
        <Item>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,7.5vw,5.25rem)] leading-[0.95] tracking-[-0.02em] text-slate-900">
            Önemli olan ciro değil,
            <br className="hidden sm:block" />{' '}
            <span className="relative whitespace-nowrap bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-shift_6s_ease_infinite]">
              elinde kalan.
            </span>
          </h1>
        </Item>
        <Item>
          <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed text-slate-600 sm:text-[19px]">
            Komisyon, kargo, reklam, iade ve KDV düştükten sonra cebine giren net rakamı
            Kârnet kuruşu kuruşuna hesaplar. Tahmin yok, Excel yok — sadece gerçek kârın.{' '}
            <span className="font-semibold text-slate-900">Üstelik tüm özellikler tamamen ücretsiz.</span>
          </p>
        </Item>
        <Item>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/auth" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
              Ücretsiz Başla
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#ozellikler" className={`inline-flex items-center rounded-xl px-6 py-3.5 text-[15px] font-semibold text-slate-800 transition-colors hover:bg-white/70 ${GLASS}`}>
              Nasıl çalışır?
            </a>
          </div>
        </Item>
        <Item>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-slate-500">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> Tamamen ücretsiz</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> Kredi kartı gerekmez</span>
            <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-slate-400" /> AES-256 şifreleme</span>
            <span className="flex items-center gap-1.5"><KeyRound className="h-4 w-4 text-slate-400" /> Resmi Trendyol API</span>
          </div>
        </Item>
      </Stagger>

      {/* Cam dashboard önizlemesi — scroll'da hafif parallax + süzülen rozetler */}
      <motion.div style={{ y: previewY, scale: previewScale }} className="relative z-10 mt-14 w-full">
        <div className={`rounded-3xl p-3 sm:p-4 ${GLASS}`}>
          <div className="rounded-2xl bg-white/70 p-4 backdrop-blur-sm sm:p-5">
            <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {HERO_STATS.map((s) => (
                <Item key={s.label} lift className="rounded-xl border border-white/70 bg-white/80 p-5 ring-1 ring-slate-900/[0.03]">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3.5 text-[13px] text-slate-500">{s.label}</p>
                  <p className="mt-0.5 text-[24px] font-bold tracking-tight text-slate-900">
                    <CountUp to={s.to} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="text-[11.5px] text-slate-400">{s.sub}</p>
                </Item>
              ))}
            </Stagger>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <Reveal delay={0.1} className="rounded-xl border border-white/70 bg-white/80 p-5 ring-1 ring-slate-900/[0.03] lg:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">Bu Ay Ciro</h3>
                    <p className="text-[12px] text-slate-500">Günlük kâr / zarar — son 7 gün</p>
                  </div>
                  <span className="text-[12px] text-slate-400">Hedef: ₺10.000,00</span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-[26px] font-bold tracking-tight text-slate-900">₺6.480,00</p>
                  <span className="text-[12px] font-medium text-emerald-600">%65 hedef tamamlandı</span>
                </div>
                <svg viewBox="0 0 600 150" preserveAspectRatio="none" className="mt-3 h-32 w-full">
                  <defs>
                    <linearGradient id="ciroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path d="M0,120 C70,108 120,80 200,92 C280,104 320,55 410,64 C490,72 540,30 600,40 L600,150 L0,150 Z" fill="url(#ciroGrad)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }} />
                  <motion.path d="M0,120 C70,108 120,80 200,92 C280,104 320,55 410,64 C490,72 540,30 600,40" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.25, ease: 'easeInOut' }} />
                </svg>
                <div className="mt-2 flex justify-between text-[10.5px] text-slate-400">
                  {HERO_DAYS.map((d) => (<span key={d}>{d}</span>))}
                </div>
              </Reveal>

              <Reveal delay={0.18} className="rounded-xl border border-white/70 bg-white/80 p-5 ring-1 ring-slate-900/[0.03]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">En Kârlı Ürünler</h3>
                    <p className="text-[12px] text-slate-500">Aylık net kâra göre ilk 3</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-amber-600">Tümü <ArrowUpRight className="h-3 w-3" /></span>
                </div>
                <div className="mt-4 space-y-3.5">
                  {HERO_TOP.map((p) => (
                    <div key={p.n}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400">#{p.n}</span>
                          <span className="truncate text-[13px] font-medium text-slate-700">{p.name}</span>
                        </span>
                        <span className="shrink-0 text-[13px] font-bold text-slate-900">{p.value}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 pl-6">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" initial={{ width: 0 }} whileInView={{ width: `${p.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.35 + p.n * 0.12, ease: EASE }} />
                        </div>
                        <span className="w-10 text-right text-[11px] font-medium text-slate-500">%{p.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ── Sayfa ── */
export default function LandingGlass() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-slate-900 antialiased selection:bg-amber-200/60">
      {/* Aurora katmanı — hafif, beyaza yakın zemin için çok düşük yoğunluk */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-amber-400/12 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-orange-400/10 blur-[120px]" />
        <div className="absolute top-[45%] left-[15%] h-[26rem] w-[26rem] rounded-full bg-amber-300/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] h-[28rem] w-[28rem] rounded-full bg-indigo-300/8 blur-[120px]" />
      </div>

      {/* ── Header (cam) ── */}
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/55 backdrop-blur-xl">
        <div className="flex h-16 w-full items-center gap-2 px-4 md:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <KarnetLogo size={32} />
            <span className="font-display text-[20px] tracking-tight text-slate-900">Kârnet<span className="text-amber-500">.</span></span>
          </Link>
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              n.href.startsWith('#')
                ? <a key={n.t} href={n.href} className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-900">{n.t}</a>
                : <Link key={n.t} href={n.href} className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-900">{n.t}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/auth" className="hidden rounded-lg px-3.5 py-2 text-[14px] font-semibold text-slate-700 transition-colors hover:bg-white/70 sm:inline-flex">Giriş Yap</Link>
            <Link href="/auth" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-[14px] font-semibold text-white shadow-md shadow-amber-500/25 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </header>

      <Hero />

      {/* ── Rakamlar bandı (cam) ── */}
      <section className="w-full px-4 md:px-6">
        <Stagger className={`grid grid-cols-2 overflow-hidden rounded-3xl sm:grid-cols-4 ${GLASS}`}>
          {FACTS.map((f, i) => (
            <Item key={f.label} className={`px-5 py-9 text-center sm:py-12 ${i % 2 === 1 ? 'border-l border-white/50' : ''} ${i >= 2 ? 'border-t border-white/50 sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''}`}>
              <p className="font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-none tracking-tight text-slate-900">
                {f.static ? f.static : <CountUp to={f.to ?? 0} decimals={f.decimals} prefix={f.prefix} suffix={f.suffix} />}
              </p>
              <p className="mt-3 text-[14px] font-semibold text-slate-800">{f.label}</p>
              <p className="mt-1 text-[12.5px] text-slate-500">{f.sub}</p>
            </Item>
          ))}
        </Stagger>
      </section>

      {/* ── Özellikler (cam bento) ── */}
      <section id="ozellikler" className="w-full px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-amber-600">Özellikler</span>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.05] tracking-tight text-slate-900">Satışı değil, kârı yönet</h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-slate-600">
            Trendyol mağazanı kârlı yönetmek için ihtiyacın olan her şey, tek ve sade bir panelde.
          </p>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OVERVIEW.map((o) => (
            <Item key={o.t} lift className={`group h-full rounded-2xl p-6 transition-shadow hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.4)] ${GLASS}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${o.color} text-white shadow-md`}>
                <o.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-[17px] font-bold tracking-tight text-slate-900">{o.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{o.d}</p>
            </Item>
          ))}
        </Stagger>
      </section>

      {/* ── Ürün vitrini (cam paneller) ── */}
      <section className="w-full space-y-6 px-4 md:px-6">
        {SHOWCASE.map((b) => (
          <Reveal key={b.title}>
            <div className={`rounded-3xl p-7 md:p-12 ${GLASS}`}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={b.reverse ? 'lg:order-2' : ''}>
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-amber-600">{b.eyebrow}</span>
                  <h2 className="mt-3 font-display text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.08] tracking-tight text-slate-900">{b.title}</h2>
                  <p className="mt-4 text-[16px] leading-relaxed text-slate-600">{b.desc}</p>
                  <ul className="mt-6 space-y-3">
                    {b.bullets.map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" /> {x}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth" className="mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-amber-600 transition-all hover:gap-3">
                    {b.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className={b.reverse ? 'lg:order-1' : ''}>
                  <div className="flex justify-center rounded-2xl border border-white/50 bg-white/30 p-7 backdrop-blur-sm sm:p-12">
                    <b.Mockup />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ── Güvenlik (koyu cam bandı) ── */}
      <section id="guvenlik" className="w-full px-4 pt-16 md:px-6 md:pt-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 px-7 py-14 backdrop-blur-xl sm:px-12 md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="text-[13px] font-semibold uppercase tracking-wider text-amber-400">Güvenlik</span>
              <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-tight text-white">
                Finansal verilerin, güvenli ellerde
              </h2>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-slate-300">
                Mağaza verilerin ciddi bir konu. Kârnet, bankacılık seviyesinde şifreleme ve
                satır bazlı erişim kontrolüyle bilgilerini korur — yalnızca sen görürsün.
              </p>
              <Link href="/auth" className="mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-white transition-all hover:gap-3">
                Güvenle başla <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Stagger className="space-y-3">
              {TRUST.map((x) => (
                <Item key={x.t} lift className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                    <x.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white">{x.t}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-slate-400">{x.d}</p>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── SSS (cam akordeon) ── */}
      <section id="sss" className="w-full px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-10 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-amber-600">SSS</span>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05] tracking-tight text-slate-900">Sık sorulan sorular</h2>
            <p className="mt-4 text-[15px] text-slate-600">
              Aklındaki soruların yanıtı burada. Daha fazlası için destek ekibimiz hazır.
            </p>
            <Link href="/support" className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-amber-600 transition-all hover:gap-3">
              Destek ekibine yaz <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className={`divide-y divide-white/50 overflow-hidden rounded-2xl lg:col-span-2 ${GLASS}`}>
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/40">
                    <span className="text-[15.5px] font-semibold text-slate-900">{f.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-[14.5px] leading-relaxed text-slate-600">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ── Footer (cam) ── */}
      <footer className="border-t border-white/40 bg-white/55 backdrop-blur-xl">
        <div className="w-full px-4 py-12 md:px-6">
          <div className="grid gap-10 md:grid-cols-5">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5">
                <KarnetLogo size={28} />
                <span className="font-display text-[17px] tracking-tight text-slate-900">Kârnet<span className="text-amber-500">.</span></span>
              </Link>
              <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
                Trendyol satıcıları için kâr ve finans paneli. Ciroyu değil, elinde kalanı görürsün.
              </p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.h}>
                <h4 className="text-[13px] font-bold text-slate-900">{col.h}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.t}>
                      {l.href.startsWith('#')
                        ? <a href={l.href} className="text-[14px] text-slate-500 transition-colors hover:text-slate-900">{l.t}</a>
                        : <Link href={l.href} className="text-[14px] text-slate-500 transition-colors hover:text-slate-900">{l.t}</Link>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/40 pt-6 text-[13px] text-slate-400 sm:flex-row">
            <p>© 2026 Kârnet · Trendyol satıcıları için kâr & finans paneli</p>
            <p>Bağımsız bir araçtır; Trendyol ile resmi bağı yoktur.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
