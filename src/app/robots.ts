import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/e/', '/_next/'],
      },
    ],
    sitemap: 'https://arkoura.com/sitemap.xml',
    host: 'https://arkoura.com',
  }
}
