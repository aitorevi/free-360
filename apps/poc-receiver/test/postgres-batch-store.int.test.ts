import { readFileSync } from "node:fs";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PostgresBatchStore } from "../src/postgres-batch-store.js";

// Conexión por variables PG* (PGHOST, PGUSER, PGPASSWORD, ...): nada de URLs con contraseña.
const sql = postgres({ max: 1, prepare: false, onnotice: () => {} });

const migration = readFileSync(
  new URL("../../../supabase/migrations/20261121000000_poc_batches.sql", import.meta.url),
  "utf8",
);

describe("PostgresBatchStore", () => {
  beforeAll(async () => {
    await sql`drop table if exists public.poc_batches`;
    await sql.unsafe(migration);
  });

  afterAll(async () => {
    await sql.end();
  });

  it("guarda el lote con su etiqueta y el JSON intacto", async () => {
    const store = new PostgresBatchStore(sql);
    const payload = { location: [{ uuid: "a", coords: { latitude: 1.5, longitude: -2.25 } }] };

    await store.save({ deviceLabel: "iphone-13", payload });

    const rows = await sql`select device_label, payload, received_at from public.poc_batches`;
    expect(rows).toHaveLength(1);
    expect(rows[0]?.["device_label"]).toBe("iphone-13");
    expect(rows[0]?.["payload"]).toEqual(payload);
    expect(rows[0]?.["received_at"]).toBeInstanceOf(Date);
  });

  it("la tabla tiene RLS activado y forzado", async () => {
    const [row] = await sql`
      select relrowsecurity, relforcerowsecurity
      from pg_class where oid = 'public.poc_batches'::regclass`;
    expect(row).toEqual({ relrowsecurity: true, relforcerowsecurity: true });
  });
});
