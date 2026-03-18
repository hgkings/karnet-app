'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, Play } from 'lucide-react';
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
          className="relative overflow-hidden rounded-3xl px-6 py-16 sm:px-12 sm:py-20 text-center shadow-premium-lg"
          style={{
            background: 'linear-gradient(135deg, hsl(221 83% 45%) 0%, hsl(221 83% 55%) 50%, hsl(260 70% 50%) 100%)',
          }}
        >
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Glow blobs */}
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

          {/* Corner chart icon decoration */}
          <div className="absolute bottom-4 right-6 opacity-[0.08] pointer-events-none select-none">
            <BarChart2 className="h-40 w-40 text-white" />
          </div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/90 mb-6 backdrop-blur-sm">
              ✨ Hemen Başla
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white mb-4 font-geist">
              2 dakikada gerçek kârını öğren
            </h2>
            <p className="mx-auto max-w-xl text-lg text-white/80 mb-10">
              Ücretsiz plan ile hemen başla. Kurulum yok, kart bilgisi yok.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={user ? '/analysis/new' : '/auth'}>
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold rounded-full bg-white text-blue-600 hover:bg-white/90 hover:shadow-xl hover:scale-105 shadow-lg gap-2 transition-all duration-200"
                >
                  Ücretsiz Başla →
                </Button>
              </Link>
              <Link href="/auth?tab=demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base font-medium rounded-full bg-transparent border border-white/50 text-white hover:bg-white/10 transition-all duration-200 gap-2"
                >
                  <Play className="h-4 w-4" />
                  Demo İzle
                </Button>
              </Link>
            </div>

            {/* Trust icons */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/80">
              <span>🔒 Güvenli ödeme</span>
              <span>📊 Anlık analiz</span>
              <span>🔐 Veriler şifreli</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
