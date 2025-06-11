// // client-nextjs/next.config.js

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // API 라우트 프록시 설정
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: `http://0.0.0.0:${process.env.SERVER_PORT || 5000}/api/:path*`,
//       },
//       {
//         source: '/graphql',
//         destination: `http://0.0.0.0:${process.env.SERVER_PORT || 5000}/graphql`,
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

// next.config.js
// client-nextjs/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발용 CORS 허용 (Next.js 15 이상에서 지원)
  allowedDevOrigins: [
    'http://1af219cc-4238-4cc1-b774-03457e5a48ad-00-1dqbl6swyb0bu.kirk.replit.dev',
    'http://localhost:3000',
    'http://localhost:5000/graphql'
  ],

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