# Migración del Schema

Este directorio contiene las migraciones de TypeORM.

## Generar una nueva migración

Después de realizar cambios en las entidades, ejecuta:

```bash
pnpm db:generate
```

Esto comparará tu schema actual con las entidades y generará una migración automática.

## Ejecutar migraciones

```bash
pnpm db:migrate
```

## Revertir la última migración

```bash
pnpm db:revert
```

## Ver migraciones ejecutadas

```bash
pnpm db:show
```

## Más información

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
