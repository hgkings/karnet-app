import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fiyatlandırma — Ücretsiz, Başlangıç ve Pro',
  description:
    'Kârnet fiyatlandırma planları: Ücretsiz (3 ürün), Başlangıç 399₺/ay (25 ürün), Profesyonel 799₺/ay (sınırsız). 7 gün iade garantisi. Kart bilgisi saklanmaz.',
  alternates: { canonical: 'https://kârnet.com/pricing' },
  openGraph: {
    title: 'Kârnet Fiyatlandırma — Ücretsiz, Başlangıç ve Pro',
    description:
      'Ücretsiz planla başlayın. Daha fazla ürün ve gelişmiş özellikler için 399₺/ay\'dan Başlangıç planına geçin.',
    url: 'https://kârnet.com/pricing',
    type: 'website',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
