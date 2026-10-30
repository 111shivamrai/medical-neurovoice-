/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['recharts', 'react-is'],
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig
