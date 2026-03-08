# HorseTrust

## El Problema

Comprar un caballo es una transacción de alto riesgo y alto costo, frecuentemente afectada por falta de transparencia en el historial médico, datos de rendimiento y credibilidad del vendedor. Los marketplaces actuales son esencialmente "clasificados" sin ningún tipo de verificación.

## La Solución

HorseTrust es un marketplace de caballos con **listings verificados**: integra registros veterinarios, videos de rendimiento y canales de comunicación seguros entre compradores y vendedores, reduciendo el riesgo de ventas fraudulentas en el mundo ecuestre.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript |
| Base de datos | PostgreSQL 17 |
| ORM | TypeORM 0.3 |
| Autenticación | JWT (jsonwebtoken) + cookies HttpOnly |
| Tiempo real | Socket.IO 4 |
| Estilos | Tailwind CSS 4 |
| Runtime | Node.js 22 |
| Package manager | pnpm |
| Proxy | Nginx (Alpine) |
| Contenedores | Docker + Docker Compose |
| CI/CD | GitHub Actions → GHCR |

---

## Arquitectura

La aplicación es un **monolito fullstack** en Next.js: el mismo proceso sirve tanto el frontend (React Server Components) como la API REST (`/api/v1/...`) y el servidor de WebSockets (Socket.IO).

```
Browser
   │
   ▼
Nginx :80
   │
   ▼
Next.js :3000 (app container)
   ├── React Server Components  (páginas públicas y protegidas)
   ├── API Routes  (/api/v1/...)
   └── Socket.IO  (mensajería en tiempo real)
       │
       ▼
PostgreSQL :5432 (postgres container)
```

En producción los tres servicios corren en la misma Docker network (`horsetrust-network`), por lo que la comunicación interna es directa sin pasar por la IP pública.

---

## Estructura del Proyecto

```
HorseTrust2/
├── docker-compose.yaml          # Orquestación de producción
├── docker-compose-dev.yaml      # Orquestación de desarrollo
├── .env.example                 # Variables de entorno requeridas
└── horsetrust/                  # Aplicación Next.js
    ├── app/
    │   ├── (protected)/         # Rutas protegidas por middleware
    │   │   ├── admin/           # Panel de administración
    │   │   │   ├── horses/      # Gestión de caballos
    │   │   │   └── videos/      # Revisión de videos
    │   │   └── me/              # Perfil del usuario
    │   │       └── chat/        # Mensajería en tiempo real
    │   ├── api/v1/              # API REST
    │   │   ├── auth/            # login, logout, register
    │   │   ├── horses/          # CRUD de caballos + filtros
    │   │   ├── chats/           # Gestión de conversaciones
    │   │   ├── sales/           # Registro de ventas
    │   │   ├── reviews/         # Reseñas de vendedores
    │   │   ├── me/              # Perfil y caballos del usuario
    │   │   ├── admin/           # Endpoints de administración
    │   │   └── uploads/         # Servicio de archivos estáticos
    │   ├── gallery/             # Galería pública de caballos
    │   ├── horses/              # Listado y detalle de caballos
    │   ├── login/
    │   ├── register/
    │   ├── contact/
    │   └── como-funciona/
    ├── lib/
    │   ├── auth/                # JWT, guards, get-user-from-token
    │   ├── database/
    │   │   ├── entities/        # Entidades TypeORM
    │   │   ├── enums/           # Enums compartidos
    │   │   ├── data-source.ts   # Configuración del DataSource
    │   │   └── get-repository.ts
    │   ├── http/                # withErrorHandler, ApiResponse
    │   └── storage/             # Gestión de uploads locales
    ├── hooks/                   # useSocket, useReveal
    ├── store/                   # Zustand stores
    ├── server.ts                # Servidor custom con Socket.IO
    ├── instrumentation.ts       # Seed del usuario admin
    ├── nginx.conf               # Configuración de Nginx
    └── Dockerfile
```

---

## Modelo de Datos

### Entidades

#### `User`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Clave primaria |
| `email` | varchar (unique) | Email del usuario |
| `password` | varchar | Hash bcrypt |
| `role` | enum | `admin` \| `user` |
| `seller_level` | enum | `bronze` \| `silver` \| `gold` |
| `total_sales` | int | Ventas completadas |
| `average_rating` | float | Promedio de reseñas |

El nivel del vendedor sube automáticamente: **5 ventas → silver**, **15 ventas → gold**.

#### `Horse`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Clave primaria |
| `name` | varchar | Nombre del caballo |
| `age` | int | Edad en años |
| `sex` | enum | `male` \| `female` |
| `breed` | varchar | Raza |
| `discipline` | enum | `racing` \| `jumping` \| `dressage` \| `recreational` |
| `sale_status` | enum | `for_sale` \| `reserved` \| `sold` |
| `verification_status` | enum | `pending` \| `verified` \| `rejected` |
| `price` | int | Precio en la moneda local |

Al editar un caballo, su `verification_status` vuelve automáticamente a `pending`.

#### `Document`
Archivos asociados a un caballo: imágenes, PDFs y videos.

| Campo | Tipo | Descripción |
|---|---|---|
| `type` | enum | `image` \| `document` \| `video` |
| `category` | enum | `ownership` \| `veterinary` \| `competition` \| `identification` |
| `purpose` | enum | `cover` \| `title` \| `passport` \| `xray` \| `vaccine_card` \| `certificate` |
| `verified` | boolean | Aprobado por un admin |
| `reason` | varchar | Motivo de rechazo (si aplica) |

Los archivos se almacenan en `public/uploads/horses/{horseId}/{category}/{purpose}/`.
Tamaño máximo: **10 MB**. Formatos aceptados: JPEG, PNG, WebP, PDF, MP4, WebM.

#### `Chat` y `Message`
Sistema de mensajería directa entre comprador y vendedor. Cada par `(buyer_id, seller_id)` solo puede tener un chat. Los mensajes se envían en tiempo real vía Socket.IO y se persisten en PostgreSQL.

#### `Sale`
Registro de una venta completada. Al crear una `Sale`, el caballo pasa automáticamente a `sold` y el contador `total_sales` del vendedor se incrementa.

#### `Review`
Reseña del comprador sobre el vendedor, asociada a una `Sale`. El `average_rating` del vendedor se recalcula con cada nueva reseña.

---

## API REST

Base URL: `/api/v1`

### Autenticación

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/auth/register` | Crear cuenta | No |
| POST | `/auth/login` | Iniciar sesión (setea cookie `token`) | No |
| POST | `/auth/logout` | Cerrar sesión (limpia cookie) | No |

La autenticación usa una cookie `HttpOnly` con nombre `token` que contiene un JWT firmado con `JWT_SECRET`. El token expira en **7 días**.

### Caballos

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/horses` | Listar caballos con filtros y paginación | No |
| POST | `/horses` | Publicar un caballo | Sí |
| GET | `/horses/:id` | Detalle de un caballo | No |
| PATCH | `/horses/:id` | Editar un caballo (solo el dueño) | Sí |
| DELETE | `/horses/:id` | Eliminar un caballo (solo el dueño, no si está vendido) | Sí |

#### Filtros disponibles en `GET /horses`

| Parámetro | Tipo | Ejemplo |
|---|---|---|
| `status` | enum | `for_sale`, `reserved`, `sold` |
| `verification_status` | enum | `pending`, `verified`, `rejected` |
| `discipline` | enum | `racing`, `jumping`, `dressage`, `recreational` |
| `sex` | enum | `male`, `female` |
| `min_price` | int | `5000` |
| `max_price` | int | `20000` |
| `breed` | string | `criollo` (búsqueda parcial) |
| `has_documents` | boolean | `true`, `false` |
| `created_after` | date | `2025-01-01` |
| `created_before` | date | `2025-12-31` |
| `sort_by` | string | `price`, `age`, `name` (default: `created_at`) |
| `sort_order` | string | `ASC`, `DESC` (default: `DESC`) |
| `page` | int | `1` |
| `limit` | int | `20` (máx 100) |

### Documentos y Videos

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/horses/:id/documents` | Listar documentos del caballo | No |
| POST | `/horses/:id/documents` | Subir documento (multipart/form-data) | Sí |
| DELETE | `/horses/:id/documents?documentId=xxx` | Eliminar documento | Sí |
| GET | `/horses/:id/videos` | Listar videos del caballo | No |
| POST | `/horses/:id/videos` | Agregar video (por URL) | Sí |

### Chats

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/chats` | Listar mis conversaciones | Sí |
| POST | `/chats` | Iniciar chat con un vendedor | Sí |
| GET | `/chats/:id` | Detalle de un chat | Sí |
| GET | `/chats/:id/messages` | Mensajes de un chat | Sí |
| POST | `/chats/:id/sales` | Registrar venta desde un chat | Sí |

### Ventas y Reseñas

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/sales` | Registrar venta (vendedor) | Sí |
| POST | `/sales/:id/reviews` | Dejar reseña asociada a una venta | Sí |
| POST | `/users/:id/reviews` | Dejar reseña a un vendedor | Sí |
| GET | `/users/:id/reviews` | Listar reseñas de un vendedor | No |
| PATCH | `/reviews/:id` | Editar una reseña propia | Sí |
| DELETE | `/reviews/:id` | Eliminar una reseña propia | Sí |

### Perfil

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/me` | Datos del usuario autenticado | Sí |
| GET | `/me/horses` | Mis caballos publicados | Sí |
| GET | `/me/reviews` | Mis reseñas como vendedor | Sí |

