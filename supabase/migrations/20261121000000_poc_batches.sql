-- Fase 0 (desechable): lotes tal cual los envía Transistor, para medir.
-- Se elimina al cerrar el Hito 0.
create table if not exists public.poc_batches (
  id           bigint generated always as identity primary key,
  device_label text not null,
  received_at  timestamptz not null default now(),
  payload      jsonb not null
);

create index if not exists poc_batches_device_received_idx
  on public.poc_batches (device_label, received_at);

-- Denegado por defecto: RLS activado y forzado, sin políticas.
alter table public.poc_batches enable row level security;
alter table public.poc_batches force row level security;
