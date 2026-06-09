import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://karnet.com.tr';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    // GEO landing pages
    { url: `${BASE_URL}/sss`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/nedir`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/trendyol-kar-hesaplama`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/hepsiburada-kar-hesaplama`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    // Legal pages
    { url: `${BASE_URL}/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/kullanim-sartlari`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/iade-politikasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
