'use client';

import { motion } from 'framer-motion';
import { ClipboardList, BarChart2, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: ClipboardList,
    title: 'Ürün Bilgilerini Gir',
    desc: 'Pazaryeri, fiyat, maliyet ve gider bilgilerini girin.',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    numColor: 'text-blue-600 dark:text-blue-400',
    hoverBg: 'group-hover:bg-blue-500',
  },
  {
    number: '2',
    icon: BarChart2,
    title: 'Analiz Et',
    desc: 'Sistem tüm maliyetleri hesaplayarak gerçek kârı ve risk seviyesini belirler.',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
    numColor: 'text-orange-600 dark:text-orange-400',
    hoverBg: 'group-hover:bg-orange-500',
  },
  {
    number: '3',
    icon: CheckCircle2,
    title: 'Karar Ver',
    desc: 'Detaylı rapor ve önerilerle stratejik kararlar alın, kârlı ürünleri ölçeklendirin.',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    numColor: 'text-emerald-600 dark:text-emerald-400',
    hoverBg: 'group-hover:bg-emerald-500',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block mb-3 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Nasıl Çalışır?
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-geist">
            3 adımda kârlılığınızı ölçün
          </h2>
          <p className="text-lg text-muted-foreground">
            Daha doğru ticaret yapın, zarar eden ürünleri erken tespit edin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex">
              {/* Kart */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group flex flex-col items-center text-center w-full h-full rounded-2xl border border-border/60 bg-card p-8 hover:border-primary/20 hover:shadow-md transition-all duration-300"
              >
                {/* Numara badge */}
                <span className={`text-5xl font-black mb-5 leading-none select-none ${step.numColor} opacity-90`}>
                  {step.number}
                </span>

                {/* İkon */}
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-5 transition-all duration-300 ${step.iconBg} ${step.iconColor} group-hover:scale-110 group-hover:shadow-lg ${step.hoverBg} group-hover:text-white`}>
                  <step.icon className="h-8 w-8 transition-colors duration-300" />
                </div>

                {/* Başlık */}
                <h3 className="text-lg font-semibold mb-3 text-foreground">{step.title}</h3>

                {/* Açıklama */}
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                  {step.desc}
                </p>
              </motion.div>

              {/* Ok — sağ kenar, son kartta yok */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 items-center justify-center rounded-full bg-card border border-border shadow-sm">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
