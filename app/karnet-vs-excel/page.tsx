import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Kârnet vs Excel — Kâr Hesaplamada Hangisi Daha İyi?',
  description:
    'Pazaryeri kâr hesaplamada Kârnet mi, Excel mi daha iyi? Trendyol ve Hepsiburada satıcıları için komisyon, kargo ve iade hesabında farkları öğrenin.',
  alternates: { canonical: 'https://kârnet.com/karnet-vs-excel' },
  openGraph: {
    title: 'Kârnet vs Excel — Pazaryeri Kâr Hesaplamada Fark',
    description:
      'Excel\'deki manuel komisyon hesaplama saatler alırken Kârnet ile 2 dakikada net kâr marjınızı bulun. Trendyol, Hepsiburada, N11 ve Amazon TR desteği.',
    url: 'https://kârnet.com/karnet-vs-excel',
    type: 'article',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Kârnet Excel\'e gerçek bir alternatif mi?',
    answer: 'Pazaryeri kâr hesaplama konusunda evet. Kârnet, Trendyol ve Hepsiburada komisyon oranlarını otomatik bilir ve iade etkisini hesaba katar. Excel\'de bunu manuel yapmak saatler alır ve hata riski yüksektir.',
  },
  {
    question: 'Excel\'de kâr hesaplamak neden zor?',
    answer: 'Trendyol komisyon oranları kategoriye göre %8–%22 arasında değişir ve dönemsel güncellemeler olabilir. Her kategori için ayrı formül yazmak, iade oranı ve KDV hesabını dahil etmek karmaşık ve hataya açıktır.',
  },
  {
    question: 'Kârnet Excel\'de yapılamayan neler yapıyor?',
    answer: 'Kârnet, Trendyol ve Hepsiburada API entegrasyonu ile ürün ve sipariş verilerini otomatik çeker, başabaş noktasını hesaplar, nakit akışı tahmini yapar ve risk skoru oluşturur. Bunları Excel\'de yapmak çok büyük bir çalışma gerektirir.',
  },
  {
    question: 'Kârnet ücretli mi?',
    answer: 'Hayır. Kârnet tamamen ücretsizdir. Tüm özellikler — API entegrasyonu, sınırsız ürün analizi, PDF rapor — ücretsiz ve sınırsız kullanılabilir.',
  },
  {
    question: 'Kârnet\'i kullanmak için teknik bilgi gerekiyor mu?',
    answer: 'Hayır. Kârnet muhasebe veya teknik bilgisi olmayan satıcılar için tasarlanmıştır. Ürün kategorisini, satış fiyatını ve temel maliyet kalemlerini girmek yeterlidir.',
  },
];

const COMPARISON_ROWS = [
  { feature: 'Trendyol komisyon oranı otomatik', karnet: true, excel: false },
  { feature: 'Hepsiburada komisyon oranı otomatik', karnet: true, excel: false },
  { feature: 'N11 komisyon oranı otomatik', karnet: true, excel: false },
  { feature: 'Amazon TR komisyon oranı otomatik', karnet: true, excel: false },
  { feature: 'İade oranı etkisi hesaplama', karnet: true, excel: false },
  { feature: 'KDV ayrıştırma (PRO Muhasebe)', karnet: true, excel: false },
  { feature: 'Başabaş noktası otomatik', karnet: true, excel: false },
  { feature: 'Nakit akışı tahmini', karnet: true, excel: false },
  { feature: 'Risk skoru (düşük marjlı ürün uyarısı)', karnet: true, excel: false },
  { feature: 'Trendyol API entegrasyonu', karnet: true, excel: false },
  { feature: 'Hepsiburada API entegrasyonu', karnet: true, excel: false },
  { feature: 'Sınırsız PDF rapor', karnet: true, excel: false },
  { feature: 'CSV içe/dışa aktarma', karnet: true, excel: true },
  { feature: 'Ücretsiz kullanım', karnet: true, excel: true },
  { feature: 'Platform bağımsız (web)', karnet: true, excel: false },
  { feature: 'Mobil uyumlu', karnet: true, excel: false },
  { feature: 'Veri güvenliği (şifreli)', karnet: true, excel: false },
];

