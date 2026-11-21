# F0.2 — Poner en marcha el receptor PoC

El receptor guarda tal cual los lotes que envían los móviles durante la Fase 0.
Todo lo que sigue se hace en los paneles de Supabase y Vercel: **ninguna clave va al repo**.

## 1. Proyecto de Supabase

1. Entra en https://supabase.com/dashboard → **New project**.
2. Rellena:
   - **Name:** `neardear`
   - **Database password:** pulsa _Generate a password_ y guárdala en tu gestor de contraseñas.
   - **Region:** **Central EU (Frankfurt)**.
   - Plan **Free**.
3. Espera a que termine de crearse (1–2 min).

## 2. Crear la tabla

1. En el proyecto → **SQL Editor** → **New query**.
2. Pega el contenido de `supabase/migrations/20261121000000_poc_batches.sql` y pulsa **Run**.
3. Comprueba en **Table Editor** que existe `poc_batches` y que aparece con el candado de RLS activado.

## 3. Cadena de conexión del pooler

1. En el proyecto → botón **Connect** (arriba).
2. Pestaña de conexión directa → elige **Transaction pooler** (puerto **6543**).
3. Copia la URI y sustituye `[YOUR-PASSWORD]` por la contraseña del paso 1.

Es la `DATABASE_URL`. Pégala solo en Vercel (paso 5).

## 4. Generar la clave compartida

En la Terminal del Mac:

```bash
openssl rand -hex 32
```

Es la `POC_KEY`. La usarán los móviles en la cabecera `X-PoC-Key`. Guárdala en tu gestor de contraseñas.

## 5. Proyecto en Vercel

1. https://vercel.com/new → importa el repo `aitorevi/neardear`.
2. Configura:
   - **Project Name:** `neardear-poc-receiver`
   - **Root Directory:** `apps/poc-receiver`
   - **Framework Preset:** **Hono** (si no lo detecta solo).
3. En **Environment Variables** añade:
   - `DATABASE_URL` = la URI del paso 3
   - `POC_KEY` = la clave del paso 4
4. Pulsa **Deploy**.

La región (Frankfurt, `fra1`) ya la fija `apps/poc-receiver/vercel.json`.

## 6. Comprobar que funciona

Sustituye `<URL>` por la URL que te da Vercel y `<POC_KEY>` por tu clave:

```bash
# Debe responder {"ok":true}
curl https://<URL>/health

# Debe responder {"stored":true}
curl -X POST https://<URL>/poc/locations \
  -H "content-type: application/json" \
  -H "x-poc-key: <POC_KEY>" \
  -H "x-device-label: prueba" \
  -d '{"location":[{"uuid":"demo","coords":{"latitude":40.0,"longitude":-3.0}}]}'

# Sin clave debe responder 401
curl -i -X POST https://<URL>/poc/locations -H "x-device-label: prueba" -d '{}'
```

Después, en Supabase → **Table Editor** → `poc_batches`, debe aparecer la fila de `prueba`.
Bórrala cuando lo hayas comprobado:

```sql
delete from public.poc_batches where device_label = 'prueba';
```
