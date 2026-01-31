create table if not exists formio_forms (
  slug text primary key,
  schema jsonb not null,
  version text not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists formio_forms_history (
  id bigserial primary key,
  slug text not null,
  schema jsonb not null,
  version text not null,
  created_at timestamptz not null default now(),
  created_by text
);

create index if not exists formio_forms_history_slug_created
  on formio_forms_history (slug, created_at desc);
