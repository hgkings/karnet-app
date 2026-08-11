import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Amazon Türkiye Kâr Hesaplama — Gerçek Net Kâr Nasıl Hesaplanır?',
  description:
    'Amazon Türkiye\'de gerçek kârınızı hesaplamak için komisyon, kargo, FBA ücretleri, iade, KDV ve reklam maliyetlerini hesaba katmanız gerekir. Adım adım rehber ve ücretsiz hesaplama aracı.',
  alternates: { canonical: 'https://kârnet.com/amazon-turkiye-kar-hesaplama' },
  openGraph: {
    title: 'Amazon Türkiye Kâr Hesaplama — Gerçek Net Kâr Nasıl Hesaplanır?',
    description:
      'Amazon TR komisyon, FBA ve iade maliyetleri dahil gerçek kâr hesaplama rehberi. Ücretsiz araçla 2 dakikada hesaplayın.',
    url: 'https://kârnet.com/amazon-turkiye-kar-hesaplama',
    type: 'article',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Amazon Türkiye\'de kâr nasıl hesaplanır?',
    answer: 'Amazon TR\'de net kâr = Satış fiyatı − Amazon komisyonu − Kargo/FBA ücreti − Ürün maliyeti − Paketleme − İade payı − Reklam − KDV. Kârnet bu hesabı otomatik yapar.',
  },
  {
    question: 'Amazon Türkiye komisyon oranları ne kadar?',
    answer: 'Amazon TR komisyon oranları kategoriye göre %7 ile %15 arasında değişir. Elektronik/Bilgisayar %7–%8, Giyim %15, Kozmetik %15, Ev & Mutfak %12–%15 komisyon alır.',
  },
  {
    question: 'Amazon Türkiye\'de FBA ücreti nedir?',
    answer: 'Amazon FBA (Fulfillment by Amazon) ücreti, depolama ve kargo işlemlerini Amazon\'un üstlendiği programın ücretidir. Ürün boyutu ve ağırlığına göre değişir. Kârnet bu maliyeti kargo kalemine dahil edebilir.',
  },
  {
    question: 'Amazon Türkiye\'de iade oranı yüksek mi?',
    answer: 'Amazon TR\'de iade oranları genellikle diğer Türk pazaryerlerine kıyasla %3 daha yüksek olabilir. Kârnet, iade etkisini otomatik hesaplayarak gerçek kâr marjını gösterir.',
  },
  {
    question: 'Amazon Türkiye ile Trendyol\'u kârlılık açısından nasıl karşılaştırabilirim?',
    answer: 'Kârnet, aynı ürün için Amazon TR ve Trendyol kârlılığını yan yana gösterir. Komisyon, kargo ve iade maliyetleri hesaba katılarak hangi platformun daha kârlı olduğunu hızla görebilirsiniz.',
  },
];

