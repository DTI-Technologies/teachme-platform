/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    domains: [
      'localhost',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.API_BASE_URL || 'http://localhost:3001'}/api/:path*`,
      },
      {
        source: '/api/ai/:path*',
        destination: `${process.env.API_BASE_URL || 'http://localhost:3001'}/api/ai/:path*`,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Add custom webpack configurations here
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
