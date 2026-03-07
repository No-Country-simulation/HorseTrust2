import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Paquetes npm externos que deben correr en Node.js nativo, fuera del bundle
  // de Turbopack. Crítico para TypeORM: sus decoradores usan reflect-metadata
  // y dependen de los nombres reales de las clases en runtime.
  serverExternalPackages: ["typeorm", "reflect-metadata", "pg", "bcrypt"],

  // Deshabilitar minificación del servidor para preservar nombres de clase.
  // TypeORM necesita el nombre real (e.g. "Address", "User") para resolver
  // los metadatos de los decoradores en producción.
  experimental: {
    serverMinification: false,
  },

  // Turbopack vacío para silenciar el warning de Next.js 16
  turbopack: {},

  devIndicators: false,
};

export default nextConfig;
