import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { SocialProofBar } from '@/components/landing/social-proof-bar';
import { MarketplaceCards } from '@/components/landing/marketplace-cards';
import { QuickCalc } from '@/components/landing/quick-calc';
import { Features } from '@/components/landing/features';
import { ComparisonTable } from '@/components/landing/comparison-table';
import { TrustCards } from '@/components/landing/trust-cards';
import { HowItWorks } from '@/components/landing/how-it-works';
import { BenefitsList } from '@/components/landing/benefits-list';
import { StatsSection } from '@/components/landing/stats-section';
import { Testimonials } from '@/components/landing/testimonials';
import { TrustStrip } from '@/components/landing/trust-strip';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Trendyol ve Hepsiburada Kâr Analizi | Kârnet',
  description:
    'Trendyol, Hepsiburada, N11 ve Amazon TR satıcıları için gerçek kâr analiz aracı. Komisyon, kargo, iade ve KDV otomatik hesaplanır. Ücretsiz başlayın.',
  alternates: { canonical: 'https://kârnet.com' },
  openGraph: {
    title: 'Kârnet — Trendyol ve Hepsiburada Kâr Analizi',
    description:
      'Hangi ürünlerde gerçekten kâr ettiğinizi görün. Komisyon, kargo, iade ve KDV otomatik hesaplanır. 2 dakikada net kâr marjınızı öğrenin.',
    url: 'https://kârnet.com',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Header />

      <main>
        <Hero />
        <SocialProofBar />
        <MarketplaceCards />
        <QuickCalc />
        <Features />
        <ComparisonTable />
        <TrustCards />
        <HowItWorks />
        <BenefitsList />
        <StatsSection />
        <Testimonials />
        <TrustStrip />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
