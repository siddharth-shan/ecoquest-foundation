import type { MetadataRoute } from 'next'

// Static export: generate a fully static sitemap at build time.
export const dynamic = 'force-static'

const SITE_URL = 'https://www.ecoquestfoundation.org'

type Route = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

// Canonical, trailing-slash URLs (must match next.config trailingSlash: true)
const routes: Route[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/about/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/programs/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/impact/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/games/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/games/guardians/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/games/ocean-cleanup/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/games/recycling-hero/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/games/carbon-quest/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog/', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blog/congressional-app-challenge/', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/blog/blue-ocean-competition/', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/blog/oceanaware-guardian/', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/events/', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/events/register/', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/ecochallenge/join/', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/get-involved/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/resources/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/donate/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact/', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy/', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms/', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
