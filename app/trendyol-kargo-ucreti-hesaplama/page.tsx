import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Trendyol Kargo Ücreti Hesaplama — Desi Nasıl Hesaplanır?',
  description:
    'Trendyol kargo ücreti desi (hacimsel ağırlık) üzerinden hesaplanır. Desi = (en × boy × yükseklik) / 3000. Kargo bedelinin kâra etkisini ve ücretsiz hesaplama aracını öğrenin.',
  alternates: { canonical: 'https://kârnet.com/trendyol-kargo-ucreti-hesaplama' },
  openGraph: {
    title: 'Trendyol Kargo Ücreti Hesaplama — Desi Nasıl Hesaplanır?',
    description:
      'Trendyol kargo bedeli desi üzerinden belirlenir. Desi hesabı, kargo maliyetinin kâra etkisi ve ücretsiz araç.',
    url: 'https://kârnet.com/trendyol-kargo-ucreti-hesaplama',
    type: 'article',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Trendyol kargo ücreti nasıl hesaplanır?',
    answer: 'Trendyol kargo ücreti, ürünün desi (hacimsel ağırlık) değerine göre belirlenir. Desi = (en × boy × yükseklik) / 3000 formülüyle bulunur. Çıkan desi değeri ürünün gerçek ağırlığıyla karşılaştırılır ve büyük olan değer üzerinden kargo bedeli uygulanır.',
  },
  {
    question: 'Desi nedir ve nasıl hesaplanır?',
    answer: 'Desi, bir kolinin kapladığı hacmi ağırlığa çeviren ölçü birimidir. Formül: Desi = (en cm × boy cm × yükseklik cm) / 3000. Örneğin 30×20×15 cm bir koli için desi = (30×20×15)/3000 = 3 desi olur.',
  },
  {
    question: 'Trendyol kargo bedeli kimden kesilir?',
    answer: 'Ücretsiz kargo kampanyasına dahil olan ürünlerde kargo bedeli satıcıdan kesilir. Trendyol\'da çoğu kategori ücretsiz kargo eşiğine tabidir, bu yüzden kargo maliyeti net kârınızdan düşülür.',
  },
  {
    question: 'Düşük fiyatlı üründe kargo neden kârı eritir?',
    answer: '50₺ bir üründe 25₺ kargo, satış fiyatının yarısı demektir. Düşük fiyatlı ürünlerde kargo maliyeti orantısal olarak çok yüksek kalır. Bu yüzden başabaş noktası hesabında kargoyu mutlaka dahil etmek gerekir.',
  },
  {
    question: 'Trendyol kargo ücreti kârıma ne kadar etki ediyor?',
    answer: 'Kârnet, ürünün desi değerini ve kargo bedelini analize dahil ederek net kâr marjını otomatik hesaplar. Böylece kargonun kârınızı ne kadar düşürdüğünü tam olarak görürsünüz.',
  },
];

const DESI_EXAMPLES = [
  { boyut: '20 × 15 × 10 cm', desi: '1 desi', ornek: 'Telefon kılıfı, küçük aksesuar' },
  { boyut: '30 × 20 × 15 cm', desi: '3 desi', ornek: 'Ayakkabı, orta kutu' },
  { boyut: '40 × 30 × 20 cm', desi: '8 desi', ornek: 'Mont, büyük tekstil' },
  { boyut: '50 × 40 × 30 cm', desi: '20 desi', ornek: 'Küçük ev aleti' },
];

