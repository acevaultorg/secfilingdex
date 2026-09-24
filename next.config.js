/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // next/link -> plain <a> (components/PlainLink.tsx): scripts/prune-out.mjs deletes the RSC .txt
  // payloads next/link prefetches, so every link 404'd 3-18 times per page (site guard 2026-09-24).
  webpack(config) {
    config.resolve.alias = { ...(config.resolve.alias || {}), 'next/link$': require('path').resolve(__dirname, 'components/PlainLink.tsx') };
    return config;
  },
};
module.exports = nextConfig;
