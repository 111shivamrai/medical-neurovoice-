/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['recharts', 'react-is', 'three', '@react-three/fiber', '@react-three/drei'],
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
