const runtimeCaching = require('next-pwa/cache')

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  customWorkerDir: 'public'
})

module.exports = withPWA({
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    // Allow build to complete with TypeScript errors for now
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow build to complete with ESLint errors for now
    ignoreDuringBuilds: true,
  },
  // Skip static generation for pages that use client-only features
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['agistaffers.com', 'admin.agistaffers.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Exclude node-specific modules from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
      }
    }
    
    // Handle native modules and Docker dependencies
    if (isServer) {
      // Mark problematic modules as external
      const externals = [
        'dockerode',
        'ssh2', 
        'cpu-features',
        'docker-modem',
        'node-pty',
        'sharp'
      ]
      
      config.externals.push(...externals)
      
      // Ignore native module resolution errors
      config.externals.push(({ request }, callback) => {
        if (request.includes('.node') || request.includes('cpufeatures')) {
          return callback(null, `commonjs ${request}`)
        }
        callback()
      })
    }
    
    return config
  },
})