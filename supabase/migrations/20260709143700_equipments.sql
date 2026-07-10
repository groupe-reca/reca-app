-- equipments (doc 04 "equipments"). Statuts per doc 04 "États > Équipement".
create sequence equipments_numero_seq;

create table public.equipments (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  nom text not null,
  categorie text,
  marque text,
  modele text,
  annee integer,
  plaque text,
  numero_serie text,
  statut text not null default 'disponible'
    check (statut in ('disponible', 'en_operation', 'entretien', 'brise')),
  entretien text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.equipments enable row level security;

create or replace function set_numero_equipment()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    new.numero := 'EQ-' || lpad(nextval('equipments_numero_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

create trigger trg_equipments_numero
  before insert on public.equipments
  for each row execute function set_numero_equipment();

create trigger trg_equipments_audit
  before insert or update on public.equipments
  for each row execute function set_audit_columns();
