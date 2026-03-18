'use client';

import { motion } from 'framer-motion';
import { Calculator, Shield, BarChart3, Target, FileSpreadsheet, TrendingUp, Crown } from 'lucide-react';

const fadeUp: Record<string, any> = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' },
  }),
};

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block mb-3 rounded-full border border-primary/30 bg-primary/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Özellikler
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-geist">
            Neden Kârnet?
          </h2>
          <p className="text-lg text-muted-foreground">
            Basit bir kâr hesabından çok daha fazlası.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">

          {/* Large card — col span 2 */}
          <motion.div
            custom={0} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="lg:col-span-2 group relative rounded-2xl border border-white/8 bg-[hsl(222,47%,7%)] p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/3 via-transparent to-transparent" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Gerçek Kâr Hesaplama</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Komisyon, KDV, iade, reklam ve kargo dahil tüm giderleri hesaplayarak gerçek net kârınızı görün.
              </p>
              {/* Mini chart mockup */}
              <div className="rounded-xl bg-muted/50 p-4 flex items-end gap-1.5 h-20">
                {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-primary/60 to-primary/20 transition-all duration-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Risk Analysis */}
          <motion.div
            custom={1} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="group relative rounded-2xl border border-white/8 bg-[hsl(222,47%,7%)] p-6 hover:border-red-500/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-red-500/3 via-transparent to-transparent" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 transition-colors group-hover:bg-red-500 group-hover:text-white">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Risk Analizi</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Ürün bazında risk puanı ve zarar uyarıları.
              </p>
              {/* Risk badges */}
              <div className="space-y-2">
                {[
                  { label: 'Yüksek Risk', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', w: '60%' },
                  { label: 'Orta Risk', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', w: '35%' },
                  { label: 'Düşük Risk', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', w: '5%' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-muted flex-1 overflow-hidden">
                      <div className={`h-full rounded-full ${r.color.split(' ')[0]}`} style={{ width: r.w }} />
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${r.color}`}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sensitivity */}
          <motion.div
            custom={2} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="group relative rounded-2xl border border-white/8 bg-[hsl(222,47%,7%)] p-6 hover:border-orange-500/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/3 via-transparent to-transparent" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Hassasiyet Analizi</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Fiyat değişikliklerini anlık simüle edin.
              </p>
              {/* Slider mockup */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Fiyat</span><span className="font-semibold text-foreground">₺349</span>
                </div>
                <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                  <div className="absolute left-0 h-full w-[70%] bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                  <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary border-2 border-background shadow-sm" />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>₺200</span><span>₺500</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4 Marketplaces */}
          <motion.div
            custom={3} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="group relative rounded-2xl border border-white/8 bg-[hsl(222,47%,7%)] p-6 hover:border-purple-500/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-colors group-hover:bg-purple-500 group-hover:text-white">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">4 Pazaryeri</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Trendyol, Hepsiburada, n11, Amazon TR
            </p>
            <div className="flex gap-2 flex-wrap">
              {[
                { name: 'Ty', bg: 'bg-orange-100 text-orange-700', dark: 'dark:bg-orange-900/30 dark:text-orange-400' },
                { name: 'HB', bg: 'bg-orange-100 text-orange-600', dark: 'dark:bg-orange-900/30 dark:text-orange-400' },
                { name: 'n11', bg: 'bg-purple-100 text-purple-700', dark: 'dark:bg-purple-900/30 dark:text-purple-400' },
                { name: 'AMZ', bg: 'bg-yellow-100 text-yellow-700', dark: 'dark:bg-yellow-900/30 dark:text-yellow-400' },
              ].map((mp) => (
                <span key={mp.name} className={`text-xs font-bold px-2.5 py-1 rounded-lg ${mp.bg} ${mp.dark}`}>
                  {mp.name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* KDV — Pro */}
          <motion.div
            custom={4} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-[hsl(222,47%,7%)] to-[hsl(222,47%,7%)] p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              KDV Ayrıştırma
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Crown className="h-2.5 w-2.5" /> PRO
              </span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Muhasebe modunda KDV dahil/hariç hesaplama ve fatura bazlı analiz.
            </p>
          </motion.div>

          {/* Marketplace comparison — large */}
          <motion.div
            custom={5} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="lg:col-span-2 group relative rounded-2xl border border-white/8 bg-[hsl(222,47%,7%)] p-6 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/3 via-transparent to-transparent" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pazaryeri Karşılaştırması</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Aynı ürünü farklı pazaryerlerinde karşılaştırarak en kârlı platformu belirleyin.
              </p>
              {/* Bar chart mockup */}
              <div className="space-y-2">
                {[
                  { name: 'Trendyol', value: 72, color: 'bg-orange-400' },
                  { name: 'Hepsiburada', value: 58, color: 'bg-orange-600' },
                  { name: 'n11', value: 45, color: 'bg-purple-500' },
                  { name: 'Amazon TR', value: 83, color: 'bg-yellow-500' },
                ].map((bar) => (
                  <div key={bar.name} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-muted-foreground shrink-0">{bar.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bar.color} transition-all duration-1000`}
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground w-8 text-right">%{bar.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
