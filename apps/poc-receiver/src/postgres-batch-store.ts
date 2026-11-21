import type { Sql } from "postgres";
import type { BatchStore, StoredBatch } from "./batch-store.js";

export class PostgresBatchStore implements BatchStore {
  constructor(private readonly sql: Sql) {}

  async save({ deviceLabel, payload }: StoredBatch): Promise<void> {
    await this.sql`
      insert into public.poc_batches (device_label, payload)
      values (${deviceLabel}, ${this.sql.json(payload as Parameters<Sql["json"]>[0])})`;
  }
}
