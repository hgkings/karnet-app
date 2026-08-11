import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Pazaryeri Kâr Karşılaştırma — Trendyol, Hepsiburada, N11, Amazon TR',
  description:
    'Trendyol, Hepsiburada, N11 ve Amazon Türkiye komisyon oranlarını ve kârlılıklarını karşılaştırın. Hangi pazaryerinde daha fazla kazandığınızı öğrenin.',
  alternates: { canonical: 'https://kârnet.com/pazaryeri-kar-karsilastirma' },
  openGraph: {
    title: 'Pazaryeri Kâr Karşılaştırma — Trendyol, Hepsiburada, N11, Amazon TR',
    description:
      'Türkiye\'nin 4 büyük pazaryerini komisyon, kâr marjı ve maliyet açısından karşılaştırın. Kârnet ile hangi platformun sizin için en kârlı olduğunu bulun.',
    url: 'https://kârnet.com/pazaryeri-kar-karsilastirma',
    type: 'article',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Trendyol mu, Hepsiburada mu daha kârlı?',
    answer: 'Bu sorunun cevabı ürün kategorisine bağlıdır. Giyimde Trendyol daha yüksek hacme sahipken komisyon oranları da yüksektir (%18–22). Hepsiburada\'da komisyonlar benzerdir. Kârnet her iki platform için kâr hesaplayarak karşılaştırma yapar.',
  },
  {
    question: 'N11\'de komisyonlar gerçekten daha düşük mü?',
    answer: 'Evet, N11 komisyon oranları genel olarak Trendyol ve Hepsiburada\'ya kıyasla 2–4 puan daha düşük seyreder. Ancak satış hacmi de farklıdır. Kârnet her platformu kârlılık açısından değerlendirir.',
  },
  {
    question: 'Amazon TR\'de elektronik satmak kârlı mı?',
    answer: 'Amazon TR\'de elektronik komisyonu %7–%8 gibi düşük bir seviyededir. Bu, Trendyol ve Hepsiburada\'ya göre avantajlıdır. Ancak FBA ücreti ve reklam maliyetlerini de hesaba katmak gerekir.',
  },
  {
    question: 'Çoklu pazaryerinde satış yapmak mantıklı mı?',
    answer: 'Ürüne göre değişir. Bazı ürünler bir platformda daha fazla satarken diğerinde daha az maliyetle satılabilir. Kârnet her platform için kâr analizini ayrı ayrı yaparak kararı kolaylaştırır.',
  },
  {
    question: 'Hangi pazaryeri kargo maliyeti en düşük?',
    answer: 'Kargo maliyetleri desi ve ağırlığa göre tüm platformlarda değişir. N11\'de ortalama kargo maliyeti biraz daha düşük olabilir. Kârnet her analiz için güncel kargo bedelini hesaba katar.',
  },
];

const COMMISSION_DATA = [
  { category: 'Giyim & Moda', trendyol: '%18–22', hepsiburada: '%18–22', n11: '%14–16', amazon: '%15' },
  { category: 'Elektronik', trendyol: '%8–10', hepsiburada: '%8–12', n11: '%8', amazon: '%8' },
  { category: 'Bilgisayar & Tablet', trendyol: '%8–10', hepsiburada: '%8–12', n11: '%8', amazon: '%7–8' },
  { category: 'Telefon & Aksesuar', trendyol: '%10–14', hepsiburada: '%10–15', n11: '%10–12', amazon: '%12–15' },
  { category: 'Kozmetik', trendyol: '%15–20', hepsiburada: '%15–20', n11: '%12–14', amazon: '%15' },
  { category: 'Ev & Yaşam', trendyol: '%14–18', hepsiburada: '%12–18', n11: '%12–14', amazon: '%12–15' },
  { category: 'Spor & Outdoor', trendyol: '%14–18', hepsiburada: '%14–18', n11: '%12–14', amazon: '%12–15' },
  { category: 'Anne & Bebek', trendyol: '%12–16', hepsiburada: '%12–16', n11: '%10–12', amazon: '%10–12' },
  { category: 'Beyaz Eşya', trendyol: '%8–10', hepsiburada: '%8–10', n11: '%8–10', amazon: '%8–10' },
  { category: 'Kitap & Kırtasiye', trendyol: '%12–15', hepsiburada: '%12–15', n11: '%10–12', amazon: '%15' },
];

