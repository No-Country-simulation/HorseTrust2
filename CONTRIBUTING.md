# Guía de Contribución

Gracias por tu interés en contribuir a HorseTrust. Este documento describe el proceso y las pautas para colaborar efectivamente en el proyecto.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Empezar](#cómo-empezar)
- [Configuración del Entorno](#configuración-del-entorno)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estrategia de Branching](#estrategia-de-branching)
- [Convenciones de Commits](#convenciones-de-commits)
- [Pull Requests](#pull-requests)

## Código de Conducta

Este proyecto se adhiere a un código de conducta que todos los colaboradores deben seguir. Lee el [Código de Conducta](CODE_OF_CONDUCT.md) antes de contribuir.

## Cómo Empezar

### Requisitos Previos

- Node.js 18 o superior
- pnpm 8 o superior
- PostgreSQL 14 o superior
- Git

### Fork y Clone

1. Haz un fork del repositorio
2. Clona tu fork localmente:

   ```bash
   git clone https://github.com/tu-usuario/HorseTrust2.git
   cd HorseTrust2
   ```

3. Agrega el repositorio original como upstream:
   ```bash
   git remote add upstream https://github.com/original/HorseTrust2.git
   ```

## Configuración del Entorno

### 1. Instalar Dependencias

```bash
cd horsetrust
pnpm install
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tu configuración local:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=horsetrust
NODE_ENV=development
JWT_SECRET=tu_secreto_seguro
```

### 3. Configurar Base de Datos

Asegúrate de tener PostgreSQL corriendo y ejecuta las migraciones:

```bash
pnpm db:migrate
```

Para más detalles sobre la configuración de la base de datos, consulta [SETUP_GUIDE.md](SETUP_GUIDE.md) y [TYPEORM_SETUP.md](TYPEORM_SETUP.md).

### 4. Iniciar el Servidor de Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## Flujo de Trabajo

Utilizamos **GitHub Flow**, lo que significa que la rama `main` siempre debe ser estable y desplegable.

### Proceso General

1. Asegúrate de estar actualizado con `main`:

   ```bash
   git checkout main
   git pull upstream main
   ```

2. Crea una nueva rama siguiendo las convenciones:

   ```bash
   git checkout -b feat/descripcion-de-tu-feature
   ```

3. Realiza tus cambios y commits siguiendo las convenciones
4. Envía tu rama a tu fork:

   ```bash
   git push origin feat/descripcion-de-tu-feature
   ```

5. Abre un Pull Request hacia `main`

## Estrategia de Branching

Las ramas siguen el formato: `categoria/descripcion-corta`

### Reglas de Formato

- Todo en **minúsculas**
- Usar **guiones** para separar palabras
- Sin caracteres especiales, espacios, tildes o ñ
- Descripción clara y concisa

### Prefijos de Ramas

| Prefijo     | Uso                                            | Ejemplo                          |
| ----------- | ---------------------------------------------- | -------------------------------- |
| `feat/`     | Nuevas funcionalidades para backend o frontend | `feat/endpoint-listado-caballos` |
| `fix/`      | Corrección de errores o bugs                   | `fix/validacion-formulario`      |
| `infra/`    | Infraestructura: AWS, Docker, Terraform, CI/CD | `infra/configuracion-s3-aws`     |
| `docs/`     | Cambios exclusivos en documentación            | `docs/actualizar-readme`         |
| `refactor/` | Mejoras de código sin alterar funcionalidad    | `refactor/optimizar-queries`     |
| `chore/`    | Tareas de mantenimiento y configuraciones      | `chore/actualizar-dependencias`  |

### Ejemplos Válidos

```bash
git checkout -b feat/sistema-chat-tiempo-real
git checkout -b fix/error-carga-imagenes
git checkout -b infra/pipeline-deploy
git checkout -b docs/api-endpoints
git checkout -b refactor/componentes-reutilizables
git checkout -b chore/configurar-linter
```

Para más detalles sobre convenciones y flujo de trabajo, consulta [estrategia-branching.md](docs/git-workflow/estrategia-branching.md).

## Convenciones de Commits

Usamos **Conventional Commits** para mantener un historial de cambios claro y semántico.

### Formato

```
tipo(alcance): descripción breve
```

- **tipo**: Coincide con el prefijo de la rama
- **(alcance)**: Opcional. Indica la parte del sistema afectada
- **descripción**: Imperativo, claro y conciso (máximo 72 caracteres)

### Tipos de Commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `infra`: Cambios de infraestructura
- `docs`: Solo documentación
- `refactor`: Refactorización de código
- `chore`: Tareas de mantenimiento
- `test`: Agregar o modificar tests
- `style`: Cambios de formato (sin afectar el código)

### Ejemplos Válidos

```bash
git commit -m "feat(back): agregar endpoint para listados verificados"
git commit -m "feat(web): implementar galeria de imagenes de caballos"
git commit -m "fix(auth): resolver error en validacion de token"
git commit -m "infra(aws): configurar bucket s3 para videos"
git commit -m "docs: actualizar guia de contribucion"
git commit -m "chore: actualizar dependencias de react"
git commit -m "refactor(database): optimizar queries de caballos"
```

### Alcances Comunes

- `back`: Backend/API
- `web`: Frontend web
- `database`: Base de datos y migraciones
- `auth`: Autenticación y autorización
- `api`: Endpoints de la API
- `ui`: Componentes de interfaz
- `shared`: Código compartido

## Pull Requests

### Antes de Crear un PR

- Asegúrate de que tu código sigue las convenciones del proyecto
- Ejecuta el linter: `pnpm lint`
- Verifica que las migraciones funcionan si modificaste la base de datos
- Actualiza la documentación si es necesario
- Prueba tu código localmente

### Creando un Pull Request

1. Asegúrate de que tu rama está actualizada con `main`:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Abre un PR desde tu fork hacia la rama `main` del repositorio original

3. Completa la plantilla del PR con:
   - Descripción clara de los cambios
   - Referencia a issues relacionados (si aplica)
   - Capturas de pantalla (si hay cambios visuales)
   - Checklist de pruebas realizadas

### Proceso de Revisión

- Se requiere **al menos 1 aprobación** de otro colaborador
- Los checks automáticos deben pasar
- El código será revisado en términos de:
  - Funcionalidad
  - Calidad del código
  - Cumplimiento de convenciones
  - Documentación

### Después del Merge

Después de que tu PR sea fusionado:

```bash
git checkout main
git pull upstream main
git branch -d feat/tu-rama
```
## Preguntas o Problemas

Si tienes preguntas o encuentras algún problema:

1. Revisa la documentación existente en la carpeta `docs/`
2. Busca en los issues existentes
3. Si no encuentras respuesta, abre un nuevo issue con una descripción detallada

## Licencia

Al contribuir a HorseTrust, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto.
