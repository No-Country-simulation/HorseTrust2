# 🐴 HorseTrust - PostgreSQL + TypeORM Setup


```
lib/database/
├── entities/
│   ├── User.ts              ✅ Usuarios
│   ├── Address.ts           ✅ Direcciones
│   ├── Horse.ts             ✅ Caballos
│   ├── Document.ts          ✅ Documentos
│   ├── Chat.ts              ✅ Chats
│   ├── Message.ts           ✅ Mensajes
│   ├── Sale.ts              ✅ Ventas
│   ├── Review.ts            ✅ Reviews
│   └── index.ts             ✅ Exports
├── enums/
│   └── index.ts             ✅ Todos los enumeradores
├── migrations/
│   └── README.md            ℹ️  Instrucciones
├── data-source.ts           ✅ Configuración de conexión
├── index.ts                 ✅ Inicialización
├── queries.ts               ✅ Consultas avanzadas
├── utils.ts                 ✅ Utilidades y helpers
└── README.md                ℹ️  Documentación

middleware.ts            ✅ Inicialización BD
.env.example                  ℹ️  Variables de entorno
TYPEORM_SETUP.md             ℹ️  Guía completa
```

## 🚀 PRIMEROS PASOS

### 1️⃣ Configurar Variables de Entorno
```bash
# En la raíz del proyecto
cp .env.example .env.local
```

Edita `.env.local` con tu información de PostgreSQL:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=horsetrust
NODE_ENV=development
```

### 2️⃣ Instalar PostgreSQL

- **Windows**: https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql` (luego `brew services start postgresql`)
- **Linux**: `sudo apt-get install postgresql`

### 3️⃣ Crear Base de Datos
```bash
# Abre PostgreSQL
psql -U postgres

# Dentro de psql:
CREATE DATABASE horsetrust;
```

### 4️⃣ Ejecutar Migraciones
```bash
# Genera las migraciones automáticamente
pnpm db:generate

# Ejecuta las migraciones
pnpm db:migrate
```

### 5️⃣ Listo para usar! 🎉
```bash
pnpm dev
```

Abre http://localhost:3000

---

## 📚 Cómo Usar

### Server Action (para crear/actualizar)
```typescript
'use server';
import { getDataSource } from '@/lib/database';
import { User } from '@/lib/database/entities';

export async function createUser(email: string) {
  const dataSource = await getDataSource();
  const user = dataSource.getRepository(User).create({
    email,
    password: 'hash_aqui'
  });
  return await dataSource.getRepository(User).save(user);
}
```

### API Route (para GET)
```typescript
import { getDataSource } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const dataSource = await getDataSource();
  const users = await dataSource.getRepository(User).find();
  return NextResponse.json(users);
}
```

### Server Component (para leer)
```typescript
import { getDataSource } from '@/lib/database';

export default async function Page() {
  const dataSource = await getDataSource();
  const users = await dataSource.getRepository(User).find();
  return <div>{/* render */}</div>;
}
```

### Consultas Avanzadas
```typescript
import { searchHorses, getTopSellers } from '@/lib/database/queries';

const horses = await searchHorses({
  discipline: 'jumping',
  maxPrice: 50000,
  page: 1,
});

const sellers = await getTopSellers(10);
```

---

## 🔨 Comandos Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia Next.js

# Base de datos
pnpm db:generate  # Genera migraciones
pnpm db:migrate   # Ejecuta migraciones
pnpm db:revert    # Revierte última migración
pnpm db:show      # Ver migraciones ejecutadas

# Build
pnpm build        # Build de producción
pnpm start        # Inicia servidor producción
```

---

## 📖 Documentación

- **Documentación Completa**: Ver [TYPEORM_SETUP.md](TYPEORM_SETUP.md)
- **Queries Avanzadas**: Ver [lib/database/queries.ts](lib/database/queries.ts)
- **Utilidades**: Ver [lib/database/utils.ts](lib/database/utils.ts)
- **Base de datos**: Ver [lib/database/README.md](lib/database/README.md)

---

## 💡 Tips

✅ **Relaciones**: Todas las relaciones están configuradas con cascade
✅ **Timestamps**: Se generan automáticamente `created_at` y `updated_at`
✅ **Enums**: Todos definidos y tipados con TypeScript
✅ **Sincronización**: Automática en desarrollo, desactiva en producción
✅ **Transacciones**: Helper `runInTransaction()` disponible en utils

---

## ⚠️ Importante

1. **Seguridad**: Hashea todas las contraseñas antes de guardarlas
   ```typescript
   import bcrypt from 'bcrypt';
   const hash = await bcrypt.hash(password, 10);
   ```

2. **Sincronización**: En `data-source.ts` está configurada para desarrollo
   - Desactívala en producción: `synchronize: process.env.NODE_ENV === 'development'`

3. **Logging**: Activo en desarrollo
   - `logging: process.env.NODE_ENV === 'development'`

---

**¿Preguntas?** Revisa la documentación completa en [TYPEORM_SETUP.md](TYPEORM_SETUP.md)
