/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This tells React to suppress the hydration error
  experimental: {
    turbo: undefined, // Disable turbopack if it was enabled, it can cause hydration issues sometimes
  },
}

module.exports = nextConfig