### Administración (solo rol `admin`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/admin/horses/pending` | Caballos pendientes de verificación |
| GET | `/admin/horses/:id` | Detalle con todos los campos |
| PATCH | `/admin/horses/:id` | Cambiar `verification_status` |
| GET | `/admin/videos` | Listar videos (`?status=pending\|verified\|rejected`) |
| GET | `/admin/videos/:videoId` | Detalle de un video |
| PATCH | `/admin/videos/:videoId/review` | Aprobar o rechazar un video |

---

## WebSockets (Socket.IO)

El servidor de WebSockets corre en el mismo proceso que Next.js (ver `server.ts`).

| Evento (cliente → servidor) | Payload | Descripción |
|---|---|---|
| `join_chat` | `chatId: string` | Unirse a la sala de un chat |
| `send_message` | `{ chatId, senderId, content, tempId? }` | Enviar mensaje |
| `typing` | `{ chatId, userId }` | Notificar que está escribiendo |
| `stop_typing` | `{ chatId, userId }` | Notificar que dejó de escribir |
| `mark_read` | `{ chatId, userId }` | Marcar mensajes como leídos |

| Evento (servidor → cliente) | Payload | Descripción |
|---|---|---|
| `new_message` | mensaje + `tempId` | Nuevo mensaje en la sala |
| `user_typing` | `{ userId }` | Otro usuario está escribiendo |
| `stop_typing` | `{ userId }` | Otro usuario dejó de escribir |
| `messages_read` | `{ chatId, readBy }` | Mensajes marcados como leídos |
| `message_error` | `{ tempId, error }` | Error al enviar un mensaje |

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
# PostgreSQL
POSTGRES_USER=horsetrust
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=horsetrust
POSTGRES_PORT=5432

# Next.js
JWT_SECRET=un_secreto_de_al_menos_32_caracteres
NEXT_PUBLIC_BASE_URL=http://tu-ip-o-dominio
COOKIE_SECURE=false   # true solo si usas HTTPS
```

| Variable | Descripción |
|---|---|
| `POSTGRES_USER` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL |
| `POSTGRES_DB` | Nombre de la base de datos |
| `POSTGRES_PORT` | Puerto de PostgreSQL (default: 5432) |
| `JWT_SECRET` | Secreto para firmar los tokens JWT (mín. 32 caracteres) |
| `NEXT_PUBLIC_BASE_URL` | URL pública de la app (usada por el navegador) |
| `COOKIE_SECURE` | `true` para HTTPS, `false` para HTTP |

---

## Instalación y Desarrollo Local

### Requisitos

* Node.js 22+
* pnpm
* Docker y Docker Compose

### 1. Clonar el repositorio

```bash
git clone https://github.com/No-Country-simulation/HorseTrust2.git
cd HorseTrust2
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus valores
```

### 3. Levantar la base de datos

```bash
docker compose -f docker-compose-dev.yaml up -d postgres
```

### 4. Instalar dependencias y correr en desarrollo

```bash
cd horsetrust
pnpm install
pnpm dev
```

La app estará disponible en `http://localhost:3000`.

---

## Despliegue en Producción

El proyecto incluye un pipeline de CI/CD en GitHub Actions (`.github/workflows/ci-pipeline.yaml`) que construye y publica la imagen Docker en GitHub Container Registry (`ghcr.io`) con cada push a `main`.

### Levantar en servidor

```bash
# 1. Clonar y configurar
git clone https://github.com/No-Country-simulation/HorseTrust2.git
cd HorseTrust2
cp .env.example .env
# Edita .env con tus valores de producción

# 2. Descargar imagen y levantar
docker compose pull
docker compose up -d

# 3. Ver logs
docker logs -f horsetrust-app
```

### Servicios Docker

| Servicio | Imagen | Puerto interno |
|---|---|---|
| `horsetrust-app` | `ghcr.io/no-country-simulation/horsetrust2/horsetrust:latest` | 3000 |
| `horsetrust-db` | `postgres:17-alpine` | 5432 |
| `horsetrust-proxy` | `nginx:alpine` | 80 (expuesto) |

### Usuario admin por defecto

Al iniciar la aplicación por primera vez, `instrumentation.ts` crea automáticamente un usuario administrador:

| Campo | Valor |
|---|---|
| Email | `admin@admin.com` |
| Password | `admin` |

> ⚠️ Cambia la contraseña del admin inmediatamente después del primer despliegue.

---

## Flujo de Verificación de Caballos

1. El vendedor publica un caballo → `verification_status: pending`
2. El vendedor sube documentos (imágenes, PDFs, videos)
3. Un admin revisa el caballo y sus documentos desde el panel `/admin`
4. El admin cambia el estado a `verified` o `rejected`
5. Solo los caballos `verified` aparecen en la galería pública (`/gallery`)
6. Si el vendedor edita un caballo ya verificado, vuelve a `pending`

---

## Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.
