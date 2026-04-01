import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fiyatlandırma | Karnet',
  description:
    'Karnet fiyatlandırma planları. Ücretsiz, Başlangıç ve Profesyonel planlar ile e-ticaret kârlılık analizinizi başlatın.',
  openGraph: {
    title: 'Fiyatlandırma | Karnet',
    description: 'Sade ve şeffaf fiyatlandırma. Gizli ücret yok, istediğin zaman iptal et.',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
