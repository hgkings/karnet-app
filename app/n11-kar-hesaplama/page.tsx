import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'N11 Kâr Hesaplama — Gerçek Net Kâr Nasıl Hesaplanır?',
  description:
    'N11\'de gerçek kârınızı hesaplamak için komisyon, kargo, iade, KDV ve reklam maliyetlerini hesaba katmanız gerekir. Adım adım rehber ve ücretsiz hesaplama aracı.',
  alternates: { canonical: 'https://kârnet.com/n11-kar-hesaplama' },
  openGraph: {
    title: 'N11 Kâr Hesaplama — Gerçek Net Kâr Nasıl Hesaplanır?',
    description:
      'N11 komisyon, kargo ve iade maliyetleri dahil gerçek kâr hesaplama rehberi. Ücretsiz araçla 2 dakikada hesaplayın.',
    url: 'https://kârnet.com/n11-kar-hesaplama',
    type: 'article',
  },
};

const FAQ_ITEMS = [
  {
    question: 'N11\'de kâr nasıl hesaplanır?',
    answer: 'N11\'de net kâr = Satış fiyatı − N11 komisyonu − Kargo − Ürün maliyeti − Paketleme − İade payı − Reklam − KDV. Kârnet bu hesabı otomatik yapar.',
  },
  {
    question: 'N11 komisyon oranları ne kadar?',
    answer: 'N11 komisyon oranları kategoriye göre %8 ile %16 arasında değişir. Elektronik %8, Giyim %16, Kozmetik %14, Ev & Yaşam %12–%14 komisyon alır.',
  },
  {
    question: 'N11\'de başabaş noktası nasıl hesaplanır?',
    answer: 'Başabaş noktası = Ürün maliyeti + N11 komisyonu + Kargo + Paketleme + İade payı toplamıdır. Bu tutarın altında satmak zarar ettirmektedir.',
  },
  {
    question: 'N11\'de kargo maliyeti satıcıdan mı kesilir?',
    answer: 'Ücretsiz kargo kampanyasına dahil olan ürünlerde kargo maliyeti satıcıdan kesilir. Desi ve ağırlığa göre değişen kargo bedeli hesaba katılmalıdır.',
  },
  {
    question: 'N11 ile Trendyol\'u kârlılık açısından nasıl karşılaştırabilirim?',
    answer: 'Kârnet, aynı ürün için N11 ve Trendyol kârlılığını yan yana gösterir. Hangi pazaryerinde daha fazla kâr edeceğinizi kolayca görebilirsiniz.',
  },
];

