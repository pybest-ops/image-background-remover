/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Keep static export for frontend
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
