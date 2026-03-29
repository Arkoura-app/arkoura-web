import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase', 'firebase/app', 'firebase/auth', '@firebase/app', '@firebase/auth'],
  images: {
    unoptimized: true,
  },
  // Edge runtime is declared per-route via: export const runtime = 'edge'
  // @cloudflare/next-on-pages transforms the Next.js output for Cloudflare Pages.
  // Run `npm run pages:build` to produce the CF Pages artifact.
  eslint: {
    // CI enforces zero-warnings via `next lint --max-warnings 0`
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
