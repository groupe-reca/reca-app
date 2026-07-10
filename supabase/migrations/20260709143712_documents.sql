-- documents (doc 04 "documents"): centralizes contracts/photos/PDFs/attachments.
-- Doc 04 gives no column list, so a polymorphic design is used: entity_type +
-- entity_id identify the owning row, storage_path points into Supabase Storage.
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in (
      'client', 'contract', 'invoice', 'lead', 'quote',
      'employee', 'equipment', 'route', 'intervention_log'
    )),
  entity_id uuid not null,
  nom text not null,
  type text,
  storage_path text not null,
  taille_octets bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_documents_entity on public.documents (entity_type, entity_id);

alter table public.documents enable row level security;

create trigger trg_documents_audit
  before insert or update on public.documents
  for each row execute function set_audit_columns();