export default function N11KarHesaplamaPage() {
  const faqSchema = faqPageSchema(FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://kârnet.com' },
    { name: 'N11 Kâr Hesaplama', url: 'https://kârnet.com/n11-kar-hesaplama' },
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
            <span className="text-foreground">N11 Kâr Hesaplama</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400">
                N11
              </span>
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-amber-500/12 text-amber-800 dark:text-amber-300">
                Rehber
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              N11&apos;de Gerçek Kârınızı Nasıl Hesaplarsınız?
            </h1>

            {/* AI short answer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed">
              <strong className="text-foreground block mb-2">Kısa Yanıt:</strong>
              <p className="text-muted-foreground">
                N11&apos;de gerçek kâr = Satış fiyatı − (N11 komisyonu + kargo + ürün maliyeti + paketleme +
                iade payı + reklam + KDV). N11 komisyon oranları kategoriye göre %8–%16 arasındadır.
                Kârnet bu hesabı otomatik olarak yapar.
              </p>
            </div>
          </div>

          {/* Hidden costs */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">N11&apos;de Gizli Maliyetler</h2>
            <p className="text-muted-foreground leading-relaxed">
              N11&apos;de 200₺&apos;ye ürün sattığınızda bu paranın tamamı hesabınıza gelmiyor.
              Komisyon, kargo ve iade maliyetleri düşüldükten sonra kalan gerçek kârdır.
            </p>
            <div className="space-y-2">
              {[
                { label: 'N11 komisyonu', value: '%8–%16', note: 'Kategoriye göre otomatik' },
                { label: 'Kargo maliyeti', value: '15–35₺', note: 'Desi ve ağırlığa göre' },
                { label: 'İade maliyeti', value: 'Değişken', note: 'Dönüş kargo + stok kaybı' },
                { label: 'Paketleme', value: '5–15₺', note: 'Kutu, bant, etiket' },
                { label: 'Reklam harcaması', value: 'Değişken', note: 'N11 Reklam' },
                { label: 'KDV', value: '%1, %10 veya %20', note: 'Ürün kategorisine göre' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border/30 bg-card px-4 py-3">
                  <span className="text-red-500 font-bold text-sm shrink-0">−</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">({item.note})</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground shrink-0">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Commission table */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">N11 Komisyon Oranları 2026</h2>
            <p className="text-sm text-muted-foreground">
              N11 komisyon oranları genellikle Trendyol ve Hepsiburada&apos;ya kıyasla biraz daha düşüktür.
            </p>
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Kategori</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">Komisyon</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Elektronik', rate: '%8' },
                    { cat: 'Bilgisayar & Tablet', rate: '%8' },
                    { cat: 'Telefon & Aksesuar', rate: '%10 – %12' },
                    { cat: 'Beyaz Eşya', rate: '%8 – %10' },
                    { cat: 'Giyim & Moda', rate: '%14 – %16' },
                    { cat: 'Kozmetik', rate: '%12 – %14' },
                    { cat: 'Ev & Yaşam', rate: '%12 – %14' },
                    { cat: 'Spor & Outdoor', rate: '%12 – %14' },
                    { cat: 'Anne & Bebek', rate: '%10 – %12' },
                    { cat: 'Kitap & Kırtasiye', rate: '%10 – %12' },
                  ].map((row, i) => (
                    <tr key={row.cat} className={`border-b border-border/30 last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2.5 text-muted-foreground">{row.cat}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-foreground">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              * Oranlar dönemsel olarak değişebilir. Güncel oranlar için satıcı panelinizi kontrol edin.
            </p>
          </section>

          {/* Formula + Example */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Gerçek Kâr Formülü</h2>
            <div className="rounded-xl border border-border/40 bg-card p-5 font-mono text-sm leading-relaxed text-muted-foreground space-y-1">
              <p><span className="text-foreground font-semibold">Net Kâr</span> = Satış Fiyatı</p>
              <p className="pl-8">− N11 Komisyonu</p>
              <p className="pl-8">− Kargo Bedeli</p>
              <p className="pl-8">− Ürün Maliyeti</p>
              <p className="pl-8">− Paketleme Maliyeti</p>
              <p className="pl-8">− İade Payı</p>
              <p className="pl-8">− Reklam Harcaması</p>
              <p className="pl-8">− Genel Gider Payı</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Örnek Hesaplama</h3>
              <p className="text-sm text-muted-foreground">250₺ satış fiyatlı giyim ürünü (N11 komisyon %14):</p>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: 'Satış Fiyatı', value: '+250₺', highlight: false },
                      { label: 'N11 Komisyonu (%14)', value: '−35₺', highlight: false },
                      { label: 'Kargo', value: '−22₺', highlight: false },
                      { label: 'Ürün Maliyeti', value: '−100₺', highlight: false },
                      { label: 'Paketleme', value: '−7₺', highlight: false },
                      { label: 'İade Payı (%12)', value: '−4,80₺', highlight: false },
                      { label: 'Reklam', value: '−10₺', highlight: false },
                      { label: 'Net Kâr', value: '+71,20₺', highlight: true },
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
                <strong className="text-foreground">Kâr marjı: %28,5.</strong> Başabaş noktası: ~178₺.
              </p>
            </div>
          </section>

          {/* N11 vs Trendyol comparison hint */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">N11 ile Diğer Pazaryerlerini Karşılaştırın</h2>
            <p className="text-muted-foreground leading-relaxed">
              Aynı ürünü Trendyol, Hepsiburada veya N11&apos;de satmak farklı kâr marjı doğurur.
              Kârnet, her platform için kâr hesabını yan yana göstererek en kârlı seçeneği belirlemenizi sağlar.
            </p>
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Maliyet Kalemi</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Trendyol</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Hepsiburada</th>
                    <th className="text-center px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">N11</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Giyim Komisyonu', trendyol: '%18–22', hb: '%18–22', n11: '%14–16' },
                    { label: 'Elektronik Komisyonu', trendyol: '%8–10', hb: '%8–12', n11: '%8' },
                    { label: 'Kozmetik Komisyonu', trendyol: '%15–20', hb: '%15–20', n11: '%12–14' },
                    { label: 'Kargo (ort.)', trendyol: '25₺', hb: '28₺', n11: '22₺' },
                  ].map((row, i) => (
                    <tr key={row.label} className={`border-b border-border/30 last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2.5 text-muted-foreground">{row.label}</td>
                      <td className="px-4 py-2.5 text-center text-foreground">{row.trendyol}</td>
                      <td className="px-4 py-2.5 text-center text-foreground">{row.hb}</td>
                      <td className="px-4 py-2.5 text-center font-medium text-blue-600 dark:text-blue-400">{row.n11}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Kârnet ile Otomatik Hesaplayın</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              N11 komisyon oranlarını otomatik bilen Kârnet, her ürün için net kâr marjını,
              başabaş noktasını ve platform karşılaştırmasını 2 dakikada hesaplar.
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
              { href: '/hepsiburada-kar-hesaplama', label: 'Hepsiburada Kâr Hesaplama' },
              { href: '/amazon-turkiye-kar-hesaplama', label: 'Amazon Türkiye Kâr Hesaplama' },
              { href: '/pazaryeri-kar-karsilastirma', label: 'Pazaryeri Karşılaştırma' },
              { href: '/nedir', label: 'Kârnet Nedir?' },
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
