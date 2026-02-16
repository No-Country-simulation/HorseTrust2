# Configuración de Base de Datos PostgreSQL

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_postgres
DB_NAME=horsetrust

# Node Environment
NODE_ENV=development
```

## Instalación y Configuración Local

### 1. Instalar PostgreSQL

**Windows:**
- Descarga el instalador desde [postgresql.org](https://www.postgresql.org/download/windows/)
- Sigue el asistente de instalación
- Asegúrate de anotar la contraseña del usuario `postgres`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Crear la Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE horsetrust;

# Verificar que se creó correctamente
\l

# Salir
\q
```

### 3. Realizar Migraciones

```bash
# Generar migraciones automáticas basadas en las entidades

pnpm db:generate

# Ejecutar migraciones

pnpm db:migrate
```

## Uso en tu Aplicación

### En Route Handlers (API Routes)

```typescript
// app/api/users/route.ts
import { getDataSource } from '@/lib/database';
import { User } from '@/lib/database/entities';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.find();

    return Response.json(users);
  } catch (error) {
    return Response.json({ error: 'Error fetching users' }, { status: 500 });
  }
}
```

### En Server Components (Next.js 13+)

```typescript
// app/users/page.tsx
import { getDataSource } from '@/lib/database';
import { User } from '@/lib/database/entities';

export default async function UsersPage() {
  const dataSource = await getDataSource();
  const userRepository = dataSource.getRepository(User);
  const users = await userRepository.find();

  return (
    <div>
      {users.map((user) => (
        <p key={user.id}>{user.email}</p>
      ))}
    </div>
  );
}
```

### En Server Actions

```typescript
// app/actions/users.ts
'use server';

import { getDataSource } from '@/lib/database';
import { User } from '@/lib/database/entities';

export async function createUser(email: string, password: string) {
  const dataSource = await getDataSource();
  const userRepository = dataSource.getRepository(User);

  const user = userRepository.create({ email, password });
  return await userRepository.save(user);
}
```

## Comandos Útiles de TypeORM

```bash
# Generar migraciones (cuando cambies las entidades)
pnpm db:generate

# Ejecutar migraciones
pnpm db:migrate

# Revertir última migración
pnpm db:revert

# Ver migraciones ejecutadas
pnpm db:show

# Comandos completos (equivalentes):
npx ts-node -O '{"module":"commonjs"}' ./node_modules/typeorm/cli.js -d typeorm.config.js migration:generate lib/database/migrations/Migration
npx ts-node -O '{"module":"commonjs"}' ./node_modules/typeorm/cli.js -d typeorm.config.js migration:run
npx ts-node -O '{"module":"commonjs"}' ./node_modules/typeorm/cli.js -d typeorm.config.js migration:revert
npx ts-node -O '{"module":"commonjs"}' ./node_modules/typeorm/cli.js -d typeorm.config.js migration:show
```

## Estructura de Carpetas

```
lib/
├── database/
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Address.ts
│   │   ├── Horse.ts
│   │   ├── Document.ts
│   │   ├── Chat.ts
│   │   ├── Message.ts
│   │   ├── Sale.ts
│   │   ├── Review.ts
│   │   └── index.ts
│   ├── enums/
│   │   └── index.ts
│   ├── migrations/
│   ├── subscribers/
│   ├── data-source.ts
│   └── index.ts
```

## Notas Importantes

- **TypeORM + Next.js:** TypeORM funciona mejor con API Routes y Server Components
- **Sincronización automática:** Solo activa `synchronize: true` en desarrollo
- **Reflect Metadata:** Asegúrate de que `import 'reflect-metadata'` esté al inicio del archivo
- **Conexión única:** El código verifica si la conexión ya está inicializada para evitar múltiples conexiones
