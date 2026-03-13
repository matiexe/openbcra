import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  env: {
    APP_VERSION: process.env.npm_package_version,
  }
};

export default nextConfig;
