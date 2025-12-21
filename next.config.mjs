/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/',
        permanent: true
      }
    ];
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  env: {
    NEXTAUTH_SECRET: 'DA7yaoTFT5Gl5czkmkT34FLvFtPqcRm05NVkYqTJPQE=',
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL
  },
};

export default nextConfig;
