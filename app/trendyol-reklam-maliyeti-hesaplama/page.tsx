import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Trendyol Reklam Maliyeti Hesaplama — ACoS ve Kâra Etkisi',
  description:
    'Trendyol sponsorlu ürün reklamlarının kâra etkisi nasıl hesaplanır? ACoS (reklam maliyeti oranı), ürün başına reklam payı ve net kâr hesabı. Ücretsiz hesaplama aracı.',
  alternates: { canonical: 'https://kârnet.com/trendyol-reklam-maliyeti-hesaplama' },
  openGraph: {
    title: 'Trendyol Reklam Maliyeti Hesaplama — ACoS ve Kâra Etkisi',
    description:
      'Trendyol reklam harcamasının net kâra etkisi, ACoS hesabı ve ürün başına reklam payı. Ücretsiz araçla hesaplayın.',
    url: 'https://kârnet.com/trendyol-reklam-maliyeti-hesaplama',
    type: 'article',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Trendyol reklam maliyeti kâra nasıl etki eder?',
    answer: 'Trendyol sponsorlu ürün (reklam) harcaması doğrudan net kârınızdan düşer. Reklam bütçenizi, reklamdan gelen satış adedine bölerek ürün başına reklam payını bulur ve bu tutarı her ürünün kâr hesabına eklersiniz.',
  },
  {
    question: 'ACoS nedir ve nasıl hesaplanır?',
    answer: 'ACoS (Advertising Cost of Sales), reklam maliyetinin reklamdan gelen satışa oranıdır. ACoS = (Reklam Harcaması / Reklamdan Gelen Satış Cirosu) × 100. Örneğin 100₺ reklamla 500₺ satış yaptıysanız ACoS = %20\'dir.',
  },
  {
    question: 'Reklam yaparken kârlı kalma sınırı nedir?',
    answer: 'Reklam kârlı kalmak için ACoS oranınız, ürünün reklam öncesi kâr marjından düşük olmalıdır. Kâr marjınız %30, ACoS\'unuz %20 ise reklamdan sonra hâlâ %10 net kâr kalır. ACoS kâr marjını aşarsa reklam zarar ettirir.',
  },
  {
    question: 'Ürün başına reklam payı nasıl bulunur?',
    answer: 'Ürün başına reklam payı = Toplam reklam harcaması / Toplam satılan adet. Örneğin ayda 3.000₺ reklam harcayıp 200 ürün sattıysanız, ürün başına reklam payı 15₺\'dir. Bu tutarı net kâr hesabına dahil edin.',
  },
  {
    question: 'Kârnet reklam maliyetini hesaba katıyor mu?',
    answer: 'Evet. Kârnet, ürün başına reklam harcamasını komisyon, kargo, iade ve KDV ile birlikte hesaba katarak reklam sonrası gerçek net kâr marjını gösterir.',
  },
];

