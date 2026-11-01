/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['recharts', 'react-is'],
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
