import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep development artifacts away from the production bundle. Mixing both
  // modes in `.next` can leave stale PostCSS/Tailwind output in local previews.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
};

export default nextConfig;
