/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '',
  assetPrefix: '',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  async rewrites() {
    return [
      {
        source: '/api/metrics',
        destination: 'http://localhost:3009/api/metrics'
      },
      {
        source: '/api/metrics/:path*',
        destination: 'http://localhost:3009/api/metrics/:path*'
      },
      {
        source: '/push-api/:path*',
        destination: 'http://localhost:3011/:path*'
      }
    ]
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig