import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    webpackMemoryOptimizations: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
