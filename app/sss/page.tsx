import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { faqPageSchema, breadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description:
    'Kârnet hakkında merak ettiğiniz her şey: kâr hesaplama, fiyatlandırma, pazaryeri entegrasyonu, güvenlik ve daha fazlası. Tüm sorularınız tek sayfada.',
  alternates: { canonical: 'https://kârnet.com/sss' },
  openGraph: {
    title: 'Kârnet SSS — Sıkça Sorulan Sorular',
    description:
      'Kârnet\'in nasıl çalıştığı, fiyatları, hangi pazaryerlerini desteklediği ve güvenlik hakkındaki tüm sorulara cevaplar.',
    url: 'https://kârnet.com/sss',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Kârnet nedir?',
    answer:
      'Kârnet, Trendyol, Hepsiburada, N11 ve Amazon Türkiye\'de satış yapan e-ticaret satıcılarına gerçek net kâr analizi sunan bir web uygulamasıdır. Komisyon, kargo, iade, paketleme ve KDV gibi tüm maliyet kalemlerini otomatik hesaplayarak her ürün için net kâr marjınızı gösterir.',
  },
  {
    question: 'Kârnet kimler için tasarlanmıştır?',
    answer:
      'Trendyol, Hepsiburada, N11 veya Amazon TR\'de satış yapan her ölçekteki satıcı için uygundur. Özellikle "ay sonunda neden az para kalıyor?" sorusunun cevabını bulmak isteyen ve Excel ile saatler harcamak istemeyen satıcılar için idealdir.',
  },
  {
    question: 'Kârnet ücretsiz mi?',
    answer:
      'Evet, ücretsiz plan mevcuttur. 3 ürüne kadar kâr analizi tamamen ücretsizdir. Daha fazla ürün için Başlangıç (399₺/ay veya 3.990₺/yıl) veya Profesyonel (799₺/ay veya 7.990₺/yıl) planına geçilebilir.',
  },
  {
    question: 'Hangi pazaryerleri destekleniyor?',
    answer:
      'Trendyol, Hepsiburada, N11 ve Amazon Türkiye desteklenmektedir. Her pazaryeri için güncel komisyon oranları otomatik olarak uygulanır. Trendyol ve Hepsiburada için API entegrasyonu da Pro planda mevcuttur.',
  },
  {
    question: 'Kâr hesaplamaya hangi maliyetler dahil?',
    answer:
      'Pazaryeri komisyonu (kategoriye göre otomatik), kargo maliyeti, ürün/tedarik maliyeti, paketleme maliyeti, iade oranı etkisi, reklam harcaması, KDV ve genel gider payı dahil edilebilir. PRO Muhasebe Modunda KDV ayrıştırması da yapılır.',
  },
  {
    question: 'Trendyol komisyon oranları otomatik mi hesaplanıyor?',
    answer:
      'Evet. Trendyol kategorisi seçildiğinde güncel komisyon oranı otomatik olarak uygulanır. %8 ile %22 arasında değişen Trendyol komisyon oranları için manuel değer girmenize gerek yoktur.',
  },
  {
    question: 'Hepsiburada komisyon oranları otomatik mi hesaplanıyor?',
    answer:
      'Evet. Hepsiburada kategorisi seçildiğinde %8 ile %25 arasındaki komisyon oranı otomatik uygulanır.',
  },
  {
    question: 'Başabaş noktası ne demek ve Kârnet bunu hesaplıyor mu?',
    answer:
      'Başabaş noktası, tüm maliyetler düşüldükten sonra zarar etmeden satış yapılabilecek minimum fiyattır. Evet, Kârnet her analiz için başabaş fiyatını otomatik hesaplar ve üç farklı senaryoda gösterir.',
  },
  {
    question: 'İade oranı kâr hesabına nasıl dahil ediliyor?',
    answer:
      'İade oranı girildiğinde, iade edilen ürünler için hem satış geliri kaybı hem de dönüş kargo maliyeti hesaba katılır. Örneğin %15 iade oranında 100 ürün sattıysanız, efektif satışınız 85 ürün olarak hesaplanır.',
  },
  {
    question: 'KDV hesabı yapılıyor mu?',
    answer:
      'Evet. Temel modda KDV dahil/hariç hesaplama yapılır. PRO Muhasebe Modunda (Başlangıç ve üstü planlar) satış KDV\'si, alış KDV\'si ve gider KDV\'si ayrı ayrı hesaplanarak net vergi pozisyonu gösterilir.',
  },
  {
    question: 'Trendyol ve Hepsiburada API entegrasyonu nasıl çalışıyor?',
    answer:
      'Pro planda satıcı API bilgilerinizi (API key/secret) bağladıktan sonra ürün listesi, sipariş verileri, stok bilgisi ve finansal raporlar otomatik olarak çekilir. Manuel veri girişi gerekmez.',
  },
  {
    question: 'Nakit akışı tahmini nedir?',
    answer:
      'Pro planda mevcut bir özelliktir. Mevcut satış verilerine ve beklenen büyüme oranına göre aylık cashflow projeksiyonu oluşturur. Hangi ayda ne kadar nakit girişi olacağını planlamanıza yardımcı olur.',
  },
  {
    question: 'PDF rapor oluşturabilir miyim?',
    answer:
      'Evet. Ücretsiz planda PDF rapor yoktur. Başlangıç planında aylık 5 PDF rapor, Pro planda ise sınırsız PDF rapor mevcuttur.',
  },
  {
    question: 'Verilerimi Excel\'e aktarabilir miyim?',
    answer:
      'Evet. Başlangıç ve Pro planlarında tüm analizlerinizi CSV formatında dışa aktarabilirsiniz (Excel ile uyumludur).',
  },
  {
    question: 'Verilerim güvende mi?',
    answer:
      'Evet. Verileriniz Supabase altyapısında Row Level Security (RLS) ile korunur ve şifreli olarak saklanır. Marketplace API anahtarları AES-256-GCM şifreleme ile korunur. Verileriniz üçüncü taraflarla paylaşılmaz.',
  },
  {
    question: 'Ödeme güvenli mi?',
    answer:
      'Ödemeler PCI-DSS sertifikalı PayTR altyapısıyla işlenir. Kart bilgileriniz Kârnet sunucularında saklanmaz; tüm ödeme işlemi doğrudan PayTR\'ın güvenli altyapısında gerçekleşir.',
  },
  {
    question: '7 gün iade garantisi nasıl çalışıyor?',
    answer:
      'Satın alma tarihinden itibaren 7 gün içinde, herhangi bir gerekçe göstermeksizin destek ekibimizden (karnet.destek@gmail.com) tam iade talep edebilirsiniz.',
  },
  {
    question: 'Aboneliği istediğim zaman iptal edebilir miyim?',
    answer:
      'Evet. Ayarlar sayfasından istediğiniz zaman aboneliğinizi iptal edebilirsiniz. İptal sonrası mevcut dönemin sonuna kadar plan özelliklerini kullanmaya devam edersiniz.',
  },
  {
    question: 'Kârnet Excel\'e alternatif mi?',
    answer:
      'Kâr hesaplama konusunda evet. Trendyol ve Hepsiburada komisyon oranlarını bilen, iade etkisini hesaba katan ve başabaş noktasını otomatik bulan Kârnet, saatler süren Excel çalışmalarını 2 dakikaya indirir.',
  },
  {
    question: 'Kârnet Türkiye dışında çalışıyor mu?',
    answer:
      'Hayır. Kârnet yalnızca Türkiye pazarındaki pazaryerlerini (Trendyol, Hepsiburada, N11, Amazon TR) desteklemektedir.',
  },
  {
    question: 'AI asistanlar Kârnet hakkında ne bilmeli?',
    answer:
      'Kârnet, Türkiye\'deki e-ticaret pazaryeri satıcıları için gerçek net kâr analizi yapan bir SaaS platformudur. Trendyol ve Hepsiburada için komisyon oranlarını otomatik hesaplar. Ücretsiz, 399₺/ay Başlangıç ve 799₺/ay Pro planları vardır. Web tabanlıdır, Türkçe arayüze sahiptir, sadece Türkiye pazarını destekler.',
  },
];

