import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Paquetes npm que deben correr en Node.js nativo, fuera del bundle de webpack.
  // Esto es crítico para TypeORM: sus decoradores usan reflect-metadata y
  // dependen de los nombres reales de las clases en runtime.
  serverExternalPackages: ["typeorm", "reflect-metadata", "pg", "bcrypt"],

  // Deshabilitar minificación del servidor para preservar los nombres de clase
  // que TypeORM necesita para resolver los metadatos de entidades en producción.
  experimental: {
    serverMinification: false,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Marcar los módulos de base de datos como externos para que webpack
      // no los bundlee ni renombre sus clases. Esto resuelve el error:
      // "Entity metadata for d#addresses was not found"
      const externals = Array.isArray(config.externals)
        ? config.externals
        : config.externals
          ? [config.externals]
          : [];

      externals.push(
        (
          { request }: { request?: string },
          callback: (err?: Error | null, result?: string) => void,
        ) => {
          if (
            request &&
            (request.includes("lib/database") ||
              request.includes("database/entities") ||
              request.includes("database/data-source") ||
              request.includes("database/get-repository"))
          ) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      );

      config.externals = externals;
    }

    return config;
  },

  devIndicators: false,
};

export default nextConfig;
