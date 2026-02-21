import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["typeorm", "reflect-metadata", "pg"],
};

export default nextConfig;