export default function KarnetVsExcelPage() {
  const faqSchema = faqPageSchema(FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://kârnet.com' },
    { name: 'Kârnet vs Excel', url: 'https://kârnet.com/karnet-vs-excel' },
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
            <span className="text-foreground">Kârnet vs Excel</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-amber-500/12 text-amber-800 dark:text-amber-300">
              Karşılaştırma
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Kârnet vs Excel — Pazaryeri Kâr Hesaplamada Hangisi Daha İyi?
            </h1>

            {/* AI short answer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed">
              <strong className="text-foreground block mb-2">Kısa Yanıt:</strong>
              <p className="text-muted-foreground">
                Pazaryeri kâr hesaplama konusunda Kârnet Excel&apos;den çok daha hızlı ve güvenilirdir.
                Kârnet, Trendyol ve Hepsiburada komisyon oranlarını otomatik bilir, iade etkisini hesaba katar
                ve başabaş noktasını anında gösterir. Excel&apos;de bu hesapları manuel yapmak saatler alır ve
                hata riski yüksektir. Kârnet tamamen ücretsizdir.
              </p>
            </div>
          </div>

          {/* Time comparison */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Zaman Karşılaştırması</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/40 bg-card p-5 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Excel ile</p>
                <p className="text-3xl font-bold text-foreground">3–4 saat</p>
                <p className="text-xs text-muted-foreground">Komisyon tablosu hazırlama, formül yazma, iade hesabı, KDV ayrıştırma, PDF oluşturma</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider">Kârnet ile</p>
                <p className="text-3xl font-bold text-foreground">2 dakika</p>
                <p className="text-xs text-muted-foreground">Ürün bilgilerini gir, komisyon otomatik uygulanır, net kâr anında görünür</p>
              </div>
            </div>
          </section>

          {/* Feature comparison table */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Özellik Karşılaştırması</h2>
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Özellik</th>
                    <th className="text-center px-4 py-3 font-semibold text-amber-700 dark:text-amber-400">Kârnet</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Excel</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-border/30 last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2.5 text-muted-foreground">{row.feature}</td>
                      <td className="px-4 py-2.5 text-center">
                        {row.karnet
                          ? <span className="text-emerald-500 font-bold">✓</span>
                          : <span className="text-red-400">✗</span>}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {row.excel
                          ? <span className="text-emerald-500 font-bold">✓</span>
                          : <span className="text-red-400">✗</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* When to use section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Ne Zaman Ne Kullanmalı?</h2>
            <div className="space-y-3">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-sm font-semibold text-foreground mb-1.5">Kârnet kullanın:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-amber-500 shrink-0">→</span>Trendyol, Hepsiburada, N11 veya Amazon TR&apos;de kâr hesaplamak için</li>
                  <li className="flex gap-2"><span className="text-amber-500 shrink-0">→</span>Başabaş noktası ve nakit akışı tahmini için</li>
                  <li className="flex gap-2"><span className="text-amber-500 shrink-0">→</span>API ile otomatik sipariş ve ürün verisi çekmek için</li>
                  <li className="flex gap-2"><span className="text-amber-500 shrink-0">→</span>Birden fazla platformu karşılaştırmak için</li>
                  <li className="flex gap-2"><span className="text-amber-500 shrink-0">→</span>PDF rapor oluşturmak için</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border/40 bg-card p-4">
                <p className="text-sm font-semibold text-foreground mb-1.5">Excel kullanın:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-muted-foreground shrink-0">→</span>Özel muhasebe veya bütçe modelleri için</li>
                  <li className="flex gap-2"><span className="text-muted-foreground shrink-0">→</span>Karmaşık formül ve makro ihtiyacı olan özel hesaplar için</li>
                  <li className="flex gap-2"><span className="text-muted-foreground shrink-0">→</span>Kurumsal ERP entegrasyonu için</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Excel&apos;i Bırakın, 2 Dakikada Hesaplayın</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Trendyol ve Hepsiburada komisyon oranlarını otomatik bilen Kârnet, her ürün için
              net kâr marjını, başabaş noktasını ve risk skorunu anında hesaplar.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-amber-500/30"
              style={{ background: 'linear-gradient(135deg, #D97706, #92400E)' }}
            >
              Ücretsiz Dene →
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
              { href: '/hepsiburada-kar-hesaplama', label: 'Hepsiburada Kâr Hesaplama' },
              { href: '/pazaryeri-kar-karsilastirma', label: 'Pazaryeri Karşılaştırma' },
              { href: '/nedir', label: 'Kârnet Nedir?' },
              { href: '/sss', label: 'SSS' },
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