export default function TrendyolReklamMaliyetiHesaplamaPage() {
  const faqSchema = faqPageSchema(FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://kârnet.com' },
    { name: 'Trendyol Reklam Maliyeti Hesaplama', url: 'https://kârnet.com/trendyol-reklam-maliyeti-hesaplama' },
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-14">

          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Link href="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/trendyol-kar-hesaplama" className="hover:text-foreground transition-colors">Trendyol Kâr Hesaplama</Link>
            <span>/</span>
            <span className="text-foreground">Reklam Maliyeti Hesaplama</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-700 dark:text-orange-400">
                Trendyol
              </span>
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-amber-500/12 text-amber-800 dark:text-amber-300">
                Reklam & ACoS
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Trendyol Reklam Maliyeti Hesaplama — ACoS ve Kâra Etkisi
            </h1>

            {/* AI short answer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed">
              <strong className="text-foreground block mb-2">Kısa Yanıt:</strong>
              <p className="text-muted-foreground">
                Trendyol reklam harcaması doğrudan net kârdan düşer. Ürün başına reklam payı = Toplam reklam
                harcaması / Satılan adet. Reklamın kârlı kalması için <strong className="text-foreground">ACoS
                (reklam maliyeti oranı), ürünün kâr marjından düşük</strong> olmalıdır. ACoS = (Reklam Harcaması /
                Reklamdan Gelen Ciro) × 100. Kârnet, reklam payını kâr hesabına otomatik dahil eder.
              </p>
            </div>
          </div>

          {/* Formula */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Temel Formüller</h2>
            <div className="rounded-xl border border-border/40 bg-card p-5 font-mono text-sm leading-relaxed text-muted-foreground space-y-2">
              <p><span className="text-foreground font-semibold">ACoS</span> = (Reklam Harcaması / Reklamdan Gelen Ciro) × 100</p>
              <p><span className="text-foreground font-semibold">Ürün Başına Reklam Payı</span> = Toplam Reklam / Satılan Adet</p>
              <p><span className="text-foreground font-semibold">Reklam Sonrası Marj</span> = Kâr Marjı − ACoS</p>
            </div>
          </section>

          {/* ACoS profitability table */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">ACoS ve Kârlılık İlişkisi</h2>
            <p className="text-sm text-muted-foreground">
              Reklam, ACoS oranınız kâr marjınızın altında kaldığı sürece kârlıdır. Aşağıdaki tablo
              %30 kâr marjlı bir ürün için reklamın etkisini gösterir:
            </p>
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">ACoS</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Reklam Sonrası Marj</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { acos: '%10', marj: '%20', durum: 'Kârlı', renk: 'text-emerald-600 dark:text-emerald-400' },
                    { acos: '%20', marj: '%10', durum: 'Kârlı', renk: 'text-emerald-600 dark:text-emerald-400' },
                    { acos: '%30', marj: '%0', durum: 'Başabaş', renk: 'text-amber-600 dark:text-amber-400' },
                    { acos: '%40', marj: '−%10', durum: 'Zarar', renk: 'text-red-500' },
                  ].map((row, i) => (
                    <tr key={row.acos} className={`border-b border-border/30 last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2.5 text-muted-foreground">{row.acos}</td>
                      <td className="px-4 py-2.5 text-center font-medium text-foreground">{row.marj}</td>
                      <td className={`px-4 py-2.5 text-right font-semibold ${row.renk}`}>{row.durum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Kural:</strong> ACoS &lt; Kâr Marjı ise reklam kazandırır.
              ACoS, kâr marjını aşarsa her satış zarar ettirir.
            </p>
          </section>

          {/* Example */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Örnek Hesaplama</h2>
            <p className="text-sm text-muted-foreground">Ayda 3.000₺ reklam harcaması, 200 satış, ürün satış fiyatı 250₺:</p>
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: 'Toplam Reklam Harcaması', value: '3.000₺', highlight: false },
                    { label: 'Reklamdan Gelen Satış Adedi', value: '200', highlight: false },
                    { label: 'Ürün Başına Reklam Payı (3.000 / 200)', value: '15₺', highlight: false },
                    { label: 'Reklamdan Gelen Ciro (200 × 250)', value: '50.000₺', highlight: false },
                    { label: 'ACoS (3.000 / 50.000)', value: '%6', highlight: true },
                  ].map((row) => (
                    <tr key={row.label} className={`border-b border-border/30 last:border-b-0 ${row.highlight ? 'bg-emerald-500/5 font-bold' : ''}`}>
                      <td className={`px-4 py-2.5 ${row.highlight ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>{row.label}</td>
                      <td className={`px-4 py-2.5 text-right font-medium ${row.highlight ? 'text-emerald-600 dark:text-emerald-400 text-base' : 'text-foreground'}`}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              %6 ACoS oldukça sağlıklıdır. Her üründen 15₺ reklam payını düştükten sonra kalan tutar gerçek
              net kârınızdır.
            </p>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Reklam Sonrası Gerçek Kâr</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Kârnet, ürün başına reklam payını komisyon, kargo, iade ve KDV ile birlikte hesaba katarak
              reklam sonrası net kâr marjınızı gösterir. Hangi ürünün reklamı kârlı, hangisi zararlı anında görün.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-amber-500/30"
              style={{ background: 'linear-gradient(135deg, #D97706, #92400E)' }}
            >
              Ücretsiz Hesapla →
            </Link>
            <p className="text-xs text-muted-foreground">Kart bilgisi gerekmez. Tamamen ücretsiz ve sınırsız.</p>
          </div>

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

          {/* Internal links */}
          <nav className="grid grid-cols-2 gap-3 text-sm" aria-label="İlgili sayfalar">
            {[
              { href: '/trendyol-kar-hesaplama', label: 'Trendyol Kâr Hesaplama' },
              { href: '/trendyol-kargo-ucreti-hesaplama', label: 'Trendyol Kargo Ücreti' },
              { href: '/trendyol-kdv-hesaplama', label: 'Trendyol KDV Hesaplama' },
              { href: '/blog/trendyol-basbas-noktasi-hesaplama', label: 'Başabaş Noktası Hesaplama' },
              { href: '/blog/e-ticarette-iade-orani-kar-etkisi', label: 'İade Oranı Kâr Etkisi' },
              { href: '/auth', label: 'Ücretsiz Başla' },
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
