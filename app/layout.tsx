import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from '@/contexts/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { AlertProvider } from '@/contexts/alert-context';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { CookieConsent } from '@/components/shared/cookie-consent';
import { organizationSchema, websiteSchema, softwareApplicationSchema } from '@/lib/seo/structured-data';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const BASE_URL = 'https://karnet.com';

export const metadata: Metadata = {
  title: {
    default: 'Kârnet — Trendyol ve Hepsiburada Kâr Analizi',
    template: '%s | Kârnet',
  },
  description:
    'Trendyol, Hepsiburada, N11 ve Amazon TR satıcıları için gerçek kâr analizi. Komisyon, kargo, iade ve KDV otomatik hesaplanır. 2 dakikada net kâr marjınızı öğrenin.',
  keywords: [
    'trendyol kar hesaplama',
    'hepsiburada kar hesaplama',
    'pazaryeri kar analizi',
    'komisyon hesaplama',
    'e-ticaret satıcı aracı',
    'trendyol komisyon oranları',
    'hepsiburada komisyon',
    'kârnet',
  ],
  authors: [{ name: 'Süleyman Hilmi İşbilir' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: BASE_URL,
    title: 'Kârnet — Trendyol ve Hepsiburada Kâr Analizi',
    description:
      'Trendyol, Hepsiburada, N11 ve Amazon TR satıcıları için gerçek kâr analizi. Komisyon, kargo, iade ve KDV otomatik hesaplanır.',
    siteName: 'Kârnet',
    images: [
      {
        url: '/brand/og.png',
        width: 1200,
        height: 630,
        alt: 'Kârnet — Pazaryeri Kâr Analizi Platformu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kârnet — Trendyol ve Hepsiburada Kâr Analizi',
    description:
      'Trendyol, Hepsiburada, N11 ve Amazon TR satıcıları için gerçek kâr analizi.',
    images: ['/brand/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema()) }}
        />
      </head>
      <body className={`${inter.variable} ${GeistSans.variable} font-sans`}>
        {/* Aurora animated background — all pages */}
        <div className="aurora-bg">
          <div className="aurora-orb orb-1" />
          <div className="aurora-orb orb-2" />
          <div className="aurora-orb orb-3" />
        </div>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <AlertProvider>
              {children}
            </AlertProvider>
            <Toaster
              richColors
              position="top-right"
              style={{ pointerEvents: 'none' }} // Container shouldn't capture clicks
              toastOptions={{
                style: { pointerEvents: 'auto' }, // Toast content should be clickable
              }}
            />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
