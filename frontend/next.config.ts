import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/generate-text",
        destination: `${BACKEND_URL}/generate-text`,
      },
      {
        source: "/api/generate-from-image",
        destination: `${BACKEND_URL}/generate-from-image`,
      },
      {
        source: "/api/generate-from-document",
        destination: `${BACKEND_URL}/generate-from-document`,
      },
      {
        source: "/api/health",
        destination: `${BACKEND_URL}/health`,
      },
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
