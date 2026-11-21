# NearDear — reglas para el agente

App de localización familiar. El plan aprobado está en `docs/plan.md`: síguelo fase a fase.

## Idioma

- Responde y documenta en español. El código (identificadores) en inglés; los textos de la app en español vía i18n.

## Forma de trabajar

- **TDD** en dominio y casos de uso: primero el test en rojo, luego el código mínimo, luego refactor.
- Tests de integración para cada adaptador (contra Supabase local).
- Una fase = una rama/PR pequeña. Antes de dar una fase por terminada: `pnpm check` en verde.
- Arquitectura hexagonal en `apps/api`: `domain` no importa nada de `application`, `infrastructure`, `http` ni `main`.
- El contrato de la API vive en `packages/contracts` (Zod). App y API lo importan; nunca se duplican tipos.

## Seguridad y privacidad (repo PÚBLICO)

- **Nunca** subas secretos: claves, tokens, contraseñas, `.env`, `google-services.json`, `GoogleService-Info.plist`, certificados. Van en GitHub Secrets, Vercel, EAS o archivos locales ignorados.
- La clave `service_role` de Supabase y la URL directa de Postgres **solo** pueden usarse en `apps/api`. `pnpm check:secrets` lo comprueba.
- La app **nunca** lee tablas de Supabase directamente: todo pasa por la API `/v1`. Única excepción: suscripción a canales Realtime privados `v1:group:{id}`.
- Toda tabla nueva lleva RLS activado y forzado, **sin políticas** para `anon`/`authenticated` (salvo que el plan diga lo contrario).
- Datos de prueba siempre ficticios: emails `@example.com`, coordenadas inventadas. Nunca datos reales de ubicación.
- No registres coordenadas ni emails en logs ni en Sentry.
- Si un hook de gitleaks bloquea un commit, **no lo saltes** (`--no-verify` prohibido): quita el secreto.

## Comandos

- `pnpm install` — instala dependencias y los hooks de git (lefthook).
- `pnpm check` — lint, tipos, tests y control de credenciales.
- `pnpm format` — formatea con Prettier.
