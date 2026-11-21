export interface StoredBatch {
  deviceLabel: string;
  payload: unknown;
}

export interface BatchStore {
  save(batch: StoredBatch): Promise<void>;
}
