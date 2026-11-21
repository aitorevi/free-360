// Punto de entrada para Vercel. Configuración por variables de entorno
// (definidas en el panel de Vercel, nunca en el repo):
//   POC_KEY       clave compartida que envían los móviles en X-PoC-Key
//   DATABASE_URL  conexión al pooler de Supabase (modo transacción)
import postgres from "postgres";
import { createApp } from "./app.js";
import { PostgresBatchStore } from "./postgres-batch-store.js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

const sql = postgres(requireEnv("DATABASE_URL"), { max: 1, prepare: false });

const app = createApp({
  store: new PostgresBatchStore(sql),
  pocKey: requireEnv("POC_KEY"),
  maxBodyBytes: 1024 * 1024,
});

export default app;
