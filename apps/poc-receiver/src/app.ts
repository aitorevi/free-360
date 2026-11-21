import { createHash, timingSafeEqual } from "node:crypto";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { BatchStore } from "./batch-store.js";

export interface AppOptions {
  store: BatchStore;
  pocKey: string;
  maxBodyBytes: number;
}

const DEVICE_LABEL = /^[a-z0-9-]{1,32}$/;

// Compara en tiempo constante (se hashean para igualar longitudes).
function sameSecret(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function error(code: string, message: string) {
  return { error: { code, message } };
}

export function createApp({ store, pocKey, maxBodyBytes }: AppOptions) {
  const app = new Hono();

  app.get("/health", (c) => c.json({ ok: true }));

  app.post(
    "/poc/locations",
    bodyLimit({
      maxSize: maxBodyBytes,
      onError: (c) => c.json(error("BATCH_TOO_LARGE", "Lote demasiado grande"), 413),
    }),
    async (c) => {
      const key = c.req.header("x-poc-key") ?? "";
      if (!sameSecret(key, pocKey)) {
        return c.json(error("UNAUTHENTICATED", "Clave incorrecta"), 401);
      }

      const deviceLabel = c.req.header("x-device-label") ?? "";
      if (!DEVICE_LABEL.test(deviceLabel)) {
        return c.json(error("VALIDATION_ERROR", "Etiqueta de dispositivo no válida"), 400);
      }

      let payload: unknown;
      try {
        payload = await c.req.json();
      } catch {
        return c.json(error("VALIDATION_ERROR", "El cuerpo no es JSON"), 400);
      }

      await store.save({ deviceLabel, payload });
      return c.json({ stored: true });
    },
  );

  return app;
}
