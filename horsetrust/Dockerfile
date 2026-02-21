# Stage 1: Instalar dependencias
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
# Copiamos las dependencias primero
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Instalamos las dependencias
RUN pnpm install --frozen-lockfile

# Stage 2: Construir la aplicacion
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
# Copiamos las dependencias instaladas desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
# Copiamos el codigo de la aplicacion
COPY . .
# Construimos la aplicacion
RUN pnpm build

# Stage 3: Imagen de produccion
FROM node:22-alpine AS runner
WORKDIR /app
# Creamos un usuario no root para ejecutar la aplicacion
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Configuramos las variables para el entorno de produccion
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiamos los archivos necesarios para ejecutar la aplicacion
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiamos al usuario no root y exponemos el puerto
USER nextjs
EXPOSE 3000

# Comando para ejecutar la aplicacion
CMD ["node", "server.js"]
