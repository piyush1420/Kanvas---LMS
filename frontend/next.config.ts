import type { NextConfig } from "next";

// In production the browser calls /api/* on the frontend's own domain and
// Next.js forwards it to the backend, so the session cookie is first-party.
const BACKEND_URL = process.env.BACKEND_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!BACKEND_URL) return [];
    return [
      { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
      { source: "/lab5/:path*", destination: `${BACKEND_URL}/lab5/:path*` },
    ];
  },
};

export default nextConfig;
