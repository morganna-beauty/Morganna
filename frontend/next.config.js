/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC minifier as fallback for Docker compatibility
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  // Alternative: Disable SWC compiler entirely if needed
  experimental: {
    forceSwcTransforms: false,
  },
};

module.exports = nextConfig;
