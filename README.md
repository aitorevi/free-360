# NearDear

App de localización familiar: grupos en los que cada miembro comparte su ubicación,
mapa en tiempo real y avisos al llegar o salir de lugares.

> Estado: **en desarrollo** (Hito 0, prueba de concepto). Plan completo en [`docs/plan.md`](docs/plan.md).

## Estructura

```
apps/        App móvil (Expo) y API (Hono)
packages/    Contrato compartido (Zod) y configuración
supabase/    Migraciones de la base de datos
docs/        Plan, decisiones y documentación
```

## Requisitos

- Node.js 22.18 o superior (`.nvmrc`)
- pnpm 10 (`corepack enable`)
- [gitleaks](https://github.com/gitleaks/gitleaks) para el hook de pre-commit (macOS: `brew install gitleaks`)

## Primeros pasos

```bash
pnpm install   # instala dependencias y hooks de git
pnpm check     # lint, tipos, tests y control de credenciales
```

## Seguridad

Este repositorio es público. Lee [`SECURITY.md`](SECURITY.md) y las reglas de [`CLAUDE.md`](CLAUDE.md).

## Licencia

Todos los derechos reservados. El código es visible, pero no se concede ninguna licencia de uso.
