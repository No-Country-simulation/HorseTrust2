import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Paquetes y módulos locales que deben correr en Node.js nativo, fuera del
  // bundle de Turbopack. Esto es crítico para TypeORM: sus decoradores usan
  // reflect-metadata y dependen de los nombres reales de las clases en runtime.
  // Sin esto, Turbopack minifica "Address" → "d", "User" → "u", etc. y TypeORM
  // lanza: "Entity metadata for d#addresses was not found"
  serverExternalPackages: [
    "typeorm",
    "reflect-metadata",
    "pg",
    "bcrypt",
    "./lib/database/data-source",
    "./lib/database/get-repository",
    "./lib/database/entities/User",
    "./lib/database/entities/Address",
    "./lib/database/entities/Horse",
    "./lib/database/entities/Document",
    "./lib/database/entities/Chat",
    "./lib/database/entities/Message",
    "./lib/database/entities/Sale",
    "./lib/database/entities/Review",
  ],

  // Deshabilitar minificación del servidor como capa adicional de protección
  experimental: {
    serverMinification: false,
  },

  // Turbopack vacío para silenciar el warning de Next.js 16
  turbopack: {},

  devIndicators: false,
};

export default nextConfig;
