# Política de seguridad

NearDear trata datos de ubicación, que son especialmente sensibles. Nos tomamos en serio cualquier vulnerabilidad.

## Cómo reportar una vulnerabilidad

**No abras un issue público.** Usa el reporte privado de GitHub:
pestaña **Security** → **Report a vulnerability** de este repositorio.

Incluye, si puedes: descripción, pasos para reproducirlo, impacto y versión afectada.
Responderemos lo antes posible.

## Qué protegemos en el repositorio

- Escaneo de secretos con gitleaks en cada commit (hook local) y en la CI.
- Secret scanning y push protection de GitHub.
- Dependabot para dependencias vulnerables.
- Row Level Security en todas las tablas de la base de datos.
