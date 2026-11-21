import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import type { BatchStore, StoredBatch } from "../src/batch-store.js";

class InMemoryBatchStore implements BatchStore {
  readonly batches: StoredBatch[] = [];
  async save(batch: StoredBatch): Promise<void> {
    this.batches.push(batch);
  }
}

const POC_KEY = "clave-de-prueba";
const validBatch = { location: [{ uuid: "a", coords: { latitude: 1, longitude: 2 } }] };

function post(app: ReturnType<typeof createApp>, body: string, headers: Record<string, string>) {
  return app.request("/poc/locations", {
    method: "POST",
    body,
    headers: { "content-type": "application/json", ...headers },
  });
}

describe("receptor PoC", () => {
  let store: InMemoryBatchStore;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    store = new InMemoryBatchStore();
    app = createApp({ store, pocKey: POC_KEY, maxBodyBytes: 1024 });
  });

  it("responde a /health sin clave", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
  });

  it("rechaza un lote sin clave", async () => {
    const res = await post(app, JSON.stringify(validBatch), { "x-device-label": "iphone-12" });
    expect(res.status).toBe(401);
    expect(store.batches).toHaveLength(0);
  });

  it("rechaza un lote con la clave incorrecta", async () => {
    const res = await post(app, JSON.stringify(validBatch), {
      "x-poc-key": "otra",
      "x-device-label": "iphone-12",
    });
    expect(res.status).toBe(401);
    expect(store.batches).toHaveLength(0);
  });

  it("rechaza un lote sin etiqueta de dispositivo válida", async () => {
    const res = await post(app, JSON.stringify(validBatch), {
      "x-poc-key": POC_KEY,
      "x-device-label": "iPhone de Ana!",
    });
    expect(res.status).toBe(400);
    expect(store.batches).toHaveLength(0);
  });

  it("rechaza un cuerpo que no es JSON", async () => {
    const res = await post(app, "esto no es json", {
      "x-poc-key": POC_KEY,
      "x-device-label": "iphone-12",
    });
    expect(res.status).toBe(400);
    expect(store.batches).toHaveLength(0);
  });

  it("rechaza un cuerpo demasiado grande", async () => {
    const big = JSON.stringify({ relleno: "x".repeat(2048) });
    const res = await post(app, big, { "x-poc-key": POC_KEY, "x-device-label": "iphone-12" });
    expect(res.status).toBe(413);
    expect(store.batches).toHaveLength(0);
  });

  it("guarda tal cual un lote válido", async () => {
    const res = await post(app, JSON.stringify(validBatch), {
      "x-poc-key": POC_KEY,
      "x-device-label": "oneplus-nord4",
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ stored: true });
    expect(store.batches).toEqual([{ deviceLabel: "oneplus-nord4", payload: validBatch }]);
  });
});