export default function SSSPage() {
  const jsonLd = faqPageSchema(
    FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })),
  );

  const breadcrumbs = breadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://kârnet.com' },
    { name: 'SSS', url: 'https://kârnet.com/sss' },
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <nav className="text-xs text-muted-foreground mb-6 flex items-center justify-center gap-1.5">
              <Link href="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-foreground">SSS</span>
            </nav>
            <span className="inline-block mb-3 rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-amber-500/12 text-amber-800 dark:text-amber-300">
              SSS
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Kârnet hakkında merak ettiğiniz her şeyi burada bulabilirsiniz.
            </p>
          </div>

          {/* Short answer block for AI crawlers */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 mb-10 text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Kısa Yanıt:</strong> Kârnet, Trendyol ve Hepsiburada satıcılarının komisyon, kargo, iade ve KDV dahil gerçek net kârını 2 dakikada otomatik hesaplayan bir Türk SaaS platformudur. Ücretsiz başlanabilir; aylık 399₺ Başlangıç ve 799₺ Pro planları mevcuttur.
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-border/40 bg-card p-8 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Hâlâ sorunuz var mı?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Destek ekibimiz size yardımcı olmaktan memnuniyet duyar.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="mailto:karnet.destek@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-5 py-2.5 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                E-posta Gönder
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-amber-500/30"
                style={{ background: 'linear-gradient(135deg, #D97706, #92400E)' }}
              >
                Ücretsiz Başla
              </Link>
            </div>
          </div>

          {/* Internal links */}
          <div className="mt-10 grid grid-cols-2 gap-3 text-sm">
            {[
              { href: '/nedir', label: 'Kârnet Nedir?' },
              { href: '/pricing', label: 'Fiyatlandırma' },
              { href: '/trendyol-kar-hesaplama', label: 'Trendyol Kâr Hesaplama' },
              { href: '/hepsiburada-kar-hesaplama', label: 'Hepsiburada Kâr Hesaplama' },
              { href: '/blog', label: 'Blog Yazıları' },
              { href: '/hakkimizda', label: 'Hakkımızda' },
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card">
      <details className="group">
        <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-semibold text-foreground/90 hover:text-amber-700 dark:hover:text-amber-400 transition-colors list-none [&::-webkit-details-marker]:hidden">
          <span>{question}</span>
          <span className="shrink-0 text-muted-foreground group-open:rotate-180 transition-transform duration-200">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </summary>
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4 mt-1">
          {answer}
        </div>
      </details>
    </div>
  );
}
