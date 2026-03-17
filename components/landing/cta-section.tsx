'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, FileText, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';

export function CTASection() {
  const { user } = useAuth();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-blue-700 px-6 py-16 sm:px-12 sm:py-20 text-center shadow-premium-lg"
        >
          {/* Decorative layers */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white mb-4 font-geist">
              2 dakikada gerçek kârını öğren
            </h2>
            <p className="mx-auto max-w-xl text-lg text-white/80 mb-8">
              Ücretsiz plan ile hemen başla. Kurulum yok, kart bilgisi yok.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {[
                { icon: Lock, text: 'Kart bilgisi gerekmez' },
                { icon: FileText, text: 'PDF rapor alın' },
                { icon: ShieldCheck, text: 'Veriler sadece sende' },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white/90 border border-white/10"
                >
                  <badge.icon className="h-3.5 w-3.5" />
                  {badge.text}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={user ? '/analysis/new' : '/auth'}>
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-bold rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg btn-shine gap-2 transition-all"
                >
                  Ücretsiz Başla
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base font-medium rounded-xl bg-transparent border-white/25 text-white hover:bg-white/10 transition-all"
                >
                  Planları İncele
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
