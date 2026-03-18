'use client';

import { motion } from 'framer-motion';
import { Star, BadgeCheck } from 'lucide-react';

const testimonials = [
  {
    quote: 'İade ve komisyonu dahil edince aslında zarar ettiğimi gördüm. 3 ürünü listeden çıkardım, kâr %40 arttı.',
    name: 'Emre K.',
    role: 'Trendyol Satıcısı',
    marketplace: 'Trendyol',
    mpColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    verified: true,
    stars: 5,
  },
  {
    quote: 'Müşterilerime hangi ürünlerde kâr ettiklerini somut verilerle gösterebiliyorum. Profesyonel ve güvenilir.',
    name: 'Seda A.',
    role: 'E-ticaret Danışmanı',
    marketplace: 'Çoklu Pazaryeri',
    mpColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    verified: true,
    stars: 5,
  },
  {
    quote: 'Excel\'de saatlerce uğraşıyordum. Kârnet ile 2 dakikada aynı sonuca ulaşıyorum. Hatta daha doğru.',
    name: 'Murat T.',
    role: 'Hepsiburada Satıcısı',
    marketplace: 'Hepsiburada',
    mpColor: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    verified: false,
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block mb-3 rounded-full border border-primary/30 bg-primary/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Yorumlar
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-geist">
            Kullanıcılar Ne Diyor?
          </h2>
          <p className="text-lg text-muted-foreground">
            Kârnet ile kârlılığını artıran satıcıların deneyimleri.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="mb-6 text-[15px] leading-relaxed text-foreground/80 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      {t.name}
                      {t.verified && <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.mpColor}`}>
                  {t.marketplace}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
