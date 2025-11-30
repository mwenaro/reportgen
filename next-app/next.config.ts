import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Multi-tenant configuration - simplified for initial setup */
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.localhost:3000']
    }
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https', 
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  
  /* Turbopack configuration for Next.js 16 */
  turbopack: {},
};

export default nextConfig;
