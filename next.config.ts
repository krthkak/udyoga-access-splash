import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enable static export
  eslint: {
    // Ignore ESLint errors during build for landing page
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build for landing page
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
    domains: ["aisect.org"],
  },
};

export default nextConfig;