export default function PazaryeriKarKarsilastirmaPage() {
  const faqSchema = faqPageSchema(FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://kârnet.com' },
    { name: 'Pazaryeri Kâr Karşılaştırma', url: 'https://kârnet.com/pazaryeri-kar-karsilastirma' },
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-14">

          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Link href="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-foreground">Pazaryeri Kâr Karşılaştırma</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <span className="inline-block rounded-lg px-3 py-1 text-xs font-semibold bg-amber-500/12 text-amber-800 dark:text-amber-300">
              Karşılaştırma
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Trendyol, Hepsiburada, N11 ve Amazon TR — Hangi Pazaryerinde Daha Fazla Kazanırsınız?
            </h1>

            {/* AI short answer */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-relaxed">
              <strong className="text-foreground block mb-2">Kısa Yanıt:</strong>
              <p className="text-muted-foreground">
                Türkiye&apos;nin dört büyük pazaryerinde komisyon oranları ve maliyetler farklıdır.
                En kârlı platform ürün kategorisine göre değişir. Elektronik için Amazon TR avantajlı olabilirken
                giyimde N11 daha düşük komisyon sunar. Kârnet, her platform için kâr hesabını otomatik yaparak
                hangi pazaryerinin sizin ürününüzde daha kârlı olduğunu gösterir.
              </p>
            </div>
          </div>

          {/* Main comparison table */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Kategori Bazlı Komisyon Karşılaştırması 2026</h2>
            <p className="text-sm text-muted-foreground">
              Aynı kategori için farklı pazaryerlerindeki komisyon oranları. Sadece komisyon değil,
              kargo ve iade maliyetlerini de hesaba katmanız gerekir.
            </p>
            <div className="rounded-xl border border-border/40 overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Kategori</th>
                    <th className="text-center px-4 py-3 font-semibold text-orange-600">Trendyol</th>
                    <th className="text-center px-4 py-3 font-semibold text-orange-700">Hepsiburada</th>
                    <th className="text-center px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">N11</th>
                    <th className="text-center px-4 py-3 font-semibold text-yellow-600 dark:text-yellow-400">Amazon TR</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMISSION_DATA.map((row, i) => (
                    <tr key={row.category} className={`border-b border-border/30 last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2.5 text-muted-foreground font-medium">{row.category}</td>
                      <td className="px-4 py-2.5 text-center text-foreground">{row.trendyol}</td>
                      <td className="px-4 py-2.5 text-center text-foreground">{row.hepsiburada}</td>
                      <td className="px-4 py-2.5 text-center text-foreground">{row.n11}</td>
                      <td className="px-4 py-2.5 text-center text-foreground">{row.amazon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              * Oranlar dönemsel olarak değişebilir. Kesin bilgi için her platformun satıcı panelini kontrol edin.
            </p>
          </section>

          {/* Platform overview */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Platform Özeti: Güçlü ve Zayıf Yönler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'Trendyol',
                  color: 'orange',
                  pros: ['En yüksek satış hacmi', 'Güçlü müşteri kitlesi', 'Reklam ekosistemi gelişmiş'],
                  cons: ['Giyimde yüksek komisyon (%20+)', 'Yüksek iade oranları', 'Yoğun rekabet'],
                },
                {
                  name: 'Hepsiburada',
                  color: 'orange',
                  pros: ['Elektronik segmentinde güçlü', 'İkinci büyük pazar', 'Müşteri sadakati'],
                  cons: ['Komisyonlar Trendyol\'a benzer', 'Kargo maliyetleri yüksek olabilir', 'Reklam maliyetleri'],
                },
                {
                  name: 'N11',
                  color: 'blue',
                  pros: ['Düşük komisyon oranları', 'Daha az rekabet', 'KOBİ dostu'],
                  cons: ['Daha düşük satış hacmi', 'Reklam ekosistemi sınırlı', 'Marka bilinirliği'],
                },
                {
                  name: 'Amazon TR',
                  color: 'yellow',
                  pros: ['Elektronik\'te düşük komisyon (%7–8)', 'FBA seçeneği', 'Güçlü marka güveni'],
                  cons: ['FBA ücretleri ekstra maliyet', 'Yüksek iade oranı riski', 'Rekabetçi fiyatlandırma baskısı'],
                },
              ].map((platform) => (
                <div key={platform.name} className="rounded-xl border border-border/40 bg-card p-5 space-y-3">
                  <h3 className="font-semibold text-foreground">{platform.name}</h3>
                  <div>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1.5">Avantajlar</p>
                    <ul className="space-y-1">
                      {platform.pros.map((p) => (
                        <li key={p} className="text-xs text-muted-foreground flex gap-1.5">
                          <span className="text-emerald-500 shrink-0">✓</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-500 mb-1.5">Dikkat Edilmesi Gerekenler</p>
                    <ul className="space-y-1">
                      {platform.cons.map((c) => (
                        <li key={c} className="text-xs text-muted-foreground flex gap-1.5">
                          <span className="text-red-400 shrink-0">✗</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Choose platform section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Hangi Platformu Seçmeli?</h2>
            <div className="space-y-3">
              {[
                { condition: 'Giyim & Moda satıyorsanız', recommendation: 'Trendyol en yüksek hacmi sunar. N11 daha düşük komisyon oranıyla alternatif olabilir.' },
                { condition: 'Elektronik satıyorsanız', recommendation: 'Amazon TR (%7–8 komisyon) ve Trendyol (%8–10) en avantajlı seçeneklerdir.' },
                { condition: 'Kozmetik satıyorsanız', recommendation: 'N11 (%12–14) diğer platformlara kıyasla daha düşük komisyon sunar.' },
                { condition: 'Çoklu platformda satmak istiyorsanız', recommendation: 'Kârnet, her platform için kâr hesabını ayrı ayrı yapar. Hangi platformda daha kârlı olduğunuzu kolayca görebilirsiniz.' },
              ].map((item) => (
                <div key={item.condition} className="rounded-xl border border-border/40 bg-card p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">{item.condition}</p>
                  <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Kârnet ile Tüm Platformları Karşılaştırın</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Aynı ürün için Trendyol, Hepsiburada, N11 ve Amazon TR kâr hesabını yan yana görün.
              Komisyon, kargo, iade ve KDV otomatik hesaplanır. Tamamen ücretsiz.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-amber-500/30"
              style={{ background: 'linear-gradient(135deg, #D97706, #92400E)' }}
            >
              Ücretsiz Karşılaştır →
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
              { href: '/amazon-turkiye-kar-hesaplama', label: 'Amazon TR Kâr Hesaplama' },
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
