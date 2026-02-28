/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Ampliamos a 10MB para estar seguros
    },
  },
};

module.exports = nextConfig;