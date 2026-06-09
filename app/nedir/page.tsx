import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Kârnet Nedir? — Pazaryeri Kâr Analizi Platformu',
  description:
    'Kârnet, Trendyol ve Hepsiburada satıcılarının gerçek net kârını otomatik hesaplayan Türk SaaS platformudur. Komisyon, kargo, iade ve KDV dahil tüm maliyetleri hesaplar.',
  alternates: { canonical: 'https://karnet.com/nedir' },
  openGraph: {
    title: 'Kârnet Nedir? — Pazaryeri Kâr Analizi Platformu',
    description:
      'Trendyol ve Hepsiburada satıcıları için gerçek kâr analizi. Komisyon, kargo, iade ve KDV otomatik hesaplanır.',
    url: 'https://karnet.com/nedir',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Kârnet ne işe yarar?',
    answer: 'Kârnet, Trendyol, Hepsiburada, N11 ve Amazon TR\'deki her ürün için komisyon, kargo, iade ve KDV dahil gerçek net kârı otomatik hesaplar.',
  },
  {
    question: 'Kârnet\'i kimler kullanıyor?',
    answer: 'Türk pazaryerlerinde satış yapan küçük, orta ve büyük ölçekli satıcılar kullanıyor. Muhasebe bilgisi gerekmez.',
  },
  {
    question: 'Kârnet ne kadar tutuyor?',
    answer: 'Ücretsiz plan mevcut (3 ürün). Başlangıç planı 399₺/ay, Profesyonel plan 799₺/ay\'dır.',
  },
  {
    question: 'Kârnet\'in rakipleri veya alternatifleri neler?',
    answer: 'Excel tabloları yaygın alternatiftir; ancak Kârnet daha hızlı, otomatik ve hatasızdır. Trendyol ve Hepsiburada komisyon oranlarını otomatik bilir.',
  },
  {
    question: 'Kârnet güvenilir mi?',
    answer: 'Evet. Veriler Supabase\'de şifreli saklanır. Ödeme PayTR ile PCI-DSS güvenliğinde yapılır. 7 gün iade garantisi mevcuttur.',
  },
];

