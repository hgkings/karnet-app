import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Trendyol KDV Hesaplama — Satıcı KDV Nasıl Ayrıştırılır?',
  description:
    'Trendyol satışlarında KDV nasıl hesaplanır? Satış KDV\'si, alış KDV\'si ve ödenecek KDV ayrıştırması. Türkiye KDV oranları (%1, %10, %20) ve ücretsiz hesaplama aracı.',
  alternates: { canonical: 'https://kârnet.com/trendyol-kdv-hesaplama' },
  openGraph: {
    title: 'Trendyol KDV Hesaplama — Satıcı KDV Nasıl Ayrıştırılır?',
    description:
      'Trendyol satıcıları için KDV ayrıştırma rehberi. Satış, alış ve ödenecek KDV hesabı, güncel KDV oranları ve ücretsiz araç.',
    url: 'https://kârnet.com/trendyol-kdv-hesaplama',
    type: 'article',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Trendyol satışında KDV nasıl hesaplanır?',
    answer: 'Satış fiyatı KDV dahildir. KDV hariç tutar = Satış fiyatı / (1 + KDV oranı). Örneğin %20 KDV\'li 120₺ ürünün KDV hariç fiyatı 100₺, içindeki KDV ise 20₺\'dir. Ödenecek KDV = Satış KDV\'si − Alış (gider) KDV\'si formülüyle bulunur.',
  },
  {
    question: 'Türkiye\'de güncel KDV oranları nedir?',
    answer: 'Türkiye\'de üç temel KDV oranı vardır: %1 (temel gıda, bazı tarım ürünleri), %10 (gıda, tekstil dahil birçok ürün) ve %20 (genel oran — elektronik, kozmetik vb.). Ürününüzün hangi orana tabi olduğunu doğru belirlemek kâr hesabı için kritiktir.',
  },
  {
    question: 'KDV dahil mi hariç mi satış yapıyorum?',
    answer: 'Trendyol\'da listelediğiniz fiyat KDV dahildir. Yani müşteriden tahsil ettiğiniz tutarın içinde KDV vardır ve bunu devlete ödemekle yükümlüsünüz. Bu yüzden gerçek kâr hesabında KDV\'yi ayrıştırmak gerekir.',
  },
  {
    question: 'Ödenecek KDV nasıl bulunur?',
    answer: 'Ödenecek KDV = Satışlardan tahsil edilen KDV − Alış ve giderlerde ödediğiniz KDV. Mal alışınızda ödediğiniz KDV\'yi indirim konusu yaparsınız. Net pozitif fark devlete ödenir.',
  },
  {
    question: 'Kârnet KDV ayrıştırması yapıyor mu?',
    answer: 'Evet. Kârnet\'in PRO Muhasebe Modu (tüm kullanıcılar için ücretsiz) satış KDV\'si, alış KDV\'si ve gider KDV\'sini ayrı ayrı hesaplayarak net vergi pozisyonunu ve KDV sonrası gerçek net kârı gösterir.',
  },
];

