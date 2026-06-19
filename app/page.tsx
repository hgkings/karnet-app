import type { Metadata } from 'next';
import LandingGlass from '@/components/landing/landing-glass';

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
  return <LandingGlass />;
}
