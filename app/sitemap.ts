import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config/site';
import { getAvailableCountries } from '@/lib/data/resume-loader';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/portfolio', '/resume', '/education', '/contact'];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  for (const country of getAvailableCountries()) {
    entries.push({
      url: `${SITE_URL}/resume/${country}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
