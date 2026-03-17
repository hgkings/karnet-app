'use client';

import { motion } from 'framer-motion';
import { ClipboardList, BarChart2, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Ürün Bilgilerini Gir',
    desc: 'Pazaryeri, satış fiyatı, ürün maliyeti, kargo ve reklam giderlerini girin.',
    color: 'blue',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    iconHover: 'group-hover:bg-blue-500 group-hover:text-white',
    numColor: 'text-blue-500/20',
  },
  {
    number: '02',
    icon: BarChart2,
    title: 'Analiz Et',
    desc: 'Sistem tüm gizli maliyetleri hesaplayarak gerçek kârınızı ve risk seviyenizi belirler.',
    color: 'orange',
    iconBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    iconHover: 'group-hover:bg-orange-500 group-hover:text-white',
    numColor: 'text-orange-500/20',
  },
  {
    number: '03',
    icon: CheckCircle2,
    title: 'Karar Ver',
    desc: 'Detaylı rapor ve önerilere dayanarak stratejik kararlar alın, kârlı ürünleri ölçeklendirin.',
    color: 'green',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    iconHover: 'group-hover:bg-emerald-500 group-hover:text-white',
    numColor: 'text-emerald-500/20',
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

        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[22%] right-[22%] h-px bg-gradient-to-r from-blue-500/30 via-orange-500/30 to-emerald-500/30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-16 -right-3 z-10 items-center justify-center h-6 w-6 rounded-full bg-background border border-border">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>
              )}

              {/* Number */}
              <div className="relative mb-6">
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-6xl font-black ${step.numColor} select-none`}>
                  {step.number}
                </span>
                <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-border/60 bg-card transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${step.iconBg} ${step.iconHover}`}>
                  <step.icon className="h-7 w-7 transition-colors duration-300" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs text-sm">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
