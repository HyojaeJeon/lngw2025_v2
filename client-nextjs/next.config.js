// client-nextjs/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // API 라우트 프록시 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://0.0.0.0:${process.env.SERVER_PORT || 5000}/api/:path*`,
      },
      {
        source: '/graphql',
        destination: `http://0.0.0.0:${process.env.SERVER_PORT || 5000}/graphql`,
      },
    ];
  },
};

module.exports = nextConfig;
