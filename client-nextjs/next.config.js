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
  // Replit 환경에서의 최적화 설정
  experimental: {
    // 빠른 새로고침 활성화
    forceSwcTransforms: true,
  },
  
  // Cross origin 허용 설정 (Replit 환경)
  allowedDevOrigins: [
    '*.replit.dev',
    'localhost',
    '127.0.0.1'
  ],
  
  // 이미지 최적화 설정
  images: {
    domains: ['localhost', '*.replit.dev'],
    unoptimized: process.env.REPLIT ? true : false,
  },
  
  // API 라우트 프록시 설정 (선택적 사용)
  async rewrites() {
    // Replit 환경에서는 프록시 사용하지 않음
    if (process.env.REPLIT) {
      return [];
    }
    
    // 로컬 개발 환경에서만 프록시 사용
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:${process.env.SERVER_PORT || 5000}/api/:path*`,
      },
      {
        source: "/graphql",
        destination: `http://localhost:${process.env.SERVER_PORT || 5000}/graphql`,
      },
    ];
  },
  
  // 개발 환경 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
