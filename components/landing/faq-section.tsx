'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'KDV nasıl hesaplanıyor?',
    a: 'Kârnet, ürün bazında KDV oranını ayrıştırarak net (KDV hariç) ve brüt (KDV dahil) değerleri gösterir. Pro modda satış, alış ve gider bazlı KDV\'leri ayrı ayrı ayarlayabilirsiniz.',
  },
  {
    q: 'İade oranı kârı nasıl etkiliyor?',
    a: 'İade edilen ürünlerde hem satış geliri kaybolur hem de ekstra kargo/operasyon maliyeti oluşur. Kârnet, belirlediğiniz iade oranını aylık satış hacmine uygulayarak gerçek net kârı hesaplar.',
  },
  {
    q: 'Hangi pazaryerleri destekleniyor?',
    a: 'Trendyol, Hepsiburada, N11 ve Amazon Türkiye desteklenmektedir. Her pazaryeri için varsayılan komisyon, iade oranı ve ödeme gecikme süresi otomatik doldurulur.',
  },
  {
    q: 'Ücretsiz plan ile Pro plan arasındaki fark nedir?',
    a: 'Ücretsiz planda 5 ürüne kadar analiz yapabilirsiniz. Pro plan: sınırsız analiz, PRO Muhasebe Modu (detaylı KDV ayrıştırma), PDF rapor indirme, e-posta risk bildirimleri ve öncelikli destek sunar.',
  },
  {
    q: 'Verilerim güvende mi?',
    a: 'Evet. Verileriniz Supabase altyapısında şifreli olarak saklanır. Üçüncü taraflarla paylaşılmaz, reklam amacıyla kullanılmaz. İstediğiniz zaman hesabınızı ve tüm verilerinizi silebilirsiniz.',
  },
  {
    q: 'Hesaplama ne kadar doğru?',
    a: 'Kârnet, girdiğiniz verilere dayalı olarak hesaplama yapar. Komisyon, KDV, kargo, reklam, iade ve diğer giderleri eksiksiz dahil eder. Sonuçlar, girilen verilerin doğruluğu kadar kesindir.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-muted/20 border-y border-border/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block mb-3 rounded-full border border-primary/30 bg-primary/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            SSS
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-geist">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-lg text-muted-foreground">
            Merak ettiklerinizi hızlıca yanıtlıyoruz.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <AccordionItem
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/30 data-[state=open]:shadow-sm transition-all"
              >
                <AccordionTrigger className="py-4 text-[15px] font-semibold text-foreground/80 hover:no-underline hover:text-primary text-left gap-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
