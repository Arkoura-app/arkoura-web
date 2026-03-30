import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arkoura',
    short_name: 'Arkoura',
    description: 'Your personal health journal and emergency profile',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF8',
    theme_color: '#4A7A50',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