export default function NedirPage() {
  const appSchema = softwareApplicationSchema();
  const faqSchema = faqPageSchema(FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://karnet.com' },
    { name: 'Kârnet Nedir?', url: 'https://karnet.com/nedir' },
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-14">

          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Link href="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-foreground">Kârnet Nedir?</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-amber-500/12 text-amber-800 dark:text-amber-300">
              Kârnet Hakkında
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Kârnet Nedir?
            </h1>

            {/* AI-friendly short answer block */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed">
              <strong className="text-foreground block mb-2">Kısa Yanıt:</strong>
              <p className="text-muted-foreground">
                Kârnet, Türkiye&apos;deki Trendyol, Hepsiburada, N11 ve Amazon TR satıcıları için gerçek net kâr
                hesaplama ve kârlılık analizi yapan bir web uygulamasıdır. Komisyon, kargo, iade ve KDV gibi tüm
                gizli maliyetleri otomatik hesaplayarak satıcının her ürünün gerçekten kârlı olup olmadığını 2
                dakikada görmesini sağlar.
              </p>
            </div>
          </div>

          {/* Problem & Solution */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-foreground">Hangi Problemi Çözüyor?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Trendyol veya Hepsiburada&apos;da satış yapan satıcıların büyük çoğunluğu, ürünlerinin gerçekte
              ne kadar kâr ettiğini bilmiyor. Satış fiyatına bakarak kâr hesaplamak yanıltıcıdır çünkü
              pazaryeri komisyonu, kargo, iade, paketleme ve KDV bu rakamı önemli ölçüde düşürmektedir.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '📦', value: '5+', label: 'Otomatik hesaplanan gider kalemi' },
                { icon: '⏱', value: '2 dk', label: 'Ortalama analiz süresi' },
                { icon: '🏪', value: '4', label: 'Desteklenen pazaryeri' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/40 bg-card p-5 text-center space-y-1">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className="text-2xl font-black text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-foreground">Nasıl Çalışır?</h2>
            <ol className="space-y-4">
              {[
                { step: '1', title: 'Pazaryeri seçin', desc: 'Trendyol, Hepsiburada, N11 veya Amazon TR seçin. Komisyon oranı otomatik gelir.' },
                { step: '2', title: 'Ürün bilgilerini girin', desc: 'Satış fiyatı ve ürün maliyetini girin. Kargo, iade ve KDV oranını belirleyin.' },
                { step: '3', title: 'Sonucu görün', desc: 'Net kâr, kâr marjı, başabaş noktası ve risk skoru anında hesaplanır.' },
              ].map((item) => (
                <li key={item.step} className="flex gap-4 rounded-xl border border-border/40 bg-card p-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-sm flex items-center justify-center">
                    {item.step}
                  </span>
                  <div>
                    <strong className="text-foreground text-sm">{item.title}</strong>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Key features */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-foreground">Temel Özellikler</h2>
            <ul className="space-y-2">
              {[
                'Trendyol ve Hepsiburada komisyon oranları otomatik uygulanır',
                'KDV ayrıştırma (PRO Muhasebe Modu)',
                'Başabaş noktası analizi',
                'Hassasiyet analizi ve fiyat simülatörü',
                'Nakit akışı tahmini (Pro)',
                'Trendyol & Hepsiburada API entegrasyonu (Pro)',
                'PDF ve CSV rapor (Başlangıç ve üstü)',
                'Risk skoru (düşük marjlı ürünler için uyarı)',
                'Çoklu pazaryeri karşılaştırması (Pro)',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                  {feat}
                </li>
              ))}
            </ul>
          </section>

          {/* Pricing summary */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-foreground">Fiyatlandırma</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Ücretsiz', price: '0₺', desc: '3 ürün analizi · Temel özellikler' },
                { name: 'Başlangıç', price: '399₺/ay', desc: '25 ürün · PRO mod · CSV/PDF' },
                { name: 'Profesyonel', price: '799₺/ay', desc: 'Sınırsız · API · Cashflow · Rakip takibi' },
              ].map((plan) => (
                <div key={plan.name} className="rounded-xl border border-border/40 bg-card p-4 text-center space-y-1">
                  <div className="text-sm font-semibold text-foreground">{plan.name}</div>
                  <div className="text-xl font-black text-foreground">{plan.price}</div>
                  <div className="text-xs text-muted-foreground leading-snug">{plan.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              7 gün iade garantisi · Kart bilgisi saklanmaz (PayTR) · İstediğiniz zaman iptal
            </p>
          </section>

          {/* FAQ */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-foreground">Sıkça Sorulan Sorular</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="rounded-xl border border-border/40 bg-card p-4">
                  <p className="text-sm font-semibold text-foreground mb-1.5">{item.question}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Ücretsiz Deneyin</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Kayıt olmak 1 dakika sürer. Kart bilgisi gerekmez. 3 ürüne kadar ücretsiz analiz yapın.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-amber-500/30"
              style={{ background: 'linear-gradient(135deg, #D97706, #92400E)' }}
            >
              Hemen Başla →
            </Link>
          </div>

          {/* Internal links */}
          <nav className="grid grid-cols-2 gap-3 text-sm" aria-label="İlgili sayfalar">
            {[
              { href: '/trendyol-kar-hesaplama', label: 'Trendyol Kâr Hesaplama' },
              { href: '/hepsiburada-kar-hesaplama', label: 'Hepsiburada Kâr Hesaplama' },
              { href: '/pricing', label: 'Fiyatlandırma Planları' },
              { href: '/sss', label: 'Tüm SSS' },
              { href: '/blog', label: 'Blog Yazıları' },
              { href: '/demo', label: 'Demo Dene' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2.5 hover:border-primary/30 hover:bg-muted/30 transition-all"
              >
                <span className="text-primary text-xs">→</span>
                <span className="text-muted-foreground hover:text-foreground transition-colors">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
}