export default function TrendyolKargoUcretiHesaplamaPage() {
  const faqSchema = faqPageSchema(FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://kârnet.com' },
    { name: 'Trendyol Kargo Ücreti Hesaplama', url: 'https://kârnet.com/trendyol-kargo-ucreti-hesaplama' },
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
            <span className="text-foreground">Kargo Ücreti Hesaplama</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-700 dark:text-orange-400">
                Trendyol
              </span>
              <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-amber-500/12 text-amber-800 dark:text-amber-300">
                Kargo & Desi
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Trendyol Kargo Ücreti Hesaplama — Desi Nasıl Hesaplanır?
            </h1>

            {/* AI short answer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed">
              <strong className="text-foreground block mb-2">Kısa Yanıt:</strong>
              <p className="text-muted-foreground">
                Trendyol kargo ücreti, ürünün <strong className="text-foreground">desi (hacimsel ağırlık)</strong> değerine
                göre belirlenir. Desi = (en × boy × yükseklik) / 3000. Çıkan desi ile ürünün gerçek ağırlığından
                büyük olan değer üzerinden kargo bedeli uygulanır. Ücretsiz kargo kampanyasındaki ürünlerde bu
                bedel satıcıdan kesilir ve net kârdan düşülür. Kârnet bu maliyeti kâr hesabına otomatik dahil eder.
              </p>
            </div>
          </div>

          {/* Formula */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Desi Hesaplama Formülü</h2>
            <div className="rounded-xl border border-border/40 bg-card p-5 font-mono text-sm leading-relaxed text-foreground">
              <p>Desi = (En × Boy × Yükseklik) / 3000</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ölçüler santimetre cinsindendir. Çıkan desi değeri ile ürünün <strong className="text-foreground">gerçek (brüt) ağırlığı</strong> karşılaştırılır;
              kargo firması <strong className="text-foreground">hangisi büyükse</strong> onu esas alır. Hafif ama hacimli ürünlerde (örneğin yastık) desi,
              gerçek ağırlıktan yüksek çıkar ve kargo bedelini belirler.
            </p>
          </section>

          {/* Desi examples table */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Örnek Desi Değerleri</h2>
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Koli Ölçüsü</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Desi</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Tipik Ürün</th>
                  </tr>
                </thead>
                <tbody>
                  {DESI_EXAMPLES.map((row, i) => (
                    <tr key={row.boyut} className={`border-b border-border/30 last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{row.boyut}</td>
                      <td className="px-4 py-2.5 text-center font-medium text-foreground">{row.desi}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{row.ornek}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              * Kargo bedeli desiye göre kademeli artar. Güncel desi-fiyat tablosu için Trendyol satıcı panelinizi kontrol edin; oranlar dönemsel değişir.
            </p>
          </section>

          {/* Impact on profit */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Kargonun Kâra Etkisi</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kargo maliyeti, özellikle düşük fiyatlı ürünlerde kârı en çok eriten kalemlerden biridir.
              Aynı 25₺ kargo bedeli, farklı satış fiyatlarında çok farklı etki yapar:
            </p>
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Satış Fiyatı</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Kargo</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">Kargonun Fiyata Oranı</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { fiyat: '50₺', oran: '%50' },
                    { fiyat: '100₺', oran: '%25' },
                    { fiyat: '250₺', oran: '%10' },
                    { fiyat: '500₺', oran: '%5' },
                  ].map((row, i) => (
                    <tr key={row.fiyat} className={`border-b border-border/30 last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2.5 text-muted-foreground">{row.fiyat}</td>
                      <td className="px-4 py-2.5 text-center text-foreground">25₺</td>
                      <td className="px-4 py-2.5 text-right font-medium text-foreground">{row.oran}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Sonuç:</strong> 50₺ ürün satıyorsanız kargo, fiyatın yarısını yer.
              Bu yüzden düşük fiyatlı ürünlerde ya fiyatı yükseltmek ya da sepet birleştirme stratejisi gerekir.
            </p>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Kargoyu Dahil Eden Gerçek Kâr Hesabı</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Kârnet, ürünün desi değerini ve kargo bedelini komisyon, iade ve KDV ile birlikte hesaba
              katarak net kâr marjını 2 dakikada gösterir. Tamamen ücretsiz.
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
              { href: '/trendyol-kdv-hesaplama', label: 'Trendyol KDV Hesaplama' },
              { href: '/trendyol-reklam-maliyeti-hesaplama', label: 'Trendyol Reklam Maliyeti' },
              { href: '/blog/trendyol-komisyon-oranlari-2026', label: 'Trendyol Komisyon Oranları' },
              { href: '/blog/trendyol-basbas-noktasi-hesaplama', label: 'Başabaş Noktası Hesaplama' },
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
