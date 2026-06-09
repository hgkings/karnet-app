import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Trendyol Kâr Hesaplama — Gerçek Net Kâr Nasıl Hesaplanır?',
  description:
    'Trendyol\'da gerçek kârınızı hesaplamak için komisyon, kargo, iade, KDV ve reklam maliyetlerini hesaba katmanız gerekir. Adım adım rehber ve ücretsiz hesaplama aracı.',
  alternates: { canonical: 'https://karnet.com.tr/trendyol-kar-hesaplama' },
  openGraph: {
    title: 'Trendyol Kâr Hesaplama — Gerçek Net Kâr Nasıl Hesaplanır?',
    description:
      'Trendyol komisyon, kargo ve iade maliyetleri dahil gerçek kâr hesaplama rehberi. Ücretsiz araçla 2 dakikada hesaplayın.',
    url: 'https://karnet.com.tr/trendyol-kar-hesaplama',
    type: 'article',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Trendyol\'da kâr nasıl hesaplanır?',
    answer: 'Trendyol\'da net kâr = Satış fiyatı − Trendyol komisyonu − Kargo − Ürün maliyeti − Paketleme − İade payı − Reklam − KDV. Kârnet bu hesabı otomatik yapar.',
  },
  {
    question: 'Trendyol komisyon oranları ne kadar?',
    answer: 'Trendyol komisyon oranları kategoriye göre %8 ile %22 arasında değişir. Elektronik %8–%10, Giyim %18–%22, Kozmetik %15–%20, Ev & Yaşam %14–%18 komisyon alır.',
  },
  {
    question: 'Trendyol\'da başabaş noktası nasıl hesaplanır?',
    answer: 'Başabaş noktası = Ürün maliyeti + Komisyon + Kargo + Paketleme + İade payı. Bu toplamın altındaki fiyatta satmak zarar ettirmektedir.',
  },
  {
    question: 'Trendyol\'da reklam harcaması kâra nasıl etki eder?',
    answer: 'Trendyol sponsorlu ürün reklamları doğrudan kâr marjınızdan gider. Reklam harcamasını ürün başına düşürerek kâr hesabına dahil etmeniz gerekir.',
  },
  {
    question: 'Trendyol\'da kargo maliyeti satıcıdan mı kesilir?',
    answer: 'Ücretsiz kargo kampanyasına dahil olan ürünlerde kargo maliyeti satıcıdan kesilir. Bu miktar ürün ağırlığı ve boyutuna göre değişir.',
  },
];

