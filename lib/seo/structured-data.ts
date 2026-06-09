const BASE_URL = 'https://kârnet.com';

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
      'Trendyol, Hepsiburada, N11 ve Amazon Türkiye satıcıları için tamamen ücretsiz otomatik kâr hesaplama ve kârlılık analizi platformu. Tüm özellikler sınırsız ve ücretsizdir.',
    inLanguage: 'tr-TR',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
      description:
        'Tamamen ücretsiz. Tüm özellikler (sınırsız ürün analizi, PRO Muhasebe Modu, hassasiyet analizi, başabaş noktası, nakit akışı tahmini, Trendyol & Hepsiburada API entegrasyonu, sınırsız PDF rapor, CSV içe/dışa aktarma) ücretsiz ve sınırsızdır. Ödeme veya kredi kartı gerekmez.',
    },
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
