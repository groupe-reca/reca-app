-- payments (doc 04 "payments"). No ID-numbering convention specified for this
-- entity in doc 04's "Convention des identifiants" section, so no numero column.
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  facture_id uuid not null references public.invoices (id) on delete cascade,
  montant numeric(12, 2) not null,
  methode text,
  reference text,
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.payments enable row level security;

create trigger trg_payments_audit
  before insert or update on public.payments
  for each row execute function set_audit_columns();