export default function TrendyolKarHesaplamaPage() {
  const faqSchema = faqPageSchema(FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://karnet.com.tr' },
    { name: 'Trendyol Kâr Hesaplama', url: 'https://karnet.com.tr/trendyol-kar-hesaplama' },
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
            <span className="text-foreground">Trendyol Kâr Hesaplama</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              {/* Trendyol badge */}
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-700 dark:text-orange-400">
                Trendyol
              </span>
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-amber-500/12 text-amber-800 dark:text-amber-300">
                Rehber
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Trendyol&apos;da Gerçek Kârınızı Nasıl Hesaplarsınız?
            </h1>

            {/* AI short answer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed">
              <strong className="text-foreground block mb-2">Kısa Yanıt:</strong>
              <p className="text-muted-foreground">
                Trendyol&apos;da gerçek kâr = Satış fiyatı − (komisyon + kargo + ürün maliyeti + paketleme +
                iade payı + reklam + KDV). Komisyon kategoriye göre %8–%22 arasındadır. Kârnet bu hesabı
                otomatik olarak yapar.
              </p>
            </div>
          </div>

          {/* Why hidden costs matter */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Neden Sadece Satış Fiyatına Bakmak Yetmez?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Trendyol&apos;da 200₺&apos;ye bir ürün sattığınızda bu paranın tamamı size gelmiyor.
              Ürün hesabınıza ulaşmadan önce birden fazla kesinti yapılıyor.
            </p>
            <div className="space-y-2">
              {[
                { label: 'Trendyol komisyonu', value: '%8–%22', note: 'Kategoriye göre otomatik' },
                { label: 'Kargo maliyeti', value: '15–35₺', note: 'Desi ve ağırlığa göre değişir' },
                { label: 'İade kargo ücreti', value: 'Değişken', note: 'İade oranına bağlı' },
                { label: 'Paketleme maliyeti', value: '5–20₺', note: 'Ürüne göre değişir' },
                { label: 'Reklam harcaması', value: 'Değişken', note: 'Sponsorlu ürün/vitrin' },
                { label: 'KDV yükümlülüğü', value: '%1, %10 veya %20', note: 'Ürün kategorisine göre' },
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
            <h2 className="text-2xl font-bold text-foreground">Trendyol Komisyon Oranları 2026</h2>
            <p className="text-sm text-muted-foreground">
              Trendyol komisyon oranları kategoriye göre değişir. Aşağıdaki tablo en yaygın kategoriler
              için güncel oranları göstermektedir.
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
                    { cat: 'Elektronik', rate: '%8 – %10' },
                    { cat: 'Bilgisayar & Tablet', rate: '%8 – %10' },
                    { cat: 'Telefon & Aksesuar', rate: '%10 – %14' },
                    { cat: 'Beyaz Eşya', rate: '%8 – %10' },
                    { cat: 'Giyim & Moda', rate: '%18 – %22' },
                    { cat: 'Kozmetik', rate: '%15 – %20' },
                    { cat: 'Ev & Yaşam', rate: '%14 – %18' },
                    { cat: 'Spor & Outdoor', rate: '%14 – %18' },
                    { cat: 'Anne & Bebek', rate: '%12 – %16' },
                    { cat: 'Kitap & Kırtasiye', rate: '%12 – %15' },
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

          {/* Formula */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Gerçek Kâr Formülü</h2>
            <div className="rounded-xl border border-border/40 bg-card p-5 font-mono text-sm leading-relaxed text-muted-foreground space-y-1">
              <p><span className="text-foreground font-semibold">Net Kâr</span> = Satış Fiyatı</p>
              <p className="pl-8">− Trendyol Komisyonu</p>
              <p className="pl-8">− Kargo Bedeli</p>
              <p className="pl-8">− Ürün Maliyeti</p>
              <p className="pl-8">− Paketleme Maliyeti</p>
              <p className="pl-8">− İade Payı</p>
              <p className="pl-8">− Reklam Harcaması</p>
              <p className="pl-8">− Genel Gider Payı</p>
            </div>

            {/* Example */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Örnek Hesaplama</h3>
              <p className="text-sm text-muted-foreground">300₺ satış fiyatlı giyim ürünü (komisyon %20):</p>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: 'Satış Fiyatı', value: '+300₺', highlight: false },
                      { label: 'Trendyol Komisyonu (%20)', value: '−60₺', highlight: false },
                      { label: 'Kargo', value: '−25₺', highlight: false },
                      { label: 'Ürün Maliyeti', value: '−120₺', highlight: false },
                      { label: 'Paketleme', value: '−8₺', highlight: false },
                      { label: 'İade Payı (%15)', value: '−6,75₺', highlight: false },
                      { label: 'Reklam', value: '−15₺', highlight: false },
                      { label: 'Net Kâr', value: '+65,25₺', highlight: true },
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
                <strong className="text-foreground">Kâr marjı: %21,7.</strong> Başabaş noktası: ~235₺.
                Bu fiyatın altında satmak zarar ettirmektedir.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Kârnet ile Otomatik Hesaplayın</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Trendyol komisyon oranlarını otomatik bilen Kârnet, her ürün için net kâr marjını,
              başabaş noktasını ve risk skorunu 2 dakikada hesaplar. Ücretsiz başlayın.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-amber-500/30"
              style={{ background: 'linear-gradient(135deg, #D97706, #92400E)' }}
            >
              Ücretsiz Hesapla →
            </Link>
            <p className="text-xs text-muted-foreground">Kart bilgisi gerekmez. 3 ürüne kadar ücretsiz.</p>
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
              { href: '/hepsiburada-kar-hesaplama', label: 'Hepsiburada Kâr Hesaplama' },
              { href: '/blog/trendyol-komisyon-oranlari-2026', label: 'Trendyol Komisyon Oranları' },
              { href: '/blog/trendyolda-gercek-kar-nasil-hesaplanir', label: 'Trendyol Kâr Rehberi' },
              { href: '/nedir', label: 'Kârnet Nedir?' },
              { href: '/pricing', label: 'Fiyatlandırma' },
              { href: '/sss', label: 'SSS' },
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
