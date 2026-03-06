import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [
    "typeorm",
    "reflect-metadata",
    "pg",
    // Entidades de TypeORM — deben quedar fuera del bundle de webpack
    // para que los decoradores y metadatos no sean minificados/renombrados
    "@/lib/database/entities",
    "@/lib/database/data-source",
    "@/lib/database/get-repository",
  ],

  // Deshabilitar minificación del servidor para preservar los nombres
  // de clase que TypeORM necesita para resolver los metadatos de entidades
  experimental: {
    serverMinification: false,
  },

  devIndicators: false,
};

export default nextConfig;