export default function TrendyolKdvHesaplamaPage() {
  const faqSchema = faqPageSchema(FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://kârnet.com' },
    { name: 'Trendyol KDV Hesaplama', url: 'https://kârnet.com/trendyol-kdv-hesaplama' },
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
            <span className="text-foreground">KDV Hesaplama</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-700 dark:text-orange-400">
                Trendyol
              </span>
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-amber-500/12 text-amber-800 dark:text-amber-300">
                KDV & Muhasebe
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Trendyol KDV Hesaplama — Satıcı KDV Nasıl Ayrıştırılır?
            </h1>

            {/* AI short answer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed">
              <strong className="text-foreground block mb-2">Kısa Yanıt:</strong>
              <p className="text-muted-foreground">
                Trendyol&apos;da listelenen satış fiyatı KDV dahildir. KDV hariç tutar = Satış fiyatı / (1 + KDV oranı).
                Ödenecek KDV = Satış KDV&apos;si − Alış/gider KDV&apos;si. Türkiye&apos;de oranlar %1, %10 ve %20&apos;dir.
                Gerçek net kârı görmek için KDV&apos;yi ayrıştırmak şarttır. Kârnet&apos;in PRO Muhasebe Modu bunu otomatik yapar.
              </p>
            </div>
          </div>

          {/* KDV rates */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Türkiye KDV Oranları 2026</h2>
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">KDV Oranı</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Örnek Ürün Grupları</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { oran: '%1', urun: 'Temel gıda, bazı tarım ürünleri' },
                    { oran: '%10', urun: 'Gıda, tekstil ve birçok temel tüketim ürünü' },
                    { oran: '%20', urun: 'Genel oran: elektronik, kozmetik, aksesuar vb.' },
                  ].map((row, i) => (
                    <tr key={row.oran} className={`border-b border-border/30 last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2.5 font-medium text-foreground">{row.oran}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{row.urun}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              * Ürün grubunuzun tabi olduğu kesin KDV oranı için mali müşavirinize veya GİB tebliğlerine danışın. Oranlar mevzuatla değişebilir.
            </p>
          </section>

          {/* Formula */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">KDV Ayrıştırma Formülü</h2>
            <div className="rounded-xl border border-border/40 bg-card p-5 font-mono text-sm leading-relaxed text-muted-foreground space-y-2">
              <p><span className="text-foreground font-semibold">KDV Hariç Fiyat</span> = Satış Fiyatı / (1 + KDV Oranı)</p>
              <p><span className="text-foreground font-semibold">İçindeki KDV</span> = Satış Fiyatı − KDV Hariç Fiyat</p>
              <p><span className="text-foreground font-semibold">Ödenecek KDV</span> = Satış KDV&apos;si − Alış/Gider KDV&apos;si</p>
            </div>

            {/* Example */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Örnek Hesaplama (%20 KDV)</h3>
              <p className="text-sm text-muted-foreground">120₺ satış fiyatlı kozmetik ürünü, 60₺&apos;ye (KDV dahil) alındı:</p>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: 'Satış Fiyatı (KDV dahil)', value: '120₺', highlight: false },
                      { label: 'KDV Hariç Satış (120 / 1,20)', value: '100₺', highlight: false },
                      { label: 'Satış KDV\'si', value: '20₺', highlight: false },
                      { label: 'Alış KDV\'si (60 / 1,20 = 50; KDV)', value: '10₺', highlight: false },
                      { label: 'Ödenecek KDV (20 − 10)', value: '10₺', highlight: true },
                    ].map((row) => (
                      <tr key={row.label} className={`border-b border-border/30 last:border-b-0 ${row.highlight ? 'bg-amber-500/5 font-bold' : ''}`}>
                        <td className={`px-4 py-2.5 ${row.highlight ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>{row.label}</td>
                        <td className={`px-4 py-2.5 text-right font-medium ${row.highlight ? 'text-amber-600 dark:text-amber-400 text-base' : 'text-foreground'}`}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground">
                Bu örnekte devlete <strong className="text-foreground">10₺ KDV</strong> ödersiniz. Kâr hesabında bu tutarı
                dikkate almazsanız gerçek kârınızı 10₺ fazla görürsünüz.
              </p>
            </div>
          </section>

          {/* Why it matters */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">KDV&apos;yi Neden Ayrıştırmalısınız?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Trendyol satıcıları sık sık satış fiyatının tamamını gelir sanar. Oysa fiyatın içindeki KDV
              size ait değildir — devlete ödenir. KDV&apos;yi ayrıştırmadan yapılan kâr hesabı, gerçek kârı
              olduğundan yüksek gösterir ve fiyatlandırma hatalarına yol açar.
            </p>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">KDV Dahil Gerçek Net Kâr</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Kârnet&apos;in PRO Muhasebe Modu satış, alış ve gider KDV&apos;sini ayrıştırarak net vergi
              pozisyonunuzu ve KDV sonrası gerçek kârınızı gösterir. Tamamen ücretsiz.
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
              { href: '/trendyol-reklam-maliyeti-hesaplama', label: 'Trendyol Reklam Maliyeti' },
              { href: '/blog/trendyol-komisyon-oranlari-2026', label: 'Trendyol Komisyon Oranları' },
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
