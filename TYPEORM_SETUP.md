# Configuración de PostgreSQL + TypeORM - HorseTrust

## ✅ Configuración Completada

### 1. **Entidades TypeORM** (`lib/database/entities/`)
Entidades:
- **User** - Usuarios con roles y niveles de vendedor
- **Address** - Direcciones de usuarios
- **Horse** - Información de caballos
- **Document** - Documentos asociados a caballos y usuarios
- **Chat** - Conversations entre compradores y vendedores
- **Message** - Mensajes dentro de chats
- **Sale** - Transacciones de ventas
- **Review** - Calificaciones y reviews

### 2. **Enumeradores** (`lib/database/enums/index.ts`)
Enums definidos:
- Sex, SellerLevel, Discipline, TypeDocument
- Category, Role, VerificationStatus
- HorseSaleStatus, DocumentPurpose

### 3. **Configuración de DataSource** (`lib/database/data-source.ts`)
- Conexión a PostgreSQL configurada
- Sincronización automática en desarrollo
- Logging habilitado en desarrollo

### 4. **Utilidades de Inicialización** (`lib/database/index.ts`)
- `initializeDataSource()` - Inicializa la conexión
- `getDataSource()` - Obtiene la instancia del DataSource
- Protección contra múltiples conexiones

### 5. **Configuración TypeScript** (`tsconfig.json`)
Añadidas las opciones necesarias para TypeORM:
- `experimentalDecorators: true`
- `emitDecoratorMetadata: true`

