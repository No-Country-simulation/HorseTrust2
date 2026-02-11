import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["typeorm", "reflect-metadata", "pg"],
};

export default nextConfig;