export default function AmazonTurkiyeKarHesaplamaPage() {
  const faqSchema = faqPageSchema(FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://kârnet.com' },
    { name: 'Amazon Türkiye Kâr Hesaplama', url: 'https://kârnet.com/amazon-turkiye-kar-hesaplama' },
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
            <span className="text-foreground">Amazon Türkiye Kâr Hesaplama</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                Amazon Türkiye
              </span>
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-amber-500/12 text-amber-800 dark:text-amber-300">
                Rehber
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Amazon Türkiye&apos;de Gerçek Kârınızı Nasıl Hesaplarsınız?
            </h1>

            {/* AI short answer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed">
              <strong className="text-foreground block mb-2">Kısa Yanıt:</strong>
              <p className="text-muted-foreground">
                Amazon TR&apos;de gerçek kâr = Satış fiyatı − (Amazon komisyonu + kargo/FBA ücreti + ürün maliyeti +
                paketleme + iade payı + reklam + KDV). Komisyon kategoriye göre %7–%15 arasındadır.
                Kârnet bu hesabı otomatik olarak yapar.
              </p>
            </div>
          </div>

          {/* Hidden costs */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Amazon TR&apos;de Gizli Maliyetler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Amazon Türkiye&apos;de satışlarınızdan platformun kestiği ücretler başlangıçta görünmez.
              Komisyon, kargo ve iade maliyetlerini hesaplamadan gerçek kârı bilemezsiniz.
            </p>
            <div className="space-y-2">
              {[
                { label: 'Amazon komisyonu', value: '%7–%15', note: 'Kategoriye göre otomatik' },
                { label: 'Kargo / FBA ücreti', value: '15–45₺', note: 'Boyut ve ağırlığa göre' },
                { label: 'İade maliyeti', value: 'Değişken', note: '+%3 ek iade oranı riski' },
                { label: 'Paketleme', value: '5–20₺', note: 'FBA veya kendi kargo' },
                { label: 'Amazon Ads', value: 'Değişken', note: 'Sponsorlu ürün (PPC)' },
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
            <h2 className="text-2xl font-bold text-foreground">Amazon Türkiye Komisyon Oranları 2026</h2>
            <p className="text-sm text-muted-foreground">
              Amazon TR komisyon oranları, elektronik ve bilgisayar kategorilerinde oldukça rekabetçidir.
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
                    { cat: 'Bilgisayar & Tablet', rate: '%7 – %8' },
                    { cat: 'Telefon & Aksesuar', rate: '%12 – %15' },
                    { cat: 'Beyaz Eşya', rate: '%8 – %10' },
                    { cat: 'Giyim & Moda', rate: '%15' },
                    { cat: 'Kozmetik & Bakım', rate: '%15' },
                    { cat: 'Ev & Mutfak', rate: '%12 – %15' },
                    { cat: 'Spor & Outdoor', rate: '%12 – %15' },
                    { cat: 'Anne & Bebek', rate: '%10 – %12' },
                    { cat: 'Kitap', rate: '%15' },
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
              * Oranlar dönemsel olarak değişebilir. Güncel oranlar için Amazon Seller Central hesabınızı kontrol edin.
            </p>
          </section>

          {/* Formula + Example */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Gerçek Kâr Formülü</h2>
            <div className="rounded-xl border border-border/40 bg-card p-5 font-mono text-sm leading-relaxed text-muted-foreground space-y-1">
              <p><span className="text-foreground font-semibold">Net Kâr</span> = Satış Fiyatı</p>
              <p className="pl-8">− Amazon Komisyonu</p>
              <p className="pl-8">− Kargo / FBA Ücreti</p>
              <p className="pl-8">− Ürün Maliyeti</p>
              <p className="pl-8">− Paketleme Maliyeti</p>
              <p className="pl-8">− İade Payı</p>
              <p className="pl-8">− Amazon Ads Harcaması</p>
              <p className="pl-8">− Genel Gider Payı</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Örnek Hesaplama</h3>
              <p className="text-sm text-muted-foreground">350₺ satış fiyatlı elektronik aksesuar (komisyon %15):</p>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: 'Satış Fiyatı', value: '+350₺', highlight: false },
                      { label: 'Amazon Komisyonu (%15)', value: '−52,50₺', highlight: false },
                      { label: 'Kargo', value: '−28₺', highlight: false },
                      { label: 'Ürün Maliyeti', value: '−140₺', highlight: false },
                      { label: 'Paketleme', value: '−8₺', highlight: false },
                      { label: 'İade Payı (%13)', value: '−7,80₺', highlight: false },
                      { label: 'Amazon Ads', value: '−18₺', highlight: false },
                      { label: 'Net Kâr', value: '+95,70₺', highlight: true },
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
                <strong className="text-foreground">Kâr marjı: %27,3.</strong> Başabaş noktası: ~254₺.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Kârnet ile Otomatik Hesaplayın</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Amazon TR komisyon oranlarını otomatik bilen Kârnet, her ürün için net kâr marjını,
              başabaş noktasını ve platform karşılaştırmasını 2 dakikada hesaplar. Ücretsizdir.
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
              { href: '/n11-kar-hesaplama', label: 'N11 Kâr Hesaplama' },
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
