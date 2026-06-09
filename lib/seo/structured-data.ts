const BASE_URL = 'https://karnet.com.tr';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kârnet',
    url: BASE_URL,
    logo: `${BASE_URL}/brand/og.png`,
    email: 'karnet.destek@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Konya',
      addressCountry: 'TR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'karnet.destek@gmail.com',
      contactType: 'customer support',
      availableLanguage: 'Turkish',
    },
    description:
      'Trendyol, Hepsiburada, N11 ve Amazon Türkiye satıcıları için gerçek kâr analizi platformu.',
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kârnet',
    url: BASE_URL,
    description:
      'Pazaryeri satıcılarının gerçek kârını görmesini sağlayan analiz platformu.',
    inLanguage: 'tr-TR',
  };
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Kârnet',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: BASE_URL,
    description:
      'Trendyol, Hepsiburada, N11 ve Amazon Türkiye satıcıları için otomatik kâr hesaplama ve kârlılık analizi platformu.',
    inLanguage: 'tr-TR',
    offers: [
      {
        '@type': 'Offer',
        name: 'Ücretsiz Plan',
        price: '0',
        priceCurrency: 'TRY',
        description: '3 ürüne kadar ücretsiz kâr analizi',
      },
      {
        '@type': 'Offer',
        name: 'Başlangıç Planı',
        price: '399',
        priceCurrency: 'TRY',
        billingDuration: 'P1M',
        description: '25 ürüne kadar analiz, PRO Muhasebe Modu, CSV export',
      },
      {
        '@type': 'Offer',
        name: 'Profesyonel Plan',
        price: '799',
        priceCurrency: 'TRY',
        billingDuration: 'P1M',
        description:
          'Sınırsız analiz, Trendyol & Hepsiburada API, nakit akışı tahmini',
      },
    ],
    creator: {
      '@type': 'Person',
      name: 'Süleyman Hilmi İşbilir',
      address: { '@type': 'PostalAddress', addressLocality: 'Konya', addressCountry: 'TR' },
    },
  };
}

export type FaqItem = { question: string; answer: string };

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function blogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    inLanguage: 'tr-TR',
    publisher: {
      '@type': 'Organization',
      name: 'Kârnet',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/brand/og.png` },
    },
    author: {
      '@type': 'Person',
      name: 'Süleyman Hilmi İşbilir',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
    image: { '@type': 'ImageObject', url: `${BASE_URL}/brand/og.png` },
  };
}
