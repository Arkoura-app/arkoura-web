import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://arkoura.com'),
  title: {
    default: 'Arkoura — Personal Health Journal & Emergency QR Profile',
    template: '%s | Arkoura',
  },
  description:
    'Arkoura is a personal health journal that becomes an emergency lifeline. One QR scan gives any helper instant access to your critical health information — in their language. Free emergency access, forever.',
  keywords: [
    'health journal',
    'emergency QR code',
    'medical ID',
    'personal health record',
    'emergency profile',
    'health emergency app',
    'medical bracelet alternative',
    'multilingual health app',
    'emergency medical information',
  ],
  authors: [{ name: 'Arkoura', url: 'https://arkoura.com' }],
  creator: 'Arkoura',
  publisher: 'Arkoura',
  category: 'health',
  applicationName: 'Arkoura',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'fr_FR', 'de_DE', 'pt_BR', 'zh_CN', 'ja_JP', 'it_IT', 'ru_RU', 'sv_SE'],
    url: 'https://arkoura.com',
    siteName: 'Arkoura',
    title: 'Arkoura — Your health story, everywhere you go.',
    description:
      'A personal health journal that becomes an emergency lifeline. One QR scan. Any language. Free forever.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Arkoura — Personal Health Journal & Emergency QR Profile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arkoura — Your health story, everywhere you go.',
    description:
      'A personal health journal that becomes an emergency lifeline. One QR scan. Any language. Free forever.',
    images: ['/og-image.png'],
    creator: '@arkoura',
    site: '@arkoura',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: '/icon.png', color: '#4A7A50' }],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'Jgsa21xcnmXDBX7M9nzPW45cL8DyePtZgrAA4XLC4Fc',
  },
  alternates: {
    canonical: 'https://arkoura.com',
    languages: {
      en: 'https://arkoura.com',
      es: 'https://arkoura.com',
      fr: 'https://arkoura.com',
      de: 'https://arkoura.com',
      pt: 'https://arkoura.com',
      zh: 'https://arkoura.com',
      ja: 'https://arkoura.com',
      it: 'https://arkoura.com',
      ru: 'https://arkoura.com',
      sv: 'https://arkoura.com',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-[var(--font-inter)] antialiased">
        {children}
        {process.env.NEXT_PUBLIC_CF_ANALYTICS && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS}"}`}
            strategy="afterInteractive"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Arkoura',
                url: 'https://arkoura.com',
                logo: 'https://arkoura.com/icon.png',
                description: 'A personal health journal and emergency QR profile platform.',
                foundingDate: '2026',
                foundingLocation: 'Costa Rica',
                contactPoint: {
                  '@type': 'ContactPoint',
                  email: 'hello@arkoura.com',
                  contactType: 'customer support',
                },
                sameAs: [],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Arkoura',
                applicationCategory: 'HealthApplication',
                operatingSystem: 'Web, iOS, Android',
                url: 'https://arkoura.com',
                description:
                  'Personal health journal and emergency QR profile. One scan gives any helper instant access to critical health information in their language.',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                  description: 'Free emergency access forever',
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '5',
                  ratingCount: '1',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Arkoura',
                url: 'https://arkoura.com',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://arkoura.com/?q={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              },
            ]),
          }}
        />
      </body>
    </html>
  )
}
