/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 3600, // 1 hour
    remotePatterns: [
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
    ],
  },
};

module.exports = nextConfig;
