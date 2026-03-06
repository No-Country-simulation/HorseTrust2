import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["typeorm", "reflect-metadata", "pg"],

  devIndicators: false,
};

export default nextConfig;
