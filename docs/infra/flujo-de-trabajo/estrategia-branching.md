# Guía de Contribución y Flujo de Trabajo

Dentro de este documento se definen los estándares de colaboración para el repositorio. El objetivo de este es mantener un historial limpio, facilitar la integración continua y el despliegue continuo (CI/CD) y asegurar la calidad del código en nuestro Monorepo.

## 1. Estrategia de Branching (GitHub Flow)

Utilizamos **GitHub Flow**. Esto significa que la rama `main` siempre debe ser desplegable y estable.

**Reglas Generales:**

- **Rama `main` Protegida:** No se permiten commits directos. Todo cambio debe llegar mediante un Pull Request (PR).
- **Ramas Efímeras:** Las ramas de trabajo deben tener una vida corta. Se crean, se trabajan y se fusionan.

## 2. Convención de Nombres de Ramas

Todas las ramas deben crearse a partir de `main` y seguir estrictamente el formato:

`categoria/descripcion-corta`

### Reglas de Formato

- Todo en **minúsculas**.
- Usar **guiones (`-`)** para separar palabras.
- Sin caracteres especiales ni espacios (incluidas tildes y ñ).

### Prefijos Permitidos (Categorías)

| Prefijo     | Uso Exclusivo                                                      | Ejemplo                                                                     |
| :---------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `feat/`     | Nuevas funcionalidades para Backend o frontend.                    | `feat/endpoint-listado-caballos`, `feat/ui-perfil-caballo`, `feat/web-chat` |
| `fix/`      | Corrección de errores o bugs.                                      | `fix/validacion-formulario`, `fix/error-carga-imagenes`                     |
| `infra/`    | **Infraestructura:** AWS, Docker, Terraform, CI/CD.                | `infra/configuracion-s3-aws`, `infra/pipeline-deploy`                       |
| `docs/`     | Cambios exclusivos en documentación.                               | `docs/api-endpoints`, `docs/actualizar-readme`                              |
| `refactor/` | Mejoras de código que no alteran la funcionalidad.                 | `refactor/optimizar-queries`, `refactor/componentes-reutilizables`          |
| `chore/`    | Tareas de mantenimiento y configuraciones que no afectan el codigo | `chore/actualizar-dependencias`, `chore/configurar-linter`                  |

---

## 3. Convención de Commits (Conventional Commits)

Los mensajes de commit deben ser semánticos para facilitar la lectura del historial.

**Estructura:**
`tipo(alcance): descripción breve`

- **tipo:** Coincide con el prefijo de la rama (`feat`, `fix`, `infra`, `docs`, `refactor`, `chore`).
- **(alcance):** Opcional. Indica qué parte del sistema se tocó (`back`, `web`, `formulario`, `shared`, `infra`).
- **descripción:** Imperativo, claro y conciso.

### Ejemplos Válidos

- `feat(back): agregar endpoint para listados verificados`
- `feat(web): implementar galeria de imagenes de caballos`
- `feat(mobile): agregar sistema de chat en tiempo real`
- `infra(aws): configurar bucket s3 para videos`
- `fix(mobile): resolver error en carga de perfil`
- `docs: actualizar guias de contribucion`
- `chore(web): actualizar dependencias de react`

---

## 4. Flujo de Pull Requests (PR)

1.  **Crear PR:** Al terminar tu tarea, abre un PR apuntando a `main`.
2.  **Revisión:** Se requiere **al menos 1 aprobación** de otro integrante del equipo.
3.  **Merge:** Una vez aprobado y con los checks pasados, se realiza el merge.

> **Nota:** Si una rama o commit no cumple con estas convenciones, el PR no será aprobado hasta que se corrija.
