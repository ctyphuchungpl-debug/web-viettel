import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  serverExternalPackages: ["@neondatabase/serverless"],
  poweredByHeader: false
};
export default nextConfig;
